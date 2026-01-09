-- Rename phones table to items
ALTER TABLE public.phones RENAME TO items;

-- Add new columns for generic items
ALTER TABLE public.items ADD COLUMN category text NOT NULL DEFAULT 'Smartphone';
ALTER TABLE public.items ADD COLUMN specs jsonb DEFAULT '{}'::jsonb; -- Flexible specs for different gadgets

-- Rename foreign key columns in other tables
ALTER TABLE public.inquiries RENAME COLUMN phone_id TO item_id;
ALTER TABLE public.order_items RENAME COLUMN phone_id TO item_id;

-- Update RLS Policies (Postgres doesn't automatically rename policies usually, but the table name change applies)
-- We should ensure policies make sense.
-- Rebranding policies for clarity:

DROP POLICY IF EXISTS "Public phones are viewable by everyone." ON public.items;
DROP POLICY IF EXISTS "Admins can insert phones." ON public.items;
DROP POLICY IF EXISTS "Admins can update phones." ON public.items;
DROP POLICY IF EXISTS "Admins can delete phones." ON public.items;

CREATE POLICY "Public items are viewable by everyone." ON public.items FOR SELECT USING (true);
CREATE POLICY "Admins can insert items." ON public.items FOR INSERT TO authenticated WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));
CREATE POLICY "Admins can update items." ON public.items FOR UPDATE TO authenticated USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));
CREATE POLICY "Admins can delete items." ON public.items FOR DELETE TO authenticated USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));

-- Fix policies on order_items that referenced phones
-- (We just renamed the table, so references might still hold if they use OID, but string refs in policies might break if manual)
-- The previous policy: exists ( select 1 from public.orders where orders.id = order_items.order_id ... ) -> depends on orders.id, not items.
-- So order_items policies are fine.
