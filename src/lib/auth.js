/**
 * Authentication helpers.
 *
 * Two kinds of account now exist and they are not interchangeable:
 *
 *   admin     Dianna (and you). Listed in the admins table. Sees everything.
 *   customer  Anyone who submitted a request. Sees only their own.
 *
 * "Signed in" no longer implies "allowed". Anything that reveals or changes
 * shop data must check isAdmin() rather than the presence of a session.
 * The database enforces this too — see supabase/005_permissions.sql — so a
 * mistake here is a bad user experience, not a data leak.
 */

async function sdk() {
  const mod = await import('./supabase.js');
  return mod.supabase;
}

/** Is the signed-in user an admin? False when signed out. */
export async function isAdmin() {
  const supabase = await sdk();
  if (!supabase) return false;

  const { data: sessionData } = await supabase.auth.getSession();
  const userId = sessionData?.session?.user?.id;
  if (!userId) return false;

  // RLS lets a user see only their own row here, so an empty result means
  // "not an admin" rather than "query failed".
  const { data, error } = await supabase
    .from('admins')
    .select('user_id')
    .eq('user_id', userId)
    .maybeSingle();

  if (error) {
    console.error('[auth] admin check failed', error);
    return false;
  }
  return Boolean(data);
}

/**
 * Attach any requests this person submitted before they had an account.
 * Matches on the verified email in their session. Safe to call on every
 * sign-in; it does nothing once the rows are claimed.
 */
export async function claimMyInquiries() {
  const supabase = await sdk();
  if (!supabase) return { claimed: 0, error: null };
  const { data, error } = await supabase.rpc('claim_my_inquiries');
  return { claimed: data ?? 0, error };
}

/** Passwordless sign-in for customers. */
export async function sendMagicLink(email, redirectTo) {
  const supabase = await sdk();
  if (!supabase) return { error: new Error('Supabase is not configured') };
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: redirectTo || `${window.location.origin}/account` },
  });
  return { error };
}

export async function signOut() {
  const supabase = await sdk();
  if (supabase) await supabase.auth.signOut();
}