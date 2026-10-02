import { MemWal } from "@mysten-incubation/memwal";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return Response.json(
        { error: "You must be signed in to view your memory." },
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

    const namespaces = await memwal.listNamespaces({ limit: 100 });

    const currentNamespace = namespaces.namespaces.find(
      (item) => item.name === namespace
    );

    return Response.json({
      namespace,
      memoryCount: currentNamespace?.memory_count ?? 0,
      active: Boolean(currentNamespace),
    });
  } catch (error) {
    console.error("Rikol memory error:", error);

    return Response.json(
      { error: "Unable to load your memory right now." },
      { status: 500 }
    );
  }
}
