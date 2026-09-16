import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect, lazy, Suspense } from 'react';

import Home from './pages/Home.jsx';
import Shop from './pages/Shop.jsx';
import Product from './pages/Product.jsx';
import CustomKreation from './pages/CustomKreation.jsx';
import About from './pages/About.jsx';
import Reviews from './pages/Reviews.jsx';
import SignIn from './pages/SignIn.jsx';
import Account from './pages/Account.jsx';
import RequestDetail from './pages/RequestDetail.jsx';
import NotFound from './pages/NotFound.jsx';

// The admin UI ships to Dianna only; lazy so public visitors never download it.
const Admin = lazy(() => import('./pages/Admin.jsx'));

/**
 * Jump to the top on route change, or to the #anchor if the link has one.
 *
 * The hash is not always an anchor. Supabase returns a magic-link sign-in as
 * #access_token=...&refresh_token=..., which is a valid URL fragment and a
 * syntactically invalid CSS selector — passing it to querySelector throws,
 * and an exception here blanks the whole page before Supabase can read the
 * token. So only treat the hash as a selector when it actually looks like an
 * element id, and never let a bad one escape.
 */
const ANCHOR = /^#[A-Za-z][\w-]*$/;

function ScrollManager() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash && ANCHOR.test(hash)) {
      let el = null;
      try {
        el = document.querySelector(hash);
      } catch {
        el = null;
      }
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);
  return null;
}

export default function App() {
  return (
    <>
      <ScrollManager />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/product" element={<Product />} />
        <Route path="/product/:slug" element={<Product />} />
        <Route path="/custom" element={<CustomKreation />} />
        <Route path="/about" element={<About />} />
        <Route path="/reviews" element={<Reviews />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/account" element={<Account />} />
        <Route path="/account/:id" element={<RequestDetail />} />
        <Route
          path="/admin"
          element={
            <Suspense fallback={null}>
              <Admin />
            </Suspense>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}