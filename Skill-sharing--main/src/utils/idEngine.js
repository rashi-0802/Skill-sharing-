// =============================================================================
// 4S STUDENT SKILL SHARING SYSTEM
// UNIFORM, READABLE IDs & DECODING ENGINE
// Formats:
// - Student ID: STU + 3 digits (e.g. STU004)
// - Teaching ID: TCR + teacher student number + CRS + course number (e.g. TCR004CRS001)
// - Learning ID: LRN + learner student number + '-' + Teaching ID (e.g. LRN007-TCR004CRS001)
// - Unmatched Request: "Awaiting teacher"
// All persistent, deterministic, frontend display-only without altering database keys.
// =============================================================================

export const AWAITING_TEACHER_ID = 'AWAITING_TEACHER';

const DISPLAY_ID_MAP_KEY = '4s_display_ids_map';
const TEACHER_COURSES_MAP_KEY = '4s_teacher_skill_courses';
const TEACHER_COUNTER_KEY_PREFIX = '4s_tcr_seq_';

/**
 * Extracts 3-digit student number string (e.g. 'STU004' -> '004', 'STU012' -> '012')
 */
export const extractStudentNumber = (studentId = 'STU001') => {
  if (!studentId || typeof studentId !== 'string') return '001';
  const digits = studentId.replace(/\D/g, '');
  if (!digits) return '001';
  const num = parseInt(digits, 10);
  if (num > 999) return String(num);
  return String(num).padStart(3, '0');
};

/**
 * Gets student display ID (e.g. STU001, STU004)
 */
export const formatStudentId = (studentId = 'STU001') => {
  return `STU${extractStudentNumber(studentId)}`;
};

/**
 * Formats a 3-digit course number string (e.g. 1 -> '001', 12 -> '012', 1000 -> '1000')
 */
export const formatCourseNumber = (seq) => {
  const num = Number(seq) || 1;
  if (num > 999) return String(num);
  return String(num).padStart(3, '0');
};

/**
 * Normalizes skill text for deterministic dictionary lookup
 */
export const normalizeSkillName = (text = '') => {
  if (!text || typeof text !== 'string') return '';
  return text.toLowerCase().replace(/[^a-z0-9]/g, ' ').replace(/\s+/g, ' ').trim();
};

/**
 * Builds teaching readable ID: TCR{studentNo}CRS{courseNo}
 */
export const buildTeachingId = (studentId = 'STU001', courseSeq = 1) => {
  const stuNum = extractStudentNumber(studentId);
  const crsNum = formatCourseNumber(courseSeq);
  return `TCR${stuNum}CRS${crsNum}`;
};

/**
 * Builds learning readable ID: LRN{studentNo}-{teachingId}
 */
export const buildLearningId = (learnerStudentId = 'STU001', teachingId = '') => {
  if (!teachingId || teachingId === AWAITING_TEACHER_ID) {
    return AWAITING_TEACHER_ID;
  }
  const learnerNum = extractStudentNumber(learnerStudentId);
  const tcrClean = teachingId.trim();
  return `LRN${learnerNum}-${tcrClean}`;
};

/**
 * Reads persistent display ID map from localStorage
 */
export const getDisplayIdMap = () => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const raw = localStorage.getItem(DISPLAY_ID_MAP_KEY);
      if (raw) return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Error reading display ID map', e);
  }
  return {};
};

/**
 * Saves persistent display ID map
 */
export const saveDisplayIdMap = (map) => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(DISPLAY_ID_MAP_KEY, JSON.stringify(map));
    }
  } catch (e) {
    console.error('Error saving display ID map', e);
  }
};

/**
 * Reads teacher courses registry
 */
export const getTeacherCoursesMap = () => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const raw = localStorage.getItem(TEACHER_COURSES_MAP_KEY);
      if (raw) return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Error reading teacher courses map', e);
  }
  return {};
};

/**
 * Saves teacher courses registry
 */
export const saveTeacherCoursesMap = (map) => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(TEACHER_COURSES_MAP_KEY, JSON.stringify(map));
    }
  } catch (e) {
    console.error('Error saving teacher courses map', e);
  }
};

/**
 * Gets the next sequential course number for a teacher (starting at 1)
 */
