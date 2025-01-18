import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import App from './App';
import BinsManagement from './components/BinsManagement';
import RouteOptimization from './components/RouteOptimization';
import Analytics from './components/Analytics';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/bins" element={<BinsManagement />} />
        <Route path="/routes" element={<RouteOptimization />} />
        <Route path="/analytics" element={<Analytics />} />
      </Routes>
    </Router>
  </StrictMode>
);