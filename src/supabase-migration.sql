-- ============================================
-- SUPABASE SQL MIGRATION v2 (Security Hardening)
-- Restaurant Website - Offers Admin Dashboard
-- ============================================
-- This migration is idempotent and safe to re-run.
-- It uses DROP ... IF EXISTS followed by CREATE patterns
-- for all objects that may already exist.

-- ============================================
-- 1. PROFILES TABLE
-- ============================================
create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'user',
  full_name text,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(user_id)
);

-- Indexes
create index if not exists idx_profiles_user_id
  on public.profiles(user_id);
create index if not exists idx_profiles_role
  on public.profiles(role);

-- Automatically create profile on new user signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (user_id, role)
  values (new.id, 'user');
  return new;
end;
$$;

DROP TRIGGER IF EXISTS trg_on_auth_user_created ON auth.users;
create trigger trg_on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

-- Updated_at trigger for profiles
create or replace function public.update_updated_at()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

DROP TRIGGER IF EXISTS trg_profiles_updated_at ON public.profiles;
create trigger trg_profiles_updated_at
  before update on public.profiles
  for each row
  execute function public.update_updated_at();

-- ============================================
-- 2. HELPER FUNCTION: Check if user is admin
-- ============================================
create or replace function public.is_admin()
returns boolean
language plpgsql
security definer set search_path = ''
stable
as $$
declare
  is_admin boolean;
begin
  select exists(
    select 1 from public.profiles
    where user_id = auth.uid()
    and role = 'admin'
  ) into is_admin;
  return coalesce(is_admin, false);
end;
$$;

-- ============================================
-- 3. OFFERS TABLE
-- ============================================
create table if not exists public.offers (
  id uuid primary key default gen_random_uuid(),
  enabled boolean not null default true,
  title text not null,
  subtitle text,
  description text not null,
  discount text,
  price int not null default 0,
  old_price int,
  image text,
  start_date timestamptz not null,
  end_date timestamptz not null,
  badge text,
  cta_text text,
  features text[],
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Indexes
create index if not exists idx_offers_enabled
  on public.offers (enabled);

create index if not exists idx_offers_date_range
  on public.offers (start_date, end_date);

create index if not exists idx_offers_active
  on public.offers (enabled, start_date, end_date)
  where enabled = true;

-- ============================================
-- 4. OFFERS RLS POLICIES
-- ============================================
alter table public.offers enable row level security;

DROP POLICY IF EXISTS "Public can read active offers" ON public.offers;
CREATE POLICY "Public can read active offers"
  ON public.offers FOR SELECT
  TO anon, authenticated
  USING (
    enabled = true
    AND start_date <= now()
    AND end_date >= now()
  );

DROP POLICY IF EXISTS "Authenticated users read active offers" ON public.offers;
CREATE POLICY "Authenticated users read active offers"
  ON public.offers FOR SELECT
  TO authenticated
  USING (
    enabled = true
    AND start_date <= now()
    AND end_date >= now()
    AND NOT public.is_admin()
  );

DROP POLICY IF EXISTS "Admin can read all offers" ON public.offers;
CREATE POLICY "Admin can read all offers"
  ON public.offers FOR SELECT
  TO authenticated
  USING (public.is_admin());

DROP POLICY IF EXISTS "Admin can insert offers" ON public.offers;
CREATE POLICY "Admin can insert offers"
  ON public.offers FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admin can update offers" ON public.offers;
CREATE POLICY "Admin can update offers"
  ON public.offers FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admin can delete offers" ON public.offers;
CREATE POLICY "Admin can delete offers"
  ON public.offers FOR DELETE
  TO authenticated
  USING (public.is_admin());

-- ============================================
-- 5. STORAGE BUCKET FOR OFFER IMAGES
-- ============================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('offer-images', 'offer-images', true)
ON CONFLICT DO NOTHING;

-- Storage policies
DROP POLICY IF EXISTS "Public read offer images" ON storage.objects;
CREATE POLICY "Public read offer images"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'offer-images');

DROP POLICY IF EXISTS "Admin insert offer images" ON storage.objects;
CREATE POLICY "Admin insert offer images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'offer-images'
    AND public.is_admin()
  );

