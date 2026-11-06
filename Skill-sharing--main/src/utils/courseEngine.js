// =============================================================================
// 4S - STUDENT SKILL SHARING SYSTEM
// ID GENERATION, CENTRAL COURSE CATALOG & 7-STEP MULTI-FACTOR MATCHING ENGINE
// =============================================================================

// -----------------------------------------------------------------------------
// 1. CANONICAL INITIAL COURSE CATALOG
// -----------------------------------------------------------------------------
export const INITIAL_COURSES = [
  {
    courseId: 'CRS001',
    name: 'Python',
    category: 'Python',
    description: 'Python programming syntax, data structures, scripting, OOP, and automation.',
    aliases: [
      'python',
      'python programming',
      'python for beginners & oop',
      'python for data automation & scripting',
      'python scripting',
      'python syntax'
    ]
  },
  {
    courseId: 'CRS002',
    name: 'C Programming',
    category: 'C',
    description: 'C programming, pointers arithmetic, memory layouts, malloc/free, and system calls.',
    aliases: [
      'c',
      'c programming',
      'systems programming in c',
      'systems programming in c & pointer memory',
      'c & pointer fundamentals',
      'c programming & pointer fundamentals',
      'data structures & algorithms in c++',
      'pointers & memory'
    ]
  },
  {
    courseId: 'CRS003',
    name: 'Web Development',
    category: 'Web Development',
    description: 'Modern full-stack web applications, React.js, component architecture, and containers.',
    aliases: [
      'web development',
      'modern react & component architecture',
      'react.js & frontend architecture',
      'react.js',
      'react',
      'frontend development',
      'docker & cloud deployment basics',
      'full-stack web development',
      'tailwind css'
    ]
  },
  {
    courseId: 'CRS004',
    name: 'Data Science',
    category: 'Data Science',
    description: 'Data science, machine learning, Scikit-Learn models, Pandas, and SQL optimization.',
    aliases: [
      'data science',
      'machine learning with scikit-learn',
      'applied machine learning & scikit-learn',
      'data science with pandas, sql & numpy',
      'database systems & sql optimization',
      'machine learning',
      'data analysis',
      'pandas & sql'
    ]
  },
  {
    courseId: 'CRS005',
    name: 'UI/UX Design',
    category: 'UI/UX Design',
    description: 'Figma design systems, auto-layout, wireframing, component variants, and prototyping.',
    aliases: [
      'ui/ux design',
      'ui/ux',
      'figma ui/ux systems & prototyping',
      'figma ui/ux design systems & wireframing',
      'ui prototyping & figma basics',
      'wireframing',
      'figma',
      'user experience'
    ]
  },
  {
    courseId: 'CRS006',
    name: 'Graphic Design',
    category: 'Graphic Design',
    description: 'Vector illustration, Adobe Illustrator pen tool, typography, logo design, and branding.',
    aliases: [
      'graphic design',
      'vector graphic design in adobe illustrator',
      'adobe illustrator',
      'logo design',
      'typography',
      'vector graphics'
    ]
  },
  {
    courseId: 'CRS007',
    name: 'Communication',
    category: 'Communication',
    description: 'Technical presentation, pitch deck delivery, hackathon presentations, and interview prep.',
    aliases: [
      'communication',
      'technical public speaking & pitching',
      'public speaking',
      'campus placement gd & hr interview preparation',
      'interview preparation',
      'presentation skills'
    ]
  },
  {
    courseId: 'CRS008',
    name: 'Photography',
    category: 'Photography',
    description: 'DSLR camera composition, manual exposure triangle, lighting, and Adobe Lightroom editing.',
    aliases: [
      'photography',
      'dslr manual photography & light composition',
      'dslr photography & composition',
      'adobe lightroom color grading & raw editing',
      'photo editing',
      'composition'
    ]
  }
];

// Helper to normalize strings for comparison
export const normalizeText = (text) => {
  if (!text || typeof text !== 'string') return '';
  return text
    .toLowerCase()
    .replace(/[^\w\s+#.-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
};

// -----------------------------------------------------------------------------
// 2. PERSISTENT COURSE CATALOG MANAGEMENT (localStorage backed)
// -----------------------------------------------------------------------------
export const getCourseCatalog = () => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const raw = window.localStorage.getItem('4s_course_catalog');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    }
  } catch (e) {
    console.error('Error reading course catalog from localStorage', e);
  }
  saveCourseCatalog(INITIAL_COURSES);
  return INITIAL_COURSES;
};

