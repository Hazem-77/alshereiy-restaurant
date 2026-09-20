import { Offer } from "@/lib/offerUtils";
import { offersData } from "@/data/offers";
import { getActiveOffers } from "@/lib/offerUtils";
import { mapDbOfferToOffer } from "@/lib/offerMapping";
import { createServerClient } from "@/lib/supabase/server";

/**
 * Fetch public offers from Supabase with graceful fallback.
 *
 * Returns only active offers (enabled + within date range).
 * Falls back to static offersData on any failure.
 */
export async function getPublicOffers(): Promise<Offer[]> {
  try {
    const supabase = await createServerClient();
    const { data, error } = await supabase.from("offers").select("*");

    if (error || !data) {
      return offersData;
    }

    const offers = data.map(mapDbOfferToOffer);
    return getActiveOffers(offers);
  } catch (err) {
    console.error("[getPublicOffers] Supabase fetch failed, using static fallback:", err instanceof Error ? err.message : "unknown error");
    return offersData;
  }
}
