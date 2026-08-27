/**
 * Customer-side reads.
 *
 * Row Level Security does the filtering — these queries ask for everything
 * and the database returns only what belongs to the signed-in customer.
 * Never add a customer_id filter here as if it were the security boundary;
 * it isn't, and writing it that way invites someone to "optimise" the
 * policy away later.
 */

async function sdk() {
  const mod = await import('./supabase.js');
  return mod.supabase;
}

/** Friendly wording for the internal status values. */
export const STATUS_LABELS = {
  new: 'Received',
  quoted: 'Quote ready',
  'in progress': 'Being made',
  shipped: 'On the way',
  closed: 'Complete',
};

export function statusLabel(status) {
  return STATUS_LABELS[status] || status;
}

/** Every request belonging to the signed-in customer, newest first. */
export async function fetchMyRequests() {
  const supabase = await sdk();
  if (!supabase) return { data: [], error: null };

  const { data: inquiries, error } = await supabase
    .from('inquiries')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return { data: [], error };
  if (!inquiries.length) return { data: [], error: null };

  // Attach the live quote, if there is one, so the list can show a price.
  const { data: quotes, error: quoteError } = await supabase
    .from('quotes')
    .select('*')
    .eq('status', 'sent');

  if (quoteError) {
    console.error('[account] could not load quotes', quoteError);
    return { data: inquiries.map((i) => ({ ...i, quote: null })), error: null };
  }

  const byInquiry = new Map((quotes || []).map((q) => [q.inquiry_id, q]));
  return {
    data: inquiries.map((i) => ({ ...i, quote: byInquiry.get(i.id) || null })),
    error: null,
  };
}