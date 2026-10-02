"use client";

import Link from "next/link";
import { useState } from "react";

type ProfileMenuProps = {
  email: string;
  onSignOut: () => void;
};

export default function ProfileMenu({
  email,
  onSignOut,
}: ProfileMenuProps) {
  const [open, setOpen] = useState(false);

  const initial = email?.charAt(0).toUpperCase() || "R";
  const displayName = email?.split("@")[0] || "Account";

  return (
    <div className="relative">
      {open && (
        <div className="absolute bottom-[calc(100%+10px)] left-0 z-50 w-full min-w-[250px] overflow-hidden rounded-[20px] border border-[#352A52] bg-[#211739] p-1.5 shadow-2xl shadow-[#171028]/70">
          <div className="border-b border-[#352A52] px-3.5 py-3">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#B9A8FF] text-sm font-bold text-[#1F1535]">
                {initial}
              </div>

              <div className="min-w-0">
                <p className="truncate text-[13px] font-semibold text-[#F2F0F9]">
                  {displayName}
                </p>
                <p className="truncate text-[11px] text-[#A9A3C2]">
                  {email}
                </p>
              </div>
            </div>
          </div>

          <div className="py-1.5">
            <Link
              href="/profile"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 rounded-[13px] px-3 py-2.5 text-[13px] text-[#A9A3C2] transition hover:bg-[#2B1F48] hover:text-[#F2F0F9]"
            >
              <svg
                width="17"
                height="17"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
              >
                <circle cx="12" cy="8" r="3.5" />
                <path d="M5 20c.8-3.5 3.1-5.5 7-5.5s6.2 2 7 5.5" />
              </svg>
              Profile
            </Link>

            <Link
              href="/settings"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 rounded-[13px] px-3 py-2.5 text-[13px] text-[#A9A3C2] transition hover:bg-[#2B1F48] hover:text-[#F2F0F9]"
            >
              <svg
                width="17"
                height="17"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
              >
                <path d="M12 3.5v2" />
                <path d="M12 18.5v2" />
                <path d="M3.5 12h2" />
                <path d="M18.5 12h2" />
                <path d="m5.99 5.99 1.42 1.42" />
                <path d="m16.59 16.59 1.42 1.42" />
                <path d="m18.01 5.99-1.42 1.42" />
                <path d="m7.41 16.59-1.42 1.42" />
                <circle cx="12" cy="12" r="4" />
              </svg>
              Settings
            </Link>

            <Link
              href="/memory"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 rounded-[13px] px-3 py-2.5 text-[13px] text-[#A9A3C2] transition hover:bg-[#2B1F48] hover:text-[#F2F0F9]"
            >
              <svg
                width="17"
                height="17"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
              >
                <path d="M8 4h8" />
                <path d="M6 7h12" />
                <path d="M7 7v11a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V7" />
                <path d="M10 11h4" />
                <path d="M10 14h4" />
              </svg>
              Memory
            </Link>
          </div>

          <div className="border-t border-[#352A52] pt-1.5">
            <button
              type="button"
              onClick={onSignOut}
              className="flex w-full items-center gap-3 rounded-[13px] px-3 py-2.5 text-left text-[13px] text-[#A9A3C2] transition hover:bg-[#2B1F48] hover:text-[#F2F0F9]"
            >
              <svg
                width="17"
                height="17"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
              >
                <path d="M10 17l5-5-5-5" />
                <path d="M15 12H3" />
                <path d="M20 4v16" />
              </svg>
              Sign out
            </button>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="group flex w-full items-center gap-3 rounded-[17px] border border-transparent px-2.5 py-2 transition hover:border-[#352A52] hover:bg-[#2B1F48]"
      >
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#B9A8FF] text-sm font-bold text-[#1F1535]">
          {initial}
        </div>

        <div className="min-w-0 flex-1 text-left">
          <p className="truncate text-[13px] font-semibold text-[#F2F0F9]">
            {displayName}
          </p>
          <p className="truncate text-[11px] text-[#A9A3C2]">
            Account
          </p>
        </div>

        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          className={`text-[#A9A3C2] transition-transform ${
            open ? "rotate-180" : ""
          }`}
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>
    </div>
  );
}
