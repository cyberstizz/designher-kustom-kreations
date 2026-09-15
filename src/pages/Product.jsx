import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import '../styles/pages/product.css';
import SiteHeader from '../components/SiteHeader.jsx';
import SiteFooter from '../components/SiteFooter.jsx';
import { CONTACT_EMAIL } from '../lib/site.js';
import {
  categoryLabel,
  fetchProductBySlug,
  fetchPublishedProducts,
  galleryFor,
} from '../lib/products.js';

const FAQS = [
  {
    q: 'Details & care',
    a: 'Spot clean only, with a dry or barely damp cloth. Stones are hand-set with a flexible jewelry-grade adhesive built for daily wear — not for full water submersion.',
  },
  {
    q: 'Shipping & turnaround',
    a: 'Every piece is made to order, hand-set one stone at a time, and ships nationwide in about 14 days. Dianna confirms the timeline with you before she starts.',
  },
  {
    q: 'Sizing',
    a: 'Bring your own item or have Dianna source it. Either way she confirms sizing with you in writing before a single stone goes on — nothing is guessed.',
  },
  {
    q: 'Making it yours',
    a: 'Any piece here can be remade in your colors, your initials, or your occasion. The photo is the starting point, not the limit.',
  },
];

const STEPS = [
  ['01', 'Send the details', 'Colors, initials, the occasion. Dianna reads every request herself.'],
  ['02', 'Get your quote', 'A price and a plan for your piece, before anything is set in stone.'],
  ['03', 'Set by hand', 'One stone at a time in Laurelton, then shipped to your door.'],
];

function Icons() {
  return (
    <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
      <symbol id="gem-shape" viewBox="0 0 24 24">
        <polygon points="12,2 20,9 12,22 4,9" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
        <polyline points="4,9 20,9" fill="none" stroke="currentColor" strokeWidth="1.1" />
        <polyline points="8.5,9 12,2 15.5,9" fill="none" stroke="currentColor" strokeWidth="1" />
        <polyline points="12,22 8.5,9" fill="none" stroke="currentColor" strokeWidth="1" />
        <polyline points="12,22 15.5,9" fill="none" stroke="currentColor" strokeWidth="1" />
      </symbol>
      <symbol id="ic-plus" viewBox="0 0 24 24">
        <path fill="none" stroke="currentColor" strokeWidth="1.6" d="M12 5v14M5 12h14" />
      </symbol>
      <symbol id="ic-truck" viewBox="0 0 24 24">
        <path fill="none" stroke="currentColor" strokeWidth="1.5" d="M3 7h11v9H3zM14 11h4l3 3v2h-7zM7 20a1.6 1.6 0 1 0 0-3.2A1.6 1.6 0 0 0 7 20zM18 20a1.6 1.6 0 1 0 0-3.2 1.6 1.6 0 0 0 0 3.2z" />
      </symbol>
      <symbol id="ic-hand" viewBox="0 0 24 24">
        <path fill="none" stroke="currentColor" strokeWidth="1.5" d="M8 12V5a1.5 1.5 0 0 1 3 0v6M11 11V4a1.5 1.5 0 0 1 3 0v7M14 12V6a1.5 1.5 0 0 1 3 0v9M8 11.5 5.8 9.3a1.4 1.4 0 0 0-2 2L8 16c1 1.4 2.6 3 5.5 3h1a5 5 0 0 0 5-5v-3" />
      </symbol>
      <symbol id="ic-cal" viewBox="0 0 24 24">
        <path fill="none" stroke="currentColor" strokeWidth="1.5" d="M4 5h16v16H4zM4 10h16M8 3v4M16 3v4" />
      </symbol>
      <symbol id="ic-mail" viewBox="0 0 24 24">
        <path fill="none" stroke="currentColor" strokeWidth="1.6" d="M3 6h18v12H3zM3 7l9 6 9-6" />
      </symbol>
      <symbol id="ic-zoom" viewBox="0 0 24 24">
        <circle cx="11" cy="11" r="6.5" fill="none" stroke="currentColor" strokeWidth="1.7" />
        <path fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" d="M16 16l4.5 4.5M11 8.5v5M8.5 11h5" />
      </symbol>
      <symbol id="ic-arrow" viewBox="0 0 24 24">
        <path fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
      </symbol>
      <symbol id="ic-close" viewBox="0 0 24 24">
        <path fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
      </symbol>
    </svg>
  );
}

