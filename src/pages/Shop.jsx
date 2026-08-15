import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/pages/shop.css';
import init from './scripts/shop.js';
import SiteHeader from '../components/SiteHeader.jsx';
import SiteFooter from '../components/SiteFooter.jsx';

export default function Shop() {
  useEffect(() => init(), []);

  return (
    <div className="page-shop">
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
      <div className="page-hero">
        <span className="eyebrow">
          <svg className="gem" viewBox="0 0 24 24">
            <use href="#gem-shape" style={{color: 'var(--champagne)'}} />
          </svg>
          The Collection
        </span>
        <h1>Shop the kreations</h1>
        <p>
          Ready-made, hand-set pieces you can buy today. Want your own colors, initials, or a piece built from scratch?
          <Link to="/custom" style={{textDecoration: 'underline', textUnderlineOffset: '3px'}}>Start a Kreation</Link>
          instead.
        </p>
      </div>
      <div className="filter-bar">
        <div className="filter-inner">
          <div className="pill-row" id="pillRow">
            <div className="pill active" data-cat="all">All</div>
            <div className="pill" data-cat="sneakers">Sneakers</div>
            <div className="pill" data-cat="boots">Boots</div>
            <div className="pill" data-cat="jackets">Jackets</div>
            <div className="pill" data-cat="crocs">Crocs</div>
            <div className="pill" data-cat="kids">Kids</div>
          </div>
          <div className="filter-right">
            <span className="result-count" id="resultCount">6 kreations</span>
            <select id="sortSelect">
              <option value="featured">Featured</option>
              <option value="low">Price: Low to High</option>
              <option value="high">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>
      <div className="shop-grid-wrap">
        <div className="wrap" style={{padding: '0', maxWidth: '1240px'}}>
          <div className="shop-grid" id="shopGrid">
            <Link to="/product" className="product-card" data-cat="sneakers" data-price="185">
              <img src="/images/kreation-01.jpg" alt="Sapphire Row hand-set Converse sneakers" />
              <div className="card-sweep"></div>
              <div className="card-info">
                <span className="kicker">Sneakers</span>
                <h3>Sapphire Row Converse</h3>
                <span className="from">$185</span>
              </div>
              <span className="card-link"></span>
            </Link>
            <div className="product-card" data-cat="boots" data-price="220">
              <img src="/images/kreation-02.jpg" alt="Diamond Girl rhinestone boots and cap" />
              <div className="card-sweep"></div>
              <div className="card-info">
                <span className="kicker">Boots</span>
                <h3>Diamond Girl Boots</h3>
                <span className="from">$220</span>
              </div>
              <a href="#" className="card-link"></a>
            </div>
            <div className="product-card" data-cat="jackets" data-price="165">
              <img src="/images/kreation-03.jpg" alt="DIVA custom denim jacket" />
              <div className="card-sweep"></div>
              <div className="card-info">
                <span className="kicker">Denim</span>
                <h3>DIVA Jacket</h3>
                <span className="from">$165</span>
              </div>
              <a href="#" className="card-link"></a>
            </div>
            <div className="product-card" data-cat="kids" data-price="95">
              <img src="/images/kreation-04.jpg" alt="Kids sequin unicorn bow sneaker" />
              <div className="card-sweep"></div>
              <div className="card-info">
                <span className="kicker">Kids</span>
                <h3>Unicorn Bow Set</h3>
                <span className="from">$95</span>
              </div>
              <a href="#" className="card-link"></a>
            </div>
            <div className="product-card" data-cat="sneakers" data-price="9999" style={{'--swatch-a': '#3A1730', '--swatch-b': '#160A17'}}>
              <div className="swatch"></div>
              <div className="card-sweep"></div>
              <span className="soon-badge">New Design Weekly</span>
              <div className="card-info">
                <span className="kicker">Sneakers</span>
                <h3>More Styles Coming</h3>
                <span className="from">Check back soon</span>
              </div>
              <Link to="/custom" className="card-link"></Link>
            </div>
            <div className="product-card" data-cat="crocs" data-price="9999" style={{'--swatch-a': '#5C4A12', '--swatch-b': '#241D08'}}>
              <div className="swatch"></div>
              <div className="card-sweep"></div>
              <span className="soon-badge">New Drop</span>
              <div className="card-info">
                <span className="kicker">Crocs</span>
                <h3>Bling Crocs</h3>
                <span className="from">Coming soon</span>
              </div>
              <Link to="/custom" className="card-link"></Link>
            </div>
            <div className="product-card" data-cat="crocs" data-price="9999" style={{'--swatch-a': '#123A2E', '--swatch-b': '#081714'}}>
              <div className="swatch"></div>
              <div className="card-sweep"></div>
              <span className="soon-badge">New Drop</span>
              <div className="card-info">
                <span className="kicker">Crocs</span>
                <h3>Bling Crocs, Vol. 2</h3>
                <span className="from">Coming soon</span>
              </div>
              <Link to="/custom" className="card-link"></Link>
            </div>
            <div className="product-card" data-cat="jackets" data-price="9999" style={{'--swatch-a': '#1A2A4A', '--swatch-b': '#0A0F1E'}}>
              <div className="swatch"></div>
              <div className="card-sweep"></div>
              <span className="soon-badge">New Design Weekly</span>
              <div className="card-info">
                <span className="kicker">Denim</span>
                <h3>More Styles Coming</h3>
                <span className="from">Check back soon</span>
              </div>
              <Link to="/custom" className="card-link"></Link>
            </div>
            <div className="product-card" data-cat="boots" data-price="9999" style={{'--swatch-a': '#3A1212', '--swatch-b': '#170707'}}>
              <div className="swatch"></div>
              <div className="card-sweep"></div>
              <span className="soon-badge">New Design Weekly</span>
              <div className="card-info">
                <span className="kicker">Boots</span>
                <h3>More Styles Coming</h3>
                <span className="from">Check back soon</span>
              </div>
              <Link to="/custom" className="card-link"></Link>
            </div>
          </div>
        </div>
      </div>
      <SiteFooter />
    </div>
  );
}
