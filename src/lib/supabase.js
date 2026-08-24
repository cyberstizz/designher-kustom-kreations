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

const MAX_PHOTO_BYTES = 10 * 1024 * 1024;
const ALLOWED_PHOTO_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif'];

/**
 * Upload a customer's reference photo to the private inquiry-photos bucket.
 * Returns the storage PATH (not a URL) — the bucket is private, so a link
 * only exists when the admin asks for a signed one.
 *
 * These checks mirror the bucket's own limits so the visitor gets a clear
 * message instead of a raw storage error. The bucket enforces them again
 * server-side; this is courtesy, not security.
 */
export async function uploadReferencePhoto(file) {
  if (!supabase) return { path: null, error: new Error('Supabase is not configured') };
  if (!ALLOWED_PHOTO_TYPES.includes(file.type)) {
    return { path: null, error: new Error('Please attach a photo (JPG, PNG, WEBP or HEIC).') };
  }
  if (file.size > MAX_PHOTO_BYTES) {
    return { path: null, error: new Error('That photo is over 10MB. Please attach a smaller one.') };
  }

  const now = new Date();
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '-').slice(-60);
  const path = `${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, '0')}/${Date.now()}-${safeName}`;

  const { error } = await supabase.storage
    .from('inquiry-photos')
    .upload(path, file, { cacheControl: '3600', upsert: false });

  return error ? { path: null, error } : { path, error: null };
}

/**
 * Temporary link to a private inquiry photo. Signed URLs expire, which is
 * why the admin generates one on demand rather than storing it.
 */
export async function signedPhotoUrl(path, expiresInSeconds = 3600) {
  if (!supabase) return { url: null, error: new Error('Supabase is not configured') };
  const { data, error } = await supabase.storage
    .from('inquiry-photos')
    .createSignedUrl(path, expiresInSeconds);
  return { url: data?.signedUrl || null, error };
}

/** Insert a custom-order inquiry. Returns { ok, error }. */
export async function submitInquiry(payload) {
  if (!supabase) return { ok: false, error: new Error('Supabase is not configured') };
  const { error } = await supabase.from('inquiries').insert([payload]);
  return { ok: !error, error };
}