import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import {
  Sparkles,
  ArrowRight,
  Heart,
  Volume2,
  VolumeX,
  Star,
  CheckCircle2,
  Smile
} from 'lucide-react';
import MangaCard from './MangaCard.jsx';
import {
  ChibiTeacher,
  ChibiLearner,
  HandshakeClasp,
  ComicBurst,
  SpeedLines,
  BurstSparkles
} from './MatchFoundAnimation.jsx';
import { playMatchFoundChime, isSoundEnabled, toggleSound } from '../utils/soundUtil.js';
import './SkillBuddies.css';

const SKILL_MATCHES = [
  {
    id: 'python',
    skill: 'Python & Data',
    icon: '🐍',
    teacher: {
      name: 'Aarav',
      role: 'Teacher',
      dept: 'B.Tech CS · 3rd Year',
      quote: 'I teach Python, loops & DSA algorithms!',
      emote: '🔥 Let\'s Code!'
    },
    learner: {
      name: 'Meera',
      role: 'Learner',
      dept: 'Data Science · 2nd Year',
      quote: 'I want to master Python for my semester project!',
      emote: '✨ Excited!'
    },
    score: 98,
    sparkleColor: '#FFD23F'
  },
  {
    id: 'uiux',
    skill: 'UI/UX Design',
    icon: '🎨',
    teacher: {
      name: 'Kabir',
      role: 'Teacher',
      dept: 'Design Media · 4th Year',
      quote: 'Figma wireframes, color theory & design systems!',
      emote: '🎨 Pixel Perfect!'
    },
    learner: {
      name: 'Anaya',
      role: 'Learner',
      dept: 'Information Tech · 2nd Year',
      quote: 'Building my first web app and need clean UI!',
      emote: '💡 Inspired!'
    },
    score: 96,
    sparkleColor: '#FF8FB1'
  },
  {
    id: 'webdev',
    skill: 'React & Frontend',
    icon: '⚛️',
    teacher: {
      name: 'Rohan',
      role: 'Teacher',
      dept: 'Software Eng · 3rd Year',
      quote: 'Component hierarchy, state props & responsive CSS!',
      emote: '⚡ Clean Code!'
    },
    learner: {
      name: 'Isha',
      role: 'Learner',
      dept: 'Biotech · 1st Year',
      quote: 'Eager to build an interactive campus website!',
      emote: '🚀 Let\'s Team Up!'
    },
    score: 95,
    sparkleColor: '#3A86FF'
  },
  {
    id: 'guitar',
    skill: 'Acoustic Guitar',
    icon: '🎸',
    teacher: {
      name: 'Dev',
      role: 'Teacher',
      dept: 'Campus Band · 3rd Year',
      quote: 'Acoustic chords, rhythm, fingerpicking & ear training!',
      emote: '🎵 In Tune!'
    },
    learner: {
      name: 'Riya',
      role: 'Learner',
      dept: 'Architecture · 2nd Year',
      quote: 'Always wanted to learn fingerstyle acoustic guitar!',
      emote: '🎸 Strum Away!'
    },
    score: 94,
    sparkleColor: '#2EC4B6'
  }
];

