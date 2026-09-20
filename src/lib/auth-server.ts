import { AuthSession } from "@supabase/supabase-js";
import { createServerClient } from "@/lib/supabase/server";

export async function getServerSession(): Promise<AuthSession | null> {
  try {
    const supabase = await createServerClient();
    const { data } = await supabase.auth.getSession();
    return data.session ?? null;
  } catch {
    return null;
  }
}
