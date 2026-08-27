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

  // Attach the most recent quote that still counts, so the list can show a
  // price and whether the customer already accepted it.
  const { data: quotes, error: quoteError } = await supabase
    .from('quotes')
    .select('*')
    .in('status', ['sent', 'accepted'])
    .order('created_at', { ascending: false });

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

/** One request with its live quote and full conversation. */
export async function fetchRequest(id) {
  const supabase = await sdk();
  if (!supabase) return { data: null, error: null };

  const { data: inquiry, error } = await supabase
    .from('inquiries')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  // RLS returns nothing rather than an error when the row isn't theirs, so
  // "not found" and "not yours" look identical from here. That's intended.
  if (error || !inquiry) return { data: null, error };

  const [{ data: quotes }, { data: messages }] = await Promise.all([
    supabase.from('quotes').select('*').eq('inquiry_id', id).order('created_at', { ascending: false }),
    supabase.from('messages').select('*').eq('inquiry_id', id).order('created_at', { ascending: true }),
  ]);

  const live = (quotes || []).find((qt) => qt.status === 'sent' || qt.status === 'accepted') || null;
  return { data: { ...inquiry, quote: live, messages: messages || [] }, error: null };
}

/** What the customer should see, blending request status with quote status. */
export function displayStatus(request) {
  if (request.quote?.status === 'accepted') return 'Accepted';
  if (request.status === 'quoted') return 'Quote ready';
  return statusLabel(request.status);
}