export const saveCourseCatalog = (catalog) => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem('4s_course_catalog', JSON.stringify(catalog));
      window.dispatchEvent(new Event('4s_course_catalog_change'));
    }
  } catch (e) {
    console.error('Error saving course catalog', e);
  }
};

/**
 * Resolves an existing Course ID or registers a new course in the catalog.
 * Guarantees that "Python", "python", "PYTHON", "Python Programming" resolve to CRS001.
 */
export const resolveOrAddCourse = (skillName, categoryHint = '') => {
  if (!skillName || !skillName.trim()) return 'CRS001';
  const normSkill = normalizeText(skillName);
  const normCat = normalizeText(categoryHint);
  const catalog = getCourseCatalog();

  // 1. Direct courseId lookup (e.g. passed 'CRS001')
  const byId = catalog.find((c) => c.courseId.toUpperCase() === skillName.trim().toUpperCase());
  if (byId) return byId.courseId;

  // 2. Exact match with course name
  const exactName = catalog.find((c) => normalizeText(c.name) === normSkill);
  if (exactName) return exactName.courseId;

  // 3. Exact match with course category (when category matches and skill is generic)
  const exactCat = catalog.find((c) => normalizeText(c.category) === normSkill);
  if (exactCat) return exactCat.courseId;

  // 4. Aliases exact match
  const aliasMatch = catalog.find((c) =>
    (c.aliases || []).some((a) => normalizeText(a) === normSkill)
  );
  if (aliasMatch) return aliasMatch.courseId;

  // 5. Single-letter 'C' special boundary handling
  if (normSkill === 'c' || normSkill.split(/\s+/).includes('c')) {
    const cCourse = catalog.find((c) => c.courseId === 'CRS002');
    if (cCourse) return cCourse.courseId;
  }

  // 6. Substring & token containment in course name or aliases
  const containmentMatch = catalog.find((c) => {
    const cNorm = normalizeText(c.name);
    if (normSkill.includes(cNorm) || cNorm.includes(normSkill)) return true;
    return (c.aliases || []).some((a) => {
      const aNorm = normalizeText(a);
      return normSkill.includes(aNorm) || aNorm.includes(normSkill);
    });
  });
  if (containmentMatch) return containmentMatch.courseId;

  // 7. Check category hint
  if (normCat) {
    const catMatch = catalog.find((c) => normalizeText(c.category) === normCat);
    if (catMatch) return catMatch.courseId;
  }

  // 8. If course does not exist, create a new course entry
  const existingNums = catalog
    .map((c) => parseInt(c.courseId.replace('CRS', ''), 10))
    .filter((n) => !isNaN(n));
  const maxNum = existingNums.length > 0 ? Math.max(...existingNums) : 8;
  const newCourseId = `CRS${String(maxNum + 1).padStart(3, '0')}`;

  const newCourse = {
    courseId: newCourseId,
    name: skillName.trim(),
    category: categoryHint.trim() || 'General',
    description: `Student peer course on ${skillName.trim()}.`,
    aliases: [normSkill]
  };

  const updatedCatalog = [...catalog, newCourse];
  saveCourseCatalog(updatedCatalog);
  return newCourseId;
};

export const getCourseById = (courseId) => {
  const catalog = getCourseCatalog();
  return (
    catalog.find((c) => c.courseId === courseId) || {
      courseId,
      name: 'Custom Skill Course',
      category: 'General'
    }
  );
};

// -----------------------------------------------------------------------------
// 3. ID DISPLAY FORMATTING & PERSISTENT ID GENERATION
// -----------------------------------------------------------------------------
/**
 * PART 2: ID FORMATTING
 * Display formats:
 * - Teaching ID (SS_ID): TCH-0001
 * - Learning ID (Request_ID): LRN-0001
 * - Match (Match_ID): MAT-0001
 * - Session (Session_ID): SES-0001
 * - Rating (Rating_ID): RAT-0001
 *
 * Keeps any existing underlying ID value and safely formats it for display.
 * Never alters original stored keys if already assigned.
 */
