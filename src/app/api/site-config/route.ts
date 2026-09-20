import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/requireAdmin";
import type { SiteConfigRow } from "@/lib/siteConfigMapping";

export async function GET() {
  try {
    await requireAdmin();

    const supabase = await createServerClient();
    const { data, error } = await supabase
      .from("site_config")
      .select("*")
      .eq("id", "00000000-0000-0000-0000-000000000001")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ site_config: data as SiteConfigRow | null });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to fetch site config";
    const status =
      message === "UNAUTHORIZED" ? 401 : message === "FORBIDDEN" ? 403 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    await requireAdmin();

    const supabase = await createServerClient();
    const body: Record<string, unknown> = await request.json();

    const allowedFields = [
      "name",
      "short_name",
      "tagline",
      "description",
      "hero_badge",
      "hero_title",
      "hero_highlight",
      "hero_description",
      "hero_primary_cta",
      "hero_secondary_cta",
      "hero_stats",
      "contact_phone",
      "contact_phone_display",
      "contact_whatsapp",
      "contact_whatsapp_display",
      "contact_address",
      "contact_city",
      "contact_country",
      "contact_google_maps_url",
      "contact_opening_hours_days",
      "contact_opening_hours_hours",
      "social_facebook",
      "social_instagram",
      "social_tiktok",
      "order_default_whatsapp_message",
      "order_url",
      "branding_logo_image",
      "branding_store_sign_image",
      "branding_hero_image",
      "branding_storefront_image",
    ];

    const updateData: Record<string, unknown> = {};
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updateData[field] = body[field];
      }
    }

    const { data, error } = await supabase
      .from("site_config")
      .update(updateData)
      .eq("id", "00000000-0000-0000-0000-000000000001")
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ site_config: data });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to update site config";
    const status =
      message === "UNAUTHORIZED" ? 401 : message === "FORBIDDEN" ? 403 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
