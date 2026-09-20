import type { MenuItem } from "@/data/menu";

export type MenuItemRow = {
  id: string;
  enabled: boolean;
  name: string;
  description: string;
  price: number;
  old_price: number | null;
  image: string | null;
  category: string;
  category_name: string;
  featured: boolean;
  badge: string | null;
  sort_order: number;
  ingredients: string[] | null;
  spice_level: string | null;
  created_at: string;
  updated_at: string;
};

export function mapDbMenuItemToMenuItem(
  db: MenuItemRow,
): MenuItem {
  return {
    id: db.id,
    name: db.name,
    description: db.description,
    price: db.price,
    oldPrice: db.old_price ?? undefined,
    image: db.image ?? "",
    category: db.category as MenuItem["category"],
    categoryName: db.category_name,
    featured: db.featured,
    badge: db.badge ?? undefined,
    ingredients: db.ingredients ?? undefined,
    spiceLevel: db.spice_level as MenuItem["spiceLevel"],
  };
}

export function mapMenuItemToDb(
  item: Partial<MenuItem> & { id?: string; sort_order?: number },
): {
  id?: string;
  enabled: boolean;
  name: string;
  description: string;
  price: number;
  old_price: number | null;
  image: string | null;
  category: string;
  category_name: string;
  featured: boolean;
  badge: string | null;
  sort_order: number;
  ingredients: string[] | null;
  spice_level: string | null;
} {
  return {
    id: item.id,
    enabled: true,
    name: item.name ?? "",
    description: item.description ?? "",
    price: item.price ?? 0,
    old_price: item.oldPrice ?? null,
    image: item.image ?? null,
    category: item.category ?? "chicken",
    category_name: item.categoryName ?? "",
    featured: item.featured ?? false,
    badge: item.badge ?? null,
    sort_order: item.sort_order ?? 0,
    ingredients: item.ingredients ?? null,
    spice_level: item.spiceLevel ?? null,
  };
}
