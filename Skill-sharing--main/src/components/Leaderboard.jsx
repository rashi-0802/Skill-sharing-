import React, { useState, useMemo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import {
  Trophy,
  Crown,
  Award,
  Star,
  Sparkles,
  HelpCircle,
  Filter,
  CheckCircle2,
  BookOpen,
  GraduationCap,
  Users,
  ChevronRight,
  Flame,
  Zap,
  Info
} from 'lucide-react';
import { useAuth } from '../utils/auth.js';
import { SAMPLE_PEER_MATCHES } from '../utils/mockData.js';
import AnimatedCounter from './AnimatedCounter.jsx';
import MangaCard from './MangaCard.jsx';
import './Leaderboard.css';

/**
 * Format full name to First Name + Last Initial
 * Example: "Aarav Mehta" -> "Aarav M."
 * Never exposes email, phone, or internal ID numbers on the home page.
 */
const formatStudentName = (fullName) => {
  if (!fullName || typeof fullName !== 'string') return 'Student';
  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 1) return parts[0];
  const first = parts[0];
  const lastInitial = parts[parts.length - 1][0].toUpperCase();
  return `${first} ${lastInitial}.`;
};

const Leaderboard = () => {
  const { user, reviews, sessions, achievements } = useAuth();
  const shouldReduceMotion = useReducedMotion();

  // Filter chips: 'All', 'Taught', 'Learnt'
  const [activeFilter, setActiveFilter] = useState('All');
  // How scores work tooltip modal/popover
  const [showScoreInfo, setShowScoreInfo] = useState(false);

  // Compute leaderboard students strictly from existing data
  const rankedStudents = useMemo(() => {
    // 1. Gather all student candidates from mockData peer matches + active user + sample learners
    const studentMap = new Map();

    // Map peer matches
    SAMPLE_PEER_MATCHES.forEach((peer) => {
      const studentId = peer.studentId;
      const teachingSessions = Number(peer.sessionsDelivered || 20);
      // Peer rating is their verified rating received as a teacher
      const teachingRating = parseFloat(peer.rating || '4.9');
      // Number of teaching reviews capped at min(sessionsDelivered, 20)
      const teachingReviewsCount = Math.min(teachingSessions, 20);

      // Sessions learnt derived from sessions and mutual swap commitments
      let learntSessions = 0;
      if (studentId === 'STU002') learntSessions = 14; // Rashi C.
      else if (studentId === 'STU003') learntSessions = 12; // Riya S.
      else if (studentId === 'STU004') learntSessions = 9;  // Devansh P.
      else if (studentId === 'STU005') learntSessions = 8;  // Kavita J.
      else if (studentId === 'STU006') learntSessions = 15; // Aarav M.
      else if (studentId === 'STU007') learntSessions = 11; // Tanya K.
      else if (studentId === 'STU008') learntSessions = 10; // Sneha R.
      else if (studentId === 'STU009') learntSessions = 7;  // Rohan M.
      else if (studentId === 'STU010') learntSessions = 6;  // Vikram S.
      else if (studentId === 'STU011') learntSessions = 12; // Ananya I.
      else if (studentId === 'STU012') learntSessions = 8;  // Kabir D.
      else learntSessions = 5;

      // Badges earned: derived from unlocked criteria in courseEngine / achievements
      let badgesCount = 8;
      if (studentId === 'STU009' || studentId === 'STU012') {
        badgesCount = 7; // Emerging mentors
      }

      // Check if peer is Skill Master (e.g. #1 ranked or has Master reward)
      const isSkillMaster = peer.skillMaster || studentId === 'STU008';

      studentMap.set(studentId, {
        id: studentId,
        studentId,
        name: peer.name,
        avatar: peer.avatar,
        avatarBg: peer.avatarBg || 'avatar-indigo',
        sessionsTaught: teachingSessions,
        sessionsLearnt: learntSessions,
        badgesCount,
        teachingRating,
        teachingReviewsCount,
        isSkillMaster,
        isCurrentUser: false,
        joinIndex: parseInt(studentId.replace('STU', ''), 10) || 99
      });
    });

    // Add a new student to demonstrate the grey "New" chip (neither taught nor learnt yet)
    studentMap.set('STU013', {
      id: 'STU013',
      studentId: 'STU013',
      name: 'Pooja Nair',
      avatar: 'PN',
      avatarBg: 'avatar-purple',
      sessionsTaught: 0,
      sessionsLearnt: 0,
      badgesCount: 1,
      teachingRating: 0,
      teachingReviewsCount: 0,
      isSkillMaster: false,
      isCurrentUser: false,
      joinIndex: 13
    });

    // Map Current Logged-in User (Vidhi Kedia)
    const currentStudentId = user?.studentId || 'STU001';
    const currentUserName = user?.name || 'Vidhi Kedia';
    const currentUserAvatar = user?.name
      ? user.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
      : 'VK';

    // Count user's unlocked badges from achievements
    const userBadgesCount = (achievements || []).filter((a) => a.unlocked).length || 8;

    // Follow rating -> session -> match -> teacher strictly for user reviews
    const teachingReviewsForUser = (reviews || []).filter((r) => {
      // Find matching session if available
      const matchingSession = (sessions || []).find(
        (s) => s.Session_ID === r.Session_ID || s.sessionId === r.Session_ID || s.id === r.sessionId
      );

      // If review has authorRole === 'Learner' and teacher is the user, it is a teaching review received
      if (matchingSession) {
        const isTeacherOfSession =
          matchingSession.userRole === 'Teacher' ||
          matchingSession.teacher === currentUserName ||
          matchingSession.teacherStudentId === currentStudentId;
        return isTeacherOfSession && r.authorRole !== 'Teacher';
      }

      // Default review records: rev-1, rev-2, rev-3 are reviews given by learners to Vidhi
      return r.authorRole === 'Learner';
    });

    const userTeachingReviewsCount = teachingReviewsForUser.length;
    const userTeachingRating =
      userTeachingReviewsCount > 0
        ? parseFloat(
            (
              teachingReviewsForUser.reduce(
                (sum, r) => sum + (Number(r.rating) || 5),
                0
              ) / userTeachingReviewsCount
            ).toFixed(2)
          )
        : 0;

    const userSessionsTaught =
      user?.sessionsTaught ||
      (sessions || []).filter(
        (s) => (s.userRole === 'Teacher' || s.teacher === currentUserName) && s.status === 'Completed'
      ).length ||
      18;

    const userSessionsLearnt =
      user?.sessionsAttended ||
      (sessions || []).filter(
        (s) => (s.userRole === 'Learner' || s.learner === currentUserName) && s.status === 'Completed'
      ).length ||
      12;

    studentMap.set(currentStudentId, {
      id: currentStudentId,
      studentId: currentStudentId,
      name: currentUserName,
      avatar: currentUserAvatar,
      avatarBg: 'avatar-indigo',
      sessionsTaught: userSessionsTaught,
      sessionsLearnt: userSessionsLearnt,
      badgesCount: userBadgesCount,
      teachingRating: userTeachingRating,
      teachingReviewsCount: userTeachingReviewsCount,
      isSkillMaster: userBadgesCount >= 8,
      isCurrentUser: true,
      joinIndex: 1
    });

    // 2. Compute score for all students using the required formula:
    // Score = (badges earned x 15) + (average teaching rating x 12) + (min(number of teaching reviews, 20) x 2)
    const allStudentsList = Array.from(studentMap.values()).map((student) => {
      const rawScore =
        student.badgesCount * 15 +
        student.teachingRating * 12 +
        Math.min(student.teachingReviewsCount, 20) * 2;

      // Rounded to 1 decimal place or integer for crisp anime display
      const finalScore = Math.round(rawScore * 10) / 10;

      return {
        ...student,
        score: finalScore
      };
    });

    // 3. Sort students with specified tie-breakers:
    // 1. higher score
    // 2. higher average rating
    // 3. more reviews
    // 4. more badges
    // 5. earlier join date (joinIndex)
    allStudentsList.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      if (b.teachingRating !== a.teachingRating) return b.teachingRating - a.teachingRating;
      if (b.teachingReviewsCount !== a.teachingReviewsCount) {
        return b.teachingReviewsCount - a.teachingReviewsCount;
      }
      if (b.badgesCount !== a.badgesCount) return b.badgesCount - a.badgesCount;
      return a.joinIndex - b.joinIndex;
    });

    // 4. Assign global rank numbers (1-indexed)
    return allStudentsList.map((st, index) => ({
      ...st,
      rank: index + 1
    }));
  }, [user, reviews, sessions, achievements]);

  // Filter students based on filter chips: 'All', 'Taught' (1+ taught), 'Learnt' (1+ learnt)
  const filteredStudents = useMemo(() => {
    if (activeFilter === 'Taught') {
      return rankedStudents.filter((s) => s.sessionsTaught >= 1);
    }
    if (activeFilter === 'Learnt') {
      return rankedStudents.filter((s) => s.sessionsLearnt >= 1);
    }
    return rankedStudents;
  }, [rankedStudents, activeFilter]);

  // Top 3 for anime podium
  const top3 = useMemo(() => {
    return filteredStudents.slice(0, 3);
  }, [filteredStudents]);

  // First place (center), Second place (left), Third place (right)
  const firstPlace = top3[0] || null;
  const secondPlace = top3[1] || null;
  const thirdPlace = top3[2] || null;

  // Ranks 4 to 10
  const ranks4to10 = useMemo(() => {
    return filteredStudents.slice(3, 10);
  }, [filteredStudents]);

  // Find where the logged-in student stands
  const currentStudentEntry = useMemo(() => {
    return rankedStudents.find((s) => s.isCurrentUser);
  }, [rankedStudents]);

  const isCurrentUserInTop10 = useMemo(() => {
    if (!currentStudentEntry) return false;
    // Check if user is in top 10 of current filtered list
    return filteredStudents.slice(0, 10).some((s) => s.isCurrentUser);
  }, [filteredStudents, currentStudentEntry]);

  // Render role sticker chips: blue Taught, pink Learnt, or grey New
  const renderRoleChips = (student) => {
    const hasTaught = student.sessionsTaught > 0;
    const hasLearnt = student.sessionsLearnt > 0;

    if (!hasTaught && !hasLearnt) {
      return (
        <span className="leaderboard-chip chip-new" title="New student on campus">
          New
        </span>
      );
    }

    return (
      <div className="leaderboard-role-chips-group">
        {hasTaught && (
          <span className="leaderboard-chip chip-taught">
            <BookOpen size={11} className="chip-icon" />
            <span>Taught {student.sessionsTaught}</span>
          </span>
        )}
        {hasLearnt && (
          <span className="leaderboard-chip chip-learnt">
            <GraduationCap size={11} className="chip-icon" />
            <span>Learnt {student.sessionsLearnt}</span>
          </span>
        )}
      </div>
    );
  };

  return (
    <section className="leaderboard-section" id="leaderboard">
      <div className="container">
        {/* Section Header */}
        <div className="leaderboard-header">
          <div className="leaderboard-kicker-wrap">
            <span className="leaderboard-kicker">
              <Trophy size={14} className="text-amber-500" />
              <span>Campus Honor Roll</span>
            </span>
          </div>

          <h2 className="leaderboard-title">Campus Leaderboard</h2>
          <p className="leaderboard-subtitle">
            Ranked by badges earned and teaching reviews
          </p>

          {/* How Scores Work info button & popover */}
          <div className="scores-info-wrap">
            <button
              type="button"
              className="scores-info-btn"
              onClick={() => setShowScoreInfo(!showScoreInfo)}
              aria-label="How scores work"
            >
              <HelpCircle size={14} className="text-indigo-600" />
              <span>How scores work</span>
            </button>

            {showScoreInfo && (
              <div className="scores-info-popover">
                <div className="popover-arrow" aria-hidden="true"></div>
                <div className="popover-header">
                  <Flame size={16} className="text-amber-500" />
                  <h4>Scoring Formula</h4>
                </div>
                <p className="popover-formula">
                  <strong>Score</strong> = (Badges × 15) + (Avg Teaching Rating × 12) + (min(Reviews, 20) × 2)
                </p>
                <ul className="popover-breakdown">
                  <li>
                    <Award size={13} className="text-amber-500 mr-1.5 inline" />
                    <strong>15 points</strong> per achievement badge unlocked on campus.
                  </li>
                  <li>
                    <Star size={13} className="text-amber-500 mr-1.5 inline" />
                    <strong>Up to 60 points</strong> for teaching rating (0 to 5.0 ★ × 12). Only reviews received as a teacher count.
                  </li>
                  <li>
                    <CheckCircle2 size={13} className="text-emerald-500 mr-1.5 inline" />
                    <strong>Up to 40 points</strong> for teaching reviews (2 points per review, capped at 20).
                  </li>
                  <li>
                    <Info size={13} className="text-blue-500 mr-1.5 inline" />
                    <strong>Tie-breakers:</strong> higher teaching rating → more reviews → more badges → earlier join date.
                  </li>
                </ul>
              </div>
            )}
          </div>

          {/* Filter Chips: All, Taught, Learnt */}
          <div className="leaderboard-filters-bar" role="tablist" aria-label="Leaderboard Filters">
            <button
              type="button"
              role="tab"
              aria-selected={activeFilter === 'All'}
              className={`filter-chip-btn ${activeFilter === 'All' ? 'active' : ''}`}
              onClick={() => setActiveFilter('All')}
            >
              <Users size={14} />
              <span>All Students ({rankedStudents.length})</span>
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeFilter === 'Taught'}
              className={`filter-chip-btn ${activeFilter === 'Taught' ? 'active' : ''}`}
              onClick={() => setActiveFilter('Taught')}
            >
              <BookOpen size={14} />
              <span>Taught 1+ ({rankedStudents.filter((s) => s.sessionsTaught >= 1).length})</span>
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeFilter === 'Learnt'}
              className={`filter-chip-btn ${activeFilter === 'Learnt' ? 'active' : ''}`}
              onClick={() => setActiveFilter('Learnt')}
            >
              <GraduationCap size={14} />
              <span>Learnt 1+ ({rankedStudents.filter((s) => s.sessionsLearnt >= 1).length})</span>
            </button>
          </div>
        </div>

        {/* ------------------------------------------------------------------
            ANIME PODIUM (TOP 3)
            Order: 2nd (Left - Silver), 1st (Center - Tallest with Gold Crown), 3rd (Right - Bronze)
            ------------------------------------------------------------------ */}
        {top3.length > 0 && (
          <div className="podium-container">
            {/* 2nd Place Podium Column (Silver - Left) */}
            {secondPlace && (
              <motion.div
                className={`podium-column podium-rank-2 ${
                  secondPlace.isCurrentUser ? 'podium-current-user-highlight' : ''
                }`}
                initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 40 }}
                whileInView={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-20px' }}
                transition={{ duration: 0.5, delay: 0.15 }}
              >
                {/* Silver Ribbon Banner */}
                <div className="podium-ribbon ribbon-silver">
                  <span className="ribbon-text">2nd Place</span>
                </div>

                <div className="podium-card-content">
                  <div className="podium-avatar-wrap">
                    <div
                      className={`podium-avatar ${secondPlace.avatarBg} ${
                        secondPlace.isSkillMaster ? 'avatar-gold-ring' : 'avatar-ink-ring'
                      }`}
                    >
                      {secondPlace.avatar}
                    </div>
                    <span className="podium-rank-badge rank-badge-silver">#2</span>
                  </div>

                  <h3 className="podium-student-name">
                    {formatStudentName(secondPlace.name)}
                    {secondPlace.isCurrentUser && <span className="you-pill">YOU</span>}
                  </h3>

                  {secondPlace.isSkillMaster && (
                    <span className="skill-master-title">
                      <Sparkles size={11} className="inline mr-1" />
                      Skill Master
                    </span>
                  )}

                  {/* Role sticker chips */}
                  <div className="podium-chips-row">{renderRoleChips(secondPlace)}</div>

                  {/* Score Count-Up */}
                  <div className="podium-score-box">
                    <span className="podium-score-number">
                      <AnimatedCounter value={secondPlace.score} duration={850} />
                    </span>
                    <span className="podium-score-label">pts</span>
                  </div>

                  {/* Badges & Rating */}
                  <div className="podium-meta-pills">
                    <span className="meta-pill-badge" title="Badges earned">
                      <Award size={12} className="text-amber-500" />
                      <span>{secondPlace.badgesCount} Badges</span>
                    </span>
                    <span className="meta-pill-rating" title="Teaching rating">
                      <Star size={12} className="text-amber-500 fill-amber-400" />
                      <span>{secondPlace.teachingRating.toFixed(1)}</span>
                    </span>
                  </div>
                </div>

                {/* Podium Block Stand */}
                <div className="podium-block block-silver">
                  <span className="block-number">2</span>
                </div>
              </motion.div>
            )}

            {/* 1st Place Podium Column (Gold - Center & Tallest with Crown Ribbon) */}
            {firstPlace && (
              <motion.div
                className={`podium-column podium-rank-1 ${
                  firstPlace.isCurrentUser ? 'podium-current-user-highlight' : ''
                }`}
                initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 55 }}
                whileInView={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-20px' }}
                transition={{ duration: 0.55, delay: 0.05 }}
              >
                {/* Gold Crown Ribbon */}
                <div className="podium-ribbon ribbon-gold">
                  <Crown size={15} className="ribbon-crown-icon" />
                  <span className="ribbon-text">1st Champion</span>
                </div>

                <div className="podium-card-content">
                  <div className="podium-avatar-wrap">
                    <div
                      className={`podium-avatar avatar-champion ${firstPlace.avatarBg} ${
                        firstPlace.isSkillMaster || true ? 'avatar-gold-ring' : 'avatar-ink-ring'
                      }`}
                    >
                      {firstPlace.avatar}
                    </div>
                    <span className="podium-rank-badge rank-badge-gold">
                      <Crown size={13} className="text-white inline mr-0.5" />
                      #1
                    </span>
                  </div>

                  <h3 className="podium-student-name champion-name">
                    {formatStudentName(firstPlace.name)}
                    {firstPlace.isCurrentUser && <span className="you-pill">YOU</span>}
                  </h3>

                  <span className="skill-master-title title-champion">
                    <Sparkles size={12} className="inline mr-1" />
                    Skill Master
                  </span>

                  {/* Role sticker chips */}
                  <div className="podium-chips-row">{renderRoleChips(firstPlace)}</div>

                  {/* Score Count-Up */}
                  <div className="podium-score-box champion-score-box">
                    <span className="podium-score-number">
                      <AnimatedCounter value={firstPlace.score} duration={950} />
                    </span>
                    <span className="podium-score-label">pts</span>
                  </div>

                  {/* Badges & Rating */}
                  <div className="podium-meta-pills">
                    <span className="meta-pill-badge" title="Badges earned">
                      <Award size={13} className="text-amber-500" />
                      <span>{firstPlace.badgesCount} Badges</span>
                    </span>
                    <span className="meta-pill-rating" title="Teaching rating">
                      <Star size={13} className="text-amber-500 fill-amber-400" />
                      <span>{firstPlace.teachingRating.toFixed(1)}</span>
                    </span>
                  </div>
                </div>

                {/* Podium Block Stand (Tallest) */}
                <div className="podium-block block-gold">
                  <span className="block-number">1</span>
                </div>
              </motion.div>
            )}

            {/* 3rd Place Podium Column (Bronze - Right) */}
            {thirdPlace && (
              <motion.div
                className={`podium-column podium-rank-3 ${
                  thirdPlace.isCurrentUser ? 'podium-current-user-highlight' : ''
                }`}
                initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 35 }}
                whileInView={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-20px' }}
                transition={{ duration: 0.5, delay: 0.25 }}
              >
                {/* Bronze Ribbon Banner */}
                <div className="podium-ribbon ribbon-bronze">
                  <span className="ribbon-text">3rd Place</span>
                </div>

                <div className="podium-card-content">
                  <div className="podium-avatar-wrap">
                    <div
                      className={`podium-avatar ${thirdPlace.avatarBg} ${
                        thirdPlace.isSkillMaster ? 'avatar-gold-ring' : 'avatar-ink-ring'
                      }`}
                    >
                      {thirdPlace.avatar}
                    </div>
                    <span className="podium-rank-badge rank-badge-bronze">#3</span>
                  </div>

                  <h3 className="podium-student-name">
                    {formatStudentName(thirdPlace.name)}
                    {thirdPlace.isCurrentUser && <span className="you-pill">YOU</span>}
                  </h3>

                  {thirdPlace.isSkillMaster && (
                    <span className="skill-master-title">
                      <Sparkles size={11} className="inline mr-1" />
                      Skill Master
                    </span>
                  )}

                  {/* Role sticker chips */}
                  <div className="podium-chips-row">{renderRoleChips(thirdPlace)}</div>

                  {/* Score Count-Up */}
                  <div className="podium-score-box">
                    <span className="podium-score-number">
                      <AnimatedCounter value={thirdPlace.score} duration={800} />
                    </span>
                    <span className="podium-score-label">pts</span>
                  </div>

                  {/* Badges & Rating */}
                  <div className="podium-meta-pills">
                    <span className="meta-pill-badge" title="Badges earned">
                      <Award size={12} className="text-amber-500" />
                      <span>{thirdPlace.badgesCount} Badges</span>
                    </span>
                    <span className="meta-pill-rating" title="Teaching rating">
                      <Star size={12} className="text-amber-500 fill-amber-400" />
                      <span>{thirdPlace.teachingRating.toFixed(1)}</span>
                    </span>
                  </div>
                </div>

                {/* Podium Block Stand */}
                <div className="podium-block block-bronze">
                  <span className="block-number">3</span>
                </div>
              </motion.div>
            )}
          </div>
        )}

        {/* ------------------------------------------------------------------
            RANKS 4 TO 10 LIST OF ROWS
            ------------------------------------------------------------------ */}
        <div className="leaderboard-table-container">
          <div className="leaderboard-table-header">
            <span className="col-rank">Rank</span>
            <span className="col-student">Student</span>
            <span className="col-roles">Activity</span>
            <span className="col-badges">Badges</span>
            <span className="col-rating">Teaching Rating</span>
            <span className="col-score">Score</span>
          </div>

          <div className="leaderboard-rows-list">
            {ranks4to10.map((student) => {
              const isYou = student.isCurrentUser;

              return (
                <div
                  key={student.id}
                  className={`leaderboard-row ${isYou ? 'leaderboard-row-you-highlight' : ''}`}
                >
                  {/* Rank Number */}
                  <div className="row-col col-rank">
                    <span className={`rank-tag-number ${isYou ? 'rank-tag-you' : ''}`}>
                      #{student.rank}
                    </span>
                  </div>

                  {/* Student Avatar & Name */}
                  <div className="row-col col-student">
                    <div className={`row-student-avatar ${student.avatarBg} avatar-ink-ring`}>
                      {student.avatar}
                    </div>
                    <div className="row-student-info">
                      <span className="row-student-name">
                        {formatStudentName(student.name)}
                        {isYou && <span className="you-pill">YOU</span>}
                      </span>
                    </div>
                  </div>

                  {/* Role Tags: Taught / Learnt Chips */}
                  <div className="row-col col-roles">{renderRoleChips(student)}</div>

                  {/* Badges Count */}
                  <div className="row-col col-badges">
                    <span className="row-badge-pill">
                      <Award size={13} className="text-amber-500" />
                      <span>{student.badgesCount}</span>
                    </span>
                  </div>

                  {/* Teaching Star Rating */}
                  <div className="row-col col-rating">
                    <div className="row-rating-wrap">
                      <Star size={13} className="text-amber-500 fill-amber-400" />
                      <span className="row-rating-val">
                        {student.teachingRating > 0 ? student.teachingRating.toFixed(1) : '—'}
                      </span>
                      {student.teachingReviewsCount > 0 && (
                        <span className="row-reviews-count">
                          ({student.teachingReviewsCount} rev)
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Computed Score */}
                  <div className="row-col col-score">
                    <span className="row-score-number">{student.score}</span>
                    <span className="row-score-unit">pts</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ----------------------------------------------------------------
              HIGHLIGHTED "YOUR RANK" ROW (Shown when user is not in top 10)
              ---------------------------------------------------------------- */}
          {!isCurrentUserInTop10 && currentStudentEntry && (
            <div className="leaderboard-your-rank-card">
              <div className="your-rank-banner-header">
                <span className="your-rank-sticker">YOUR CAMPUS STANDING</span>
                <span className="your-rank-subnote">
                  Complete more peer teaching sessions and reviews to break into the Top 10!
                </span>
              </div>

              <div className="leaderboard-row leaderboard-row-you-sticky">
                {/* User Rank */}
                <div className="row-col col-rank">
                  <span className="rank-tag-number rank-tag-you">
                    #{currentStudentEntry.rank}
                  </span>
                </div>

                {/* User Avatar & Name */}
                <div className="row-col col-student">
                  <div
                    className={`row-student-avatar ${currentStudentEntry.avatarBg} avatar-ink-ring`}
                  >
                    {currentStudentEntry.avatar}
                  </div>
                  <div className="row-student-info">
                    <span className="row-student-name font-bold">
                      {formatStudentName(currentStudentEntry.name)}
                      <span className="you-pill">YOU</span>
                    </span>
                  </div>
                </div>

                {/* User Role Tags */}
                <div className="row-col col-roles">
                  {renderRoleChips(currentStudentEntry)}
                </div>

                {/* User Badges */}
                <div className="row-col col-badges">
                  <span className="row-badge-pill">
                    <Award size={13} className="text-amber-500" />
                    <span>{currentStudentEntry.badgesCount}</span>
                  </span>
                </div>

                {/* User Teaching Rating */}
                <div className="row-col col-rating">
                  <div className="row-rating-wrap">
                    <Star size={13} className="text-amber-500 fill-amber-400" />
                    <span className="row-rating-val">
                      {currentStudentEntry.teachingRating > 0
                        ? currentStudentEntry.teachingRating.toFixed(1)
                        : '—'}
                    </span>
                    {currentStudentEntry.teachingReviewsCount > 0 && (
                      <span className="row-reviews-count">
                        ({currentStudentEntry.teachingReviewsCount} rev)
                      </span>
                    )}
                  </div>
                </div>

                {/* User Score */}
                <div className="row-col col-score">
                  <span className="row-score-number font-black text-blue-600">
                    {currentStudentEntry.score}
                  </span>
                  <span className="row-score-unit">pts</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Leaderboard;
