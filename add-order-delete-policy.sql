-- Run this once in Supabase SQL Editor to allow the admin to delete orders
DROP POLICY IF EXISTS "admin_delete_orders" ON public.orders;
CREATE POLICY "admin_delete_orders"
  ON public.orders FOR DELETE TO authenticated
  USING (auth.email() = 'teamloxen@gmail.com');