export const getNextTeacherCourseSeq = (teacherStudentId) => {
  const stuNum = extractStudentNumber(teacherStudentId);
  const key = `${TEACHER_COUNTER_KEY_PREFIX}${stuNum}`;
  try {
    const raw = localStorage.getItem(key);
    const current = raw ? parseInt(raw, 10) : 0;
    const next = current + 1;
    localStorage.setItem(key, String(next));
    return next;
  } catch (e) {
    return 1;
  }
};

/**
 * Ensures sequential course counter for a teacher is at least a given number
 */
export const ensureMinTeacherCourseSeq = (teacherStudentId, minVal = 1) => {
  const stuNum = extractStudentNumber(teacherStudentId);
  const key = `${TEACHER_COUNTER_KEY_PREFIX}${stuNum}`;
  try {
    const raw = localStorage.getItem(key);
    const current = raw ? parseInt(raw, 10) : 0;
    if (minVal > current) {
      localStorage.setItem(key, String(minVal));
    }
  } catch (e) {
    // ignore
  }
};

// Aliases for backwards compatibility with previous imports
export const getNextCourseSeq = (studentId) => getNextTeacherCourseSeq(studentId);
export const ensureMinCourseSeq = (studentId, _type, minVal) => ensureMinTeacherCourseSeq(studentId, minVal);

/**
 * Pre-seeded teacher course directory
 */
const INITIAL_TEACHER_SKILLS = {
  // STU001 - Vidhi Kedia
  '001': {
    'react js frontend architecture': 1,
    'react js': 1,
    'database systems sql optimization': 2,
    'database systems': 2,
    'python for beginners oop': 3,
    'python': 3,
    'ui prototyping figma basics': 4,
    'figma basics': 4
  },
  // STU002 - Rashi Chandani
  '002': {
    'ui ux design': 1,
    'ui ux': 1,
    'graphic design': 2,
    'applied machine learning scikit learn': 3,
    'machine learning with scikit learn': 3
  },
  // STU003 - Riya Sharma
  '003': {
    'python': 1,
    'python programming': 1,
    'data science': 2,
    'web development': 3
  },
  // STU004 - Devansh Parekh
  '004': {
    'systems programming in c pointer memory': 1,
    'systems programming in c': 1,
    'c programming': 1
  },
  // STU005 - Kavita Joshi
  '005': {
    'technical public speaking pitching': 1,
    'public speaking': 1,
    'communication': 1
  },
  // STU006 - Aarav Mehta
  '006': {
    'c programming pointer fundamentals': 1,
    'c programming': 1,
    'web development': 2
  },
  // STU007 - Tanya Kapoor
  '007': {
    'figma ui ux systems prototyping': 1,
    'figma ui ux design systems wireframing': 1,
    'figma': 1
  },
  // STU008 - Sneha Rao
  '008': {
    'python for data automation scripting': 1,
    'python': 1
  },
  // STU009 - Rohan Mehra
  '009': {
    'vector graphic design in adobe illustrator': 1,
    'graphic design': 1
  },
  // STU010 - Vikram Sengupta
  '010': {
    'modern react component architecture': 1,
    'react js': 1
  },
  // STU011 - Ananya Iyer
  '011': {
    'data science with pandas sql numpy': 1,
    'data science': 1
  },
  // STU012 - Kabir Das
  '012': {
    'dslr photography composition': 1,
    'photography': 1
  },
  // STU013 - Pooja Nair
  '013': {
    'node js backend architecture': 1,
    'node js': 1
  }
};

/**
 * Resolves or creates a deterministic Teaching ID for a teacher and a skill.
 * Reuses the existing course number for duplicate offers of the same skill.
 */
