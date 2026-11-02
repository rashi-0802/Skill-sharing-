import React, { useState, useEffect, useRef, memo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { X, Sparkles, ArrowRight, Star } from 'lucide-react';
import AnimatedCounter from './AnimatedCounter.jsx';
import TeamUpLine from './TeamUpLine.jsx';
import AnimeIdChip from './AnimeIdChip.jsx';
import { getOrAssignTeacherCourse, buildLearningId } from '../utils/idEngine.js';
import './MatchFoundAnimation.css';

/**
 * 3 Demo Pairs for Inline Landing Page Showcase (loops every 8s)
 */
export const DEMO_PAIRS = [
  {
    teacherName: 'Aarav',
    learnerName: 'Meera',
    teacherSkill: 'Python',
    learnerSkill: 'Python',
    score: 96
  },
  {
    teacherName: 'Kabir',
    learnerName: 'Anaya',
    teacherSkill: 'UI Design',
    learnerSkill: 'UI Design',
    score: 92
  },
  {
    teacherName: 'Rohan',
    learnerName: 'Isha',
    teacherSkill: 'Guitar',
    learnerSkill: 'Guitar',
    score: 88
  }
];

/**
 * Original Chibi Student Character: Teacher (Blue Outfit, Skill Badge)
 */
export function ChibiTeacher({ stage, shouldReduceMotion }) {
  // Animation states according to 3.5s sequence
  // a) 0.0-0.6s: slide in from left with bounce
  // b) 0.6-1.2s: lean toward center
  // c) 1.2-1.8s: handshake clasp
  // d) 1.8-2.6s: hold
  // e) 2.6-3.5s: happy bounce
  return (
    <motion.div
      className="match-chibi-wrap match-chibi-teacher"
      initial={shouldReduceMotion ? { x: 0, opacity: 1 } : { x: -140, opacity: 0 }}
      animate={
        shouldReduceMotion
          ? { x: 0, opacity: 1 }
          : stage === 0
          ? { x: 0, opacity: 1 }
          : stage === 1
          ? { x: 18, rotate: 6 } // lean towards center
          : stage === 2 || stage === 3
          ? { x: 22, rotate: 4 } // hold at handshake
          : { x: 22, y: [0, -9, 0], rotate: [4, 6, 4] } // stage 4: happy bounce
      }
      transition={
        shouldReduceMotion
          ? { duration: 0.1 }
          : stage === 0
          ? { type: 'spring', stiffness: 320, damping: 18 }
          : stage === 1
          ? { duration: 0.5, ease: 'easeOut' }
          : stage === 4
          ? { duration: 0.6, repeat: 1, ease: 'easeInOut' }
          : { duration: 0.3 }
      }
    >
      <svg
        viewBox="0 0 120 160"
        className="match-chibi-svg"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {/* Shadow */}
        <ellipse cx="60" cy="154" rx="34" ry="6" fill="#1A1A2E" opacity="0.25" />

        {/* Body & Blue Hoodie/Outfit */}
        <path
          d="M 38,102 Q 32,142 38,146 L 82,146 Q 88,142 82,102 Z"
          fill="#3A86FF"
          stroke="#1A1A2E"
          strokeWidth="3.5"
          strokeLinejoin="round"
        />

        {/* White Collar / Shirt Insert */}
        <path
          d="M 52,102 L 60,116 L 68,102 Z"
          fill="#ffffff"
          stroke="#1A1A2E"
          strokeWidth="2.5"
        />

        {/* Skill Badge on Chest: Code < > symbol */}
        <circle cx="72" cy="120" r="8" fill="#FFD23F" stroke="#1A1A2E" strokeWidth="2" />
        <path
          d="M 69,118 L 67,120 L 69,122 M 75,118 L 77,120 L 75,122"
          stroke="#1A1A2E"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Right Arm Extending to Handshake */}
        <path
          d="M 76,108 Q 96,114 104,118"
          stroke="#3A86FF"
          strokeWidth="12"
          strokeLinecap="round"
        />
        <path
          d="M 76,108 Q 96,114 104,118"
          stroke="#1A1A2E"
          strokeWidth="3.5"
          fill="none"
          strokeLinecap="round"
        />
        {/* Hand sleeve cuff */}
        <circle cx="104" cy="118" r="6" fill="#FFE0BD" stroke="#1A1A2E" strokeWidth="2.5" />

        {/* Chibi Head */}
        <circle
          cx="60"
          cy="64"
          r="38"
          fill="#FFE0BD"
          stroke="#1A1A2E"
          strokeWidth="3.5"
        />

        {/* Spiky Anime Hair (Dark Ink) */}
        <path
          d="M 24,62 C 22,34 40,24 60,24 C 80,24 98,34 96,62 C 94,48 88,40 76,38 C 72,42 66,36 58,38 C 48,36 34,44 24,62 Z"
          fill="#1A1A2E"
        />
        {/* Hair Strands */}
        <path
          d="M 40,32 Q 46,18 56,22 Q 50,30 46,38"
          fill="#1A1A2E"
        />
        <path
          d="M 64,22 Q 74,16 80,26 Q 74,32 68,36"
          fill="#1A1A2E"
        />

        {/* Eyes: Cheerful Anime Oval Eyes with White Highlights */}
        <ellipse cx="48" cy="66" rx="5.5" ry="7.5" fill="#1A1A2E" />
        <circle cx="46" cy="63" r="2.2" fill="#ffffff" />
        <ellipse cx="72" cy="66" rx="5.5" ry="7.5" fill="#1A1A2E" />
        <circle cx="70" cy="63" r="2.2" fill="#ffffff" />

        {/* Rosy Anime Cheeks */}
        <ellipse cx="40" cy="74" rx="5" ry="3" fill="#FF8FB1" opacity="0.8" />
        <ellipse cx="80" cy="74" rx="5" ry="3" fill="#FF8FB1" opacity="0.8" />

        {/* Joyful Smile */}
        <path
          d="M 54,76 Q 60,82 66,76"
          stroke="#1A1A2E"
          strokeWidth="2.8"
          strokeLinecap="round"
          fill="none"
        />
      </svg>
    </motion.div>
  );
}

