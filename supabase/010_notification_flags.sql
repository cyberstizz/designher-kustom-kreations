-- 010 — Notification flags.
--
-- One timestamp per row that an email was sent about. The notify function
-- stamps it before sending, which makes the endpoint safe to expose without
-- a login: a second call for the same row does nothing.

alter table public.inquiries add column if not exists notified_at timestamptz;
alter table public.quotes    add column if not exists notified_at timestamptz;

comment on column public.inquiries.notified_at is
  'When the new-request emails went out. Set by netlify/functions/notify.mjs; prevents duplicates and replays.';
comment on column public.quotes.notified_at is
  'When the quote email went out to the customer. Set by netlify/functions/notify.mjs.';
