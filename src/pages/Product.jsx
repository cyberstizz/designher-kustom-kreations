import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/pages/product.css';
import init from './scripts/product.js';
import SiteHeader from '../components/SiteHeader.jsx';
import SiteFooter from '../components/SiteFooter.jsx';

export default function Product() {
  useEffect(() => init(), []);

  return (
    <div className="page-product">
      <svg width="0" height="0" style={{position: 'absolute'}}>
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
        <symbol id="ic-bag" viewBox="0 0 24 24">
          <path fill="none" stroke="currentColor" strokeWidth="1.6" d="M6 8h12l1 12H5L6 8ZM9 8V6a3 3 0 0 1 6 0v2" />
        </symbol>
        <symbol id="ic-check" viewBox="0 0 24 24">
          <path fill="none" stroke="currentColor" strokeWidth="2" d="M5 12l5 5L19 8" />
        </symbol>
        <symbol id="ic-cart" viewBox="0 0 24 24">
          <path fill="none" stroke="currentColor" strokeWidth="1.6" d="M4 6h2l1.6 10.2A2 2 0 0 0 9.6 18h7.8a2 2 0 0 0 2-1.7L20.5 9H6.2" />
          <circle cx="10" cy="21" r="1.2" />
          <circle cx="17" cy="21" r="1.2" />
        </symbol>
        <symbol id="ic-img" viewBox="0 0 24 24">
          <rect x="3" y="4" width="18" height="16" rx="2" fill="none" stroke="currentColor" strokeWidth="1.4" />
          <circle cx="8.5" cy="9.5" r="1.4" fill="none" stroke="currentColor" strokeWidth="1.2" />
          <path d="M4 17l5-5 4 4 3-3 4 4" fill="none" stroke="currentColor" strokeWidth="1.2" />
        </symbol>
      </svg>
      <SiteHeader cartCount={1} />
      <div className="breadcrumb">
        <Link to="/">Home</Link>
        /
        <Link to="/shop">Sneakers</Link>
        /  Sapphire Row
      </div>
      <main>
        <div className="pdp">
          <div className="gallery">
            <div className="gallery-main">
              <img id="mainImg" src="/images/kreation-01.jpg" alt="'Sapphire Row' hand-set Converse, back view" />
              <div className="gallery-sweep"></div>
              <span className="gallery-badge">One of One</span>
            </div>
            <div className="gallery-thumbs">
              <div className="thumb active" data-src="/images/kreation-01.jpg">
                <img src="/images/kreation-01.jpg" alt="Full pair, back view" />
              </div>
              <div className="thumb" data-src="/images/kreation-05.jpg">
                <img src="/images/kreation-05.jpg" alt="Close-up of hand-set crystal and pearl detail" />
              </div>
              <div className="thumb placeholder" title="Add more angles in production">
                <svg viewBox="0 0 24 24">
                  <use href="#ic-img" />
                </svg>
              </div>
              <div className="thumb placeholder" title="Add more angles in production">
                <svg viewBox="0 0 24 24">
                  <use href="#ic-img" />
                </svg>
              </div>
            </div>
          </div>
          <div className="pdp-info">
            <span className="eyebrow">
              <svg className="gem" viewBox="0 0 24 24">
                <use href="#gem-shape" style={{color: 'var(--ruby)'}} />
              </svg>
              Sneakers — Hand-Set
            </span>
            <h1>"Sapphire Row" Converse</h1>
            <div className="rating-row">
              <span className="stars">★★★★★</span>
              <a href="#reviews">4.9 · 36 reviews</a>
            </div>
            <div className="price-row">
              <span className="price">Made to order</span>
              <span className="price-note">Dianna quotes each piece after you send the details</span>
            </div>
            <span className="one-of-one">One of one — once it's gone, it's gone</span>
            <p className="pdp-desc">
              Genuine Converse Chuck Taylor All Stars, fully hand-set in blue and silver crystal with pearl accents along the back seam. Every stone is placed one at a time — no printed rhinestone sheets, no shortcuts.
            </p>
            <span className="field-label">Size (US)</span>
            <div className="size-row" id="sizeRow">
              <div className="size-pill" data-size="5">5</div>
              <div className="size-pill" data-size="6">6</div>
              <div className="size-pill" data-size="7">7</div>
              <div className="size-pill" data-size="8">8</div>
              <div className="size-pill" data-size="9">9</div>
              <div className="size-pill" data-size="10">10</div>
              <div className="size-pill" data-size="11">11</div>
            </div>
            <div className="size-err" id="sizeErr">Pick a size before adding to bag.</div>
            <div className="cross-sell">
              <svg viewBox="0 0 24 24">
                <use href="#gem-shape" />
              </svg>
              Want different colors or your own initials instead?
              <Link to="/custom">Start a Kreation</Link>
            </div>
            <div className="pdp-actions">
              <Link className="btn btn-dark" to="/custom">Request This Piece</Link>
              <a className="btn btn-ghost" href="mailto:designherinc@example.com?subject=Question%20about%20Sapphire%20Row%20Converse">
                <svg width="15" height="15" viewBox="0 0 24 24">
                  <use href="#ic-bag" />
                </svg>
                Ask a Question
              </a>
            </div>
            <div className="trust-row">
              <div className="trust-item">
                <svg viewBox="0 0 24 24">
                  <use href="#ic-hand" />
                </svg>
                Hand-set in Laurelton, Queens
              </div>
              <div className="trust-item">
                <svg viewBox="0 0 24 24">
                  <use href="#ic-truck" />
                </svg>
                Ships nationwide
              </div>
              <div className="trust-item">
                <svg viewBox="0 0 24 24">
                  <use href="#ic-cal" />
                </svg>
                3–5 days if in stock
              </div>
            </div>
            <div className="accordions" id="pdpAccordions">
              <div className="faq-item">
                <button type="button" className="faq-q">
                  Details & Care
                  <svg viewBox="0 0 24 24">
                    <use href="#ic-plus" />
                  </svg>
                </button>
                <div className="faq-a">
                  <p>
                    Spot clean only with a dry or barely damp cloth. Stones are hand-set with a flexible jewelry-grade adhesive built for daily wear, not full water submersion.
                  </p>
                </div>
              </div>
              <div className="faq-item">
                <button type="button" className="faq-q">
                  Shipping & Returns
                  <svg viewBox="0 0 24 24">
                    <use href="#ic-plus" />
                  </svg>
                </button>
                <div className="faq-a">
                  <p>
                    Ships in 3–5 business days if in stock, or 14 days if remade to order. Because every pair is hand embellished, we accept exchanges for sizing but can't accept returns on worn or altered pieces.
                  </p>
                </div>
              </div>
              <div className="faq-item">
                <button type="button" className="faq-q">
                  Sizing Guide
                  <svg viewBox="0 0 24 24">
                    <use href="#ic-plus" />
                  </svg>
                </button>
                <div className="faq-a">
                  <p>
                    True to standard Converse sizing. Between sizes? Size up for a roomier fit — these are made to be lived in.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <section className="section dark" id="reviews">
          <div className="wrap reviews-grid">
            <div className="rating-summary">
              <span className="eyebrow" style={{color: 'var(--champagne-soft)', marginBottom: '16px'}}>
                <svg className="gem" viewBox="0 0 24 24">
                  <use href="#gem-shape" style={{color: 'var(--champagne)'}} />
                </svg>
                Ratings
              </span>
              <div className="big">4.9</div>
              <span className="stars">★★★★★</span>
              <div className="count">Based on 36 reviews</div>
              <div className="bar-row">
                <span>5</span>
                <div className="bar-track">
                  <div className="bar-fill" style={{width: '88%'}}></div>
                </div>
                <span>32</span>
              </div>
              <div className="bar-row">
                <span>4</span>
                <div className="bar-track">
                  <div className="bar-fill" style={{width: '9%'}}></div>
                </div>
                <span>3</span>
              </div>
              <div className="bar-row">
                <span>3</span>
                <div className="bar-track">
                  <div className="bar-fill" style={{width: '3%'}}></div>
                </div>
                <span>1</span>
              </div>
              <div className="bar-row">
                <span>2</span>
                <div className="bar-track">
                  <div className="bar-fill" style={{width: '0%'}}></div>
                </div>
                <span>0</span>
              </div>
              <div className="bar-row">
                <span>1</span>
                <div className="bar-track">
                  <div className="bar-fill" style={{width: '0%'}}></div>
                </div>
                <span>0</span>
              </div>
              <a href="#" className="btn btn-ghost write-review-link" style={{borderColor: 'var(--ink-line)', color: 'var(--bone)'}}>Write a Review</a>
              <div className="placeholder-note">Sample data — wire up to /average-rating & /reviews.</div>
            </div>
            <div className="review-list">
              <div className="review-card">
                <span className="stars">★★★★★</span>
                <div className="rtitle">Better in person</div>
                <p>
                  The photos don't even do it justice. Every stone is packed in tight and nothing has fallen off after two months of wear.
                </p>
                <span className="who">Danielle · Verified Purchase</span>
              </div>
              <div className="review-card">
                <span className="stars">★★★★★</span>
                <div className="rtitle">Exactly true to size</div>
                <p>
                  Ordered my normal Converse size and it fit perfectly. Shipping was fast for a ready piece.
                </p>
                <span className="who">Angela · Verified Purchase</span>
              </div>
              <div className="review-card">
                <span className="stars">★★★★★</span>
                <div className="rtitle">Stopped in Target for these</div>
                <p>Three people asked where I got them before I made it to the register. Worth it.</p>
                <span className="who">Priya · Verified Purchase</span>
              </div>
            </div>
          </div>
        </section>
        <section className="section">
          <div className="wrap">
            <div className="section-head">
              <div>
                <span className="eyebrow">
                  <svg className="gem" viewBox="0 0 24 24">
                    <use href="#gem-shape" style={{color: 'var(--ruby)'}} />
                  </svg>
                  You May Also Like
                </span>
                <h2>More from the collection</h2>
              </div>
            </div>
          </div>
          <div className="wrap" style={{padding: '0', maxWidth: '1240px'}}>
            <div className="shelf">
              <a href="#" className="shelf-card">
                <img src="/images/kreation-02.jpg" alt="Rhinestone Uggs boots with matching bling cap" />
                <div className="shelf-info">
                  <span className="kicker">Boots</span>
                  <h3>Diamond Girl Boots</h3>
                  <span className="from">Made to order</span>
                </div>
                <span className="shelf-link"></span>
              </a>
              <a href="#" className="shelf-card">
                <img src="/images/kreation-03.jpg" alt="Custom denim jacket with chenille lettering" />
                <div className="shelf-info">
                  <span className="kicker">Denim</span>
                  <h3>Custom Jackets</h3>
                  <span className="from">Made to order</span>
                </div>
                <span className="shelf-link"></span>
              </a>
              <a href="#" className="shelf-card">
                <img src="/images/kreation-04.jpg" alt="Kids sequin unicorn bow sneaker" />
                <div className="shelf-info">
                  <span className="kicker">Kids</span>
                  <h3>Unicorn Bow Set</h3>
                  <span className="from">Made to order</span>
                </div>
                <span className="shelf-link"></span>
              </a>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter variant="slim" />
      <div className="toast" id="toast">
        <svg viewBox="0 0 24 24">
          <use href="#ic-check" />
        </svg>
        <span id="toastMsg">Added to bag</span>
      </div>
    </div>
  );
}