export const getOrAssignTeacherCourse = (teacherStudentId = 'STU001', skillName = '') => {
  const stuNum = extractStudentNumber(teacherStudentId);
  const normSkill = normalizeSkillName(skillName);

  const teacherMap = getTeacherCoursesMap();
  const teacherSubMap = teacherMap[stuNum] || {};

  // Check persistent map
  if (normSkill && teacherSubMap[normSkill]) {
    return buildTeachingId(teacherStudentId, teacherSubMap[normSkill]);
  }

  // Check seed directory
  const seedSubMap = INITIAL_TEACHER_SKILLS[stuNum];
  if (seedSubMap) {
    if (normSkill && seedSubMap[normSkill]) {
      teacherSubMap[normSkill] = seedSubMap[normSkill];
      teacherMap[stuNum] = teacherSubMap;
      saveTeacherCoursesMap(teacherMap);
      return buildTeachingId(teacherStudentId, seedSubMap[normSkill]);
    }
    // Partial substring containment
    for (const [key, seq] of Object.entries(seedSubMap)) {
      if (normSkill.includes(key) || key.includes(normSkill)) {
        teacherSubMap[normSkill] = seq;
        teacherMap[stuNum] = teacherSubMap;
        saveTeacherCoursesMap(teacherMap);
        return buildTeachingId(teacherStudentId, seq);
      }
    }
  }

  // Allocate next sequence number for this teacher
  const nextSeq = getNextTeacherCourseSeq(teacherStudentId);
  if (normSkill) {
    teacherSubMap[normSkill] = nextSeq;
    teacherMap[stuNum] = teacherSubMap;
    saveTeacherCoursesMap(teacherMap);
  }

  return buildTeachingId(teacherStudentId, nextSeq);
};

/**
 * Initial deterministic seed mapping for known initial items
 */
export const SEED_DISPLAY_IDS = {
  // Vidhi Kedia (STU001) Teaching Skills
  'TCH001': 'TCR001CRS001',
  'TCH-0001': 'TCR001CRS001',
  'teach-1': 'TCR001CRS001',
  'TCH002': 'TCR001CRS002',
  'TCH-0002': 'TCR001CRS002',
  'teach-2': 'TCR001CRS002',
  'TCH003': 'TCR001CRS003',
  'TCH-0003': 'TCR001CRS003',
  'teach-3': 'TCR001CRS003',
  'TCH004': 'TCR001CRS004',
  'TCH-0004': 'TCR001CRS004',
  'teach-4': 'TCR001CRS004',

  // Vidhi Kedia (STU001) Learning Requests:
  // req-1: Matched with Rashi Chandani (TCR002CRS003 - Applied ML)
  'LRN001': 'LRN001-TCR002CRS003',
  'LRN-0001': 'LRN001-TCR002CRS003',
  'req-1': 'LRN001-TCR002CRS003',
  // req-2: Docker & Cloud - Open / Unmatched
  'LRN002': AWAITING_TEACHER_ID,
  'LRN-0002': AWAITING_TEACHER_ID,
  'req-2': AWAITING_TEACHER_ID,
  // req-3: Public Speaking - Open / Unmatched
  'LRN003': AWAITING_TEACHER_ID,
  'LRN-0003': AWAITING_TEACHER_ID,
  'req-3': AWAITING_TEACHER_ID,
  // req-4: Matched with Devansh Parekh (TCR004CRS001 - Systems C)
  'LRN004': 'LRN001-TCR004CRS001',
  'LRN-0004': 'LRN001-TCR004CRS001',
  'req-4': 'LRN001-TCR004CRS001',

  // Peer Teaching Offerings
  'TCH010': 'TCR002CRS001', // Rashi Chandani UI/UX
  'TCH011': 'TCR002CRS002', // Rashi Chandani Graphic Design
  'TCH012': 'TCR002CRS003', // Rashi Chandani ML
  'TCH013': 'TCR003CRS001', // Riya Sharma Python
  'TCH014': 'TCR003CRS002', // Riya Sharma Data Science
  'TCH015': 'TCR003CRS003', // Riya Sharma Web Dev
  'TCH016': 'TCR004CRS001', // Devansh Parekh Systems C
  'TCH017': 'TCR005CRS001', // Kavita Joshi Public Speaking
  'TCH018': 'TCR006CRS001', // Aarav Mehta C
  'TCH019': 'TCR006CRS002', // Aarav Mehta Web Dev
  'TCH020': 'TCR007CRS001', // Tanya Kapoor Figma
  'TCH021': 'TCR008CRS001', // Sneha Rao Python
  'TCH022': 'TCR009CRS001', // Rohan Mehra Graphic Design
  'TCH023': 'TCR010CRS001', // Vikram Sengupta React
  'TCH024': 'TCR011CRS001', // Ananya Iyer Data Science
  'TCH025': 'TCR012CRS001'  // Kabir Das Photography
};

