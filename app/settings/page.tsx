"use client";

import { useState } from "react";
import Link from "next/link";

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

export default function SettingsPage() {
  const [memoryEnabled, setMemoryEnabled] = useState(true);

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
          <div className="mb-8">
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-[#A9A3C2]">
              Settings
            </p>

            <h1 className="text-3xl font-bold tracking-[-0.03em]">
              Make Rikol yours.
            </h1>

            <p className="mt-2 max-w-xl text-sm leading-6 text-[#A9A3C2]">
              Control how Rikol uses memory and how your conversations feel.
            </p>
          </div>

          <div className="space-y-4">
            <div className="rounded-2xl border border-[#352A52] bg-[#171028] p-5">
              <div className="flex items-start justify-between gap-5">
                <div>
                  <h2 className="font-semibold text-[#F2F0F9]">
                    Rikol Memory
                  </h2>

                  <p className="mt-1 max-w-lg text-sm leading-6 text-[#A9A3C2]">
                    Allow Rikol to remember useful details from your
                    conversations and use them as context later.
                  </p>
                </div>

                <button
                  type="button"
                  aria-pressed={memoryEnabled}
                  onClick={() => setMemoryEnabled((value) => !value)}
                  className={`relative mt-1 h-7 w-12 shrink-0 rounded-full transition ${
                    memoryEnabled
                      ? "bg-[#FFD84A]"
                      : "bg-[#5A5472]"
                  }`}
                >
                  <span
                    className={`absolute top-1 h-5 w-5 rounded-full bg-[#1F1535] transition ${
                      memoryEnabled ? "left-6" : "left-1"
                    }`}
                  />
                </button>
              </div>

              <div className="mt-4 flex items-center gap-2 text-xs font-semibold">
                <span
                  className={`h-2 w-2 rounded-full ${
                    memoryEnabled ? "bg-[#FFD84A]" : "bg-[#5A5472]"
                  }`}
                />
                <span className="text-[#A9A3C2]">
                  {memoryEnabled ? "Memory is active" : "Memory is paused"}
                </span>
              </div>
            </div>

            <div className="rounded-2xl border border-[#352A52] bg-[#171028] p-5">
              <h2 className="font-semibold text-[#F2F0F9]">
                Conversations
              </h2>

              <p className="mt-1 text-sm leading-6 text-[#A9A3C2]">
                Your conversations are stored securely with your account so
                you can return to them later.
              </p>

              <Link
                href="/"
                className="mt-4 inline-flex rounded-xl border border-[#352A52] px-4 py-2 text-sm font-semibold text-[#F2F0F9] transition hover:border-[#B9A8FF] hover:bg-[#2B1F48]"
              >
                View conversations
              </Link>
            </div>

            <div className="rounded-2xl border border-[#352A52] bg-[#171028] p-5">
              <h2 className="font-semibold text-[#F2F0F9]">
                Your memory
              </h2>

              <p className="mt-1 text-sm leading-6 text-[#A9A3C2]">
                See whether Rikol has stored useful context about you.
              </p>

              <Link
                href="/memory"
                className="mt-4 inline-flex rounded-xl bg-[#B9A8FF] px-4 py-2 text-sm font-bold text-[#1F1535] transition hover:brightness-105"
              >
                View memory
              </Link>
            </div>
          </div>

          <div className="mt-8 border-t border-[#352A52] pt-6">
            <p className="font-['Newsreader'] text-sm italic text-[#A9A3C2]">
              The best assistant isn't the one that remembers everything. It's
              the one that remembers what matters.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
