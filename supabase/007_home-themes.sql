-- 007 — Home page themes.
--
-- One row per theme, so every theme remembers its own hero image, caption,
-- order-by date and (for the pop-up) event details. Switching back to
-- Halloween next year brings back last year's Halloween photo without a
-- re-upload. Which theme is live is a single key in site_settings.

create table if not exists public.home_themes (
  theme_key        text primary key,          -- 'christmas', 'popup', ...
  hero_image_url   text,                      -- null = fall back to the default hero photo
  hero_badge       text,                      -- caption in the corner of the hero photo
  order_by_date    date,                      -- holiday order cutoff shown in the copy
  event_venue      text,                      -- pop-up only
  event_address    text,                      -- pop-up only
  event_date       date,                      -- pop-up only
  event_start      time,                      -- pop-up only
  event_end        time,                      -- pop-up only
  updated_at       timestamptz not null default now()
);

alter table public.home_themes enable row level security;

-- Everyone can read (the home page fetches these anonymously).
drop policy if exists "home_themes public read" on public.home_themes;
create policy "home_themes public read"
  on public.home_themes for select
  using (true);

-- Only Dianna (and any other admin) can write.
drop policy if exists "home_themes admin write" on public.home_themes;
create policy "home_themes admin write"
  on public.home_themes for all
  using (public.is_admin())
  with check (public.is_admin());

-- Keep updated_at honest.
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;

drop trigger if exists home_themes_touch on public.home_themes;
create trigger home_themes_touch
  before update on public.home_themes
  for each row execute function public.touch_updated_at();

-- The live theme. Defaults to 'default' (the site exactly as it is today).
insert into public.site_settings (key, value)
values ('active_theme', 'default')
on conflict (key) do nothing;