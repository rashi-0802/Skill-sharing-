// =============================================================================
// 4S STUDENT SKILL SHARING SYSTEM
// BADGE & ACHIEVEMENTS ENGINE
// Precise, measurable criteria and progress evaluation with Skill Master reward
// =============================================================================

export const SKILL_MASTER_TARGET = 8;

export const BADGE_DEFINITIONS = [
  {
    id: 'badge-first-skill',
    title: 'First Teaching Skill',
    category: 'Teaching',
    icon: 'BookOpen',
    badgeClass: 'badge-indigo',
    criterion: 'Publish 1 teaching skill offering on campus',
    unit: 'skills',
    target: 1,
    defaultEarnedDate: 'Oct 2, 2026',
    activityTrigger: 'Published React.js & Frontend Architecture'
  },
  {
    id: 'badge-first-request',
    title: 'First Learning Goal',
    category: 'Learning',
    icon: 'Layers',
    badgeClass: 'badge-blue',
    criterion: 'Post 1 skill learning request on wishlist',
    unit: 'goals',
    target: 1,
    defaultEarnedDate: 'Oct 3, 2026',
    activityTrigger: 'Posted Applied Machine Learning wishlist request'
  },
  {
    id: 'badge-first-match',
    title: 'First Match',
    category: 'Milestone',
    icon: 'Sparkles',
    badgeClass: 'badge-purple',
    criterion: 'Generate 1 peer skill match on campus',
    unit: 'matches',
    target: 1,
    defaultEarnedDate: 'Oct 4, 2026',
    activityTrigger: 'Mutual match with Rashi Chandani'
  },
  {
    id: 'badge-first-session',
    title: 'First Session',
    category: 'Milestone',
    icon: 'Calendar',
    badgeClass: 'badge-amber',
    criterion: 'Schedule 1 study session on your calendar',
    unit: 'sessions',
    target: 1,
    defaultEarnedDate: 'Oct 5, 2026',
    activityTrigger: 'Scheduled session with Aarav Mehta'
  },
  {
    id: 'badge-first-completed',
    title: 'First Completed Session',
    category: 'Milestone',
    icon: 'CheckCircle2',
    badgeClass: 'badge-emerald',
    criterion: 'Complete 1 collaborative study session',
    unit: 'sessions',
    target: 1,
    defaultEarnedDate: 'Oct 2, 2026',
    activityTrigger: 'Completed session SES-0104 on SQL Optimization'
  },
  {
    id: 'badge-knowledge-sharer',
    title: 'Knowledge Sharer',
    category: 'Teaching',
    icon: 'GraduationCap',
    badgeClass: 'badge-purple',
    criterion: 'Complete 1 teaching session with a peer learner',
    unit: 'sessions',
    target: 1,
    defaultEarnedDate: 'Oct 2, 2026',
    activityTrigger: 'Taught session SES-0104 with Sneha Rao'
  },
  {
    id: 'badge-active-learner',
    title: 'Active Learner',
    category: 'Learning',
    icon: 'Zap',
    badgeClass: 'badge-amber',
    criterion: 'Complete 1 learning session with a peer teacher',
    unit: 'sessions',
    target: 1,
    defaultEarnedDate: 'Oct 6, 2026',
    activityTrigger: 'Upcoming learning sessions with Rashi Chandani'
  },
  {
    id: 'badge-top-mentor',
    title: 'Top Peer Mentor',
    category: 'Teaching',
    icon: 'Award',
    badgeClass: 'badge-gold',
    criterion: 'Maintain a 4.90+ rating with at least 1 completed teaching session',
    unit: 'sessions',
    target: 1,
    defaultEarnedDate: 'Oct 6, 2026',
    activityTrigger: 'Maintained 4.95 ★ across verified sessions'
  },
  {
    id: 'badge-master-teacher',
    title: 'Master Instructor',
    category: 'Teaching',
    icon: 'Star',
    badgeClass: 'badge-teal',
    criterion: 'Complete 3 teaching sessions with peer learners',
    unit: 'sessions',
    target: 3,
    defaultEarnedDate: 'Oct 8, 2026',
    activityTrigger: 'Taught 2 peer sessions (SES-0104 and SES-0105)'
  },
  {
    id: 'badge-five-star',
    title: 'Five-Star Scholar',
    category: 'Milestone',
    icon: 'Sparkles',
    badgeClass: 'badge-gold',
    criterion: 'Receive 3 five-star peer ratings',
    unit: 'reviews',
    target: 3,
    defaultEarnedDate: 'Oct 7, 2026',
    activityTrigger: '5-star reviews from Sneha Rao, Rohan Verma, and Aarav Mehta'
  }
];

/**
 * Evaluates whether a date string is within the last 7 days
 */
export const isEarnedRecently = (dateStr) => {
  if (!dateStr) return false;
  try {
    const earned = new Date(dateStr);
    const now = new Date('2026-10-09'); // Reference semester timestamp
    const diffDays = (now.getTime() - earned.getTime()) / (1000 * 60 * 60 * 24);
    return diffDays >= 0 && diffDays <= 7;
  } catch (e) {
    return false;
  }
};

/**
 * ONE AUTHORITATIVE FUNCTION: getBadgeProgress(badge, student)
 * Reads the exact same existing data and conditions the app uses to award each badge.
 * Returns { current, target, unit, percent, remainingText, earned, earnedDate, activityTrigger, isNew }
 */
