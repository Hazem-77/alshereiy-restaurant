import type { MenuItem } from "@/data/menu";
import { menuItems as fallbackItems } from "@/data/menu";
import { createServerClient } from "@/lib/supabase/server";
import { mapDbMenuItemToMenuItem } from "@/lib/menuMapping";

export async function getPublicMenuItems(): Promise<MenuItem[]> {
  try {
    const supabase = await createServerClient();
    const { data, error } = await supabase
      .from("menu_items")
      .select("*")
      .eq("enabled", true)
      .order("sort_order", { ascending: true });

    if (error || !data || data.length === 0) {
      return fallbackItems;
    }

    return data.map(mapDbMenuItemToMenuItem);
  } catch (err) {
    console.error(
      "[getPublicMenuItems] Supabase fetch failed, using static fallback:",
      err instanceof Error ? err.message : "unknown error",
    );
    return fallbackItems;
  }
}
