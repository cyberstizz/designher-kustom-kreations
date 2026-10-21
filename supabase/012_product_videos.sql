-- 012 — Product videos.
--
-- One optional video per product, stored in its own bucket so photos and
-- videos can have different size limits. The 1 GB free-plan storage is
-- shared by everything, so the limits here are deliberately tight:
--   * one video per product (a column, not an array)
--   * 30 MB per file, enforced by the bucket itself, not just the browser
--   * the admin deletes the old file whenever a video is replaced or removed

alter table public.products
  add column if not exists video_url text;

comment on column public.products.video_url is
  'Optional short video for the product page. Lives in the product-videos bucket.';

-- The bucket. Public so the product page can play it without a login.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'product-videos',
  'product-videos',
  true,
  31457280,                                   -- 30 MB
  array['video/mp4', 'video/quicktime', 'video/webm']
)
on conflict (id) do update
  set public             = excluded.public,
      file_size_limit    = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

-- Only Dianna (is_admin) may add, replace or delete videos. Customers are
-- signed in too now (magic links), so "authenticated" alone is not enough.
drop policy if exists "admin uploads product videos" on storage.objects;
create policy "admin uploads product videos"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'product-videos' and public.is_admin());

drop policy if exists "admin updates product videos" on storage.objects;
create policy "admin updates product videos"
  on storage.objects for update to authenticated
  using (bucket_id = 'product-videos' and public.is_admin())
  with check (bucket_id = 'product-videos' and public.is_admin());

drop policy if exists "admin deletes product videos" on storage.objects;
create policy "admin deletes product videos"
  on storage.objects for delete to authenticated
  using (bucket_id = 'product-videos' and public.is_admin());

-- Delete needs to find the object first, which is a select under RLS.
drop policy if exists "admin reads product videos" on storage.objects;
create policy "admin reads product videos"
  on storage.objects for select to authenticated
  using (bucket_id = 'product-videos' and public.is_admin());
