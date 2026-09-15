/**
 * POST /.netlify/functions/create-checkout   { inquiryId }
 *
 * Starts a Stripe Checkout session for one accepted quote.
 *
 * The browser sends an id and nothing else. Everything that decides how much
 * money moves — the amount, the currency, who owns the request — is read here
 * from the database with the service role key. A customer editing the request
 * in devtools can only ever change which of their own requests they pay for.
 */
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const admin = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false } }
);

const json = (status, body) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

export default async (req) => {
  if (req.method !== 'POST') return json(405, { error: 'Method not allowed' });

  // ---- who is asking -------------------------------------------------
  const auth = req.headers.get('authorization') || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
  if (!token) return json(401, { error: 'Please sign in again.' });

  const { data: userData, error: userError } = await admin.auth.getUser(token);
  const email = userData?.user?.email;
  if (userError || !email) return json(401, { error: 'Please sign in again.' });

  // ---- what they are paying for --------------------------------------
  let inquiryId;
  try {
    ({ inquiryId } = await req.json());
  } catch {
    return json(400, { error: 'Bad request.' });
  }
  if (!inquiryId) return json(400, { error: 'Missing request id.' });

  const { data: inquiry, error: inquiryError } = await admin
    .from('inquiries')
    .select('id, email, full_name, base, occasion')
    .eq('id', inquiryId)
    .maybeSingle();

  if (inquiryError) return json(500, { error: 'Could not load that request.' });
  if (!inquiry || inquiry.email.toLowerCase() !== email.toLowerCase()) {
    // Same answer for "doesn't exist" and "isn't yours" on purpose.
    return json(404, { error: 'We could not find that request.' });
  }

  const { data: quote } = await admin
    .from('quotes')
    .select('id, amount_cents, status')
    .eq('inquiry_id', inquiryId)
    .eq('status', 'accepted')
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!quote) return json(400, { error: 'Accept the price first.' });

  // Already paid? Don't let a stale tab charge twice.
  const { data: existingPaid } = await admin
    .from('payments')
    .select('id')
    .eq('quote_id', quote.id)
    .eq('status', 'paid')
    .limit(1)
    .maybeSingle();

  if (existingPaid) return json(400, { error: 'This kreation is already paid for.' });

  // ---- create the session --------------------------------------------
  const site = process.env.URL || 'https://designherck.com';
  const title = [inquiry.occasion, inquiry.base].filter(Boolean).join(' ') || 'Custom kreation';

  let session;
  try {
    session = await stripe.checkout.sessions.create({
      mode: 'payment',
      customer_email: inquiry.email,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: 'usd',
            unit_amount: quote.amount_cents,
            product_data: {
              name: `Designher — ${title}`,
              description: 'Hand-set custom kreation, made to order',
            },
          },
        },
      ],
      success_url: `${site}/account/${inquiry.id}?paid=1`,
      cancel_url: `${site}/account/${inquiry.id}?paid=0`,
      metadata: { inquiry_id: inquiry.id, quote_id: quote.id },
      payment_intent_data: {
        metadata: { inquiry_id: inquiry.id, quote_id: quote.id },
      },
    });
  } catch (err) {
    console.error('[create-checkout] stripe', err.message);
    return json(502, { error: 'Payments are temporarily unavailable.' });
  }

  // Record the attempt. The webhook finds this row by session id and flips
  // it to paid; an abandoned checkout just stays pending.
  const { error: insertError } = await admin.from('payments').insert({
    inquiry_id: inquiry.id,
    quote_id: quote.id,
    amount_cents: quote.amount_cents,
    stripe_session_id: session.id,
  });
  if (insertError) console.error('[create-checkout] payments insert', insertError.message);

  return json(200, { url: session.url });
};
