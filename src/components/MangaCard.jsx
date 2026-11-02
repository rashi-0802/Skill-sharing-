import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import './MangaCard.css';

/**
 * Reusable MangaCard wrapper:
 * - White surface, 3px ink outline, hard offset shadow
 * - Alternating slight tilt (-1° to 1°)
 * - On hover: straightens (0°), lifts (translateY -4px), shadow grows
 * - Pops into view with stagger whileInView (once): scale from 0.9 with a bounce
 * - Optional category accent color top strip or corner tag
 * - Optional isDashed flag for learning request cards
 */
const MangaCard = ({
  children,
  className = '',
  index = 0,
  accentColor = null,
  cornerLabel = null,
  isDashed = false,
  style = {},
  ...props
}) => {
  const shouldReduceMotion = useReducedMotion();
  const baseTilt = index % 2 === 0 ? -1 : 1;
  const isClickable = Boolean(props.onClick);

  return (
    <motion.div
      className={`manga-card-wrapper ${isDashed ? 'manga-card-dashed' : ''} ${isClickable ? 'manga-card-clickable' : ''} ${className}`}
      initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.9, y: 16 }}
      whileInView={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true, margin: '-25px' }}
      transition={{
        type: 'spring',
        stiffness: 350,
        damping: 18,
        delay: shouldReduceMotion ? 0 : (index % 6) * 0.08
      }}
      whileHover={
        shouldReduceMotion
          ? {}
          : {
              rotate: 0,
              y: -4,
              boxShadow: '8px 8px 0 #1A1A2E',
              transition: { duration: 0.16 }
            }
      }
      style={{
        rotate: shouldReduceMotion ? 0 : baseTilt,
        ...style
      }}
      {...props}
    >
      {accentColor && (
        <div
          className="manga-card-accent-strip"
          style={{ backgroundColor: accentColor }}
          aria-hidden="true"
        />
      )}
      {cornerLabel && accentColor && (
        <div
          className="manga-corner-tag"
          style={{ backgroundColor: accentColor }}
          aria-hidden="true"
        >
          {cornerLabel}
        </div>
      )}
      {children}
    </motion.div>
  );
};

export default MangaCard;
