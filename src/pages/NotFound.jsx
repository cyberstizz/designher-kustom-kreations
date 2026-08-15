import { Link } from 'react-router-dom';
import SiteHeader from '../components/SiteHeader.jsx';
import SiteFooter from '../components/SiteFooter.jsx';
import '../styles/pages/reviews.css';

export default function NotFound() {
  return (
    <div className="page-reviews">
      <SiteHeader />
      <main>
        <section className="reviews-hero">
          <div className="wrap">
            <span className="eyebrow">Page 404</span>
            <h1>That page isn't set.</h1>
            <p className="reviews-lede">
              The link may be old or mistyped. Everything Dianna makes is still one
              click away.
            </p>
            <p style={{ marginTop: 32 }}>
              <Link className="btn btn-primary" to="/">Back to Home</Link>
            </p>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
