"use client";

import { FormEvent, useState } from "react";
import { createClient } from "@/lib/supabase/client";
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

function GoogleIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-5 w-5"
    >
      <path
        fill="#4285F4"
        d="M21.35 12.23c0-.79-.07-1.55-.2-2.27H12v4.3h5.22a4.46 4.46 0 0 1-1.94 2.93v2.43h3.14c1.84-1.7 2.93-4.2 2.93-7.39Z"
      />
      <path
        fill="#34A853"
        d="M12 21.99c2.63 0 4.84-.87 6.45-2.37l-3.14-2.43c-.87.58-1.98.93-3.31.93-2.54 0-4.7-1.72-5.47-4.03H3.28v2.51A9.75 9.75 0 0 0 12 21.99Z"
      />
      <path
        fill="#FBBC05"
        d="M6.53 14.09A5.86 5.86 0 0 1 6.22 12c0-.73.13-1.43.31-2.09V7.4H3.28A9.75 9.75 0 0 0 2.25 12c0 1.57.38 3.06 1.03 4.6l3.25-2.51Z"
      />
      <path
        fill="#EA4335"
        d="M12 5.88c1.43 0 2.71.49 3.72 1.45l2.79-2.79C16.84 2.96 14.63 2.01 12 2.01a9.75 9.75 0 0 0-8.72 5.39l3.25 2.51c.77-2.31 2.93-4.03 5.47-4.03Z"
      />
    </svg>
  );
}

function EyeIcon({ visible }: { visible: boolean }) {
  if (visible) {
    return (
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="none"
        className="h-5 w-5"
      >
        <path
          d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle
          cx="12"
          cy="12"
          r="2.5"
          stroke="currentColor"
          strokeWidth="1.8"
        />
      </svg>
    );
  }

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      className="h-5 w-5"
    >
      <path
        d="M3 3l18 18"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M10.6 6.2A9.7 9.7 0 0 1 12 6c6 0 9.5 6 9.5 6a17.5 17.5 0 0 1-3.1 3.8M6.1 6.9C3.7 8.2 2.5 12 2.5 12s3.5 6 9.5 6c1 0 1.9-.2 2.7-.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function SignUpPage() {
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  async function handleSignUp(event: FormEvent) {
    event.preventDefault();

    setLoading(true);
    setError("");
    setMessage("");

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setMessage(
      "Account created. Check your email and confirm your account before signing in."
    );

    setLoading(false);
  }

  async function handleGoogleSignUp() {
    setGoogleLoading(true);
    setError("");
    setMessage("");

    const redirectTo = `${window.location.origin}/auth/callback?next=/`;

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo,
      },
    });

    if (error) {
      setError(error.message);
      setGoogleLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#171028] px-6 py-10 text-[#F2F0F9]">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-md flex-col justify-center">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-[20px] bg-[#2B1F48] text-[#F2F0F9]">
            <RikolMark className="h-10 w-10" />
          </div>

          <h1 className="text-[30px] font-bold tracking-[-0.035em]">
            Create your Rikol account
          </h1>

          <p className="mt-2 text-[15px] text-[#A9A3C2]">
            Start building a relationship with an AI that remembers you.
          </p>
        </div>

        <div className="rounded-[26px] border border-[#352A52] bg-[#211739] p-6 shadow-2xl shadow-[#171028]/50">
          <form onSubmit={handleSignUp}>
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

                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    style={{ fontFamily: "Arial, sans-serif" }}
                    required
                    minLength={6}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="At least 6 characters"
                    className="w-full rounded-[14px] border border-[#352A52] bg-[#171028] px-4 py-3 pr-12 text-[14px] text-[#F2F0F9] outline-none transition placeholder:text-[#A9A3C2]/50 focus:border-[#B9A8FF] focus:ring-2 focus:ring-[#B9A8FF]/15"
                  />

                  <button
                    type="button"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    title={showPassword ? "Hide password" : "Show password"}
                    onClick={() => setShowPassword((visible) => !visible)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-[#A9A3C2] transition hover:bg-[#2B1F48] hover:text-[#F2F0F9]"
                  >
                    <EyeIcon visible={showPassword} />
                  </button>
                </div>
              </div>

              {error && (
                <div className="rounded-[14px] border border-red-400/20 bg-red-400/[0.08] px-4 py-3 text-[13px] leading-5 text-red-300">
                  {error}
                </div>
              )}

              {message && (
                <div className="rounded-[14px] border border-[#B9A8FF]/20 bg-[#B9A8FF]/[0.08] px-4 py-3 text-[13px] leading-5 text-[#B9A8FF]">
                  {message}
                </div>
              )}

              <button
                type="submit"
                disabled={loading || googleLoading}
                className="w-full rounded-[14px] bg-[#FFD84A] px-4 py-3 text-[14px] font-bold text-[#1F1535] transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? "Creating account..." : "Create account"}
              </button>
            </div>
          </form>

          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-[#352A52]" />
            <span className="text-[11px] font-medium uppercase tracking-[0.08em] text-[#A9A3C2]/60">
              or continue with
            </span>
            <div className="h-px flex-1 bg-[#352A52]" />
          </div>

          <button
            type="button"
            onClick={handleGoogleSignUp}
            disabled={googleLoading || loading}
            className="flex w-full items-center justify-center gap-3 rounded-[14px] border border-[#4A3C69] bg-[#171028] px-4 py-3 text-[14px] font-semibold text-[#F2F0F9] transition hover:border-[#B9A8FF]/60 hover:bg-[#2B1F48] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <GoogleIcon />
            {googleLoading ? "Connecting to Google..." : "Continue with Google"}
          </button>
        </div>

        <p className="mt-6 text-center text-[13px] text-[#A9A3C2]">
          Already have an account?{" "}
          <Link
            href="/auth/login"
            className="font-semibold text-[#B9A8FF] transition hover:text-[#F2F0F9]"
          >
            Sign in
          </Link>
        </p>

        <p className="mt-8 text-center font-['Newsreader'] text-[12px] italic text-[#A9A3C2]/60">
          Your conversations can become context, not just history.
        </p>
      </div>
    </main>
  );
}
