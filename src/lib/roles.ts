import { createServerClient } from "@/lib/supabase/server";

export async function getUserRole(userId: string): Promise<string | null> {
  try {
    const supabase = await createServerClient();
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("user_id", userId)
      .single();

    return profile?.role ?? null;
  } catch {
    return null;
  }
}

export async function isAdmin(userId: string): Promise<boolean> {
  const role = await getUserRole(userId);
  return role === "admin";
}
