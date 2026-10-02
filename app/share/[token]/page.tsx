import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

type PageProps = {
  params: Promise<{ token: string }>;
};

type SharedRow = {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
  message_id: string | null;
  message_role: string | null;
  message_content: string | null;
  message_created_at: string | null;
};

export default async function SharedConversationPage({
  params,
}: PageProps) {
  const { token } = await params;

  if (!token || token.length > 200) {
    notFound();
  }

  const supabase = await createClient();

  const { data, error } = await supabase.rpc(
    "get_shared_conversation",
    {
      p_share_token: token,
    }
  );

  if (error || !data || data.length === 0) {
    notFound();
  }

  const rows = data as SharedRow[];
  const conversation = rows[0];

  const messages = rows
    .filter((row) => row.message_id !== null)
    .map((row) => ({
      id: row.message_id as string,
      role: row.message_role as "user" | "assistant",
      content: row.message_content ?? "",
      created_at: row.message_created_at,
    }));

  return (
    <main className="min-h-screen bg-[#f7f7f8] text-zinc-900">
      <div className="mx-auto flex min-h-screen w-full max-w-4xl flex-col px-4 py-6 sm:px-6">
        <header className="mb-6 flex items-center justify-between">
          <a
            href="/"
            className="flex items-center gap-2 text-sm font-semibold text-zinc-900 transition-opacity hover:opacity-70"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-black text-sm font-bold text-white">
              R
            </div>
            <span>Rikol</span>
          </a>

          <div className="rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-500 shadow-sm">
            Shared conversation
          </div>
        </header>

        <section className="overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm">
          <div className="border-b border-zinc-100 px-5 py-5 sm:px-7">
            <p className="mb-1 text-xs font-medium uppercase tracking-wider text-zinc-400">
              Conversation
            </p>

            <h1 className="text-xl font-semibold tracking-tight text-zinc-950 sm:text-2xl">
              {conversation.title}
            </h1>
          </div>

          <div className="divide-y divide-zinc-100">
            {messages.length === 0 ? (
              <div className="px-6 py-12 text-center text-sm text-zinc-500">
                This conversation has no messages.
              </div>
            ) : (
              messages.map((message) => {
                const isUser = message.role === "user";

                return (
                  <div
                    key={message.id}
                    className="px-5 py-6 sm:px-7"
                  >
                    <div
                      className={`flex gap-3 ${
                        isUser ? "justify-end" : "justify-start"
                      }`}
                    >
                      {!isUser && (
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-black text-xs font-bold text-white">
                          R
                        </div>
                      )}

                      <div
                        className={`max-w-[85%] ${
                          isUser ? "items-end" : "items-start"
                        } flex flex-col`}
                      >
                        <span className="mb-1.5 px-1 text-xs font-medium text-zinc-400">
                          {isUser ? "You" : "Rikol"}
                        </span>

                        <div
                          className={`whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm leading-6 ${
                            isUser
                              ? "rounded-br-md bg-zinc-900 text-white"
                              : "rounded-bl-md bg-zinc-100 text-zinc-800"
                          }`}
                        >
                          {message.content}
                        </div>
                      </div>

                      {isUser && (
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-zinc-200 text-xs font-bold text-zinc-700">
                          Y
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>

        <footer className="mt-6 pb-4 text-center text-xs text-zinc-400">
          Shared from Rikol
        </footer>
      </div>
    </main>
  );
}
