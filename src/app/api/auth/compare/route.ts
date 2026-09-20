import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const supabase = await createServerClient();

  const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
  const { data: userData, error: userError } = await supabase.auth.getUser();

  return NextResponse.json({
    getSession: {
      sessionExists: !!sessionData.session,
      error: sessionError?.message ?? "none",
    },
    getUser: {
      userExists: !!userData.user,
      error: userError?.message ?? "none",
      email: userData.user?.email ?? "none",
    },
  });
}
