import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/pages/home.css';
import '../styles/pages/home-themes.css';
import init from './scripts/home.js';
import SiteHeader from '../components/SiteHeader.jsx';
import SiteFooter from '../components/SiteFooter.jsx';
import ThemeFx from '../components/ThemeFx.jsx';
import { categoryLabel, fetchPublishedProducts } from '../lib/products.js';
import { DEFAULTS, fetchSettings, ordersPaused, reopenPhrase } from '../lib/settings.js';
import OrdersPausedNotice from '../components/OrdersPausedNotice.jsx';
import { THEMES, fetchActiveThemeKey, fetchThemeRows, resolveTheme } from '../lib/themes.js';

/** Live countdown for the pop-up card. Shows "Happening now" once it starts. */
function Countdown({ startAt }) {
  const [parts, setParts] = useState(() => calc(startAt));
  useEffect(() => {
    if (!startAt) return undefined;
    const id = setInterval(() => setParts(calc(startAt)), 1000);
    return () => clearInterval(id);
  }, [startAt]);

  if (!startAt) return null;
  if (parts.done) return <span className="live">Happening now</span>;
  return (
    <div className="countdown">
      <div><b>{parts.d}</b><span>days</span></div>
      <div><b>{parts.h}</b><span>hrs</span></div>
      <div><b>{parts.m}</b><span>min</span></div>
      <div><b>{parts.s}</b><span>sec</span></div>
    </div>
  );
}
function calc(startAt) {
  if (!startAt) return { done: false, d: '00', h: '00', m: '00', s: '00' };
  let s = Math.floor((startAt.getTime() - Date.now()) / 1000);
  if (s <= 0) return { done: true };
  const d = Math.floor(s / 86400); s -= d * 86400;
  const h = Math.floor(s / 3600); s -= h * 3600;
  const m = Math.floor(s / 60); s -= m * 60;
  const pad = (n) => String(n).padStart(2, '0');
  return { done: false, d: pad(d), h: pad(h), m: pad(m), s: pad(s) };
}

/** Link that goes out to Google Maps for the pop-up, in-app otherwise. */
function Cta({ to, className, children }) {
  if (/^https?:/.test(to)) {
    return (
      <a href={to} className={className} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    );
  }
  return <Link to={to} className={className}>{children}</Link>;
}

const Gem = ({ color = 'var(--champagne)' }) => (
  <svg className="gem" viewBox="0 0 24 24">
    <use href="#gem-shape" style={{ color }} />
  </svg>
);

