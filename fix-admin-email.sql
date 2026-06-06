DROP POLICY IF EXISTS "admin_all_products" ON public.products;
CREATE POLICY "admin_all_products" ON public.products FOR ALL TO authenticated
  USING (auth.email() = 'teamloxen@gmail.com')
  WITH CHECK (auth.email() = 'teamloxen@gmail.com');

DROP POLICY IF EXISTS "admin_all_media" ON public.media;
CREATE POLICY "admin_all_media" ON public.media FOR ALL TO authenticated
  USING (auth.email() = 'teamloxen@gmail.com')
  WITH CHECK (auth.email() = 'teamloxen@gmail.com');

DROP POLICY IF EXISTS "admin_all_gallery" ON public.gallery;
CREATE POLICY "admin_all_gallery" ON public.gallery FOR ALL TO authenticated
  USING (auth.email() = 'teamloxen@gmail.com')
  WITH CHECK (auth.email() = 'teamloxen@gmail.com');

DROP POLICY IF EXISTS "admin_all_page_content" ON public.page_content;
CREATE POLICY "admin_all_page_content" ON public.page_content FOR ALL TO authenticated
  USING (auth.email() = 'teamloxen@gmail.com')
  WITH CHECK (auth.email() = 'teamloxen@gmail.com');

DROP POLICY IF EXISTS "admin_all_site_settings" ON public.site_settings;
CREATE POLICY "admin_all_site_settings" ON public.site_settings FOR ALL TO authenticated
  USING (auth.email() = 'teamloxen@gmail.com')
  WITH CHECK (auth.email() = 'teamloxen@gmail.com');

DROP POLICY IF EXISTS "admin_all_social_links" ON public.social_links;
CREATE POLICY "admin_all_social_links" ON public.social_links FOR ALL TO authenticated
  USING (auth.email() = 'teamloxen@gmail.com')
  WITH CHECK (auth.email() = 'teamloxen@gmail.com');

DROP POLICY IF EXISTS "admin_select_orders" ON public.orders;
DROP POLICY IF EXISTS "admin_update_orders" ON public.orders;
CREATE POLICY "admin_select_orders" ON public.orders FOR SELECT TO authenticated
  USING (auth.email() = 'teamloxen@gmail.com');
CREATE POLICY "admin_update_orders" ON public.orders FOR UPDATE TO authenticated
  USING (auth.email() = 'teamloxen@gmail.com')
  WITH CHECK (auth.email() = 'teamloxen@gmail.com');

DROP POLICY IF EXISTS "admin_select_inquiries" ON public.inquiries;
CREATE POLICY "admin_select_inquiries" ON public.inquiries FOR SELECT TO authenticated
  USING (auth.email() = 'teamloxen@gmail.com');

DROP POLICY IF EXISTS "admin_select_subscribers" ON public.subscribers;
DROP POLICY IF EXISTS "admin_update_subscribers" ON public.subscribers;
DROP POLICY IF EXISTS "admin_delete_subscribers" ON public.subscribers;
CREATE POLICY "admin_select_subscribers" ON public.subscribers FOR SELECT TO authenticated
  USING (auth.email() = 'teamloxen@gmail.com');
CREATE POLICY "admin_update_subscribers" ON public.subscribers FOR UPDATE TO authenticated
  USING (auth.email() = 'teamloxen@gmail.com')
  WITH CHECK (auth.email() = 'teamloxen@gmail.com');
CREATE POLICY "admin_delete_subscribers" ON public.subscribers FOR DELETE TO authenticated
  USING (auth.email() = 'teamloxen@gmail.com');

CREATE TABLE IF NOT EXISTS public.customers (
  email           text        PRIMARY KEY,
  name_override   text,
  phone_override  text,
  address         text,
  state           text,
  tags            jsonb       NOT NULL DEFAULT '[]',
  notes           jsonb       NOT NULL DEFAULT '[]',
  hidden          boolean     NOT NULL DEFAULT false,
  updated_at      timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "admin_all_customers" ON public.customers;
CREATE POLICY "admin_all_customers" ON public.customers FOR ALL TO authenticated
  USING (auth.email() = 'teamloxen@gmail.com')
  WITH CHECK (auth.email() = 'teamloxen@gmail.com');