export const formatDisplayId = (prefix, id) => {
  if (!id) return '';
  const str = String(id).trim();

  // If already matches exact target format: 3 uppercase letters, dash, 4 digits (e.g. TCH-0001)
  if (/^[A-Z]{3}-\d{4}$/.test(str)) {
    return str;
  }

  // Derive target prefix
  let targetPrefix = prefix;
  if (!targetPrefix) {
    const upper = str.toUpperCase();
    if (upper.startsWith('TCH')) targetPrefix = 'TCH';
    else if (upper.startsWith('LRN')) targetPrefix = 'LRN';
    else if (upper.startsWith('MAT')) targetPrefix = 'MAT';
    else if (upper.startsWith('SES')) targetPrefix = 'SES';
    else if (upper.startsWith('RAT')) targetPrefix = 'RAT';
    else if (upper.startsWith('CRS')) targetPrefix = 'CRS';
    else if (upper.startsWith('STU')) targetPrefix = 'STU';
    else if (upper.includes('TEACH')) targetPrefix = 'TCH';
    else if (upper.includes('REQ')) targetPrefix = 'LRN';
    else if (upper.includes('REV')) targetPrefix = 'RAT';
    else targetPrefix = 'ID';
  }

  // Extract digits from id (e.g., 'TCH013' -> 13, 'sess-102' -> 102, 'req-1' -> 1)
  const digitsMatch = str.match(/\d+/);
  if (digitsMatch) {
    const num = parseInt(digitsMatch[0], 10);
    return `${targetPrefix}-${String(num).padStart(4, '0')}`;
  }

  return `${targetPrefix}-0001`;
};

// Internal persistent counter management
const getCounter = (prefix) => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const raw = window.localStorage.getItem(`4s_counter_${prefix}`);
      if (raw) return parseInt(raw, 10);
    }
  } catch (e) {
    // ignore
  }

  // Base starting values higher than existing seed mock data
  switch (prefix) {
    case 'STU':
      return 15; // STU001-STU012 exist
    case 'TCH':
      return 30; // TCH001-TCH025 exist
    case 'LRN':
      return 10; // LRN001-LRN004 exist
    case 'MAT':
      return 5;  // MAT001-MAT003 exist
    case 'SES':
      return 110; // sess-101 to sess-106 exist
    case 'RAT':
      return 10;  // rev-1, rev-2 exist
    default:
      return 1;
  }
};

const incrementCounter = (prefix) => {
  const current = getCounter(prefix);
  const next = current + 1;
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(`4s_counter_${prefix}`, String(next));
    }
  } catch (e) {
    // ignore
  }
  return next;
};

export const getNextStudentId = () => {
  const num = incrementCounter('STU');
  return `STU-${String(num).padStart(4, '0')}`;
};

export const getNextTeachingId = () => {
  const num = incrementCounter('TCH');
  return `TCH-${String(num).padStart(4, '0')}`;
};

export const getNextLearningId = () => {
  const num = incrementCounter('LRN');
  return `LRN-${String(num).padStart(4, '0')}`;
};

export const getNextMatchId = () => {
  const num = incrementCounter('MAT');
  return `MAT-${String(num).padStart(4, '0')}`;
};

export const getNextSessionId = () => {
  const num = incrementCounter('SES');
  return `SES-${String(num).padStart(4, '0')}`;
};

export const getNextRatingId = () => {
  const num = incrementCounter('RAT');
  return `RAT-${String(num).padStart(4, '0')}`;
};

// -----------------------------------------------------------------------------
// 4. STEP 4 AVAILABILITY OVERLAP HELPER
// -----------------------------------------------------------------------------
/**
 * Counts overlapping day and time slots between two students.
 * Supports structured slot arrays as well as text availability strings.
 */
export const countAvailabilityOverlap = (learnerAvail, teacherAvail) => {
  const normLearner = normalizeText(
    typeof learnerAvail === 'string' ? learnerAvail : JSON.stringify(learnerAvail || '')
  );
  const normTeacher = normalizeText(
    typeof teacherAvail === 'string' ? teacherAvail : JSON.stringify(teacherAvail || '')
  );

  // If either has flexible availability, guaranteed multiple overlaps
  if (normLearner.includes('flexible') || normTeacher.includes('flexible') || !normLearner || !normTeacher) {
    return 3;
  }

  let overlapCount = 0;

  // Check shared day keywords
  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday', 'weekday', 'weekend'];
  for (const day of days) {
    if (normLearner.includes(day) && normTeacher.includes(day)) {
      overlapCount += 1;
    }
  }

  // Check shared time period keywords
  const periods = ['morning', 'afternoon', 'evening', '4 pm', '5 pm', '6 pm', '7 pm'];
  for (const period of periods) {
    if (normLearner.includes(period) && normTeacher.includes(period)) {
      overlapCount += 1;
    }
  }

  return overlapCount;
};

