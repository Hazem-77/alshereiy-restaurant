export interface SiteConfig {
  name: string;
  shortName: string;
  tagline: string;
  description: string;
  hero: {
    badge: string;
    title: string;
    highlight: string;
    description: string;
    primaryCta: string;
    secondaryCta: string;
    stats: Array<{ value: string; label: string }>;
  };
  contact: {
    phone: string;
    phoneDisplay: string;
    whatsapp: string;
    whatsappDisplay: string;
    address: string;
    city: string;
    country: string;
    googleMapsUrl: string;
    openingHours: {
      days: string;
      hours: string;
    };
  };
  social: {
    facebook: string;
    instagram: string;
    tiktok: string;
  };
  order: {
    defaultWhatsappMessage: string;
    orderUrl: string;
  };
  branding: {
    logoImage: string;
    storeSignImage: string;
    heroImage: string;
    storefrontImage: string;
  };
}

const PHONE_NUMBER = "01208696419";
const WHATSAPP_NUMBER = "+201208696419";
const DEFAULT_ORDER_MSG = "مرحباً مطعم الشريعى، أريد الاستفسار والطلب من المنيو.";

export const siteConfig: SiteConfig = {
  name: "مطعم الشريعى",
  shortName: "الشريعى",
  tagline: "فرايد تشكن وبرجر - طعم أصلي وقرمشة لا تقاوم",
  description:
    "أشهى وجبات الفرايد تشكن المقرمشة والبرجر المشوي على أصوله بمكونات طازجة 100% وتتبيلات خاصة ومميزة.",
  hero: {
    badge: "🔥 طعم يستحق التجربة | طازج 100%",
    title: "أشهى الأطباق ومكونات مختارة",
    highlight: "وتجربة مختلفة في كل مرة",
    description:
      "نقدم لكم أفخم قطع الفرايد تشكن المقرمشة الذهبية وساندوتشات البرجر العملاقة المحضرة يومياً من أجود المكونات الطازجة مع باقة صوصاتنا الخاصة.",
    primaryCta: "اطلب الآن عبر واتساب",
    secondaryCta: "استكشف قائمة الطعام",
    stats: [
      { value: "100%", label: "فراخ طازجة يومياً" },
      { value: "+15", label: "خلطة وصوص سري" },
      { value: "30 دقيقة", label: "متوسط وقت التوصيل" },
      { value: "4.9 ★", label: "تقييم العملاء" },
    ],
  },
  contact: {
    phone: PHONE_NUMBER,
    phoneDisplay: "0120 - 869 - 6419",
    whatsapp: WHATSAPP_NUMBER,
    whatsappDisplay: "0120 - 869 - 6419",
    address: "شارع بورسعيد، بجوار ميدان الساعة، مغاغة / مصر",
    city: "مغاغة",
    country: "مصر",
    googleMapsUrl: "https://maps.google.com/?q=El-Shereiy+Fried+Chicken",
    openingHours: {
      days: "طوال أيام الأسبوع بدون انقطاع",
      hours: "من الساعة 12:30 ظهراً حتى 2:30 صباحاً",
    },
  },
  social: {
    facebook: "https://facebook.com",
    instagram: "https://instagram.com",
    tiktok: "https://tiktok.com",
  },
  order: {
    defaultWhatsappMessage: DEFAULT_ORDER_MSG,
    orderUrl: `https://wa.me/201208696419?text=${encodeURIComponent(DEFAULT_ORDER_MSG)}`,
  },
  branding: {
    logoImage: "/images/logo/logo-emblem.jpg",
    storeSignImage: "/images/logo/store-sign.jpg",
    heroImage: "/images/hero/hero-platter.jpg",
    storefrontImage: "/images/storefront/facade.jpg",
  },
};
