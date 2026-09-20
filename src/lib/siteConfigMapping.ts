import type { SiteConfig } from "@/data/siteConfig";

export type SiteConfigRow = {
  id: string;
  name: string;
  short_name: string;
  tagline: string | null;
  description: string | null;
  hero_badge: string | null;
  hero_title: string | null;
  hero_highlight: string | null;
  hero_description: string | null;
  hero_primary_cta: string | null;
  hero_secondary_cta: string | null;
  hero_stats: unknown;
  contact_phone: string | null;
  contact_phone_display: string | null;
  contact_whatsapp: string | null;
  contact_whatsapp_display: string | null;
  contact_address: string | null;
  contact_city: string | null;
  contact_country: string | null;
  contact_google_maps_url: string | null;
  contact_opening_hours_days: string | null;
  contact_opening_hours_hours: string | null;
  social_facebook: string | null;
  social_instagram: string | null;
  social_tiktok: string | null;
  order_default_whatsapp_message: string | null;
  order_url: string | null;
  branding_logo_image: string | null;
  branding_store_sign_image: string | null;
  branding_hero_image: string | null;
  branding_storefront_image: string | null;
  created_at: string;
  updated_at: string;
};

export function mapDbSiteConfigToSiteConfig(
  db: SiteConfigRow,
): SiteConfig {
  let stats: Array<{ value: string; label: string }> = [];
  if (db.hero_stats) {
    try {
      const parsed = JSON.parse(
        typeof db.hero_stats === "string" ? db.hero_stats : JSON.stringify(db.hero_stats),
      );
      if (Array.isArray(parsed)) {
        stats = parsed;
      }
    } catch {
      stats = [];
    }
  }

  return {
    name: db.name,
    shortName: db.short_name,
    tagline: db.tagline ?? "",
    description: db.description ?? "",
    hero: {
      badge: db.hero_badge ?? "",
      title: db.hero_title ?? "",
      highlight: db.hero_highlight ?? "",
      description: db.hero_description ?? "",
      primaryCta: db.hero_primary_cta ?? "",
      secondaryCta: db.hero_secondary_cta ?? "",
      stats,
    },
    contact: {
      phone: db.contact_phone ?? "",
      phoneDisplay: db.contact_phone_display ?? "",
      whatsapp: db.contact_whatsapp ?? "",
      whatsappDisplay: db.contact_whatsapp_display ?? "",
      address: db.contact_address ?? "",
      city: db.contact_city ?? "",
      country: db.contact_country ?? "",
      googleMapsUrl: db.contact_google_maps_url ?? "",
      openingHours: {
        days: db.contact_opening_hours_days ?? "",
        hours: db.contact_opening_hours_hours ?? "",
      },
    },
    social: {
      facebook: db.social_facebook ?? "",
      instagram: db.social_instagram ?? "",
      tiktok: db.social_tiktok ?? "",
    },
    order: {
      defaultWhatsappMessage: db.order_default_whatsapp_message ?? "",
      orderUrl: db.order_url ?? "",
    },
    branding: {
      logoImage: db.branding_logo_image ?? "",
      storeSignImage: db.branding_store_sign_image ?? "",
      heroImage: db.branding_hero_image ?? "",
      storefrontImage: db.branding_storefront_image ?? "",
    },
  };
}

export function mapSiteConfigToDb(
  config: Partial<SiteConfig>,
): Partial<SiteConfigRow> {
  return {
    name: config.name,
    short_name: config.shortName,
    tagline: config.tagline,
    description: config.description,
    hero_badge: config.hero?.badge,
    hero_title: config.hero?.title,
    hero_highlight: config.hero?.highlight,
    hero_description: config.hero?.description,
    hero_primary_cta: config.hero?.primaryCta,
    hero_secondary_cta: config.hero?.secondaryCta,
    hero_stats: config.hero?.stats
      ? JSON.stringify(config.hero.stats)
      : null,
    contact_phone: config.contact?.phone,
    contact_phone_display: config.contact?.phoneDisplay,
    contact_whatsapp: config.contact?.whatsapp,
    contact_whatsapp_display: config.contact?.whatsappDisplay,
    contact_address: config.contact?.address,
    contact_city: config.contact?.city,
    contact_country: config.contact?.country,
    contact_google_maps_url: config.contact?.googleMapsUrl,
    contact_opening_hours_days: config.contact?.openingHours?.days,
    contact_opening_hours_hours: config.contact?.openingHours?.hours,
    social_facebook: config.social?.facebook,
    social_instagram: config.social?.instagram,
    social_tiktok: config.social?.tiktok,
    order_default_whatsapp_message: config.order?.defaultWhatsappMessage,
    order_url: config.order?.orderUrl,
    branding_logo_image: config.branding?.logoImage,
    branding_store_sign_image: config.branding?.storeSignImage,
    branding_hero_image: config.branding?.heroImage,
    branding_storefront_image: config.branding?.storefrontImage,
  };
}
