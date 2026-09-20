import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/requireAdmin";

// GET /api/offers/[id] - Fetch single offer
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { user } = await requireAdmin();

    const { id } = await params;
    const supabase = await createServerClient();
    const { data, error } = await supabase
      .from("offers")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }

    return NextResponse.json({ offer: data });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to fetch offer";
    const status =
      message === "UNAUTHORIZED" ? 401 : 403;
    return NextResponse.json({ error: message }, { status });
  }
}

// PATCH /api/offers/[id] - Update offer (admin only)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireAdmin();

    const { id } = await params;
    const supabase = await createServerClient();
    const body: Record<string, unknown> = await request.json();

    const allowedFields = [
      "title", "subtitle", "description", "discount", "price", "old_price",
      "image", "start_date", "end_date", "badge", "cta_text", "enabled", "features",
    ];

    const updateData: Record<string, unknown> = {};
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updateData[field] = body[field];
      }
    }

    const { data, error } = await supabase
      .from("offers")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ offer: data });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to update offer";
    const status =
      message === "UNAUTHORIZED" ? 401 : message === "FORBIDDEN" ? 403 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}

// DELETE /api/offers/[id] - Delete offer (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireAdmin();

    const { id } = await params;
    const supabase = await createServerClient();
    const { error } = await supabase.from("offers").delete().eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to delete offer";
    const status =
      message === "UNAUTHORIZED" ? 401 : message === "FORBIDDEN" ? 403 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