DROP POLICY IF EXISTS "Admin update offer images" ON storage.objects;
CREATE POLICY "Admin update offer images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'offer-images'
    AND public.is_admin()
  )
  WITH CHECK (
    bucket_id = 'offer-images'
    AND public.is_admin()
  );

DROP POLICY IF EXISTS "Admin delete offer images" ON storage.objects;
CREATE POLICY "Admin delete offer images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'offer-images'
    AND public.is_admin()
  );

-- ============================================
-- 6. UPDATED_AT TRIGGER FOR OFFERS
-- ============================================
DROP TRIGGER IF EXISTS trg_offers_updated_at ON public.offers;
CREATE TRIGGER trg_offers_updated_at
  BEFORE UPDATE ON public.offers
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

-- ============================================
-- 7. SEED: Create default admin user
-- NOTE: Run this manually after creating the user in Supabase Auth dashboard
-- Replace 'user-uuid-here' with the actual UUID of the admin user
-- ============================================
-- INSERT INTO public.profiles (user_id, role)
-- VALUES ('user-uuid-here', 'admin');

-- ============================================
-- 8. MENU ITEMS TABLE
-- ============================================
create table if not exists public.menu_items (
  id uuid primary key default gen_random_uuid(),
  enabled boolean not null default true,
  name text not null,
  description text not null,
  price int not null default 0,
  old_price int,
  image text,
  category text not null,
  category_name text not null,
  featured boolean not null default false,
  badge text,
  sort_order int not null default 0,
  ingredients text[],
  spice_level text,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  constraint chk_menu_items_category check (category in ('beef', 'chicken', 'broast', 'zinger', 'combos', 'sides', 'drinks')),
  constraint chk_menu_items_spice_level check (spice_level in ('regular', 'spicy', 'none'))
);

-- Indexes
create index if not exists idx_menu_items_enabled
  on public.menu_items (enabled);

create index if not exists idx_menu_items_category
  on public.menu_items (category, enabled);

create index if not exists idx_menu_items_featured
  on public.menu_items (featured, enabled)
  where enabled = true;

create index if not exists idx_menu_items_sort_order
  on public.menu_items (sort_order)
  where enabled = true;

-- ============================================
-- 9. MENU ITEMS RLS POLICIES
-- ============================================
alter table public.menu_items enable row level security;

DROP POLICY IF EXISTS "Public can read enabled menu items" ON public.menu_items;
CREATE POLICY "Public can read enabled menu items"
  ON public.menu_items FOR SELECT
  TO anon, authenticated
  USING (enabled = true);

DROP POLICY IF EXISTS "Authenticated non-admin users read enabled menu items" ON public.menu_items;
CREATE POLICY "Authenticated non-admin users read enabled menu items"
  ON public.menu_items FOR SELECT
  TO authenticated
  USING (
    enabled = true
    AND NOT public.is_admin()
  );

DROP POLICY IF EXISTS "Admin can read all menu items" ON public.menu_items;
CREATE POLICY "Admin can read all menu items"
  ON public.menu_items FOR SELECT
  TO authenticated
  USING (public.is_admin());

DROP POLICY IF EXISTS "Admin can insert menu items" ON public.menu_items;
CREATE POLICY "Admin can insert menu items"
  ON public.menu_items FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admin can update menu items" ON public.menu_items;
CREATE POLICY "Admin can update menu items"
  ON public.menu_items FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admin can delete menu items" ON public.menu_items;
CREATE POLICY "Admin can delete menu items"
  ON public.menu_items FOR DELETE
  TO authenticated
  USING (public.is_admin());

-- ============================================
-- 10. UPDATED_AT TRIGGER FOR MENU ITEMS
-- ============================================
DROP TRIGGER IF EXISTS trg_menu_items_updated_at ON public.menu_items;
CREATE TRIGGER trg_menu_items_updated_at
  BEFORE UPDATE ON public.menu_items
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

-- ============================================
-- 11. STORAGE BUCKET FOR MENU IMAGES
-- ============================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('menu-images', 'menu-images', true)
ON CONFLICT DO NOTHING;

