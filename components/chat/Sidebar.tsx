"use client";

import { useEffect, useRef, useState } from "react";

import ProfileMenu from "@/components/account/ProfileMenu";
import type { Conversation } from "@/components/chat/types";

type SidebarProps = {
  conversations: Conversation[];
  activeConversationId: string | null;
  loadingConversations: boolean;
  sidebarOpen: boolean;
  userEmail: string;
  onClose: () => void;
  onNewChat: () => void;
  onSelectConversation: (id: string) => void;
  onRenameConversation: (id: string, title: string) => Promise<void>;
  onTogglePin: (id: string) => Promise<void>;
  onArchiveConversation: (id: string) => Promise<void>;
  onDeleteConversation: (id: string) => Promise<void>;
  onShareConversation: (id: string) => Promise<void>;
  onSignOut: () => void;
};

function RikolMark({
  className = "",
}: {
  className?: string;
}) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 64 68"
      fill="none"
      className={className}
    >
      <path
        d="M37 8H22A14 14 0 0 0 8 22V36A14 14 0 0 0 22 50H28V59L38 50H42A14 14 0 0 0 56 36V28"
        stroke="currentColor"
        strokeWidth="4.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle
        cx="49.5"
        cy="14.5"
        r="6.5"
        fill="#FFD84A"
      />
    </svg>
  );
}

function PinIcon({
  filled = false,
}: {
  filled?: boolean;
}) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m15 4 5 5" />
      <path d="M18 2 22 6" />
      <path d="m14 6-8.5 8.5" />
      <path d="m5 11 8 8" />
      <path d="M3 21l4.5-4.5" />
      <path d="m14 6 4 4" />
    </svg>
  );
}

function MoreIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <circle cx="5" cy="12" r="1.7" />
      <circle cx="12" cy="12" r="1.7" />
      <circle cx="19" cy="12" r="1.7" />
    </svg>
  );
}

function ShareIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="18" cy="5" r="2.5" />
      <circle cx="6" cy="12" r="2.5" />
      <circle cx="18" cy="19" r="2.5" />
      <path d="m8.2 10.8 7.6-4.5" />
      <path d="m8.2 13.2 7.6 4.5" />
    </svg>
  );
}

function RenameIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z" />
    </svg>
  );
}

function ArchiveIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4 7h16" />
      <path d="M5 7v12h14V7" />
      <path d="M3 4h18v3H3z" />
      <path d="M9 11h6" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4 7h16" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
      <path d="M6 7l1 13h10l1-13" />
      <path d="M9 7V4h6v3" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m5 12 4 4L19 6" />
    </svg>
  );
}

