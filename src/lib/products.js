/**
 * Product data.
 *
 * Public reads go over plain fetch against Supabase's REST endpoint instead
 * of the JS SDK. The SDK is ~58KB gzipped and Shop/Product are the pages that
 * need to paint fastest, so it is loaded lazily and only where it earns its
 * weight: auth, storage uploads and admin writes.
 */
const REST_URL = import.meta.env.VITE_SUPABASE_URL;
const ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
const isSupabaseConfigured = Boolean(REST_URL && ANON_KEY);

async function rest(path) {
  const res = await fetch(`${REST_URL}/rest/v1/${path}`, {
    headers: { apikey: ANON_KEY, Authorization: `Bearer ${ANON_KEY}` },
  });
  if (!res.ok) throw new Error(`Supabase returned ${res.status}`);
  return res.json();
}

/** The SDK, loaded on demand. Only admin paths pay for it. */
async function sdk() {
  const mod = await import('./supabase.js');
  return mod.supabase;
}

export const CATEGORIES = [
  { id: 'sneakers', label: 'Sneakers' },
  { id: 'boots', label: 'Boots' },
  { id: 'jackets', label: 'Jackets' },
  { id: 'crocs', label: 'Crocs' },
  { id: 'hats', label: 'Hats' },
  { id: 'kids', label: 'Kids' },
];

export function categoryLabel(id) {
  return CATEGORIES.find((c) => c.id === id)?.label || id;
}

/** "Sapphire Row Converse" -> "sapphire-row-converse" */
export function slugify(text) {
  return String(text)
    .toLowerCase()
    .trim()
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
}

/** Cover image first, then any extra gallery shots, de-duplicated. */
export function galleryFor(product) {
  if (!product) return [];
  const all = [product.image_url, ...(product.images || [])].filter(Boolean);
  return [...new Set(all)];
}

/* ------------------------------------------------------------ public reads */

/** Published products, in Dianna's chosen order. */
export async function fetchPublishedProducts() {
  if (!isSupabaseConfigured) return { data: [], error: null, unconfigured: true };
  try {
    const data = await rest(
      'products?select=*&published=eq.true&order=sort_order.asc,created_at.desc'
    );
    return { data: data || [], error: null };
  } catch (error) {
    return { data: [], error };
  }
}

