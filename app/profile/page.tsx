"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

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
      <circle cx="49.5" cy="14.5" r="6.5" fill="#FFD84A" />
    </svg>
  );
}

export default function ProfilePage() {
  const [email, setEmail] = useState("");
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        setEmail(user.email ?? "");
        setUserId(user.id);
      }

      setLoading(false);
    };

    loadProfile();
  }, []);

  const initials =
    email.split("@")[0].slice(0, 2).toUpperCase() || "RK";

  return (
    <main className="min-h-screen bg-[#171028] px-5 py-8 text-[#F2F0F9] sm:px-8">
      <div className="mx-auto max-w-3xl">
        <header className="mb-10 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-3 text-[#F2F0F9] transition hover:opacity-80"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#2B1F48]">
              <RikolMark className="h-7 w-7" />
            </span>

            <span className="text-xl font-bold tracking-[-0.035em]">
              rikol
            </span>
          </Link>

          <Link
            href="/"
            className="rounded-xl border border-[#352A52] bg-[#211739] px-4 py-2 text-sm font-semibold text-[#A9A3C2] transition hover:border-[#B9A8FF] hover:text-[#F2F0F9]"
          >
            Back to chat
          </Link>
        </header>

        <section className="rounded-[26px] border border-[#352A52] bg-[#211739] p-6 shadow-[0_24px_70px_rgba(23,16,40,0.35)] sm:p-8">
          <div className="mb-8 flex items-center gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#B9A8FF] text-xl font-bold text-[#1F1535]">
              {loading ? "..." : initials}
            </div>

            <div>
              <p className="mb-1 text-xs font-bold uppercase tracking-[0.18em] text-[#A9A3C2]">
                Profile
              </p>
              <h1 className="text-2xl font-bold tracking-[-0.025em] sm:text-3xl">
                Your Rikol account
              </h1>
            </div>
          </div>

          <div className="space-y-3">
            <div className="rounded-2xl border border-[#352A52] bg-[#171028] p-5">
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-[#A9A3C2]">
                Email
              </p>
              <p className="break-all text-base text-[#F2F0F9]">
                {loading ? "Loading..." : email || "No email available"}
              </p>
            </div>

            <div className="rounded-2xl border border-[#352A52] bg-[#171028] p-5">
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-[#A9A3C2]">
                Account
              </p>
              <p className="text-sm text-[#A9A3C2]">
                Your account keeps your conversations and Rikol memory tied to
                you.
              </p>
            </div>

            <div className="rounded-2xl border border-[#352A52] bg-[#171028] p-5">
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-[#A9A3C2]">
                User ID
              </p>
              <p className="break-all font-mono text-xs text-[#A9A3C2]">
                {loading ? "Loading..." : userId || "Unavailable"}
              </p>
            </div>
          </div>

          <div className="mt-8 border-t border-[#352A52] pt-6">
            <p className="font-['Newsreader'] text-sm italic text-[#A9A3C2]">
              Your account is the bridge between your conversations and the
              context Rikol remembers.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
