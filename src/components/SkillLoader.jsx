import React from 'react';
import './SkillLoader.css';

/**
 * SkillLoader Component
 * Replaces generic spinners with:
 * - A small spinning anime four-point star with 2px ink outline
 * - Three bouncing chibi dots underneath (electric blue, sunrise yellow, rose pink)
 * - Respects prefers-reduced-motion
 */
export default function SkillLoader({
  size = 'md',
  text = '',
  className = ''
}) {
  return (
    <div className={`skill-loader-wrapper size-${size} ${className}`} role="status" aria-label="Loading">
      {/* Spinning Anime Four-Point Star */}
      <div className="skill-star-spinner">
        <svg
          viewBox="0 0 40 40"
          className="skill-star-svg"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Four-Point Manga Star with Ink Outline */}
          <path
            d="M 20 2 Q 20 20 38 20 Q 20 20 20 38 Q 20 20 2 20 Q 20 20 20 2 Z"
            fill="#FFD23F"
            stroke="#1A1A2E"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          {/* Inner Highlight Star Accent */}
          <path
            d="M 20 10 Q 20 20 30 20 Q 20 20 20 30 Q 20 20 10 20 Q 20 20 20 10 Z"
            fill="#FFFFFF"
            opacity="0.8"
          />
        </svg>
      </div>

      {/* Bouncing Chibi Dots */}
      <div className="chibi-dots-row" aria-hidden="true">
        <span className="chibi-dot dot-1" />
        <span className="chibi-dot dot-2" />
        <span className="chibi-dot dot-3" />
      </div>

      {text && <span className="skill-loader-text">{text}</span>}
    </div>
  );
}