// -----------------------------------------------------------------------------
// 5. PART 3: 7-STEP REUSABLE MATCHING LOGIC (findMatches)
// -----------------------------------------------------------------------------
/**
 * Stored Matches Persistence: Retrieves existing match records from localStorage.
 */
export const getStoredMatches = () => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const raw = window.localStorage.getItem('4s_matches');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed;
      }
    }
  } catch (e) {
    console.error('Error reading matches from storage', e);
  }
  return [];
};

export const saveStoredMatches = (matches) => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem('4s_matches', JSON.stringify(matches));
      window.dispatchEvent(new Event('4s_matches_change'));
    }
  } catch (e) {
    console.error('Error saving matches to storage', e);
  }
};

/**
 * Reusable function implementing the user's PART 3 specification:
 * 1. Start from a LEARNING_REQUEST (LRN).
 * 2. Find STUDENT_SKILL offers (TCH) with the same Skill_ID where the teacher is not the learner.
 * 3. Level fit: the teacher's Proficiency_Level must be greater than or equal to the learner's Desired_Level (Beginner < Intermediate < Advanced).
 * 4. Availability: count overlapping day and time slots between the two students.
 * 5. Match_Score (0–100): +40 same skill (required), +25 level fit (half if one level below), +20 availability overlap, +10 teacher Years_of_Experience (capped), +5 teacher average rating.
 * 6. If the score is at or above 50, create a MATCH (MAT) with Student_ID_1 (learner), Student_ID_2 (teacher), Request_ID, SS_ID, Match_Score and Match_On. Never create a duplicate for the same LRN and TCH pair.
 * 7. From a match, the existing flow continues: book a session (linked to the MAT), then give a rating (linked to the SES).
 */
