import type { SiteConfig } from "@/data/siteConfig";
import { siteConfig as fallbackConfig } from "@/data/siteConfig";
import { createServerClient } from "@/lib/supabase/server";
import { mapDbSiteConfigToSiteConfig } from "@/lib/siteConfigMapping";

export async function getSiteConfig(): Promise<SiteConfig> {
  try {
    const supabase = await createServerClient();

    const { data, error } = await supabase.rpc("get_public_site_config");

    if (!error && data) {
      const row = Array.isArray(data) ? data[0] : data;
      return mapDbSiteConfigToSiteConfig(row);
    }

    return fallbackConfig;
  } catch (err) {
    console.error(
      "[getSiteConfig] Supabase fetch failed, using static fallback:",
      err instanceof Error ? err.message : "unknown error",
    );
    return fallbackConfig;
  }
}
