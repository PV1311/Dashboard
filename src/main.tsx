import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import App from './App';
import BinsManagement from './components/BinsManagement';
import RouteOptimization from './components/RouteOptimization';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/bins" element={<BinsManagement />} />
        <Route path="/routes" element={<RouteOptimization />} />
      </Routes>
    </Router>
  </StrictMode>
);