function Shell({ children }) {
  return (
    <div className="page-product">
      <Icons />
      <SiteHeader />
      <main>{children}</main>
      <SiteFooter variant="slim" />
    </div>
  );
}

/** Full-screen photo viewer. Arrow keys and Escape work; scroll is locked. */
function Lightbox({ images, index, onClose, onStep }) {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onStep(1);
      if (e.key === 'ArrowLeft') onStep(-1);
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose, onStep]);

  return (
    <div className="pdp-lightbox" role="dialog" aria-modal="true" aria-label="Photo viewer" onClick={onClose}>
      <button type="button" className="lb-close" onClick={onClose} aria-label="Close">
        <svg viewBox="0 0 24 24"><use href="#ic-close" /></svg>
      </button>

      {images.length > 1 && (
        <button
          type="button"
          className="lb-nav prev"
          onClick={(e) => { e.stopPropagation(); onStep(-1); }}
          aria-label="Previous photo"
        >
          <svg viewBox="0 0 24 24"><use href="#ic-arrow" /></svg>
        </button>
      )}

      <img src={images[index]} alt="" onClick={(e) => e.stopPropagation()} />

      {images.length > 1 && (
        <button
          type="button"
          className="lb-nav next"
          onClick={(e) => { e.stopPropagation(); onStep(1); }}
          aria-label="Next photo"
        >
          <svg viewBox="0 0 24 24"><use href="#ic-arrow" /></svg>
        </button>
      )}

      {images.length > 1 && (
        <span className="lb-count">{index + 1} / {images.length}</span>
      )}
    </div>
  );
}

