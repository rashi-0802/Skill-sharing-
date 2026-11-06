import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import AnimatedCounter from './AnimatedCounter.jsx';
import './ComicBurstBadge.css';

/**
 * ComicBurstBadge Component
 * Displays a match score or percentage inside an anime/manga comic explosion burst
 * that scales in with a spring bounce and counts up from 0 using AnimatedCounter.
 * Respects prefers-reduced-motion.
 */
export default function ComicBurstBadge({
  score,
  suffix = '% Match',
  prefix = '',
  delay = 0.15,
  title = 'Skill & schedule compatibility match',
  className = ''
}) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      className={`comic-burst-badge-wrapper ${className}`}
      title={title}
      initial={shouldReduceMotion ? { opacity: 0 } : { scale: 0, rotate: -12 }}
      animate={shouldReduceMotion ? { opacity: 1 } : { scale: 1, rotate: 0 }}
      transition={
        shouldReduceMotion
          ? { duration: 0.2 }
          : {
              type: 'spring',
              stiffness: 420,
              damping: 14,
              delay
            }
      }
    >
      {/* 14-Point Manga Comic Explosion Star Burst SVG */}
      <svg
        className="comic-burst-svg"
        viewBox="0 0 120 46"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {/* Shadow path offset */}
        <path
          d="M 6,23 L 14,13 L 26,16 L 35,6 L 50,11 L 64,5 L 78,11 L 93,6 L 102,15 L 114,12 L 112,23 L 118,31 L 106,37 L 97,42 L 82,38 L 68,43 L 53,38 L 38,43 L 28,37 L 16,40 L 11,31 Z"
          fill="#1A1A2E"
          transform="translate(3, 3)"
        />
        {/* Main Burst Surface (Sunrise Yellow with Ink Outline) */}
        <path
          d="M 6,23 L 14,13 L 26,16 L 35,6 L 50,11 L 64,5 L 78,11 L 93,6 L 102,15 L 114,12 L 112,23 L 118,31 L 106,37 L 97,42 L 82,38 L 68,43 L 53,38 L 38,43 L 28,37 L 16,40 L 11,31 Z"
          fill="#FFD23F"
          stroke="#1A1A2E"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
      </svg>

      {/* Content overlay centered inside the comic burst */}
      <div className="comic-burst-content">
        <Sparkles size={13} className="comic-burst-sparkle-icon" />
        <span className="comic-burst-value">
          <AnimatedCounter
            value={score}
            duration={850}
            prefix={prefix}
            suffix={suffix}
          />
        </span>
      </div>
    </motion.div>
  );
}
