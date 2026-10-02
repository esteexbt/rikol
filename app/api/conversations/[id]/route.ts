import { createClient } from "@/lib/supabase/server";

type RouteContext = {
  params: Promise<{ id: string }>;
};

const conversationFields =
  "id, title, created_at, updated_at, pinned, archived, share_token";

export async function PATCH(
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

  let body: {
    title?: string;
    pinned?: boolean;
    archived?: boolean;
    share?: boolean;
  };

  try {
    body = await req.json();
  } catch {
    return Response.json(
      { error: "Invalid request body." },
      { status: 400 }
    );
  }

  const updates: {
    title?: string;
    pinned?: boolean;
    archived?: boolean;
    share_token?: string | null;
  } = {};

  if (body.title !== undefined) {
    if (
      typeof body.title !== "string" ||
      !body.title.trim()
    ) {
      return Response.json(
        { error: "A conversation title is required." },
        { status: 400 }
      );
    }

    updates.title = body.title.trim().slice(0, 100);
  }

  if (body.pinned !== undefined) {
    if (typeof body.pinned !== "boolean") {
      return Response.json(
        { error: "Pinned must be a boolean." },
        { status: 400 }
      );
    }

    updates.pinned = body.pinned;
  }

  if (body.archived !== undefined) {
    if (typeof body.archived !== "boolean") {
      return Response.json(
        { error: "Archived must be a boolean." },
        { status: 400 }
      );
    }

    updates.archived = body.archived;
  }

  if (body.share !== undefined) {
    if (typeof body.share !== "boolean") {
      return Response.json(
        { error: "Share must be a boolean." },
        { status: 400 }
      );
    }

    updates.share_token = body.share
      ? crypto.randomUUID()
      : null;
  }

  if (Object.keys(updates).length === 0) {
    return Response.json(
      { error: "No valid changes were provided." },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("conversations")
    .update(updates)
    .eq("id", id)
    .eq("user_id", user.id)
    .select(conversationFields)
    .single();

  if (error) {
    console.error("Update conversation error:", error);

    return Response.json(
      { error: "Conversation not found." },
      { status: 404 }
    );
  }

  return Response.json({ conversation: data });
}

export async function DELETE(
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

  const { error } = await supabase
    .from("conversations")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    console.error("Delete conversation error:", error);

    return Response.json(
      { error: "Failed to delete conversation." },
      { status: 500 }
    );
  }

  return Response.json({ success: true });
}
