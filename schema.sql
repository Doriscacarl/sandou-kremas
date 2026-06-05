-- ============================================================
-- Sandou Kremas — Full Supabase Schema
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================


-- ── 1. INQUIRIES (contact form + concierge modal) ──────────

CREATE TABLE IF NOT EXISTS public.inquiries (
  id            uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  name          text        NOT NULL,
  email         text        NOT NULL,
  subject       text,
  message       text        NOT NULL,
  inquiry_type  text        NOT NULL DEFAULT 'General',
  created_at    timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anyone_insert_inquiries"
  ON public.inquiries FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);


-- ── 2. SUBSCRIBERS (Sandou Circle newsletter) ──────────────

CREATE TABLE IF NOT EXISTS public.subscribers (
  id            uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  email         text        NOT NULL,
  name          text,
  source        text        NOT NULL DEFAULT 'website',
  is_active     boolean     NOT NULL DEFAULT true,
  subscribed_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT subscribers_email_key UNIQUE (email)
);

ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anyone_upsert_subscribers"
  ON public.subscribers FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "anyone_update_subscribers"
  ON public.subscribers FOR UPDATE
  TO anon, authenticated
  USING (true);


-- ── 3. ORDERS ──────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.orders (
  id               uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id          uuid        REFERENCES auth.users(id) ON DELETE SET NULL,
  customer_name    text        NOT NULL,
  customer_email   text        NOT NULL,
  customer_phone   text,
  product_name     text        NOT NULL DEFAULT 'General Inquiry',
  quantity         integer     NOT NULL DEFAULT 1,
  shipping_state   text,
  shipping_address text,
  notes            text,
  status           text        NOT NULL DEFAULT 'pending',
  created_at       timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anyone_insert_orders"
  ON public.orders FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "users_view_own_orders"
  ON public.orders FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);


-- ── 4. PRODUCTS / FLAVORS ──────────────────────────────────

