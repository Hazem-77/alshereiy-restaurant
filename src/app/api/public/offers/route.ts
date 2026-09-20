import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { getActiveOffers } from "@/lib/offerUtils";
import { mapDbOfferToOffer } from "@/lib/offerMapping";

export async function GET() {
  try {
    const supabase = await createServerClient();
    const { data, error } = await supabase.from("offers").select("*");

    if (error || !data) {
      return NextResponse.json({ offers: [] });
    }

    const offers = data.map(mapDbOfferToOffer);
    const activeOffers = getActiveOffers(offers);
    return NextResponse.json({ offers: activeOffers });
  } catch {
    return NextResponse.json({ offers: [] });
  }
}