/**
 * Original Chibi Student Character: Learner (Pink Outfit, Notebook)
 */
export function ChibiLearner({ stage, shouldReduceMotion }) {
  return (
    <motion.div
      className="match-chibi-wrap match-chibi-learner"
      initial={shouldReduceMotion ? { x: 0, opacity: 1 } : { x: 140, opacity: 0 }}
      animate={
        shouldReduceMotion
          ? { x: 0, opacity: 1 }
          : stage === 0
          ? { x: 0, opacity: 1 }
          : stage === 1
          ? { x: -18, rotate: -6 } // lean towards center
          : stage === 2 || stage === 3
          ? { x: -22, rotate: -4 } // hold at handshake
          : { x: -22, y: [0, -9, 0], rotate: [-4, -6, -4] } // stage 4: happy bounce
      }
      transition={
        shouldReduceMotion
          ? { duration: 0.1 }
          : stage === 0
          ? { type: 'spring', stiffness: 320, damping: 18 }
          : stage === 1
          ? { duration: 0.5, ease: 'easeOut' }
          : stage === 4
          ? { duration: 0.6, repeat: 1, ease: 'easeInOut' }
          : { duration: 0.3 }
      }
    >
      <svg
        viewBox="0 0 120 160"
        className="match-chibi-svg"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {/* Shadow */}
        <ellipse cx="60" cy="154" rx="34" ry="6" fill="#1A1A2E" opacity="0.25" />

        {/* Body & Pink Outfit / Dress */}
        <path
          d="M 38,102 Q 30,142 36,146 L 84,146 Q 90,142 82,102 Z"
          fill="#FF8FB1"
          stroke="#1A1A2E"
          strokeWidth="3.5"
          strokeLinejoin="round"
        />

        {/* Student Notebook held in left hand */}
        <rect
          x="26"
          y="114"
          width="18"
          height="24"
          rx="3"
          fill="#ffffff"
          stroke="#1A1A2E"
          strokeWidth="2.5"
          transform="rotate(12 26 114)"
        />
        <line x1="31" y1="122" x2="41" y2="124" stroke="#FF8FB1" strokeWidth="2" />
        <line x1="32" y1="128" x2="40" y2="130" stroke="#FF8FB1" strokeWidth="2" />

        {/* Left Arm Extending to Handshake */}
        <path
          d="M 44,108 Q 24,114 16,118"
          stroke="#FF8FB1"
          strokeWidth="12"
          strokeLinecap="round"
        />
        <path
          d="M 44,108 Q 24,114 16,118"
          stroke="#1A1A2E"
          strokeWidth="3.5"
          fill="none"
          strokeLinecap="round"
        />
        {/* Hand sleeve cuff */}
        <circle cx="16" cy="118" r="6" fill="#FFE0BD" stroke="#1A1A2E" strokeWidth="2.5" />

        {/* Chibi Head */}
        <circle
          cx="60"
          cy="64"
          r="38"
          fill="#FFE0BD"
          stroke="#1A1A2E"
          strokeWidth="3.5"
        />

        {/* Anime Hair with Side Twin Bobs / Pigtails */}
        <path
          d="M 22,64 C 20,32 40,22 60,22 C 80,22 100,32 98,64 C 94,46 84,38 72,36 C 68,40 60,34 52,36 C 40,36 28,46 22,64 Z"
          fill="#1A1A2E"
        />
        {/* Cute side hair strands */}
        <path
          d="M 22,64 Q 14,82 18,94 Q 24,84 26,72 Z"
          fill="#1A1A2E"
        />
        <path
          d="M 98,64 Q 106,82 102,94 Q 96,84 94,72 Z"
          fill="#1A1A2E"
        />

        {/* Eyes: Anime Joyful Crescent Arches ( ^ _ ^ ) */}
        <path
          d="M 44,68 Q 50,60 56,68"
          stroke="#1A1A2E"
          strokeWidth="3.2"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M 64,68 Q 70,60 76,68"
          stroke="#1A1A2E"
          strokeWidth="3.2"
          strokeLinecap="round"
          fill="none"
        />

        {/* Rosy Anime Cheeks */}
        <ellipse cx="42" cy="74" rx="5" ry="3" fill="#FF8FB1" opacity="0.8" />
        <ellipse cx="78" cy="74" rx="5" ry="3" fill="#FF8FB1" opacity="0.8" />

        {/* Excited Open Smile with Pink Tongue */}
        <path
          d="M 54,76 Q 60,86 66,76 Z"
          fill="#FF4D6D"
          stroke="#1A1A2E"
          strokeWidth="2.5"
        />
      </svg>
    </motion.div>
  );
}

