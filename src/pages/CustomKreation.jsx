import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/pages/custom.css';
import init from './scripts/custom.js';
import SiteHeader from '../components/SiteHeader.jsx';
import SiteFooter from '../components/SiteFooter.jsx';

export default function CustomKreation() {
  useEffect(() => init(), []);

  return (
    <div className="page-custom">
      <svg width="0" height="0" style={{position: 'absolute'}}>
        <symbol id="gem-shape" viewBox="0 0 24 24">
          <polygon points="12,2 20,9 12,22 4,9" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
          <polyline points="4,9 20,9" fill="none" stroke="currentColor" strokeWidth="1.1" />
          <polyline points="8.5,9 12,2 15.5,9" fill="none" stroke="currentColor" strokeWidth="1" />
          <polyline points="12,22 8.5,9" fill="none" stroke="currentColor" strokeWidth="1" />
          <polyline points="12,22 15.5,9" fill="none" stroke="currentColor" strokeWidth="1" />
        </symbol>
        <symbol id="ic-sneaker" viewBox="0 0 24 24">
        <path fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" strokeLinecap="round"
        d="M2.9 16.2c.1-2.1 2-3.1 4.1-3.8l4.4-1.5V6.6c0-.7.6-1.3 1.3-1.3h4.1c.7 0 1.3.6 1.3 1.3v5.1c0 .9.4 1.7 1.2 2.1.9.5 1.4 1.3 1.4 2.2v.2z"/>
        <path fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"
        d="M2.4 16.2h19.2v1.1c0 .9-.7 1.6-1.6 1.6H4c-.9 0-1.6-.7-1.6-1.6z"/>
        <path fill="none" stroke="currentColor" strokeWidth="1.05" strokeLinecap="round"
        d="M11.4 8.4h6.3M11.4 10.8h6.3"/>
        </symbol>
        <symbol id="ic-boot" viewBox="0 0 24 24">
        <path fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"
        d="M7 3.8h5v7.6c0 1 .5 1.8 1.4 2.2l4.4 2.3c1.1.6 1.8 1.6 1.8 2.8v.3c0 .6-.5 1-1 1H7c-.6 0-1-.5-1-1V3.8z"/>
        <path fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" d="M6 6.6h6"/>
        <path fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" d="M6 17.2h13.5"/>
        </symbol>
        <symbol id="ic-jacket" viewBox="0 0 24 24">
        <path fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"
        d="M9.4 3.6 6 5.1 3.2 7.9l2.3 2.5 1.6-1.4v10.5c0 .5.4.9.9.9h8c.5 0 .9-.4.9-.9V9l1.6 1.4 2.3-2.5-2.8-2.8-3.4-1.5L12 6.4z"/>
        <path fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" d="M12 6.4v13"/>
        <path fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round" d="M9.4 3.6 12 6.4l2.6-2.8"/>
        <path fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" d="M7.1 16.2h9.8"/>
        </symbol>
        <symbol id="ic-crocs" viewBox="0 0 24 24">
        <path fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" strokeLinecap="round"
        d="M2.7 15.9v-2.3C2.7 10.9 4.3 9.1 6.6 9.1c2.5 0 4.4 1.2 6 3.1l3 3.7z"/>
        <path fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"
        d="M2.3 15.9h14.4v1.2c0 .9-.7 1.6-1.6 1.6H3.9c-.9 0-1.6-.7-1.6-1.6z"/>
        <path fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round"
        d="M15.6 11.9c2.9.5 4.3 2.3 4.1 5.3"/>
        <path fill="none" stroke="currentColor" strokeWidth="1.15" strokeLinecap="round"
        d="M5.6 12.5v.9M8.2 11.6v.9M10.8 12.2v.9"/>
        </symbol>
        <symbol id="ic-plus" viewBox="0 0 24 24">
        <path fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" d="M12 5v14M5 12h14"/>
        </symbol>
        <symbol id="ic-upload" viewBox="0 0 24 24">
          <path fill="none" stroke="currentColor" strokeWidth="1.4" d="M12 15V4M7 9l5-5 5 5M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
        </symbol>
        <symbol id="ic-check" viewBox="0 0 24 24">
          <path fill="none" stroke="currentColor" strokeWidth="2" d="M5 12l5 5L19 8" />
        </symbol>
      </svg>
      <SiteHeader />
      <main>
        <div className="page-hero">
          <span className="eyebrow">
            <svg className="gem" viewBox="0 0 24 24">
              <use href="#gem-shape" style={{color: 'var(--champagne)'}} />
            </svg>
            Custom Intake
          </span>
          <h1>
            Tell Dianna what
            <br />
            you're
            <em>dreaming up.</em>
          </h1>
          <p>
            Every kreation starts with a conversation, not a checkout button. Answer a few questions and you'll get a personal quote and mockup before anything's set in stone.
          </p>
        </div>
        <div className="tracker" id="tracker">
          <div className="tracker-step active" data-step="1">
            <div className="dot">1</div>
            <span className="lbl">Base</span>
          </div>
          <div className="tracker-step" data-step="2">
            <div className="dot">2</div>
            <span className="lbl">Vibe</span>
          </div>
          <div className="tracker-step" data-step="3">
            <div className="dot">3</div>
            <span className="lbl">Details</span>
          </div>
          <div className="tracker-step" data-step="4">
            <div className="dot">4</div>
            <span className="lbl">Contact</span>
          </div>
        </div>
        <form className="wizard" id="wizard" noValidate>
          <div className="step-panel active" data-panel="1">
            <h2>What are we starting with?</h2>
            <p className="sub">Pick the piece you want Dianna to bring to life.</p>
            <div className="option-grid" id="baseGrid">
              <div className="option-card" data-value="Sneakers">
                <svg className="oc-icon" viewBox="0 0 24 24">
                  <use href="#ic-sneaker" />
                </svg>
                <span>Sneakers</span>
              </div>
              <div className="option-card" data-value="Boots">
                <svg className="oc-icon" viewBox="0 0 24 24">
                  <use href="#ic-boot" />
                </svg>
                <span>Boots & Uggs</span>
              </div>
              <div className="option-card" data-value="Jacket">
                <svg className="oc-icon" viewBox="0 0 24 24">
                  <use href="#ic-jacket" />
                </svg>
                <span>Denim Jacket</span>
              </div>
              <div className="option-card" data-value="Crocs">
                <svg className="oc-icon" viewBox="0 0 24 24">
                  <use href="#ic-crocs" />
                </svg>
                <span>Crocs</span>
              </div>
              <div className="option-card" data-value="Other">
                <svg className="oc-icon" viewBox="0 0 24 24">
                  <use href="#ic-plus" />
                </svg>
                <span>I'll bring my own</span>
              </div>
            </div>
            <div className="err" id="err1">Pick a base item to continue.</div>
            <div className="step-actions" style={{justifyContent: 'flex-end', marginTop: '28px'}}>
              <button type="button" className="btn btn-primary" data-next="2">Continue</button>
            </div>
          </div>
          <div className="step-panel" data-panel="2">
            <h2>What's the occasion?</h2>
            <p className="sub">Helps Dianna picture the vibe before she sketches.</p>
            <div className="chip-row" id="occasionRow">
              <div className="chip" data-value="Graduation">Graduation</div>
              <div className="chip" data-value="Sorority / Fraternity">Sorority / Fraternity</div>
              <div className="chip" data-value="Birthday">Birthday</div>
              <div className="chip" data-value="Everyday Glam">Everyday Glam</div>
              <div className="chip" data-value="Memorial Tribute">Memorial Tribute</div>
              <div className="chip" data-value="Kids' Gift">Kids' Gift</div>
              <div className="chip" data-value="Just Because">Just Because</div>
            </div>
            <div className="err" id="err2a">Pick one occasion.</div>
            <h2 style={{fontSize: '20px', marginTop: '8px'}}>Pick a stone palette</h2>
            <p className="sub">You'll fine-tune exact colors with Dianna after you submit.</p>
            <div className="swatch-grid" id="paletteGrid">
              <div className="swatch-card" data-value="Classic Clear">
                <div className="swatch-dot swatch-clear"></div>
                <div>
                  <span>Classic Clear</span>
                  <small>Crystal & silver</small>
                </div>
              </div>
              <div className="swatch-card" data-value="Color Pop">
                <div className="swatch-dot swatch-color"></div>
                <div>
                  <span>Color Pop</span>
                  <small>Bold rhinestone tones</small>
                </div>
              </div>
              <div className="swatch-card" data-value="Pearl & Gold">
                <div className="swatch-dot swatch-pearl"></div>
                <div>
                  <span>Pearl & Gold</span>
                  <small>Pearls & champagne gold</small>
                </div>
              </div>
              <div className="swatch-card" data-value="Mixed Metals">
                <div className="swatch-dot swatch-mixed"></div>
                <div>
                  <span>Mixed Metals</span>
                  <small>Silver & gold blend</small>
                </div>
              </div>
            </div>
            <div className="err" id="err2b">Pick a stone palette.</div>
            <div className="step-actions" style={{marginTop: '28px'}}>
              <button type="button" className="btn btn-ghost back" data-prev="1">Back</button>
              <button type="button" className="btn btn-primary" data-next="3">Continue</button>
            </div>
          </div>
          <div className="step-panel" data-panel="3">
            <h2>Make it yours</h2>
            <p className="sub">Names, initials, a reference photo — whatever gets the idea across.</p>
            <label className="field">
              <span className="flabel">Personalization</span>
              <textarea id="personalization" placeholder="e.g. name across the back, initials on the tongue, a quote..." />
            </label>
            <label className="field">
              <span className="flabel">Reference photo (optional)</span>
              <div className="upload-box" id="uploadBox">
                <svg viewBox="0 0 24 24">
                  <use href="#ic-upload" />
                </svg>
                <div className="u-main">Click to upload an inspiration photo</div>
                <div className="u-sub">JPG or PNG, up to 10MB</div>
                <div className="u-file" id="uploadFileName"></div>
              </div>
              <input type="file" id="uploadInput" accept="image/*" style={{display: 'none'}} />
            </label>
            <div className="field-row">
              <label className="field">
                <span className="flabel">Size</span>
                <input type="text" id="size" placeholder="e.g. Women's 8" />
                <div className="err">Enter a size.</div>
              </label>
              <label className="field">
                <span className="flabel">Need it by</span>
                <select id="timeline">
                  <option value="">Select one</option>
                  <option>No rush — whenever it's ready</option>
                  <option>Within 30 days</option>
                  <option>I have a specific event date</option>
                </select>
                <div className="err">Choose a timeline.</div>
              </label>
            </div>
            <label className="field">
              <span className="flabel">Budget range</span>
              <select id="budget">
                <option value="">Select one</option>
                <option>Under $150</option>
                <option>$150 – $250</option>
                <option>$250 – $400</option>
                <option>$400+</option>
              </select>
              <div className="err">Choose a budget range.</div>
            </label>
            <div className="step-actions">
              <button type="button" className="btn btn-ghost back" data-prev="2">Back</button>
              <button type="button" className="btn btn-primary" data-next="4">Continue</button>
            </div>
          </div>
          <div className="step-panel" data-panel="4">
            <h2>How should Dianna reach you?</h2>
            <p className="sub">Your quote and mockup land here first.</p>
            <label className="field">
              <span className="flabel">Full name</span>
              <input type="text" id="fullName" placeholder="Your name" />
              <div className="err">Enter your name.</div>
            </label>
            <div className="field-row">
              <label className="field">
                <span className="flabel">Email</span>
                <input type="email" id="email" placeholder="you@email.com" />
                <div className="err">Enter a valid email.</div>
              </label>
              <label className="field">
                <span className="flabel">Phone</span>
                <input type="tel" id="phone" placeholder="(555) 555-5555" />
                <div className="err">Enter a phone number.</div>
              </label>
            </div>
            <label className="field">
              <span className="flabel">Shipping state</span>
              <input type="text" id="shipState" placeholder="e.g. New York" />
              <div className="err">Enter your state.</div>
            </label>
            <div className="review-box" id="reviewBox"></div>
            <div className="err" id="err4"></div>
            <div className="step-actions">
              <button type="button" className="btn btn-ghost back" data-prev="3">Back</button>
              <button type="submit" className="btn btn-primary">Request My Quote</button>
            </div>
          </div>
        </form>
        <div className="confirm-panel" id="confirmPanel">
          <div className="confirm-icon">
            <svg viewBox="0 0 24 24">
              <use href="#ic-check" />
            </svg>
          </div>
          <h2>
            Your kreation is in
            <br />
            Dianna's hands.
          </h2>
          <p>
            Expect a personal reply with pricing and a mockup within 2 business days. Once you approve it and the deposit's in, your 14-day build starts.
          </p>
          <Link to="/" className="btn btn-ghost">Back to Home</Link>
        </div>
        <section className="section">
          <div className="wrap process-wrap">
            <div className="section-head">
              <span className="eyebrow" style={{justifyContent: 'center'}}>
                <svg className="gem" viewBox="0 0 24 24">
                  <use href="#gem-shape" style={{color: 'var(--champagne)'}} />
                </svg>
                What Happens Next
              </span>
              <h2>From quote to your porch</h2>
            </div>
            <div className="process-line"></div>
            <div className="process">
              <div className="process-step">
                <svg className="gem-big" viewBox="0 0 24 24">
                  <use href="#gem-shape" style={{color: 'var(--champagne)'}} />
                </svg>
                <span className="tag">Step One</span>
                <h3>Quote in 2 business days</h3>
                <p>Dianna reviews your answers and sends back real pricing plus a sketch or mockup.</p>
              </div>
              <div className="process-step">
                <svg className="gem-big" viewBox="0 0 24 24">
                  <use href="#gem-shape" style={{color: 'var(--champagne)'}} />
                </svg>
                <span className="tag">Step Two</span>
                <h3>Approve & pay deposit</h3>
                <p>Love it? Approve the mockup and lock in your spot with a deposit.</p>
              </div>
              <div className="process-step">
                <svg className="gem-big" viewBox="0 0 24 24">
                  <use href="#gem-shape" style={{color: 'var(--champagne)'}} />
                </svg>
                <span className="tag">Step Three</span>
                <h3>14-day build & ship</h3>
                <p>Every stone set by hand, then packed and shipped nationwide.</p>
              </div>
            </div>
          </div>
        </section>
        <section className="section">
          <div className="wrap">
            <div className="section-head">
              <span className="eyebrow" style={{justifyContent: 'center'}}>
                <svg className="gem" viewBox="0 0 24 24">
                  <use href="#gem-shape" style={{color: 'var(--champagne)'}} />
                </svg>
                Good to Know
              </span>
              <h2>Questions before you start</h2>
            </div>
            <div className="faq" id="faq">
              <div className="faq-item">
                <button type="button" className="faq-q">
                  How long does a custom order take?
                  <svg viewBox="0 0 24 24">
                    <use href="#ic-plus" fill="none" stroke="currentColor" strokeWidth="1.6" />
                  </svg>
                </button>
                <div className="faq-a">
                  <p>14 days once your deposit clears, counting from the date you approve the final design.</p>
                </div>
              </div>
              <div className="faq-item">
                <button type="button" className="faq-q">
                  Can I send in my own item?
                  <svg viewBox="0 0 24 24">
                    <use href="#ic-plus" fill="none" stroke="currentColor" strokeWidth="1.6" />
                  </svg>
                </button>
                <div className="faq-a">
                  <p>
                    Yes — mail your own sneakers, jacket, or boots and Dianna will bling them out. Just note it in the form and she'll send a shipping address.
                  </p>
                </div>
              </div>
              <div className="faq-item">
                <button type="button" className="faq-q">
                  What's the deposit?
                  <svg viewBox="0 0 24 24">
                    <use href="#ic-plus" fill="none" stroke="currentColor" strokeWidth="1.6" />
                  </svg>
                </button>
                <div className="faq-a">
                  <p>Half of the quoted price up front, with the balance due before your kreation ships.</p>
                </div>
              </div>
              <div className="faq-item">
                <button type="button" className="faq-q">
                  Do you do rush orders?
                  <svg viewBox="0 0 24 24">
                    <use href="#ic-plus" fill="none" stroke="currentColor" strokeWidth="1.6" />
                  </svg>
                </button>
                <div className="faq-a">
                  <p>
                    Considered case by case for a rush fee. Flag your date in the timeline field and Dianna will let you know if it's doable.
                  </p>
                </div>
              </div>
              <div className="faq-item">
                <button type="button" className="faq-q">
                  What if I don't love the mockup?
                  <svg viewBox="0 0 24 24">
                    <use href="#ic-plus" fill="none" stroke="currentColor" strokeWidth="1.6" />
                  </svg>
                </button>
                <div className="faq-a">
                  <p>Dianna will revise it with you. Nothing goes into production until you sign off.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="section">
          <div className="wrap">
            <div className="section-head">
              <span className="eyebrow" style={{justifyContent: 'center'}}>
                <svg className="gem" viewBox="0 0 24 24">
                  <use href="#gem-shape" style={{color: 'var(--champagne)'}} />
                </svg>
                For Inspiration
              </span>
              <h2>A few past kreations</h2>
            </div>
          </div>
          <div className="wrap" style={{maxWidth: '1120px', padding: '0'}}>
            <div className="insp-grid">
              <div className="insp-card">
                <img src="/images/kreation-01.jpg" alt="Rhinestone Converse sneakers" />
              </div>
              <div className="insp-card">
                <img src="/images/kreation-02.jpg" alt="Rhinestone boots and cap set" />
              </div>
              <div className="insp-card">
                <img src="/images/kreation-04.jpg" alt="Kids sequin unicorn bow sneaker" />
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter variant="slim" />
    </div>
  );
}