import { useEffect, useState } from 'react';
import {
  DEFAULTS,
  clearOrderBookCache,
  fetchSettings,
  ordersPaused,
  saveSetting,
} from '../lib/settings.js';

/**
 * The order book switch.
 *
 * Lives in the admin header so it's one tap from anywhere, and reads as a
 * state rather than a command: green means she's taking orders, red means
 * she isn't. Flipping to paused asks for confirmation and offers a reopen
 * date, because visitors see that date on the website.
 *
 * The database enforces the pause as well (supabase/008_orders_paused.sql),
 * so this is a control, not a disguise.
 */
export default function OrdersToggle() {
  const [settings, setSettings] = useState(null);
  const [open, setOpen] = useState(false);       // the pause dialog
  const [reopen, setReopen] = useState('');
  const [note, setNote] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSettings().then((s) => {
      setSettings(s);
      setReopen(s.orders_reopen_date || '');
      setNote(s.orders_paused_note || '');
    });
  }, []);

  if (!settings) return null;
  const paused = ordersPaused(settings);

  async function apply(nextPaused) {
    setBusy(true);
    setError('');
    const writes = [saveSetting('orders_paused', nextPaused ? 'true' : 'false')];
    if (nextPaused) {
      writes.push(saveSetting('orders_reopen_date', reopen));
      writes.push(saveSetting('orders_paused_note', note.trim()));
    }
    const results = await Promise.all(writes);
    setBusy(false);
    const failed = results.find((r) => r.error);
    if (failed) {
      setError(failed.error.message);
      return;
    }
    clearOrderBookCache();
    setSettings((s) => ({
      ...s,
      orders_paused: nextPaused ? 'true' : 'false',
      orders_reopen_date: nextPaused ? reopen : s.orders_reopen_date,
      orders_paused_note: nextPaused ? note.trim() : s.orders_paused_note,
    }));
    setOpen(false);
  }

  return (
    <div className="orders-toggle">
      <span className={`ot-state${paused ? ' paused' : ''}`}>
        <i aria-hidden="true" />
        {paused ? 'Orders paused' : 'Taking orders'}
      </span>

      {paused ? (
        <button
          type="button"
          className="btn-admin small ot-resume"
          onClick={() => apply(false)}
          disabled={busy}
        >
          {busy ? 'Opening…' : 'Start taking orders'}
        </button>
      ) : (
        <button
          type="button"
          className="btn-admin ghost small ot-pause"
          onClick={() => setOpen(true)}
          disabled={busy}
        >
          Pause new orders
        </button>
      )}

      {open && (
        <div className="ot-sheet" role="dialog" aria-label="Pause new orders">
          <h3>Pause new orders?</h3>
          <p>
            The website stays up and people can still browse and message you. The
            custom order form stops accepting new requests until you turn it back on.
            Work you already have is not affected.
          </p>

          <label htmlFor="ot-reopen">When do you expect to reopen? (optional)</label>
          <input
            id="ot-reopen"
            type="date"
            value={reopen}
            onChange={(e) => setReopen(e.target.value)}
          />
          <p className="ot-hint">Visitors see this date. Leave it blank if you're not sure.</p>

          <label htmlFor="ot-note">Anything you want to tell them? (optional)</label>
          <input
            id="ot-note"
            value={note}
            maxLength={140}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Catching up on orders — back soon!"
          />

          {error && <p className="admin-error">{error}</p>}

          <div className="ot-sheet-actions">
            <button type="button" className="btn-admin small" onClick={() => apply(true)} disabled={busy}>
              {busy ? 'Pausing…' : 'Yes, pause orders'}
            </button>
            <button
              type="button"
              className="btn-admin ghost small"
              onClick={() => setOpen(false)}
              disabled={busy}
            >
              Never mind
            </button>
          </div>
        </div>
      )}
    </div>
  );
}