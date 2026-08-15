import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/pages/orderstatus.css';
import init from './scripts/orderstatus.js';

export default function OrderStatus() {
  useEffect(() => init(), []);

  return (
    <div className="page-orderstatus">
      <svg width="0" height="0" style={{position: 'absolute'}}>
        <symbol id="ic-check" viewBox="0 0 24 24">
          <path fill="none" stroke="currentColor" strokeWidth="2" d="M5 12l5 5L19 8" />
        </symbol>
        <symbol id="ic-x" viewBox="0 0 24 24">
          <path fill="none" stroke="currentColor" strokeWidth="2" d="M6 6l12 12M18 6L6 18" />
        </symbol>
        <symbol id="ic-mail" viewBox="0 0 24 24">
          <rect x="3" y="5" width="18" height="14" rx="2" fill="none" stroke="currentColor" strokeWidth="1.4" />
          <path d="M4 6l8 7 8-7" fill="none" stroke="currentColor" strokeWidth="1.4" />
        </symbol>
        <symbol id="ic-hand" viewBox="0 0 24 24">
          <path fill="none" stroke="currentColor" strokeWidth="1.4" d="M8 12V5a1.5 1.5 0 0 1 3 0v6M11 11V4a1.5 1.5 0 0 1 3 0v7M14 12V6a1.5 1.5 0 0 1 3 0v9M8 11.5 5.8 9.3a1.4 1.4 0 0 0-2 2L8 16c1 1.4 2.6 3 5.5 3h1a5 5 0 0 0 5-5v-3" />
        </symbol>
        <symbol id="ic-truck" viewBox="0 0 24 24">
          <path fill="none" stroke="currentColor" strokeWidth="1.4" d="M3 7h11v9H3zM14 11h4l3 3v2h-7zM7 20a1.6 1.6 0 1 0 0-3.2A1.6 1.6 0 0 0 7 20zM18 20a1.6 1.6 0 1 0 0-3.2 1.6 1.6 0 0 0 0 3.2z" />
        </symbol>
      </svg>
      <header className="checkout-header">
        <div className="checkout-header-inner">
          <Link to="/" className="wordmark">
            <span className="script">Designher</span>
            <span className="tag">CUSTOM KREATIONS</span>
          </Link>
        </div>
      </header>
      <div className="status-wrap">
        <div className="panel active" id="panelConfirmed">
          <div className="status-icon ok">
            <svg viewBox="0 0 24 24">
              <use href="#ic-check" />
            </svg>
          </div>
          <span className="eyebrow">Order Confirmed</span>
          <h1>Your kreations are on the way.</h1>
          <p className="lede">
            A receipt is headed to your inbox now. Ready-made pieces ship in 3–5 business days — anything made to order follows the 14-day build timeline from confirmation.
          </p>
          <div className="order-card">
            <div className="oc-top">
              <span className="oc-num">Order #DHK-10482</span>
              <span className="oc-date">Aug 14, 2026</span>
            </div>
            <div className="oc-item">
              <div className="thumb">
                <img src="/images/kreation-01.jpg" alt="Sapphire Row Converse" />
              </div>
              <div>
                <div className="oi-name">Sapphire Row Converse</div>
                <div className="oi-meta">Size 8</div>
              </div>
              <div className="oi-price">$185.00</div>
            </div>
            <div className="oc-item">
              <div className="thumb">
                <img src="/images/kreation-02.jpg" alt="Diamond Girl Boots" />
              </div>
              <div>
                <div className="oi-name">Diamond Girl Boots</div>
                <div className="oi-meta">Size 7</div>
              </div>
              <div className="oi-price">$220.00</div>
            </div>
            <div className="oc-total">
              <span>Total Paid</span>
              <span>$405.00</span>
            </div>
          </div>
          <div className="next-steps">
            <h3>What Happens Next</h3>
            <ul>
              <li>
                <svg viewBox="0 0 24 24">
                  <use href="#ic-mail" />
                </svg>
                You'll get an email confirmation and receipt right away.
              </li>
              <li>
                <svg viewBox="0 0 24 24">
                  <use href="#ic-hand" />
                </svg>
                Dianna preps and packs your pieces by hand in Laurelton, Queens.
              </li>
              <li>
                <svg viewBox="0 0 24 24">
                  <use href="#ic-truck" />
                </svg>
                A tracking link follows once your order ships.
              </li>
            </ul>
          </div>
          <div className="btn-row">
            <Link to="/shop" className="btn btn-primary">Continue Shopping</Link>
            <a href="#" className="btn btn-ghost">View Order</a>
          </div>
          <div className="social-note">
            Follow
            <a href="https://www.instagram.com/designher_incllc">@designher_incllc</a>
            for drop alerts and behind-the-scenes.
          </div>
        </div>
        <div className="panel" id="panelIssue">
          <div className="status-icon bad">
            <svg viewBox="0 0 24 24">
              <use href="#ic-x" />
            </svg>
          </div>
          <span className="eyebrow" style={{color: 'var(--ruby-bright)'}}>Payment Issue</span>
          <h1>We couldn't complete your order.</h1>
          <p className="lede">
            Your card was not charged. This is usually a temporary issue with your bank or the card details entered — your bag is still saved, so nothing's lost.
          </p>
          <div className="next-steps" style={{textAlign: 'left'}}>
            <h3>A Few Things to Try</h3>
            <ul>
              <li>
                <svg viewBox="0 0 24 24">
                  <use href="#ic-check" />
                </svg>
                Double-check your card number, expiration, and CVC.
              </li>
              <li>
                <svg viewBox="0 0 24 24">
                  <use href="#ic-check" />
                </svg>
                Confirm your billing ZIP code matches your card.
              </li>
              <li>
                <svg viewBox="0 0 24 24">
                  <use href="#ic-check" />
                </svg>
                Try a different card, or contact your bank if it persists.
              </li>
            </ul>
          </div>
          <div className="btn-row">
            <Link to="/checkout" className="btn btn-primary">Try Again</Link>
            <a href="#" className="btn btn-ghost">Contact Us</a>
          </div>
        </div>
      </div>
      <div className="dev-toggle">
        Prototype preview only —
        <button type="button" id="toggleStatus">switch to the other state</button>
      </div>
    </div>
  );
}
