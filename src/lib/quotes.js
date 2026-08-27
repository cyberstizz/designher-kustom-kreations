/**
 * Quotes and messages.
 *
 * Amounts live in whole cents everywhere below the UI. Dollars only exist
 * at the edges — parsed on the way in, formatted on the way out — so no
 * float arithmetic ever touches a price.
 */

async function sdk() {
  const mod = await import('./supabase.js');
  return mod.supabase;
}

/** 22000 -> "$220.00" */
export function formatMoney(cents) {
  if (cents == null) return '';
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })
    .format(cents / 100);
}

/**
 * "$1,250.50" / "1250.5" / "1,250" -> 125050
 * Returns null for anything that isn't a positive amount.
 */
export function parseMoney(input) {
  if (input == null) return null;
  const cleaned = String(input).replace(/[$,\s]/g, '');
  if (!/^\d*\.?\d{0,2}$/.test(cleaned) || cleaned === '' || cleaned === '.') return null;
  const cents = Math.round(parseFloat(cleaned) * 100);
  return Number.isFinite(cents) && cents > 0 ? cents : null;
}

export async function fetchQuotes(inquiryId) {
  const supabase = await sdk();
  const { data, error } = await supabase
    .from('quotes')
    .select('*')
    .eq('inquiry_id', inquiryId)
    .order('created_at', { ascending: false });
  return { data: data || [], error };
}

export async function fetchMessages(inquiryId) {
  const supabase = await sdk();
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('inquiry_id', inquiryId)
    .order('created_at', { ascending: true });
  return { data: data || [], error };
}

/**
 * Send a price. The database trigger supersedes any outstanding quote and
 * moves the request to "quoted", so this is a single write.
 *
 * An accompanying note is posted as a message too, which keeps the whole
 * conversation readable in one place instead of split across two shapes.
 */
export async function sendQuote(inquiryId, { amountCents, message }) {
  const supabase = await sdk();
  const { data: sessionData } = await supabase.auth.getSession();
  const userId = sessionData?.session?.user?.id ?? null;

  const { data, error } = await supabase
    .from('quotes')
    .insert([{ inquiry_id: inquiryId, amount_cents: amountCents, message: message || null, created_by: userId }])
    .select()
    .single();

  if (error) return { data: null, error };

  if (message?.trim()) {
    const { error: msgError } = await supabase
      .from('messages')
      .insert([{ inquiry_id: inquiryId, sender: 'admin', author_id: userId, body: message.trim() }]);
    // The quote is the thing that matters; a failed copy in the thread
    // shouldn't look like the price failed to send.
    if (msgError) console.error('[quotes] note not added to thread', msgError);
  }

  return { data, error: null };
}

export async function sendMessage(inquiryId, body, sender = 'admin') {
  const supabase = await sdk();
  const { data: sessionData } = await supabase.auth.getSession();
  const userId = sessionData?.session?.user?.id ?? null;

  const { data, error } = await supabase
    .from('messages')
    .insert([{ inquiry_id: inquiryId, sender, author_id: userId, body: body.trim() }])
    .select()
    .single();
  return { data, error };
}