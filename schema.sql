-- ============================================================
-- Sandou Kremas — Supabase Schema
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================


-- ── 1. INQUIRIES (contact form + concierge modal) ──────────

create table if not exists public.inquiries (
  id            uuid        default gen_random_uuid() primary key,
  name          text        not null,
  email         text        not null,
  subject       text,
  message       text        not null,
  inquiry_type  text        not null default 'General',
  created_at    timestamptz not null default now()
);

alter table public.inquiries enable row level security;

create policy "anyone_insert_inquiries"
  on public.inquiries for insert
  to anon, authenticated
  with check (true);


-- ── 2. SUBSCRIBERS (Sandou Circle newsletter) ──────────────

create table if not exists public.subscribers (
  id            uuid        default gen_random_uuid() primary key,
  email         text        not null,
  source        text        not null default 'website',
  is_active     boolean     not null default true,
  subscribed_at timestamptz not null default now(),
  constraint subscribers_email_key unique (email)
);

alter table public.subscribers enable row level security;

create policy "anyone_upsert_subscribers"
  on public.subscribers for insert
  to anon, authenticated
  with check (true);

create policy "anyone_update_subscribers"
  on public.subscribers for update
  to anon, authenticated
  using (true);


-- ── 3. ORDERS ──────────────────────────────────────────────

create table if not exists public.orders (
  id               uuid        default gen_random_uuid() primary key,
  user_id          uuid        references auth.users(id) on delete set null,
  customer_name    text        not null,
  customer_email   text        not null,
  customer_phone   text,
  product_name     text        not null default 'General Inquiry',
  quantity         integer     not null default 1,
  notes            text,
  status           text        not null default 'pending',
  created_at       timestamptz not null default now()
);

alter table public.orders enable row level security;

-- Anyone can place an order
create policy "anyone_insert_orders"
  on public.orders for insert
  to anon, authenticated
  with check (true);

-- Logged-in users can view their own orders
create policy "users_view_own_orders"
  on public.orders for select
  to authenticated
  using (auth.uid() = user_id);