/**
 * Resolves or deterministically assigns a readable display ID.
 */
export const getReadableId = (recordOrId, type = '', studentId = 'STU001') => {
  if (!recordOrId) return '';

  // 1. Direct string checks
  if (typeof recordOrId === 'string') {
    const trimmed = recordOrId.trim();
    if (trimmed === AWAITING_TEACHER_ID) return AWAITING_TEACHER_ID;
    // New Learning ID format: LRN007-TCR004CRS001
    if (/^LRN\d{3,4}-TCR\d{3,4}CRS\d{3,4}$/.test(trimmed)) return trimmed;
    // Teaching ID format: TCR004CRS001
    if (/^TCR\d{3,4}CRS\d{3,4}$/.test(trimmed)) return trimmed;
    // Student ID format: STU004
    if (/^STU\d{3,4}$/.test(trimmed)) return trimmed;

    // Check seed map
    if (SEED_DISPLAY_IDS[trimmed]) return SEED_DISPLAY_IDS[trimmed];

    // Check persistent map
    const map = getDisplayIdMap();
    if (map[trimmed]) return map[trimmed];
  }

  const record = typeof recordOrId === 'object' ? recordOrId : null;
  const rawId =
    record?.displayId ||
    record?.readableId ||
    record?.teachingId ||
    record?.learningId ||
    record?.SS_ID ||
    record?.Request_ID ||
    record?.id ||
    recordOrId;

  if (typeof rawId === 'string') {
    const rawTrimmed = rawId.trim();
    if (rawTrimmed === AWAITING_TEACHER_ID) return AWAITING_TEACHER_ID;
    if (/^LRN\d{3,4}-TCR\d{3,4}CRS\d{3,4}$/.test(rawTrimmed)) return rawTrimmed;
    if (/^TCR\d{3,4}CRS\d{3,4}$/.test(rawTrimmed)) return rawTrimmed;
    if (SEED_DISPLAY_IDS[rawTrimmed]) return SEED_DISPLAY_IDS[rawTrimmed];
    const map = getDisplayIdMap();
    if (map[rawTrimmed]) return map[rawTrimmed];
  }

  // Determine if this is a learning request or teaching skill
  const isLearning =
    type === 'LRN' ||
    record?.type === 'LRN' ||
    record?.learningId ||
    record?.Request_ID ||
    record?.targetGoal ||
    record?.learningGoal;

  if (isLearning) {
    // Unmatched learning request check
    const status = record?.status || 'Open';
    const hasTeacher = record?.teachingId || record?.teacherTcrId || record?.teacherId || record?.teacherStudentId;
    if (status !== 'Matched' && !hasTeacher) {
      return AWAITING_TEACHER_ID;
    }

    const learnerStuId = record?.learnerStudentId || record?.studentId || record?.Student_ID || studentId;
    let teacherTcr = record?.teacherTcrId || record?.teachingId;
    if (!teacherTcr || !/^TCR\d{3,4}CRS\d{3,4}$/.test(teacherTcr)) {
      // Derive teacher TCR from skill name if matched
      const teacherStu = record?.teacherStudentId || record?.teacherId || 'STU004';
      teacherTcr = getOrAssignTeacherCourse(teacherStu, record?.name || record?.skill || '');
    }
    return buildLearningId(learnerStuId, teacherTcr);
  }

  // Otherwise, it's a Teaching skill
  const teacherStuId = record?.teacherStudentId || record?.studentId || record?.Student_ID || studentId;
  const skillTitle = record?.name || record?.skill || record?.skillName || '';
  const newTcrId = getOrAssignTeacherCourse(teacherStuId, skillTitle);

  // Store in map
  if (typeof rawId === 'string') {
    const map = getDisplayIdMap();
    map[rawId] = newTcrId;
    saveDisplayIdMap(map);
  }

  return newTcrId;
};

/**
 * Student name dictionary for popover decoding
 */
