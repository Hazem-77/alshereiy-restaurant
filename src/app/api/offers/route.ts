import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/requireAdmin";

// GET /api/offers - List all offers (admin only)
export async function GET(request: NextRequest) {
  try {
    const { user } = await requireAdmin();

    const supabase = await createServerClient();
    const { data, error } = await supabase
      .from("offers")
      .select("*")
      .order("start_date", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ offers: (data ?? []) });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to fetch offers";
    const status = message === "UNAUTHORIZED" ? 401 : 403;
    return NextResponse.json({ error: message }, { status });
  }
}

// POST /api/offers - Create offer (admin only)
export async function POST(request: NextRequest) {
  try {
    await requireAdmin();

    const supabase = await createServerClient();
    const body: Record<string, unknown> = await request.json();

    const {
      title,
      subtitle,
      description,
      discount,
      price,
      old_price,
      image,
      start_date,
      end_date,
      badge,
      cta_text,
      enabled,
      features,
    } = body;

    if (!title || !description || price === undefined || !start_date || !end_date) {
      return NextResponse.json(
        { error: "الحقول المطلوبة: title, description, price, start_date, end_date" },
        { status: 400 },
      );
    }

    const { data, error } = await supabase
      .from("offers")
      .insert({
        title,
        subtitle: subtitle ?? null,
        description,
        discount: discount ?? null,
        price: Number(price),
        old_price: old_price ?? null,
        image: image ?? null,
        start_date,
        end_date,
        badge: badge ?? null,
        cta_text: cta_text ?? null,
        enabled: enabled ?? true,
        features: features ?? null,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ offer: data }, { status: 201 });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to create offer";
    const status =
      message === "UNAUTHORIZED" ? 401 : message === "FORBIDDEN" ? 403 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
