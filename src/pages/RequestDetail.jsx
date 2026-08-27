import { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { supabase, isSupabaseConfigured } from '../lib/supabase.js';
import { signOut } from '../lib/auth.js';
import { fetchRequest, displayStatus } from '../lib/account.js';
import { formatMoney, respondToQuote, sendMessage } from '../lib/quotes.js';
import SignIn from './SignIn.jsx';
import '../styles/pages/account.css';

function when(iso) {
  return new Date(iso).toLocaleDateString(undefined, { day: 'numeric', month: 'short' });
}

function initials(name) {
  return (name || '?')
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join('');
}

/** Short human-readable reference from the row id. */
function reference(id) {
  return id.replace(/-/g, '').slice(0, 4).toUpperCase();
}

export default function RequestDetail() {
  const { id } = useParams();
  const [session, setSession] = useState(null);
  const [checking, setChecking] = useState(true);

  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState('');
  const [reply, setReply] = useState('');
  const replyRef = useRef(null);

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

  async function load() {
    const { data, error } = await fetchRequest(id);
    if (error) setError(error.message);
    else setRequest(data);
    setLoading(false);
  }

  useEffect(() => {
    if (!session) return;
    let cancelled = false;
    (async () => {
      const { data, error } = await fetchRequest(id);
      if (cancelled) return;
      if (error) setError(error.message);
      else setRequest(data);
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [session, id]);

  async function handleAccept() {
    setBusy('accept');
    setError('');
    const { error } = await respondToQuote(request.quote.id, 'accepted');
    setBusy('');
    if (error) setError(error.message);
    else load();
  }

  async function handleSend() {
    if (!reply.trim()) {
      setError('Write something first.');
      return;
    }
    setBusy('send');
    setError('');
    const { error } = await sendMessage(id, reply, 'customer');
    setBusy('');
    if (error) return setError(error.message);
    setReply('');
    load();
  }

  if (checking) {
    return (
      <div className="page-account">
        <p className="account-note">One moment…</p>
      </div>
    );
  }
  if (!session) return <SignIn />;

  if (loading) {
    return (
      <div className="page-account">
        <p className="account-note">Loading…</p>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="page-account">
        <main className="account-main">
          <h1>We couldn't find that</h1>
          <p className="account-lede">
            It may belong to a different email address than the one you're signed in with.
          </p>
          <Link className="btn-account" to="/account" style={{ width: 'auto' }}>
            Back to your kreations
          </Link>
        </main>
      </div>
    );
  }

  const q = request.quote;
  const accepted = q?.status === 'accepted';
  const status = displayStatus(request);

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
        <Link className="detail-back" to="/account">
          ← Your kreations
        </Link>

        <div className="detail-card">
          <div className="detail-top">
            <div>
              <p className="detail-title">
                {[request.occasion, request.base].filter(Boolean).join(' ') || 'Custom piece'}
              </p>
              <p className="detail-meta">
                Request #{reference(request.id)}
                {request.palette ? ` · ${request.palette}` : ''}
              </p>
            </div>
            <span className={`detail-pill${accepted ? ' ok' : ''}`}>{status}</span>
          </div>

          {q ? (
            <>
              <div className="price-block">
                <div>
                  <p className="pb-label">Dianna's price</p>
                  <p className="pb-amount">{formatMoney(q.amount_cents)}</p>
                </div>
                <p className="pb-note">
                  {accepted ? 'Accepted — Dianna will be in touch' : 'Full payment when you accept'}
                </p>
              </div>

              {error && <p className="account-error">{error}</p>}

              <div className="detail-actions">
                {!accepted && (
                  <button className="btn-account solid" onClick={handleAccept} disabled={busy === 'accept'}>
                    <svg width="15" height="15" viewBox="0 0 24 24" aria-hidden="true">
                      <rect x="5" y="11" width="14" height="9" rx="2" fill="none" stroke="currentColor" strokeWidth="1.6" />
                      <path d="M8 11V8a4 4 0 0 1 8 0v3" fill="none" stroke="currentColor" strokeWidth="1.6" />
                    </svg>
                    Accept this price
                  </button>
                )}
                <button
                  className="btn-account ghost wide"
                  onClick={() => replyRef.current?.focus()}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M4 5h16v11H8l-4 4z" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
                  </svg>
                  Ask a question
                </button>
              </div>

              {accepted && (
                <p className="account-hint">
                  Payment isn't set up on the website yet — Dianna will send you the details
                  directly.
                </p>
              )}
            </>
          ) : (
            <div className="price-block muted">
              <div>
                <p className="pb-label">No price yet</p>
                <p className="pb-note">
                  Dianna is looking at your request. You'll get an email when she's ready.
                </p>
              </div>
            </div>
          )}

          <div className="detail-thread">
            <p className="pb-label">Conversation</p>

            {request.messages.length === 0 && (
              <p className="account-hint">Nothing here yet. Ask her anything below.</p>
            )}

            {request.messages.map((m) => (
              <div className="chat-row" key={m.id}>
                <span className={`chat-avatar${m.sender === 'admin' ? ' her' : ''}`}>
                  {m.sender === 'admin' ? 'DB' : initials(request.full_name)}
                </span>
                <div className="chat-body">
                  <p className="chat-who">
                    <strong>{m.sender === 'admin' ? 'Dianna' : 'You'}</strong>
                    <span> · {when(m.created_at)}</span>
                  </p>
                  <p className="chat-text">{m.body}</p>
                </div>
              </div>
            ))}

            <textarea
              ref={replyRef}
              rows={2}
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              placeholder="Write a message to Dianna"
            />
            <button className="btn-account ghost wide" onClick={handleSend} disabled={busy === 'send'}>
              {busy === 'send' ? 'Sending…' : 'Send'}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}