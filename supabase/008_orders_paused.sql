-- 008 — Pause new orders.
--
-- Dianna flips a switch in the admin when she's backed up. The switch is a
-- row in site_settings, and the INSERT policy on inquiries reads it, so a
-- paused shop is enforced by the database — not just hidden in the UI.
-- Someone replaying the form by hand still gets rejected.

insert into public.site_settings (key, value) values
  ('orders_paused', 'false'),   -- 'true' | 'false'
  ('orders_reopen_date', ''),   -- optional 'YYYY-MM-DD', shown to visitors
  ('orders_paused_note', '')    -- optional line in Dianna's own words
on conflict (key) do nothing;

-- Reads the switch. security definer so the anon role can evaluate it
-- without needing to read site_settings directly.
create or replace function public.orders_paused()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    (select value = 'true' from public.site_settings where key = 'orders_paused'),
    false
  );
$$;

grant execute on function public.orders_paused() to anon, authenticated;

-- Replace every INSERT policy on inquiries with one that respects the switch.
-- Policies are OR'd together, so a leftover permissive one from an earlier
-- migration would quietly defeat this. This drops them all first.
do $$
declare p record;
begin
  for p in
    select policyname from pg_policies
    where schemaname = 'public' and tablename = 'inquiries' and cmd = 'INSERT'
  loop
    execute format('drop policy %I on public.inquiries', p.policyname);
  end loop;
end $$;

create policy "public submits inquiry while open"
  on public.inquiries for insert
  to anon, authenticated
  with check (not public.orders_paused());
