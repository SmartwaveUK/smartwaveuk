-- Add rich detals to items table (restoring features)
ALTER TABLE public.items 
ADD COLUMN IF NOT EXISTS description text,
ADD COLUMN IF NOT EXISTS images text[] DEFAULT ARRAY[]::text[],
ADD COLUMN IF NOT EXISTS colors text[] DEFAULT ARRAY[]::text[];
