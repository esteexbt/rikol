import { createClient } from "@/lib/supabase/server";

const conversationFields =
  "id, title, created_at, updated_at, pinned, archived, share_token";

export async function GET() {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return Response.json(
      { error: "You must be signed in." },
      { status: 401 }
    );
  }

  const { data, error } = await supabase
    .from("conversations")
    .select(conversationFields)
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false });

  if (error) {
    console.error("Load conversations error:", error);

    return Response.json(
      { error: "Failed to load conversations." },
      { status: 500 }
    );
  }

  return Response.json({ conversations: data });
}

export async function POST(req: Request) {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return Response.json(
      { error: "You must be signed in." },
      { status: 401 }
    );
  }

  let body: { title?: string };

  try {
    body = await req.json();
  } catch {
    body = {};
  }

  const title =
    typeof body.title === "string" && body.title.trim()
      ? body.title.trim().slice(0, 100)
      : "New chat";

  const { data, error } = await supabase
    .from("conversations")
    .insert({
      user_id: user.id,
      title,
    })
    .select(conversationFields)
    .single();

  if (error) {
    console.error("Create conversation error:", error);

    return Response.json(
      { error: "Failed to create conversation." },
      { status: 500 }
    );
  }

  return Response.json({ conversation: data }, { status: 201 });
}