CREATE TABLE IF NOT EXISTS public.products (
  id                  text        PRIMARY KEY,
  name                text        NOT NULL,
  slug                text,
  tagline             text,
  description         text,
  price               numeric     NOT NULL DEFAULT 24,
  category            text,
  flavor_profile      text,
  ingredients         text,
  serving_notes       text,
  image_url           text,
  gallery_images      jsonb       NOT NULL DEFAULT '[]',
  featured            boolean     NOT NULL DEFAULT false,
  founder_favorite    boolean     NOT NULL DEFAULT false,
  hidden              boolean     NOT NULL DEFAULT false,
  in_stock            boolean     NOT NULL DEFAULT true,
  inventory_quantity  integer,
  inventory           text        NOT NULL DEFAULT 'in_stock',
  display_order       integer     NOT NULL DEFAULT 0,
  created_at          timestamptz NOT NULL DEFAULT now(),
  updated_at          timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anon_read_products"
  ON public.products FOR SELECT
  TO anon, authenticated
  USING (hidden = false);

CREATE POLICY "admin_all_products"
  ON public.products FOR ALL
  TO authenticated
  USING (auth.email() = 'doriscacarlm40@gmail.com')
  WITH CHECK (auth.email() = 'doriscacarlm40@gmail.com');


-- ── 5. MEDIA LIBRARY ───────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.media (
  id              text        PRIMARY KEY,
  file_name       text        NOT NULL,
  url             text        NOT NULL,
  alt_text        text,
  caption         text,
  category        text,
  used_on_page    text,
  used_in_section text,
  created_at      timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.media ENABLE ROW LEVEL SECURITY;

CREATE POLICY "admin_all_media"
  ON public.media FOR ALL
  TO authenticated
  USING (auth.email() = 'doriscacarlm40@gmail.com')
  WITH CHECK (auth.email() = 'doriscacarlm40@gmail.com');


-- ── 6. GALLERY ─────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.gallery (
  id              text        PRIMARY KEY,
  image_url       text        NOT NULL,
  caption         text,
  alt_text        text,
  category        text,
  featured        boolean     NOT NULL DEFAULT false,
  hidden          boolean     NOT NULL DEFAULT false,
  display_order   integer     NOT NULL DEFAULT 0,
  created_at      timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anon_read_gallery"
  ON public.gallery FOR SELECT
  TO anon, authenticated
  USING (hidden = false);

CREATE POLICY "admin_all_gallery"
  ON public.gallery FOR ALL
  TO authenticated
  USING (auth.email() = 'doriscacarlm40@gmail.com')
  WITH CHECK (auth.email() = 'doriscacarlm40@gmail.com');


-- ── 7. PAGE CONTENT ────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.page_content (
  slug        text        PRIMARY KEY,
  page_name   text,
  data        jsonb       NOT NULL DEFAULT '{}',
  updated_at  timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.page_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anon_read_page_content"
  ON public.page_content FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "admin_all_page_content"
  ON public.page_content FOR ALL
  TO authenticated
  USING (auth.email() = 'doriscacarlm40@gmail.com')
  WITH CHECK (auth.email() = 'doriscacarlm40@gmail.com');


-- ── 8. SITE SETTINGS ───────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.site_settings (
  key         text        PRIMARY KEY,
  value       text,
  updated_at  timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anon_read_site_settings"
  ON public.site_settings FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "admin_all_site_settings"
  ON public.site_settings FOR ALL
  TO authenticated
  USING (auth.email() = 'doriscacarlm40@gmail.com')
  WITH CHECK (auth.email() = 'doriscacarlm40@gmail.com');

INSERT INTO public.site_settings (key, value) VALUES
  ('business_name',   'Sandou Kremas'),
  ('contact_email',   'info@sandoukremas.com'),
  ('contact_phone',   ''),
  ('footer_text',     '© 2026 Sandou Kremas. Crafted with Heritage.'),
  ('logo_url',        ''),
  ('favicon_url',     '')
ON CONFLICT (key) DO NOTHING;


-- ── 9. SOCIAL LINKS ────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.social_links (
  platform    text        PRIMARY KEY,
  url         text        NOT NULL DEFAULT '#',
  updated_at  timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.social_links ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anon_read_social_links"
  ON public.social_links FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "admin_all_social_links"
  ON public.social_links FOR ALL
  TO authenticated
  USING (auth.email() = 'doriscacarlm40@gmail.com')
  WITH CHECK (auth.email() = 'doriscacarlm40@gmail.com');

INSERT INTO public.social_links (platform, url) VALUES
  ('instagram', '#'),
  ('tiktok',    '#'),
  ('facebook',  '#')
ON CONFLICT (platform) DO NOTHING;


-- ── 10. ADMIN READ POLICIES (existing tables) ──────────────

-- Drop duplicates if re-running
DO $$ BEGIN
  DROP POLICY IF EXISTS "admin_select_orders"     ON public.orders;
  DROP POLICY IF EXISTS "admin_update_orders"     ON public.orders;
  DROP POLICY IF EXISTS "admin_select_inquiries"  ON public.inquiries;
  DROP POLICY IF EXISTS "admin_select_subscribers" ON public.subscribers;
  DROP POLICY IF EXISTS "admin_update_subscribers" ON public.subscribers;
  DROP POLICY IF EXISTS "admin_delete_subscribers" ON public.subscribers;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

CREATE POLICY "admin_select_orders"
  ON public.orders FOR SELECT TO authenticated
  USING (auth.email() = 'doriscacarlm40@gmail.com');

CREATE POLICY "admin_update_orders"
  ON public.orders FOR UPDATE TO authenticated
  USING (auth.email() = 'doriscacarlm40@gmail.com')
  WITH CHECK (auth.email() = 'doriscacarlm40@gmail.com');

CREATE POLICY "admin_select_inquiries"
  ON public.inquiries FOR SELECT TO authenticated
  USING (auth.email() = 'doriscacarlm40@gmail.com');

CREATE POLICY "admin_select_subscribers"
  ON public.subscribers FOR SELECT TO authenticated
  USING (auth.email() = 'doriscacarlm40@gmail.com');

CREATE POLICY "admin_update_subscribers"
  ON public.subscribers FOR UPDATE TO authenticated
  USING (auth.email() = 'doriscacarlm40@gmail.com')
  WITH CHECK (auth.email() = 'doriscacarlm40@gmail.com');

CREATE POLICY "admin_delete_subscribers"
  ON public.subscribers FOR DELETE TO authenticated
  USING (auth.email() = 'doriscacarlm40@gmail.com');


-- ── 11. STORAGE BUCKET (run separately or via dashboard) ───
-- Create a public bucket named "sandou-media" in:
--   Supabase Dashboard → Storage → New bucket
--   Name: sandou-media
--   Public: ON
-- Or run via Supabase Storage API. The admin panel will
-- attempt to create it automatically on first upload.
