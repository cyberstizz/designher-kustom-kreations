/**
 * POST /.netlify/functions/notify   { event, id }
 *
 * The browser writes to Supabase directly, so it has to tell the server when
 * something happened. It sends only an event name and a row id — every word
 * of every email is composed here from what's actually in the database.
 *
 * Why this is safe without a login:
 *   - The form is public, so requiring auth would mean no email at all.
 *   - The row must exist, must have been created in the last 10 minutes, and
 *     must not already be stamped notified_at.
 *   - notified_at is set before sending, so a replay sends nothing.
 *   - Recipients come from the row, never from the request body. There is no
 *     way to aim an email at an address of your choosing.
 *
 * Worst case for an attacker who knows a row id: nothing, because the row is
 * already stamped. Within the 10-minute window, one duplicate of the email
 * the customer was about to receive anyway.
 */
import { createClient } from '@supabase/supabase-js';
import {
  adminAddress,
  adminMessage,
  adminNewRequest,
  adminQuoteAccepted,
  customerMessage,
  customerQuoteReady,
  customerRequestReceived,
  send,
} from './_email.js';

const admin = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false } }
);

const FRESH_MS = 10 * 60 * 1000;

const json = (status, body) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

const isFresh = (iso) => iso && Date.now() - new Date(iso).getTime() < FRESH_MS;

export default async (req) => {
  if (req.method !== 'POST') return json(405, { error: 'Method not allowed' });

  let event;
  let id;
  try {
    ({ event, id } = await req.json());
  } catch {
    return json(400, { error: 'Bad request' });
  }
  if (!event || !id) return json(400, { error: 'Missing event or id' });

  /* ------------------------------------------- a new custom request */
  if (event === 'inquiry_created') {
    const { data: inquiry, error } = await admin
      .from('inquiries')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error || !inquiry) return json(404, { error: 'Not found' });
    if (inquiry.notified_at) return json(200, { skipped: 'already notified' });
    if (!isFresh(inquiry.created_at)) return json(200, { skipped: 'too old' });

    // Stamp first. If sending fails we'd rather lose the email than send it
    // in a loop, and the request is visible in the studio regardless.
    await admin.from('inquiries').update({ notified_at: new Date().toISOString() }).eq('id', id);

    const results = await Promise.all([
      send(adminAddress(), adminNewRequest(inquiry), { replyTo: inquiry.email }),
      send(inquiry.email, customerRequestReceived(inquiry)),
    ]);

    return json(200, { sent: results.map((r) => r.sent) });
  }

  /* ----------------------------------------------- a quote went out */
  if (event === 'quote_sent') {
    const { data: quote, error } = await admin
      .from('quotes')
      .select('id, inquiry_id, amount_cents, message, status, created_at, notified_at')
      .eq('id', id)
      .maybeSingle();

    if (error || !quote) return json(404, { error: 'Not found' });
    if (quote.notified_at) return json(200, { skipped: 'already notified' });
    if (!isFresh(quote.created_at)) return json(200, { skipped: 'too old' });

    const { data: inquiry } = await admin
      .from('inquiries')
      .select('*')
      .eq('id', quote.inquiry_id)
      .maybeSingle();

    if (!inquiry) return json(404, { error: 'Not found' });

    await admin.from('quotes').update({ notified_at: new Date().toISOString() }).eq('id', id);

    const result = await send(inquiry.email, customerQuoteReady(inquiry, quote), {
      replyTo: adminAddress(),
    });

    return json(200, { sent: [result.sent] });
  }

  /* ------------------------------------ somebody wrote in the thread */
  if (event === 'message_sent') {
    const { data: message, error } = await admin
      .from('messages')
      .select('id, inquiry_id, sender, body, created_at, notified_at')
      .eq('id', id)
      .maybeSingle();

    if (error || !message) return json(404, { error: 'Not found' });
    if (message.notified_at) return json(200, { skipped: 'already notified' });
    if (!isFresh(message.created_at)) return json(200, { skipped: 'too old' });

    const { data: inquiry } = await admin
      .from('inquiries')
      .select('*')
      .eq('id', message.inquiry_id)
      .maybeSingle();

    if (!inquiry) return json(404, { error: 'Not found' });

    await admin.from('messages').update({ notified_at: new Date().toISOString() }).eq('id', id);

    // Whoever didn't write it is the one who needs to hear about it.
    const toCustomer = message.sender === 'admin';
    const result = toCustomer
      ? await send(inquiry.email, customerMessage(inquiry, message.body), { replyTo: adminAddress() })
      : await send(adminAddress(), adminMessage(inquiry, message.body), { replyTo: inquiry.email });

    return json(200, { sent: [result.sent] });
  }

  /* -------------------------------------- the customer took the price */
  if (event === 'quote_accepted') {
    const { data: quote, error } = await admin
      .from('quotes')
      .select('id, inquiry_id, amount_cents, status, accept_notified_at')
      .eq('id', id)
      .maybeSingle();

    if (error || !quote) return json(404, { error: 'Not found' });
    if (quote.accept_notified_at) return json(200, { skipped: 'already notified' });
    // Trust the database, not the caller: only a genuinely accepted quote
    // can trigger this, whatever the request body claims.
    if (quote.status !== 'accepted') return json(200, { skipped: 'not accepted' });

    const { data: inquiry } = await admin
      .from('inquiries')
      .select('*')
      .eq('id', quote.inquiry_id)
      .maybeSingle();

    if (!inquiry) return json(404, { error: 'Not found' });

    await admin
      .from('quotes')
      .update({ accept_notified_at: new Date().toISOString() })
      .eq('id', id);

    const result = await send(adminAddress(), adminQuoteAccepted(inquiry, quote), {
      replyTo: inquiry.email,
    });

    return json(200, { sent: [result.sent] });
  }

  return json(400, { error: 'Unknown event' });
};
