import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import Garland from './Garland.jsx';
import { fetchOrderBook } from '../lib/settings.js';

/**
 * Site header. One nav for the whole site.
 *
 * Below 900px the links collapse into a menu behind a button. The prototype
 * simply hid the nav at mobile widths, which left phone visitors with no way
 * to reach any page — this replaces that.
 *
 * Props (all optional, only the home page passes them):
 *   theme    — resolved theme from src/lib/themes.js. 'christmas' hangs the
 *              garland over the wordmark; any theme can relabel the CTA.
 */
export default function SiteHeader({ theme = null }) {
  const [open, setOpen] = useState(false);
  // When Dianna pauses new orders the header button would be a dead end, so
  // it points at the shop instead. Cached, so it's one request per visit.
  const [paused, setPaused] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    let cancelled = false;
    fetchOrderBook().then((b) => { if (!cancelled) setPaused(b.paused); });
    return () => { cancelled = true; };
  }, []);

  // Close the menu whenever the route changes, otherwise it stays open
  // over the new page after a tap.
  useEffect(() => setOpen(false), [pathname]);

  // Don't let the page scroll behind an open menu.
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  // Escape closes it, same as any dialog.
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const links = (
    <>
      <NavLink to="/shop">Shop</NavLink>
      <NavLink to="/custom">Custom Kreations</NavLink>
      <NavLink to="/about">About</NavLink>
      <NavLink to="/reviews">Reviews</NavLink>
    </>
  );

  const signInLink = <NavLink to="/account">Sign in</NavLink>;

  const ctaLabel = paused ? 'Shop Ready-Made' : (theme?.headerCta || 'Start a Kreation');
  const ctaIsExternal = !paused && theme?.key === 'popup';
  const ctaTo = paused ? '/shop' : (ctaIsExternal ? theme.cta1To : '/custom');

  return (
    <header className="site-header">
      <div className="header-inner">
        <Link to="/" className="wordmark">
          {theme?.key === 'christmas' && <Garland />}
          <span className="script">Designher</span>
          <span className="tag">CUSTOM KREATIONS</span>
        </Link>

        <nav className="primary-nav">{links}</nav>

        <div className="header-icons">
          {/* Goes to /account, which shows the sign-in form when signed out
              and their kreations when signed in — one link, right either way. */}
          <Link to="/account" className="header-signin">
            Sign in
          </Link>

          {ctaIsExternal ? (
            <a href={ctaTo} className="btn-quote" target="_blank" rel="noopener noreferrer">
              {ctaLabel}
            </a>
          ) : (
            <Link to={ctaTo} className="btn-quote">
              {ctaLabel}
            </Link>
          )}

          <button
            type="button"
            className={`nav-toggle${open ? ' open' : ''}`}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((v) => !v)}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>

      <div
        id="mobile-nav"
        className={`mobile-nav${open ? ' open' : ''}`}
        hidden={!open}
      >
        <nav className="primary-nav">
          {links}
          {signInLink}
        </nav>
      </div>
    </header>
  );
}