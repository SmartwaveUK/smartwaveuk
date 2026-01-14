-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.inquiries (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  customer_name text NOT NULL,
  customer_contact text NOT NULL,
  item_id uuid,
  status text NOT NULL DEFAULT 'pending'::text,
  admin_notes text,
  CONSTRAINT inquiries_pkey PRIMARY KEY (id),
  CONSTRAINT inquiries_phone_id_fkey FOREIGN KEY (item_id) REFERENCES public.items(id)
);
CREATE TABLE public.items (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  brand text NOT NULL,
  model text NOT NULL,
  variant text NOT NULL,
  condition text NOT NULL,
  price numeric NOT NULL,
  currency text NOT NULL DEFAULT 'USD'::text,
  availability_status text NOT NULL DEFAULT 'in_stock'::text,
  seller_region text,
  internal_notes text,
  image_url text,
  category text NOT NULL DEFAULT 'Smartphone'::text,
  specs jsonb DEFAULT '{}'::jsonb,
  description text,
  images ARRAY DEFAULT ARRAY[]::text[],
  colors ARRAY DEFAULT ARRAY[]::text[],
  CONSTRAINT items_pkey PRIMARY KEY (id)
);
CREATE TABLE public.order_items (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  order_id uuid NOT NULL,
  item_id uuid NOT NULL,
  price numeric NOT NULL,
  selected_options jsonb DEFAULT '{}'::jsonb,
  CONSTRAINT order_items_pkey PRIMARY KEY (id),
  CONSTRAINT order_items_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id),
  CONSTRAINT order_items_phone_id_fkey FOREIGN KEY (item_id) REFERENCES public.items(id)
);
CREATE TABLE public.orders (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  user_id uuid,
  customer_name text NOT NULL,
  customer_email text NOT NULL,
  customer_phone text NOT NULL,
  shipping_address jsonb NOT NULL,
  total_amount numeric NOT NULL,
  currency text NOT NULL DEFAULT 'USD'::text,
  status text NOT NULL DEFAULT 'pending'::text,
  payment_proof text,
  CONSTRAINT orders_pkey PRIMARY KEY (id),
  CONSTRAINT orders_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);
CREATE TABLE public.profiles (
  id uuid NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  email text,
  role text NOT NULL DEFAULT 'customer'::text,
  full_name text,
  avatar_url text,
  CONSTRAINT profiles_pkey PRIMARY KEY (id),
  CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id)
);
CREATE TABLE public.settings (
  key text NOT NULL,
  value text NOT NULL,
  description text,
  updated_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT settings_pkey PRIMARY KEY (key)
);
CREATE TABLE public.tracking_shipments (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  order_id uuid,
  tracking_number text NOT NULL UNIQUE,
  carrier text DEFAULT 'SmartWave Logistics'::text,
  status text DEFAULT 'created'::text,
  events jsonb DEFAULT '[]'::jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT tracking_shipments_pkey PRIMARY KEY (id),
  CONSTRAINT tracking_shipments_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id)
);