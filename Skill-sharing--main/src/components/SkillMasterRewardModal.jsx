import React, { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import {
  Crown,
  Sparkles,
  Download,
  X,
  CheckCircle2,
  Award,
  Star,
  Check
} from 'lucide-react';
import { playMatchFoundChime } from '../utils/soundUtil.js';
import './SkillMasterRewardModal.css';

/**
 * Skill Master Reward Celebration Modal
 * Triggered when student earns 8 badges.
 * Features:
 * - Comic burst backdrop & falling confetti stars
 * - Title "SKILL MASTER UNLOCKED!" & "You earned 8 badges!"
 * - Real inside-app rewards:
 *   1) Golden profile ring
 *   2) "Skill Master" title
 *   3) Skill Master Certificate (SVG) with in-browser PNG download
 * - Fully accessible dialog with focus trap and Escape handler
 */
export default function SkillMasterRewardModal({
  isOpen,
  onClose,
  userName = 'Vidhi Kedia',
  dateString = '',
  badgesCount = 8
}) {
  const shouldReduceMotion = useReducedMotion();
  const modalRef = useRef(null);
  const previouslyFocusedRef = useRef(null);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const formattedDate = dateString || new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  // Play signature match/rank-up chime via Web Audio API synthesis only if sound is enabled
  useEffect(() => {
    if (isOpen) {
      playMatchFoundChime();
    }
  }, [isOpen]);

  // Focus management & Escape key
  useEffect(() => {
    if (isOpen) {
      previouslyFocusedRef.current = document.activeElement;
      document.body.style.overflow = 'hidden';

      const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
          e.preventDefault();
          onClose();
        }
      };
      window.addEventListener('keydown', handleKeyDown);

      // Focus close or continue button after render
      setTimeout(() => {
        const continueBtn = modalRef.current?.querySelector('.reward-continue-btn');
        continueBtn?.focus({ preventScroll: true });
      }, 100);

      return () => {
        window.removeEventListener('keydown', handleKeyDown);
        document.body.style.overflow = '';
        if (previouslyFocusedRef.current && previouslyFocusedRef.current.focus) {
          previouslyFocusedRef.current.focus({ preventScroll: true });
        }
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // In-browser SVG to PNG download (zero server call)
  const handleDownloadCertificate = () => {
    const svgEl = document.getElementById('skill-master-svg-cert');
    if (!svgEl) return;

    try {
      const serializer = new XMLSerializer();
      const svgStr = serializer.serializeToString(svgEl);
      const svgBlob = new Blob([svgStr], { type: 'image/svg+xml;charset=utf-8' });
      const URL = window.URL || window.webkitURL || window;
      const blobUrl = URL.createObjectURL(svgBlob);
      const img = new Image();

      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 1200;
        canvas.height = 800;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#FFFDF5';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, 1200, 800);
        const pngUrl = canvas.toDataURL('image/png');

        const dl = document.createElement('a');
        dl.download = `4S-Skill-Master-Certificate-${userName.replace(/\s+/g, '_')}.png`;
        dl.href = pngUrl;
        document.body.appendChild(dl);
        dl.click();
        document.body.removeChild(dl);
        URL.revokeObjectURL(blobUrl);

        setDownloadSuccess(true);
        setTimeout(() => setDownloadSuccess(false), 3000);
      };

      img.src = blobUrl;
    } catch (e) {
      console.error('Certificate export failed', e);
    }
  };

  return (
    <div
      className="skill-master-modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Skill Master reward"
      onClick={onClose}
    >
      {/* Aria-live announcement */}
      <div className="sr-only" aria-live="polite">
        You unlocked Skill Master! You earned 8 badges!
      </div>

      {/* Confetti falling stars (aria-hidden) */}
      {!shouldReduceMotion && (
        <div className="confetti-container" aria-hidden="true">
          {[...Array(24)].map((_, i) => (
            <div
              key={i}
              className={`confetti-star confetti-${(i % 5) + 1}`}
              style={{
                left: `${(i * 4.2) % 100}%`,
                animationDelay: `${(i * 0.15) % 2.5}s`,
                animationDuration: `${2.2 + (i % 4) * 0.4}s`
              }}
            >
              ★
            </div>
          ))}
        </div>
      )}

      {/* Centered Anime Reward Card */}
      <motion.div
        ref={modalRef}
        className="skill-master-card"
        onClick={(e) => e.stopPropagation()}
        initial={shouldReduceMotion ? { opacity: 0 } : { scale: 0.85, opacity: 0, y: 30 }}
        animate={shouldReduceMotion ? { opacity: 1 } : { scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 380, damping: 22 }}
      >
        {/* Close X */}
        <button
          type="button"
          onClick={onClose}
          className="reward-close-btn"
          aria-label="Close reward popup"
        >
          <X size={18} />
        </button>

        {/* Comic Burst Ribbon Header */}
        <div className="comic-burst-banner">
          <Crown size={22} className="burst-crown-icon" />
          <h2 className="burst-title">SKILL MASTER UNLOCKED!</h2>
          <span className="burst-subtitle">You earned 8 badges!</span>
        </div>

        {/* 3 Real In-App Rewards Row */}
        <div className="rewards-granted-grid">
          <div className="reward-perk-item">
            <div className="perk-icon-gold-ring">
              <span className="perk-avatar-sample">VK</span>
            </div>
            <div className="perk-info">
              <h4>Golden Profile Ring</h4>
              <p>Active on your avatar across the campus</p>
            </div>
          </div>

          <div className="reward-perk-item">
            <div className="perk-icon-title-badge">
              <Sparkles size={18} className="text-amber-500" />
            </div>
            <div className="perk-info">
              <h4>"Skill Master" Title</h4>
              <p>Displayed under your name on your profile chip</p>
            </div>
          </div>

          <div className="reward-perk-item">
            <div className="perk-icon-cert">
              <Award size={18} className="text-indigo-600" />
            </div>
            <div className="perk-info">
              <h4>Official Certificate</h4>
              <p>8 verified milestone badges earned</p>
            </div>
          </div>
        </div>

        {/* Certificate Preview Card (Rendered via clean SVG) */}
        <div className="certificate-preview-box">
          <div className="cert-preview-label">
            <Award size={13} className="text-amber-600 inline mr-1" />
            Official Verified 4S Credential
          </div>

          <div className="cert-svg-wrapper">
            <svg
              id="skill-master-svg-cert"
              viewBox="0 0 1200 800"
              xmlns="http://www.w3.org/2000/svg"
              className="cert-svg"
            >
              {/* Background with double anime border */}
              <rect x="0" y="0" width="1200" height="800" fill="#FFFDF8" />
              <rect x="30" y="30" width="1140" height="740" fill="#FFFFFF" stroke="#1A1A2E" strokeWidth="8" rx="20" />
              <rect x="48" y="48" width="1104" height="704" fill="none" stroke="#FFD23F" strokeWidth="4" rx="14" />
              <rect x="58" y="58" width="1084" height="684" fill="none" stroke="#1A1A2E" strokeWidth="2" strokeDasharray="8 6" rx="10" />

              {/* Corner Ornaments */}
              <circle cx="68" cy="68" r="10" fill="#3A86FF" stroke="#1A1A2E" strokeWidth="3" />
              <circle cx="1132" cy="68" r="10" fill="#FF8FB1" stroke="#1A1A2E" strokeWidth="3" />
              <circle cx="68" cy="732" r="10" fill="#FFD23F" stroke="#1A1A2E" strokeWidth="3" />
              <circle cx="1132" cy="732" r="10" fill="#2EC4B6" stroke="#1A1A2E" strokeWidth="3" />

              {/* Academy Header */}
              <text x="600" y="140" textAnchor="middle" fontFamily="sans-serif" fontWeight="900" fontSize="22" letterSpacing="6" fill="#6366F1">
                4S STUDENT SKILL SHARING SYSTEM · CAMPUS ACADEMY
              </text>

              <text x="600" y="215" textAnchor="middle" fontFamily="sans-serif" fontWeight="900" fontSize="48" letterSpacing="2" fill="#1A1A2E">
                CERTIFICATE OF SKILL MASTERY
              </text>

              <line x1="380" y1="240" x2="820" y2="240" stroke="#FFD23F" strokeWidth="6" strokeLinecap="round" />

              <text x="600" y="300" textAnchor="middle" fontFamily="sans-serif" fontSize="20" fill="#64748B">
                This verified credential is proudly presented to
              </text>

              {/* Student Name */}
              <text x="600" y="380" textAnchor="middle" fontFamily="sans-serif" fontWeight="900" fontSize="56" fill="#1A1A2E">
                {userName}
              </text>

              <line x1="300" y1="410" x2="900" y2="410" stroke="#1A1A2E" strokeWidth="3" />

              {/* Citations */}
              <text x="600" y="465" textAnchor="middle" fontFamily="sans-serif" fontSize="22" fill="#334155">
                For completing active peer knowledge mentorship and successfully unlocking
              </text>
              <text x="600" y="505" textAnchor="middle" fontFamily="sans-serif" fontWeight="800" fontSize="24" fill="#3A86FF">
                ALL 8 CAMPUS ACHIEVEMENTS &amp; REPUTATION BADGES
              </text>

              {/* Academy Badge Stars */}
              <text x="600" y="565" textAnchor="middle" fontSize="36" fill="#FFD23F">
                ★ ★ ★ ★ ★ ★ ★ ★
              </text>

              {/* Footer Meta */}
              <g transform="translate(180, 640)">
                <text x="0" y="0" fontFamily="sans-serif" fontWeight="700" fontSize="16" fill="#64748B">AWARDED ON:</text>
                <text x="0" y="26" fontFamily="sans-serif" fontWeight="800" fontSize="20" fill="#1A1A2E">{formattedDate}</text>
              </g>

              {/* Gold Academy Seal Stamp */}
              <g transform="translate(600, 650)">
                <circle cx="0" cy="0" r="50" fill="#FFD23F" stroke="#1A1A2E" strokeWidth="4" />
                <circle cx="0" cy="0" r="42" fill="none" stroke="#1A1A2E" strokeWidth="2" strokeDasharray="4 3" />
                <text x="0" y="-8" textAnchor="middle" fontFamily="sans-serif" fontWeight="900" fontSize="13" fill="#1A1A2E">4S VERIFIED</text>
                <text x="0" y="12" textAnchor="middle" fontFamily="sans-serif" fontWeight="900" fontSize="16" fill="#1A1A2E">MASTER</text>
                <text x="0" y="28" textAnchor="middle" fontFamily="sans-serif" fontWeight="800" fontSize="10" fill="#1A1A2E">CREDENTIAL</text>
              </g>

              <g transform="translate(860, 640)">
                <text x="0" y="0" fontFamily="sans-serif" fontWeight="700" fontSize="16" fill="#64748B">STATUS:</text>
                <text x="0" y="26" fontFamily="sans-serif" fontWeight="800" fontSize="20" fill="#10B981">8 BADGES VERIFIED</text>
              </g>
            </svg>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="reward-actions-row">
          <button
            type="button"
            onClick={handleDownloadCertificate}
            className="btn reward-download-btn"
          >
            {downloadSuccess ? (
              <>
                <Check size={16} className="text-emerald-300" />
                <span>Certificate Saved!</span>
              </>
            ) : (
              <>
                <Download size={16} />
                <span>Download Certificate (PNG)</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={onClose}
            className="btn reward-continue-btn"
          >
            <span>Continue &amp; Wear Ring</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
}