-- Storage policies
DROP POLICY IF EXISTS "Public read menu images" ON storage.objects;
CREATE POLICY "Public read menu images"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'menu-images');

DROP POLICY IF EXISTS "Admin insert menu images" ON storage.objects;
CREATE POLICY "Admin insert menu images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'menu-images'
    AND public.is_admin()
  );

DROP POLICY IF EXISTS "Admin update menu images" ON storage.objects;
CREATE POLICY "Admin update menu images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'menu-images'
    AND public.is_admin()
  )
  WITH CHECK (
    bucket_id = 'menu-images'
    AND public.is_admin()
  );

DROP POLICY IF EXISTS "Admin delete menu images" ON storage.objects;
CREATE POLICY "Admin delete menu images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'menu-images'
    AND public.is_admin()
  );

-- ============================================
-- 12. SITE CONFIG TABLE
-- ============================================
create table if not exists public.site_config (
  id uuid primary key default gen_random_uuid(),
  name text not null default 'مطعم الشريعى',
  short_name text not null default 'الشريعى',
  tagline text,
  description text,
  hero_badge text,
  hero_title text,
  hero_highlight text,
  hero_description text,
  hero_primary_cta text,
  hero_secondary_cta text,
  hero_stats jsonb,
  contact_phone text,
  contact_phone_display text,
  contact_whatsapp text,
  contact_whatsapp_display text,
  contact_address text,
  contact_city text,
  contact_country text,
  contact_google_maps_url text,
  contact_opening_hours_days text,
  contact_opening_hours_hours text,
  social_facebook text,
  social_instagram text,
  social_tiktok text,
  order_default_whatsapp_message text,
  order_url text,
  branding_logo_image text,
  branding_store_sign_image text,
  branding_hero_image text,
  branding_storefront_image text,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  constraint site_config_singleton unique (id)
);

-- Insert default singleton row from current static config
insert into public.site_config (
  id, name, short_name, tagline, description,
  hero_badge, hero_title, hero_highlight, hero_description, hero_primary_cta, hero_secondary_cta, hero_stats,
  contact_phone, contact_phone_display, contact_whatsapp, contact_whatsapp_display,
  contact_address, contact_city, contact_country, contact_google_maps_url,
  contact_opening_hours_days, contact_opening_hours_hours,
  social_facebook, social_instagram, social_tiktok,
  order_default_whatsapp_message, order_url,
  branding_logo_image, branding_store_sign_image, branding_hero_image, branding_storefront_image
) values (
  '00000000-0000-0000-0000-000000000001',
  'مطعم الشريعى',
  'الشريعى',
  'فرايد تشكن وبرجر - طعم أصلي وقرمشة لا تقاوم',
  'أشهى الوجبات الفرايد تشكن المقرمشة والبرجر المشوي على أصوله بمكونات طازجة 100% وتتبيلات خاصة ومميزة.',
  '🔥 طعم يستحق التجربة | طازج 100%',
  'أشهى الأطباق ومكونات مختارة',
  'وتجربة مختلفة في كل مرة',
  'نقدم لكم أفخم قطع الفرايد تشكن المقرمشة الذهبية وساندوتشات البورجر العملاقة المحضرة يومياً من أجود المكونات الطازجة مع باقة صوصاتنا الخاصة.',
  'اطلب الآن عبر واتساب',
  'استكشف قائمة الطعام',
  '[{"value":"100%","label":"فراخ طازجة يومياً"},{"value":"+15","label":"خلطة وصوص سري"},{"value":"30 دقيقة","label":"متوسط وقت التوصيل"},{"value":"4.9 ★","label":"تقييم العملاء"}]',
  '01208696419',
  '0120 - 869 - 6419',
  '+201208696419',
  '+20120 - 869 - 6419',
  'شارع السلام، امام مدرسة الصنايع، مغاغة / المنيا',
  'المنيا',
  'مصر',
  'https://maps.google.com/?q=El-Shereiy+Fried+Chicken',
  'طوال أيام الأسبوع بدون انقطاع',
  'من الساعة 12:30 ظهراً حتى 2:30 صباحاً',
  'https://facebook.com',
  'https://instagram.com',
  'https://tiktok.com',
  'مرحباً مطعم الشريعى، أريد الاستفسار والطلب من المنيو.',
  'https://wa.me/201208696419?text=%D9%85%D8%B1%D8%AD%D8%A8%D8%A7%D8%8C+%D8%A3%D8%B1%D9%8A%D8%AF+%D8%B7%D9%84%D8%A8+%D8%A7%D9%84%D8%B9%D9%85%D9%84+%D9%85%D9%86+%D8%A7%D9%84%D9%85%D9%86%D9%8A%D9%88.',
  '/images/logo/logo-emblem.jpg',
  '/images/logo/store-sign.jpg',
  '/images/hero/hero-platter.jpg',
  '/images/storefront/facade.jpg'
)
on conflict (id) do nothing;

