"use client";

import { FormEvent, useState } from "react";
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

export default function ForgotPasswordPage() {
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    setLoading(true);
    setError("");
    setMessage("");

    const { error } = await supabase.auth.resetPasswordForEmail(
      email,
      {
        redirectTo: `${window.location.origin}/auth/update-password`,
      }
    );

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setMessage(
      "If an account exists with that email, we've sent a password reset link."
    );

    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-[#171028] px-6 py-10 text-[#F2F0F9]">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-md flex-col justify-center">
        <div className="mb-8 text-center">
          <Link
            href="/auth/login"
            className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-[20px] bg-[#2B1F48] text-[#F2F0F9] transition hover:bg-[#352A52]"
          >
            <RikolMark className="h-10 w-10" />
          </Link>

          <h1 className="mb-2 text-[30px] font-bold tracking-[-0.035em]">
            Forgot your password?
          </h1>

          <p className="text-[15px] text-[#A9A3C2]">
            Enter your email and we&apos;ll send you a link to reset it.
          </p>
        </div>

        <div className="rounded-[26px] border border-[#352A52] bg-[#211739] p-6 shadow-2xl shadow-[#171028]/50">
          {message ? (
            <div className="rounded-[16px] border border-[#FFD84A]/20 bg-[#FFD84A]/5 p-5 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#FFD84A]/10 text-[#FFD84A]">
                ✓
              </div>

              <h2 className="mb-2 text-[16px] font-semibold">
                Check your email
              </h2>

              <p className="text-[14px] leading-6 text-[#A9A3C2]">
                {message}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-[13px] font-medium text-[#F2F0F9]"
                >
                  Email address
                </label>

                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded-[14px] border border-[#4A3C69] bg-[#171028] px-4 py-3 text-[14px] text-[#F2F0F9] placeholder:text-[#A9A3C2]/50 focus:border-[#B9A8FF] focus:outline-none"
                />
              </div>

              {error && (
                <div className="rounded-[12px] border border-red-400/20 bg-red-400/5 px-4 py-3 text-[13px] leading-5 text-red-300">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-[14px] bg-[#FFD84A] px-4 py-3 text-[14px] font-bold text-[#1F1535] transition hover:bg-[#ffe477] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? "Sending reset link..." : "Send reset link"}
              </button>
            </form>
          )}

          <div className="mt-6 text-center">
            <Link
              href="/auth/login"
              className="text-[13px] font-medium text-[#B9A8FF] transition hover:text-[#FFD84A]"
            >
              ← Back to sign in
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
