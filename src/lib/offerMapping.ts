import type { Offer } from "@/lib/offerUtils";
import { createWhatsAppUrl } from "@/lib/utils";

export const WHATSAPP_NUMBER = "+201208696419";

export function mapDbOfferToOffer(db: {
  id: string;
  enabled: boolean;
  title: string;
  subtitle?: string | null;
  description: string;
  discount?: string | null;
  price: number;
  old_price?: number | null;
  image: string;
  start_date: string;
  end_date: string;
  badge?: string | null;
  cta_text?: string | null;
  features?: string[] | null;
}): Offer {
  return {
    id: db.id,
    enabled: db.enabled,
    title: db.title,
    subtitle: db.subtitle ?? undefined,
    description: db.description,
    discount: db.discount ?? undefined,
    price: db.price,
    oldPrice: db.old_price ?? undefined,
    image: db.image,
    startDate: db.start_date,
    endDate: db.end_date,
    badge: db.badge ?? undefined,
    ctaText: db.cta_text ?? undefined,
    ctaLink: buildCtaLink(db),
    features: db.features ?? undefined,
  };
}

export function buildCtaLink(
  db: { title: string; price: number } | Offer,
): string {
  const message = `مرحباً مطعم الشريعى، أريد طلب ${db.title} (${db.price} ج.م)`;
  return createWhatsAppUrl(WHATSAPP_NUMBER, message);
}

export function mapOfferToDb(offer: Partial<Offer> & {
  id?: string;
}): {
  id?: string;
  enabled: boolean;
  title: string;
  subtitle?: string | null;
  description: string;
  discount?: string | null;
  price: number;
  old_price?: number | null;
  image: string;
  start_date: string;
  end_date: string;
  badge?: string | null;
  cta_text?: string | null;
  features?: string[] | null;
} {
  return {
    id: offer.id,
    enabled: offer.enabled ?? true,
    title: offer.title ?? "",
    subtitle: offer.subtitle ?? null,
    description: offer.description ?? "",
    discount: offer.discount ?? null,
    price: offer.price ?? 0,
    old_price: offer.oldPrice ?? null,
    image: offer.image ?? "",
    start_date: offer.startDate ?? "",
    end_date: offer.endDate ?? "",
    badge: offer.badge ?? null,
    cta_text: offer.ctaText ?? null,
    features: offer.features ?? null,
  };
}
