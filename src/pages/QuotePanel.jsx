import { useEffect, useState } from 'react';
import {
  fetchQuotes,
  fetchMessages,
  sendQuote,
  sendMessage,
  formatMoney,
  parseMoney,
} from '../lib/quotes.js';
import { notifyMessageSent, notifyQuoteSent } from '../lib/notify.js';
import { fetchPayments, paidPayment } from '../lib/payments.js';

function when(iso) {
  return new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

/**
 * Everything Dianna does with one request after reading it: put a price on
 * it, or ask a question first. Both land in the same thread so the history
 * reads in order.
 */
export default function QuotePanel({ inquiry }) {
  const [quotes, setQuotes] = useState([]);
  const [messages, setMessages] = useState([]);
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [reply, setReply] = useState('');
  const [busy, setBusy] = useState('');

  async function load() {
    const [q, m, p] = await Promise.all([
      fetchQuotes(inquiry.id),
      fetchMessages(inquiry.id),
      fetchPayments(inquiry.id),
    ]);
    if (q.error || m.error) setError((q.error || m.error).message);
    else {
      setQuotes(q.data);
      setMessages(m.data);
    }
    setPayment(paidPayment(p.data));
    setLoading(false);
  }

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const [q, m, p] = await Promise.all([
        fetchQuotes(inquiry.id),
        fetchMessages(inquiry.id),
        fetchPayments(inquiry.id),
      ]);
      if (cancelled) return;
      if (q.error || m.error) setError((q.error || m.error).message);
      else {
        setQuotes(q.data);
        setMessages(m.data);
      }
      setPayment(paidPayment(p.data));
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [inquiry.id]);

  // The newest quote is the one that counts, whatever state it is in. An
  // earlier version showed only quotes still marked "sent", so the moment a
  // customer accepted, the price vanished from this panel and looked like
  // nothing had been sent at all.
  const current = quotes[0] || null;
  const history = quotes.slice(1);
  const outstanding = current?.status === 'sent';

  function quoteState() {
    if (!current) return null;
    if (payment) return { label: 'Paid in full', tone: 'paid', note: `Card cleared ${when(payment.paid_at)}. Time to set stones.` };
    if (current.status === 'accepted') return { label: 'Accepted — waiting on payment', tone: 'accepted', note: 'They can pay by card from their account page. You will get an email the moment it clears.' };
    if (current.status === 'declined') return { label: 'Declined', tone: 'declined', note: 'They turned this price down. You can send a new one below.' };
    if (current.status === 'superseded') return { label: 'Replaced', tone: 'declined', note: 'A newer price replaced this one.' };
    return { label: 'Sent — waiting on them', tone: 'sent', note: 'They have been emailed. Nothing to do until they accept.' };
  }
  const state = quoteState();

  async function handleSendQuote() {
    const cents = parseMoney(amount);
    if (!cents) {
      setError('Enter a price like 220 or 220.50.');
      return;
    }
    setBusy('quote');
    setError('');
    const { data, error } = await sendQuote(inquiry.id, { amountCents: cents, message: note });
    setBusy('');
    if (error) return setError(error.message);
    // Email the customer their price. Not awaited: the quote is saved, and
    // she shouldn't be left staring at a spinner over an email.
    notifyQuoteSent(data?.id);
    setAmount('');
    setNote('');
    load();
  }

  async function handleSendMessage() {
    if (!reply.trim()) {
      setError('Write something first.');
      return;
    }
    setBusy('message');
    setError('');
    const { data, error } = await sendMessage(inquiry.id, reply);
    setBusy('');
    if (error) return setError(error.message);
    // Email the customer so they know to come back and read it.
    notifyMessageSent(data?.id);
    setReply('');
    load();
  }

  if (loading) return <p className="field-hint">Loading conversation…</p>;

  return (
    <div className="quote-panel">
      {error && <p className="admin-error">{error}</p>}

      {current && (
        <div className={`live-quote lq-${state.tone}`}>
          <div>
            <span className="lq-label">Quoted</span>
            <span className="lq-amount">{formatMoney(current.amount_cents)}</span>
          </div>
          <span className={`lq-state lq-${state.tone}`}>{state.label}</span>
          <span className="lq-meta">Sent {when(current.created_at)} · {state.note}</span>
        </div>
      )}

      <div className="quote-form">
        <span className="qf-label">{current ? 'Send a new price' : 'Send a quote'}</span>
        <div className="qf-row">
          <input
            type="text"
            inputMode="decimal"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="220.00"
            aria-label="Price in dollars"
          />
          <span className="field-hint">Full payment upfront</span>
        </div>
        <textarea
          rows={3}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="What the price covers, and roughly how long it takes."
        />
        <button className="btn-admin small" onClick={handleSendQuote} disabled={busy === 'quote'}>
          {busy === 'quote' ? 'Sending…' : current ? 'Replace price' : 'Send quote'}
        </button>
        {outstanding && (
          <p className="field-hint">
            The old price is kept in the history below and no longer counts.
          </p>
        )}
        {!current && (
          <p className="field-hint">
            They get an email with this price and pay by card themselves once they
            accept. You never handle their card details.
          </p>
        )}
      </div>

      <div className="thread">
        <span className="qf-label">Conversation</span>

        {messages.length === 0 ? (
          <p className="field-hint">Nothing said yet.</p>
        ) : (
          messages.map((m) => (
            <div className={`msg msg-${m.sender}`} key={m.id}>
              <span className="msg-who">
                {m.sender === 'admin' ? 'You' : inquiry.full_name} · {when(m.created_at)}
              </span>
              <p>{m.body}</p>
            </div>
          ))
        )}

        <textarea
          rows={2}
          value={reply}
          onChange={(e) => setReply(e.target.value)}
          placeholder={`Write to ${inquiry.full_name.split(' ')[0]}`}
        />
        <button
          className="btn-admin ghost small"
          onClick={handleSendMessage}
          disabled={busy === 'message'}
        >
          {busy === 'message' ? 'Sending…' : 'Send message'}
        </button>
      </div>

      {history.length > 0 && (
        <div className="quote-history">
          <span className="qf-label">Earlier prices</span>
          {history.map((q) => (
            <div className="qh-row" key={q.id}>
              <span className="qh-amount">{formatMoney(q.amount_cents)}</span>
              <span className="qh-status">{q.status}</span>
              <span className="qh-date">{when(q.created_at)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}