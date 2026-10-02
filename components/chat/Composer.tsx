"use client";

import { useEffect, useRef } from "react";
import type { FormEvent, KeyboardEvent } from "react";

type ComposerProps = {
  input: string;
  sending: boolean;
  sendingText: string;
  error: string;
  onInputChange: (value: string) => void;
  onSend: (event?: FormEvent<HTMLFormElement>) => void;
};

export default function Composer({
  input,
  sending,
  sendingText,
  error,
  onInputChange,
  onSend,
}: ComposerProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const textarea = textareaRef.current;

    if (!textarea) {
      return;
    }

    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 160)}px`;
  }, [input]);

  function handleKeyDown(
    event: KeyboardEvent<HTMLTextAreaElement>
  ) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();

      if (!sending && input.trim()) {
        onSend();
      }
    }
  }

  return (
    <div className="shrink-0 bg-[#171028] px-4 pb-4 pt-2 sm:px-6 sm:pb-6 lg:px-8">
      <div className="mx-auto w-full max-w-[820px]">
        {error && (
          <div className="mb-3 rounded-[14px] border border-[#FF8A8A]/20 bg-[#FF8A8A]/[0.06] px-3.5 py-2.5 text-[12px] text-[#FFB3B3]">
            {error}
          </div>
        )}

        <form
          onSubmit={onSend}
          className="relative flex items-end rounded-[24px] border border-[#352A52] bg-[#211739] p-2 transition-colors duration-200 focus-within:border-[#4A3C69]"
        >
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(event) => onInputChange(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              sending
                ? sendingText || "Rikol is thinking..."
                : "Message Rikol..."
            }
            disabled={sending}
            rows={1}
            style={{ maxHeight: "160px" }}
            className="block min-h-[46px] flex-1 resize-none overflow-y-auto border-0 bg-transparent px-3 py-3 font-['Bricolage_Grotesque'] text-[14px] leading-6 text-[#F2F0F9] outline-none ring-0 focus:border-0 focus:outline-none focus:ring-0 focus-visible:border-0 focus-visible:outline-none focus-visible:ring-0 placeholder:text-[#A9A3C2]/55 disabled:cursor-not-allowed"
          />

          <button
            type="submit"
            disabled={sending || !input.trim()}
            className="mb-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-[15px] bg-[#FFD84A] text-[#1F1535] transition-all duration-200 hover:bg-[#FFE27A] disabled:cursor-not-allowed disabled:bg-[#352A52] disabled:text-[#5A5472]"
            aria-label="Send message"
          >
            {sending ? (
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="animate-spin"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="8"
                  strokeDasharray="34"
                  strokeLinecap="round"
                />
              </svg>
            ) : (
              <svg
                width="17"
                height="17"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 19V5" />
                <path d="m6 11 6-6 6 6" />
              </svg>
            )}
          </button>
        </form>

        <p className="mt-2.5 text-center font-['Newsreader'] text-[12px] italic text-[#A9A3C2]/65">
          Rikol can remember useful details from your conversations.
        </p>
      </div>
    </div>
  );
}
