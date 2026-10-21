import { useEffect, useState } from 'react';
import {
  DEFAULT_CATEGORIES,
  categoryLabel,
  fetchCategories,
  createCategory,
  deleteCategory,
  slugify,
  fetchAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  saveOrder,
  uploadProductImage,
  uploadProductVideo,
  deleteProductVideo,
} from '../lib/products.js';

const BLANK = {
  title: '',
  slug: '',
  category: 'sneakers',
  blurb: '',
  description: '',
  image_url: '',
  images: [],
  video_url: '',
  published: false,
};

/* -------------------------------------------------------------- edit form */
function ProductForm({ product, categories, onSaved, onCancel }) {
  const isNew = !product.id;
  const [form, setForm] = useState({ ...BLANK, ...product });
  const [slugTouched, setSlugTouched] = useState(!isNew);
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [videoBusy, setVideoBusy] = useState(false);
  const [error, setError] = useState('');

  // The video this product had when the form opened. Anything uploaded
  // after that is "new" until saved, so Cancel can clean it up.
  const originalVideo = product.video_url || '';

  function set(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  // Auto-slug from the title until the user edits the slug themselves.
  function onTitle(value) {
    setForm((f) => ({ ...f, title: value, slug: slugTouched ? f.slug : slugify(value) }));
  }

  async function handleFiles(fileList, target) {
    const files = Array.from(fileList || []);
    if (!files.length) return;
    setUploading(true);
    setError('');
    for (const file of files) {
      const { url, error } = await uploadProductImage(file, form.slug || slugify(form.title));
      if (error) {
        setError(error.message);
        break;
      }
      if (target === 'cover') set('image_url', url);
      else setForm((f) => ({ ...f, images: [...(f.images || []), url] }));
    }
    setUploading(false);
  }

  async function handleVideo(file) {
    if (!file) return;
    setVideoBusy(true);
    setError('');
    const { url, error } = await uploadProductVideo(file, form.slug || slugify(form.title));
    setVideoBusy(false);
    if (error) {
      setError(error.message);
      return;
    }
    // Replacing a video uploaded in this same session: that one was never
    // saved, so nothing else points at it. Remove it now.
    if (form.video_url && form.video_url !== originalVideo) deleteProductVideo(form.video_url);
    set('video_url', url);
  }

  function removeVideo() {
    if (form.video_url && form.video_url !== originalVideo) deleteProductVideo(form.video_url);
    set('video_url', '');
  }

  function handleCancel() {
    // An unsaved upload is an orphan the moment the form closes.
    if (form.video_url && form.video_url !== originalVideo) deleteProductVideo(form.video_url);
    onCancel();
  }

  function removeGalleryImage(url) {
    setForm((f) => ({ ...f, images: (f.images || []).filter((u) => u !== url) }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.title.trim()) return setError('Give the piece a name.');
    if (!form.slug.trim()) return setError('The web address (slug) cannot be empty.');

    setBusy(true);
    setError('');
    const fields = {
      title: form.title.trim(),
      slug: slugify(form.slug),
      category: form.category,
      blurb: form.blurb?.trim() || null,
      description: form.description?.trim() || null,
      image_url: form.image_url || null,
      images: form.images || [],
      video_url: form.video_url || null,
      published: form.published,
    };

    const { data, error } = isNew
      ? await createProduct(fields)
      : await updateProduct(product.id, fields);

    setBusy(false);
    if (error) {
      // 23505 is Postgres' unique-violation code; here it can only be the slug.
      setError(
        error.code === '23505'
          ? 'Another piece already uses that web address. Change the slug.'
          : error.message
      );
      return;
    }
    // Saved. If the video was replaced or removed, the old file is now
    // unused — delete it so it stops counting against the 1 GB.
    if (originalVideo && originalVideo !== (form.video_url || '')) deleteProductVideo(originalVideo);
    onSaved(data);
  }

  return (
    <form className="product-form" onSubmit={handleSubmit}>
      <h2>{isNew ? 'Add a piece' : 'Edit piece'}</h2>

      <label htmlFor="p-title">Name</label>
      <input
        id="p-title"
        value={form.title}
        onChange={(e) => onTitle(e.target.value)}
        placeholder="Sapphire Row Converse"
        required
      />

      <label htmlFor="p-slug">Web address</label>
      <input
        id="p-slug"
        value={form.slug}
        onChange={(e) => {
          setSlugTouched(true);
          set('slug', e.target.value);
        }}
        placeholder="sapphire-row-converse"
      />
      <p className="field-hint">designher-kustom-kreations.netlify.app/product/{form.slug || '…'}</p>

      <label htmlFor="p-category">Category</label>
      <select
        id="p-category"
        value={form.category}
        onChange={(e) => set('category', e.target.value)}
      >
        {categories.map((c) => (
          <option key={c.id} value={c.id}>
            {c.label}
          </option>
        ))}
      </select>
      <p className="field-hint">Need a new one, like Belts or Bags? Add it under Categories on the main Products list.</p>

      <label htmlFor="p-blurb">Short line</label>
      <input
        id="p-blurb"
        value={form.blurb || ''}
        onChange={(e) => set('blurb', e.target.value)}
        placeholder="Hand-set pearls and crystal on blue canvas"
      />

      <label htmlFor="p-desc">Description</label>
      <textarea
        id="p-desc"
        rows={5}
        value={form.description || ''}
        onChange={(e) => set('description', e.target.value)}
        placeholder="Tell the story of the piece — what it's made from, who it suits, how long it takes."
      />

      <label>Main photo</label>
      {form.image_url ? (
        <div className="cover-preview">
          <img src={form.image_url} alt="" />
          <button type="button" className="btn-admin ghost small" onClick={() => set('image_url', '')}>
            Remove
          </button>
        </div>
      ) : (
        <p className="field-hint">No main photo yet.</p>
      )}
      <input
        type="file"
        accept="image/*"
        onChange={(e) => {
          handleFiles(e.target.files, 'cover');
          e.target.value = '';
        }}
      />

      <label>More photos</label>
      {form.images?.length > 0 && (
        <div className="gallery-preview">
          {form.images.map((url) => (
            <div key={url} className="gallery-thumb">
              <img src={url} alt="" />
              <button type="button" onClick={() => removeGalleryImage(url)} aria-label="Remove photo">
                ×
              </button>
            </div>
          ))}
        </div>
      )}
      <input
        type="file"
        accept="image/*"
        multiple
        onChange={(e) => {
          handleFiles(e.target.files, 'gallery');
          e.target.value = '';
        }}
      />

      <label>Video (optional)</label>
      {form.video_url ? (
        <div className="video-preview">
          <video src={form.video_url} controls playsInline preload="metadata" />
          <button type="button" className="btn-admin ghost small" onClick={removeVideo}>
            Remove video
          </button>
        </div>
      ) : (
        <p className="field-hint">
          One short clip, under 30 seconds and 30 MB. 10 to 15 seconds of the piece
          catching the light works best. It plays on the product page when someone taps it.
        </p>
      )}
      <input
        type="file"
        accept="video/mp4,video/quicktime,video/webm,.mp4,.mov,.m4v,.webm"
        disabled={videoBusy}
        onChange={(e) => {
          handleVideo(e.target.files?.[0]);
          e.target.value = '';
        }}
      />
      {videoBusy && <p className="field-hint">Checking and uploading video… keep this page open.</p>}

      <label className="checkbox-row">
        <input
          type="checkbox"
          checked={form.published}
          onChange={(e) => set('published', e.target.checked)}
        />
        <span>
          Show this on the website
          <small>Leave unchecked to keep it as a draft only you can see.</small>
        </span>
      </label>

      {uploading && <p className="field-hint">Uploading photo…</p>}
      {error && <p className="admin-error">{error}</p>}

      <div className="form-actions">
        <button className="btn-admin" type="submit" disabled={busy || uploading || videoBusy}>
          {busy ? 'Saving…' : isNew ? 'Add piece' : 'Save changes'}
        </button>
        <button className="btn-admin ghost" type="button" onClick={handleCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
}

/* ------------------------------------------------------------------ panel */
export default function ProductsPanel() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(null);
  const [orderDirty, setOrderDirty] = useState(false);
  const [savingOrder, setSavingOrder] = useState(false);

  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [newCategory, setNewCategory] = useState('');
  const [categoryBusy, setCategoryBusy] = useState(false);

  async function load() {
    const [{ data, error }, cats] = await Promise.all([
      fetchAllProducts(),
      fetchCategories({ fresh: true }),
    ]);
    if (error) setError(error.message);
    else setRows(data);
    setCategories(cats);
    setLoading(false);
  }

  async function handleAddCategory(e) {
    e.preventDefault();
    if (!newCategory.trim()) return;
    setCategoryBusy(true);
    setError('');
    const nextOrder = categories.reduce((max, c) => Math.max(max, c.sort_order ?? 0), 0) + 1;
    const { error } = await createCategory(newCategory, nextOrder);
    setCategoryBusy(false);
    if (error) return setError(error.message);
    setNewCategory('');
    setCategories(await fetchCategories({ fresh: true }));
  }

  async function handleDeleteCategory(cat) {
    if (!window.confirm(`Remove the "${cat.label}" category?`)) return;
    setError('');
    const { error } = await deleteCategory(cat.id, cat.label);
    if (error) return setError(error.message);
    setCategories(await fetchCategories({ fresh: true }));
  }

  // How many pieces sit in each category. A category with pieces in it
  // can't be removed, so its remove button is hidden.
  const countFor = (id) => rows.filter((r) => r.category === id).length;

  useEffect(() => {
    load();
  }, []);

  function move(index, delta) {
    const next = [...rows];
    const target = index + delta;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    setRows(next);
    setOrderDirty(true);
  }

  async function persistOrder() {
    setSavingOrder(true);
    const { error } = await saveOrder(rows);
    setSavingOrder(false);
    if (error) setError(error.message);
    else {
      setOrderDirty(false);
      load();
    }
  }

  async function togglePublished(row) {
    setRows((prev) =>
      prev.map((r) => (r.id === row.id ? { ...r, published: !r.published } : r))
    );
    const { error } = await updateProduct(row.id, { published: !row.published });
    if (error) {
      setError(error.message);
      load();
    }
  }

  async function handleDelete(row) {
    if (!window.confirm(`Delete "${row.title}"? This cannot be undone.`)) return;
    const { error } = await deleteProduct(row.id, row.video_url);
    if (error) setError(error.message);
    else setRows((prev) => prev.filter((r) => r.id !== row.id));
  }

  if (editing) {
    return (
      <ProductForm
        product={editing}
        categories={categories}
        onCancel={() => setEditing(null)}
        onSaved={() => {
          setEditing(null);
          setLoading(true);
          load();
        }}
      />
    );
  }

  if (loading) return <p className="admin-note">Loading pieces…</p>;

  return (
    <>
      {error && <p className="admin-error">{error}</p>}

      <div className="admin-toolbar">
        <button className="btn-admin small" onClick={() => setEditing({ ...BLANK })}>
          + Add a piece
        </button>
        <span className="admin-count">
          {rows.length} {rows.length === 1 ? 'piece' : 'pieces'}
        </span>
      </div>

      <div className="category-manager">
        <span className="cm-label">Categories</span>
        <div className="cm-chips">
          {categories.map((c) => {
            const count = countFor(c.id);
            return (
              <span className="cm-chip" key={c.id}>
                {c.label}
                <small>{count}</small>
                {count === 0 && (
                  <button
                    type="button"
                    onClick={() => handleDeleteCategory(c)}
                    aria-label={`Remove the ${c.label} category`}
                  >
                    ×
                  </button>
                )}
              </span>
            );
          })}
        </div>
        <form className="cm-add" onSubmit={handleAddCategory}>
          <input
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="New category, e.g. Belts"
            maxLength={40}
            aria-label="New category name"
          />
          <button className="btn-admin small" type="submit" disabled={categoryBusy || !newCategory.trim()}>
            {categoryBusy ? 'Adding…' : 'Add category'}
          </button>
        </form>
        <p className="field-hint">
          New categories show up as a filter on the Shop page right away. A category
          can only be removed once it has no pieces in it.
        </p>
      </div>

      {orderDirty && (
        <div className="order-bar">
          <span>Order changed.</span>
          <button className="btn-admin small" onClick={persistOrder} disabled={savingOrder}>
            {savingOrder ? 'Saving…' : 'Save order'}
          </button>
        </div>
      )}

      {rows.length === 0 ? (
        <p className="admin-note">
          No pieces yet. Add your first one and it appears on the Shop page as soon
          as you tick "Show this on the website".
        </p>
      ) : (
        <ul className="product-list">
          {rows.map((row, i) => (
            <li key={row.id} className={`product-row${row.published ? '' : ' draft'}`}>
              <div className="row-order">
                <button onClick={() => move(i, -1)} disabled={i === 0} aria-label="Move up">
                  ↑
                </button>
                <button
                  onClick={() => move(i, 1)}
                  disabled={i === rows.length - 1}
                  aria-label="Move down"
                >
                  ↓
                </button>
              </div>

              <div className="row-thumb">
                {row.image_url ? <img src={row.image_url} alt="" /> : <span>No photo</span>}
              </div>

              <div className="row-main">
                <span className="row-title">{row.title}</span>
                <span className="row-meta">
                  {categoryLabel(row.category)}
                  {!row.published && <em> · Draft</em>}
                </span>
              </div>

              <div className="row-actions">
                <button className="btn-admin ghost small" onClick={() => togglePublished(row)}>
                  {row.published ? 'Hide' : 'Publish'}
                </button>
                <button className="btn-admin ghost small" onClick={() => setEditing(row)}>
                  Edit
                </button>
                <button className="btn-admin ghost small danger" onClick={() => handleDelete(row)}>
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}