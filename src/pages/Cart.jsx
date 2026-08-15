import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/pages/cart.css';
import init from './scripts/cart.js';
import SiteHeader from '../components/SiteHeader.jsx';
import SiteFooter from '../components/SiteFooter.jsx';

export default function Cart() {
  useEffect(() => init(), []);

  return (
    <div className="page-cart">
      <svg width="0" height="0" style={{position: 'absolute'}}>
        <symbol id="ic-cart" viewBox="0 0 24 24">
          <path fill="none" stroke="currentColor" strokeWidth="1.6" d="M4 6h2l1.6 10.2A2 2 0 0 0 9.6 18h7.8a2 2 0 0 0 2-1.7L20.5 9H6.2" />
          <circle cx="10" cy="21" r="1.2" />
          <circle cx="17" cy="21" r="1.2" />
        </symbol>
        <symbol id="ic-lock" viewBox="0 0 24 24">
          <rect x="5" y="11" width="14" height="9" rx="2" fill="none" stroke="currentColor" strokeWidth="1.4" />
          <path d="M8 11V8a4 4 0 0 1 8 0v3" fill="none" stroke="currentColor" strokeWidth="1.4" />
        </symbol>
        <symbol id="ic-truck" viewBox="0 0 24 24">
          <path fill="none" stroke="currentColor" strokeWidth="1.4" d="M3 7h11v9H3zM14 11h4l3 3v2h-7zM7 20a1.6 1.6 0 1 0 0-3.2A1.6 1.6 0 0 0 7 20zM18 20a1.6 1.6 0 1 0 0-3.2 1.6 1.6 0 0 0 0 3.2z" />
        </symbol>
        <symbol id="ic-hand" viewBox="0 0 24 24">
          <path fill="none" stroke="currentColor" strokeWidth="1.4" d="M8 12V5a1.5 1.5 0 0 1 3 0v6M11 11V4a1.5 1.5 0 0 1 3 0v7M14 12V6a1.5 1.5 0 0 1 3 0v9M8 11.5 5.8 9.3a1.4 1.4 0 0 0-2 2L8 16c1 1.4 2.6 3 5.5 3h1a5 5 0 0 0 5-5v-3" />
        </symbol>
        <symbol id="ic-bag-x" viewBox="0 0 24 24">
          <path fill="none" stroke="currentColor" strokeWidth="1.4" d="M6 8h12l1 12H5L6 8ZM9 8V6a3 3 0 0 1 6 0v2" />
          <path d="M10 12l4 4M14 12l-4 4" stroke="currentColor" strokeWidth="1.4" />
        </symbol>
      </svg>
      <SiteHeader cartCount={2} />
      <div className="page-hero">
        <span className="eyebrow">
          <svg className="gem" viewBox="0 0 24 24">
            <polygon points="12,2 20,9 12,22 4,9" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
          </svg>
          Your Bag
        </span>
        <h1>Review your kreations</h1>
      </div>
      <div className="cart-layout">
        <div>
          <div className="cart-list" id="cartList">
            <div className="cart-item" data-price="185">
              <div className="ci-thumb">
                <img src="/images/kreation-01.jpg" alt="Sapphire Row Converse" />
              </div>
              <div className="ci-info">
                <span className="kicker">Sneakers</span>
                <h3>Sapphire Row Converse</h3>
                <div className="ci-meta">Size 8 · One of one</div>
                <button className="ci-remove" data-remove="">Remove</button>
              </div>
              <div className="ci-price">$185.00</div>
            </div>
            <div className="cart-item" data-price="220">
              <div className="ci-thumb">
                <img src="/images/kreation-02.jpg" alt="Diamond Girl Boots" />
              </div>
              <div className="ci-info">
                <span className="kicker">Boots</span>
                <h3>Diamond Girl Boots</h3>
                <div className="ci-meta">Size 7 · Includes matching cap</div>
                <button className="ci-remove" data-remove="">Remove</button>
              </div>
              <div className="ci-price">$220.00</div>
            </div>
          </div>
          <div className="empty-state" id="emptyState">
            <svg viewBox="0 0 24 24">
              <use href="#ic-bag-x" />
            </svg>
            <h2>Your bag is empty</h2>
            <p>Once you add a kreation, it'll show up here.</p>
            <Link to="/shop" className="btn btn-primary" style={{maxWidth: '220px', margin: '0 auto'}}>Browse the Shop</Link>
          </div>
          <section className="section">
            <div className="section-head">
              <span className="eyebrow">
                <svg className="gem" viewBox="0 0 24 24">
                  <polygon points="12,2 20,9 12,22 4,9" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
                </svg>
                Complete the Look
              </span>
              <h2>Pairs well with your bag</h2>
            </div>
            <div className="shelf">
              <Link to="/product" className="shelf-card">
                <img src="/images/kreation-03.jpg" alt="DIVA custom denim jacket" />
                <div className="shelf-info">
                  <span className="kicker">Denim</span>
                  <h3>DIVA Jacket</h3>
                  <span className="from">$165</span>
                </div>
                <span className="shelf-link"></span>
              </Link>
              <Link to="/product" className="shelf-card">
                <img src="/images/kreation-04.jpg" alt="Kids sequin unicorn bow sneaker" />
                <div className="shelf-info">
                  <span className="kicker">Kids</span>
                  <h3>Unicorn Bow Set</h3>
                  <span className="from">$95</span>
                </div>
                <span className="shelf-link"></span>
              </Link>
              <Link to="/custom" className="shelf-card">
                <div style={{position: 'absolute', inset: '0', background: 'linear-gradient(160deg,#3A1730,#160A17)'}}></div>
                <div className="shelf-info">
                  <span className="kicker">Custom</span>
                  <h3>Bring Your Own Item</h3>
                  <span className="from">Get a quote</span>
                </div>
                <span className="shelf-link"></span>
              </Link>
            </div>
          </section>
        </div>
        <aside className="summary">
          <h2>Order Summary</h2>
          <div className="sum-row">
            <span>Subtotal</span>
            <span className="sv" id="sumSubtotal">$405.00</span>
          </div>
          <div className="sum-row free" id="shipRow">
            <span>Shipping</span>
            <span className="sv">
              <span className="strike">$14.00</span>
              Free
            </span>
          </div>
          <div className="sum-note" id="shipNote">Free shipping unlocked — you're over $250.</div>
          <div className="sum-total">
            <span>Total</span>
            <span id="sumTotal">$405.00</span>
          </div>
          <Link to="/checkout" className="btn btn-primary" id="checkoutBtn">Proceed to Checkout</Link>
          <Link to="/shop" className="btn btn-ghost">Continue Shopping</Link>
          <div className="trust-mini">
            <div>
              <svg viewBox="0 0 24 24">
                <use href="#ic-lock" />
              </svg>
              Secure checkout
            </div>
            <div>
              <svg viewBox="0 0 24 24">
                <use href="#ic-truck" />
              </svg>
              Ships nationwide
            </div>
            <div>
              <svg viewBox="0 0 24 24">
                <use href="#ic-hand" />
              </svg>
              Every piece hand-set in Laurelton, Queens
            </div>
          </div>
        </aside>
      </div>
      <SiteFooter variant="slim" />
    </div>
  );
}