export const findMatches = (requestIdOrObj, options = {}) => {
  if (!requestIdOrObj) return [];

  // 1. START FROM A LEARNING_REQUEST (LRN)
  let learningRequest = null;
  if (typeof requestIdOrObj === 'object') {
    learningRequest = requestIdOrObj;
  } else {
    // Resolve from user storage or default
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const rawUser = window.localStorage.getItem('4s_user');
        if (rawUser) {
          const u = JSON.parse(rawUser);
          const requests = u.skillsWanted || [];
          learningRequest = requests.find(
            (r) =>
              r.id === requestIdOrObj ||
              r.learningId === requestIdOrObj ||
              r.Request_ID === requestIdOrObj
          );
        }
      }
    } catch (e) {
      // ignore
    }
  }

  if (!learningRequest) {
    return [];
  }

  const learnerStudentId =
    learningRequest.Student_ID ||
    learningRequest.studentId ||
    options.currentStudentId ||
    'STU001';

  const rawReqId =
    learningRequest.Request_ID ||
    learningRequest.learningId ||
    learningRequest.id ||
    'LRN-0001';
  const Request_ID = formatDisplayId('LRN', rawReqId);

  const reqSkillId =
    learningRequest.Skill_ID ||
    learningRequest.courseId ||
    resolveOrAddCourse(learningRequest.name, learningRequest.category);

  const desiredLevel = (
    learningRequest.Desired_Level ||
    learningRequest.desiredLevel ||
    learningRequest.preferredLevel ||
    'Intermediate'
  ).toLowerCase();

  const levelHierarchy = {
    beginner: 1,
    intermediate: 2,
    advanced: 3,
    mastery: 4,
    expert: 4
  };
  const dLevel = levelHierarchy[desiredLevel] || 2;

  // Pool of candidate peers/teachers: options.peers or global SAMPLE_PEER_MATCHES
  const candidatePeers = options.peersList || options.peers || [];
  const storedMatches = getStoredMatches();
  const createdMatches = [];

  // 2. FIND STUDENT_SKILL OFFERS (TCH) WITH THE SAME SKILL_ID WHERE TEACHER IS NOT LEARNER
  for (const peer of candidatePeers) {
    const teacherStudentId = peer.Student_ID || peer.studentId;

    // Teacher cannot be learner (Requirement 2)
    if (teacherStudentId && teacherStudentId === learnerStudentId) {
      continue;
    }

    const records = peer.teachingRecords || [
      {
        SS_ID: peer.SS_ID || peer.teachingId || 'TCH010',
        teachingId: peer.SS_ID || peer.teachingId || 'TCH010',
        Student_ID: teacherStudentId,
        studentId: teacherStudentId,
        Skill_ID: peer.Skill_ID || peer.courseId || resolveOrAddCourse(peer.skillOffered, peer.category),
        courseId: peer.Skill_ID || peer.courseId || resolveOrAddCourse(peer.skillOffered, peer.category),
        Proficiency_Level: peer.Proficiency_Level || peer.proficiencyLevel || 'Advanced',
        proficiency: peer.Proficiency_Level || peer.proficiencyLevel || 'Advanced',
        Years_of_Experience: peer.Years_of_Experience || peer.sessionsDelivered || 20,
        experience: peer.Years_of_Experience || peer.sessionsDelivered || 20,
        Description: peer.Description || peer.bio || peer.skillOffered,
        availability: peer.availability
      }
    ];

    for (const offering of records) {
      const offerSkillId =
        offering.Skill_ID ||
        offering.courseId ||
        resolveOrAddCourse(offering.skillName || offering.name || peer.skillOffered, offering.category);

      // Must have the SAME Skill_ID
      if (offerSkillId !== reqSkillId) {
        continue;
      }

      const rawSSId =
        offering.SS_ID ||
        offering.teachingId ||
        offering.id ||
        peer.teachingId ||
        'TCH010';
      const SS_ID = formatDisplayId('TCH', rawSSId);

      // 3. LEVEL FIT: Teacher's Proficiency_Level vs Learner's Desired_Level
      const teacherProf = (
        offering.Proficiency_Level ||
        offering.proficiency ||
        peer.proficiencyLevel ||
        'Advanced'
      ).toLowerCase();
      const tLevel = levelHierarchy[teacherProf] || 3;

      let levelFitScore = 0;
      if (tLevel >= dLevel) {
        levelFitScore = 25; // Full +25 level fit
      } else if (tLevel === dLevel - 1) {
        levelFitScore = 13; // Half (+12.5 rounded to 13) if one level below
      } else {
        levelFitScore = 0;
      }

      // 4. AVAILABILITY: Count overlapping day and time slots
      const learnerAvail =
        learningRequest.preferredAvailability ||
        learningRequest.availability ||
        options.learnerAvailability ||
        '';
      const teacherAvail =
        offering.availability ||
        peer.availability ||
        '';
      const overlapCount = countAvailabilityOverlap(learnerAvail, teacherAvail);
      const availScore = overlapCount > 0 ? 20 : 0; // +20 availability overlap

      // 5. MATCH_SCORE (0–100):
      // +40 same skill (required)
      // +25 level fit (half if one level below)
      // +20 availability overlap
      // +10 teacher Years_of_Experience (capped at 10)
      // +5 teacher average rating (capped at 5)
      const sameSkillScore = 40;

      const experienceVal = Number(
        offering.Years_of_Experience ||
        offering.experience ||
        peer.sessionsDelivered ||
        0
      );
      let expScore = 2;
      if (experienceVal >= 15) expScore = 10;
      else if (experienceVal >= 10) expScore = 9;
      else if (experienceVal >= 5) expScore = 8;
      else if (experienceVal >= 2) expScore = 6;
      else if (experienceVal >= 1) expScore = 4;

      const ratingVal = parseFloat(offering.rating || peer.rating || '4.9');
      let ratingScore = 3;
      if (ratingVal >= 4.9) ratingScore = 5;
      else if (ratingVal >= 4.7) ratingScore = 4;
      else if (ratingVal >= 4.5) ratingScore = 3;
      else if (ratingVal >= 4.0) ratingScore = 2;
      else ratingScore = 1;

      const matchScore = Math.min(
        100,
        sameSkillScore + levelFitScore + availScore + expScore + ratingScore
      );

      // 6. IF SCORE >= 50, CREATE A MATCH (MAT) RECORD
      if (matchScore >= 50) {
        // DEDUPLICATION: Never create a duplicate for the same LRN and TCH pair
        const existing = storedMatches.find(
          (m) =>
            (m.Request_ID === Request_ID || m.learningId === Request_ID) &&
            (m.SS_ID === SS_ID || m.teachingId === SS_ID)
        );

        const matchId = existing?.Match_ID || existing?.matchId || getNextMatchId();
        const formattedMatchId = formatDisplayId('MAT', matchId);

        const matchRecord = {
          Match_ID: formattedMatchId,
          matchId: formattedMatchId,
          id: formattedMatchId,
          Student_ID_1: learnerStudentId,
          learnerStudentId,
          studentId: learnerStudentId,
          Student_ID_2: teacherStudentId,
          teacherStudentId,
          Request_ID,
          learningId: Request_ID,
          SS_ID,
          teachingId: SS_ID,
          Skill_ID: reqSkillId,
          courseId: reqSkillId,
          Match_Score: matchScore,
          score: matchScore,
          compatibilityScore: matchScore,
          Match_On: existing?.Match_On || new Date().toISOString(),
          createdAt: existing?.createdAt || new Date().toISOString(),
          status: 'Suggested',
          // Detailed score breakdown for UI transparency
          breakdown: {
            sameSkill: sameSkillScore,
            levelFit: levelFitScore,
            availability: availScore,
            experience: expScore,
            rating: ratingScore,
            overlapCount
          },
          // UI display metadata
          peer,
          peerId: peer.id,
          name: peer.name,
          dept: peer.dept,
          avatar: peer.avatar,
          avatarBg: peer.avatarBg,
          rating: peer.rating,
          sessionsDelivered: peer.sessionsDelivered,
          skillOffered: offering.skillName || peer.skillOffered,
          proficiencyLevel: offering.proficiency || peer.proficiencyLevel,
          availability: offering.availability || peer.availability,
          wantsToLearn: peer.wantsToLearn,
          bio: peer.bio,
          teachingRecord: offering
        };

        // If not already in storedMatches, persist it
        if (!existing) {
          storedMatches.push({
            Match_ID: formattedMatchId,
            matchId: formattedMatchId,
            Student_ID_1: learnerStudentId,
            Student_ID_2: teacherStudentId,
            Request_ID,
            SS_ID,
            Skill_ID: reqSkillId,
            Match_Score: matchScore,
            Match_On: matchRecord.Match_On
          });
          saveStoredMatches(storedMatches);
        }

        createdMatches.push(matchRecord);
      }
    }
  }

  // Return matches sorted descending by score
  return createdMatches.sort((a, b) => b.Match_Score - a.Match_Score);
};

