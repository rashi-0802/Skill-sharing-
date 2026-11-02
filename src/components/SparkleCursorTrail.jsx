import React, { useEffect, useRef } from 'react';
import './SparkleCursorTrail.css';

/**
 * SparkleCursorTrail Component
 * Renders a small sparkle trail of 5 fading four-point diamond stars (✦)
 * following the mouse pointer.
 * - Desktop only (disabled on touch devices via pointer: coarse and hover: none)
 * - pointer-events: none
 * - 60fps RAF position interpolation
 * - Fully respects prefers-reduced-motion
 */
export default function SparkleCursorTrail() {
  const containerRef = useRef(null);

  useEffect(() => {
    // Check touch / coarse pointer
    const isTouch = window.matchMedia('(hover: none) and (pointer: coarse)').matches;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isTouch || prefersReducedMotion) return;

    const trailCount = 5;
    const dots = [];
    const container = containerRef.current;
    if (!container) return;

    // Create 5 trailing star elements
    for (let i = 0; i < trailCount; i++) {
      const el = document.createElement('div');
      el.className = 'cursor-sparkle-star';
      el.innerHTML = '✦';
      el.style.opacity = '0';
      container.appendChild(el);
      dots.push({
        el,
        x: -100,
        y: -100,
        targetX: -100,
        targetY: -100,
        scale: 1 - i * 0.15,
        baseOpacity: 0.85 - i * 0.15
      });
    }

    let mouseX = -100;
    let mouseY = -100;
    let isMoving = false;
    let animId = null;
    let idleTimeout = null;

    const onMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      isMoving = true;
      clearTimeout(idleTimeout);
      idleTimeout = setTimeout(() => {
        isMoving = false;
      }, 800);
    };

    window.addEventListener('pointermove', onMouseMove, { passive: true });

    // 60fps smooth spring follow loop
    const updateTrail = () => {
      let leadX = mouseX;
      let leadY = mouseY;

      for (let i = 0; i < dots.length; i++) {
        const dot = dots[i];
        // Interpolate toward previous dot
        dot.x += (leadX - dot.x) * (0.35 - i * 0.04);
        dot.y += (leadY - dot.y) * (0.35 - i * 0.04);

        if (dot.x > 0 && dot.y > 0) {
          const currentOpacity = isMoving ? dot.baseOpacity : 0;
          dot.el.style.transform = `translate3d(${dot.x}px, ${dot.y}px, 0) scale(${dot.scale})`;
          dot.el.style.opacity = currentOpacity.toString();
        }

        leadX = dot.x;
        leadY = dot.y;
      }

      animId = requestAnimationFrame(updateTrail);
    };

    animId = requestAnimationFrame(updateTrail);

    return () => {
      window.removeEventListener('pointermove', onMouseMove);
      if (animId) cancelAnimationFrame(animId);
      clearTimeout(idleTimeout);
      if (container) {
        container.innerHTML = '';
      }
    };
  }, []);

  return <div ref={containerRef} className="cursor-sparkle-container" aria-hidden="true" />;
}
