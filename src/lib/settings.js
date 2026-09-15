/**
 * Site settings — the images and captions that aren't products.
 *
 * Public reads go over plain REST for the same reason product reads do:
 * the home and about pages shouldn't pull the Supabase SDK just to show a
 * photo. Writes happen in the admin, which loads the SDK anyway.
 */
const REST_URL = import.meta.env.VITE_SUPABASE_URL;
const ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
const isConfigured = Boolean(REST_URL && ANON_KEY);

/** Built-in values used until Dianna sets her own. */
export const DEFAULTS = {
  hero_image_url: '/images/kreation-01.jpg',
  hero_badge: 'No. 001 — "Sapphire Row" Converse',
  founder_photo_url: '/images/DiannaBeatyPic.jpg',
  // Order book. 'true' closes new custom requests site-wide; the database
  // enforces it too (supabase/008_orders_paused.sql).
  orders_paused: 'false',
  orders_reopen_date: '',
  orders_paused_note: '',
};

/**
 * Returns every setting merged over the defaults, so callers can always
 * read a usable value. A blank stored value falls back to the default.
 */
export async function fetchSettings() {
  if (!isConfigured) return { ...DEFAULTS };
  try {
    const res = await fetch(`${REST_URL}/rest/v1/site_settings?select=key,value`, {
      headers: { apikey: ANON_KEY, Authorization: `Bearer ${ANON_KEY}` },
    });
    if (!res.ok) return { ...DEFAULTS };
    const rows = await res.json();
    const stored = Object.fromEntries(
      (rows || []).filter((r) => r.value).map((r) => [r.key, r.value])
    );
    return { ...DEFAULTS, ...stored };
  } catch {
    // A settings failure should never blank the page — fall back silently.
    return { ...DEFAULTS };
  }
}

async function sdk() {
  const mod = await import('./supabase.js');
  return mod.supabase;
}

export async function saveSetting(key, value) {
  const supabase = await sdk();
  const { error } = await supabase
    .from('site_settings')
    .upsert({ key, value }, { onConflict: 'key' });
  return { error };
}

const MAX_BYTES = 25 * 1024 * 1024; // backstop; photos are resized first

/** Upload a site image (hero, portrait) to the public product-images bucket. */
export async function uploadSiteImage(file) {
  if (!isConfigured) return { url: null, error: new Error('Supabase is not configured') };
  if (!file.type.startsWith('image/')) {
    return { url: null, error: new Error('That file is not an image.') };
  }
  const { compressImage } = await import('./image.js');
  const prepared = await compressImage(file, { maxDimension: 2400 });

  if (prepared.size > MAX_BYTES) {
    return {
      url: null,
      error: new Error("That photo is unusually large and couldn't be resized. Try saving it as a JPG first."),
    };
  }

  const supabase = await sdk();
  const safeName = prepared.name.replace(/[^a-zA-Z0-9._-]/g, '-').slice(-60);
  const path = `site/${Date.now()}-${safeName}`;
  const { error } = await supabase.storage
    .from('product-images')
    .upload(path, prepared, { cacheControl: '31536000', upsert: false });
  if (error) return { url: null, error };
  const { data } = supabase.storage.from('product-images').getPublicUrl(path);
  return { url: data.publicUrl, error: null };
}
/* ----------------------------------------------------------- order book */

/** True when Dianna has paused new custom orders. */
export function ordersPaused(settings) {
  return settings?.orders_paused === 'true';
}

/**
 * "Back open March 3" style line, or null when she gave no date.
 * Parsed as a local date so it doesn't slip a day in western time zones.
 */
export function reopenPhrase(settings) {
  const raw = settings?.orders_reopen_date;
  if (!raw) return null;
  const [y, m, d] = raw.split('-').map(Number);
  if (!y || !m || !d) return null;
  const date = new Date(y, m - 1, d);
  if (date < new Date(new Date().toDateString())) return null; // date already passed
  return date.toLocaleDateString(undefined, { month: 'long', day: 'numeric' });
}

/**
 * Cached read of just the order-book state, for chrome that renders on every
 * page (the header). One request per page load, shared by every caller.
 */
let bookPromise = null;
export function fetchOrderBook() {
  if (!bookPromise) {
    bookPromise = fetchSettings().then((s) => ({
      paused: ordersPaused(s),
      reopen: reopenPhrase(s),
      note: s.orders_paused_note || '',
    }));
  }
  return bookPromise;
}

/** Call after saving, so the next read isn't stale. */
export function clearOrderBookCache() {
  bookPromise = null;
}