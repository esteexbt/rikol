import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);

  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";

  if (!code) {
    return NextResponse.redirect(`${origin}/auth/login?error=oauth`);
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error("Google OAuth callback error:", error);

    return NextResponse.redirect(`${origin}/auth/login?error=oauth`);
  }

  const safeNext = next.startsWith("/") ? next : "/";

  return NextResponse.redirect(`${origin}${safeNext}`);
}