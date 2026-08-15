import { Link } from 'react-router-dom';
import '../styles/pages/about.css';
import SiteHeader from '../components/SiteHeader.jsx';
import SiteFooter from '../components/SiteFooter.jsx';

export default function About() {
  return (
    <div className="page-about">
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
      <div className="about-hero">
        <span className="eyebrow">
          <svg className="gem" viewBox="0 0 24 24">
            <use href="#gem-shape" style={{color: 'var(--champagne)'}} />
          </svg>
          The Founder
        </span>
        <h1>A needle, a handful of rhinestones, and a fearless idea.</h1>
        <p>The story behind Designher Custom Kreations, in Dianna Beaty's own words.</p>
      </div>
      <div className="stats-row">
        <div>
          <b>2022</b>
          <span>Founded</span>
        </div>
        <div>
          <b>14 Days</b>
          <span>Custom Turnaround</span>
        </div>
        <div>
          <b>50</b>
          <span>State Shipping</span>
        </div>
        <div>
          <b>3</b>
          <span>Categories — Women, Kids, Men</span>
        </div>
      </div>
      <section className="section">
        <div className="wrap story-grid">
          <div className="portrait">
            <span className="init">DB</span>
            <span className="cap">Dianna Beaty — Founder, 2022</span>
          </div>
          <div className="story-copy">
            <div className="story-block">
              <h2>Where it started</h2>
              <p>
                Designher Custom Kreations started with Dianna Beaty and a simple habit: taking plain fabric and making it hers. Rhinestones, one at a time, worked into denim and canvas until something ordinary looked intentional. There was no factory behind it and no team — just a flair for decoration that people kept noticing.
              </p>
              <p>
                By 2022, that habit had a name. Designher Custom Kreations became the place to bring your own sneakers, boots, jackets, or Crocs and have them hand-set into something nobody else is wearing.
              </p>
            </div>
            <div className="story-block">
              <h2>The craft</h2>
              <p>
                Every piece is built the same way it started — by hand, one stone at a time. Nothing here comes from a printed rhinestone sheet pressed on in a machine. That's slower, and it's supposed to be. It's also the reason no two pieces ever come out exactly alike, even when two people ask for the same idea.
              </p>
              <p>
                The shop specializes in bespoke pieces for women, children, and men, which means the process bends to whoever's asking — a graduation pair for a daughter, a matching set for a sorority sister, a first pair of bling sneakers for a five-year-old.
              </p>
            </div>
            <blockquote className="pull">
              “I don't build a piece until I know the story behind it. That's the part that actually gets set into the stones.”
              <cite>Dianna Beaty, Founder</cite>
            </blockquote>
            <span className="draft-flag">Draft placeholder quote — swap for Dianna's actual words before this goes live.</span>
            <div className="story-block">
              <h2>Where it's headed</h2>
              <p>
                There's no storefront yet — the shop lives online for now, shipping nationwide with a 14-day turnaround on every custom order. That's by design as much as circumstance: it means every dollar spent goes back into the craft, not the lease.
              </p>
              <p>
                A storefront is part of where this is headed. Until then, consider this website the front door.
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="values">
        <div className="wrap section" style={{paddingTop: '76px', paddingBottom: '76px'}}>
          <div className="section-head">
            <span className="eyebrow" style={{justifyContent: 'center'}}>
              <svg className="gem" viewBox="0 0 24 24">
                <use href="#gem-shape" style={{color: 'var(--champagne)'}} />
              </svg>
              How Dianna Works
            </span>
            <h2>Three rules that don't bend</h2>
          </div>
          <div className="value-grid">
            <div className="value-card">
              <svg className="gem-big" viewBox="0 0 24 24">
                <use href="#gem-shape" />
              </svg>
              <h3>Hand-Set, Always</h3>
              <p>
                No printed rhinestone sheets, no machine shortcuts. If it's not placed by hand, it doesn't leave the shop.
              </p>
            </div>
            <div className="value-card">
              <svg className="gem-big" viewBox="0 0 24 24">
                <use href="#gem-shape" />
              </svg>
              <h3>One of One</h3>
              <p>
                Every piece is made for the person who asked for it. Nothing is restocked exactly the same way twice.
              </p>
            </div>
            <div className="value-card">
              <svg className="gem-big" viewBox="0 0 24 24">
                <use href="#gem-shape" />
              </svg>
              <h3>Nationwide From Day One</h3>
              <p>
                No storefront required to reach you. Every order ships from Laurelton, Queens to all 50 states.
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="cta-band">
        <div className="wrap">
          <span className="eyebrow">
            <svg className="gem" viewBox="0 0 24 24">
              <use href="#gem-shape" style={{color: 'var(--bone)'}} />
            </svg>
            Join the Story
          </span>
          <h2>
            Your kreation is
            <br />
            the next chapter.
          </h2>
          <div className="cta-row">
            <Link to="/custom" className="btn btn-primary">Start a Kreation</Link>
            <Link to="/shop" className="btn btn-ghost">Shop the Collection</Link>
          </div>
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}
