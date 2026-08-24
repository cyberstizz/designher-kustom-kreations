/**
 * Shrink a photo in the browser before it is uploaded.
 *
 * Phone cameras produce 12–30MB files at resolutions far beyond anything a
 * web page displays. Uploading those costs Dianna time on mobile data, eats
 * her storage quota, and makes the site slow for visitors. Resizing here
 * fixes all three at once, and it means the size limit stops being something
 * she has to think about.
 *
 * Everything degrades safely: if the browser can't decode the image (an
 * older browser handed a HEIC file, say), the original is returned untouched
 * and the upload proceeds as before.
 */

const DEFAULTS = {
  maxDimension: 2000, // longest edge — comfortably past any display size
  quality: 0.85, // visually indistinguishable from the original
  skipUnder: 900 * 1024, // already small enough; don't re-encode it
};

export async function compressImage(file, options = {}) {
  const { maxDimension, quality, skipUnder } = { ...DEFAULTS, ...options };

  if (!file || !file.type?.startsWith('image/')) return file;
  if (file.size <= skipUnder) return file;
  if (typeof document === 'undefined' || typeof createImageBitmap !== 'function') return file;

  try {
    // from-image applies the EXIF rotation, so portrait phone shots don't
    // come out sideways once the canvas strips the metadata.
    const bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' });

    const longest = Math.max(bitmap.width, bitmap.height);
    const scale = Math.min(1, maxDimension / longest);
    const width = Math.round(bitmap.width * scale);
    const height = Math.round(bitmap.height * scale);

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return file;
    ctx.drawImage(bitmap, 0, 0, width, height);
    bitmap.close?.();

    const blob = await new Promise((resolve) =>
      canvas.toBlob(resolve, 'image/jpeg', quality)
    );

    // If re-encoding didn't actually help, keep the original.
    if (!blob || blob.size >= file.size) return file;

    const name = file.name.replace(/\.[^.]+$/, '') + '.jpg';
    return new File([blob], name, { type: 'image/jpeg', lastModified: Date.now() });
  } catch {
    return file;
  }
}

/** "3.4MB" — for telling someone what happened to their photo. */
export function humanSize(bytes) {
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)}KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
}