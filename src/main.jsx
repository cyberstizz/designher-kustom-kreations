import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import './styles/global.css';

/* Note: no <React.StrictMode> on purpose.
   The ported page scripts in src/pages/scripts/ attach DOM event listeners
   inside useEffect. StrictMode intentionally double-invokes effects in dev,
   which would attach every listener twice. Once those pages are rewritten as
   real React state (see README), turn StrictMode back on. */
ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);