/**
 * Handshake Clasp Component (Center Contact Point)
 */
export function HandshakeClasp({ stage, shouldReduceMotion }) {
  if (stage < 2 && !shouldReduceMotion) return null;

  return (
    <motion.div
      className="match-handshake-clasp"
      initial={shouldReduceMotion ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
      animate={
        shouldReduceMotion
          ? { scale: 1, opacity: 1 }
          : {
              scale: [0, 1.35, 0.9, 1],
              opacity: 1
            }
      }
      transition={{ duration: 0.38, ease: 'easeOut' }}
    >
      <svg
        viewBox="0 0 80 60"
        className="match-handshake-svg"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {/* Left hand (Blue Cuff) */}
        <path
          d="M 10,38 L 26,38 Q 38,38 42,32 L 48,32"
          stroke="#3A86FF"
          strokeWidth="10"
          strokeLinecap="round"
        />
        <path
          d="M 10,38 L 26,38 Q 38,38 42,32 L 48,32"
          stroke="#1A1A2E"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
        />

        {/* Right hand (Pink Cuff) */}
        <path
          d="M 70,38 L 54,38 Q 42,38 38,32 L 32,32"
          stroke="#FF8FB1"
          strokeWidth="10"
          strokeLinecap="round"
        />
        <path
          d="M 70,38 L 54,38 Q 42,38 38,32 L 32,32"
          stroke="#1A1A2E"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
        />

        {/* Clasping Fingers Interlocked */}
        <path
          d="M 34,26 Q 40,20 46,26 Q 48,34 40,40 Q 32,34 34,26 Z"
          fill="#FFE0BD"
          stroke="#1A1A2E"
          strokeWidth="2.8"
          strokeLinejoin="round"
        />
        {/* Finger crease detail */}
        <line x1="38" y1="28" x2="42" y2="34" stroke="#1A1A2E" strokeWidth="1.8" strokeLinecap="round" />

        {/* Golden Energy Spark on clasp */}
        <polygon
          points="40,16 43,24 51,24 44,29 47,37 40,32 33,37 36,29 29,24 37,24"
          fill="#FFD23F"
          stroke="#1A1A2E"
          strokeWidth="1.5"
        />
      </svg>
    </motion.div>
  );
}

/**
 * Comic Starburst SVG Background
 */
export function ComicBurst({ stage, shouldReduceMotion }) {
  if (stage < 3 && !shouldReduceMotion) return null;

  return (
    <motion.svg
      viewBox="0 0 300 300"
      className="match-comic-burst-svg"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      initial={shouldReduceMotion ? { scale: 1, opacity: 1 } : { scale: 0, rotate: -25, opacity: 0 }}
      animate={
        shouldReduceMotion
          ? { scale: 1, opacity: 1 }
          : { scale: 1, rotate: 0, opacity: 1 }
      }
      transition={{ type: 'spring', stiffness: 350, damping: 14 }}
      aria-hidden="true"
    >
      {/* 16-point sharp comic manga burst */}
      <polygon
        points="
          150,15 168,68 220,38 205,92 265,90 228,132 285,160 228,188 265,230 
          205,228 220,282 168,252 150,305 132,252 80,282 95,228 35,230 
          72,188 15,160 72,132 35,90 95,92 80,38 132,68
        "
        fill="#FFD23F"
        stroke="#1A1A2E"
        strokeWidth="4"
        strokeLinejoin="round"
      />
      {/* Inner Highlight Star */}
      <polygon
        points="
          150,45 162,88 200,65 190,105 235,105 208,138 250,160 208,182 235,215 
          190,215 200,255 162,232 150,275 138,232 100,255 110,215 65,215 
          92,182 50,160 92,138 65,105 110,105 100,65 138,88
        "
        fill="#FFF9E6"
        stroke="#1A1A2E"
        strokeWidth="2.5"
      />
    </motion.svg>
  );
}

/**
 * Radiating Speed Lines
 */
export function SpeedLines({ stage, shouldReduceMotion }) {
  if (stage < 3 || shouldReduceMotion) return null;

  return (
    <motion.svg
      viewBox="0 0 400 400"
      className="match-speed-lines-svg"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: [0, 0.7, 0.45], scale: [0.8, 1.05, 1] }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      aria-hidden="true"
    >
      {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg, i) => (
        <line
          key={i}
          x1="200"
          y1="200"
          x2={200 + Math.cos((deg * Math.PI) / 180) * 195}
          y2={200 + Math.sin((deg * Math.PI) / 180) * 195}
          stroke="#1A1A2E"
          strokeWidth={i % 2 === 0 ? "2.5" : "1.5"}
          strokeDasharray="18 10"
        />
      ))}
    </motion.svg>
  );
}

