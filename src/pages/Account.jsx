import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase, isSupabaseConfigured } from '../lib/supabase.js';
import { claimMyInquiries, signOut } from '../lib/auth.js';
import { fetchMyRequests, statusLabel } from '../lib/account.js';
import { formatMoney } from '../lib/quotes.js';
import SignIn from './SignIn.jsx';
import '../styles/pages/account.css';

function when(iso) {
  return new Date(iso).toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export default function Account() {
  const [session, setSession] = useState(null);
  const [checking, setChecking] = useState(true);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setChecking(false);
      return;
    }
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setChecking(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session) return;
    let cancelled = false;

    (async () => {
      // Requests submitted before this person had an account are matched to
      // them by their verified email the first time they sign in.
      const { error: claimError } = await claimMyInquiries();
      if (claimError) console.error('[account] claim failed', claimError);

      const { data, error } = await fetchMyRequests();
      if (cancelled) return;
      if (error) setError(error.message);
      else setRows(data);
      setLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [session]);

  if (checking) {
    return (
      <div className="page-account">
        <p className="account-note">One moment…</p>
      </div>
    );
  }

  if (!session) return <SignIn />;

  return (
    <div className="page-account">
      <header className="account-header">
        <Link to="/" className="account-mark small">
          <span className="script">Designher</span>
          <span className="tag">CUSTOM KREATIONS</span>
        </Link>
        <div className="account-header-right">
          <span className="account-user">{session.user.email}</span>
          <button className="btn-account ghost" onClick={signOut}>
            Sign out
          </button>
        </div>
      </header>

      <main className="account-main">
        <h1>Your kreations</h1>
        <p className="account-lede">Everything you've asked Dianna to make.</p>

        {error && <p className="account-error">{error}</p>}

        {loading ? (
          <p className="account-note">Loading…</p>
        ) : rows.length === 0 ? (
          <div className="account-empty">
            <p>Nothing here yet.</p>
            <p className="account-hint">
              If you sent a request with a different email address, sign out and use
              that one instead.
            </p>
            <Link className="btn-account" to="/custom">
              Start a kreation
            </Link>
          </div>
        ) : (
          <ul className="request-list">
            {rows.map((r) => (
              <li className="request-row" key={r.id}>
                <div className="rr-main">
                  <span className="rr-title">{r.base || 'Custom piece'}</span>
                  <span className="rr-meta">
                    {[r.occasion, r.palette].filter(Boolean).join(' · ') || 'Made to order'}
                    {' · '}
                    {when(r.created_at)}
                  </span>
                </div>

                {r.quote && <span className="rr-price">{formatMoney(r.quote.amount_cents)}</span>}

                <span className={`rr-status s-${r.status.replace(/\s+/g, '-')}`}>
                  {statusLabel(r.status)}
                </span>
              </li>
            ))}
          </ul>
        )}

        <p className="account-hint spaced">
          Questions about any of these? Reply to Dianna's email and she'll pick it up.
        </p>
      </main>
    </div>
  );
}