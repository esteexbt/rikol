"use client";

import { FormEvent, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { useRouter } from "next/navigation";

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

export default function LoginPage() {
  const supabase = createClient();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(event: FormEvent) {
    event.preventDefault();

    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push("/");
    router.refresh();
  }

  return (
    <main className="min-h-screen bg-[#171028] px-6 py-10 text-[#F2F0F9]">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-md flex-col justify-center">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-[20px] bg-[#2B1F48] text-[#F2F0F9]">
            <RikolMark className="h-10 w-10" />
          </div>

          <div className="mb-2 flex items-center justify-center gap-2">
            <h1 className="text-[30px] font-bold tracking-[-0.035em]">
              Welcome back
            </h1>
          </div>

          <p className="text-[15px] text-[#A9A3C2]">
            Sign in to continue with Rikol.
          </p>
        </div>

        <form
          onSubmit={handleLogin}
          className="rounded-[26px] border border-[#352A52] bg-[#211739] p-6 shadow-2xl shadow-[#171028]/50"
        >
          <div className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-[13px] font-medium text-[#F2F0F9]"
              >
                Email
              </label>

              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-[14px] border border-[#352A52] bg-[#171028] px-4 py-3 text-[14px] text-[#F2F0F9] outline-none transition placeholder:text-[#A9A3C2]/50 focus:border-[#B9A8FF] focus:ring-2 focus:ring-[#B9A8FF]/15"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-[13px] font-medium text-[#F2F0F9]"
              >
                Password
              </label>

              <input
                id="password"
                type="password" style={{ fontFamily: "Arial, sans-serif" }}
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter your password"
                className="w-full rounded-[14px] border border-[#352A52] bg-[#171028] px-4 py-3 text-[14px] text-[#F2F0F9] outline-none transition placeholder:text-[#A9A3C2]/50 focus:border-[#B9A8FF] focus:ring-2 focus:ring-[#B9A8FF]/15"
              />
            </div>

            {error && (
              <div className="rounded-[14px] border border-red-400/20 bg-red-400/[0.08] px-4 py-3 text-[13px] leading-5 text-red-300">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-[14px] bg-[#FFD84A] px-4 py-3 text-[14px] font-bold text-[#1F1535] transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </div>
        </form>

        <p className="mt-6 text-center text-[13px] text-[#A9A3C2]">
          Don't have an account?{" "}
          <Link
            href="/auth/sign-up"
            className="font-semibold text-[#B9A8FF] transition hover:text-[#F2F0F9]"
          >
            Create one
          </Link>
        </p>

        <p className="mt-8 text-center font-['Newsreader'] text-[12px] italic text-[#A9A3C2]/60">
          An AI that remembers you.
        </p>
      </div>
    </main>
  );
}


