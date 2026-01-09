-- Create phones table
create table public.phones (
  id uuid not null default gen_random_uuid (),
  created_at timestamp with time zone not null default now(),
  brand text not null,
  model text not null,
  variant text not null, -- e.g. "128GB / Midnight"
  condition text not null, -- e.g. "New", "Grade A"
  price numeric not null,
  currency text not null default 'USD',
  availability_status text not null default 'in_stock', -- 'in_stock', 'limited', 'request', 'sold'
  seller_region text null, -- Internal use
  internal_notes text null,
  image_url text null,
  constraint phones_pkey primary key (id)
);

-- Create inquiries table
create table public.inquiries (
  id uuid not null default gen_random_uuid (),
  created_at timestamp with time zone not null default now(),
  customer_name text not null,
  customer_contact text not null, -- Email or Phone
  phone_id uuid null,
  status text not null default 'pending', -- 'pending', 'confirmed', 'paid', 'shipped', 'cancelled'
  admin_notes text null,
  constraint inquiries_pkey primary key (id),
  constraint inquiries_phone_id_fkey foreign key (phone_id) references phones (id)
);

-- Enable RLS
alter table public.phones enable row level security;
alter table public.inquiries enable row level security;

-- Policies for phones
-- Public can view all phones
create policy "Public phones are viewable by everyone." on public.phones for select using (true);
-- Only authenticated users (admins) can insert/update/delete phones
create policy "Admins can insert phones." on public.phones for insert to authenticated with check (true);
create policy "Admins can update phones." on public.phones for update to authenticated using (true);
create policy "Admins can delete phones." on public.phones for delete to authenticated using (true);

-- Policies for inquiries
-- Public can insert inquiries (submit form)
create policy "Public can submit inquiries." on public.inquiries for insert with check (true);
-- Only authenticated users (admins) can view inquiries
create policy "Admins can view all inquiries." on public.inquiries for select to authenticated using (true);
-- Only authenticated users (admins) can update inquiries
create policy "Admins can update inquiries." on public.inquiries for update to authenticated using (true);