export async function fetchProductBySlug(slug) {
  if (!isSupabaseConfigured) return { data: null, error: null, unconfigured: true };
  try {
    const rows = await rest(
      `products?select=*&published=eq.true&slug=eq.${encodeURIComponent(slug)}&limit=1`
    );
    // An empty array is the normal result for a mistyped URL, not an error.
    return { data: rows[0] || null, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

/* ------------------------------------------------------------- admin reads */

/** Everything, drafts included. Requires a signed-in session. */
export async function fetchAllProducts() {
  if (!isSupabaseConfigured) return { data: [], error: null };
  const supabase = await sdk();
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false });
  return { data: data || [], error };
}

export async function createProduct(fields) {
  const supabase = await sdk();
  const { data, error } = await supabase.from('products').insert([fields]).select().single();
  return { data, error };
}

export async function updateProduct(id, fields) {
  const supabase = await sdk();
  const { data, error } = await supabase
    .from('products')
    .update(fields)
    .eq('id', id)
    .select()
    .single();
  return { data, error };
}

export async function deleteProduct(id, videoUrl = null) {
  const supabase = await sdk();
  const { error } = await supabase.from('products').delete().eq('id', id);
  // Free storage is 1 GB for everything. A video left behind by a deleted
  // product is invisible and still counts against it, so remove it too.
  if (!error && videoUrl) await deleteProductVideo(videoUrl);
  return { error };
}

/** Persist a reordered list. Writes only the rows whose position changed. */
export async function saveOrder(products) {
  const supabase = await sdk();
  const updates = products
    .map((p, i) => ({ p, i }))
    .filter(({ p, i }) => p.sort_order !== i)
    .map(({ p, i }) => supabase.from('products').update({ sort_order: i }).eq('id', p.id));
  const results = await Promise.all(updates);
  const failed = results.find((r) => r.error);
  return { error: failed ? failed.error : null };
}

/* ----------------------------------------------------------------- storage */

// Ceiling on what actually reaches storage. Photos are resized in the
// browser first, so a 30MB camera file lands here at well under 1MB and
// this limit is only a backstop for something that couldn't be resized.
const MAX_UPLOAD_BYTES = 25 * 1024 * 1024;

/**
 * Upload one photo to the product-images bucket and return its public URL.
 * Filenames are prefixed with a timestamp so re-uploading the same photo
 * never silently overwrites an older one.
 */
export async function uploadProductImage(file, slug) {
  if (!isSupabaseConfigured) return { url: null, error: new Error('Supabase is not configured') };
  if (!file.type.startsWith('image/')) {
    return { url: null, error: new Error('That file is not an image.') };
  }

  const { compressImage } = await import('./image.js');
  const prepared = await compressImage(file);

  if (prepared.size > MAX_UPLOAD_BYTES) {
    return {
      url: null,
      error: new Error("That photo is unusually large and couldn't be resized. Try saving it as a JPG first."),
    };
  }

  const supabase = await sdk();
  const safeName = prepared.name.replace(/[^a-zA-Z0-9._-]/g, '-');
  const path = `${slug || 'unsorted'}/${Date.now()}-${safeName}`;

  const { error } = await supabase.storage
    .from('product-images')
    .upload(path, prepared, { cacheControl: '31536000', upsert: false });
  if (error) return { url: null, error };

  const { data } = supabase.storage.from('product-images').getPublicUrl(path);
  return { url: data.publicUrl, error: null };
}
/* ------------------------------------------------------------------ video */

const VIDEO_BUCKET = 'product-videos';

// Must match file_size_limit in supabase/012_product_videos.sql. The bucket
// enforces it regardless; checking here just gives a readable message
// instead of a storage error.
const MAX_VIDEO_BYTES = 30 * 1024 * 1024;
const MAX_VIDEO_SECONDS = 30;

/** How long a video file runs, read from its metadata without uploading it. */
function videoDuration(file) {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const el = document.createElement('video');
    el.preload = 'metadata';
    el.onloadedmetadata = () => {
      URL.revokeObjectURL(url);
      resolve(Number.isFinite(el.duration) ? el.duration : null);
    };
    el.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(null); // unreadable here — let the size check and upload decide
    };
    el.src = url;
  });
}

/**
 * True if the file is HEVC (H.265) — the iPhone's "High Efficiency" camera
 * format. It plays on her iPhone, which is why it looks fine while uploading,
 * but Chrome on many Windows and Android devices and Firefox cannot play it,
 * so customers would see a black box. The codec is named in the file's
 * header as the four letters hvc1 or hev1; that header sits at either the
 * start or the end of the file, so both ends are checked.
 */
async function isHevc(file) {
  const CHUNK = 4 * 1024 * 1024;
  const parts = [file.slice(0, CHUNK)];
  if (file.size > CHUNK) parts.push(file.slice(Math.max(CHUNK, file.size - CHUNK)));
  for (const part of parts) {
    const bytes = new Uint8Array(await part.arrayBuffer());
    for (let i = 0; i < bytes.length - 3; i++) {
      // 'h' then 'v'/'e' ... checked byte by byte to avoid decoding 8 MB of text
      if (bytes[i] !== 0x68) continue;
      const b1 = bytes[i + 1];
      const b2 = bytes[i + 2];
      const b3 = bytes[i + 3];
      const isCodecName =
        (b1 === 0x76 && b2 === 0x63 && b3 === 0x31) || (b1 === 0x65 && b2 === 0x76 && b3 === 0x31);
      // The codec name sits exactly 16 bytes after the 'stsd' box label.
      // Requiring that keeps random video data from ever triggering this.
      if (
        isCodecName &&
        i >= 16 &&
        bytes[i - 16] === 0x73 && // s
        bytes[i - 15] === 0x74 && // t
        bytes[i - 14] === 0x73 && // s
        bytes[i - 13] === 0x64 // d
      ) {
        return true;
      }
    }
  }
  return false;
}