export default function Sidebar({
  conversations,
  activeConversationId,
  loadingConversations,
  sidebarOpen,
  userEmail,
  onClose,
  onNewChat,
  onSelectConversation,
  onRenameConversation,
  onTogglePin,
  onArchiveConversation,
  onDeleteConversation,
  onShareConversation,
  onSignOut,
}: SidebarProps) {
  const [openMenuId, setOpenMenuId] = useState<string | null>(
    null
  );
  const [editingId, setEditingId] = useState<string | null>(
    null
  );
  const [renameValue, setRenameValue] = useState("");
  const [savingRename, setSavingRename] = useState(false);

  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setOpenMenuId(null);
      }
    }

    document.addEventListener(
      "mousedown",
      handlePointerDown
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handlePointerDown
      );
    };
  }, []);

  function startRename(conversation: Conversation) {
    setOpenMenuId(null);
    setEditingId(conversation.id);
    setRenameValue(conversation.title);
  }

  function cancelRename() {
    setEditingId(null);
    setRenameValue("");
  }

  async function saveRename(conversation: Conversation) {
    const title = renameValue.trim();

    if (!title || savingRename) {
      return;
    }

    if (title === conversation.title) {
      cancelRename();
      return;
    }

    setSavingRename(true);

    try {
      await onRenameConversation(
        conversation.id,
        title
      );

      cancelRename();
    } catch (error) {
      console.error("Rename conversation error:", error);
    } finally {
      setSavingRename(false);
    }
  }

  function getVisibleConversations() {
    return conversations.filter(
      (conversation) => !conversation.archived
    );
  }

  const visibleConversations = getVisibleConversations();

  const pinnedConversations = visibleConversations.filter(
    (conversation) => conversation.pinned
  );

  const recentConversations = visibleConversations.filter(
    (conversation) => !conversation.pinned
  );

  function ConversationRow({
    conversation,
  }: {
    conversation: Conversation;
  }) {
    const active =
      conversation.id === activeConversationId;

    const editing = editingId === conversation.id;
    const menuOpen = openMenuId === conversation.id;

    return (
      <div
        className={`group relative flex items-center rounded-[13px] transition ${
          active
            ? "bg-[#2B1F48] text-[#F2F0F9]"
            : "text-[#A9A3C2] hover:bg-[#2B1F48]/65 hover:text-[#F2F0F9]"
        }`}
      >
        {editing ? (
          <div className="flex min-w-0 flex-1 items-center gap-2 px-2.5 py-1.5">
            <span
              className={`h-1.5 w-1.5 shrink-0 rounded-full ${
                active
                  ? "bg-[#FFD84A]"
                  : "bg-[#5A5472]"
              }`}
            />

            <input
              autoFocus
              value={renameValue}
              onChange={(event) =>
                setRenameValue(event.target.value)
              }
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  void saveRename(conversation);
                }

                if (event.key === "Escape") {
                  event.preventDefault();
                  cancelRename();
                }
              }}
              disabled={savingRename}
              maxLength={100}
              className="min-w-0 flex-1 rounded-[8px] border border-[#B9A8FF]/50 bg-[#171028] px-2 py-1 font-['Bricolage_Grotesque'] text-[12px] text-[#F2F0F9] outline-none placeholder:text-[#6D6784]"
            />

            <button
              type="button"
              onClick={() =>
                void saveRename(conversation)
              }
              disabled={savingRename}
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[8px] text-[#B9A8FF] transition hover:bg-[#3A2C5B] hover:text-[#F2F0F9] disabled:opacity-50"
              aria-label="Save rename"
            >
              <CheckIcon />
            </button>
          </div>
        ) : (
          <>
            <button
              type="button"
              onClick={() => {
                onSelectConversation(conversation.id);
                onClose();
              }}
              className="flex min-w-0 flex-1 items-center gap-3 px-3 py-2.5 pr-[72px] text-left"
            >
              <span
                className={`h-1.5 w-1.5 shrink-0 rounded-full transition ${
                  active
                    ? "bg-[#FFD84A]"
                    : "bg-[#5A5472] group-hover:bg-[#B9A8FF]"
                }`}
              />

              <span className="min-w-0 flex-1 truncate font-['Bricolage_Grotesque'] text-[12px]">
                {conversation.title}
              </span>
            </button>

            <div
              className={`absolute right-1.5 top-1/2 flex -translate-y-1/2 items-center gap-0.5 rounded-[9px] bg-[#2B1F48] p-0.5 shadow-lg shadow-[#171028]/20 transition ${
                menuOpen
                  ? "opacity-100"
                  : "opacity-0 group-hover:opacity-100"
              }`}
            >
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  void onTogglePin(conversation.id);
                }}
                className={`flex h-7 w-7 items-center justify-center rounded-[7px] transition ${
                  conversation.pinned
                    ? "text-[#FFD84A] hover:bg-[#3A2C5B]"
                    : "text-[#A9A3C2] hover:bg-[#3A2C5B] hover:text-[#F2F0F9]"
                }`}
                aria-label={
                  conversation.pinned
                    ? "Unpin conversation"
                    : "Pin conversation"
                }
                title={
                  conversation.pinned
                    ? "Unpin"
                    : "Pin"
                }
              >
                <PinIcon
                  filled={conversation.pinned}
                />
              </button>

              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  setOpenMenuId((current) =>
                    current === conversation.id
                      ? null
                      : conversation.id
                  );
                }}
                className={`flex h-7 w-7 items-center justify-center rounded-[7px] transition ${
                  menuOpen
                    ? "bg-[#3A2C5B] text-[#F2F0F9]"
                    : "text-[#A9A3C2] hover:bg-[#3A2C5B] hover:text-[#F2F0F9]"
                }`}
                aria-label="Conversation options"
                aria-expanded={menuOpen}
              >
                <MoreIcon />
              </button>
            </div>

            {menuOpen && (
              <div
                ref={menuRef}
                className="absolute right-1 top-[calc(100%+6px)] z-[70] w-[178px] overflow-hidden rounded-[13px] border border-[#40345C] bg-[#241A3C] p-1.5 shadow-2xl shadow-[#171028]/70"
                onClick={(event) =>
                  event.stopPropagation()
                }
              >
                <button
                  type="button"
                  onClick={() =>
                    void onShareConversation(
                      conversation.id
                    ).then(() => setOpenMenuId(null))
                  }
                  className="flex w-full items-center gap-2.5 rounded-[9px] px-2.5 py-2 text-left font-['Bricolage_Grotesque'] text-[11px] text-[#D8D3E8] transition hover:bg-[#33274D] hover:text-[#F2F0F9]"
                >
                  <ShareIcon />
                  <span>Share</span>
                </button>

                <button
                  type="button"
                  onClick={() => startRename(conversation)}
                  className="flex w-full items-center gap-2.5 rounded-[9px] px-2.5 py-2 text-left font-['Bricolage_Grotesque'] text-[11px] text-[#D8D3E8] transition hover:bg-[#33274D] hover:text-[#F2F0F9]"
                >
                  <RenameIcon />
                  <span>Rename</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setOpenMenuId(null);
                    void onTogglePin(conversation.id);
                  }}
                  className="flex w-full items-center gap-2.5 rounded-[9px] px-2.5 py-2 text-left font-['Bricolage_Grotesque'] text-[11px] text-[#D8D3E8] transition hover:bg-[#33274D] hover:text-[#F2F0F9]"
                >
                  <PinIcon
                    filled={conversation.pinned}
                  />
                  <span>
                    {conversation.pinned
                      ? "Unpin chat"
                      : "Pin chat"}
                  </span>
                </button>

                <div className="my-1 border-t border-[#40345C]" />

                <button
                  type="button"
                  onClick={() => {
                    setOpenMenuId(null);
                    void onArchiveConversation(
                      conversation.id
                    );
                  }}
                  className="flex w-full items-center gap-2.5 rounded-[9px] px-2.5 py-2 text-left font-['Bricolage_Grotesque'] text-[11px] text-[#D8D3E8] transition hover:bg-[#33274D] hover:text-[#F2F0F9]"
                >
                  <ArchiveIcon />
                  <span>Archive</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setOpenMenuId(null);
                    void onDeleteConversation(
                      conversation.id
                    );
                  }}
                  className="flex w-full items-center gap-2.5 rounded-[9px] px-2.5 py-2 text-left font-['Bricolage_Grotesque'] text-[11px] text-[#FF9B9B] transition hover:bg-[#4A2938] hover:text-[#FFB8B8]"
                >
                  <TrashIcon />
                  <span>Delete</span>
                </button>
              </div>
            )}
          </>
        )}
      </div>
    );
  }

  return (
    <aside
      className={`fixed inset-y-3 left-3 z-50 flex w-[286px] flex-col overflow-visible rounded-[24px] border border-[#352A52] bg-[#1F1535] shadow-2xl shadow-[#171028]/60 transition-transform duration-300 lg:static lg:my-3 lg:ml-3 lg:h-[calc(100vh-24px)] lg:translate-x-0 ${
        sidebarOpen
          ? "translate-x-0"
          : "-translate-x-[calc(100%+24px)]"
      }`}
    >
      {/* Brand */}
      <div className="flex items-center justify-between px-5 pb-5 pt-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-[13px] bg-[#2B1F48] text-[#F2F0F9]">
            <RikolMark className="h-[29px] w-[29px]" />
          </div>

          <div>
            <p className="font-['Bricolage_Grotesque'] text-[17px] font-bold tracking-[-0.035em] text-[#F2F0F9]">
              rikol
            </p>

            <p className="font-['Bricolage_Grotesque'] text-[10px] leading-4 text-[#A9A3C2]">
              An AI that remembers you.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="flex h-8 w-8 items-center justify-center rounded-[10px] text-[#A9A3C2] transition hover:bg-[#2B1F48] hover:text-[#F2F0F9] lg:hidden"
          aria-label="Close sidebar"
        >
          <svg
            width="17"
            height="17"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
          >
            <path d="M6 6l12 12" />
            <path d="M18 6 6 18" />
          </svg>
        </button>
      </div>

      {/* New chat */}
      <div className="px-4">
        <button
          type="button"
          onClick={onNewChat}
          className="group flex w-full items-center gap-3 rounded-[14px] border border-[#B9A8FF]/35 bg-[#B9A8FF] px-3.5 py-3 text-left transition hover:bg-[#C5B7FF]"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-[9px] bg-[#1F1535] text-[#F2F0F9]">
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M12 5v14" />
              <path d="M5 12h14" />
            </svg>
          </span>

          <span className="font-['Bricolage_Grotesque'] text-[13px] font-semibold tracking-[-0.01em] text-[#1F1535]">
            New chat
          </span>
        </button>
      </div>

      {/* Conversation history */}
      <div className="mt-7 flex min-h-0 flex-1 flex-col px-3">
        <div className="px-2 pb-2.5">
          <p className="font-['Bricolage_Grotesque'] text-[10px] font-semibold uppercase tracking-[0.14em] text-[#A9A3C2]">
            Your chats
          </p>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto pr-1">
          {loadingConversations ? (
            <div className="space-y-1.5 px-1">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="h-10 animate-pulse rounded-[13px] bg-[#2B1F48]"
                />
              ))}
            </div>
          ) : visibleConversations.length === 0 ? (
            <div className="mx-1 rounded-[13px] border border-dashed border-[#352A52] px-3 py-3">
              <p className="font-['Bricolage_Grotesque'] text-[12px] leading-5 text-[#A9A3C2]">
                Your conversations will appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {pinnedConversations.length > 0 && (
                <div>
                  <div className="px-2 pb-2">
                    <p className="font-['Bricolage_Grotesque'] text-[10px] font-semibold uppercase tracking-[0.14em] text-[#A9A3C2]">
                      Pinned
                    </p>
                  </div>

                  <div className="space-y-1">
                    {pinnedConversations.map(
                      (conversation) => (
                        <ConversationRow
                          key={conversation.id}
                          conversation={conversation}
                        />
                      )
                    )}
                  </div>
                </div>
              )}

              {recentConversations.length > 0 && (
                <div>
                  <div className="px-2 pb-2">
                    <p className="font-['Bricolage_Grotesque'] text-[10px] font-semibold uppercase tracking-[0.14em] text-[#A9A3C2]">
                      Recent
                    </p>
                  </div>

                  <div className="space-y-1">
                    {recentConversations.map(
                      (conversation) => (
                        <ConversationRow
                          key={conversation.id}
                          conversation={conversation}
                        />
                      )
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Account */}
      <div className="border-t border-[#352A52] p-3">
        <ProfileMenu
          email={userEmail}
          onSignOut={onSignOut}
        />
      </div>
    </aside>
  );
}
