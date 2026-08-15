import { Link } from 'react-router-dom';

const YEAR = new Date().getFullYear();

function Bottom({ children }) {
  return (
    <div className="footer-bottom">
      <span>© {YEAR} Designher Custom Kreations. All rights reserved.</span>
      {children}
    </div>
  );
}

/**
 * Site footer.
 *
 * variant="full" — brand blurb, link columns, social. Marketing pages.
 * variant="slim" — copyright bar only. Cart, product and wizard pages,
 *                  where the prototype deliberately kept chrome quiet.
 */
export default function SiteFooter({ variant = 'full' }) {
  if (variant === 'slim') {
    return (
      <footer className="site-footer">
        <div className="wrap footer-bottom">
          <span>© {YEAR} Designher Custom Kreations. All rights reserved.</span>
          <Link to="/">Back to Home</Link>
        </div>
      </footer>
    );
  }

  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="footer-grid">
          <div>
            <Link to="/" className="wordmark">
              <span className="script">Designher</span>
              <span className="tag">CUSTOM KREATIONS</span>
            </Link>
            <p className="blurb">
              Hand-set bling for sneakers, boots, denim and more. Founded in 2022 by
              Dianna Beaty, shipping nationwide from Laurelton, Queens.
            </p>
          </div>

          <div className="footer-col">
            <h4>Shop</h4>
            <Link to="/shop?category=sneakers">Sneakers</Link>
            <Link to="/shop?category=boots">Boots</Link>
            <Link to="/shop?category=jackets">Jackets</Link>
            <Link to="/shop?category=crocs">Crocs</Link>
          </div>

          <div className="footer-col">
            <h4>Studio</h4>
            <Link to="/custom">Start a Kreation</Link>
            <Link to="/about">About Dianna</Link>
            <Link to="/reviews">Reviews</Link>
            <Link to="/custom">Contact</Link>
          </div>

          <div className="footer-col">
            <h4>Info</h4>
            <Link to="/order-status">Track an Order</Link>
            <Link to="/about">Shipping &amp; Turnaround</Link>
            <Link to="/about">Care Guide</Link>
          </div>
        </div>

        <Bottom>
          <div className="footer-social">
            <a
              href="https://www.instagram.com/designher_incllc"
              aria-label="Instagram"
              target="_blank"
              rel="noreferrer"
            >
              <svg viewBox="0 0 24 24" strokeWidth="1.6">
                <rect x="3" y="3" width="18" height="18" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="1" />
              </svg>
            </a>
            <a
              href="https://m.facebook.com/DesignHerInc"
              aria-label="Facebook"
              target="_blank"
              rel="noreferrer"
            >
              <svg viewBox="0 0 24 24" strokeWidth="1.6">
                <path d="M15 8h-2a2 2 0 0 0-2 2v10M9 13h5" />
                <circle cx="12" cy="12" r="9" />
              </svg>
            </a>
            <a
              href="https://www.tiktok.com/@designher_inc"
              aria-label="TikTok"
              target="_blank"
              rel="noreferrer"
            >
              <svg viewBox="0 0 24 24" strokeWidth="1.6">
                <path d="M14 4v9.6a3.4 3.4 0 1 1-3.2-3.4" />
                <path d="M14 4c.4 2.2 2 3.8 4 4" />
              </svg>
            </a>
          </div>
        </Bottom>
      </div>
    </footer>
  );
}
