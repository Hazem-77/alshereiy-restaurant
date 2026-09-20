import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/requireAdmin";

export async function GET(request: NextRequest) {
  try {
    await requireAdmin();

    const supabase = await createServerClient();
    const { data, error } = await supabase
      .from("menu_items")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ menuItems: data ?? [] });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to fetch menu items";
    const status =
      message === "UNAUTHORIZED" ? 401 : message === "FORBIDDEN" ? 403 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();

    const supabase = await createServerClient();
    const body: Record<string, unknown> = await request.json();

    const {
      name,
      description,
      price,
      old_price,
      image,
      category,
      category_name,
      badge,
      featured,
      enabled,
      sort_order,
      ingredients,
      spice_level,
    } = body;

    if (!name || !description || price === undefined || !category || !category_name) {
      return NextResponse.json(
        { error: "الحقول المطلوبة: name, description, price, category, category_name" },
        { status: 400 },
      );
    }

    const ingredientsArray = Array.isArray(ingredients)
      ? ingredients
      : typeof ingredients === "string"
        ? ingredients.split("\n").filter((i: string) => i.trim())
        : null;

    const { data, error } = await supabase
      .from("menu_items")
      .insert({
        name,
        description,
        price: Number(price),
        old_price: old_price ?? null,
        image: image ?? null,
        category,
        category_name,
        badge: badge ?? null,
        featured: featured ?? false,
        enabled: enabled ?? true,
        sort_order: sort_order ?? 0,
        ingredients: ingredientsArray,
        spice_level: spice_level ?? null,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ menuItem: data }, { status: 201 });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to create menu item";
    const status =
      message === "UNAUTHORIZED" ? 401 : message === "FORBIDDEN" ? 403 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
