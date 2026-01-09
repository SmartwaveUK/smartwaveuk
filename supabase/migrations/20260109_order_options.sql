-- Add selected_options to order_items to store user choices like color/storage
ALTER TABLE public.order_items 
ADD COLUMN IF NOT EXISTS selected_options jsonb DEFAULT '{}'::jsonb;