// Backwards-compatible multi-factor helper
export const calculateMultiFactorMatch = (learningRequest, teachingOffering, teacherStudent = {}) => {
  if (!learningRequest || !teachingOffering) return null;
  const lCourseId = learningRequest.Skill_ID || learningRequest.courseId || resolveOrAddCourse(learningRequest.name);
  const tCourseId = teachingOffering.Skill_ID || teachingOffering.courseId || resolveOrAddCourse(teachingOffering.skillName || teachingOffering.name);
  if (!lCourseId || !tCourseId || lCourseId !== tCourseId) return null;

  const matches = findMatches(learningRequest, {
    peersList: [teacherStudent.name ? teacherStudent : {
      studentId: teachingOffering.Student_ID || teachingOffering.studentId,
      name: teacherStudent.name || 'Mentor',
      teachingRecords: [teachingOffering]
    }]
  });

  if (matches.length > 0) {
    const top = matches[0];
    return {
      score: top.Match_Score,
      breakdown: top.breakdown,
      matchReasons: [
        `Direct Skill Match: ${getCourseById(lCourseId).name} (${lCourseId})`,
        `Level Alignment: ${teachingOffering.Proficiency_Level || teachingOffering.proficiency || 'Advanced'} vs ${learningRequest.Desired_Level || learningRequest.desiredLevel || 'Intermediate'}`
      ]
    };
  }
  return null;
};

export const buildMatchRecord = (learningRequest, teachingOffering, teacherProfile, matchResult) => {
  const nextId = getNextMatchId();
  return {
    Match_ID: formatDisplayId('MAT', nextId),
    matchId: formatDisplayId('MAT', nextId),
    Student_ID_1: learningRequest.Student_ID || learningRequest.studentId || 'STU001',
    Student_ID_2: teachingOffering.Student_ID || teachingOffering.studentId || teacherProfile.studentId,
    Request_ID: formatDisplayId('LRN', learningRequest.Request_ID || learningRequest.learningId),
    SS_ID: formatDisplayId('TCH', teachingOffering.SS_ID || teachingOffering.teachingId),
    Skill_ID: learningRequest.Skill_ID || learningRequest.courseId,
    Match_Score: matchResult?.score || 85,
    Match_On: new Date().toISOString(),
    status: 'Suggested'
  };
};
