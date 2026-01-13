-- Add payment_proof column to orders
alter table public.orders 
add column if not exists payment_proof text;

-- Create storage bucket for payment proofs
insert into storage.buckets (id, name, public)
values ('payment-proofs', 'payment-proofs', false)
on conflict (id) do nothing;

-- Policy: Authenticated users can upload to payment-proofs
create policy "Authenticated Upload Proof"
  on storage.objects for insert
  with check ( bucket_id = 'payment-proofs' and auth.role() = 'authenticated' );

-- Policy: Users can view their own proofs (if we wanted, but likely mainly for admin)
-- For now, maybe just allow them to see what they uploaded if they have the path? 
-- Actually, since it's private, we need signed URLs or restrictive policies.
-- Let's give insert permission. Order owner can probably read?
-- For MVP, just insert is crucial. Admin needs read.

create policy "Admin Read Proofs"
    on storage.objects for select
    using ( bucket_id = 'payment-proofs' and exists (
        select 1 from public.profiles
        where profiles.id = auth.uid() and profiles.role = 'admin'
    ));
