import React, { useState, useEffect } from 'react';
import './ScrollProgressBar.css';

/**
 * ScrollProgressBar Component
 * Fixed at the very top of the viewport:
 * - 6px thick
 * - Ink outline
 * - Filled with a pink-to-blue gradient (#FF8FB1 -> #3A86FF)
 * - 60fps scroll tracking via requestAnimationFrame
 * - Respects prefers-reduced-motion
 */
export default function ScrollProgressBar() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    let ticking = false;

    const updateScrollProgress = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
      setScrollProgress(Math.min(100, Math.max(0, progress)));
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(updateScrollProgress);
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    updateScrollProgress();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="scroll-progress-track" aria-hidden="true">
      <div
        className="scroll-progress-fill"
        style={{ transform: `scaleX(${scrollProgress / 100})` }}
      />
    </div>
  );
}
