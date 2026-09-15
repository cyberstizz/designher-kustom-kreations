-- 009 — Payments.
--
-- One row per Stripe Checkout session. The browser never sets an amount:
-- the create-checkout function reads the accepted quote server-side and
-- writes this row with the service role key, and only the webhook marks it
-- paid. Amounts are whole cents, like quotes.

create table if not exists public.payments (
  id                    uuid primary key default gen_random_uuid(),
  inquiry_id            uuid not null references public.inquiries(id) on delete cascade,
  quote_id              uuid not null references public.quotes(id) on delete restrict,
  amount_cents          integer not null check (amount_cents > 0),
  currency              text not null default 'usd',
  status                text not null default 'pending'
                        check (status in ('pending', 'paid', 'failed', 'refunded')),
  stripe_session_id     text unique,
  stripe_payment_intent text,
  receipt_url           text,
  paid_at               timestamptz,
  created_at            timestamptz not null default now()
);

create index if not exists payments_inquiry_idx on public.payments (inquiry_id);
create index if not exists payments_status_idx on public.payments (status);

alter table public.payments enable row level security;

-- Dianna sees everything.
drop policy if exists "admin reads payments" on public.payments;
create policy "admin reads payments"
  on public.payments for select
  to authenticated
  using (public.is_admin());

-- A customer sees payments on their own requests. Matched by email, the
-- same way 006 links a signed-in customer to their inquiries. If you ever
-- change that linkage, change it here too.
drop policy if exists "customer reads own payments" on public.payments;
create policy "customer reads own payments"
  on public.payments for select
  to authenticated
  using (
    exists (
      select 1 from public.inquiries i
      where i.id = payments.inquiry_id
        and lower(i.email) = lower(auth.jwt() ->> 'email')
    )
  );

-- Nobody writes from the browser. Inserts and updates happen only in the
-- Netlify functions, which use the service role key and bypass RLS. There
-- is deliberately no insert or update policy here — do not add one.
