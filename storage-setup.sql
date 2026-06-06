-- ============================================================
-- Sandou Kremas — Supabase Storage Setup
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- ── 1. Create the sandou-media bucket ─────────────────────
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'sandou-media',
  'sandou-media',
  true,
  10485760,  -- 10 MB per file
  ARRAY['image/jpeg','image/jpg','image/png','image/gif','image/webp','image/svg+xml','image/avif']
)
ON CONFLICT (id) DO UPDATE SET
  public            = true,
  file_size_limit   = 10485760,
  allowed_mime_types = ARRAY['image/jpeg','image/jpg','image/png','image/gif','image/webp','image/svg+xml','image/avif'];


-- ── 2. Drop any stale storage policies to avoid conflicts ─
DO $$ BEGIN
  DROP POLICY IF EXISTS "admin_upload"  ON storage.objects;
  DROP POLICY IF EXISTS "admin_update"  ON storage.objects;
  DROP POLICY IF EXISTS "admin_delete"  ON storage.objects;
  DROP POLICY IF EXISTS "public_read"   ON storage.objects;
  DROP POLICY IF EXISTS "auth_upload"   ON storage.objects;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;


-- ── 3. Admin can upload images ─────────────────────────────
CREATE POLICY "admin_upload"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'sandou-media'
  AND auth.email() = 'teamloxen@gmail.com'
);


-- ── 4. Admin can replace / update images ──────────────────
CREATE POLICY "admin_update"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'sandou-media'
  AND auth.email() = 'teamloxen@gmail.com'
);


-- ── 5. Admin can delete images ────────────────────────────
CREATE POLICY "admin_delete"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'sandou-media'
  AND auth.email() = 'teamloxen@gmail.com'
);


-- ── 6. Anyone (public) can view images ────────────────────
CREATE POLICY "public_read"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'sandou-media');
