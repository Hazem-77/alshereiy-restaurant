import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { validateEnvVars } from "@/lib/env";

export async function POST(request: NextRequest) {
  const envCheck = validateEnvVars();
  if (!envCheck.valid) {
    return NextResponse.json(
      { error: "Server configuration missing. Contact administrator." },
      { status: 503 },
    );
  }

  const supabase = await createServerClient();
  const { email, password }: { email: string; password: string } =
    await request.json();

  if (!email || !password) {
    return NextResponse.json(
      { error: "البريد الإلكتروني وكلمة المرور مطلوبان" },
      { status: 400 },
    );
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }

  // Ensure profile exists (for users who signed up before profiles table)
  if (data.user) {
    const { data: existingProfile } = await supabase
      .from("profiles")
      .select("id")
      .eq("user_id", data.user.id)
      .single();

    if (!existingProfile) {
      await supabase.from("profiles").insert({
        user_id: data.user.id,
        role: "user",
        full_name: data.user.user_metadata?.full_name ?? data.user.email ?? "",
      });
    }

    // Return role info
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("user_id", data.user.id)
      .single();

    data.user.user_metadata = {
      ...data.user.user_metadata,
      role: profile?.role ?? "user",
    };
  }

  return NextResponse.json({ data });
}
