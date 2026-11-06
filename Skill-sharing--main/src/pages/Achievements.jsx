import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import {
  Award,
  BookOpen,
  Layers,
  CheckCircle2,
  GraduationCap,
  Zap,
  Sparkles,
  Clock,
  Lock,
  Star,
  Calendar,
  ArrowRight,
  TrendingUp,
  Plus,
  Search,
  Crown,
  X,
  ChevronRight,
  ChevronDown,
  Info,
  RotateCcw,
  Copy,
  Check
} from 'lucide-react';
import { useAuth } from '../utils/auth.js';
import RankUpBurst from '../components/RankUpBurst.jsx';
import SkillMasterRewardModal from '../components/SkillMasterRewardModal.jsx';
import {
  getBadgeProgress,
  SKILL_MASTER_TARGET,
  BADGE_DEFINITIONS
} from '../utils/badgeEngine.js';
import './Achievements.css';

/**
 * Renders thematic icon for a badge inside circle container
 */
const renderBadgeIcon = (iconName, isUnlocked, size = 26) => {
  const props = { size, strokeWidth: 2.2 };
  switch (iconName) {
    case 'BookOpen':
      return <BookOpen {...props} />;
    case 'Layers':
      return <Layers {...props} />;
    case 'CheckCircle2':
      return <CheckCircle2 {...props} />;
    case 'GraduationCap':
      return <GraduationCap {...props} />;
    case 'Zap':
      return <Zap {...props} />;
    case 'Award':
      return <Award {...props} />;
    case 'Sparkles':
      return <Sparkles {...props} />;
    case 'Clock':
      return <Clock {...props} />;
    case 'Calendar':
      return <Calendar {...props} />;
    case 'Star':
      return <Star {...props} />;
    default:
      return <Award {...props} />;
  }
};

