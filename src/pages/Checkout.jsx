import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/pages/checkout.css';
import init from './scripts/checkout.js';

export default function Checkout() {
  useEffect(() => init(), []);

  return (
    <div className="page-checkout">
      <svg width="0" height="0" style={{position: 'absolute'}}>
        <symbol id="ic-lock" viewBox="0 0 24 24">
          <rect x="5" y="11" width="14" height="9" rx="2" fill="none" stroke="currentColor" strokeWidth="1.4" />
          <path d="M8 11V8a4 4 0 0 1 8 0v3" fill="none" stroke="currentColor" strokeWidth="1.4" />
        </symbol>
        <symbol id="ic-card" viewBox="0 0 24 24">
          <rect x="3" y="6" width="18" height="13" rx="2" fill="none" stroke="currentColor" strokeWidth="1.4" />
          <path d="M3 10h18" stroke="currentColor" strokeWidth="1.4" />
        </symbol>
        <symbol id="ic-info" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.4" />
          <path d="M12 11v5M12 8v.01" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </symbol>
      </svg>
      <header className="checkout-header">
        <div className="checkout-header-inner">
          <Link to="/" className="wordmark">
            <span className="script">Designher</span>
            <span className="tag">CUSTOM KREATIONS</span>
          </Link>
          <div className="secure-note">
            <svg viewBox="0 0 24 24">
              <use href="#ic-lock" />
            </svg>
            Secure Checkout
          </div>
        </div>
      </header>
      <form className="checkout-layout" id="checkoutForm" noValidate>
        <div>
          <div className="cform-section">
            <h2>
              <span className="num">1</span>
              Contact
            </h2>
            <label className="field">
              <span className="flabel">Email</span>
              <input type="email" id="email" placeholder="you@email.com" />
              <div className="field-err">Enter a valid email.</div>
            </label>
          </div>
          <div className="cform-section">
            <h2>
              <span className="num">2</span>
              Shipping Address
            </h2>
            <label className="field">
              <span className="flabel">Full name</span>
              <input type="text" id="fullName" placeholder="Your name" />
              <div className="field-err">Enter your name.</div>
            </label>
            <label className="field">
              <span className="flabel">Address</span>
              <input type="text" id="address1" placeholder="Street address" />
              <div className="field-err">Enter your address.</div>
            </label>
            <label className="field">
              <span className="flabel">Apt, suite, etc. (optional)</span>
              <input type="text" id="address2" placeholder="Apt / Suite" />
            </label>
            <div className="field-row three">
              <label className="field">
                <span className="flabel">City</span>
                <input type="text" id="city" placeholder="City" />
                <div className="field-err">Required.</div>
              </label>
              <label className="field">
                <span className="flabel">State</span>
                <input type="text" id="state" placeholder="NY" />
                <div className="field-err">Required.</div>
              </label>
              <label className="field">
                <span className="flabel">ZIP</span>
                <input type="text" id="zip" placeholder="11413" />
                <div className="field-err">Required.</div>
              </label>
            </div>
            <label className="field">
              <span className="flabel">Phone</span>
              <input type="tel" id="phone" placeholder="(555) 555-5555" />
              <div className="field-err">Enter a phone number.</div>
            </label>
          </div>
          <div className="cform-section">
            <h2>
              <span className="num">3</span>
              Payment
            </h2>
            <div className="card-mockup">
              <div className="row">
                <svg viewBox="0 0 24 24">
                  <use href="#ic-card" />
                </svg>
                <input type="text" placeholder="Card number" inputMode="numeric" maxLength="19" />
              </div>
              <div className="row split">
                <input type="text" placeholder="MM / YY" maxLength="7" />
                <input type="text" placeholder="CVC" maxLength="4" />
                <input type="text" placeholder="ZIP" maxLength="10" />
              </div>
            </div>
            <div className="mockup-flag">
              <svg viewBox="0 0 24 24">
                <use href="#ic-info" />
              </svg>
              <span>
                Prototype only — these fields are styled to preview the layout. The real build must use Stripe Elements (tokenized card input), the same way
                <code>CustomStripeModal.js</code>
                already does. Raw card numbers should never touch your own server.
              </span>
            </div>
            <div className="checkbox-row">
              <input type="checkbox" id="saveInfo" />
              <label htmlFor="saveInfo">Save this info for faster checkout next time</label>
            </div>
          </div>
          <button type="submit" className="btn btn-primary" id="placeOrderBtn">
            <span className="spinner"></span>
            <span className="btxt">Place Order — $405.00</span>
          </button>
        </div>
        <aside className="summary">
          <h2>Order Summary</h2>
          <div className="sitem">
            <div className="thumb">
              <img src="/images/kreation-01.jpg" alt="Sapphire Row Converse" />
              <span className="qty">1</span>
            </div>
            <div>
              <div className="si-name">Sapphire Row Converse</div>
              <div className="si-meta">Size 8</div>
            </div>
            <div className="si-price">$185.00</div>
          </div>
          <div className="sitem">
            <div className="thumb">
              <img src="/images/kreation-02.jpg" alt="Diamond Girl Boots" />
              <span className="qty">1</span>
            </div>
            <div>
              <div className="si-name">Diamond Girl Boots</div>
              <div className="si-meta">Size 7</div>
            </div>
            <div className="si-price">$220.00</div>
          </div>
          <div className="promo-row">
            <input type="text" placeholder="Promo code" />
            <button type="button">Apply</button>
          </div>
          <div className="sum-row">
            <span>Subtotal</span>
            <span>$405.00</span>
          </div>
          <div className="sum-row">
            <span>Shipping</span>
            <span style={{color: 'var(--champagne)'}}>Free</span>
          </div>
          <div className="sum-total">
            <span>Total</span>
            <span>$405.00</span>
          </div>
        </aside>
      </form>
    </div>
  );
}
