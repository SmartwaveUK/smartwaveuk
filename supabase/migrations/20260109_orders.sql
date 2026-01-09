-- Create orders table
create table public.orders (
  id uuid not null default gen_random_uuid (),
  created_at timestamp with time zone not null default now(),
  user_id uuid references auth.users(id) on delete set null, -- Link to authenticated user
  customer_name text not null,
  customer_email text not null,
  customer_phone text not null,
  shipping_address jsonb not null, -- Store address structure { line1, city, postcode, etc }
  total_amount numeric not null,
  currency text not null default 'USD',
  status text not null default 'pending', -- 'pending', 'awaiting_payment', 'paid', 'shipped', 'cancelled'
  constraint orders_pkey primary key (id)
);

-- Create order items table
create table public.order_items (
  id uuid not null default gen_random_uuid (),
  created_at timestamp with time zone not null default now(),
  order_id uuid not null references public.orders(id) on delete cascade,
  phone_id uuid not null references public.phones(id) on delete restrict, -- Don't delete phones if ordered
  price numeric not null, -- Snapshot of price at time of purchase
  constraint order_items_pkey primary key (id)
);

-- Enable RLS
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

-- Policies for orders
-- Users can view their own orders
create policy "Users can view own orders." on public.orders for select using (auth.uid() = user_id);
-- Admins can view all (assuming admin role or similar, for now we restrict to owner or open insert)
-- Public can insert orders (checkout process needs to insert, usually via server action which bypasses RLS if using service role, 
-- or if using authenticated client, the user is inserting their own order).
create policy "Users can create own orders." on public.orders for insert with check (auth.uid() = user_id);

-- Policies for order_items
create policy "Users can view own order items." on public.order_items for select using (
  exists ( select 1 from public.orders where orders.id = order_items.order_id and orders.user_id = auth.uid() )
);
create policy "Users can create own order items." on public.order_items for insert with check (
  exists ( select 1 from public.orders where orders.id = order_items.order_id and orders.user_id = auth.uid() )
);

-- If we are creating orders for "newly created users" in the same transaction context, we often rely on the server action 
-- utilizing the Service Role (supabase.auth.admin or simply bypassing RLS) to ensure creating for others works if the session isn't fully established.
-- However, standard RLS practices above apply.
