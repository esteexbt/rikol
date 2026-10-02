"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type MemoryData = {
  namespace: string;
  memoryCount: number;
  active: boolean;
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
      <circle cx="49.5" cy="14.5" r="6.5" fill="#FFD84A" />
    </svg>
  );
}

export default function MemoryPage() {
  const [memory, setMemory] = useState<MemoryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadMemory() {
      try {
        const response = await fetch("/api/memory", {
          cache: "no-store",
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Unable to load memory.");
        }

        setMemory(data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load your memory right now."
        );
      } finally {
        setLoading(false);
      }
    }

    loadMemory();
  }, []);

  return (
    <main className="min-h-screen bg-[#171028] text-[#F2F0F9]">
      <div className="mx-auto min-h-screen w-full max-w-4xl px-6 py-8 sm:px-8">
        <header className="flex items-center justify-between border-b border-[#352A52] pb-6">
          <Link
            href="/"
            className="flex items-center gap-3 text-[#F2F0F9] transition hover:text-[#B9A8FF]"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-[13px] bg-[#2B1F48]">
              <RikolMark className="h-7 w-7" />
            </div>

            <span className="text-[20px] font-bold tracking-[-0.035em]">
              rikol
            </span>
          </Link>

          <Link
            href="/"
            className="rounded-[12px] border border-[#352A52] bg-[#211739] px-4 py-2 text-[13px] font-medium text-[#A9A3C2] transition hover:border-[#B9A8FF] hover:text-[#F2F0F9]"
          >
            Back to chat
          </Link>
        </header>

        <section className="py-14">
          <div className="max-w-2xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#FFD84A]/20 bg-[#FFD84A]/[0.08] px-3 py-1.5 text-[12px] font-semibold text-[#FFD84A]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#FFD84A]" />
              MEMORY
            </div>

            <h1 className="text-[40px] font-bold leading-[1.05] tracking-[-0.045em] sm:text-[52px]">
              Rikol remembers
              <br />
              what matters.
            </h1>

            <p className="mt-5 max-w-xl text-[16px] leading-7 text-[#A9A3C2]">
              Useful details from your conversations can become context for
              future conversations, so Rikol can feel more personal over time.
            </p>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-[1.15fr_0.85fr]">
            <div className="rounded-[26px] border border-[#352A52] bg-[#211739] p-7">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[13px] font-medium text-[#A9A3C2]">
                    Stored memories
                  </p>

                  {loading ? (
                    <div className="mt-3 h-14 w-24 animate-pulse rounded-lg bg-[#2B1F48]" />
                  ) : (
                    <p className="mt-2 text-[56px] font-bold leading-none tracking-[-0.05em] text-[#F2F0F9]">
                      {memory?.memoryCount ?? 0}
                    </p>
                  )}
                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-[15px] bg-[#FFD84A] text-[#1F1535]">
                  <svg
                    width="23"
                    height="23"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <path d="M6 4h12" />
                    <path d="M6 8h12" />
                    <path d="M7 8v11a1.5 1.5 0 0 0 1.5 1.5h7A1.5 1.5 0 0 0 17 19V8" />
                    <path d="M10 12h4" />
                    <path d="M10 15h4" />
                  </svg>
                </div>
              </div>

              <div className="mt-8 h-px bg-[#352A52]" />

              <div className="mt-6 flex items-center gap-3">
                <span
                  className={`h-2 w-2 rounded-full ${
                    memory?.active
                      ? "bg-[#FFD84A]"
                      : "bg-[#A9A3C2]/40"
                  }`}
                />

                <span className="text-[13px] text-[#A9A3C2]">
                  {loading
                    ? "Checking memory..."
                    : memory?.active
                      ? "Memory is active for this account"
                      : "No memory namespace found yet"}
                </span>
              </div>
            </div>

            <div className="rounded-[26px] border border-[#352A52] bg-[#2B1F48] p-7">
              <p className="font-['Newsreader'] text-[24px] italic leading-8 text-[#F2F0F9]">
                �Context shouldn't disappear just because the conversation
                ended.�
              </p>

              <p className="mt-6 text-[13px] leading-6 text-[#A9A3C2]">
                Rikol uses Walrus Memory to persist useful context between
                conversations.
              </p>
            </div>
          </div>

          {error && (
            <div className="mt-5 rounded-[18px] border border-red-400/20 bg-red-400/[0.07] px-5 py-4 text-[13px] text-red-300">
              {error}
            </div>
          )}

          <div className="mt-5 rounded-[26px] border border-[#352A52] bg-[#211739] p-7">
            <h2 className="text-[18px] font-semibold">
              How Rikol&apos;s memory works
            </h2>

            <div className="mt-6 grid gap-6 sm:grid-cols-3">
              <div>
                <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-[11px] bg-[#2B1F48] text-[13px] font-bold text-[#B9A8FF]">
                  01
                </div>

                <h3 className="text-[14px] font-semibold">
                  You talk
                </h3>

                <p className="mt-1.5 text-[13px] leading-5 text-[#A9A3C2]">
                  Rikol learns from useful information you share naturally.
                </p>
              </div>

              <div>
                <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-[11px] bg-[#2B1F48] text-[13px] font-bold text-[#B9A8FF]">
                  02
                </div>

                <h3 className="text-[14px] font-semibold">
                  Context persists
                </h3>

                <p className="mt-1.5 text-[13px] leading-5 text-[#A9A3C2]">
                  Useful context can remain available beyond the current chat.
                </p>
              </div>

              <div>
                <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-[11px] bg-[#2B1F48] text-[13px] font-bold text-[#B9A8FF]">
                  03
                </div>

                <h3 className="text-[14px] font-semibold">
                  Rikol recalls
                </h3>

                <p className="mt-1.5 text-[13px] leading-5 text-[#A9A3C2]">
                  Relevant memories can make future conversations more useful.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
