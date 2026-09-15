import { Link } from 'react-router-dom';
import { CONTACT_EMAIL, INSTAGRAM } from '../lib/site.js';

/**
 * What visitors see while the order book is closed.
 *
 * variant="bar"   — one line under the header on the home page.
 * variant="panel" — full replacement for the order form on /custom.
 *
 * Wording follows how makers usually say this: the books are closed, here's
 * when they open, here's what you can still do today.
 */
export default function OrdersPausedNotice({ variant = 'bar', reopen, note }) {
  if (variant === 'bar') {
    return (
      <div className="orders-paused-bar">
        <b>The order book is closed</b>
        {reopen ? ` · New kreations reopen ${reopen}` : ' · Dianna is catching up on current kreations'}
        <Link to="/shop">Shop ready-made</Link>
      </div>
    );
  }

  return (
    <div className="orders-paused-panel">
      <span className="opp-mark" aria-hidden="true">
        <svg viewBox="0 0 24 24" width="22" height="22">
          <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <path d="M12 7v5l3 2" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </span>

      <h2>The order book is closed right now</h2>

      <p className="opp-lede">
        {note
          ? note
          : 'Dianna is finishing the kreations already on her table, so new custom requests are on hold. Every piece is set by hand, and she would rather close the book than rush yours.'}
      </p>

      <p className="opp-when">
        {reopen
          ? `New requests open back up on ${reopen}.`
          : 'No reopening date yet — check back soon.'}
      </p>

      <div className="opp-actions">
        <Link className="btn btn-primary" to="/shop">
          Shop ready-made pieces
        </Link>
        <a className="btn btn-ghost" href={INSTAGRAM} target="_blank" rel="noopener noreferrer">
          Follow for the reopening
        </a>
      </div>

      <p className="opp-foot">
        Already have a kreation with her?{' '}
        <Link to="/account">Check on your order</Link> · Questions:{' '}
        <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
      </p>
    </div>
  );
}