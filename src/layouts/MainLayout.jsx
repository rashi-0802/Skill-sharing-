import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import ScrollProgressBar from '../components/ScrollProgressBar.jsx';
import SparkleCursorTrail from '../components/SparkleCursorTrail.jsx';
import MangaPanelWipe from '../components/MangaPanelWipe.jsx';
import { useScrollToTop } from '../utils/useScrollToTop.js';

const MainLayout = () => {
  const location = useLocation();
  useScrollToTop();

  return (
    <div className="flex-col" style={{ minHeight: '100vh', position: 'relative' }}>
      {/* 6px Scroll Progress Bar with Ink Outline & Pink-to-Blue Gradient */}
      <ScrollProgressBar />

      {/* Desktop Star Sparkle Cursor Trail */}
      <SparkleCursorTrail />

      {/* Diagonal Manga Panel Slice Wipe on Route Transitions */}
      <MangaPanelWipe />

      <Navbar />

      <main key={location.pathname} className="page-transition-wrapper" style={{ flex: 1 }}>
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

export default MainLayout;
