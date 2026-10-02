"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  created_at: string;
};

type Conversation = {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
};

export default function Home() {
  const supabase = createClient();

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] =
    useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [sendingText, setSendingText] = useState("");
  const [loadingConversations, setLoadingConversations] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [error, setError] = useState("");

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, sending]);

  async function loadConversations() {
    setLoadingConversations(true);

    try {
      const response = await fetch("/api/conversations");
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to load conversations.");
        return;
      }

      const loaded = data.conversations as Conversation[];
      setConversations(loaded);

      if (loaded.length > 0) {
        await loadMessages(loaded[0].id);
      }
    } catch {
      setError("Failed to load conversations.");
    } finally {
      setLoadingConversations(false);
    }
  }

  async function loadMessages(conversationId: string) {
    setActiveConversationId(conversationId);
    setLoadingMessages(true);
    setMessages([]);
    setSidebarOpen(false);
    setError("");

    try {
      const response = await fetch(
        `/api/conversations/${conversationId}/messages`
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to load messages.");
        return;
      }

      setMessages(data.messages);
    } catch {
      setError("Failed to load messages.");
    } finally {
      setLoadingMessages(false);
    }
  }

  async function createConversation() {
    try {
      const response = await fetch("/api/conversations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: "New chat",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to create conversation.");
        return null;
      }

      const conversation = data.conversation as Conversation;

      setConversations((current) => [conversation, ...current]);
      setActiveConversationId(conversation.id);
      setMessages([]);
      setError("");
      setSidebarOpen(false);

      return conversation;
    } catch {
      setError("Failed to create conversation.");
      return null;
    }
  }

  async function saveMessage(
    conversationId: string,
    role: "user" | "assistant",
    content: string
  ) {
    const response = await fetch(
      `/api/conversations/${conversationId}/messages`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          role,
          content,
        }),
      }
    );

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || "Failed to save message.");
    }
  }

  async function sendMessage(event?: FormEvent) {
    event?.preventDefault();

    const text = input.trim();

    if (!text || sending) return;

    setError("");
    setSending(true);
    setSendingText(text);
    setInput("");

    let conversationId = activeConversationId;

    if (!conversationId) {
      const conversation = await createConversation();

      if (!conversation) {
        setSending(false);
        setSendingText("");
        return;
      }

      conversationId = conversation.id;
    }

    const previousMessages = messages;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: text,
      created_at: new Date().toISOString(),
    };

    setMessages((current) => [...current, userMessage]);

    try {
      await saveMessage(conversationId, "user", text);

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [
            ...previousMessages.map((message) => ({
              role: message.role,
              content: message.content,
            })),
            {
              role: "user",
              content: text,
            },
          ],
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to get a response from Rikol."
        );
      }

      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: data.text,
        created_at: new Date().toISOString(),
      };

      setMessages((current) => [...current, assistantMessage]);

      await saveMessage(
        conversationId,
        "assistant",
        data.text
      );

      if (previousMessages.length === 0) {
        const title =
          text.length > 42 ? `${text.slice(0, 42)}...` : text;

        const titleResponse = await fetch(
          `/api/conversations/${conversationId}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              title,
            }),
          }
        );

        if (titleResponse.ok) {
          const titleData = await titleResponse.json();

          setConversations((current) =>
            current.map((conversation) =>
              conversation.id === conversationId
                ? titleData.conversation
                : conversation
            )
          );
        }
      } else {
        setConversations((current) =>
          current.map((conversation) =>
            conversation.id === conversationId
              ? {
                  ...conversation,
                  updated_at: new Date().toISOString(),
                }
              : conversation
          )
        );
      }
    } catch (sendError) {
      console.error(sendError);

      setError(
        sendError instanceof Error
          ? sendError.message
          : "Something went wrong."
      );
    } finally {
      setSending(false);

      window.setTimeout(() => {
        setSendingText("");
      }, 100);
    }
  }

  async function signOut() {
    await supabase.auth.signOut();
    window.location.href = "/auth/login";
  }

  const activeConversation = conversations.find(
    (conversation) =>
      conversation.id === activeConversationId
  );

  return (
    <main className="rikol-app flex h-screen overflow-hidden bg-black text-white">
      {/* Mobile backdrop */}
      <button
        aria-label="Close sidebar"
        onClick={() => setSidebarOpen(false)}
        className={`fixed inset-0 z-40 bg-black/70 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
          sidebarOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
      />

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-3 left-3 z-50 flex w-[276px] flex-col overflow-hidden rounded-[30px] border border-white/[0.10] bg-[#080808] p-3 shadow-[0_20px_70px_rgba(0,0,0,0.55)] transition-all duration-300 ease-out lg:static lg:my-3 lg:ml-3 lg:translate-x-0 ${
          sidebarOpen
            ? "translate-x-0 opacity-100"
            : "-translate-x-[110%] opacity-0 lg:opacity-100"
        }`}
      >
        {/* Brand */}
        <div className="flex items-center justify-between px-2 py-2">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-[15px] bg-white font-bold text-black">
              R
            </div>

            <div>
              <div className="text-[15px] font-semibold tracking-tight">
                Rikol
              </div>
              <div className="text-[10px] text-white/35">
                AI that remembers you
              </div>
            </div>
          </div>

          <button
            onClick={() => setSidebarOpen(false)}
            className="rounded-[14px] px-2.5 py-2 text-white/40 transition hover:bg-white/[0.07] hover:text-white lg:hidden"
          >
            ×
          </button>
        </div>

        {/* New chat */}
        <button
          onClick={createConversation}
          className="group mt-5 flex items-center py-2 gap-3 rounded-[17px] border border-white/[0.12] bg-white text-sm font-medium text-black transition-all duration-200 hover:bg-white/90 active:scale-[0.98]"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-[11px] bg-black text-lg leading-none text-white">
            +
          </span>
          New chat
        </button>

        {/* Conversations */}
        <div className="mt-7 min-h-0 flex-1 overflow-y-auto pr-1">
          <div className="px-2 text-[10px] font-bold uppercase tracking-[0.16em] text-white/30">
            Your chats
          </div>

          <div className="mt-2 space-y-1.5">
            {loadingConversations ? (
              <div className="px-3 py-3 text-sm text-white/35">
                Loading chats...
              </div>
            ) : conversations.length === 0 ? (
              <div className="px-3 py-3 text-sm leading-6 text-white/30">
                Your conversations will appear here.
              </div>
            ) : (
              conversations.map((conversation) => {
                const active =
                  conversation.id === activeConversationId;

                return (
                  <button
                    key={conversation.id}
                    onClick={() =>
                      loadMessages(conversation.id)
                    }
                    className={`group relative flex w-full items-center overflow-hidden rounded-[17px] px-3.5 py-2 text-left text-sm transition-all duration-200 ${
                      active
                        ? "bg-white text-black shadow-[0_4px_20px_rgba(255,255,255,0.08)]"
                        : "text-white/50 hover:bg-white/[0.07] hover:text-white"
                    }`}
                  >
                    <span className="truncate">
                      {conversation.title}
                    </span>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Account */}
        <button
          onClick={signOut}
          className="mt-3 flex items-center rounded-[17px] border border-transparent px-3.5 text-sm text-white/40 transition-all duration-200 hover:border-white/[0.08] hover:bg-white/[0.05] hover:text-white"
        >
          Sign out
        </button>
      </aside>

      {/* Main */}
      <section className="flex min-w-0 flex-1 flex-col">
        {/* Header */}
        <header className="flex h-[68px] shrink-0 items-center justify-between border-b border-white/[0.08] px-4 sm:px-7">
          <div className="flex min-w-0 items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="rounded-[15px] border border-white/[0.10] bg-white/[0.04] px-3 py-2 text-white/70 transition hover:bg-white/[0.08] hover:text-white lg:hidden"
            >
              ☰
            </button>

            <div className="min-w-0">
              <div className="truncate text-sm font-semibold">
                {activeConversation?.title || "New chat"}
              </div>
              <div className="mt-0.5 text-[10px] text-white/30">
                Personal conversation
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/[0.07] px-3 py-1 text-[11px] font-medium text-emerald-300 sm:flex">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
              Memory active
            </div>

            <button
              onClick={createConversation}
              className="rounded-[15px] border border-white/[0.10] bg-white/[0.04] px-3.5 py-1.5 text-xs font-medium text-white/65 transition hover:bg-white/[0.09] hover:text-white"
            >
              New chat
            </button>
          </div>
        </header>

        {/* Messages */}
        <div className="min-h-0 flex-1 overflow-y-auto">
          <div className="mx-auto flex min-h-full w-full max-w-3xl flex-col px-4 py-8 sm:px-6">
            {loadingMessages ? (
              <div className="flex flex-1 items-center justify-center py-20 text-sm text-white/30">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-white/50" />
                  Loading conversation
                </div>
              </div>
            ) : messages.length === 0 ? (
              <div className="flex min-h-[calc(100vh-230px)] flex-col items-center justify-center text-center">
                <div className="relative mb-6">
                  <div className="absolute inset-0 rounded-[28px] bg-white/20 blur-2xl" />

                  <div className="relative flex h-16 w-16 items-center justify-center rounded-[24px] bg-white text-xl font-black text-black shadow-[0_10px_50px_rgba(255,255,255,0.12)]">
                    R
                  </div>
                </div>

                <h1 className="text-3xl font-bold tracking-[-0.04em] sm:text-4xl">
                  How can I help?
                </h1>

                <p className="mt-3 max-w-md text-sm leading-6 text-white/40">
                  I&apos;m Rikol. Tell me about yourself,
                  your work, or anything you&apos;d like me
                  to remember.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-5">
                {messages.map((message, index) => (
                  <div
                    key={message.id}
                    className={`flex animate-[messageIn_300ms_ease-out] ${
                      message.role === "user"
                        ? "justify-end"
                        : "justify-start"
                    }`}
                    style={{
                      animationDelay: `${Math.min(
                        index * 20,
                        120
                      )}ms`,
                    }}
                  >
                    {message.role === "user" ? (
                      <div className="message-user relative max-w-[82%] rounded-[30px] rounded-br-[9px] border border-white/[0.08] bg-[#292929] px-5 py-3 text-[15px] leading-6 text-white shadow-[0_4px_18px_rgba(0,0,0,0.25)] sm:max-w-[75%]">
                        {message.content}
                      </div>
                    ) : (
                      <div className="max-w-[88%] px-1 py-2 text-[15px] leading-7 text-white/90 sm:max-w-[82%]">
                        {message.content}
                      </div>
                    )}
                  </div>
                ))}

                {sending && (
                  <div className="flex animate-[messageIn_250ms_ease-out] justify-start">
                    <div className="rounded-[25px] border border-white/[0.07] bg-[#111111] px-5 py-4">
                      <div className="flex items-center gap-1.5">
                        <span className="h-2 w-2 animate-bounce rounded-full bg-white/45 [animation-delay:-0.3s]" />
                        <span className="h-2 w-2 animate-bounce rounded-full bg-white/45 [animation-delay:-0.15s]" />
                        <span className="h-2 w-2 animate-bounce rounded-full bg-white/45" />
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            )}
          </div>
        </div>

        {/* Composer */}
        <div className="shrink-0 px-4 pb-5 pt-2 sm:px-6">
          <div className="mx-auto max-w-3xl">
            {error && (
              <div className="mb-3 animate-[messageIn_200ms_ease-out] rounded-[19px] border border-red-400/20 bg-red-500/[0.08] px-4 py-3 text-sm text-red-200">
                {error}
              </div>
            )}

            <form
              onSubmit={sendMessage}
              className="group relative flex items-end rounded-[30px] border border-white/[0.13] bg-[#0d0d0d] p-1.5 shadow-[0_10px_50px_rgba(0,0,0,0.35)] transition-all duration-200 focus-within:border-white/[0.28] focus-within:bg-[#111111] focus-within:shadow-[0_10px_60px_rgba(0,0,0,0.45)]"
            >
              <textarea
                value={sending ? sendingText : input}
                onChange={(event) =>
                  setInput(event.target.value)
                }
                onKeyDown={(event) => {
                  if (
                    event.key === "Enter" &&
                    !event.shiftKey
                  ) {
                    event.preventDefault();
                    sendMessage();
                  }
                }}
                placeholder="Message Rikol..."
                rows={1}
                disabled={sending}
                className="max-h-40 min-h-[44px] flex-1 resize-none bg-transparent px-4 py-3 text-[15px] leading-6 text-white outline-none placeholder:text-white/30 disabled:opacity-60"
              />

              <button
                type="submit"
                disabled={!input.trim() || sending}
                className="mb-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-[17px] bg-white text-black transition-all duration-200 hover:scale-[1.03] hover:bg-white/90 active:scale-95 disabled:cursor-not-allowed disabled:bg-white/[0.08] disabled:text-white/20 disabled:hover:scale-100"
                aria-label="Send message"
              >
                <svg
                  width="17"
                  height="17"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 19V5" />
                  <path d="M6 11l6-6 6 6" />
                </svg>
              </button>
            </form>

            <p className="mt-2 text-center text-[10px] text-white/25">
              Rikol remembers useful details across conversations.
            </p>
          </div>
        </div>
      </section>

      {/* Flying user message */}
      {sendingText && (
        <div className="pointer-events-none fixed bottom-[92px] left-1/2 z-[100] w-[min(88vw,560px)] -translate-x-1/2">
          <div className="animate-[flyMessage_420ms_cubic-bezier(.22,1,.36,1)_forwards] rounded-[30px] rounded-br-[9px] border border-white/[0.08] bg-[#292929] px-5 py-3 text-[15px] leading-6 text-white shadow-[0_15px_50px_rgba(0,0,0,0.45)]">
            {sendingText}
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes messageIn {
          from {
            opacity: 0;
            transform: translateY(10px) scale(0.985);
          }

          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes flyMessage {
          0% {
            opacity: 0;
            transform: translateY(35px) scale(0.96);
          }

          35% {
            opacity: 1;
          }

          100% {
            opacity: 0;
            transform: translateY(-70px) scale(0.98);
          }
        }

        * {
          scrollbar-width: thin;
          scrollbar-color: rgba(255, 255, 255, 0.12) transparent;
        }

        ::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }

        ::-webkit-scrollbar-track {
          background: transparent;
        }

        ::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.12);
          border-radius: 999px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }

        textarea::-webkit-scrollbar {
          width: 4px;
        }
      `}</style>
    </main>
  );
}
