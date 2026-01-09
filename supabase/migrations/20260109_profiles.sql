-- Create profiles table
create table public.profiles (
  id uuid not null references auth.users(id) on delete cascade,
  created_at timestamp with time zone not null default now(),
  email text,
  role text not null default 'customer',
  full_name text,
  avatar_url text,
  primary key (id)
);

-- Enable RLS
alter table public.profiles enable row level security;

-- Policies
create policy "Users can view own profile." on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile." on public.profiles for update using (auth.uid() = id);
-- Admins might need to view all, but for now we stick to "customer" requirement basics. 
-- If the "role" column dictates admin privileges, we might need a policy for that later.
-- For now, let's allow read access if the user's role is 'admin' (self-referential or claims based, simplified here for now to just self).

-- Function to handle new user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name', 'customer');
  return new;
end;
$$ language plpgsql security definer;

-- Trigger
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
