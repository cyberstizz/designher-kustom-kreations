-- 011 — Notification flags for messages and acceptances.
--
-- Same pattern as 010: the notify function stamps a row before emailing
-- about it, so the endpoint stays safe to call without a login and can
-- never send the same email twice.
--
-- quotes already has notified_at for "here is your price". An acceptance is
-- a second, later email about the same row, so it needs its own flag.

alter table public.messages add column if not exists notified_at        timestamptz;
alter table public.quotes   add column if not exists accept_notified_at timestamptz;

comment on column public.messages.notified_at is
  'When the email about this message went out. Set by netlify/functions/notify.mjs.';
comment on column public.quotes.accept_notified_at is
  'When Dianna was emailed that the customer accepted. Separate from notified_at, which is the quote email to the customer.';
