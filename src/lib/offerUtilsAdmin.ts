import { SupabaseClient, type AuthSession, type User } from "@supabase/supabase-js";

export const WHATSAPP_NUMBER = "+201208696419";

export function buildOfferCtaLink(title: string, price: number): string {
  const message = `مرحباً مطعم الشريعى، أريد طلب ${title} (${price} ج.م)`;
  const cleanPhone = WHATSAPP_NUMBER.replace(/[^0-9]/g, "");
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}
