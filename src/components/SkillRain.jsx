import React, { useEffect, useRef, useState, useMemo } from 'react';
import './SkillRain.css';

/**
 * 29 Mandatory Skill Items for 4S Academy
 * Expresses peer teaching & learning across campus
 */
const SKILL_ITEMS = [
  { name: 'Python', category: 'Tech', icon: '🐍', color: '#3A86FF', bg: 'rgba(58, 134, 255, 0.12)' },
  { name: 'JavaScript', category: 'Tech', icon: '⚡', color: '#3A86FF', bg: 'rgba(58, 134, 255, 0.12)' },
  { name: 'React', category: 'Tech', icon: '⚛️', color: '#3A86FF', bg: 'rgba(58, 134, 255, 0.12)' },
  { name: 'SQL', category: 'Tech', icon: '🗄️', color: '#3A86FF', bg: 'rgba(58, 134, 255, 0.12)' },
  { name: 'UI Design', category: 'Design', icon: '🎨', color: '#FF8FB1', bg: 'rgba(255, 143, 177, 0.14)' },
  { name: 'Photoshop', category: 'Design', icon: '🖌️', color: '#FF8FB1', bg: 'rgba(255, 143, 177, 0.14)' },
  { name: 'Video Editing', category: 'Creative', icon: '🎬', color: '#FFD23F', bg: 'rgba(255, 210, 63, 0.16)' },
  { name: 'Photography', category: 'Design', icon: '📷', color: '#FF8FB1', bg: 'rgba(255, 143, 177, 0.14)' },
  { name: 'Public Speaking', category: 'Communication', icon: '🗣️', color: '#2EC4B6', bg: 'rgba(46, 196, 182, 0.14)' },
  { name: 'Guitar', category: 'Creative', icon: '🎸', color: '#FFD23F', bg: 'rgba(255, 210, 63, 0.16)' },
  { name: 'Singing', category: 'Creative', icon: '🎤', color: '#FFD23F', bg: 'rgba(255, 210, 63, 0.16)' },
  { name: 'Dance', category: 'Creative', icon: '💃', color: '#FFD23F', bg: 'rgba(255, 210, 63, 0.16)' },
  { name: 'Chess', category: 'Creative', icon: '♟️', color: '#FFD23F', bg: 'rgba(255, 210, 63, 0.16)' },
  { name: 'Excel', category: 'Tech', icon: '📊', color: '#3A86FF', bg: 'rgba(58, 134, 255, 0.12)' },
  { name: 'Content Writing', category: 'Communication', icon: '✍️', color: '#2EC4B6', bg: 'rgba(46, 196, 182, 0.14)' },
  { name: 'Canva', category: 'Design', icon: '✨', color: '#FF8FB1', bg: 'rgba(255, 143, 177, 0.14)' },
  { name: 'Figma', category: 'Design', icon: '📐', color: '#FF8FB1', bg: 'rgba(255, 143, 177, 0.14)' },
  { name: 'Data Analysis', category: 'Tech', icon: '📈', color: '#3A86FF', bg: 'rgba(58, 134, 255, 0.12)' },
  { name: 'Machine Learning', category: 'Tech', icon: '🤖', color: '#3A86FF', bg: 'rgba(58, 134, 255, 0.12)' },
  { name: 'Python Basics', category: 'Tech', icon: '🐍', color: '#3A86FF', bg: 'rgba(58, 134, 255, 0.12)' },
  { name: 'DBMS', category: 'Tech', icon: '💾', color: '#3A86FF', bg: 'rgba(58, 134, 255, 0.12)' },
  { name: 'Java', category: 'Tech', icon: '☕', color: '#3A86FF', bg: 'rgba(58, 134, 255, 0.12)' },
  { name: 'Aptitude', category: 'Communication', icon: '🧠', color: '#2EC4B6', bg: 'rgba(46, 196, 182, 0.14)' },
  { name: 'Interview Prep', category: 'Communication', icon: '💼', color: '#2EC4B6', bg: 'rgba(46, 196, 182, 0.14)' },
  { name: 'Drawing', category: 'Design', icon: '✏️', color: '#FF8FB1', bg: 'rgba(255, 143, 177, 0.14)' },
  { name: 'Cooking', category: 'Lifestyle', icon: '🍳', color: '#FF4D6D', bg: 'rgba(255, 77, 109, 0.12)' },
  { name: 'Fitness', category: 'Lifestyle', icon: '💪', color: '#FF4D6D', bg: 'rgba(255, 77, 109, 0.12)' },
  { name: 'Spanish', category: 'Communication', icon: '🇪🇸', color: '#2EC4B6', bg: 'rgba(46, 196, 182, 0.14)' },
  { name: 'Japanese', category: 'Communication', icon: '🇯🇵', color: '#2EC4B6', bg: 'rgba(46, 196, 182, 0.14)' }
];