export const STUDENT_NAMES = {
  '001': { name: 'Vidhi Kedia', short: 'Vidhi K.' },
  '002': { name: 'Rashi Chandani', short: 'Rashi C.' },
  '003': { name: 'Riya Sharma', short: 'Riya S.' },
  '004': { name: 'Devansh Parekh', short: 'Devansh P.' },
  '005': { name: 'Kavita Joshi', short: 'Kavita J.' },
  '006': { name: 'Aarav Mehta', short: 'Aarav M.' },
  '007': { name: 'Tanya Kapoor', short: 'Tanya K.' },
  '008': { name: 'Sneha Rao', short: 'Sneha R.' },
  '009': { name: 'Rohan Mehra', short: 'Rohan M.' },
  '010': { name: 'Vikram Sengupta', short: 'Vikram S.' },
  '011': { name: 'Ananya Iyer', short: 'Ananya I.' },
  '012': { name: 'Kabir Das', short: 'Kabir D.' },
  '013': { name: 'Pooja Nair', short: 'Pooja N.' }
};

/**
 * Course mapping fallback for known course numbers
 */
export const COURSE_NAMES = {
  'TCR001CRS001': 'React.js & Frontend Architecture',
  'TCR001CRS002': 'Database Systems & SQL Optimization',
  'TCR001CRS003': 'Python for Beginners & OOP',
  'TCR001CRS004': 'UI Prototyping & Figma Basics',
  'TCR002CRS001': 'UI/UX Design',
  'TCR002CRS002': 'Graphic Design',
  'TCR002CRS003': 'Applied Machine Learning & Scikit-Learn',
  'TCR003CRS001': 'Python Programming',
  'TCR003CRS002': 'Data Science',
  'TCR003CRS003': 'Web Development',
  'TCR004CRS001': 'Systems Programming in C & Pointer Memory',
  'TCR005CRS001': 'Technical Public Speaking & Pitching',
  'TCR006CRS001': 'C Programming & Pointer Fundamentals',
  'TCR006CRS002': 'Web Development',
  'TCR007CRS001': 'Figma UI/UX Systems & Prototyping',
  'TCR008CRS001': 'Python for Data Automation & Scripting',
  'TCR009CRS001': 'Vector Graphic Design in Adobe Illustrator',
  'TCR010CRS001': 'Modern React & Component Architecture',
  'TCR011CRS001': 'Data Science with Pandas, SQL & NumPy',
  'TCR012CRS001': 'DSLR Photography & Composition',
  'TCR013CRS001': 'Node.js & Backend Architecture'
};

/**
 * Format first name plus last initial
 */
export const formatShortName = (fullName) => {
  if (!fullName) return 'Student';
  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 1) return parts[0];
  return `${parts[0]} ${parts[parts.length - 1][0]}.`;
};

/**
 * Decodes readable ID into human-friendly sentence for the popover:
 * For TCR004CRS001:
 *   "Teacher: STU004 (Devansh Parekh) • Course 001 (Python)"
 *   (Shows full name if logged-in student, or first name plus last initial if another student)
 * For LRN007-TCR004CRS001:
 *   "Learner: STU007 (Tanya K.) learning Course 001 (Python) from Teacher STU004 (Devansh P.)"
 * For "Awaiting teacher":
 *   "No teacher assigned yet. You will get a Learning ID once matched with a course."
 */
