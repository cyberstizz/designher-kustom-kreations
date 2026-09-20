import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

/**
 * The card that slides in on the home page when something is happening —
 * a pop-up shop, a holiday, an order cutoff.
 *
 * The photo rule is the point of this component. Every theme falls back to
 * the everyday hero photo when Dianna hasn't set one of its own, which is
 * right for the hero (better a real kreation than a gap) and wrong here: a
 * card reading "Valentine's Day" beside a blue sneaker looks like a mistake
 * and cheapens the whole site. So the photo shows only when `ownImage` says
 * she uploaded one for THIS theme. Otherwise the card draws its own themed
 * panel from the same tokens the page is already using, which always looks
 * deliberate.
 *
 * Dismissal is remembered per theme and per event, so closing the Valentine
 * card doesn't hide October's pop-up.
 */
export default function ThemeNotice({ theme }) {
  const [state, setState] = useState('hidden'); // hidden | in | out

  const notice = theme?.notice;
  // Changing the theme, the event date or the photo makes this a new card.
  const signature = notice
    ? `${theme.key}|${theme.event?.eventDate || ''}|${theme.heroImage || ''}`
    : '';

  useEffect(() => {
    if (!notice) return undefined;

    let dismissed = false;
    try {
      dismissed = window.localStorage.getItem('dh-notice') === signature;
    } catch {
      dismissed = false; // private mode, blocked storage — just show it
    }
    if (dismissed) return undefined;

    // Long enough that the hero lands first and this reads as a second beat,
    // not a pop-up ambush.
    const timer = setTimeout(() => setState('in'), 1600);
    return () => clearTimeout(timer);
  }, [notice, signature]);

  function close() {
    setState('out');
    try {
      window.localStorage.setItem('dh-notice', signature);
    } catch {
      /* nothing to do — it just reappears next visit */
    }
  }

  if (!notice || state === 'hidden') return null;

  const showPhoto = theme.ownImage && theme.heroImage;

  const cta = notice.external ? (
    <a className="tn-cta" href={notice.to} target="_blank" rel="noopener noreferrer">
      {notice.cta}
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
      </svg>
    </a>
  ) : (
    <Link className="tn-cta" to={notice.to} onClick={close}>
      {notice.cta}
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
      </svg>
    </Link>
  );

  return (
    <aside
      className={`theme-notice ${state === 'out' ? 'is-out' : 'is-in'}${showPhoto ? '' : ' no-photo'}`}
      role="complementary"
      aria-label={notice.title}
    >
      <button type="button" className="tn-close" onClick={close} aria-label="Dismiss">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
        </svg>
      </button>

      {showPhoto ? (
        <div className="tn-media">
          <img src={theme.heroImage} alt="" />
        </div>
      ) : (
        /* No photo for this occasion — draw one from the theme's own colors. */
        <div className="tn-mark" aria-hidden="true">
          <svg viewBox="0 0 24 24">
            <polygon points="12,2 20,9 12,22 4,9" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
            <polyline points="4,9 20,9" fill="none" stroke="currentColor" strokeWidth="1" />
            <polyline points="8.5,9 12,2 15.5,9" fill="none" stroke="currentColor" strokeWidth=".9" />
          </svg>
        </div>
      )}

      <div className="tn-body">
        <span className="tn-kicker">{theme.label}</span>
        <h3>{notice.title}</h3>
        <p>{notice.body}</p>
        {cta}
      </div>
    </aside>
  );
}
