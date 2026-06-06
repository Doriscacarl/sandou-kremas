-- ============================================================
-- Sandou Kremas — Notifications Table
-- Run in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

CREATE TABLE IF NOT EXISTS public.notifications (
  id            uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  type          text        NOT NULL CHECK (type IN ('order','inquiry','signup')),
  title         text        NOT NULL,
  body          text,
  related_id    text,
  related_type  text,
  is_read       boolean     NOT NULL DEFAULT false,
  created_at    timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Anyone (anon + authenticated) can INSERT — triggered by public forms
CREATE POLICY "anyone_insert_notifications"
  ON public.notifications FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Only admin can SELECT
CREATE POLICY "admin_select_notifications"
  ON public.notifications FOR SELECT
  TO authenticated
  USING (auth.email() = 'teamloxen@gmail.com');

-- Only admin can UPDATE (mark as read)
CREATE POLICY "admin_update_notifications"
  ON public.notifications FOR UPDATE
  TO authenticated
  USING (auth.email() = 'teamloxen@gmail.com')
  WITH CHECK (auth.email() = 'teamloxen@gmail.com');

-- Only admin can DELETE
CREATE POLICY "admin_delete_notifications"
  ON public.notifications FOR DELETE
  TO authenticated
  USING (auth.email() = 'teamloxen@gmail.com');
