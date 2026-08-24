import { useEffect, useState } from 'react';
import { DEFAULTS, fetchSettings, saveSetting, uploadSiteImage } from '../lib/settings.js';

/** One editable image: shows what's live, lets her replace or reset it. */
function ImageSetting({ label, hint, settingKey, value, onChange, aspect }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const isDefault = !value || value === DEFAULTS[settingKey];

  async function handleFile(e) {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    setBusy(true);
    setError('');
    const { url, error } = await uploadSiteImage(file);
    if (error) {
      setError(error.message);
      setBusy(false);
      return;
    }
    const res = await saveSetting(settingKey, url);
    setBusy(false);
    if (res.error) setError(res.error.message);
    else onChange(url);
  }

  async function handleReset() {
    setBusy(true);
    const res = await saveSetting(settingKey, '');
    setBusy(false);
    if (res.error) setError(res.error.message);
    else onChange(DEFAULTS[settingKey]);
  }

  return (
    <div className="setting-block">
      <label>{label}</label>
      {hint && <p className="field-hint">{hint}</p>}

      <div className="setting-preview">
        <img src={value || DEFAULTS[settingKey]} alt="" style={{ aspectRatio: aspect }} />
        <div className="setting-controls">
          <input
            type="file"
            accept="image/*"
            onChange={handleFile}
            disabled={busy}
            aria-label={`Replace ${label}`}
          />
          {!isDefault && (
            <button
              type="button"
              className="btn-admin ghost small"
              onClick={handleReset}
              disabled={busy}
            >
              Put the original back
            </button>
          )}
          {busy && <span className="field-hint">Uploading…</span>}
          {error && <p className="admin-error">{error}</p>}
        </div>
      </div>
    </div>
  );
}

export default function SitePanel() {
  const [settings, setSettings] = useState(null);
  const [badge, setBadge] = useState('');
  const [savedNote, setSavedNote] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    fetchSettings().then((s) => {
      setSettings(s);
      setBadge(s.hero_badge || '');
    });
  }, []);

  function update(key, value) {
    setSettings((s) => ({ ...s, [key]: value }));
    setSavedNote('Saved. Refresh the website to see it.');
  }

  async function saveBadge() {
    setBusy(true);
    const { error } = await saveSetting('hero_badge', badge);
    setBusy(false);
    setSavedNote(error ? error.message : 'Saved. Refresh the website to see it.');
  }

  if (!settings) return <p className="admin-note">Loading…</p>;

  return (
    <>
      {savedNote && <p className="admin-saved">{savedNote}</p>}

      <ImageSetting
        label="Big photo at the top of the home page"
        hint="This is the first thing visitors see. A tall photo works best — portrait, not landscape."
        settingKey="hero_image_url"
        value={settings.hero_image_url}
        onChange={(v) => update('hero_image_url', v)}
        aspect="4 / 5"
      />

      <div className="setting-block">
        <label htmlFor="hero-badge">Caption on that photo</label>
        <p className="field-hint">The small label in the corner. Leave blank to hide it.</p>
        <input
          id="hero-badge"
          value={badge}
          onChange={(e) => setBadge(e.target.value)}
          placeholder='No. 001 — "Sapphire Row" Converse'
        />
        <button className="btn-admin small" onClick={saveBadge} disabled={busy} type="button">
          {busy ? 'Saving…' : 'Save caption'}
        </button>
      </div>

      <ImageSetting
        label="Your photo"
        hint="Shown on the About page and lower down the home page."
        settingKey="founder_photo_url"
        value={settings.founder_photo_url}
        onChange={(v) => update('founder_photo_url', v)}
        aspect="4 / 5"
      />
    </>
  );
}