// Helper to pick random lane mostly toward edges (keeps centre clear)
function pickSideLane(index) {
  const isLeft = index % 2 === 0;
  if (isLeft) {
    // Left flank: 1.5% to 22%
    return 1.5 + Math.random() * 20.5;
  } else {
    // Right flank: 77% to 97%
    return 77 + Math.random() * 20;
  }
}

/**
 * SkillRain Component
 * Falling anime-style skill sticker chips background layer.
 * Includes interactive soft cursor deflection, depth layering, and 4S Team-Up moments.
 */
export default function SkillRain() {
  const containerRef = useRef(null);
  const chipsDomRefs = useRef([]);
  const chipsStateRef = useRef([]);
  const rafIdRef = useRef(null);
  const mousePosRef = useRef({ x: -1000, y: -1000 });
  const isReducedMotionRef = useRef(false);

  // Team-Up Moment State (Subtle match interaction between Teacher & Learner)
  const [teamUpEvent, setTeamUpEvent] = useState(null);

  // Check reduced motion preference
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    isReducedMotionRef.current = mediaQuery.matches;

    const handler = (e) => {
      setPrefersReducedMotion(e.matches);
      isReducedMotionRef.current = e.matches;
    };
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Determine chip count based on viewport (16 on desktop, 8 on mobile)
  const chipCount = useMemo(() => {
    if (typeof window === 'undefined') return 16;
    return window.innerWidth < 768 ? 8 : 16;
  }, []);

  // Initial chips dataset
  const [chipsData, setChipsData] = useState(() => {
    return Array.from({ length: 16 }, (_, i) => ({
      id: i,
      skill: SKILL_ITEMS[i % SKILL_ITEMS.length]
    }));
  });

  useEffect(() => {
    if (prefersReducedMotion) return;

    const isMobile = window.innerWidth < 768;
    const activeCount = isMobile ? 8 : 16;
    const height = window.innerHeight || 800;

    // Initialize physical state for each chip
    chipsStateRef.current = Array.from({ length: activeCount }, (_, i) => {
      // Depth tiers: 0 (background), 1 (midground), 2 (foreground)
      const tier = i % 3;
      let scale = 0.85;
      let opacity = 0.72;
      let blur = 0;
      let baseSpeed = 1.2;

      if (tier === 0) {
        scale = 0.72;
        opacity = 0.58;
        blur = 0.75;
        baseSpeed = 0.75 + Math.random() * 0.35; // 18-20s fall
      } else if (tier === 1) {
        scale = 0.88;
        opacity = 0.75;
        blur = 0;
        baseSpeed = 1.1 + Math.random() * 0.45; // 12-16s fall
      } else {
        scale = 1.02;
        opacity = 0.88;
        blur = 0;
        baseSpeed = 1.6 + Math.random() * 0.55; // 8-11s fall
      }

      const xPercent = pickSideLane(i);

      return {
        id: i,
        skillIndex: i % SKILL_ITEMS.length,
        xPercent,
        y: Math.random() * height,
        speed: baseSpeed,
        scale,
        opacity,
        blur,
        swayAmplitude: 14 + Math.random() * 16,
        swaySpeed: 0.012 + Math.random() * 0.015,
        swayPhase: Math.random() * Math.PI * 2,
        rotation: (Math.random() - 0.5) * 24, // -12deg to +12deg
        pushX: 0,
        pushY: 0,
        targetPushX: 0,
        targetPushY: 0
      };
    });

    // Track mouse position for soft desktop repulsion (max 20px)
    const handleMouseMove = (e) => {
      mousePosRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseLeave = () => {
      mousePosRef.current = { x: -1000, y: -1000 };
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);

    // Animation Loop
    let lastTime = performance.now();

    const updatePhysics = (time) => {
      if (document.hidden) {
        // Pause animation when tab is inactive to preserve battery & 60fps
        rafIdRef.current = requestAnimationFrame(updatePhysics);
        return;
      }

      const delta = Math.min((time - lastTime) / 16.667, 2.0);
      lastTime = time;

      const innerW = window.innerWidth;
      const innerH = window.innerHeight;
      const mouse = mousePosRef.current;

      chipsStateRef.current.forEach((chip, i) => {
        const dom = chipsDomRefs.current[i];
        if (!dom) return;

        // Fall downward
        chip.y += chip.speed * delta;

        // Gentle left-right sway
        chip.swayPhase += chip.swaySpeed * delta;
        const swayOffset = Math.sin(chip.swayPhase) * chip.swayAmplitude;

        // Current world coordinates
        const currentX = (chip.xPercent / 100) * innerW + swayOffset;
        const currentY = chip.y;

        // Soft cursor deflection (max 20px away from mouse on desktop)
        const dx = currentX - mouse.x;
        const dy = currentY - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 110 && dist > 0) {
          const force = (1 - dist / 110) * 20; // 0 to 20px
          chip.targetPushX = (dx / dist) * force;
          chip.targetPushY = (dy / dist) * force;
        } else {
          chip.targetPushX = 0;
          chip.targetPushY = 0;
        }

        // Smooth spring towards target push
        chip.pushX += (chip.targetPushX - chip.pushX) * 0.12 * delta;
        chip.pushY += (chip.targetPushY - chip.pushY) * 0.12 * delta;

        // Recycle chip when falling below screen
        if (chip.y > innerH + 45) {
          chip.y = -60 - Math.random() * 40;
          chip.xPercent = pickSideLane(Math.floor(Math.random() * 100));
          chip.rotation = (Math.random() - 0.5) * 24;

          // Pick a new random skill
          const newSkillIdx = Math.floor(Math.random() * SKILL_ITEMS.length);
          chip.skillIndex = newSkillIdx;

          // Update DOM skill text & styling
          const item = SKILL_ITEMS[newSkillIdx];
          const iconEl = dom.querySelector('.chip-icon');
          const textEl = dom.querySelector('.chip-text');
          const stripEl = dom.querySelector('.chip-cat-strip');

          if (iconEl) iconEl.textContent = item.icon;
          if (textEl) textEl.textContent = item.name;
          if (stripEl) stripEl.style.backgroundColor = item.color;
          dom.style.background = `linear-gradient(135deg, ${item.bg}, #ffffff 65%)`;
        }

        // Apply hardware-accelerated CSS transform & opacity
        const finalX = currentX + chip.pushX;
        const finalY = currentY + chip.pushY;

        dom.style.transform = `translate3d(${finalX}px, ${finalY}px, 0) scale(${chip.scale}) rotate(${chip.rotation}deg)`;
        dom.style.opacity = chip.opacity;
        if (chip.blur > 0) {
          dom.style.filter = `blur(${chip.blur}px)`;
        } else {
          dom.style.filter = 'none';
        }
      });

      rafIdRef.current = requestAnimationFrame(updatePhysics);
    };

    rafIdRef.current = requestAnimationFrame(updatePhysics);

    return () => {
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [chipCount, prefersReducedMotion]);

  // --------------------------------------------------------------------------
  // "TEAM-UP" SIGNATURE MOMENT (Every 6-10s: Teacher & Learner Match)
  // Subtle & quick (< 1.2s), maximum one pair at a time.
  // --------------------------------------------------------------------------
  useEffect(() => {
    if (prefersReducedMotion) return;

    let timeoutId;
    let isMounted = true;

    const scheduleNextTeamUp = () => {
      // 6 to 10 seconds interval
      const delayMs = 6000 + Math.random() * 4000;

      timeoutId = setTimeout(() => {
        if (!isMounted || document.hidden) {
          scheduleNextTeamUp();
          return;
        }

        // Pick distinct skills for Teacher and Learner
        const teachSkill = SKILL_ITEMS[Math.floor(Math.random() * SKILL_ITEMS.length)];
        let learnSkill = SKILL_ITEMS[Math.floor(Math.random() * SKILL_ITEMS.length)];
        while (learnSkill.name === teachSkill.name) {
          learnSkill = SKILL_ITEMS[Math.floor(Math.random() * SKILL_ITEMS.length)];
        }

        // Choose side flank (Left ~14% or Right ~85%) so it doesn't block center text
        const isLeftSide = Math.random() > 0.5;
        const centerX = isLeftSide
          ? 0.12 * window.innerWidth + Math.random() * 40
          : 0.86 * window.innerWidth - Math.random() * 40;
        const startY = 0.28 * window.innerHeight + Math.random() * (0.35 * window.innerHeight);

        setTeamUpEvent({
          id: Date.now(),
          centerX,
          startY,
          teachSkill,
          learnSkill,
          phase: 'converging' // 'converging' -> 'contact' -> 'complete'
        });

        // Step 1: Converge in 400ms
        setTimeout(() => {
          if (!isMounted) return;
          setTeamUpEvent((prev) => (prev ? { ...prev, phase: 'contact' } : null));

          // Step 2: Flash + star burst, then drift apart / dissolve (< 1.1s total)
          setTimeout(() => {
            if (!isMounted) return;
            setTeamUpEvent(null);
            scheduleNextTeamUp();
          }, 650);
        }, 380);
      }, delayMs);
    };

    scheduleNextTeamUp();

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, [prefersReducedMotion]);

  // Reduced motion: static scattered chips along flanks (no falling, no team-up)
  if (prefersReducedMotion) {
    const staticChips = [
      { id: 1, skill: SKILL_ITEMS[0], top: '15%', left: '4%', rot: -6 },
      { id: 2, skill: SKILL_ITEMS[4], top: '35%', left: '8%', rot: 4 },
      { id: 3, skill: SKILL_ITEMS[8], top: '60%', left: '5%', rot: -8 },
      { id: 4, skill: SKILL_ITEMS[12], top: '80%', left: '7%', rot: 5 },
      { id: 5, skill: SKILL_ITEMS[2], top: '18%', right: '5%', rot: 7 },
      { id: 6, skill: SKILL_ITEMS[6], top: '42%', right: '7%', rot: -5 },
      { id: 7, skill: SKILL_ITEMS[16], top: '65%', right: '4%', rot: 6 },
      { id: 8, skill: SKILL_ITEMS[24], top: '85%', right: '8%', rot: -7 }
    ];

    return (
      <div className="skill-rain-container" aria-hidden="true">
        <div className="skill-rain-halftone" />
        {staticChips.map((sc) => (
          <div
            key={sc.id}
            className="skill-sticker-chip"
            style={{
              top: sc.top,
              left: sc.left,
              right: sc.right,
              transform: `rotate(${sc.rot}deg)`,
              background: `linear-gradient(135deg, ${sc.skill.bg}, #ffffff 65%)`
            }}
          >
            <span className="chip-cat-strip" style={{ backgroundColor: sc.skill.color }} />
            <span className="chip-icon">{sc.skill.icon}</span>
            <span className="chip-text">{sc.skill.name}</span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div ref={containerRef} className="skill-rain-container" aria-hidden="true">
      {/* Halftone texture */}
      <div className="skill-rain-halftone" />

      {/* Falling Skill Sticker Chips */}
      {chipsData.slice(0, chipCount).map((chip, index) => {
        const item = chip.skill;
        return (
          <div
            key={chip.id}
            ref={(el) => (chipsDomRefs.current[index] = el)}
            className="skill-sticker-chip"
            style={{
              background: `linear-gradient(135deg, ${item.bg}, #ffffff 65%)`
            }}
          >
            <span className="chip-cat-strip" style={{ backgroundColor: item.color }} />
            <span className="chip-icon">{item.icon}</span>
            <span className="chip-text">{item.name}</span>
          </div>
        );
      })}

      {/* Team-Up Moment Signature Event */}
      {teamUpEvent && (
        <div className="team-up-moment-layer" aria-hidden="true">
          <div
            className="team-up-pair-wrap"
            style={{
              left: `${teamUpEvent.centerX}px`,
              top: `${teamUpEvent.startY}px`
            }}
          >
            {/* TEACH Chip (Left) */}
            <div
              className="team-up-chip teach-chip"
              style={{
                transform:
                  teamUpEvent.phase === 'converging'
                    ? 'translate(-75px, 0) scale(0.95)'
                    : 'translate(-38px, 0) scale(1.05)'
              }}
            >
              <span className="team-up-tag">TEACH</span>
              <span className="chip-icon">{teamUpEvent.teachSkill.icon}</span>
              <span>{teamUpEvent.teachSkill.name}</span>
            </div>

            {/* LEARN Chip (Right) */}
            <div
              className="team-up-chip learn-chip"
              style={{
                transform:
                  teamUpEvent.phase === 'converging'
                    ? 'translate(75px, 0) scale(0.95)'
                    : 'translate(38px, 0) scale(1.05)'
              }}
            >
              <span className="team-up-tag">LEARN</span>
              <span className="chip-icon">{teamUpEvent.learnSkill.icon}</span>
              <span>{teamUpEvent.learnSkill.name}</span>
            </div>

            {/* Contact Spark Burst & +1 Match Badge */}
            {teamUpEvent.phase === 'contact' && (
              <div className="team-up-spark-burst">
                <div className="team-up-match-badge">★ +1 TEAM-UP!</div>

                {/* 6 Radiating Sparks */}
                {[0, 60, 120, 180, 240, 300].map((deg, idx) => {
                  const rad = (deg * Math.PI) / 180;
                  const tx = `${Math.cos(rad) * 28}px`;
                  const ty = `${Math.sin(rad) * 28}px`;
                  return (
                    <span
                      key={idx}
                      className="team-up-sparkle-star"
                      style={{
                        '--tx': tx,
                        '--ty': ty,
                        color: idx % 2 === 0 ? '#FFD23F' : '#FF8FB1',
                        fontSize: '14px',
                        lineHeight: 1
                      }}
                    >
                      ✦
                    </span>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
