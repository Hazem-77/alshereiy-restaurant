import { type User } from "@supabase/supabase-js";
import { createServerClient } from "@/lib/supabase/server";

export interface AdminUser {
  user: User;
  isAdmin: boolean;
}

export async function requireAdmin(): Promise<AdminUser> {
  const supabase = await createServerClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("UNAUTHORIZED");
  }

  const { data: isAdminData } = await supabase.rpc("is_admin");

  const isAdmin = isAdminData ?? false;

  if (!isAdmin) {
    throw new Error("FORBIDDEN");
  }

  return { user, isAdmin };
}
