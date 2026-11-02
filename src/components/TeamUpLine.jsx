import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import './TeamUpLine.css';

/**
 * TeamUpLine Component
 * Animates a bold ink-and-yellow lightning / energy line between two matched students.
 * Features:
 * - SVG stroke-dashoffset draw-across animation
 * - Bold ink outline with vibrant yellow energy core
 * - Short flash and spark particles at the connection endpoint
 * - Respects prefers-reduced-motion
 */
export default function TeamUpLine({
  className = '',
  width = 110,
  height = 36,
  delay = 0.25,
  animated = true
}) {
  const shouldReduceMotion = useReducedMotion();

  // Dynamic lightning path coordinates across the width
  const midY = height / 2;
  const pathD = `M 4,${midY} L ${width * 0.22},${midY} L ${width * 0.35},${midY - 7} L ${width * 0.5},${midY + 8} L ${width * 0.65},${midY - 6} L ${width * 0.78},${midY + 5} L ${width - 6},${midY}`;

  // End coordinates where spark bursts
  const endX = width - 6;
  const endY = midY;

  // Spark particle trajectory definitions
  const sparks = [
    { id: 1, angle: -45, dist: 14, size: 4 },
    { id: 2, angle: 15, dist: 16, size: 5 },
    { id: 3, angle: -80, dist: 12, size: 3.5 },
    { id: 4, angle: 65, dist: 13, size: 4 },
    { id: 5, angle: 135, dist: 11, size: 3 }
  ];

  return (
    <div
      className={`team-up-line-wrapper ${className}`}
      style={{ width: `${width}px`, height: `${height}px` }}
      aria-hidden="true"
    >
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="team-up-svg"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Energy Glow Filter */}
          <filter id="lightning-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          {/* Linear gradient for energetic core */}
          <linearGradient id="lightning-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3A86FF" />
            <stop offset="50%" stopColor="#FFD23F" />
            <stop offset="100%" stopColor="#FF4D6D" />
          </linearGradient>
        </defs>

        {/* 1. Thick Ink Backing Line (Manga Outline: 5px) */}
        <motion.path
          d={pathD}
          stroke="#1A1A2E"
          strokeWidth="5.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          initial={shouldReduceMotion ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={
            shouldReduceMotion
              ? { duration: 0.1 }
              : { duration: 0.55, delay, ease: [0.16, 1, 0.3, 1] }
          }
        />

        {/* 2. Vibrant Yellow Lightning Energy Core (3px) */}
        <motion.path
          d={pathD}
          stroke="#FFD23F"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          initial={shouldReduceMotion ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={
            shouldReduceMotion
              ? { duration: 0.1 }
              : { duration: 0.55, delay, ease: [0.16, 1, 0.3, 1] }
          }
        />

        {/* 3. Short Flash burst at the end point */}
        {!shouldReduceMotion && animated && (
          <motion.circle
            cx={endX}
            cy={endY}
            r="8"
            fill="#FFF9E6"
            stroke="#1A1A2E"
            strokeWidth="2"
            initial={{ scale: 0, opacity: 0 }}
            animate={{
              scale: [0, 1.8, 1, 0],
              opacity: [0, 1, 0.8, 0]
            }}
            transition={{
              duration: 0.4,
              delay: delay + 0.45,
              times: [0, 0.3, 0.7, 1],
              ease: "easeOut"
            }}
          />
        )}

        {/* 4. Small spark particles at the end */}
        {!shouldReduceMotion &&
          animated &&
          sparks.map((spark) => {
            const rad = (spark.angle * Math.PI) / 180;
            const targetX = endX + Math.cos(rad) * spark.dist;
            const targetY = endY + Math.sin(rad) * spark.dist;

            return (
              <motion.polygon
                key={spark.id}
                // Small 4-pointed diamond spark
                points={`
                  ${targetX},${targetY - spark.size} 
                  ${targetX + spark.size * 0.7},${targetY} 
                  ${targetX},${targetY + spark.size} 
                  ${targetX - spark.size * 0.7},${targetY}
                `}
                fill="#FFD23F"
                stroke="#1A1A2E"
                strokeWidth="1.2"
                initial={{ scale: 0, opacity: 0, x: 0, y: 0 }}
                animate={{
                  scale: [0, 1.4, 0],
                  opacity: [0, 1, 0],
                  x: [0, Math.cos(rad) * 4],
                  y: [0, Math.sin(rad) * 4]
                }}
                transition={{
                  duration: 0.5,
                  delay: delay + 0.48 + spark.id * 0.04,
                  ease: "easeOut"
                }}
              />
            );
          })}

        {/* 5. Start Anchor Bolt Dot */}
        <circle cx="4" cy={midY} r="3" fill="#FFD23F" stroke="#1A1A2E" strokeWidth="2" />
        {/* End Anchor Bolt Dot */}
        <circle cx={endX} cy={endY} r="3" fill="#FFD23F" stroke="#1A1A2E" strokeWidth="2" />
      </svg>
      <span className="teamup-energy-sfx">BZZT!</span>
    </div>
  );
}
