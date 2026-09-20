import { createServerClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function updateSession(request: NextRequest) {
  const supabaseResponse = NextResponse.next({ request });

  const cookieStore = await cookies();
  const accessToken = cookieStore.get("sb-access-token")?.value;
  const refreshToken = cookieStore.get("sb-refresh-token")?.value;

  if (!accessToken || !refreshToken) {
    return { supabase: null, supabaseResponse, user: null };
  }

  const supabase = await createServerClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    cookieStore.delete("sb-access-token");
    cookieStore.delete("sb-refresh-token");
    return { supabase: null, supabaseResponse, user: null };
  }

  return { supabase, supabaseResponse, user };
}
