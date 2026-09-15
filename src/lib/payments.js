/**
 * Payments.
 *
 * The browser never names a price. It asks the server to start a checkout
 * for a request id; the server reads the accepted quote and builds the
 * Stripe session from the amount stored in the database.
 */

async function sdk() {
  const mod = await import('./supabase.js');
  return mod.supabase;
}

/** Opens Stripe Checkout. Returns { error } on failure; redirects on success. */
export async function startCheckout(inquiryId) {
  const supabase = await sdk();
  const { data } = await supabase.auth.getSession();
  const token = data?.session?.access_token;
  if (!token) return { error: new Error('Please sign in again.') };

  let res;
  try {
    res = await fetch('/.netlify/functions/create-checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ inquiryId }),
    });
  } catch {
    return { error: new Error("Couldn't reach the payment service. Try again.") };
  }

  const payload = await res.json().catch(() => ({}));
  if (!res.ok || !payload.url) {
    return { error: new Error(payload.error || 'Could not start checkout.') };
  }

  window.location.href = payload.url;
  return { error: null };
}

/** Payments on one request, newest first. RLS limits this to the owner. */
export async function fetchPayments(inquiryId) {
  const supabase = await sdk();
  const { data, error } = await supabase
    .from('payments')
    .select('*')
    .eq('inquiry_id', inquiryId)
    .order('created_at', { ascending: false });
  return { data: data || [], error };
}

/** The settled payment for a request, if there is one. */
export function paidPayment(payments) {
  return (payments || []).find((p) => p.status === 'paid') || null;
}