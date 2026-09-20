import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { mapDbSiteConfigToSiteConfig } from "@/lib/siteConfigMapping";

export async function GET() {
  try {
    const supabase = await createServerClient();

    // Primary: SECURITY DEFINER RPC (bypasses RLS).
    const { data: rpcData, error: rpcError } = await supabase.rpc(
      "get_public_site_config"
    );

    if (!rpcError && rpcData) {
      const row = Array.isArray(rpcData) ? rpcData[0] : rpcData;
      const siteConfig = mapDbSiteConfigToSiteConfig(row);
      return NextResponse.json({ siteConfig });
    }

    // Fallback: direct query (for dev/build before migration is applied).
    // In production, RPC must exist due to RLS.
    const { data: directData, error: directError } = await supabase
      .from("site_config")
      .select("*")
      .eq("id", "00000000-0000-0000-0000-000000000001")
      .single();

    if (directError || !directData) {
      return NextResponse.json({ siteConfig: null });
    }

    const siteConfig = mapDbSiteConfigToSiteConfig(directData);
    return NextResponse.json({ siteConfig });
  } catch {
    return NextResponse.json({ siteConfig: null });
  }
}
