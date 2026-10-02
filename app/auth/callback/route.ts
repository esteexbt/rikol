import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);

  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next") ?? "/";

  if (!code) {
    return NextResponse.redirect(
      new URL("/auth/login?error=missing_code", requestUrl.origin)
    );
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error("Google OAuth callback error:", error);

    return NextResponse.redirect(
      new URL(
        `/auth/login?error=${encodeURIComponent(error.message)}`,
        requestUrl.origin
      )
    );
  }

  const safeNext = next.startsWith("/") ? next : "/";

  return NextResponse.redirect(
    new URL(safeNext, requestUrl.origin)
  );
}