/**
 * Upload one product video and return its public URL.
 *
 * Phone videos are the edge-case minefield, so this checks before uploading:
 * type, size, length, and the iPhone HEVC format. Every rejection says what
 * to do about it in plain words, because Dianna will be doing this from her
 * phone without anyone to ask.
 */
export async function uploadProductVideo(file, slug) {
  if (!isSupabaseConfigured) return { url: null, error: new Error('Supabase is not configured') };

  const type = file.type || '';
  const ext = (file.name.split('.').pop() || '').toLowerCase();
  const looksLikeVideo = type.startsWith('video/') || ['mp4', 'mov', 'm4v', 'webm'].includes(ext);
  if (!looksLikeVideo) {
    return { url: null, error: new Error('That file is not a video.') };
  }

  if (file.size > MAX_VIDEO_BYTES) {
    const mb = Math.round(file.size / 1024 / 1024);
    return {
      url: null,
      error: new Error(
        `That video is ${mb} MB and the limit is 30 MB. Trim it shorter (10 to 15 seconds is plenty), ` +
          'or record at 1080p instead of 4K (iPhone: Settings → Camera → Record Video).'
      ),
    };
  }

  const seconds = await videoDuration(file);
  if (seconds && seconds > MAX_VIDEO_SECONDS + 0.5) {
    return {
      url: null,
      error: new Error(
        `That video runs ${Math.round(seconds)} seconds. Keep product videos under ${MAX_VIDEO_SECONDS} — ` +
          'trim it in your Photos app first.'
      ),
    };
  }

  if (await isHevc(file)) {
    return {
      url: null,
      error: new Error(
        "This video is in the iPhone's High Efficiency format, which many customers' phones and browsers " +
          "can't play. On your iPhone go to Settings → Camera → Formats, choose Most Compatible, " +
          'then record the video again.'
      ),
    };
  }

  // iPhone .mov files that pass the HEVC check are H.264, which every browser
  // plays — but some browsers refuse the video/quicktime label itself. MOV and
  // MP4 share the same container, so store it as .mp4 and it plays everywhere.
  const isWebm = type === 'video/webm' || ext === 'webm';
  const contentType = isWebm ? 'video/webm' : 'video/mp4';
  const outExt = isWebm ? 'webm' : 'mp4';

  const supabase = await sdk();
  const path = `${slug || 'unsorted'}-${Date.now()}.${outExt}`;

  const { error } = await supabase.storage
    .from(VIDEO_BUCKET)
    .upload(path, file, { cacheControl: '31536000', upsert: false, contentType });
  if (error) return { url: null, error };

  const { data } = supabase.storage.from(VIDEO_BUCKET).getPublicUrl(path);
  return { url: data.publicUrl, error: null };
}

/**
 * Remove a product video file from storage. Never throws: a file that
 * fails to delete wastes some space, but must not block saving the product.
 */
export async function deleteProductVideo(url) {
  if (!url) return;
  const marker = `/object/public/${VIDEO_BUCKET}/`;
  const at = url.indexOf(marker);
  if (at === -1) return;
  const path = decodeURIComponent(url.slice(at + marker.length));
  try {
    const supabase = await sdk();
    const { error } = await supabase.storage.from(VIDEO_BUCKET).remove([path]);
    if (error) console.error('[video] delete failed', error.message);
  } catch (err) {
    console.error('[video] delete failed', err.message);
  }
}
