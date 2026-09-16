/**
 * POST /.netlify/functions/stripe-webhook
 *
 * Stripe tells us a payment succeeded. This — not the browser returning from
 * Checkout — is what marks a kreation paid. A customer who closes the tab on
 * the Stripe receipt page still gets credited.
 *
 * The signature is verified against the raw body, so read the body as text
 * and never parse it first.
 */
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import { adminAddress, adminPaid, customerPaid, send } from './_email.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const admin = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false } }
);

export default async (req) => {
  if (req.method !== 'POST') return new Response('Method not allowed', { status: 405 });

  const raw = await req.text();
  const signature = req.headers.get('stripe-signature');

  let event;
  try {
    event = stripe.webhooks.constructEvent(raw, signature, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('[webhook] bad signature', err.message);
    return new Response(`Webhook error: ${err.message}`, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;

    // Pull the receipt link so the customer can see it in their account.
    let receiptUrl = null;
    try {
      if (session.payment_intent) {
        const intent = await stripe.paymentIntents.retrieve(session.payment_intent, {
          expand: ['latest_charge'],
        });
        receiptUrl = intent?.latest_charge?.receipt_url || null;
      }
    } catch (err) {
      console.error('[webhook] receipt lookup', err.message);
    }

    const { data: payment, error } = await admin
      .from('payments')
      .update({
        status: 'paid',
        stripe_payment_intent: session.payment_intent || null,
        receipt_url: receiptUrl,
        paid_at: new Date().toISOString(),
      })
      .eq('stripe_session_id', session.id)
      .select('inquiry_id')
      .maybeSingle();

    if (error) {
      console.error('[webhook] payments update', error.message);
      // 500 makes Stripe retry, which is what we want for a database blip.
      return new Response('Database error', { status: 500 });
    }

    const inquiryId = payment?.inquiry_id || session.metadata?.inquiry_id;
    if (inquiryId) {
      const { error: statusError } = await admin
        .from('inquiries')
        .update({ status: 'in progress' })
        .eq('id', inquiryId);
      if (statusError) console.error('[webhook] status update', statusError.message);

      // Receipts, both ways. Never allowed to fail the webhook: Stripe would
      // retry a 500 and we'd charge nothing twice but email twice.
      try {
        const { data: inquiry } = await admin
          .from('inquiries')
          .select('full_name, email, base')
          .eq('id', inquiryId)
          .maybeSingle();

        if (inquiry) {
          const cents = session.amount_total ?? 0;
          await Promise.all([
            send(adminAddress(), adminPaid(inquiry, cents), { replyTo: inquiry.email }),
            send(inquiry.email, customerPaid(inquiry, cents, receiptUrl), { replyTo: adminAddress() }),
          ]);
        }
      } catch (err) {
        console.error('[webhook] email', err.message);
      }
    }
  }

  if (event.type === 'checkout.session.expired') {
    await admin
      .from('payments')
      .update({ status: 'failed' })
      .eq('stripe_session_id', event.data.object.id)
      .eq('status', 'pending');
  }

  return new Response(JSON.stringify({ received: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
