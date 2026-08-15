# Designher Kustom Kreations

Redesign of designherkustomkreations, built as a Vite + React 18 single-page app.
Replaces the 2022 CRA/Redux site (`cyberstizz/fulldesignherapplication`).

**Status: demo / preview build.** Nothing is wired to a backend. Forms, cart and
checkout are front-end only. See "Before this goes live" below.

---

## Run it

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build into dist/
npm run preview  # serve the production build locally
```

Node 18 or newer.

---

## Routes

| Path            | Component            | Notes                                    |
| --------------- | -------------------- | ---------------------------------------- |
| `/`             | `Home.jsx`           | Hero, shelf, process, about, reviews      |
| `/shop`         | `Shop.jsx`           | Filterable catalog                        |
| `/product`      | `Product.jsx`        | Also `/product/:slug` (slug unused today) |
| `/custom`       | `CustomKreation.jsx` | 4-step custom order wizard                |
| `/about`        | `About.jsx`          | Dianna's story                            |
| `/reviews`      | `Reviews.jsx`        | Wall of Love                              |
| `/cart`         | `Cart.jsx`           |                                           |
| `/checkout`     | `Checkout.jsx`       | No header/footer, by design               |
| `/order-status` | `OrderStatus.jsx`    | Toggle between confirmed / issue states   |
| anything else   | `NotFound.jsx`       |                                           |

---

## Structure

```
src/
  App.jsx                  routes + scroll behaviour
  main.jsx                 entry point
  components/
    SiteHeader.jsx         one nav for the whole site
    SiteFooter.jsx         variant="full" | "slim"
  pages/                   one component per route
    scripts/               ported page behaviour, called from useEffect
  styles/
    global.css             design tokens, reset, header/footer chrome
    pages/<page>.css       page styles, scoped to .page-<name>
  data/
    reviews.js             PLACEHOLDER review content
public/
  images/                  5 product photos
  _redirects               SPA fallback for Netlify
```

### How the CSS is organised

`global.css` holds the token set (colors, fonts, easing) plus anything the
header and footer need. Every other rule is scoped to a page wrapper class, so
`.page-shop .hero` can never collide with `.page-product .hero`. Each page
component renders inside `<div className="page-shop">`, which is what makes the
scoping work — don't remove that wrapper.

Design tokens, for reference:

| Token             | Value     | Use                       |
| ----------------- | --------- | ------------------------- |
| `--ink`           | `#150F1A` | Near-black base           |
| `--bone`          | `#F6EFE4` | Light sections, body text |
| `--ruby`          | `#B0142F` | Primary buttons, accents  |
| `--champagne`     | `#CBA35C` | Gold detail, eyebrows     |
| `--font-display`  | Fraunces  | Headlines                 |
| `--font-body`     | Manrope   | Body copy                 |
| `--font-mono`     | Space Mono| Prices, labels, eyebrows  |

### About `src/pages/scripts/`

The prototype pages were plain HTML with inline `<script>` blocks. Those were
extracted into `init()` functions that each page calls once on mount:

```js
useEffect(() => init(), []);
```

They still manipulate the DOM directly (`getElementById`, `classList.toggle`)
rather than using React state. That's deliberate for this preview build — it
keeps the port faithful, and it works. It is also the first thing to refactor
when this becomes a real store. Specifically:

- `cart.js` removes DOM nodes React doesn't know about. Fine while the cart is
  static; must become state before the cart is real.
- `custom.js` holds wizard answers in a local object. Move to `useState` /
  `useReducer` when the form starts POSTing somewhere.

`<React.StrictMode>` is intentionally off in `main.jsx` because it double-invokes
effects in development, which would attach every one of these listeners twice.
Turn it back on once the pages use real state.

---

## Before this goes live

**Content that is invented and needs Dianna's sign-off:**

- `src/data/reviews.js` — every review is placeholder. Not one is real.
  Replace with actual Etsy reviews, Instagram comments, or saved texts.
- Home page testimonials (the "Wall of Love" cards) — same, and the copy on the
  page currently says so.
- The About page pull-quote — written in her voice, not something she said.
- Custom Kreation FAQ answers (deposit terms, rush fees, turnaround) — these
  were written to sound plausible. Confirm the real policy.

**Still to build:**

- Backend for the custom-order form. Right now submitting shows the confirmation
  screen client-side and nothing is sent anywhere. Cheapest real version:
  Netlify Forms, or a Formspree endpoint that emails her.
- Real cart/checkout (Stripe or Shopify Lite). The current checkout is a mockup.
- Product data. `Product.jsx` is one hardcoded item; a real catalog needs a data
  file or CMS behind `/shop` and `/product/:slug`.
- Search, account/order history, contact and privacy pages from the original
  sitemap.

**Assets:**

- `kreation-02.jpg` and `kreation-04.jpg` have "Diamond Girl" and "Unicorn"
  burned into them as white watermark text. Worth re-exporting from the
  originals.
- The About page founder photo is still a "DB" monogram placeholder. A real
  photo of Dianna will do more for trust than anything else on that page.

**One legal note carried over from the design phase:** an older product photo
showed a Crocs pair with a Louis Vuitton monogram patch and logo charm set into
it. That photo is not in this project and should stay out. Selling customs that
apply another brand's logo is trademark exposure, separate from anything about
the site.

---

## Deploying to Netlify

`netlify.toml` and `public/_redirects` are already configured:

- build command `npm run build`, publish directory `dist`
- a catch-all redirect to `/index.html` so `/shop` doesn't 404 on a hard refresh

Connect the repo in Netlify and it should build with no further settings.
