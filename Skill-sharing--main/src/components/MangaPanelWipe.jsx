import React, { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useReducedMotion } from 'framer-motion';
import { resetScrollToTop } from '../utils/useScrollToTop.js';
import './MangaPanelWipe.css';

/**
 * Triggers the Manga Panel Wipe programmatically on click
 */
export function triggerMangaPanelWipe() {
  if (typeof window !== 'undefined') {
    resetScrollToTop();
    window.dispatchEvent(new CustomEvent('manga-panel-wipe'));
  }
}

/**
 * MangaPanelWipe Component
 * Executes a buttery-smooth diagonal manga-panel slice wipe across the screen on route changes
 * and navigation clicks (Dashboard, Home, Explore Skills, Matches, Sessions, Availability, Messages).
 * Smooth 480ms duration with debounced execution to eliminate stutter.
 * Respects prefers-reduced-motion.
 */
export default function MangaPanelWipe() {
  const location = useLocation();
  const shouldReduceMotion = useReducedMotion();
  const [isWiping, setIsWiping] = useState(false);
  const [wipeKey, setWipeKey] = useState(0);
  const timerRef = useRef(null);
  const lastWipeTimeRef = useRef(0);
  const isInitialMount = useRef(true);

  const startWipe = () => {
    if (shouldReduceMotion) return;
    const now = Date.now();
    // Debounce duplicate triggers within 150ms (e.g., click event + route change in same interaction)
    if (now - lastWipeTimeRef.current < 150) {
      return;
    }
    lastWipeTimeRef.current = now;

    setWipeKey((prev) => prev + 1);
    setIsWiping(true);
    resetScrollToTop();

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      setIsWiping(false);
    }, 490);
  };

  // Trigger on route changes
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    startWipe();
  }, [location.pathname, location.search]);

  // Listen to programmatic click triggers
  useEffect(() => {
    const handleWipeEvent = () => {
      startWipe();
    };

    window.addEventListener('manga-panel-wipe', handleWipeEvent);
    return () => {
      window.removeEventListener('manga-panel-wipe', handleWipeEvent);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [shouldReduceMotion]);

  if (!isWiping || shouldReduceMotion) return null;

  return (
    <div key={wipeKey} className="manga-wipe-overlay" aria-hidden="true">
      <div className="manga-wipe-rotator">
        {/* Top diagonal manga ink panel */}
        <div className="manga-panel-half panel-top" />

        {/* Luminous action cutting blade */}
        <div className="manga-wipe-blade" />

        {/* Bottom diagonal electric blue manga panel */}
        <div className="manga-panel-half panel-bottom" />
      </div>

      {/* Luminous center spark */}
      <div className="manga-wipe-sparkle">✦</div>
    </div>
  );
}
