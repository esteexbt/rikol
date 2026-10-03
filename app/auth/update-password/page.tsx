"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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

export default function UpdatePasswordPage() {
  const supabase = createClient();
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    async function checkSession() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        setError(
          "This password reset link is invalid or has expired. Please request a new one."
        );
      }

      setCheckingSession(false);
    }

    checkSession();
  }, [supabase]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    setError("");
    setMessage("");

    if (password.length < 6) {
      setError("Your password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("The passwords do not match.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.updateUser({
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setMessage("Your password has been updated successfully.");
    setLoading(false);

    setTimeout(() => {
      router.push("/");
      router.refresh();
    }, 1200);
  }

  return (
    <main className="min-h-screen bg-[#171028] px-6 py-10 text-[#F2F0F9]">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-md flex-col justify-center">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-[20px] bg-[#2B1F48] text-[#F2F0F9]">
            <RikolMark className="h-10 w-10" />
          </div>

          <h1 className="mb-2 text-[30px] font-bold tracking-[-0.035em]">
            Set a new password
          </h1>

          <p className="text-[15px] text-[#A9A3C2]">
            Choose a new password for your Rikol account.
          </p>
        </div>

        <div className="rounded-[26px] border border-[#352A52] bg-[#211739] p-6 shadow-2xl shadow-[#171028]/50">
          {checkingSession ? (
            <div className="py-6 text-center text-[14px] text-[#A9A3C2]">
              Checking your reset link...
            </div>
          ) : message ? (
            <div className="rounded-[16px] border border-[#FFD84A]/20 bg-[#FFD84A]/5 p-5 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#FFD84A]/10 text-[#FFD84A]">
                ?
              </div>

              <h2 className="mb-2 text-[16px] font-semibold">
                Password updated
              </h2>

              <p className="text-[14px] leading-6 text-[#A9A3C2]">
                Your password has been changed. Taking you into Rikol...
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-[13px] font-medium text-[#F2F0F9]"
                >
                  New password
                </label>

                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    style={{ fontFamily: "Arial, sans-serif" }}
                    autoComplete="new-password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Enter your new password"
                    className="w-full rounded-[14px] border border-[#352A52] bg-[#171028] px-4 py-3 pr-12 text-[14px] text-[#F2F0F9] outline-none transition placeholder:text-[#A9A3C2]/50 focus:border-[#B9A8FF] focus:ring-2 focus:ring-[#B9A8FF]/15"
                  />

                  <button
                    type="button"
                    aria-label={
                      showPassword
                        ? "Hide new password"
                        : "Show new password"
                    }
                    title={
                      showPassword
                        ? "Hide new password"
                        : "Show new password"
                    }
                    onClick={() => setShowPassword((visible) => !visible)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-[#A9A3C2] transition hover:bg-[#2B1F48] hover:text-[#F2F0F9]"
                  >
                    <EyeIcon visible={showPassword} />
                  </button>
                </div>
              </div>

              <div>
                <label
                  htmlFor="confirm-password"
                  className="mb-2 block text-[13px] font-medium text-[#F2F0F9]"
                >
                  Confirm new password
                </label>

                <div className="relative">
                  <input
                    id="confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    style={{ fontFamily: "Arial, sans-serif" }}
                    autoComplete="new-password"
                    required
                    minLength={6}
                    value={confirmPassword}
                    onChange={(event) =>
                      setConfirmPassword(event.target.value)
                    }
                    placeholder="Enter your new password again"
                    className="w-full rounded-[14px] border border-[#352A52] bg-[#171028] px-4 py-3 pr-12 text-[14px] text-[#F2F0F9] outline-none transition placeholder:text-[#A9A3C2]/50 focus:border-[#B9A8FF] focus:ring-2 focus:ring-[#B9A8FF]/15"
                  />

                  <button
                    type="button"
                    aria-label={
                      showConfirmPassword
                        ? "Hide confirmed password"
                        : "Show confirmed password"
                    }
                    title={
                      showConfirmPassword
                        ? "Hide confirmed password"
                        : "Show confirmed password"
                    }
                    onClick={() =>
                      setShowConfirmPassword((visible) => !visible)
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-[#A9A3C2] transition hover:bg-[#2B1F48] hover:text-[#F2F0F9]"
                  >
                    <EyeIcon visible={showConfirmPassword} />
                  </button>
                </div>
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
                {loading ? "Updating password..." : "Update password"}
              </button>
            </form>
          )}

          {!message && (
            <div className="mt-6 text-center">
              <Link
                href="/auth/login"
                className="text-[13px] font-medium text-[#B9A8FF] transition hover:text-[#FFD84A]"
              >
                ? Back to sign in
              </Link>
            </div>
          )}
        </div>

        <p className="mt-8 text-center font-['Newsreader'] text-[12px] italic text-[#A9A3C2]/60">
          An AI that remembers you.
        </p>
      </div>
    </main>
  );
}
