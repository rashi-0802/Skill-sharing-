import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Zap, Star } from 'lucide-react';
import './PowerLevelMeter.css';

/**
 * PowerLevelMeter
 * Shows proficiency level (Beginner / Intermediate / Advanced) as an authentic anime
 * power meter with 1-3 lightning bolts or stars that fill in sequence when visible.
 */
const PowerLevelMeter = ({
  level = 'Beginner',
  className = '',
  iconType = 'bolt'
}) => {
  const shouldReduceMotion = useReducedMotion();
  const lvlLower = (level || '').toLowerCase();

  let filledCount = 1;
  if (lvlLower.includes('adv') || lvlLower.includes('master')) {
    filledCount = 3;
  } else if (lvlLower.includes('inter')) {
    filledCount = 2;
  } else if (lvlLower.includes('none')) {
    filledCount = 0;
  } else {
    filledCount = 1;
  }

  const IconComp = iconType === 'star' ? Star : Zap;

  return (
    <div
      className={`power-level-meter ${className}`}
      title={`Power Level: ${level} (${filledCount}/3)`}
    >
      <span className="power-level-label">{level}</span>
      <div className="power-level-bolts" aria-hidden="true">
        {[1, 2, 3].map((step, idx) => {
          const isFilled = step <= filledCount;
          return (
            <motion.span
              key={step}
              className={`bolt-icon-wrap ${isFilled ? 'bolt-filled' : 'bolt-empty'}`}
              initial={shouldReduceMotion ? { scale: 1 } : { scale: 0.4, opacity: 0 }}
              whileInView={shouldReduceMotion ? { scale: 1 } : { scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{
                type: 'spring',
                stiffness: 450,
                damping: 14,
                delay: shouldReduceMotion ? 0 : idx * 0.12
              }}
            >
              <IconComp
                size={12}
                className={isFilled ? 'bolt-svg-filled' : 'bolt-svg-empty'}
              />
            </motion.span>
          );
        })}
      </div>
    </div>
  );
};

export default PowerLevelMeter;
