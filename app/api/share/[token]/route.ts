import { createClient } from "@/lib/supabase/server";

type RouteContext = {
  params: Promise<{ token: string }>;
};

export async function GET(
  _req: Request,
  context: RouteContext
) {
  const { token } = await context.params;

  if (!token || token.length > 200) {
    return Response.json(
      { error: "Invalid share link." },
      { status: 400 }
    );
  }

  const supabase = await createClient();

  const { data, error } = await supabase.rpc(
    "get_shared_conversation",
    {
      p_share_token: token,
    }
  );

  if (error) {
    console.error("Load shared conversation error:", error);

    return Response.json(
      { error: "Could not load shared conversation." },
      { status: 500 }
    );
  }

  if (!data || data.length === 0) {
    return Response.json(
      { error: "Shared conversation not found." },
      { status: 404 }
    );
  }

  const first = data[0];

  return Response.json({
    conversation: {
      id: first.id,
      title: first.title,
      created_at: first.created_at,
      updated_at: first.updated_at,
    },
    messages: data
      .filter(
        (row: {
          message_id: string | null;
        }) => row.message_id !== null
      )
      .map(
        (row: {
          message_id: string;
          message_role: string;
          message_content: string;
          message_created_at: string;
        }) => ({
          id: row.message_id,
          role: row.message_role,
          content: row.message_content,
          created_at: row.message_created_at,
        })
      ),
  });
}
