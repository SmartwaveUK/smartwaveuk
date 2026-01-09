-- Create a new storage bucket for item images
insert into storage.buckets (id, name, public)
values ('item-images', 'item-images', true);

-- Policy to allow public access to images
create policy "Public Access"
  on storage.objects for select
  using ( bucket_id = 'item-images' );

-- Policy to allow authenticated users (admin) to upload images
create policy "Authenticated Upload"
  on storage.objects for insert
  with check ( bucket_id = 'item-images' and auth.role() = 'authenticated' );

-- Policy to allow authenticated users to update/delete their images (or all images for admins)
create policy "Authenticated Update/Delete"
  on storage.objects for update
  using ( bucket_id = 'item-images' and auth.role() = 'authenticated' );

create policy "Authenticated Delete"
  on storage.objects for delete
  using ( bucket_id = 'item-images' and auth.role() = 'authenticated' );