export default function SkillBuddies() {
  const shouldReduceMotion = useReducedMotion();
  const [activeMatchIndex, setActiveMatchIndex] = useState(0);
  const [soundOn, setSoundOn] = useState(isSoundEnabled());
  const [teacherEmote, setTeacherEmote] = useState(null);
  const [learnerEmote, setLearnerEmote] = useState(null);
  const [bounceTeacher, setBounceTeacher] = useState(0);
  const [bounceLearner, setBounceLearner] = useState(0);

  const currentMatch = SKILL_MATCHES[activeMatchIndex];

  // Listen to external sound toggles
  useEffect(() => {
    const handleToggle = (e) => {
      if (e?.detail?.enabled !== undefined) {
        setSoundOn(e.detail.enabled);
      }
    };
    window.addEventListener('4s_sound_toggle', handleToggle);
    return () => window.removeEventListener('4s_sound_toggle', handleToggle);
  }, []);

  const handleSelectMatch = (idx) => {
    setActiveMatchIndex(idx);
    if (soundOn) {
      playMatchFoundChime();
    }
  };

  const handleToggleSound = () => {
    const next = toggleSound();
    setSoundOn(next);
    if (next) {
      playMatchFoundChime();
    }
  };

  const handleTeacherClick = () => {
    setBounceTeacher((b) => b + 1);
    setTeacherEmote(currentMatch.teacher.emote);
    if (soundOn) {
      playMatchFoundChime();
    }
    setTimeout(() => setTeacherEmote(null), 1200);
  };

  const handleLearnerClick = () => {
    setBounceLearner((b) => b + 1);
    setLearnerEmote(currentMatch.learner.emote);
    if (soundOn) {
      playMatchFoundChime();
    }
    setTimeout(() => setLearnerEmote(null), 1200);
  };

  return (
    <section className="skill-buddies-section" aria-label="Skill Buddies Matching Showcase">
      <div className="skill-buddies-container">
        {/* Section Header */}
        <div className="skill-buddies-header">
          <div className="skill-buddies-kicker">
            <Sparkles size={14} className="text-ink" />
            <span>Campus Chemistry</span>
            <Sparkles size={14} className="text-ink" />
          </div>
          <h2 className="skill-buddies-title">
            Meet Your Next <span className="skill-buddies-title-highlight">Skill Buddy!</span>
          </h2>
          <p className="skill-buddies-subtitle">
            When what you love to teach matches what another student is eager to learn, 1-on-1 peer exchange is effortless. Click each character to say hi!
          </p>
        </div>

        {/* Main Manga Panel */}
        <div className="skill-buddies-panel">
          {/* Top Toolbar: Skill Chips & Sound Toggle */}
          <div className="skill-buddies-toolbar">
            <div className="skill-buddies-chips-group" role="tablist" aria-label="Skill Match Showcase selector">
              <span className="skill-buddies-chip-label">Featured Pair:</span>
              {SKILL_MATCHES.map((item, idx) => (
                <button
                  key={item.id}
                  role="tab"
                  aria-selected={activeMatchIndex === idx}
                  className={`skill-buddy-chip ${activeMatchIndex === idx ? 'active' : ''}`}
                  onClick={() => handleSelectMatch(idx)}
                >
                  <span>{item.icon}</span>
                  <span>{item.skill}</span>
                </button>
              ))}
            </div>

            <button
              className="skill-buddies-sound-btn"
              onClick={handleToggleSound}
              title={soundOn ? 'Sound effects enabled. Click to mute.' : 'Sound effects muted. Click to enable.'}
              aria-label={soundOn ? 'Mute sound effects' : 'Enable sound effects'}
            >
              {soundOn ? <Volume2 size={16} /> : <VolumeX size={16} />}
              <span>{soundOn ? 'Chime ON' : 'Chime MUTED'}</span>
            </button>
          </div>

          {/* Interactive Animation Stage */}
          <div className="skill-buddies-stage">
            {/* Screentone Texture */}
            <div className="skill-buddies-stage-screentone" aria-hidden="true" />

            {/* Corner Badge */}
            <div className="skill-buddies-corner-caption">
              <span>ACT 01 // INSTANT TEAM-UP</span>
            </div>

            {/* Comic burst and radiating speed lines in center */}
            <SpeedLines stage={4} shouldReduceMotion={shouldReduceMotion} />
            <ComicBurst stage={4} shouldReduceMotion={shouldReduceMotion} />
            <BurstSparkles stage={4} shouldReduceMotion={shouldReduceMotion} />

            {/* Teacher Speech Bubble (Left) */}
            <div className="skill-buddy-speech-bubble left">
              <motion.div
                key={`teacher-speech-${currentMatch.id}`}
                className="skill-buddy-dialogue-card"
                initial={shouldReduceMotion ? { opacity: 1 } : { scale: 0.9, y: 10, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 350, damping: 20 }}
              >
                <div className="skill-buddy-role-tag teacher">
                  <span>TEACHER</span>
                </div>
                <div className="skill-buddy-name">{currentMatch.teacher.name}</div>
                <div className="skill-buddy-quote">"{currentMatch.teacher.quote}"</div>
              </motion.div>
            </div>

            {/* Learner Speech Bubble (Right) */}
            <div className="skill-buddy-speech-bubble right">
              <motion.div
                key={`learner-speech-${currentMatch.id}`}
                className="skill-buddy-dialogue-card"
                initial={shouldReduceMotion ? { opacity: 1 } : { scale: 0.9, y: 10, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 350, damping: 20 }}
              >
                <div className="skill-buddy-role-tag learner">
                  <span>LEARNER</span>
                </div>
                <div className="skill-buddy-name">{currentMatch.learner.name}</div>
                <div className="skill-buddy-quote">"{currentMatch.learner.quote}"</div>
              </motion.div>
            </div>

            {/* Left Character: Chibi Teacher */}
            <motion.button
              key={`teacher-btn-${bounceTeacher}`}
              className="skill-buddy-char-btn skill-buddy-teacher-slot"
              onClick={handleTeacherClick}
              title={`Click to cheer with ${currentMatch.teacher.name}!`}
              aria-label={`Cheer with ${currentMatch.teacher.name} (${currentMatch.teacher.role})`}
              animate={
                shouldReduceMotion
                  ? {}
                  : bounceTeacher > 0
                  ? { y: [0, -18, 0, -8, 0], rotate: [0, 6, -4, 2, 0] }
                  : { y: [0, -4, 0] }
              }
              transition={
                shouldReduceMotion
                  ? { duration: 0 }
                  : bounceTeacher > 0
                  ? { duration: 0.55, ease: 'easeOut' }
                  : { duration: 3, repeat: Infinity, ease: 'easeInOut' }
              }
            >
              {teacherEmote && (
                <div className="skill-buddy-emote-popup">{teacherEmote}</div>
              )}
              <ChibiTeacher stage={4} shouldReduceMotion={shouldReduceMotion} />
            </motion.button>

            {/* Center Clasp & Starburst */}
            <div className="skill-buddies-clasp-wrap">
              <HandshakeClasp stage={4} shouldReduceMotion={shouldReduceMotion} />
            </div>

            {/* Center Slanted "MATCH FOUND!" Banner */}
            <motion.div
              key={`match-banner-${currentMatch.id}`}
              className="skill-buddies-center-burst"
              initial={shouldReduceMotion ? { scale: 1, opacity: 1 } : { scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 380, damping: 18 }}
            >
              <div className="skill-buddies-match-banner">
                <Star size={18} fill="#1A1A2E" />
                <span>{currentMatch.score}% MATCH!</span>
                <Star size={18} fill="#1A1A2E" />
              </div>
            </motion.div>

            {/* Right Character: Chibi Learner */}
            <motion.button
              key={`learner-btn-${bounceLearner}`}
              className="skill-buddy-char-btn skill-buddy-learner-slot"
              onClick={handleLearnerClick}
              title={`Click to cheer with ${currentMatch.learner.name}!`}
              aria-label={`Cheer with ${currentMatch.learner.name} (${currentMatch.learner.role})`}
              animate={
                shouldReduceMotion
                  ? {}
                  : bounceLearner > 0
                  ? { y: [0, -18, 0, -8, 0], rotate: [0, -6, 4, -2, 0] }
                  : { y: [0, -4, 0] }
              }
              transition={
                shouldReduceMotion
                  ? { duration: 0 }
                  : bounceLearner > 0
                  ? { duration: 0.55, ease: 'easeOut' }
                  : { duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }
              }
            >
              {learnerEmote && (
                <div className="skill-buddy-emote-popup">{learnerEmote}</div>
              )}
              <ChibiLearner stage={4} shouldReduceMotion={shouldReduceMotion} />
            </motion.button>
          </div>

          {/* Panel Footer: Value Props & CTA Button */}
          <div className="skill-buddies-footer-bar">
            <div className="skill-buddies-value-props">
              <div className="skill-buddy-prop-item">
                <CheckCircle2 size={16} className="text-emerald-500" />
                <span>Reciprocal 1-on-1 Learning</span>
              </div>
              <div className="skill-buddy-prop-item">
                <CheckCircle2 size={16} className="text-emerald-500" />
                <span>Campus Peer Verified</span>
              </div>
              <div className="skill-buddy-prop-item">
                <CheckCircle2 size={16} className="text-emerald-500" />
                <span>Earn Campus Badges</span>
              </div>
            </div>

            <Link to="/explore" className="skill-buddies-cta-btn">
              <span>Find Your Skill Buddy</span>
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
