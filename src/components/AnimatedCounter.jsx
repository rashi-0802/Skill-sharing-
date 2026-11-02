import React, { useEffect, useState, useRef } from 'react';

/**
 * AnimatedCounter component
 * Animates a numeric value from 0 to `value` using requestAnimationFrame
 * Supports suffix (e.g. "%" or "+") and prefix.
 * Respects prefers-reduced-motion.
 */
export default function AnimatedCounter({
  value,
  duration = 750,
  prefix = '',
  suffix = '',
  decimals = 0,
  className = ''
}) {
  const [displayValue, setDisplayValue] = useState(0);
  const target = Number(value) || 0;
  const startTimeRef = useRef(null);
  const animationFrameRef = useRef(null);

  useEffect(() => {
    // Check for user's reduced motion preference
    if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setDisplayValue(target);
      return;
    }

    const startValue = 0;
    const startTime = performance.now();
    startTimeRef.current = startTime;

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function: easeOutCubic (1 - (1 - progress)^3)
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const current = startValue + (target - startValue) * easeProgress;

      setDisplayValue(current);

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        setDisplayValue(target);
      }
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [target, duration]);

  const formatted = decimals > 0 ? displayValue.toFixed(decimals) : Math.round(displayValue);

  return (
    <span className={`tabular-nums ${className}`}>
      {prefix}{formatted}{suffix}
    </span>
  );
}