export const getBadgeProgress = (badge, student = {}) => {
  if (!badge) {
    return {
      current: 0,
      target: 1,
      unit: 'items',
      percent: 0,
      remainingText: '1 more item to unlock',
      earned: false,
      earnedDate: null,
      activityTrigger: null,
      isNew: false
    };
  }

  const def = BADGE_DEFINITIONS.find((b) => b.id === badge.id) || badge;
  const target = def.target || badge.target || 1;
  const unit = def.unit || badge.unit || 'items';

  const skillsOffered = student.skillsOffered || [];
  const skillsWanted = student.skillsWanted || [];
  const sessions = student.upcomingSessions || [];
  const reviews = student.recentReviews || [];
  const userRating = parseFloat(student.rating || '4.95');

  const completedSessions = sessions.filter((s) => s.status === 'Completed');
  const completedTeaching = completedSessions.filter(
    (s) => s.userRole === 'Teacher' || s.teacher === student.name || s.teacherStudentId === student.studentId
  );
  const completedLearning = completedSessions.filter(
    (s) => s.userRole === 'Learner' || s.learner === student.name || s.learnerStudentId === student.studentId
  );

  let current = 0;
  let earned = false;
  let activityTrigger = def.activityTrigger || null;

  switch (def.id) {
    case 'badge-first-skill':
      current = skillsOffered.length;
      earned = current >= target;
      if (skillsOffered.length > 0) {
        activityTrigger = `Published "${skillsOffered[0].name}"`;
      }
      break;

    case 'badge-first-request':
      current = skillsWanted.length;
      earned = current >= target;
      if (skillsWanted.length > 0) {
        activityTrigger = `Requested "${skillsWanted[0].name}"`;
      }
      break;

    case 'badge-first-match': {
      const hasMatch =
        skillsWanted.some((r) => r.status === 'Matched' || r.courseId) ||
        (student.matches && student.matches.length > 0);
      current = hasMatch ? 1 : 0;
      earned = current >= target;
      activityTrigger = 'Mutual match confirmed in timetable';
      break;
    }

    case 'badge-first-session':
      current = sessions.length;
      earned = current >= target;
      if (sessions.length > 0) {
        activityTrigger = `Scheduled session "${sessions[0].topic || sessions[0].skill}"`;
      }
      break;

    case 'badge-first-completed':
      current = completedSessions.length;
      earned = current >= target;
      if (completedSessions.length > 0) {
        activityTrigger = `Completed session with ${completedSessions[0].partnerName || 'peer student'}`;
      }
      break;

    case 'badge-knowledge-sharer':
      current = completedTeaching.length;
      earned = current >= target;
      if (completedTeaching.length > 0) {
        activityTrigger = `Mentored ${completedTeaching[0].learner || 'peer learner'} in ${completedTeaching[0].skill || 'course'}`;
      }
      break;

    case 'badge-active-learner':
      current = completedLearning.length;
      earned = current >= target;
      if (completedLearning.length > 0) {
        activityTrigger = `Learned ${completedLearning[0].skill || 'topic'} from ${completedLearning[0].teacher || 'peer mentor'}`;
      } else {
        activityTrigger = 'Schedule and conclude your first learning session to unlock';
      }
      break;

    case 'badge-top-mentor': {
      const meetsCriteria = userRating >= 4.90 && (completedTeaching.length >= 1 || (student.sessionsTaught || 0) >= 5);
      current = meetsCriteria ? 1 : 0;
      earned = meetsCriteria;
      activityTrigger = `Maintained ${userRating.toFixed(2)} ★ rating across completed teaching sessions`;
      break;
    }

    case 'badge-master-teacher':
      current = completedTeaching.length;
      earned = current >= target;
      activityTrigger = `Completed ${completedTeaching.length} of ${target} peer teaching sessions`;
      break;

    case 'badge-five-star': {
      const fiveStarReviews = reviews.filter((r) => Number(r.rating) === 5);
      current = fiveStarReviews.length;
      earned = current >= target;
      if (fiveStarReviews.length > 0) {
        activityTrigger = `Received 5-star ratings from ${fiveStarReviews.map((r) => r.author).slice(0, 2).join(', ')}`;
      }
      break;
    }

    default:
      current = badge.unlocked ? target : (badge.current || 0);
      earned = current >= target || Boolean(badge.unlocked);
      break;
  }

  const percent = Math.min(100, Math.round((current / target) * 100));
  const remaining = Math.max(0, target - current);

  let remainingText = 'Completed';
  if (!earned) {
    const unitLabel = remaining === 1
      ? (unit.endsWith('s') ? unit.slice(0, -1) : unit)
      : unit;
    remainingText = `${remaining} more ${unitLabel} to unlock`;
  }

  // Determine earned date
  const earnedDate = earned ? (badge.earnedDate || badge.unlockedAtDate || def.defaultEarnedDate || 'Oct 2, 2026') : null;
  const isNew = earned && isEarnedRecently(earnedDate);

  return {
    current,
    target,
    unit,
    percent,
    remainingText,
    earned,
    earnedDate,
    activityTrigger,
    isNew
  };
};

/**
 * Calculates dynamic achievements list with full criteria and progress
 */
export const calculateDynamicAchievements = (currentUser) => {
  const user = currentUser || {};

  return BADGE_DEFINITIONS.map((def) => {
    const progressData = getBadgeProgress(def, user);

    return {
      ...def,
      desc: def.criterion, // Clean exact criterion text
      unlocked: progressData.earned,
      current: progressData.current,
      target: progressData.target,
      unit: progressData.unit,
      percent: progressData.percent,
      remainingText: progressData.remainingText,
      earnedDate: progressData.earnedDate,
      activityTrigger: progressData.activityTrigger,
      isNew: progressData.isNew,
      // Backwards-compatible fields for existing components
      progress: `${progressData.current} / ${progressData.target} ${progressData.unit}`,
      unlockedAt: progressData.earned ? (progressData.earnedDate || 'Earned') : 'Locked'
    };
  });
};
