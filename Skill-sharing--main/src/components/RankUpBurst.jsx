import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import './RankUpBurst.css';

/**
 * RankUpBurst Component
 * Anime/manga "Rank-Up" burst featuring radiating action lines and sparkling star particles
 * that play once when an unlocked badge appears.
 * Respects prefers-reduced-motion.
 */
export default function RankUpBurst({ delay = 0.2 }) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) return null;

  // 8 Radiating energy action rays
  const rays = [0, 45, 90, 135, 180, 225, 270, 315];

  // 6 Sparkle diamonds
  const sparkles = [
    { id: 1, x: 26, y: -26, size: 5, delay: 0.1 },
    { id: 2, x: -28, y: -22, size: 4, delay: 0.15 },
    { id: 3, x: 30, y: 18, size: 4.5, delay: 0.2 },
    { id: 4, x: -24, y: 24, size: 4, delay: 0.12 },
    { id: 5, x: 0, y: -34, size: 5, delay: 0.18 },
    { id: 6, x: 0, y: 34, size: 4, delay: 0.22 }
  ];

  return (
    <div className="rank-up-burst-container" aria-hidden="true">
      {/* Radiating Anime Action Rays SVG */}
      <svg
        viewBox="0 0 100 100"
        className="rank-up-rays-svg"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {rays.map((angle, i) => (
          <motion.line
            key={i}
            x1="50"
            y1="50"
            x2="50"
            y2="10"
            stroke="#FFD23F"
            strokeWidth="2.5"
            strokeLinecap="round"
            transform={`rotate(${angle} 50 50)`}
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{
              pathLength: [0, 1, 0],
              opacity: [0, 1, 0]
            }}
            transition={{
              duration: 0.65,
              delay: delay + i * 0.02,
              ease: 'easeOut'
            }}
          />
        ))}
      </svg>

      {/* Pop Sparkles */}
      {sparkles.map((sp) => (
        <motion.div
          key={sp.id}
          className="rank-up-sparkle-diamond"
          style={{ width: `${sp.size * 2}px`, height: `${sp.size * 2}px` }}
          initial={{ scale: 0, opacity: 0, x: 0, y: 0 }}
          animate={{
            scale: [0, 1.4, 0],
            opacity: [0, 1, 0],
            x: sp.x,
            y: sp.y
          }}
          transition={{
            duration: 0.6,
            delay: delay + sp.delay,
            ease: 'easeOut'
          }}
        />
      ))}

      {/* Manga Rank-Up Stamp SFX */}
      <motion.span
        className="rank-up-sfx-label"
        initial={{ scale: 0, opacity: 0, rotate: -15 }}
        animate={{ scale: 1, opacity: 0.9, rotate: -4 }}
        transition={{ delay: delay + 0.1, type: 'spring', stiffness: 450, damping: 15 }}
      >
        RANK UP!
      </motion.span>
    </div>
  );
}