export const decodeReadableId = (readableId = '', context = {}) => {
  if (!readableId || typeof readableId !== 'string') return '';

  const clean = readableId.trim();

  // Awaiting teacher
  if (clean === AWAITING_TEACHER_ID) {
    return 'No teacher assigned yet. You will get a Learning ID once matched with a course.';
  }

  // Student ID
  if (/^STU\d{3,4}$/.test(clean)) {
    const stuNum = clean.replace('STU', '');
    const isSelf = stuNum === '001' || context.isCurrentUser;
    const stuInfo = STUDENT_NAMES[stuNum];
    const nameStr = isSelf
      ? (context.userName || stuInfo?.name || 'Vidhi Kedia')
      : (stuInfo?.short || (context.peerName ? formatShortName(context.peerName) : 'Campus Student'));
    return `Student: ${clean} (${nameStr})`;
  }

  // Learning ID: LRN{learnerNum}-TCR{teacherNum}CRS{courseNum}
  const lrnMatch = clean.match(/^LRN(\d{3,4})-TCR(\d{3,4})CRS(\d{3,4})$/);
  if (lrnMatch) {
    const learnerNum = lrnMatch[1];
    const teacherNum = lrnMatch[2];
    const crsNum = lrnMatch[3];
    const tcrId = `TCR${teacherNum}CRS${crsNum}`;

    const isLearnerSelf = learnerNum === '001' || context.isLearnerCurrentUser;
    const learnerInfo = STUDENT_NAMES[learnerNum];
    const learnerName = isLearnerSelf
      ? (context.userName || learnerInfo?.name || 'Vidhi Kedia')
      : (learnerInfo?.short || (context.learnerName ? formatShortName(context.learnerName) : `Student ${learnerNum}`));

    const isTeacherSelf = teacherNum === '001' || context.isTeacherCurrentUser;
    const teacherInfo = STUDENT_NAMES[teacherNum];
    const teacherName = isTeacherSelf
      ? (context.userName || teacherInfo?.name || 'Vidhi Kedia')
      : (teacherInfo?.short || (context.teacherName ? formatShortName(context.teacherName) : `Teacher ${teacherNum}`));

    const skillName = context.skillName || context.name || COURSE_NAMES[tcrId] || `Course ${crsNum}`;

    return `Learner: STU${learnerNum} (${learnerName}) learning Course ${crsNum} (${skillName}) from Teacher STU${teacherNum} (${teacherName})`;
  }

  // Teaching ID: TCR{teacherNum}CRS{courseNum}
  const tcrMatch = clean.match(/^TCR(\d{3,4})CRS(\d{3,4})$/);
  if (tcrMatch) {
    const teacherNum = tcrMatch[1];
    const crsNum = tcrMatch[2];
    const isTeacherSelf = teacherNum === '001' || context.isCurrentUser;
    const teacherInfo = STUDENT_NAMES[teacherNum];
    const teacherName = isTeacherSelf
      ? (context.userName || teacherInfo?.name || 'Vidhi Kedia')
      : (teacherInfo?.short || (context.peerName ? formatShortName(context.peerName) : 'Campus Mentor'));

    const skillName = context.skillName || context.name || COURSE_NAMES[clean] || (context.skill ? context.skill : `Course ${crsNum}`);

    return `Teacher: STU${teacherNum} (${teacherName}) • Course ${crsNum} (${skillName})`;
  }

  return clean;
};

/**
 * Enrolled learners per teaching skill for Vidhi Kedia (STU001)
 */
export const ENROLLED_LEARNERS_MAP = {
  'TCR001CRS001': [
    { learnerStudentId: 'STU006', learnerName: 'Aarav Mehta', learningId: 'LRN006-TCR001CRS001' },
    { learnerStudentId: 'STU002', learnerName: 'Rashi Chandani', learningId: 'LRN002-TCR001CRS001' }
  ],
  'TCR001CRS002': [
    { learnerStudentId: 'STU008', learnerName: 'Sneha Rao', learningId: 'LRN008-TCR001CRS002' },
    { learnerStudentId: 'STU003', learnerName: 'Riya Sharma', learningId: 'LRN003-TCR001CRS002' }
  ],
  'TCR001CRS003': [
    { learnerStudentId: 'STU009', learnerName: 'Rohan Verma', learningId: 'LRN009-TCR001CRS003' },
    { learnerStudentId: 'STU005', learnerName: 'Kavita Joshi', learningId: 'LRN005-TCR001CRS003' }
  ],
  'TCR001CRS004': [
    { learnerStudentId: 'STU007', learnerName: 'Tanya Kapoor', learningId: 'LRN007-TCR001CRS004' },
    { learnerStudentId: 'STU004', learnerName: 'Devansh Parekh', learningId: 'LRN004-TCR001CRS004' }
  ]
};

/**
 * Backfills deterministic readable IDs into an active user object on load.
 * Persists them so they never shift.
 */
