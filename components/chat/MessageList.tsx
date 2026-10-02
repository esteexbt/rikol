"use client";

import { RefObject } from "react";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import type { Message } from "@/components/chat/types";

type MessageListProps = {
  messages: Message[];
  loadingMessages: boolean;
  sending: boolean;
  messagesEndRef: RefObject<HTMLDivElement | null>;
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

function MarkdownMessage({ content }: { content: string }) {
  return (
    <div className="rikol-markdown break-words">
      <ReactMarkdown
        remarkPlugins={[remarkMath]}
        rehypePlugins={[rehypeKatex]}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

export default function MessageList({
  messages,
  loadingMessages,
  sending,
  messagesEndRef,
}: MessageListProps) {
  if (loadingMessages) {
    return (
      <div className="flex min-h-0 flex-1 items-center justify-center bg-[#171028]">
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#A9A3C2]" />
          <span
            className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#A9A3C2]"
            style={{ animationDelay: "120ms" }}
          />
          <span
            className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#A9A3C2]"
            style={{ animationDelay: "240ms" }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-0 flex-1 overflow-y-auto bg-[#171028]">
      <div className="mx-auto flex w-full max-w-[820px] flex-col px-4 pb-8 pt-8 sm:px-6 sm:pt-10">
        {messages.length === 0 ? (
          <div className="flex min-h-[calc(100vh-230px)] flex-col items-center justify-center text-center">
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-[20px] bg-[#2B1F48] text-[#F2F0F9] shadow-lg shadow-[#171028]/40">
              <RikolMark className="h-11 w-11" />
            </div>

            <h2 className="font-['Bricolage_Grotesque'] text-[25px] font-semibold tracking-[-0.04em] text-[#F2F0F9] sm:text-[29px]">
              How can I help?
            </h2>

            <p className="mt-2 max-w-[390px] font-['Bricolage_Grotesque'] text-[13px] leading-6 text-[#A9A3C2]">
              Ask me anything. I&apos;ll remember the things that matter
              across your conversations.
            </p>

            <div className="mt-5 flex items-center gap-2 rounded-full border border-[#FFD84A]/15 bg-[#FFD84A]/[0.05] px-3 py-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-[#FFD84A]" />
              <span className="font-['Bricolage_Grotesque'] text-[10px] font-medium text-[#FFD84A]">
                Memory active
              </span>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {messages.map((message) => {
              const isUser = message.role === "user";

              return (
                <div
                  key={message.id}
                  className={`flex animate-message-in ${
                    isUser ? "justify-end" : "justify-start"
                  }`}
                >
                  {isUser ? (
                    <div className="max-w-[82%] rounded-[20px] rounded-br-[6px] bg-[#2B1F48] px-4 py-3 text-[14px] leading-6 text-[#F2F0F9] sm:max-w-[72%]">
                      <p className="whitespace-pre-wrap break-words">
                        {message.content}
                      </p>
                    </div>
                  ) : (
                    <div className="max-w-[88%] text-[14px] leading-7 text-[#F2F0F9]/90 sm:max-w-[78%]">
                      <div className="mb-2.5 flex items-center gap-2">
                        <span className="flex h-7 w-7 items-center justify-center rounded-[9px] bg-[#2B1F48] text-[#F2F0F9]">
                          <RikolMark className="h-5 w-5" />
                        </span>

                        <span className="font-['Bricolage_Grotesque'] text-[11px] font-semibold text-[#A9A3C2]">
                          rikol
                        </span>
                      </div>

                      <MarkdownMessage content={message.content} />
                    </div>
                  )}
                </div>
              );
            })}

            {sending && (
              <div className="flex animate-message-in justify-start">
                <div className="flex items-start gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-[9px] bg-[#2B1F48] text-[#F2F0F9]">
                    <RikolMark className="h-5 w-5" />
                  </span>

                  <div className="flex h-7 items-center gap-1 px-1">
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#A9A3C2]" />
                    <span
                      className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#A9A3C2]"
                      style={{ animationDelay: "100ms" }}
                    />
                    <span
                      className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#A9A3C2]"
                      style={{ animationDelay: "200ms" }}
                    />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}
      </div>
    </div>
  );
}