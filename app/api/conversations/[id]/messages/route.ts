import { createClient } from "@/lib/supabase/server";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(
  _req: Request,
  context: RouteContext
) {
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

  const { id } = await context.params;

  const { data: conversation, error: conversationError } =
    await supabase
      .from("conversations")
      .select("id")
      .eq("id", id)
      .eq("user_id", user.id)
      .single();

  if (conversationError || !conversation) {
    return Response.json(
      { error: "Conversation not found." },
      { status: 404 }
    );
  }

  const { data, error } = await supabase
    .from("messages")
    .select("id, role, content, created_at")
    .eq("conversation_id", id)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Load messages error:", error);

    return Response.json(
      { error: "Failed to load messages." },
      { status: 500 }
    );
  }

  return Response.json({ messages: data });
}

export async function POST(
  req: Request,
  context: RouteContext
) {
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

  const { id } = await context.params;

  const { data: conversation, error: conversationError } =
    await supabase
      .from("conversations")
      .select("id")
      .eq("id", id)
      .eq("user_id", user.id)
      .single();

  if (conversationError || !conversation) {
    return Response.json(
      { error: "Conversation not found." },
      { status: 404 }
    );
  }

  let body: {
    role?: string;
    content?: string;
  };

  try {
    body = await req.json();
  } catch {
    return Response.json(
      { error: "Invalid request body." },
      { status: 400 }
    );
  }

  if (
    (body.role !== "user" && body.role !== "assistant") ||
    typeof body.content !== "string" ||
    !body.content.trim()
  ) {
    return Response.json(
      { error: "Role and content are required." },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("messages")
    .insert({
      conversation_id: id,
      role: body.role,
      content: body.content.trim(),
    })
    .select("id, role, content, created_at")
    .single();

  if (error) {
    console.error("Save message error:", error);

    return Response.json(
      { error: "Failed to save message." },
      { status: 500 }
    );
  }

  const { error: updateError } = await supabase
    .from("conversations")
    .update({
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("user_id", user.id);

  if (updateError) {
    console.error("Update conversation timestamp error:", updateError);
  }

  return Response.json({ message: data }, { status: 201 });
}