-- Make id fixed to singleton
alter table public.site_config
  add constraint chk_site_config_singleton check (id = '00000000-0000-0000-0000-000000000001');

-- Index for singleton lookup
create index if not exists idx_site_config_id
  on public.site_config (id);

-- ============================================
-- 13. SITE CONFIG RLS POLICIES
-- ============================================
alter table public.site_config enable row level security;

DROP POLICY IF EXISTS "Admin can read site config" ON public.site_config;
CREATE POLICY "Admin can read site config"
  ON public.site_config FOR SELECT
  TO authenticated
  USING (public.is_admin());

DROP POLICY IF EXISTS "Admin can insert site config" ON public.site_config;
CREATE POLICY "Admin can insert site config"
  ON public.site_config FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admin can update site config" ON public.site_config;
CREATE POLICY "Admin can update site config"
  ON public.site_config FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admin can delete site config" ON public.site_config;
CREATE POLICY "Admin can delete site config"
  ON public.site_config FOR DELETE
  TO authenticated
  USING (public.is_admin());

-- ============================================
-- 14. UPDATED_AT TRIGGER FOR SITE CONFIG
-- ============================================
DROP TRIGGER IF EXISTS trg_site_config_updated_at ON public.site_config;
CREATE TRIGGER trg_site_config_updated_at
  BEFORE UPDATE ON public.site_config
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

-- ============================================
-- 15. PUBLIC SITE CONFIG RPC
-- SECURITY DEFINER bypasses table RLS.
-- Callable by anon and authenticated.
-- Returns only public-safe fields.
-- ============================================
CREATE OR REPLACE FUNCTION public.get_public_site_config()
RETURNS TABLE (
  name text,
  short_name text,
  tagline text,
  description text,
  hero_badge text,
  hero_title text,
  hero_highlight text,
  hero_description text,
  hero_primary_cta text,
  hero_secondary_cta text,
  hero_stats jsonb,
  contact_phone text,
  contact_phone_display text,
  contact_whatsapp text,
  contact_whatsapp_display text,
  contact_address text,
  contact_city text,
  contact_country text,
  contact_google_maps_url text,
  contact_opening_hours_days text,
  contact_opening_hours_hours text,
  social_facebook text,
  social_instagram text,
  social_tiktok text,
  order_default_whatsapp_message text,
  order_url text,
  branding_logo_image text,
  branding_store_sign_image text,
  branding_hero_image text,
  branding_storefront_image text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT
    s.name,
    s.short_name,
    s.tagline,
    s.description,
    s.hero_badge,
    s.hero_title,
    s.hero_highlight,
    s.hero_description,
    s.hero_primary_cta,
    s.hero_secondary_cta,
    s.hero_stats,
    s.contact_phone,
    s.contact_phone_display,
    s.contact_whatsapp,
    s.contact_whatsapp_display,
    s.contact_address,
    s.contact_city,
    s.contact_country,
    s.contact_google_maps_url,
    s.contact_opening_hours_days,
    s.contact_opening_hours_hours,
    s.social_facebook,
    s.social_instagram,
    s.social_tiktok,
    s.order_default_whatsapp_message,
    s.order_url,
    s.branding_logo_image,
    s.branding_store_sign_image,
    s.branding_hero_image,
    s.branding_storefront_image
  FROM public.site_config s
  WHERE s.id = '00000000-0000-0000-0000-000000000001';
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_public_site_config() TO anon, authenticated;
