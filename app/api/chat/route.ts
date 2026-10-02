import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import { withMemWal } from "@mysten-incubation/memwal/ai";
import { MemWal } from "@mysten-incubation/memwal";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return Response.json(
        { error: "Messages are required." },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return Response.json(
        { error: "You must be signed in to use Rikol." },
        { status: 401 }
      );
    }

    const namespace = `rikol-user-${user.id}`;

    const memwal = MemWal.create({
      key: process.env.MEMWAL_PRIVATE_KEY!,
      accountId: process.env.MEMWAL_ACCOUNT_ID!,
      serverUrl: process.env.MEMWAL_SERVER_URL!,
      namespace,
    });

    const model = withMemWal(
      google("gemini-3.8-flash"),
      {
        key: process.env.MEMWAL_PRIVATE_KEY!,
        accountId: process.env.MEMWAL_ACCOUNT_ID!,
        serverUrl: process.env.MEMWAL_SERVER_URL!,
        namespace,
        maxMemories: 10,
        autoSave: true,
        debug: true,
      }
    );

    const result = await generateText({
      model,
      system: `
You are Rikol, a personal AI assistant that remembers the people you talk to.

Your job is to be helpful, natural, and personalized.

When memories from previous conversations are available, use them naturally when they are relevant. Do not mention the technical memory system unless the user asks.

Do not invent memories. Only use information that is actually available in the conversation or recalled memory.

If the user tells you something that could be useful in future conversations, remember it.
      `,
      messages,
    });

    try {
      const namespaces = await memwal.listNamespaces({ limit: 100 });

      const currentNamespace = namespaces.namespaces.find(
        (ns) => ns.name === namespace
      );

      console.log(
        "[Rikol Memory Diagnostic]",
        currentNamespace
          ? {
              userId: user.id,
              namespace: currentNamespace.name,
              memoryCount: currentNamespace.memory_count,
            }
          : {
              userId: user.id,
              namespace,
              memoryCount: 0,
            }
      );
    } catch (memoryError) {
      console.error(
        "[Rikol Memory Diagnostic] Failed:",
        memoryError
      );
    }

    return Response.json({ text: result.text });
  } catch (error) {
    console.error("Rikol chat error:", error);

    return Response.json(
      { error: "Something went wrong while talking to Rikol." },
      { status: 500 }
    );
  }
}