export default function Home() {
  useEffect(() => init(), []);

  // The shelf shows the first four published pieces, in the order Dianna set
  // in the admin.
  const [shelf, setShelf] = useState([]);
  // Photos Dianna controls from the admin. Defaults render immediately so the
  // hero never flashes empty while this resolves.
  const [site, setSite] = useState(DEFAULTS);
  // The live theme. Starts as default (the site as it is today) and swaps
  // once the active key and that theme's saved row arrive.
  const [theme, setTheme] = useState(() => resolveTheme('default', null, DEFAULTS));

  useEffect(() => {
    let cancelled = false;
    Promise.all([fetchSettings(), fetchActiveThemeKey(), fetchThemeRows()]).then(
      ([s, key, rows]) => {
        if (cancelled) return;
        setSite(s);
        // ?preview=christmas lets Dianna see a theme from the admin before
        // publishing it. Only affects her own browser.
        const preview = new URLSearchParams(window.location.search).get('preview');
        const k = preview && THEMES[preview] ? preview : key;
        setTheme(resolveTheme(k, rows[k], s));
      }
    );
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    let cancelled = false;
    fetchPublishedProducts().then((res) => {
      if (!cancelled && !res.error) setShelf(res.data.slice(0, 4));
    });
    return () => { cancelled = true; };
  }, []);

  const t = theme;
  const paused = ordersPaused(site);
  const reopen = reopenPhrase(site);
  const [h1a, h1b, h1c] = t.h1;
  const [bandA, bandB] = t.bandH2;

  return (
    <div className="page-home" data-theme={t.key}>
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <symbol id="gem-shape" viewBox="0 0 24 24">
          <polygon points="12,2 20,9 12,22 4,9" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
          <polyline points="4,9 20,9" fill="none" stroke="currentColor" strokeWidth="1.1" />
          <polyline points="8.5,9 12,2 15.5,9" fill="none" stroke="currentColor" strokeWidth="1" />
          <polyline points="12,22 8.5,9" fill="none" stroke="currentColor" strokeWidth="1" />
          <polyline points="12,22 15.5,9" fill="none" stroke="currentColor" strokeWidth="1" />
        </symbol>
      </svg>

      <SiteHeader theme={t} />

      {paused && <OrdersPausedNotice variant="bar" reopen={reopen} />}

      {!paused && t.bar && (
        <div className="theme-bar">
          <b>{t.bar.text}</b> · {t.bar.detail}
          {t.bar.external ? (
            <a href={t.bar.to} target="_blank" rel="noopener noreferrer">{t.bar.link}</a>
          ) : (
            <Link to={t.bar.to}>{t.bar.link}</Link>
          )}
        </div>
      )}

      <main id="top">
        <section className="hero">
          <ThemeFx recipe={t.fx} />

          <div className="hero-copy">
            <span className="eyebrow">
              <Gem />
              {t.eyebrow}
            </span>
            <h1>
              {h1a}
              <br />
              {h1b}
              <br />
              <em>{h1c}</em>
            </h1>
            <div className="hero-rule"></div>
            <p className="lede">{t.lede}</p>
            <div className="hero-ctas">
              {paused ? (
                <>
                  <Link to="/shop" className="btn btn-primary">Shop ready-made</Link>
                  <Link to="/custom" className="btn btn-ghost">When orders reopen</Link>
                </>
              ) : (
                <>
                  <Cta to={t.cta1To} className="btn btn-primary">{t.cta1}</Cta>
                  <Cta to={t.cta2To} className="btn btn-ghost">{t.cta2}</Cta>
                </>
              )}
            </div>
            <div className="hero-stats">
              {t.stats.map(([b, s]) => (
                <div key={s}>
                  <b>{b}</b>
                  <span>{s}</span>
                </div>
              ))}
            </div>
          </div>

          <Link to="/shop" className="hero-media" aria-label="View the shop">
            <img src={t.heroImage} alt="Featured hand-set kreation" />
            <div className="sweep"></div>
            <div className="frame"></div>
            {t.badge && <span className="hero-badge">{t.badge}</span>}
            {t.event && (
              <div className="event-card">
                <span className="ek">Next pop-up</span>
                <h3>{t.event.venue}</h3>
                <p className="ed">
                  {t.event.eventDate} · {t.event.eventTime}
                  {t.event.address ? ` · ${t.event.address}` : ''}
                </p>
                <Countdown startAt={t.event.startAt} />
              </div>
            )}
          </Link>
        </section>

        <div className="marquee-strip">
          <div className="marquee-track" aria-hidden="true">
            {[...t.marquee, ...t.marquee].map((m, i) => (
              <span key={i}>{m}</span>
            ))}
          </div>
        </div>

        <section className="section" id="shop">
          <div className="wrap">
            <div className="section-head reveal">
              <div>
                <span className="eyebrow">
                  <Gem />
                  {t.shopEye}
                </span>
                <h2>{t.shopH2}</h2>
              </div>
              <p>{t.shopP}</p>
            </div>
          </div>
          <div className="wrap" style={{ padding: '0', maxWidth: '1240px' }}>
            <div className="shelf reveal">
              {shelf.length > 0 ? (
                shelf.map((p, i) => (
                  <Link key={p.id} to={`/product/${p.slug}`} className="shelf-card">
                    {p.image_url ? (
                      <img src={p.image_url} alt={p.title} loading="lazy" />
                    ) : (
                      <div className="swatch"></div>
                    )}
                    {i === 0 && <span className="ribbon">{t.ribbon}</span>}
                    <div className="shelf-sweep"></div>
                    <div className="shelf-info">
                      <span className="kicker">{categoryLabel(p.category)}</span>
                      <h3>{p.title}</h3>
                      <span className="from">{p.blurb || 'Made to order'}</span>
                    </div>
                    <span className="shelf-link"></span>
                  </Link>
                ))
              ) : (
                <div className="shelf-empty">
                  <p>New pieces are being photographed right now.</p>
                  <Link className="btn btn-primary" to="/custom">Start a Kreation</Link>
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="section" id="custom">
          <div className="wrap process-wrap">
            <div className="section-head reveal">
              <div>
                <span className="eyebrow">
                  <Gem />
                  How a Kreation Comes Together
                </span>
                <h2>From your idea to your feet, in three fittings</h2>
              </div>
              <p>Every custom order runs through the same hands, start to finish.</p>
            </div>
            <div className="process-line"></div>
            <div className="process reveal">
              <div className="process-step">
                <svg className="gem-big" viewBox="0 0 24 24"><use href="#gem-shape" style={{ color: 'var(--champagne)' }} /></svg>
                <span className="tag">Fitting One</span>
                <h3>Sketch the vision</h3>
                <p>
                  Send your colors, initials, occasion, and energy. Dianna sketches the layout and confirms it with you before a single stone is placed.
                </p>
              </div>
              <div className="process-step">
                <svg className="gem-big" viewBox="0 0 24 24"><use href="#gem-shape" style={{ color: 'var(--champagne)' }} /></svg>
                <span className="tag">Fitting Two</span>
                <h3>Set stone by stone</h3>
                <p>
                  Every rhinestone and pearl is hand-placed on your base item — no printed shortcuts, no two pieces ever exactly alike.
                </p>
              </div>
              <div className="process-step">
                <svg className="gem-big" viewBox="0 0 24 24"><use href="#gem-shape" style={{ color: 'var(--champagne)' }} /></svg>
                <span className="tag">Fitting Three</span>
                <h3>Ship in 14 days</h3>
                <p>
                  Packed with care and shipped nationwide, ready to turn heads the day it lands on your porch.
                </p>
              </div>
            </div>
            <div className="reveal" style={{ marginTop: '56px', textAlign: 'center' }}>
              <Link to="/custom" className="btn btn-primary">Start Your Kreation</Link>
            </div>
          </div>
        </section>

        <section className="section about" id="about">
          <div className="wrap">
            <div className="about-grid">
              <div className="about-portrait reveal">
                <img src={site.founder_photo_url} alt="Dianna Beaty, founder of Designher Custom Kreations" />
                <span className="cap">Dianna Beaty — Founder, 2022</span>
              </div>
              <div className="about-copy reveal">
                <span className="eyebrow">
                  <Gem color="var(--ruby)" />
                  The Founder
                </span>
                <h2>A needle, a handful of rhinestones, and a fearless idea</h2>
                <p>
                  Designher Custom Kreations started with Dianna Beaty's flair for turning ordinary fabric into something spellbound — embellishing denim, canvas, and suede with rhinestones and intricate detail until strangers stopped her for a closer look.
                </p>
                <p>
                  Today the shop crafts bespoke pieces for women, children, and men, each one built to tell the wearer's own story in crystal and thread.
                </p>
                <blockquote className="pull">
                  “Every stitch carries a narrative. As we grow, we're still rooted in one thing — personalized elegance that's uniquely yours.”
                  <cite>Dianna Beaty, Founder</cite>
                </blockquote>
                <Link to="/about" className="btn btn-ghost">Meet Dianna</Link>
              </div>
            </div>
          </div>
        </section>

        <section className="section" id="love">
          <div className="wrap">
            <div className="section-head reveal">
              <div>
                <span className="eyebrow">
                  <Gem />
                  Wall of Love
                </span>
                <h2>Worn out loud, all over the country</h2>
              </div>
              <p>
                A few notes from the kreation family. Placeholder copy — swap in real reviews before launch.
              </p>
            </div>
          </div>
          <div className="wrap" style={{ maxWidth: '1240px' }}>
            <div className="wall-track reveal">
              <div className="love-card">
                <span className="stars">★★★★★</span>
                <p>My AKA sisters asked where I got my Converse before I even sat down. Worth every day of the wait.</p>
                <span className="who">Renee · Bronx, NY</span>
              </div>
              <div className="love-card">
                <span className="stars">★★★★★</span>
                <p>Ordered the Diamond Girl boots for my daughter's graduation. Photos looked like a magazine shoot.</p>
                <span className="who">Tasha · Newark, NJ</span>
              </div>
              <div className="love-card">
                <span className="stars">★★★★★</span>
                <p>The denim jacket fits exactly how we sketched it out over text. That kind of care is rare.</p>
                <span className="who">Monique · New York, NY</span>
              </div>
              <div className="love-card">
                <span className="stars">★★★★★</span>
                <p>Shipped nationwide to Atlanta in exactly 14 days, just like promised. Already planning my next kreation.</p>
                <span className="who">Iris · Atlanta, GA</span>
              </div>
            </div>
          </div>
        </section>

        <section className="cta-band">
          <div className="wrap">
            <span className="eyebrow">
              <Gem color="currentColor" />
              {paused ? 'Back soon' : t.bandEye}
            </span>
            <h2>
              {paused ? 'The book is closed,' : bandA}
              <br />
              {paused ? 'but the shop is open.' : bandB}
            </h2>
            <div className="hero-ctas">
              {paused ? (
                <>
                  <Link to="/shop" className="btn btn-primary">Browse the shop</Link>
                  <Link to="/custom" className="btn btn-ghost">When orders reopen</Link>
                </>
              ) : (
                <>
                  <Link to={t.band1To} className="btn btn-primary">{t.band1}</Link>
                  <Link to={t.band2To} className="btn btn-ghost">{t.band2}</Link>
                </>
              )}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}