const Achievements = () => {
  const { user } = useAuth();
  const shouldReduceMotion = useReducedMotion();

  // Control states
  const [activeTab, setActiveTab] = useState('All'); // 'All', 'Earned', 'In progress', 'Locked'
  const [selectedCategory, setSelectedCategory] = useState('All'); // 'All', 'Teaching', 'Learning', 'Milestone'
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('recommended'); // 'recommended', 'newest', 'closest', 'alphabetical'
  const [selectedBadgeId, setSelectedBadgeId] = useState(null);
  const [showRewardModal, setShowRewardModal] = useState(false);
  const [copiedBadgeId, setCopiedBadgeId] = useState(null);

  const gridRef = useRef(null);
  const drawerRef = useRef(null);
  const closeBtnRef = useRef(null);
  const lastActiveCardRef = useRef(null);

  // Evaluate rich progress data for all badges
  const enrichedBadges = useMemo(() => {
    return BADGE_DEFINITIONS.map((def) => {
      const progress = getBadgeProgress(def, user || {});
      let status = 'Locked';
      if (progress.earned) {
        status = 'Earned';
      } else if (progress.current > 0) {
        status = 'In progress';
      }

      return {
        ...def,
        status,
        progress
      };
    });
  }, [user]);

  // Derived selected badge from unified selectedBadgeId
  const selectedBadge = useMemo(() => {
    if (!selectedBadgeId) return null;
    return enrichedBadges.find((b) => b.id === selectedBadgeId) || null;
  }, [selectedBadgeId, enrichedBadges]);

  // Counts for tabs & header
  const earnedBadges = useMemo(
    () => enrichedBadges.filter((b) => b.status === 'Earned'),
    [enrichedBadges]
  );
  const inProgressBadges = useMemo(
    () => enrichedBadges.filter((b) => b.status === 'In progress'),
    [enrichedBadges]
  );
  const lockedBadges = useMemo(
    () => enrichedBadges.filter((b) => b.status === 'Locked'),
    [enrichedBadges]
  );

  const totalCount = enrichedBadges.length;
  const earnedCount = earnedBadges.length;
  const inProgressCount = inProgressBadges.length;
  const lockedCount = lockedBadges.length;

  const isSkillMasterUnlocked = earnedCount >= SKILL_MASTER_TARGET;
  const cappedProgress = Math.min(earnedCount, SKILL_MASTER_TARGET);

  // SVG Progress Ring calculations
  const ringRadius = 38;
  const ringCircumference = 2 * Math.PI * ringRadius;
  const ringOffset =
    ringCircumference - (cappedProgress / SKILL_MASTER_TARGET) * ringCircumference;

  // Categories list from existing badge definitions
  const categoriesList = useMemo(() => {
    const set = new Set();
    BADGE_DEFINITIONS.forEach((b) => {
      if (b.category) set.add(b.category);
    });
    return ['All', ...Array.from(set)];
  }, []);

  // Top 3 closest-to-unlock badges for "Next up" list
  const nextUpBadges = useMemo(() => {
    if (inProgressBadges.length === 0) return [];
    return [...inProgressBadges]
      .sort((a, b) => {
        if (b.progress.percent !== a.progress.percent) {
          return b.progress.percent - a.progress.percent;
        }
        return (
          a.progress.target -
          a.progress.current -
          (b.progress.target - b.progress.current)
        );
      })
      .slice(0, 3);
  }, [inProgressBadges]);

  // Recently earned badges for the Shelf (up to 5, newest first)
  const recentlyEarnedBadges = useMemo(() => {
    return [...earnedBadges]
      .sort((a, b) =>
        (b.progress.earnedDate || '').localeCompare(a.progress.earnedDate || '')
      )
      .slice(0, 5);
  }, [earnedBadges]);

  // Filtered & Sorted badges for the main grid
  const displayedBadges = useMemo(() => {
    let list = [...enrichedBadges];

    // Status Tab filter
    if (activeTab === 'Earned') {
      list = list.filter((b) => b.status === 'Earned');
    } else if (activeTab === 'In progress') {
      list = list.filter((b) => b.status === 'In progress');
    } else if (activeTab === 'Locked') {
      list = list.filter((b) => b.status === 'Locked');
    }

    // Category filter
    if (selectedCategory !== 'All') {
      list = list.filter((b) => b.category === selectedCategory);
    }

    // Search query filter (name, criterion, or category)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (b) =>
          b.title.toLowerCase().includes(q) ||
          b.criterion.toLowerCase().includes(q) ||
          (b.category && b.category.toLowerCase().includes(q))
      );
    }

    // Sorting
    list.sort((a, b) => {
      if (sortBy === 'newest') {
        if (a.status === 'Earned' && b.status !== 'Earned') return -1;
        if (b.status === 'Earned' && a.status !== 'Earned') return 1;
        return (b.progress.earnedDate || '').localeCompare(
          a.progress.earnedDate || ''
        );
      }

      if (sortBy === 'closest') {
        if (b.progress.percent !== a.progress.percent) {
          return b.progress.percent - a.progress.percent;
        }
        return (
          a.progress.target -
          a.progress.current -
          (b.progress.target - b.progress.current)
        );
      }

      if (sortBy === 'alphabetical') {
        return a.title.localeCompare(b.title);
      }

      // Recommended (default):
      // 1. Earned (newest first)
      // 2. In progress (closest to unlock first)
      // 3. Locked
      const statusWeight = { Earned: 1, 'In progress': 2, Locked: 3 };
      if (statusWeight[a.status] !== statusWeight[b.status]) {
        return statusWeight[a.status] - statusWeight[b.status];
      }

      if (a.status === 'In progress') {
        return b.progress.percent - a.progress.percent;
      }

      if (a.status === 'Earned') {
        return (b.progress.earnedDate || '').localeCompare(
          a.progress.earnedDate || ''
        );
      }

      return a.title.localeCompare(b.title);
    });

    return list;
  }, [enrichedBadges, activeTab, selectedCategory, searchQuery, sortBy]);

  // Drawer accessibility & focus trap
  useEffect(() => {
    if (selectedBadge) {
      document.body.style.overflow = 'hidden';
      const timer = setTimeout(() => {
        closeBtnRef.current?.focus({ preventScroll: true });
      }, 50);

      const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
          e.preventDefault();
          handleCloseDrawer();
          return;
        }

        // Focus trap inside drawer
        if (e.key === 'Tab' && drawerRef.current) {
          const focusables = drawerRef.current.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          );
          if (focusables.length > 0) {
            const first = focusables[0];
            const last = focusables[focusables.length - 1];
            if (e.shiftKey && document.activeElement === first) {
              e.preventDefault();
              last.focus();
            } else if (!e.shiftKey && document.activeElement === last) {
              e.preventDefault();
              first.focus();
            }
          }
        }
      };

      window.addEventListener('keydown', handleKeyDown);

      return () => {
        clearTimeout(timer);
        window.removeEventListener('keydown', handleKeyDown);
        document.body.style.overflow = '';
        lastActiveCardRef.current?.focus?.({ preventScroll: true });
      };
    }
  }, [selectedBadge]);

  const handleOpenBadge = (badgeId, event) => {
    lastActiveCardRef.current = event?.currentTarget || null;
    setSelectedBadgeId(badgeId);
    setCopiedBadgeId(null);
  };

  const handleCloseDrawer = () => {
    setSelectedBadgeId(null);
    setCopiedBadgeId(null);
  };

  // View All Earned link handler: sets tab to Earned, resets category, clears search, smoothly scrolls to grid
  const handleViewAllEarned = (e) => {
    e?.preventDefault();
    setActiveTab('Earned');
    setSelectedCategory('All');
    setSearchQuery('');
    setTimeout(() => {
      gridRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 60);
  };

  // Copy Badge Card text snippet for sharing
  const handleCopyBadgeCard = (badge) => {
    if (!badge) return;
    const shareText = `I earned ${badge.title} on 4S: ${badge.criterion}`;
    try {
      navigator.clipboard.writeText(shareText);
      setCopiedBadgeId(badge.id);
      setTimeout(() => {
        setCopiedBadgeId((current) => (current === badge.id ? null : current));
      }, 2400);
    } catch (e) {
      // Fallback
    }
  };

  return (
    <div className="achievements-page">
      <div className="container">
        {/* Page Heading: Clean 1-line desktop subtitle */}
        <div className="achievements-page-heading">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="achievements-kicker">
              <Award size={13} className="text-secondary" />
              <span>Campus Badges &amp; Milestones</span>
            </span>
          </div>
          <h1 className="achievements-page-title">Achievements &amp; Badges</h1>
          <p className="achievements-page-subtitle">
            Earn verifiable peer reputation on campus with exact numeric criteria tracked in real time through sessions, skills, and peer reviews.
          </p>
        </div>

        {/* ==================================================================
            1. HEADER: Compact Skill Master Card + Next Up Strip
            ================================================================== */}
        <div className="ach-header-card">
          <div className="ach-header-card-main">
            {/* Left: Skill Master Circular Progress Ring */}
            <div
              className={`ach-ring-block ${isSkillMasterUnlocked ? 'cursor-pointer' : ''}`}
              onClick={() => {
                if (isSkillMasterUnlocked) setShowRewardModal(true);
              }}
              role={isSkillMasterUnlocked ? 'button' : undefined}
              tabIndex={isSkillMasterUnlocked ? 0 : undefined}
              onKeyDown={(e) => {
                if (isSkillMasterUnlocked && (e.key === 'Enter' || e.key === ' ')) {
                  e.preventDefault();
                  setShowRewardModal(true);
                }
              }}
              title={
                isSkillMasterUnlocked
                  ? 'Skill Master Unlocked! Click to view certificate.'
                  : `${SKILL_MASTER_TARGET - cappedProgress} more badges to unlock Skill Master`
              }
              aria-label={
                isSkillMasterUnlocked
                  ? 'Skill Master Unlocked! Click to view certificate.'
                  : `${cappedProgress} of ${SKILL_MASTER_TARGET} badges toward Skill Master`
              }
            >
              <div className="ach-svg-ring-wrap" aria-hidden="true">
                <svg className="ach-svg-ring" viewBox="0 0 92 92">
                  <circle
                    className="ach-ring-bg"
                    cx="46"
                    cy="46"
                    r={ringRadius}
                  />
                  <circle
                    className="ach-ring-fill"
                    cx="46"
                    cy="46"
                    r={ringRadius}
                    style={{
                      strokeDasharray: ringCircumference,
                      strokeDashoffset: ringOffset
                    }}
                  />
                </svg>
                <div className="ach-ring-center">
                  <span className="ach-ring-number">
                    {cappedProgress} / {SKILL_MASTER_TARGET}
                  </span>
                </div>
              </div>
              <div className="ach-ring-label-box">
                <span className="ach-ring-label">Skill Master progress</span>
                <span className="ach-ring-caption">
                  {isSkillMasterUnlocked
                    ? 'Skill Master Milestone Unlocked!'
                    : `${SKILL_MASTER_TARGET - cappedProgress} more badges to unlock`}
                </span>
              </div>
            </div>

            {/* Right: 4 Identical Stat Tiles in a Row & View Reward Button */}
            <div className="ach-stats-group">
              <div className="ach-stat-tiles-row">
                <div className="ach-stat-tile tile-earned">
                  <span className="ach-stat-val">{earnedCount}</span>
                  <span className="ach-stat-lbl">Earned</span>
                </div>
                <div className="ach-stat-tile tile-progress">
                  <span className="ach-stat-val">{inProgressCount}</span>
                  <span className="ach-stat-lbl">In Progress</span>
                </div>
                <div className="ach-stat-tile tile-locked">
                  <span className="ach-stat-val">{lockedCount}</span>
                  <span className="ach-stat-lbl">Locked</span>
                </div>
                <div className="ach-stat-tile tile-total">
                  <span className="ach-stat-val">{totalCount}</span>
                  <span className="ach-stat-lbl">Total</span>
                </div>
              </div>

              {/* View Skill Master Reward Button */}
              <div className="ach-reward-action-wrap">
                <button
                  type="button"
                  className={`ach-view-reward-btn ${isSkillMasterUnlocked ? 'active' : 'disabled'}`}
                  onClick={() => {
                    if (isSkillMasterUnlocked) setShowRewardModal(true);
                  }}
                  disabled={!isSkillMasterUnlocked}
                  title={
                    isSkillMasterUnlocked
                      ? 'View Skill Master Reward Certificate'
                      : `${SKILL_MASTER_TARGET - cappedProgress} more badges to unlock Skill Master`
                  }
                  aria-label={
                    isSkillMasterUnlocked
                      ? 'View Skill Master Reward Certificate'
                      : `${SKILL_MASTER_TARGET - cappedProgress} more badges to unlock Skill Master`
                  }
                >
                  <Crown
                    size={16}
                    className={
                      isSkillMasterUnlocked ? 'text-amber-300' : 'text-slate-400'
                    }
                  />
                  <span>
                    {isSkillMasterUnlocked
                      ? 'View Skill Master Reward'
                      : `Earn ${SKILL_MASTER_TARGET} badges to unlock`}
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Next Up Strip: Top 3 closest-to-unlock badges in 3-column grid */}
          {nextUpBadges.length > 0 && (
            <div className="ach-nextup-strip">
              <div className="ach-nextup-header-row">
                <span className="ach-nextup-section-kicker">Next Up Milestones</span>
                <span className="ach-nextup-section-sub">
                  Closest badges in progress toward unlock (click any row for details)
                </span>
              </div>
              <div className="ach-nextup-list">
                {nextUpBadges.map((badge) => (
                  <button
                    key={badge.id}
                    type="button"
                    className="ach-nextup-row-card"
                    onClick={(e) => handleOpenBadge(badge.id, e)}
                    aria-label={`View details for ${badge.title}: ${badge.progress.current} of ${badge.progress.target} ${badge.progress.unit}. ${badge.progress.remainingText}`}
                  >
                    {/* Column 1: 56px circle icon, never overlapped */}
                    <div className="ach-nextup-badge-icon">
                      {renderBadgeIcon(badge.icon, true, 26)}
                    </div>

                    {/* Column 2: Text column */}
                    <div className="ach-nextup-text-col">
                      <div className="ach-nextup-meta-line">
                        <span className="ach-nextup-tag">NEXT UP</span>
                        <strong className="ach-nextup-title">{badge.title}</strong>
                        <span className="ach-nextup-pct">
                          ({badge.progress.percent}%)
                        </span>
                      </div>
                      <p className="ach-nextup-progress-line">
                        <span className="ach-nextup-numbers">
                          {badge.progress.current} / {badge.progress.target}{' '}
                          {badge.progress.unit}
                        </span>
                        <span className="ach-nextup-separator">—</span>
                        <span className="ach-nextup-remaining">
                          {badge.progress.remainingText}
                        </span>
                      </p>
                      <div className="ach-nextup-bar-track">
                        <div
                          className="ach-nextup-bar-fill"
                          style={{ width: `${badge.progress.percent}%` }}
                        />
                      </div>
                    </div>

                    {/* Column 3: Details button right-aligned and vertically centred */}
                    <div className="ach-nextup-action-col">
                      <span className="ach-nextup-btn" aria-hidden="true">
                        <span>Details</span>
                        <ChevronRight size={14} />
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ==================================================================
            2. CONTROLS: Tabs, Search Box (44px), Sort Select (44px)
            ================================================================== */}
        <div className="ach-controls-bar">
          {/* Tabs with exact counts */}
          <div
            className="ach-tabs-scroll-container"
            role="tablist"
            aria-label="Badge Status Tabs"
          >
            <button
              role="tab"
              aria-selected={activeTab === 'All'}
              className={`ach-status-tab ${activeTab === 'All' ? 'active' : ''}`}
              onClick={() => setActiveTab('All')}
            >
              <span>All</span>
              <span className="tab-count-pill">{totalCount}</span>
            </button>
            <button
              role="tab"
              aria-selected={activeTab === 'Earned'}
              className={`ach-status-tab ${activeTab === 'Earned' ? 'active' : ''}`}
              onClick={() => setActiveTab('Earned')}
            >
              <span>Earned</span>
              <span className="tab-count-pill pill-earned">{earnedCount}</span>
            </button>
            <button
              role="tab"
              aria-selected={activeTab === 'In progress'}
              className={`ach-status-tab ${activeTab === 'In progress' ? 'active' : ''}`}
              onClick={() => setActiveTab('In progress')}
            >
              <span>In progress</span>
              <span className="tab-count-pill pill-progress">{inProgressCount}</span>
            </button>
            <button
              role="tab"
              aria-selected={activeTab === 'Locked'}
              className={`ach-status-tab ${activeTab === 'Locked' ? 'active' : ''}`}
              onClick={() => setActiveTab('Locked')}
            >
              <span>Locked</span>
              <span className="tab-count-pill pill-locked">{lockedCount}</span>
            </button>
          </div>

          {/* Search Box & Sort Select Group (Both 44px height) */}
          <div className="ach-search-sort-group">
            <div className="ach-search-box">
              <Search size={18} className="ach-search-icon" aria-hidden="true" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search badges..."
                className="ach-search-input"
                style={{ paddingLeft: '46px', paddingRight: '38px' }}
                aria-label="Search badges by title, rule, or category"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="ach-search-clear"
                  aria-label="Clear search query"
                >
                  <X size={15} />
                </button>
              )}
            </div>

            <div className="ach-sort-box">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="ach-sort-select"
                aria-label="Sort badges order"
              >
                <option value="recommended">Sort: Recommended</option>
                <option value="newest">Sort: Newest earned</option>
                <option value="closest">Sort: Closest to unlock</option>
                <option value="alphabetical">Sort: A to Z</option>
              </select>
              <ChevronDown size={16} className="ach-sort-chevron" aria-hidden="true" />
            </div>
          </div>
        </div>

        {/* ==================================================================
            2C. CATEGORY FILTER CHIPS: Teaching, Learning, Milestone
            ================================================================== */}
        {categoriesList.length > 1 && (
          <div className="ach-category-chips-row" role="group" aria-label="Filter by Category">
            <span className="ach-category-label">Category:</span>
            {categoriesList.map((cat) => {
              const count =
                cat === 'All'
                  ? totalCount
                  : enrichedBadges.filter((b) => b.category === cat).length;
              return (
                <button
                  key={cat}
                  type="button"
                  className={`ach-category-chip ${
                    selectedCategory === cat ? 'active' : ''
                  }`}
                  onClick={() => setSelectedCategory(cat)}
                  aria-pressed={selectedCategory === cat}
                >
                  <span>{cat}</span>
                  <span className="ach-cat-count">({count})</span>
                </button>
              );
            })}
          </div>
        )}

        {/* ==================================================================
            2A. RECENTLY EARNED SHELF: Horizontal mini-cards row
            ================================================================== */}
        {recentlyEarnedBadges.length > 0 && activeTab !== 'In progress' && activeTab !== 'Locked' && (
          <div className="ach-earned-shelf">
            <div className="ach-earned-shelf-header">
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-amber-500" />
                <h3 className="ach-earned-shelf-title">Recently Earned Badges</h3>
              </div>
              <button
                type="button"
                className="ach-shelf-view-all-btn"
                onClick={handleViewAllEarned}
                aria-label={`View all ${earnedCount} earned badges`}
              >
                <span>View all earned ({earnedCount})</span>
                <ArrowRight size={13} />
              </button>
            </div>

            <div className="ach-earned-shelf-scroll">
              {recentlyEarnedBadges.map((badge) => (
                <button
                  key={`shelf-${badge.id}`}
                  type="button"
                  className="ach-shelf-mini-card"
                  onClick={(e) => handleOpenBadge(badge.id, e)}
                  title={`${badge.title} — Earned on ${badge.progress.earnedDate}. Click for details.`}
                  aria-label={`${badge.title}, Earned on ${badge.progress.earnedDate}. Click for details.`}
                >
                  <div
                    className={`ach-shelf-mini-icon ${badge.badgeClass || 'badge-gold'}`}
                  >
                    {renderBadgeIcon(badge.icon, true, 18)}
                  </div>
                  <div className="ach-shelf-mini-info">
                    <span className="ach-shelf-mini-title truncate">{badge.title}</span>
                    <span className="ach-shelf-mini-date">{badge.progress.earnedDate}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ==================================================================
            2B. BADGES GRID (CSS Grid with Equal-Height Cards directly under shelf)
            ================================================================== */}
        {displayedBadges.length > 0 ? (
          <div id="badges-grid" ref={gridRef} className="ach-badges-grid">
            {displayedBadges.map((badge, index) => {
              const { progress, status } = badge;
              const isEarned = status === 'Earned';
              const isInProgress = status === 'In progress';

              return (
                <motion.button
                  key={badge.id}
                  type="button"
                  className={`ach-badge-card ${
                    isEarned
                      ? 'card-earned'
                      : isInProgress
                      ? 'card-in-progress'
                      : 'card-locked'
                  }`}
                  onClick={(e) => handleOpenBadge(badge.id, e)}
                  aria-label={`${badge.title} badge, ${status}, ${progress.current} of ${progress.target} ${progress.unit}. ${badge.criterion}. Click for full details.`}
                  initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={
                    shouldReduceMotion
                      ? { duration: 0.05 }
                      : {
                          duration: 0.22,
                          delay: Math.min((index % 6) * 0.04, 0.24)
                        }
                  }
                >
                  {/* Slow Shine Sweep Overlay on Earned Badges */}
                  {isEarned && !shouldReduceMotion && (
                    <div className="badge-shine-sweep" aria-hidden="true" />
                  )}

                  {/* One-time Rank-Up Burst for Unlocked Badges */}
                  {isEarned && <RankUpBurst delay={(index % 4) * 0.05 + 0.1} />}

                  {/* "NEW" Ribbon if earned within last 7 days */}
                  {progress.isNew && (
                    <span className="badge-new-corner-ribbon">NEW</span>
                  )}

                  {/* 1. Icon in 64px circle */}
                  <div className="ach-card-top-row">
                    <div
                      className={`ach-icon-circle ${
                        isEarned
                          ? badge.badgeClass || 'badge-gold'
                          : isInProgress
                          ? 'icon-in-progress'
                          : 'icon-locked'
                      }`}
                    >
                      {renderBadgeIcon(badge.icon, isEarned || isInProgress, 28)}
                    </div>

                    <span className="ach-card-category-tag">{badge.category}</span>
                  </div>

                  {/* 2. Badge Name in Bangers, 1 line with ellipsis & tooltip */}
                  <h3 className="ach-card-title" title={badge.title}>
                    {badge.title}
                  </h3>

                  {/* 3. Criterion Text: max 2 lines clamp with full tooltip */}
                  <p className="ach-card-criterion" title={badge.criterion}>
                    {badge.criterion}
                  </p>

                  {/* 4. Status Area Pinned to Bottom (margin-top: auto) */}
                  <div className="ach-card-status-area">
                    {isEarned ? (
                      /* Earned Status: Gold Chip & Earned Date */
                      <div className="ach-status-earned-box">
                        <span className="status-chip chip-gold">
                          <CheckCircle2 size={12} />
                          <span>Earned</span>
                        </span>
                        <span className="status-earned-date">{progress.earnedDate}</span>
                      </div>
                    ) : isInProgress ? (
                      /* In Progress Status: Progress numbers, Teal bar, Remaining text */
                      <div className="ach-status-progress-box">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="font-bold text-slate-800 font-mono">
                            {progress.current} / {progress.target} {progress.unit}
                          </span>
                          <span className="font-extrabold text-teal-600 font-mono text-[11px]">
                            {progress.percent}%
                          </span>
                        </div>
                        <div className="ach-progress-bar-track">
                          <div
                            className="ach-progress-bar-fill"
                            style={{ width: `${progress.percent}%` }}
                          />
                        </div>
                        <span className="ach-remaining-text">
                          {progress.remainingText}
                        </span>
                      </div>
                    ) : (
                      /* Locked Status: Grey Chip, 0 / Target, Remaining text */
                      <div className="ach-status-locked-box">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="status-chip chip-locked">
                            <Lock size={11} />
                            <span>Locked</span>
                          </span>
                          <span className="font-bold text-slate-400 font-mono text-[11px]">
                            0 / {progress.target}
                          </span>
                        </div>
                        <span className="ach-remaining-text text-slate-400">
                          {progress.remainingText}
                        </span>
                      </div>
                    )}
                  </div>
                </motion.button>
              );
            })}
          </div>
        ) : (
          /* Empty State per Tab / Search */
          <div className="ach-empty-state-box">
            <div className="ach-empty-icon-box">
              <Award size={36} className="text-primary" />
            </div>
            <h3 className="ach-empty-title">
              {searchQuery
                ? 'No Matching Badges Found'
                : selectedCategory !== 'All'
                ? `No ${selectedCategory} Badges in "${activeTab}"`
                : activeTab === 'Earned'
                ? 'No Earned Badges Yet'
                : activeTab === 'In progress'
                ? 'No Badges Currently In Progress'
                : activeTab === 'Locked'
                ? 'All Badges Unlocked or Started!'
                : 'No Badges Found'}
            </h3>
            <p className="ach-empty-desc">
              {searchQuery
                ? `No badges match "${searchQuery}". Try searching by skill name, criterion keywords, or category.`
                : activeTab === 'Earned'
                ? 'Complete your first study session or publish a skill offering to unlock your first verified badge.'
                : activeTab === 'In progress'
                ? 'Schedule a session or post a learning goal to start progressing toward campus honors.'
                : activeTab === 'Locked'
                ? 'Incredible effort! You have made active progress or unlocked every badge currently on campus.'
                : 'Try adjusting your filters or search keywords.'}
            </p>
            <div className="ach-empty-cta-row">
              {searchQuery || selectedCategory !== 'All' ? (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('All');
                    setActiveTab('All');
                  }}
                  className="btn btn-outline"
                >
                  <RotateCcw size={14} />
                  <span>Reset Filters</span>
                </button>
              ) : activeTab === 'Earned' ? (
                <Link to="/sessions" className="btn btn-primary">
                  <Calendar size={14} />
                  <span>Schedule First Session</span>
                </Link>
              ) : (
                <Link to="/my-skills" className="btn btn-primary">
                  <Plus size={14} />
                  <span>Add a Skill to Teach</span>
                </Link>
              )}
            </div>
          </div>
        )}

        {/* Helpful Tip Box at Bottom */}
        <div className="ach-tip-box">
          <div className="flex items-center gap-3">
            <div className="ach-tip-icon-box">
              <TrendingUp size={20} />
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-900 m-0">
                Want to unlock Skill Master faster?
              </h4>
              <p className="text-xs text-slate-600 m-0 mt-0.5">
                Maintain 5-star ratings from peer learners and complete mutual study sessions to reach 8 badges for the official Skill Master title and gold profile ring.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <Link to="/matches" className="btn btn-sm btn-primary">
              <span>Find Study Matches</span>
              <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </div>

      {/* ==================================================================
          DETAIL DRAWER: Slides in from right (bottom sheet on mobile)
          Controlled by unified selectedBadgeId state
          ================================================================== */}
      <AnimatePresence>
        {selectedBadge && (
          <motion.div
            key="drawer-overlay"
            className="ach-drawer-overlay"
            onClick={handleCloseDrawer}
            role="presentation"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
          >
            <motion.div
              ref={drawerRef}
              key="drawer-panel"
              className="ach-drawer-panel"
              role="dialog"
              aria-modal="true"
              aria-label={`Badge details: ${selectedBadge.title}`}
              onClick={(e) => e.stopPropagation()}
              initial={
                shouldReduceMotion
                  ? { opacity: 0 }
                  : { x: '100%' }
              }
              animate={
                shouldReduceMotion
                  ? { opacity: 1 }
                  : { x: 0 }
              }
              exit={
                shouldReduceMotion
                  ? { opacity: 0 }
                  : { x: '100%' }
              }
              transition={{ type: 'spring', damping: 28, stiffness: 350 }}
            >
              {/* Drawer Header */}
              <div className="ach-drawer-header">
                <span className="font-heading text-xs tracking-wider uppercase text-slate-500">
                  {selectedBadge.category} Milestone
                </span>
                <button
                  ref={closeBtnRef}
                  type="button"
                  onClick={handleCloseDrawer}
                  className="ach-drawer-close-btn"
                  aria-label="Close badge details"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Drawer Main Info */}
              <div className="ach-drawer-body">
                {/* 76px Icon Circle */}
                <div
                  className={`ach-drawer-icon-box ${
                    selectedBadge.status === 'Earned'
                      ? selectedBadge.badgeClass || 'badge-gold'
                      : selectedBadge.status === 'In progress'
                      ? 'icon-in-progress'
                      : 'icon-locked'
                  }`}
                >
                  {renderBadgeIcon(
                    selectedBadge.icon,
                    selectedBadge.status !== 'Locked',
                    34
                  )}
                </div>

                <h2 className="ach-drawer-title">{selectedBadge.title}</h2>

                {/* Status Pill in Drawer */}
                <div className="mb-4">
                  <span
                    className={`status-chip ${
                      selectedBadge.status === 'Earned'
                        ? 'chip-gold'
                        : selectedBadge.status === 'In progress'
                        ? 'chip-teal'
                        : 'chip-locked'
                    }`}
                  >
                    {selectedBadge.status === 'Earned' ? (
                      <>
                        <CheckCircle2 size={12} />
                        <span>Earned on {selectedBadge.progress.earnedDate}</span>
                      </>
                    ) : selectedBadge.status === 'In progress' ? (
                      <>
                        <Clock size={12} />
                        <span>In Progress ({selectedBadge.progress.percent}%)</span>
                      </>
                    ) : (
                      <>
                        <Lock size={12} />
                        <span>Locked</span>
                      </>
                    )}
                  </span>
                </div>

                {/* Exact Criterion Card */}
                <div className="ach-drawer-criterion-card">
                  <span className="ach-drawer-section-lbl">Exact Criterion:</span>
                  <p className="ach-drawer-rule-text">{selectedBadge.criterion}</p>
                </div>

                {/* Progress Details */}
                <div className="ach-drawer-progress-card">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-bold text-slate-700">Progress Breakdown</span>
                    <span className="font-extrabold text-teal-600 font-mono">
                      {selectedBadge.progress.current} / {selectedBadge.progress.target}{' '}
                      {selectedBadge.progress.unit}
                    </span>
                  </div>

                  <div className="ach-progress-bar-track mb-2" style={{ height: '10px' }}>
                    <div
                      className="ach-progress-bar-fill"
                      style={{ width: `${selectedBadge.progress.percent}%` }}
                    />
                  </div>

                  <p className="text-xs text-slate-600 font-medium m-0">
                    {selectedBadge.progress.earned
                      ? 'Milestone fully verified across campus data layer.'
                      : selectedBadge.progress.remainingText}
                  </p>
                </div>

                {/* Trigger Activity Attribution (when known) */}
                {selectedBadge.progress.activityTrigger && (
                  <div className="ach-drawer-activity-card">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 mb-1">
                      <Sparkles size={13} className="text-indigo-600" />
                      <span>Activity Trigger</span>
                    </div>
                    <p className="text-xs text-slate-700 m-0">
                      {selectedBadge.progress.activityTrigger}
                    </p>
                  </div>
                )}

                {/* 2E. SHARE A BADGE: Copy Badge Card Button on Earned Badges */}
                {selectedBadge.status === 'Earned' && (
                  <div className="ach-drawer-share-box">
                    <button
                      type="button"
                      className={`ach-copy-badge-btn ${
                        copiedBadgeId === selectedBadge.id ? 'copied' : ''
                      }`}
                      onClick={() => handleCopyBadgeCard(selectedBadge)}
                      aria-label="Copy badge card to clipboard"
                    >
                      {copiedBadgeId === selectedBadge.id ? (
                        <>
                          <Check size={14} className="text-emerald-600" />
                          <span>Copied to Clipboard!</span>
                        </>
                      ) : (
                        <>
                          <Copy size={14} />
                          <span>Copy Badge Card</span>
                        </>
                      )}
                    </button>
                    <p className="ach-share-snippet-preview">
                      "I earned {selectedBadge.title} on 4S: {selectedBadge.criterion}"
                    </p>
                  </div>
                )}
              </div>

              {/* Drawer Footer Actions */}
              <div className="ach-drawer-footer">
                {selectedBadge.category === 'Teaching' ? (
                  <Link to="/my-skills" className="btn btn-primary w-full justify-center">
                    <span>Manage Teaching Skills</span>
                    <ArrowRight size={14} />
                  </Link>
                ) : selectedBadge.category === 'Learning' ? (
                  <Link to="/requests" className="btn btn-primary w-full justify-center">
                    <span>View Learning Wishlist</span>
                    <ArrowRight size={14} />
                  </Link>
                ) : (
                  <Link to="/sessions" className="btn btn-primary w-full justify-center">
                    <span>View Scheduled Sessions</span>
                    <ArrowRight size={14} />
                  </Link>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ==================================================================
          SKILL MASTER REWARD CELEBRATION MODAL
          ================================================================== */}
      {showRewardModal && (
        <SkillMasterRewardModal
          isOpen={showRewardModal}
          onClose={() => setShowRewardModal(false)}
          userName={user?.name || 'Vidhi Kedia'}
          badgesCount={earnedCount}
        />
      )}
    </div>
  );
};

export default Achievements;
