import { createClient } from '@supabase/supabase-js';

/**
 * Supabase client.
 *
 * Both values below are PUBLIC — Vite inlines anything prefixed VITE_ into
 * the browser bundle. That is expected and fine for the anon key: it is
 * designed to be public, and Row Level Security (see supabase/schema.sql)
 * is what actually protects the data.
 *
 * Never put the service_role key in this file or any VITE_ variable. That
 * key bypasses RLS entirely.
 */
const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(url && anonKey);

if (!isSupabaseConfigured && import.meta.env.DEV) {
  console.warn(
    '[supabase] VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY are not set. ' +
      'Copy .env.example to .env.local and fill them in. ' +
      'The inquiry form and admin page will not work until you do.'
  );
}

export const supabase = isSupabaseConfigured ? createClient(url, anonKey) : null;

/** Insert a custom-order inquiry. Returns { ok, error }. */
export async function submitInquiry(payload) {
  if (!supabase) return { ok: false, error: new Error('Supabase is not configured') };
  const { error } = await supabase.from('inquiries').insert([payload]);
  return { ok: !error, error };
}