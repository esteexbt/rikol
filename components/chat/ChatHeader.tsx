"use client";

type ChatHeaderProps = {
  title: string;
  onOpenSidebar: () => void;
  onNewChat: () => void;
};

export default function ChatHeader({
  title,
  onOpenSidebar,
  onNewChat,
}: ChatHeaderProps) {
  return (
    <header className="flex h-[72px] shrink-0 items-center justify-between border-b border-[#352A52] bg-[#171028] px-4 sm:px-6 lg:px-8">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={onOpenSidebar}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[11px] border border-[#352A52] bg-[#211739] text-[#A9A3C2] transition hover:border-[#B9A8FF]/50 hover:bg-[#2B1F48] hover:text-[#F2F0F9] lg:hidden"
          aria-label="Open sidebar"
        >
          <svg
            width="17"
            height="17"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
          >
            <path d="M4 6h16" />
            <path d="M4 12h16" />
            <path d="M4 18h16" />
          </svg>
        </button>

        <div className="min-w-0">
          <h1 className="truncate font-['Bricolage_Grotesque'] text-[14px] font-semibold tracking-[-0.015em] text-[#F2F0F9]">
            {title}
          </h1>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2.5">
        <div className="hidden items-center gap-2 rounded-full border border-[#FFD84A]/20 bg-[#FFD84A]/[0.07] px-3 py-1.5 sm:flex">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#FFD84A]/50" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#FFD84A]" />
          </span>

          <span className="font-['Bricolage_Grotesque'] text-[10px] font-medium text-[#FFD84A]">
            Memory active
          </span>
        </div>

        <button
          type="button"
          onClick={onNewChat}
          className="flex h-9 items-center gap-2 rounded-[11px] border border-[#352A52] bg-[#211739] px-3 font-['Bricolage_Grotesque'] text-[11px] font-medium text-[#A9A3C2] transition hover:border-[#B9A8FF]/40 hover:bg-[#2B1F48] hover:text-[#F2F0F9]"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.9"
          >
            <path d="M12 5v14" />
            <path d="M5 12h14" />
          </svg>

          <span className="hidden sm:inline">New chat</span>
        </button>
      </div>
    </header>
  );
}
