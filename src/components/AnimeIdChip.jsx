import React, { useState, useRef, useEffect } from 'react';
import { Copy, Check, Info, Clock, HelpCircle, X } from 'lucide-react';
import {
  getReadableId,
  decodeReadableId,
  AWAITING_TEACHER_ID,
  extractStudentNumber,
  STUDENT_NAMES
} from '../utils/idEngine.js';
import './AnimeIdChip.css';

/**
 * Global anime toast helper for ID creation and copy events.
 * Displays manga toast with offset ink shadow, copy button, and auto-dismiss.
 */
export const showAnimeIdToast = (message, copyId = '') => {
  if (typeof document === 'undefined') return;

  let container = document.getElementById('anime-id-toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'anime-id-toast-container';
    container.className = 'anime-id-toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'anime-id-toast-card';

  const textSpan = document.createElement('span');
  textSpan.className = 'anime-id-toast-text';
  textSpan.innerText = message;
  toast.appendChild(textSpan);

  if (copyId) {
    const copyBtn = document.createElement('button');
    copyBtn.className = 'anime-id-toast-copy-btn';
    copyBtn.innerHTML = '<span>Copy ID</span>';
    copyBtn.onclick = (e) => {
      e.stopPropagation();
      if (navigator.clipboard) {
        navigator.clipboard.writeText(copyId);
      }
      copyBtn.innerText = 'Copied!';
      copyBtn.classList.add('copied');
      setTimeout(() => {
        copyBtn.innerText = 'Copy ID';
        copyBtn.classList.remove('copied');
      }, 1500);
    };
    toast.appendChild(copyBtn);
  }

  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('anime-toast-fade-out');
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 250);
  }, 3500);
};

/**
 * <AnimeIdGuideButton />
 * Small "ID guide" info button near section titles that opens a short legend.
 * TCR004CRS001 = Teacher 004, Course 001
 * LRN007-TCR004CRS001 = Learner 007, learning Teacher 004's Course 001
 */
