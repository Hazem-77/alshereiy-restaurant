import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { mapDbMenuItemToMenuItem } from "@/lib/menuMapping";

export async function GET() {
  try {
    const supabase = await createServerClient();
    const { data, error } = await supabase
      .from("menu_items")
      .select("*")
      .eq("enabled", true)
      .order("sort_order", { ascending: true });

    if (error || !data) {
      return NextResponse.json({ menuItems: [] });
    }

    const menuItems = data.map(mapDbMenuItemToMenuItem);
    return NextResponse.json({ menuItems });
  } catch {
    return NextResponse.json({ menuItems: [] });
  }
}
