export interface GalleryItem {
  id: string;
  title: string;
  category: "store" | "chicken" | "beef" | "meals" | "menu-sheets";
  categoryLabel: string;
  image: string;
  description: string;
}

export const galleryData: GalleryItem[] = [
  {
    id: "gal-storefront",
    title: "واجهة مطعم الشريعى",
    category: "store",
    categoryLabel: "المطعم",
    image: "/images/storefront/facade.jpg",
    description: "واجهة المطعم العصرية بتصميم خشبي وإضاءات LED راقية في خدمة عملائنا يومياً.",
  },
  {
    id: "gal-hero-platter",
    title: "صواني العروض الملكية المقرمشة",
    category: "meals",
    categoryLabel: "الوجبات",
    image: "/images/hero/hero-platter.jpg",
    description: "تشكيلة غنية من قطع البروست الذهبي والزنجر المقرمش والأرز البسمتي مع تشكيلة صوصاتنا الخاصة.",
  },
  {
    id: "gal-menu-offers",
    title: "قائمة العروض الخاصة والتوفير",
    category: "menu-sheets",
    categoryLabel: "لوحة العروض",
    image: "/images/gallery/menu-offers.jpg",
    description: "لوحة عروض التوفير الفردية والعائلية مع المقبلات ووجبات الريزو.",
  },
  {
    id: "gal-menu-chicken",
    title: "قائمة ساندوتشات الدجاج والزنجر",
    category: "menu-sheets",
    categoryLabel: "ساندوتشات الفراخ",
    image: "/images/gallery/menu-chicken.jpg",
    description: "تشكيلة ساندوتشات الدجاج الفيليه وهرم الفراخ وتويستر السوري والزنجر الفرنساوي.",
  },
  {
    id: "gal-menu-meals",
    title: "قائمة وجبات البروست والزنجر",
    category: "menu-sheets",
    categoryLabel: "الوجبات",
    image: "/images/gallery/menu-meals.jpg",
    description: "وجبات البروست المقرمش من وجبة الأطفال حتى وجبة الأكيلة 12 قطعة ووجبة الكبير 15 قطعة زنجر.",
  },
  {
    id: "gal-menu-beef",
    title: "قائمة برجر اللحم البلدي",
    category: "menu-sheets",
    categoryLabel: "برجر اللحم",
    image: "/images/gallery/menu-beef.jpg",
    description: "برجر اللحم المشوي على الفحم وأهرامات اللحم مع أصابع الموتزريلا وحلقات البصل المقرمشة.",
  },
];
