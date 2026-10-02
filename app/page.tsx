"use client";

import {
  FormEvent,
  useEffect,
  useRef,
  useState,
} from "react";

import { createClient } from "@/lib/supabase/client";

import Sidebar from "@/components/chat/Sidebar";
import ChatHeader from "@/components/chat/ChatHeader";
import MessageList from "@/components/chat/MessageList";
import Composer from "@/components/chat/Composer";
import type {
  Conversation,
  Message,
} from "@/components/chat/types";

export default function Home() {
  const supabase = createClient();

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] =
    useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<Conversation | null>(null);
  const [sendingText, setSendingText] = useState("");
  const [sending, setSending] = useState(false);
  const [loadingConversations, setLoadingConversations] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [error, setError] = useState("");
  const [userEmail, setUserEmail] = useState("");

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    loadConversations();
    loadUser();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, sending]);

  async function loadUser() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    setUserEmail(user?.email ?? "");
  }

  async function loadConversations() {
    setLoadingConversations(true);
    setError("");

    try {
      const response = await fetch("/api/conversations");

      if (!response.ok) {
        throw new Error("Failed to load conversations.");
      }

      const data = await response.json();
      const loaded: Conversation[] = data.conversations ?? [];

      setConversations(loaded);

      const visibleConversations = loaded.filter(
        (conversation) => !conversation.archived
      );

      if (visibleConversations.length > 0) {
        await loadMessages(visibleConversations[0].id);
      }
    } catch (err) {
      console.error(err);
      setError("Could not load your conversations.");
    } finally {
      setLoadingConversations(false);
    }
  }

  async function loadMessages(conversationId: string) {
    setLoadingMessages(true);
    setError("");

    try {
      const response = await fetch(
        `/api/conversations/${conversationId}/messages`
      );

      if (!response.ok) {
        throw new Error("Failed to load messages.");
      }

      const data = await response.json();

      setActiveConversationId(conversationId);
      setMessages(data.messages ?? []);
    } catch (err) {
      console.error(err);
      setError("Could not load this conversation.");
    } finally {
      setLoadingMessages(false);
    }
  }

  async function createConversation() {
    const response = await fetch("/api/conversations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: "New chat",
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to create conversation.");
    }

    const data = await response.json();
    const conversation: Conversation = data.conversation;

    setConversations((current) => [conversation, ...current]);
    setActiveConversationId(conversation.id);
    setMessages([]);

    return conversation;
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
      throw new Error("Failed to save message.");
    }

    return response.json();
  }

  async function updateConversation(
    conversationId: string,
    changes: {
      title?: string;
      pinned?: boolean;
      archived?: boolean;
      share?: boolean;
    }
  ) {
    const response = await fetch(
      `/api/conversations/${conversationId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(changes),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.error || "Failed to update conversation."
      );
    }

    const conversation: Conversation = data.conversation;

    setConversations((current) =>
      current.map((item) =>
        item.id === conversationId ? conversation : item
      )
    );

    return conversation;
  }

  async function renameConversation(
    conversationId: string,
    title: string
  ) {
    await updateConversation(conversationId, { title });
  }

  async function togglePinConversation(
    conversationId: string
  ) {
    const conversation = conversations.find(
      (item) => item.id === conversationId
    );

    if (!conversation) {
      return;
    }

    try {
      await updateConversation(conversationId, {
        pinned: !conversation.pinned,
      });
    } catch (err) {
      console.error(err);
      setError(
        err instanceof Error
          ? err.message
          : "Could not update pin status."
      );
    }
  }

  async function archiveConversation(
    conversationId: string
  ) {
    try {
      await updateConversation(conversationId, {
        archived: true,
      });

      if (activeConversationId === conversationId) {
        const remaining = conversations.filter(
          (conversation) =>
            conversation.id !== conversationId &&
            !conversation.archived
        );

        if (remaining.length > 0) {
          await loadMessages(remaining[0].id);
        } else {
          setActiveConversationId(null);
          setMessages([]);
        }
      }
    } catch (err) {
      console.error(err);
      setError(
        err instanceof Error
          ? err.message
          : "Could not archive conversation."
      );
    }
  }

  async function deleteConversation(
    conversationId: string
  ) {
    const conversation = conversations.find(
      (item) => item.id === conversationId
    );

    if (!conversation) {
      return;
    }

    setDeleteTarget(conversation);
  }

  async function confirmDeleteConversation() {
    if (!deleteTarget) {
      return;
    }

    const conversationId = deleteTarget.id;

    setDeleteTarget(null);

    try {
      const response = await fetch(
        `/api/conversations/${conversationId}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to delete conversation."
        );
      }

      const remaining = conversations.filter(
        (item) => item.id !== conversationId
      );

      setConversations(remaining);

      if (activeConversationId === conversationId) {
        const nextConversation = remaining.find(
          (item) => !item.archived
        );

        if (nextConversation) {
          await loadMessages(nextConversation.id);
        } else {
          setActiveConversationId(null);
          setMessages([]);
        }
      }
    } catch (err) {
      console.error(err);
      setError(
        err instanceof Error
          ? err.message
          : "Could not delete conversation."
      );
    }
  }

  async function shareConversation(
    conversationId: string
  ) {
    try {
      const conversation = await updateConversation(
        conversationId,
        { share: true }
      );

      if (!conversation.share_token) {
        throw new Error("Could not create a share link.");
      }

      const shareUrl = `${window.location.origin}/share/${conversation.share_token}`;

      await navigator.clipboard.writeText(shareUrl);

      setError("");
      window.alert("Share link copied to clipboard.");
    } catch (err) {
      console.error(err);
      setError(
        err instanceof Error
          ? err.message
          : "Could not create share link."
      );
    }
  }

  async function sendMessage(
    event?: FormEvent<HTMLFormElement>
  ) {
    event?.preventDefault();

    const text = input.trim();

    if (!text || sending) {
      return;
    }

    setError("");
    setSending(true);
    setSendingText("Rikol is thinking...");
    setInput("");

    try {
      let conversationId = activeConversationId;

      if (!conversationId) {
        const conversation = await createConversation();
        conversationId = conversation.id;
      }

      const userMessage: Message = {
        id: `user-${Date.now()}`,
        role: "user",
        content: text,
      };

      const conversationMessages = [...messages, userMessage];

      setMessages(conversationMessages);

      await saveMessage(conversationId, "user", text);

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: conversationMessages.map((message) => ({
            role: message.role,
            content: message.content,
          })),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Rikol could not respond."
        );
      }

      const assistantText = data.text;

      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: assistantText,
      };

      setMessages((current) => [
        ...current,
        assistantMessage,
      ]);

      await saveMessage(
        conversationId,
        "assistant",
        assistantText
      );

      const conversation = conversations.find(
        (item) => item.id === conversationId
      );

      if (
        conversation &&
        conversation.title === "New chat"
      ) {
        const title =
          text.length > 42
            ? `${text.slice(0, 42)}...`
            : text;

        try {
          await updateConversation(conversationId, {
            title,
          });
        } catch (titleError) {
          console.error(
            "Conversation title update error:",
            titleError
          );
        }
      } else {
        setConversations((current) =>
          current.map((item) =>
            item.id === conversationId
              ? {
                  ...item,
                  updated_at: new Date().toISOString(),
                }
              : item
          )
        );
      }
    } catch (err) {
      console.error("Send message error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong."
      );

      setInput(text);
    } finally {
      setSending(false);
      setSendingText("");
    }
  }

  async function handleNewChat() {
    if (sending) {
      return;
    }

    setError("");
    setInput("");

    try {
      await createConversation();
    } catch (err) {
      console.error(err);
      setError("Could not create a new chat.");
    }

    setSidebarOpen(false);
  }

  async function signOut() {
    await supabase.auth.signOut();
    window.location.href = "/auth/login";
  }

  const activeConversation = conversations.find(
    (conversation) =>
      conversation.id === activeConversationId
  );

  const activeTitle =
    activeConversation?.title || "New chat";

  return (
    <main className="flex h-screen overflow-hidden bg-[#171028] text-[#F2F0F9]">
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-[#171028]/75 backdrop-blur-[3px] lg:hidden"
        />
      )}

      <Sidebar
        conversations={conversations}
        activeConversationId={activeConversationId}
        loadingConversations={loadingConversations}
        sidebarOpen={sidebarOpen}
        userEmail={userEmail}
        onClose={() => setSidebarOpen(false)}
        onNewChat={handleNewChat}
        onSelectConversation={loadMessages}
        onRenameConversation={renameConversation}
        onTogglePin={togglePinConversation}
        onArchiveConversation={archiveConversation}
        onDeleteConversation={deleteConversation}
        onShareConversation={shareConversation}
        onSignOut={signOut}
      />

      {deleteTarget && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-md"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setDeleteTarget(null);
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-dialog-title"
            className="w-full max-w-[420px] overflow-hidden rounded-[28px] border border-white/10 bg-[#211638] shadow-[0_24px_80px_rgba(0,0,0,0.45)]"
          >
            <div className="p-6 sm:p-7">
              <div className="mb-6 flex h-11 w-11 items-center justify-center rounded-2xl border border-red-400/15 bg-red-400/10 text-red-300">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 6h18" />
                  <path d="M8 6V4h8v2" />
                  <path d="M19 6l-1 14H6L5 6" />
                  <path d="M10 11v5" />
                  <path d="M14 11v5" />
                </svg>
              </div>

              <h2
                id="delete-dialog-title"
                className="text-xl font-semibold tracking-[-0.02em] text-white"
              >
                Delete conversation?
              </h2>

              <p className="mt-3 text-sm leading-6 text-white/55">
                Are you sure you want to delete{" "}
                <span className="font-medium text-white/80">
                  "{deleteTarget.title}"
                </span>
                ?
              </p>

              <p className="mt-1 text-sm leading-6 text-white/40">
                This will permanently delete the conversation and all of its
                messages. This action cannot be undone.
              </p>

              <div className="mt-7 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setDeleteTarget(null)}
                  className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-medium text-white/70 transition-all hover:border-white/15 hover:bg-white/[0.07] hover:text-white"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={confirmDeleteConversation}
                  className="rounded-xl border border-red-400/20 bg-red-500/15 px-4 py-2.5 text-sm font-semibold text-red-200 transition-all hover:border-red-400/30 hover:bg-red-500/25 active:scale-[0.98]"
                >
                  Delete
                </button>
              </div>
            </div>

            <div className="h-px bg-gradient-to-r from-transparent via-purple-400/20 to-transparent" />
          </div>
        </div>
      )}
      <section className="flex min-w-0 flex-1 flex-col bg-[#171028]">
        <ChatHeader
          title={activeTitle}
          onOpenSidebar={() => setSidebarOpen(true)}
          onNewChat={handleNewChat}
        />

        <MessageList
          messages={messages}
          loadingMessages={loadingMessages}
          sending={sending}
          messagesEndRef={messagesEndRef}
        />

        <Composer
          input={input}
          sending={sending}
          sendingText={sendingText}
          error={error}
          onInputChange={setInput}
          onSend={sendMessage}
        />
      </section>

      <style jsx global>{`
        @keyframes message-in {
          from {
            opacity: 0;
            transform: translateY(6px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-message-in {
          animation: message-in 0.24s ease-out both;
        }

        textarea {
          scrollbar-width: thin;
        }
      `}</style>
    </main>
  );
}



