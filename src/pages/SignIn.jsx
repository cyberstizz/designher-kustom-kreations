import { useState } from 'react';
import { Link } from 'react-router-dom';
import { sendMagicLink } from '../lib/auth.js';
import { isSupabaseConfigured } from '../lib/supabase.js';
import '../styles/pages/account.css';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    if (!email.trim()) {
      setError('Enter the email you used on your request.');
      return;
    }
    setBusy(true);
    setError('');
    const { error } = await sendMagicLink(
      email.trim(),
      `${window.location.origin}/account`
    );
    setBusy(false);
    if (error) setError(error.message);
    else setSent(true);
  }

  if (!isSupabaseConfigured) {
    return (
      <div className="page-account">
        <p className="account-note">Sign in isn't configured yet.</p>
      </div>
    );
  }

  return (
    <div className="page-account">
      <div className="account-centre">
        <div className="account-card">
          <Link to="/" className="account-mark">
            <span className="script">Designher</span>
            <span className="tag">CUSTOM KREATIONS</span>
          </Link>

          {sent ? (
            <>
              <h1>Check your email</h1>
              <p className="account-sub">
                We sent a link to <strong>{email}</strong>. Open it on this device and
                you'll be signed straight in.
              </p>
              <p className="account-hint">
                Nothing after a minute or two? Check the spam folder, or{' '}
                <button className="link-button" onClick={() => setSent(false)}>
                  try a different address
                </button>
                .
              </p>
            </>
          ) : (
            <>
              <h1>Check on your kreation</h1>
              <p className="account-sub">
                Enter the email you used on your request and we'll send you a link.
              </p>

              <form onSubmit={handleSubmit}>
                <label htmlFor="signin-email">Email</label>
                <input
                  id="signin-email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                />
                {error && <p className="account-error">{error}</p>}
                <button className="btn-account" type="submit" disabled={busy}>
                  {busy ? 'Sending…' : 'Email me a link'}
                </button>
              </form>

              <p className="account-hint">
                No password needed. The link works once and expires after an hour.
              </p>
            </>
          )}

          <Link className="account-back" to="/">
            ← Back to the site
          </Link>
        </div>
      </div>
    </div>
  );
}