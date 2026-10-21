-- 013 — Categories Dianna can manage herself.
--
-- Until now the category list (Sneakers, Boots, ...) was written into the
-- code. This moves it into the database so she can add one — Belts, Bags —
-- from the admin without a deploy.
--
-- products.category keeps holding the category id ('sneakers'), so no
-- existing product changes. The foreign key below means a category that
-- still has pieces in it cannot be deleted by accident.

create table if not exists public.categories (
  id          text primary key,              -- url-safe id, e.g. 'belts'
  label       text not null,                 -- what visitors see, e.g. 'Belts'
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now()
);

-- The six that were hardcoded, in the same order.
insert into public.categories (id, label, sort_order) values
  ('sneakers', 'Sneakers', 0),
  ('boots',    'Boots',    1),
  ('jackets',  'Jackets',  2),
  ('crocs',    'Crocs',    3),
  ('hats',     'Hats',     4),
  ('kids',     'Kids',     5)
on conflict (id) do nothing;

-- Safety net: if any existing product uses a category that isn't in the
-- list above, add it too, so the foreign key below can be created.
insert into public.categories (id, label, sort_order)
select distinct p.category, initcap(replace(p.category, '-', ' ')), 100
from public.products p
where p.category is not null
on conflict (id) do nothing;

-- Tie products to the list. RESTRICT: deleting a category that still has
-- pieces in it fails, and the admin explains why.
alter table public.products
  drop constraint if exists products_category_fkey;
alter table public.products
  add constraint products_category_fkey
  foreign key (category) references public.categories (id)
  on update cascade
  on delete restrict;

alter table public.categories enable row level security;

drop policy if exists "categories public read" on public.categories;
create policy "categories public read"
  on public.categories for select
  using (true);

drop policy if exists "categories admin write" on public.categories;
create policy "categories admin write"
  on public.categories for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());
