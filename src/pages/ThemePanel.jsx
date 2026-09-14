import { useEffect, useState } from 'react';
import { DEFAULTS, fetchSettings, uploadSiteImage } from '../lib/settings.js';
import {
  THEMES,
  THEME_KEYS,
  fetchActiveThemeKey,
  fetchThemeRows,
  saveThemeRow,
  setActiveTheme,
} from '../lib/themes.js';

/**
 * Home page look.
 *
 * Stage 1 — pick a theme. Nothing changes on the website yet.
 * Stage 2 — that theme's own photo, caption and dates come up, prefilled
 *           with whatever Dianna saved for it last time. She can change
 *           them, then press Publish to make it live.
 *
 * Every theme keeps its own row in home_themes, so flipping back to
 * Halloween next year shows last year's Halloween photo, no re-upload.
 */
export default function ThemePanel() {
  const [rows, setRows] = useState(null);      // { themeKey: row }
  const [active, setActive] = useState('default');
  const [selected, setSelected] = useState('default');
  const [site, setSite] = useState(DEFAULTS);

  const [form, setForm] = useState(emptyForm());
  const [busy, setBusy] = useState('');        // '', 'upload', 'save', 'publish'
  const [note, setNote] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([fetchThemeRows(), fetchActiveThemeKey(), fetchSettings()]).then(
      ([r, a, s]) => {
        setRows(r);
        setActive(a);
        setSelected(a);
        setSite(s);
        setForm(formFrom(a, r[a]));
      }
    );
  }, []);

  function pick(key) {
    setSelected(key);
    setForm(formFrom(key, rows?.[key]));
    setNote('');
    setError('');
  }

  const spec = THEMES[selected];
  const isDefault = selected === 'default';
  const previewImage = form.hero_image_url || site.hero_image_url || DEFAULTS.hero_image_url;
  const dirty = rows && JSON.stringify(form) !== JSON.stringify(formFrom(selected, rows[selected]));

  async function handleFile(e) {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setBusy('upload');
    setError('');
    const { url, error } = await uploadSiteImage(file);
    if (error) {
      setError(error.message);
      setBusy('');
      return;
    }
    // Save straight away so the photo survives even if she leaves the page.
    const res = await saveThemeRow(selected, { hero_image_url: url });
    setBusy('');
    if (res.error) {
      setError(res.error.message);
      return;
    }
    setForm((f) => ({ ...f, hero_image_url: url }));
    setRows((r) => ({ ...r, [selected]: { ...(r[selected] || {}), theme_key: selected, hero_image_url: url } }));
    setNote(`Photo saved for ${spec.label}.`);
  }

  async function handleUseDefaultPhoto() {
    setBusy('upload');
    const res = await saveThemeRow(selected, { hero_image_url: null });
    setBusy('');
    if (res.error) {
      setError(res.error.message);
      return;
    }
    setForm((f) => ({ ...f, hero_image_url: '' }));
    setRows((r) => ({ ...r, [selected]: { ...(r[selected] || {}), theme_key: selected, hero_image_url: null } }));
    setNote(`${spec.label} will use the main home page photo.`);
  }

  async function saveDetails() {
    setBusy('save');
    setError('');
    const patch = patchFrom(form);
    const res = await saveThemeRow(selected, patch);
    setBusy('');
    if (res.error) {
      setError(res.error.message);
      return;
    }
    setRows((r) => ({ ...r, [selected]: { ...(r[selected] || {}), theme_key: selected, ...patch } }));
    setNote(`Details saved for ${spec.label}.`);
  }

  async function publish() {
    setBusy('publish');
    setError('');
    // Save any unsaved details first so what goes live is what she sees here.
    if (dirty) {
      const patch = patchFrom(form);
      const r1 = await saveThemeRow(selected, patch);
      if (r1.error) {
        setError(r1.error.message);
        setBusy('');
        return;
      }
      setRows((r) => ({ ...r, [selected]: { ...(r[selected] || {}), theme_key: selected, ...patch } }));
    }
    const res = await setActiveTheme(selected);
    setBusy('');
    if (res.error) {
      setError(res.error.message);
      return;
    }
    setActive(selected);
    setNote(`${spec.label} is now live on the home page.`);
  }

  if (!rows) return <p className="admin-note">Loading…</p>;

  return (
    <div className="theme-panel">
      {note && <p className="admin-saved">{note}</p>}
      {error && <p className="admin-error">{error}</p>}

      {/* ------------------------------------------------ stage 1: pick */}
      <div className="setting-block">
        <label>Step 1 — choose a look</label>
        <p className="field-hint">
          Nothing changes on the website until you press Publish in step 2.
        </p>
        <div className="theme-grid" role="list">
          {THEME_KEYS.map((key) => {
            const t = THEMES[key];
            const saved = rows[key];
            return (
              <button
                type="button"
                key={key}
                role="listitem"
                className={
                  'theme-card' +
                  (selected === key ? ' selected' : '') +
                  (active === key ? ' live' : '')
                }
                onClick={() => pick(key)}
                aria-pressed={selected === key}
              >
                <span className="theme-swatch" aria-hidden="true">
                  {t.swatch.map((c, i) => (
                    <i key={i} style={{ background: c }} />
                  ))}
                </span>
                <span className="theme-name">{t.label}</span>
                {active === key && <span className="theme-live">Live now</span>}
                {active !== key && saved?.hero_image_url && (
                  <span className="theme-saved">Photo saved</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* --------------------------------------------- stage 2: details */}
      <div className="setting-block">
        <label>Step 2 — {spec.label}: photo and details</label>
        <p className="field-hint">
          {isDefault
            ? 'The default look uses the main home page photo and caption from the Photos tab.'
            : `This is what ${spec.label} looked like last time. Change anything you like, then publish.`}
        </p>

        <div className="setting-preview">
          <img src={previewImage} alt="" style={{ aspectRatio: '4 / 5' }} />
          <div className="setting-controls">
            {isDefault ? (
              <p className="field-hint">
                To change the default photo, use the Photos tab.
              </p>
            ) : (
              <>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFile}
                  disabled={busy !== ''}
                  aria-label={`Replace the ${spec.label} photo`}
                />
                {form.hero_image_url && (
                  <button
                    type="button"
                    className="btn-admin ghost small"
                    onClick={handleUseDefaultPhoto}
                    disabled={busy !== ''}
                  >
                    Use the main home page photo instead
                  </button>
                )}
                {busy === 'upload' && <span className="field-hint">Uploading…</span>}
                {!form.hero_image_url && (
                  <span className="field-hint">
                    No photo saved for {spec.label} yet — it will show the main home page photo until you add one.
                  </span>
                )}
              </>
            )}
          </div>
        </div>

        {!isDefault && (
          <div className="theme-fields">
            <div className="theme-field">
              <label htmlFor="th-badge">Caption on the photo</label>
              <input
                id="th-badge"
                value={form.hero_badge}
                onChange={(e) => setForm({ ...form, hero_badge: e.target.value })}
                placeholder={spec.badge || 'Leave blank to hide'}
              />
            </div>

            {spec.hasOrderBy && (
              <div className="theme-field">
                <label htmlFor="th-orderby">Last day to order for {spec.label}</label>
                <p className="field-hint">Shown in the banner, the hero and the marquee.</p>
                <input
                  id="th-orderby"
                  type="date"
                  value={form.order_by_date}
                  onChange={(e) => setForm({ ...form, order_by_date: e.target.value })}
                />
              </div>
            )}

            {spec.hasEvent && (
              <>
                <div className="theme-field">
                  <label htmlFor="th-venue">Where is the pop-up?</label>
                  <input
                    id="th-venue"
                    value={form.event_venue}
                    onChange={(e) => setForm({ ...form, event_venue: e.target.value })}
                    placeholder="Rochdale Village"
                  />
                </div>
                <div className="theme-field">
                  <label htmlFor="th-address">Address (for the directions button)</label>
                  <input
                    id="th-address"
                    value={form.event_address}
                    onChange={(e) => setForm({ ...form, event_address: e.target.value })}
                    placeholder="169-65 137th Ave, Jamaica, NY 11434"
                  />
                </div>
                <div className="theme-field-row">
                  <div className="theme-field">
                    <label htmlFor="th-date">Date</label>
                    <input
                      id="th-date"
                      type="date"
                      value={form.event_date}
                      onChange={(e) => setForm({ ...form, event_date: e.target.value })}
                    />
                  </div>
                  <div className="theme-field">
                    <label htmlFor="th-start">Starts</label>
                    <input
                      id="th-start"
                      type="time"
                      value={form.event_start}
                      onChange={(e) => setForm({ ...form, event_start: e.target.value })}
                    />
                  </div>
                  <div className="theme-field">
                    <label htmlFor="th-end">Ends</label>
                    <input
                      id="th-end"
                      type="time"
                      value={form.event_end}
                      onChange={(e) => setForm({ ...form, event_end: e.target.value })}
                    />
                  </div>
                </div>
              </>
            )}

            <button
              type="button"
              className="btn-admin ghost small"
              onClick={saveDetails}
              disabled={busy !== '' || !dirty}
            >
              {busy === 'save' ? 'Saving…' : 'Save details'}
            </button>
          </div>
        )}
      </div>

      {/* ------------------------------------------------- publish */}
      <div className="setting-block theme-publish">
        <label>Step 3 — publish</label>
        {active === selected ? (
          <p className="field-hint">
            {spec.label} is live right now.
            {dirty && ' You have unsaved changes above — Publish will save and apply them.'}
          </p>
        ) : (
          <p className="field-hint">
            The website is showing <b>{THEMES[active].label}</b>. Publishing switches it to{' '}
            <b>{spec.label}</b>.
          </p>
        )}
        <div className="theme-publish-row">
          <button
            type="button"
            className="btn-admin"
            onClick={publish}
            disabled={busy !== '' || (active === selected && !dirty)}
          >
            {busy === 'publish'
              ? 'Publishing…'
              : active === selected
                ? `Update ${spec.label}`
                : `Publish ${spec.label}`}
          </button>
          <a
            className="btn-admin ghost"
            href={`/?preview=${selected}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Preview first
          </a>
        </div>
        <p className="field-hint">
          Preview opens the home page in a new tab showing {spec.label} with your saved details, only for you.
        </p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------ helpers */

function emptyForm() {
  return {
    hero_image_url: '',
    hero_badge: '',
    order_by_date: '',
    event_venue: '',
    event_address: '',
    event_date: '',
    event_start: '',
    event_end: '',
  };
}

function formFrom(key, row) {
  const spec = THEMES[key] || THEMES.default;
  const f = emptyForm();
  if (!row) {
    // First time on this theme: the built-in caption is the starting point.
    f.hero_badge = spec.badge || '';
    return f;
  }
  f.hero_image_url = row.hero_image_url || '';
  f.hero_badge = row.hero_badge ?? spec.badge ?? '';
  f.order_by_date = row.order_by_date || '';
  f.event_venue = row.event_venue || '';
  f.event_address = row.event_address || '';
  f.event_date = row.event_date || '';
  f.event_start = (row.event_start || '').slice(0, 5);
  f.event_end = (row.event_end || '').slice(0, 5);
  return f;
}

/** Form -> row patch. Blanks become null so Postgres date/time columns accept them. */
function patchFrom(form) {
  const nz = (v) => (v === '' ? null : v);
  return {
    hero_badge: form.hero_badge,               // '' means "hide the caption"
    order_by_date: nz(form.order_by_date),
    event_venue: nz(form.event_venue),
    event_address: nz(form.event_address),
    event_date: nz(form.event_date),
    event_start: nz(form.event_start),
    event_end: nz(form.event_end),
  };
}