/**
 * 10 Sparkles & 4-Point Stars
 */
export function BurstSparkles({ stage, shouldReduceMotion }) {
  if (stage < 3 || shouldReduceMotion) return null;

  const sparkles = [
    { id: 1, x: '24%', y: '26%', color: '#FFD23F', size: 16, delay: 0 },
    { id: 2, x: '76%', y: '24%', color: '#3A86FF', size: 18, delay: 0.05 },
    { id: 3, x: '18%', y: '48%', color: '#FF8FB1', size: 14, delay: 0.08 },
    { id: 4, x: '82%', y: '50%', color: '#2EC4B6', size: 16, delay: 0.03 },
    { id: 5, x: '35%', y: '16%', color: '#FF4D6D', size: 12, delay: 0.1 },
    { id: 6, x: '65%', y: '15%', color: '#FFD23F', size: 15, delay: 0.06 },
    { id: 7, x: '50%', y: '84%', color: '#3A86FF', size: 14, delay: 0.12 },
    { id: 8, x: '28%', y: '78%', color: '#FF8FB1', size: 12, delay: 0.09 },
    { id: 9, x: '72%', y: '76%', color: '#FFD23F', size: 16, delay: 0.04 },
    { id: 10, x: '48%', y: '12%', color: '#2EC4B6', size: 15, delay: 0.07 }
  ];

  return (
    <>
      {sparkles.map((sp) => (
        <motion.div
          key={sp.id}
          className="match-sparkle-star"
          style={{
            left: sp.x,
            top: sp.y,
            color: sp.color,
            fontSize: `${sp.size}px`
          }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{
            scale: [0, 1.4, 1],
            opacity: [0, 1, 0.85],
            y: [0, -6, 0]
          }}
          transition={{ duration: 0.55, delay: sp.delay, ease: 'easeOut' }}
          aria-hidden="true"
        >
          ✦
        </motion.div>
      ))}
    </>
  );
}

