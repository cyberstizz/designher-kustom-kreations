import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/pages/home.css';
import init from './scripts/home.js';
import SiteHeader from '../components/SiteHeader.jsx';
import SiteFooter from '../components/SiteFooter.jsx';
import { categoryLabel, fetchPublishedProducts } from '../lib/products.js';
import { DEFAULTS, fetchSettings } from '../lib/settings.js';

export default function Home() {
  useEffect(() => init(), []);

  // The shelf shows the first four published pieces, in the order Dianna set
  // in the admin. The container is already a .reveal element observed at
  // mount, so loading these late doesn't break the entrance animation.
  const [shelf, setShelf] = useState([]);
  // Photos Dianna controls from the admin. Defaults render immediately so the
  // hero never flashes empty while this resolves.
  const [site, setSite] = useState(DEFAULTS);
  useEffect(() => {
    let cancelled = false;
    fetchSettings().then((s) => { if (!cancelled) setSite(s); });
    return () => { cancelled = true; };
  }, []);
  useEffect(() => {
    let cancelled = false;
    fetchPublishedProducts().then((res) => {
      if (!cancelled && !res.error) setShelf(res.data.slice(0, 4));
    });
    return () => { cancelled = true; };
  }, []);

  return (
    <div className="page-home">
      <svg width="0" height="0" style={{position: 'absolute'}}>
        <symbol id="gem-shape" viewBox="0 0 24 24">
          <polygon points="12,2 20,9 12,22 4,9" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
          <polyline points="4,9 20,9" fill="none" stroke="currentColor" strokeWidth="1.1" />
          <polyline points="8.5,9 12,2 15.5,9" fill="none" stroke="currentColor" strokeWidth="1" />
          <polyline points="12,22 8.5,9" fill="none" stroke="currentColor" strokeWidth="1" />
          <polyline points="12,22 15.5,9" fill="none" stroke="currentColor" strokeWidth="1" />
        </symbol>
      </svg>
      <SiteHeader />
      <main id="top">
        <section className="hero">
          <div className="hero-copy">
            <span className="eyebrow">
              <svg className="gem" viewBox="0 0 24 24">
                <use href="#gem-shape" style={{color: 'var(--champagne)'}} />
              </svg>
              Hand-set in Laurelton, Queens
            </span>
            <h1>
              Every stone,
              <br />
              set by hand
              <em>for you.</em>
            </h1>
            <div className="hero-rule"></div>
            <p className="lede">
              Designher Custom Kreations turns Converse, boots, denim and Crocs into one-of-one pieces — rhinestone by rhinestone, made to your story. No printed shortcuts, no two alike.
            </p>
            <div className="hero-ctas">
              <Link to="/custom" className="btn btn-primary">Start a Kreation</Link>
              <Link to="/shop" className="btn btn-ghost">Shop Ready-Made</Link>
            </div>
            <div className="hero-stats">
              <div>
                <b>2022</b>
                <span>Founded by Dianna Beaty</span>
              </div>
              <div>
                <b>14 Days</b>
                <span>Custom Turnaround</span>
              </div>
              <div>
                <b>50</b>
                <span>State Shipping</span>
              </div>
            </div>
          </div>
          <Link to="/product" className="hero-media" aria-label="View Sapphire Row Converse product page">
            <img src={site.hero_image_url} alt="Featured hand-set kreation" />
            <div className="sweep"></div>
            {site.hero_badge && <span className="hero-badge">{site.hero_badge}</span>}
          </Link>
        </section>
        <div className="marquee-strip">
          <div className="marquee-track" aria-hidden="true">
            <span>◆ HAND MADE ALWAYS</span>
            <span>◆ @designherck@gmail.com</span>
            <span href="https://m.facebook.com/DesignHerInc">◆ Facebook / DesignHerInc</span>
            <span href="https://www.tiktok.com/@designher_inc">◆ TikTok / @designher_inc</span>
            <span>◆ Made to Order, Not Mass Produced</span>
            <span href="https://m.facebook.com/DesignHerInc">◆ Facebook / DesignHerInc</span>
            <span href="https://www.tiktok.com/@designher_inc">◆ TikTok / @designher_inc</span>
            <span>◆ Made to Order, Not Mass Produced</span>
          </div>
        </div>
        <section className="section" id="shop">
          <div className="wrap">
            <div className="section-head reveal">
              <div>
                <span className="eyebrow">
                  <svg className="gem" viewBox="0 0 24 24">
                    <use href="#gem-shape" style={{color: 'var(--champagne)'}} />
                  </svg>
                  The Collection
                </span>
                <h2>Shop the kreations</h2>
              </div>
              <p>
                Four silhouettes, endless combinations. Every piece starts as a genuine retail item — then Dianna makes it yours.
              </p>
            </div>
          </div>
          <div className="wrap" style={{padding: '0', maxWidth: '1240px'}}>
            <div className="shelf reveal">
              {shelf.length > 0 ? (
                shelf.map((p) => (
                  <Link key={p.id} to={`/product/${p.slug}`} className="shelf-card">
                    {p.image_url ? (
                      <img src={p.image_url} alt={p.title} loading="lazy" />
                    ) : (
                      <div className="swatch"></div>
                    )}
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
                  <svg className="gem" viewBox="0 0 24 24">
                    <use href="#gem-shape" style={{color: 'var(--champagne)'}} />
                  </svg>
                  How a Kreation Comes Together
                </span>
                <h2>From your idea to your feet, in three fittings</h2>
              </div>
              <p>Every custom order runs through the same hands, start to finish.</p>
            </div>
            <div className="process-line"></div>
            <div className="process reveal">
              <div className="process-step">
                <svg className="gem-big" viewBox="0 0 24 24">
                  <use href="#gem-shape" style={{color: 'var(--champagne)'}} />
                </svg>
                <span className="tag">Fitting One</span>
                <h3>Sketch the vision</h3>
                <p>
                  Send your colors, initials, occasion, and energy. Dianna sketches the layout and confirms it with you before a single stone is placed.
                </p>
              </div>
              <div className="process-step">
                <svg className="gem-big" viewBox="0 0 24 24">
                  <use href="#gem-shape" style={{color: 'var(--champagne)'}} />
                </svg>
                <span className="tag">Fitting Two</span>
                <h3>Set stone by stone</h3>
                <p>
                  Every rhinestone and pearl is hand-placed on your base item — no printed shortcuts, no two pieces ever exactly alike.
                </p>
              </div>
              <div className="process-step">
                <svg className="gem-big" viewBox="0 0 24 24">
                  <use href="#gem-shape" style={{color: 'var(--champagne)'}} />
                </svg>
                <span className="tag">Fitting Three</span>
                <h3>Ship in 14 days</h3>
                <p>
                  Packed with care and shipped nationwide, ready to turn heads the day it lands on your porch.
                </p>
              </div>
            </div>
            <div className="reveal" style={{marginTop: '56px', textAlign: 'center'}}>
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
                  <svg className="gem" viewBox="0 0 24 24">
                    <use href="#gem-shape" style={{color: 'var(--ruby)'}} />
                  </svg>
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
                  <svg className="gem" viewBox="0 0 24 24">
                    <use href="#gem-shape" style={{color: 'var(--champagne)'}} />
                  </svg>
                  Wall of Love
                </span>
                <h2>Worn out loud, all over the country</h2>
              </div>
              <p>
                A few notes from the kreation family. Placeholder copy — swap in real reviews before launch.
              </p>
            </div>
          </div>
          <div className="wrap" style={{maxWidth: '1240px'}}>
            <div className="wall-track reveal">
              <div className="love-card">
                <span className="stars">★★★★★</span>
                <p>
                  My AKA sisters asked where I got my Converse before I even sat down. Worth every day of the wait.
                </p>
                <span className="who">Renee · Bronx, NY</span>
              </div>
              <div className="love-card">
                <span className="stars">★★★★★</span>
                <p>
                  Ordered the Diamond Girl boots for my daughter's graduation. Photos looked like a magazine shoot.
                </p>
                <span className="who">Tasha · Newark, NJ</span>
              </div>
              <div className="love-card">
                <span className="stars">★★★★★</span>
                <p>
                  The denim jacket fits exactly how we sketched it out over text. That kind of care is rare.
                </p>
                <span className="who">Monique · New York, NY</span>
              </div>
              <div className="love-card">
                <span className="stars">★★★★★</span>
                <p>
                  Shipped nationwide to Atlanta in exactly 14 days, just like promised. Already planning my next kreation.
                </p>
                <span className="who">Iris · Atlanta, GA</span>
              </div>
            </div>
          </div>
        </section>
        <section className="cta-band">
          <div className="wrap">
            <span className="eyebrow">
              <svg className="gem" viewBox="0 0 24 24">
                <use href="#gem-shape" style={{color: 'var(--bone)'}} />
              </svg>
              Ready When You Are
            </span>
            <h2>
              Your next kreation
              <br />
              is one message away.
            </h2>
            <div className="hero-ctas">
              <Link to="/custom" className="btn btn-primary">Start a Kreation</Link>
              <Link to="/shop" className="btn btn-ghost">Browse the Shop</Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}