export default function Product() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [status, setStatus] = useState('loading'); // loading | ready | missing | unconfigured
  const [active, setActive] = useState(0);         // index into the gallery
  const [openFaq, setOpenFaq] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const [showBar, setShowBar] = useState(false);   // mobile sticky action bar

  const ctaRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    setStatus('loading');
    setActive(0);
    window.scrollTo(0, 0);

    (async () => {
      if (!slug) {
        if (!cancelled) setStatus('missing');
        return;
      }
      const res = await fetchProductBySlug(slug);
      if (cancelled) return;

      if (res.unconfigured) return setStatus('unconfigured');
      if (res.error || !res.data) return setStatus('missing');

      setProduct(res.data);
      setStatus('ready');

      const all = await fetchPublishedProducts();
      if (cancelled || all.error) return;
      const sameCategory = all.data.filter((p) => p.slug !== res.data.slug && p.category === res.data.category);
      const rest = all.data.filter((p) => p.slug !== res.data.slug && p.category !== res.data.category);
      // Prefer siblings from the same category, but never show an empty rail.
      setRelated([...sameCategory, ...rest].slice(0, 3));
    })();

    return () => { cancelled = true; };
  }, [slug]);

  // Reveal sections as they come into view.
  useEffect(() => {
    if (status !== 'ready') return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.querySelectorAll('.page-product .reveal').forEach((el) => el.classList.add('in'));
      return undefined;
    }
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add('in')),
      { threshold: 0.12 }
    );
    document.querySelectorAll('.page-product .reveal').forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [status, related.length]);

  // The mobile bar appears once the real buttons have scrolled past.
  useEffect(() => {
    const el = ctaRef.current;
    if (!el) return undefined;
    const io = new IntersectionObserver(
      ([entry]) => setShowBar(!entry.isIntersecting && entry.boundingClientRect.top < 0),
      { threshold: 0 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [status]);

  const gallery = galleryFor(product);
  const step = useCallback(
    (dir) => setActive((i) => (gallery.length ? (i + dir + gallery.length) % gallery.length : 0)),
    [gallery.length]
  );

  if (status === 'loading') {
    return (
      <Shell>
        <div className="pdp-skeleton" aria-label="Loading">
          <div className="sk-img" />
          <div className="sk-info">
            <span className="sk-line short" />
            <span className="sk-line tall" />
            <span className="sk-line" />
            <span className="sk-line" />
            <span className="sk-line half" />
          </div>
        </div>
      </Shell>
    );
  }

  if (status === 'unconfigured') {
    return (
      <Shell>
        <div className="pdp-message">
          <h1>The catalog isn't connected.</h1>
          <p>Add your Supabase keys to <code>.env.local</code> and reload.</p>
        </div>
      </Shell>
    );
  }

  if (status === 'missing') {
    return (
      <Shell>
        <div className="pdp-message">
          <h1>That piece isn't here.</h1>
          <p>It may have sold or been renamed. Everything currently available is in the shop.</p>
          <Link className="btn btn-dark" to="/shop">Browse the collection</Link>
        </div>
      </Shell>
    );
  }

  const mainImage = gallery[active];
  const label = categoryLabel(product.category);

  return (
    <Shell>
      <nav className="crumbs" aria-label="Breadcrumb">
        <div className="crumbs-inner">
          <ol>
            <li><Link to="/">Home</Link></li>
            <li aria-hidden="true" className="sep">/</li>
            <li><Link to="/shop">Shop</Link></li>
            <li aria-hidden="true" className="sep">/</li>
            <li><Link to={`/shop?category=${product.category}`}>{label}</Link></li>
            <li aria-hidden="true" className="sep">/</li>
            <li><span aria-current="page">{product.title}</span></li>
          </ol>
          <Link to="/shop" className="crumbs-back">
            <svg viewBox="0 0 24 24" aria-hidden="true"><use href="#ic-arrow" /></svg>
            All pieces
          </Link>
        </div>
      </nav>

      <section className="pdp">
        <div className="pdp-grid">
          {/* -------------------------------------------------- gallery */}
          <div className="pdp-gallery">
            <div className="gallery-main">
              {mainImage ? (
                <img src={mainImage} alt={product.title} />
              ) : (
                <div className="swatch" />
              )}
              <span className="gallery-grain" aria-hidden="true" />
              <span className="gallery-sweep" aria-hidden="true" />
              <span className="gallery-badge">One of one</span>

              {mainImage && (
                <button type="button" className="gallery-zoom" onClick={() => setLightbox(true)}>
                  <svg viewBox="0 0 24 24" aria-hidden="true"><use href="#ic-zoom" /></svg>
                  View full size
                </button>
              )}

              {gallery.length > 1 && (
                <>
                  <button type="button" className="gallery-arrow prev" onClick={() => step(-1)} aria-label="Previous photo">
                    <svg viewBox="0 0 24 24"><use href="#ic-arrow" /></svg>
                  </button>
                  <button type="button" className="gallery-arrow next" onClick={() => step(1)} aria-label="Next photo">
                    <svg viewBox="0 0 24 24"><use href="#ic-arrow" /></svg>
                  </button>
                  <span className="gallery-count">{active + 1} / {gallery.length}</span>
                </>
              )}
            </div>

            {gallery.length > 1 && (
              <div className="gallery-thumbs">
                {gallery.map((src, i) => (
                  <button
                    key={src}
                    type="button"
                    className={`thumb${i === active ? ' active' : ''}`}
                    onClick={() => setActive(i)}
                    aria-label={`Show photo ${i + 1}`}
                    aria-pressed={i === active}
                  >
                    <img src={src} alt="" loading="lazy" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ---------------------------------------------------- info */}
          <div className="pdp-info">
            <span className="eyebrow">
              <svg className="gem" viewBox="0 0 24 24" aria-hidden="true">
                <use href="#gem-shape" />
              </svg>
              {label} — hand-set
            </span>

            <h1>{product.title}</h1>

            {product.blurb && <p className="pdp-blurb">{product.blurb}</p>}

            <div className="price-block">
              <div className="price-main">
                <span className="price">Made to order</span>
                <span className="one-of-one">One of one — once it's gone, it's gone</span>
              </div>
              <p className="price-note">
                Dianna prices each piece after you send the details, so you only pay for the
                work your kreation actually takes.
              </p>
            </div>

            <div className="pdp-actions" ref={ctaRef}>
              <Link className="btn btn-dark" to="/custom">
                Request this piece
                <svg viewBox="0 0 24 24" aria-hidden="true"><use href="#ic-arrow" /></svg>
              </Link>
              <a
                className="btn btn-ghost"
                href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent('Question about ' + product.title)}`}
              >
                <svg viewBox="0 0 24 24" aria-hidden="true"><use href="#ic-mail" /></svg>
                Ask a question
              </a>
            </div>

            <div className="trust-row">
              <div className="trust-item">
                <svg viewBox="0 0 24 24" aria-hidden="true"><use href="#ic-hand" /></svg>
                Hand-set in Laurelton, Queens
              </div>
              <div className="trust-item">
                <svg viewBox="0 0 24 24" aria-hidden="true"><use href="#ic-cal" /></svg>
                About 14 days
              </div>
              <div className="trust-item">
                <svg viewBox="0 0 24 24" aria-hidden="true"><use href="#ic-truck" /></svg>
                Ships nationwide
              </div>
            </div>

            {product.description && (
              <div className="pdp-story">
                <span className="story-label">About this piece</span>
                <p>{product.description}</p>
              </div>
            )}

            <div className="cross-sell">
              <svg viewBox="0 0 24 24" aria-hidden="true"><use href="#gem-shape" /></svg>
              <p>
                Want this in different colors, or with your own initials?
                <Link to="/custom">Start a kreation</Link>
              </p>
            </div>

            <div className="accordions">
              {FAQS.map((f, i) => (
                <div className={`faq-item${openFaq === i ? ' open' : ''}`} key={f.q}>
                  <button
                    type="button"
                    className="faq-q"
                    aria-expanded={openFaq === i}
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  >
                    {f.q}
                    <svg viewBox="0 0 24 24" aria-hidden="true"><use href="#ic-plus" /></svg>
                  </button>
                  <div className="faq-a"><p>{f.a}</p></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------ how it works */}
      <section className="pdp-band">
        <div className="wrap">
          <div className="band-head reveal">
            <span className="eyebrow">
              <svg className="gem" viewBox="0 0 24 24" aria-hidden="true"><use href="#gem-shape" /></svg>
              Made for you, not stocked
            </span>
            <h2>How this piece gets made</h2>
          </div>
          <div className="band-steps reveal">
            {STEPS.map(([n, title, copy]) => (
              <div className="band-step" key={n}>
                <span className="step-n">{n}</span>
                <h3>{title}</h3>
                <p>{copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------- related */}
      {related.length > 0 && (
        <section className="pdp-related">
          <div className="wrap">
            <div className="section-head reveal">
              <div>
                <span className="eyebrow">
                  <svg className="gem" viewBox="0 0 24 24" aria-hidden="true"><use href="#gem-shape" /></svg>
                  Keep looking
                </span>
                <h2>More one-of-ones</h2>
              </div>
              <Link to="/shop" className="head-link">
                See the whole shop
                <svg viewBox="0 0 24 24" aria-hidden="true"><use href="#ic-arrow" /></svg>
              </Link>
            </div>

            <div className="related-grid reveal">
              {related.map((p) => (
                <Link key={p.id} to={`/product/${p.slug}`} className="related-card">
                  {p.image_url ? <img src={p.image_url} alt={p.title} loading="lazy" /> : <div className="swatch" />}
                  <span className="card-sweep" aria-hidden="true" />
                  <div className="card-info">
                    <span className="kicker">{categoryLabel(p.category)}</span>
                    <h3>{p.title}</h3>
                    <span className="from">{p.blurb || 'Made to order'}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* mobile-only action bar, once the buttons scroll away */}
      <div className={`pdp-bar${showBar ? ' show' : ''}`}>
        <div className="bar-copy">
          <strong>{product.title}</strong>
          <span>Made to order</span>
        </div>
        <Link className="btn btn-dark" to="/custom">Request this piece</Link>
      </div>

      {lightbox && mainImage && (
        <Lightbox
          images={gallery}
          index={active}
          onClose={() => setLightbox(false)}
          onStep={step}
        />
      )}
    </Shell>
  );
}