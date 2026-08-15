import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import SiteHeader from '../components/SiteHeader.jsx';
import SiteFooter from '../components/SiteFooter.jsx';
import { REVIEWS, REVIEW_FILTERS } from '../data/reviews.js';
import '../styles/pages/reviews.css';

function Stars({ n }) {
  return (
    <span className="stars" aria-label={`${n} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => (
        <svg key={i} viewBox="0 0 24 24" className={i < n ? 'on' : ''} aria-hidden="true">
          <path d="M12 3.6l2.5 5.4 5.9.7-4.4 4 1.2 5.8L12 16.6 6.8 19.5 8 13.7 3.6 9.7l5.9-.7z" />
        </svg>
      ))}
    </span>
  );
}

export default function Reviews() {
  const [filter, setFilter] = useState('all');

  const shown = useMemo(
    () => (filter === 'all' ? REVIEWS : REVIEWS.filter((r) => r.category === filter)),
    [filter]
  );

  const average = useMemo(
    () => (REVIEWS.reduce((s, r) => s + r.rating, 0) / REVIEWS.length).toFixed(1),
    []
  );

  return (
    <div className="page-reviews">
      <SiteHeader />

      <main>
        <section className="reviews-hero">
          <div className="wrap">
            <span className="eyebrow">
              <svg className="gem" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 2l6 6-6 14L6 8z" fill="currentColor" />
              </svg>
              Wall of Love
            </span>
            <h1>
              What people say when
              <em> the box gets opened.</em>
            </h1>
            <p className="reviews-lede">
              Every piece here was hand-set to order. These are the notes that came back
              afterward — kept in the order they arrived, not sorted to flatter.
            </p>

            <div className="reviews-stats">
              <div className="stat">
                <span className="stat-num">{average}</span>
                <Stars n={Math.round(average)} />
                <span className="stat-label">Average rating</span>
              </div>
              <div className="stat">
                <span className="stat-num">{REVIEWS.length}</span>
                <span className="stat-label">Reviews collected</span>
              </div>
              <div className="stat">
                <span className="stat-num">14</span>
                <span className="stat-label">Day average build</span>
              </div>
            </div>
          </div>
        </section>

        <section className="reviews-body">
          <div className="wrap">
            <div className="reviews-filters" role="group" aria-label="Filter reviews">
              {REVIEW_FILTERS.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  className={`filter-pill${filter === f.id ? ' active' : ''}`}
                  aria-pressed={filter === f.id}
                  onClick={() => setFilter(f.id)}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <p className="reviews-count">
              {shown.length} {shown.length === 1 ? 'review' : 'reviews'}
            </p>

            {shown.length === 0 ? (
              <div className="reviews-empty">
                <p>No reviews in this category yet.</p>
                <Link className="btn btn-primary" to="/custom">
                  Be the first — start a Kreation
                </Link>
              </div>
            ) : (
              <div className="reviews-wall">
                {shown.map((r) => (
                  <article className="review-card" key={r.id}>
                    <Stars n={r.rating} />
                    <blockquote>{r.body}</blockquote>
                    <footer>
                      <span className="reviewer">{r.name}</span>
                      <span className="review-meta">
                        {r.piece} · {r.location}
                      </span>
                    </footer>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="reviews-cta">
          <div className="wrap">
            <h2>Your piece could be the next one on this wall.</h2>
            <p>
              Tell Dianna what you have in mind and she'll quote it before any money
              changes hands.
            </p>
            <Link className="btn btn-primary" to="/custom">
              Start a Kreation
            </Link>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