export const backfillUserReadableIds = (user) => {
  if (!user) return user;
  let modified = false;
  const stuId = user.studentId || 'STU001';

  // Backfill teaching skills
  const skillsOffered = (user.skillsOffered || []).map((skill, index) => {
    const existing = skill.teachingId || skill.readableId || skill.displayId;
    let tcrId = '';
    if (existing && /^TCR\d{3,4}CRS\d{3,4}$/.test(existing)) {
      tcrId = existing;
    } else {
      tcrId = SEED_DISPLAY_IDS[skill.id] || SEED_DISPLAY_IDS[skill.SS_ID] || buildTeachingId(stuId, index + 1);
      modified = true;
    }

    const enrolled = ENROLLED_LEARNERS_MAP[tcrId] || [
      { learnerStudentId: 'STU006', learnerName: 'Aarav Mehta', learningId: `LRN006-${tcrId}` }
    ];

    return {
      ...skill,
      teachingId: tcrId,
      displayId: tcrId,
      readableId: tcrId,
      enrolledLearners: enrolled
    };
  });

  // Backfill learning requests
  const skillsWanted = (user.skillsWanted || []).map((req) => {
    const rawId = req.id || req.learningId || req.Request_ID;
    let lrnId = SEED_DISPLAY_IDS[rawId];

    if (!lrnId) {
      if (req.status === 'Matched') {
        const teacherStuId = req.teacherStudentId || 'STU004';
        const teacherTcr = getOrAssignTeacherCourse(teacherStuId, req.name);
        lrnId = buildLearningId(stuId, teacherTcr);
      } else {
        lrnId = AWAITING_TEACHER_ID;
      }
    }

    if (lrnId !== req.displayId || lrnId !== req.learningId) {
      modified = true;
    }

    return {
      ...req,
      learningId: lrnId,
      displayId: lrnId,
      readableId: lrnId
    };
  });

  ensureMinTeacherCourseSeq(stuId, skillsOffered.length);

  if (modified) {
    return {
      ...user,
      skillsOffered,
      skillsWanted
    };
  }
  return user;
};

/**
 * Resolves course Teaching ID and Learning ID for chat threads and conversations
 */
export const getConversationCourseIds = (peerName = '', skillContext = '', currentStudentId = 'STU001') => {
  const normName = (peerName || '').toLowerCase();
  let teacherStuId = 'STU002';
  let skill = 'General Course';
  let teachingId = '';
  let learningId = '';

  if (normName.includes('devansh')) {
    teacherStuId = 'STU004';
    skill = 'Systems Programming in C & Pointer Memory';
    teachingId = 'TCR004CRS001';
    learningId = `LRN${extractStudentNumber(currentStudentId)}-TCR004CRS001`;
  } else if (normName.includes('rashi')) {
    teacherStuId = 'STU002';
    skill = 'Applied Machine Learning & Scikit-Learn';
    teachingId = 'TCR002CRS003';
    learningId = `LRN${extractStudentNumber(currentStudentId)}-TCR002CRS003`;
  } else if (normName.includes('riya')) {
    teacherStuId = 'STU003';
    skill = 'Web Development & Cloud Deployment';
    teachingId = 'TCR003CRS003';
    learningId = `LRN${extractStudentNumber(currentStudentId)}-TCR003CRS003`;
  } else if (normName.includes('kavita')) {
    teacherStuId = 'STU005';
    skill = 'Technical Public Speaking & Pitching';
    teachingId = 'TCR005CRS001';
    learningId = `LRN${extractStudentNumber(currentStudentId)}-TCR005CRS001`;
  } else if (normName.includes('aarav')) {
    teacherStuId = currentStudentId;
    skill = 'React.js & Frontend Architecture';
    teachingId = 'TCR001CRS001';
    learningId = `LRN006-TCR001CRS001`;
  } else if (normName.includes('tanya')) {
    teacherStuId = 'STU007';
    skill = 'Figma UI/UX Systems & Prototyping';
    teachingId = 'TCR007CRS001';
    learningId = `LRN${extractStudentNumber(currentStudentId)}-TCR007CRS001`;
  } else if (normName.includes('sneha')) {
    teacherStuId = 'STU008';
    skill = 'Python for Data Automation & Scripting';
    teachingId = 'TCR008CRS001';
    learningId = `LRN${extractStudentNumber(currentStudentId)}-TCR008CRS001`;
  } else {
    teachingId = getOrAssignTeacherCourse(teacherStuId, skillContext || 'General Course');
    learningId = buildLearningId(currentStudentId, teachingId);
  }

  return { teachingId, learningId, skill };
};
