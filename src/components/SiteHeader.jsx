import { Link, NavLink } from 'react-router-dom';

/**
 * Site header. One nav for the whole site.
 *
 * cartCount  number shown in the badge. The badge hides itself at 0.
 *            Carries id="cartBadge" because Cart and Product still update it
 *            directly from their ported page scripts.
 */
export default function SiteHeader({ cartCount = 0 }) {
  return (
    <header className="site-header">
      <div className="header-inner">
        <Link to="/" className="wordmark">
          <span className="script">Designher</span>
          <span className="tag">CUSTOM KREATIONS</span>
        </Link>

        <nav className="primary-nav">
          <NavLink to="/shop">Shop</NavLink>
          <NavLink to="/custom">Custom Kreations</NavLink>
          <NavLink to="/about">About</NavLink>
          <NavLink to="/reviews">Reviews</NavLink>
        </nav>

        <div className="header-icons">
          <button className="icon-btn" aria-label="Search">
            <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.6">
              <circle cx="11" cy="11" r="6.5" stroke="currentColor" />
              <path d="m16 16 4.5 4.5" stroke="currentColor" />
            </svg>
          </button>

          <Link
            to="/cart"
            className="icon-btn"
            aria-label={`Cart, ${cartCount} ${cartCount === 1 ? 'item' : 'items'}`}
          >
            <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.6">
              <path
                d="M4 6h2l1.6 10.2A2 2 0 0 0 9.6 18h7.8a2 2 0 0 0 2-1.7L20.5 9H6.2"
                stroke="currentColor"
              />
              <circle cx="10" cy="21" r="1.2" fill="currentColor" />
              <circle cx="17" cy="21" r="1.2" fill="currentColor" />
            </svg>
            <span className="cart-badge" id="cartBadge" hidden={cartCount === 0}>
              {cartCount}
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
}