/**
 * Main Reusable Component: <MatchFoundAnimation />
 * Supports:
 * - mode="modal" (default for real match events in app, popup with backdrop, auto-close, accessible focus trap)
 * - mode="inline" (for landing page showcase, loops every 8s, pauses on hidden tab or off-screen)
 */
function MatchFoundAnimationComponent({
  isOpen = true,
  onClose = () => {},
  mode = 'modal',
  teacherName = 'Aarav',
  learnerName = 'Meera',
  teacherSkill = 'Python',
  learnerSkill = 'Python',
  score = 92
}) {
  const shouldReduceMotion = useReducedMotion();
  const [activePairIndex, setActivePairIndex] = useState(0);
  const [stage, setStage] = useState(shouldReduceMotion ? 4 : 0);
  const [screenPulse, setScreenPulse] = useState(false);
  const containerRef = useRef(null);
  const dialogRef = useRef(null);
  const continueBtnRef = useRef(null);
  const previouslyFocusedElementRef = useRef(null);
  const isTabVisibleRef = useRef(true);
  const isInViewportRef = useRef(true);

  // If in inline mode, allow cycling through the 3 demo pairs
  const currentPair =
    mode === 'inline'
      ? DEMO_PAIRS[activePairIndex % DEMO_PAIRS.length]
      : {
          teacherName,
          learnerName,
          teacherSkill,
          learnerSkill,
          score
        };

  const normTeacher = (currentPair.teacherName || '').toLowerCase();
  const normLearner = (currentPair.learnerName || '').toLowerCase();
  const teacherStuId = normTeacher.includes('vidhi') ? 'STU001' : normTeacher.includes('rashi') ? 'STU002' : normTeacher.includes('devansh') ? 'STU004' : normTeacher.includes('riya') ? 'STU003' : normTeacher.includes('kavita') ? 'STU005' : 'STU006';
  const learnerStuId = normLearner.includes('vidhi') ? 'STU001' : normLearner.includes('aarav') ? 'STU006' : normLearner.includes('tanya') ? 'STU007' : 'STU007';
  const teacherTcrId = getOrAssignTeacherCourse(teacherStuId, currentPair.teacherSkill || 'Skill');
  const learnerLrnId = buildLearningId(learnerStuId, teacherTcrId);

  // Lock body scroll while modal is open, ensure dialog is scrolled to top, and focus with preventScroll
  useEffect(() => {
    if (mode === 'modal' && isOpen) {
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';

      if (dialogRef.current) {
        dialogRef.current.scrollTop = 0;
      }

      previouslyFocusedElementRef.current = document.activeElement;
      if (continueBtnRef.current) {
        continueBtnRef.current.focus({ preventScroll: true });
      }

      return () => {
        document.body.style.overflow = prevOverflow;
        if (previouslyFocusedElementRef.current) {
          previouslyFocusedElementRef.current.focus?.({ preventScroll: true });
        }
      };
    }
  }, [mode, isOpen]);

  // Handle Escape key to close modal
  useEffect(() => {
    if (mode !== 'modal' || !isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mode, isOpen, onClose]);

  // Track document visibility to pause loop when tab is hidden
  useEffect(() => {
    const handleVisibilityChange = () => {
      isTabVisibleRef.current = !document.hidden;
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  // IntersectionObserver for inline mode (starts when scrolled into view, pauses when off-screen)
  useEffect(() => {
    if (mode !== 'inline' || !containerRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        isInViewportRef.current = entry.isIntersecting;
      },
      { threshold: 0.25 }
    );

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [mode]);

  // Core Animation Sequence Controller (3.5s total duration)
  // Stage 0: 0.0-0.6s -> slide in with bounce
  // Stage 1: 0.6-1.2s -> lean toward center, energy line connects
  // Stage 2: 1.2-1.8s -> hands meet in handshake, screen pulse
  // Stage 3: 1.8-2.6s -> comic burst scales in, speed lines radiate, "MATCH FOUND!" slams in
  // Stage 4: 2.6-3.5s -> score counts up, happy bounce
  useEffect(() => {
    if (!isOpen) return;
    if (shouldReduceMotion) {
      setStage(4);
      return;
    }

    setStage(0);
    setScreenPulse(false);

    // Timers
    const t1 = setTimeout(() => setStage(1), 600);
    const t2 = setTimeout(() => {
      setStage(2);
      setScreenPulse(true);
      setTimeout(() => setScreenPulse(false), 450);
    }, 1200);
    const t3 = setTimeout(() => setStage(3), 1800);
    const t4 = setTimeout(() => setStage(4), 2600);

    // Modal mode: Auto-close after 3.5s + 1.5s = 5.0s
    let autoCloseTimer;
    if (mode === 'modal') {
      autoCloseTimer = setTimeout(() => {
        onClose();
      }, 5000);
    }

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      if (autoCloseTimer) clearTimeout(autoCloseTimer);
    };
  }, [isOpen, activePairIndex, mode, shouldReduceMotion, onClose]);

  // Inline mode: Loop every 8s through demo pairs when tab is visible and element in viewport
  useEffect(() => {
    if (mode !== 'inline' || shouldReduceMotion) return;

    const interval = setInterval(() => {
      if (isTabVisibleRef.current && isInViewportRef.current) {
        setActivePairIndex((prev) => (prev + 1) % DEMO_PAIRS.length);
      }
    }, 8000);

    return () => clearInterval(interval);
  }, [mode, shouldReduceMotion]);

  if (mode === 'modal' && !isOpen) return null;

  // The Inner Animated Stage Content
  const animationContent = (
    <div className="match-stage-viewport">
      {/* Halftone Texture */}
      <div className="match-stage-halftone" aria-hidden="true" />

      {/* Screen Contact Pulse on Handshake */}
      {screenPulse && !shouldReduceMotion && <div className="match-contact-pulse" aria-hidden="true" />}

      {/* Radiating Speed Lines & Comic Burst Background */}
      <SpeedLines stage={stage} shouldReduceMotion={shouldReduceMotion} />
      <ComicBurst stage={stage} shouldReduceMotion={shouldReduceMotion} />
      <BurstSparkles stage={stage} shouldReduceMotion={shouldReduceMotion} />

      {/* Title: "MATCH FOUND!" (Slams in at Stage 3) */}
      {(stage >= 3 || shouldReduceMotion) && (
        <motion.div
          className="match-found-title-wrap"
          initial={shouldReduceMotion ? { scale: 1, opacity: 1 } : { scale: 0, rotate: -6, opacity: 0 }}
          animate={
            shouldReduceMotion
              ? { scale: 1, opacity: 1 }
              : {
                  scale: [0, 1.25, 0.95, 1],
                  rotate: [-6, 3, -1, 0],
                  opacity: 1
                }
          }
          transition={{ duration: 0.42, ease: 'easeOut' }}
        >
          <h2 className="match-found-title">MATCH FOUND!</h2>
        </motion.div>
      )}

      {/* Speech Bubble: Teacher (Left) */}
      <motion.div
        className="match-bubble-wrap match-bubble-teacher"
        initial={shouldReduceMotion ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0, y: 15 }}
        animate={
          shouldReduceMotion
            ? { scale: 1, opacity: 1 }
            : { scale: 1, opacity: 1, y: 0 }
        }
        transition={{ duration: 0.35, delay: 0.15, type: 'spring' }}
      >
        <div className="match-speech-sticker flex flex-col gap-1">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="match-role-badge teacher">TEACH</span>
            <span>{currentPair.teacherName}: <strong>{currentPair.teacherSkill}</strong></span>
          </div>
          <div className="inline-flex mt-0.5">
            <AnimeIdChip
              id={teacherTcrId}
              type="TCR"
              size="sm"
              context={{
                peerName: currentPair.teacherName,
                skillName: currentPair.teacherSkill
              }}
            />
          </div>
        </div>
      </motion.div>

      {/* Energy connection line between bubbles in Stage 1+ */}
      {(stage >= 1 || shouldReduceMotion) && (
        <div className="match-bubble-energy-line" aria-hidden="true">
          <TeamUpLine width={120} height={28} delay={0.1} />
        </div>
      )}

      {/* Speech Bubble: Learner (Right) */}
      <motion.div
        className="match-bubble-wrap match-bubble-learner"
        initial={shouldReduceMotion ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0, y: 15 }}
        animate={
          shouldReduceMotion
            ? { scale: 1, opacity: 1 }
            : { scale: 1, opacity: 1, y: 0 }
        }
        transition={{ duration: 0.35, delay: 0.25, type: 'spring' }}
      >
        <div className="match-speech-sticker flex flex-col gap-1">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="match-role-badge learner">LEARN</span>
            <span>{currentPair.learnerName}: <strong>{currentPair.learnerSkill}</strong></span>
          </div>
          <div className="inline-flex mt-0.5">
            <AnimeIdChip
              id={learnerLrnId}
              type="LRN"
              size="sm"
              context={{
                learnerName: currentPair.learnerName,
                teacherName: currentPair.teacherName,
                skillName: currentPair.teacherSkill
              }}
            />
          </div>
        </div>
      </motion.div>

      {/* Chibi Teacher (Left) */}
      <ChibiTeacher stage={stage} shouldReduceMotion={shouldReduceMotion} />

      {/* Handshake Clasp (Center) */}
      <HandshakeClasp stage={stage} shouldReduceMotion={shouldReduceMotion} />

      {/* Chibi Learner (Right) */}
      <ChibiLearner stage={stage} shouldReduceMotion={shouldReduceMotion} />
    </div>
  );

  // Bottom Score Bar & Controls
  const bottomBar = (
    <div className="match-bottom-bar">
      {/* Match Score Pill (Counts up in Stage 4) */}
      <div className="match-score-pill">
        <span className="match-score-star">★</span>
        {stage >= 4 || shouldReduceMotion ? (
          <AnimatedCounter
            value={currentPair.score}
            duration={700}
            suffix="% Match"
            className="text-primary font-black"
          />
        ) : (
          <span className="text-slate-400 font-bold">Matching...</span>
        )}
        <span className="match-score-tag">Timetable &amp; Skill Aligned</span>
      </div>

      {mode === 'modal' && (
        <button
          ref={continueBtnRef}
          type="button"
          onClick={onClose}
          className="match-continue-btn"
        >
          <span>Continue</span>
          <ArrowRight size={16} />
        </button>
      )}
    </div>
  );

  // Screen reader polite announcement
  const matchAnnouncement = `Match found: ${currentPair.teacherName} teaches ${currentPair.teacherSkill} to ${currentPair.learnerName} with ${currentPair.score}% compatibility.`;

  // Render Inline Mode (Landing page showcase)
  if (mode === 'inline') {
    return (
      <div ref={containerRef} className="match-found-inline-container">
        {/* Live screen reader announcement */}
        <div className="sr-only" aria-live="polite">
          {matchAnnouncement}
        </div>

        <div className="flex items-center justify-between mb-2">
          <div className="match-showcase-kicker">
            <Sparkles size={13} className="text-secondary" />
            <span>4S Peer Handshake · Live Match Engine</span>
          </div>
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
            Pair {((activePairIndex % DEMO_PAIRS.length) + 1)} of {DEMO_PAIRS.length}
          </span>
        </div>

        {animationContent}
        {bottomBar}
      </div>
    );
  }

  // Render Modal Mode (Popup for real match events)
  return (
    <div
      className="match-found-modal-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Live screen reader announcement */}
      <div className="sr-only" aria-live="polite">
        {matchAnnouncement}
      </div>

      <div
        ref={dialogRef}
        className="match-found-modal-dialog"
        role="dialog"
        aria-modal="true"
        aria-label="Match found"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close X Button */}
        <button
          type="button"
          onClick={onClose}
          className="match-modal-close-btn"
          aria-label="Close match dialog"
        >
          <X size={18} />
        </button>

        {animationContent}
        {bottomBar}
      </div>
    </div>
  );
}

export default memo(MatchFoundAnimationComponent);