export function AnimeIdGuideButton({ className = '' }) {
  const [isOpen, setIsOpen] = useState(false);
  const modalRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  return (
    <div className={`anime-id-guide-wrapper ${className}`}>
      <button
        type="button"
        className="anime-id-guide-btn"
        onClick={() => setIsOpen(!isOpen)}
        title="View 4S ID Guide"
        aria-label="View 4S ID Guide"
      >
        <HelpCircle size={13} className="text-primary" />
        <span>ID Guide</span>
      </button>

      {isOpen && (
        <div className="anime-id-guide-popover" ref={modalRef} role="dialog" aria-modal="true">
          <div className="anime-id-guide-header">
            <div className="flex items-center gap-1.5">
              <span className="anime-id-guide-badge">4S DECODE</span>
              <h4 className="font-heading text-sm text-[#1A1A2E] m-0">Course & Student ID System</h4>
            </div>
            <button
              type="button"
              className="anime-id-guide-close"
              onClick={() => setIsOpen(false)}
              aria-label="Close guide"
            >
              <X size={14} />
            </button>
          </div>

          <p className="anime-id-guide-intro">
            Every ID in 4S connects a verified student with a specific course:
          </p>

          <div className="anime-id-guide-rules">
            {/* Rule 1: Teaching ID */}
            <div className="anime-id-guide-row">
              <div className="anime-id-guide-sample">
                <span className="segment-prefix prefix-tcr">TCR</span>
                <span className="segment-student-no">004</span>
                <span className="segment-course-no">CRS001</span>
              </div>
              <div className="anime-id-guide-desc">
                <strong>Teaching ID:</strong> Teacher <strong>STU004</strong> teaches <strong>Course 001</strong> (e.g. Python). Assigned per teacher, per course.
              </div>
            </div>

            {/* Rule 2: Learning ID */}
            <div className="anime-id-guide-row">
              <div className="anime-id-guide-sample">
                <span className="segment-prefix prefix-lrn">LRN</span>
                <span className="segment-student-no">007</span>
                <span className="text-[#1A1A2E] font-bold">-</span>
                <span className="lrn-teacher-group">
                  <span className="segment-prefix prefix-tcr">TCR</span>
                  <span className="segment-student-no">004</span>
                  <span className="segment-course-no">CRS001</span>
                </span>
              </div>
              <div className="anime-id-guide-desc">
                <strong>Learning ID:</strong> Learner <strong>STU007</strong> is learning <strong>Course 001</strong> taught by <strong>Teacher STU004</strong>.
              </div>
            </div>

            {/* Rule 3: Awaiting Teacher */}
            <div className="anime-id-guide-row">
              <div className="anime-id-guide-sample sample-awaiting">
                <Clock size={11} className="text-slate-500 mr-1" />
                <span>Awaiting teacher</span>
              </div>
              <div className="anime-id-guide-desc">
                <strong>Unmatched Request:</strong> Shows until matched. The moment you are matched, your Learning ID is generated automatically!
              </div>
            </div>
          </div>

          <div className="anime-id-guide-footer">
            <span>Hover or click any sticker chip to read its full decoded sentence. Click to copy.</span>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * <AnimeIdChip />
 * Manga-styled click-to-copy ID chip with color-split and Decode popover:
 * - Teaching ID: TCR (blue) + Student # (ink bold) + Course # (teal)
 * - Learning ID: LRN (pink) + Learner # (ink bold) + '-' + TCR Teacher (lighter blue pill)
 * - Unmatched: Awaiting teacher (grey sticker)
 * - Student ID: STU (indigo) + Student # (ink bold)
 */
export default function AnimeIdChip({
  id = '',
  record = null,
  table = '',
  column = '',
  type = '',
  label = '',
  size = 'md', // 'sm' | 'md' | 'lg'
  matchPair = null,
  context = {},
  className = ''
}) {
  const [copied, setCopied] = useState(false);
  const [showDecode, setShowDecode] = useState(false);
  const popoverRef = useRef(null);

  // If match pair, render combined pair
  if (matchPair) {
    const lrnReadable = getReadableId(matchPair.learningId || matchPair.learnerId || matchPair.Request_ID, 'LRN');
    const tcrReadable = getReadableId(matchPair.teachingId || matchPair.teacherId || matchPair.SS_ID, 'TCR');

    return (
      <div className={`anime-id-match-pair ${className}`}>
        <AnimeIdChip
          id={lrnReadable}
          record={matchPair.learnerRecord}
          type="LRN"
          size={size}
          context={matchPair.learnerContext || {}}
        />
        <span className="anime-id-pair-arrow" aria-hidden="true">&lt;-&gt;</span>
        <AnimeIdChip
          id={tcrReadable}
          record={matchPair.teacherRecord}
          type="TCR"
          size={size}
          context={matchPair.teacherContext || {}}
        />
      </div>
    );
  }

  // Determine readable display ID
  const effectiveType = type || (table === 'LEARNING_REQUEST' || column === 'Request_ID' ? 'LRN' : table === 'STUDENT_SKILL' || column === 'SS_ID' ? 'TCR' : '');
  const displayId = getReadableId(id || record, effectiveType, record?.studentId);

  // Check if unmatched / awaiting teacher
  const isAwaiting = displayId === AWAITING_TEACHER_ID || id === AWAITING_TEACHER_ID || (record && record.status === 'Open' && !record.teachingId && !record.teacherTcrId);

  // Parse new Learning ID format: LRN(\d{3,4})-TCR(\d{3,4})CRS(\d{3,4})
  const lrnFullMatch = !isAwaiting && displayId.match(/^LRN(\d{3,4})-TCR(\d{3,4})CRS(\d{3,4})$/);

  // Parse Teaching ID format: TCR(\d{3,4})CRS(\d{3,4})
  const tcrMatch = !isAwaiting && !lrnFullMatch && displayId.match(/^TCR(\d{3,4})CRS(\d{3,4})$/);

  // Parse Student ID format: STU(\d{3,4})
  const stuMatch = !isAwaiting && !lrnFullMatch && !tcrMatch && displayId.match(/^STU(\d{3,4})$/);

  // Build context for decode popover
  const decodeContext = {
    ...context,
    skillName: record?.name || record?.skill || context.skillName || context.name,
    studentId: record?.studentId || context.studentId,
    userName: context.userName,
    peerName: record?.partnerName || record?.teacher || record?.learner || context.peerName,
    learnerName: record?.learnerName || context.learnerName,
    teacherName: record?.teacherName || record?.partnerName || context.teacherName
  };

  const decodedSentence = isAwaiting
    ? (decodeContext.skillName
      ? `Awaiting teacher for "${decodeContext.skillName}". Your Learning ID will be generated upon matching.`
      : 'No teacher assigned yet. You will get a Learning ID once matched with a course.')
    : decodeReadableId(displayId, decodeContext);

  const handleCopy = (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (isAwaiting || !displayId) return;

    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(displayId);
    } else {
      const textarea = document.createElement('textarea');
      textarea.value = displayId;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      try {
        document.execCommand('copy');
      } catch (err) {
        // ignore
      }
      document.body.removeChild(textarea);
    }

    setCopied(true);
    showAnimeIdToast(`Copied ${displayId} to clipboard!`);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleCopy(e);
    }
  };

  // Render Awaiting Teacher sticker
  if (isAwaiting) {
    const requestedSkill = decodeContext.skillName || '';
    return (
      <div
        className="anime-id-chip-container"
        onMouseEnter={() => setShowDecode(true)}
        onMouseLeave={() => setShowDecode(false)}
        onFocus={() => setShowDecode(true)}
        onBlur={() => setShowDecode(false)}
      >
        <span
          tabIndex={0}
          className={`anime-id-chip chip-awaiting chip-size-${size} ${className}`}
          aria-label={`Awaiting teacher ${requestedSkill ? `for ${requestedSkill}` : ''}. ${decodedSentence}`}
        >
          <Clock size={11} className="text-slate-500 mr-1 flex-shrink-0" />
          <span className="font-bold text-slate-700">Awaiting teacher</span>
          {requestedSkill && (
            <span className="text-slate-500 font-medium ml-1 text-[10px]">({requestedSkill})</span>
          )}
        </span>

        {showDecode && (
          <div className="anime-id-decode-popover" ref={popoverRef} role="tooltip">
            <div className="decode-popover-arrow" aria-hidden="true" />
            <div className="decode-popover-header">
              <Info size={11} className="text-slate-500 mr-1 inline" />
              <span className="decode-id-title">Request Status</span>
            </div>
            <p className="decode-popover-text">{decodedSentence}</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      className="anime-id-chip-container"
      onMouseEnter={() => setShowDecode(true)}
      onMouseLeave={() => setShowDecode(false)}
      onFocus={() => setShowDecode(true)}
      onBlur={() => setShowDecode(false)}
    >
      <span
        role="button"
        tabIndex={0}
        className={`anime-id-chip chip-size-${size} ${lrnFullMatch ? 'chip-type-lrn-full' : tcrMatch ? 'chip-type-tcr' : stuMatch ? 'chip-type-stu' : ''} ${className}`}
        onClick={handleCopy}
        onKeyDown={handleKeyDown}
        aria-label={`${displayId}. Click to copy. ${decodedSentence}`}
        title="Click to copy ID"
      >
        {label && <span className="chip-external-label">{label}:</span>}

        {/* 1. Learning ID: LRN007-TCR004CRS001 */}
        {lrnFullMatch ? (
          <span className="anime-chip-segments">
            {/* Prefix: Pink LRN */}
            <span className="segment-prefix prefix-lrn">LRN</span>
            {/* Learner student #: Ink bold */}
            <span className="segment-student-no">{lrnFullMatch[1]}</span>
            {/* Hyphen */}
            <span className="segment-hyphen">-</span>
            {/* Embedded Teacher Teaching ID in lighter blue sticker container */}
            <span className="lrn-teacher-group">
              <span className="segment-prefix prefix-tcr">TCR</span>
              <span className="segment-student-no">{lrnFullMatch[2]}</span>
              <span className="segment-course-no">CRS{lrnFullMatch[3]}</span>
            </span>
          </span>
        ) : tcrMatch ? (
          /* 2. Teaching ID: TCR004CRS001 */
          <span className="anime-chip-segments">
            <span className="segment-prefix prefix-tcr">TCR</span>
            <span className="segment-student-no">{tcrMatch[1]}</span>
            <span className="segment-course-no">CRS{tcrMatch[2]}</span>
          </span>
        ) : stuMatch ? (
          /* 3. Student ID: STU004 */
          <span className="anime-chip-segments">
            <span className="segment-prefix prefix-stu">STU</span>
            <span className="segment-student-no">{stuMatch[1]}</span>
          </span>
        ) : (
          /* Fallback display */
          <span className="anime-chip-label">{displayId}</span>
        )}

        {copied ? (
          <Check size={11} className="anime-chip-icon text-emerald-600 flex-shrink-0" />
        ) : (
          <Copy size={10} className="anime-chip-icon flex-shrink-0" />
        )}

        {copied && <span className="anime-chip-copied-bubble">Copied!</span>}
      </span>

      {/* Decode Popover on Hover / Click / Focus */}
      {showDecode && decodedSentence && (
        <div className="anime-id-decode-popover" ref={popoverRef} role="tooltip">
          <div className="decode-popover-arrow" aria-hidden="true" />
          <div className="decode-popover-header">
            <Info size={11} className="text-indigo-500 mr-1 inline" />
            <span className="decode-id-title">{displayId}</span>
          </div>
          <p className="decode-popover-text">{decodedSentence}</p>
          <span className="decode-popover-hint">Click chip to copy ID</span>
        </div>
      )}
    </div>
  );
}
