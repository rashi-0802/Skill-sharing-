// Campus Skill Exchange API - zero dependencies (Node 22.13+).
// Start with: npm start   (after: npm run seed)
const http = require('http');
const { db, hashPassword, verifyPassword } = require('./db');

const PORT = process.env.PORT || 3000;

const routes = [];
const route = (method, pattern, handler) => {
  const keys = [];
  const regex = new RegExp(
    '^' + pattern.replace(/:([a-zA-Z]+)/g, (_, k) => (keys.push(k), '([^/]+)')) + '/?$'
  );
  routes.push({ method, regex, keys, handler });
};

class HttpError extends Error {
  constructor(status, message) { super(message); this.status = status; }
}
const bad = (msg) => new HttpError(400, msg);
const notFound = (msg) => new HttpError(404, msg);

function readBody(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', (c) => { data += c; if (data.length > 1e6) reject(bad('Body too large')); });
    req.on('end', () => {
      if (!data) return resolve({});
      try { resolve(JSON.parse(data)); } catch { reject(bad('Invalid JSON body')); }
    });
  });
}

function send(res, status, payload) {
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET,POST,PATCH,PUT,DELETE,OPTIONS',
  });
  res.end(payload === undefined ? '' : JSON.stringify(payload));
}

const required = (obj, ...fields) => {
  for (const f of fields) {
    if (obj[f] === undefined || obj[f] === null || obj[f] === '') throw bad(`${f} is required`);
  }
};

const LEVELS = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];
function normalizeLevel(value, fallback) {
  if (value === undefined || value === null || value === '') return fallback;
  if (String(value).toLowerCase() === 'mastery') return 'Expert';
  const hit = LEVELS.find((l) => l.toLowerCase() === String(value).toLowerCase());
  if (!hit) throw bad('Invalid proficiency level');
  return hit;
}

const STUDENT_COLS = 'StudentID, Name, Email, Department, YearOfStudy, Bio, HostelBlock, RoomNo';
const getStudent = (id) => {
  const s = db.prepare(`SELECT ${STUDENT_COLS} FROM STUDENT WHERE StudentID = ?`).get(id);
  if (!s) throw notFound('Student not found');
  return s;
};
const getExchange = (id) => {
  const e = db.prepare('SELECT * FROM EXCHANGE WHERE ExchangeID = ?').get(id);
  if (!e) throw notFound('Exchange not found');
  return e;
};

function findOrCreateSkill(skillName, category) {
  const name = String(skillName || '').trim();
  if (!name) throw bad('skillName is required');
  const existing = db.prepare('SELECT * FROM SKILL WHERE lower(SkillName) = lower(?)').get(name);
  if (existing) return existing;
  const r = db.prepare('INSERT INTO SKILL (SkillName, Category) VALUES (?,?)')
    .run(name, category ?? null);
  return db.prepare('SELECT * FROM SKILL WHERE SkillID = ?').get(r.lastInsertRowid);
}

function resolveSkill(body) {
  if (body.skillId) {
    const sk = db.prepare('SELECT * FROM SKILL WHERE SkillID = ?').get(body.skillId);
    if (!sk) throw bad('Referenced student, skill or exchange does not exist');
    return sk;
  }
  if (body.skillName) return findOrCreateSkill(body.skillName, body.category);
  throw bad('skillId or skillName is required');
}

function initials(name) {
  return String(name || 'ST').split(/\s+/).map((p) => p[0]).join('').slice(0, 2).toUpperCase();
}

function displayStudentId(id) {
  return 'STU' + String(id).padStart(3, '0');
}

function teacherRating(studentId) {
  const row = db.prepare(
    `SELECT ROUND(AVG(f.Rating), 2) AS AvgRating, COUNT(f.FeedbackID) AS Reviews
     FROM EXCHANGE e
     JOIN FEEDBACK f ON f.ExchangeID = e.ExchangeID AND f.GivenBy = e.LearnerID
     WHERE e.TeacherID = ?`
  ).get(studentId);
  return { avgRating: row?.AvgRating != null ? Number(row.AvgRating) : null, reviews: row?.Reviews || 0 };
}

function sessionCounts(studentId) {
  const taught = db.prepare(
    `SELECT COUNT(*) AS n FROM SESSION s JOIN EXCHANGE e ON e.ExchangeID = s.ExchangeID
     WHERE e.TeacherID = ? AND s.Status = 'Completed'`
  ).get(studentId).n;
  const attended = db.prepare(
    `SELECT COUNT(*) AS n FROM SESSION s JOIN EXCHANGE e ON e.ExchangeID = s.ExchangeID
     WHERE e.LearnerID = ? AND s.Status = 'Completed'`
  ).get(studentId).n;
  return { sessionsTaught: taught, sessionsAttended: attended };
}

const SESSION_SELECT = `
  SELECT s.*, e.TeacherID, e.LearnerID, e.SkillID, e.Status AS ExchangeStatus,
         t.Name AS TeacherName, t.Department AS TeacherDept, t.YearOfStudy AS TeacherYear,
         l.Name AS LearnerName, l.Department AS LearnerDept, l.YearOfStudy AS LearnerYear,
         sk.SkillName
  FROM SESSION s
  JOIN EXCHANGE e ON e.ExchangeID = s.ExchangeID
  JOIN STUDENT t ON t.StudentID = e.TeacherID
  JOIN STUDENT l ON l.StudentID = e.LearnerID
  JOIN SKILL sk ON sk.SkillID = e.SkillID`;

function mapSession(row, viewerId) {
  const viewer = Number(viewerId);
  const isTeacher = viewer === row.TeacherID;
  const partnerName = isTeacher ? row.LearnerName : row.TeacherName;
  const partnerDept = isTeacher
    ? [row.LearnerDept, row.LearnerYear].filter(Boolean).join(' · ')
    : [row.TeacherDept, row.TeacherYear].filter(Boolean).join(' · ');
  const uiStatus = row.Status === 'Scheduled' ? 'Upcoming' : row.Status;
  const timeLabel = row.StartTime
    ? `${row.StartTime}${row.DurationMins ? ` · ${row.DurationMins} mins` : ''}`
    : '';
  return {
    ...row,
    id: `SES-${String(row.SessionID).padStart(4, '0')}`,
    sessionId: `SES-${String(row.SessionID).padStart(4, '0')}`,
    Session_ID: `SES-${String(row.SessionID).padStart(4, '0')}`,
    skill: row.SkillName,
    topic: row.Topic || row.SkillName,
    teacher: row.TeacherName,
    learner: row.LearnerName,
    teacherStudentId: displayStudentId(row.TeacherID),
    learnerStudentId: displayStudentId(row.LearnerID),
    partnerName,
    partnerDept,
    partnerRole: isTeacher ? 'Learner' : 'Teacher',
    userRole: isTeacher ? 'Teacher' : 'Learner',
    date: row.SessionDate,
    time: timeLabel || 'To be confirmed',
    duration: `${row.DurationMins || 60} mins`,
    status: uiStatus,
    mode: row.Mode === 'Online' ? 'Google Meet' : (row.Location || 'Campus'),
    link: row.Location,
    notes: row.Topic || '',
  };
}

function offeredRows(studentId) {
  return db.prepare(
    `SELECT sk.SkillID, sk.SkillName, sk.Category, so.ProficiencyLevel AS Level,
            so.Description, so.Availability
     FROM SKILL_OFFERED so JOIN SKILL sk ON sk.SkillID = so.SkillID
     WHERE so.StudentID = ?`
  ).all(studentId);
}

function wantedRows(studentId) {
  return db.prepare(
    `SELECT sk.SkillID, sk.SkillName, sk.Category, sw.DesiredLevel AS Level,
            sw.Description, sw.Priority,
            (SELECT e.ExchangeID FROM EXCHANGE e
              WHERE e.LearnerID = sw.StudentID AND e.SkillID = sw.SkillID
              ORDER BY e.ExchangeID DESC LIMIT 1) AS ExchangeID,
            (SELECT e.Status FROM EXCHANGE e
              WHERE e.LearnerID = sw.StudentID AND e.SkillID = sw.SkillID
              ORDER BY e.ExchangeID DESC LIMIT 1) AS ExchangeStatus,
            (SELECT e.TeacherID FROM EXCHANGE e
              WHERE e.LearnerID = sw.StudentID AND e.SkillID = sw.SkillID
              ORDER BY e.ExchangeID DESC LIMIT 1) AS TeacherID
     FROM SKILL_WANTED sw JOIN SKILL sk ON sk.SkillID = sw.SkillID
     WHERE sw.StudentID = ?`
  ).all(studentId);
}

function mapWanted(row) {
  let status = 'Open';
  if (row.ExchangeStatus === 'Pending' || row.ExchangeStatus === 'Accepted') status = 'Matched';
  if (row.ExchangeStatus === 'Completed') status = 'Completed';
  return {
    ...row,
    id: `LRN-${row.SkillID}`,
    learningId: row.TeacherID
      ? `LRN${String(row.SkillID).padStart(3, '0')}-TCR${String(row.TeacherID).padStart(3, '0')}`
      : 'AWAITING_TEACHER',
    name: row.SkillName,
    category: row.Category,
    currentLevel: 'Beginner',
    desiredLevel: row.Level,
    preferredLevel: row.Level,
    Desired_Level: row.Level,
    priority: row.Priority || 'Medium',
    Priority_Level: row.Priority || 'Medium',
    status,
    description: row.Description || '',
    targetGoal: row.Description || '',
    learningGoal: row.Description || '',
    teacherStudentId: row.TeacherID ? displayStudentId(row.TeacherID) : null,
  };
}

function mapOffered(row, studentId) {
  const helped = db.prepare(
    `SELECT COUNT(*) AS n FROM EXCHANGE
     WHERE TeacherID = ? AND SkillID = ? AND Status IN ('Accepted','Completed')`
  ).get(studentId, row.SkillID).n;
  return {
    ...row,
    id: `TCH-${studentId}-${row.SkillID}`,
    teachingId: `TCR${String(studentId).padStart(3, '0')}CRS${String(row.SkillID).padStart(3, '0')}`,
    name: row.SkillName,
    category: row.Category,
    proficiency: row.Level,
    Proficiency_Level: row.Level,
    level: row.Level,
    description: row.Description || '',
    Description: row.Description || '',
    availability: row.Availability || 'Flexible',
    learnersHelped: helped,
    rating: teacherRating(studentId).avgRating || 5,
    courseId: `CRS${String(row.SkillID).padStart(3, '0')}`,
    Skill_ID: `CRS${String(row.SkillID).padStart(3, '0')}`,
    studentId: displayStudentId(studentId),
  };
}

function WEEKDAYS() {
  return [
    { day: 'Monday', dayShort: 'Mon' },
    { day: 'Tuesday', dayShort: 'Tue' },
    { day: 'Wednesday', dayShort: 'Wed' },
    { day: 'Thursday', dayShort: 'Thu' },
    { day: 'Friday', dayShort: 'Fri' },
    { day: 'Saturday', dayShort: 'Sat' },
    { day: 'Sunday', dayShort: 'Sun' },
  ];
}

function getAvailability(studentId) {
  const rows = db.prepare(
    'SELECT * FROM AVAILABILITY WHERE StudentID = ? ORDER BY AvailabilityID'
  ).all(studentId);
  return WEEKDAYS().map((d) => {
    const slots = rows.filter((r) => r.DayOfWeek === d.day).map((r) => ({
      id: `slot-${r.AvailabilityID}`,
      availabilityId: r.AvailabilityID,
      start: r.StartTime,
      end: r.EndTime,
      label: `${r.StartTime} – ${r.EndTime}`,
      period: r.Label || 'Study slot',
      enabled: r.Enabled === 1,
    }));
    return { ...d, enabled: slots.some((s) => s.enabled !== false) && slots.length > 0, slots };
  });
}

function hydrateStudent(id) {
  const student = getStudent(id);
  const rating = teacherRating(id);
  const counts = sessionCounts(id);
  const offered = offeredRows(id).map((r) => mapOffered(r, id));
  const wanted = wantedRows(id).map(mapWanted);
  return {
    ...student,
    id: student.StudentID,
    studentId: displayStudentId(student.StudentID),
    name: student.Name,
    email: student.Email,
    department: student.Department || '',
    year: student.YearOfStudy || '',
    bio: student.Bio || '',
    rating: rating.avgRating != null ? String(rating.avgRating) : '5.00',
    ...counts,
    offered,
    wanted,
    skillsOffered: offered,
    skillsWanted: wanted,
  };
}

function listFeedbackForStudent(studentId) {
  return db.prepare(
    `SELECT f.*, s.Name AS GivenByName, e.TeacherID, e.LearnerID, e.SkillID, sk.SkillName,
            sess.SessionID, sess.SessionDate
     FROM FEEDBACK f
     JOIN EXCHANGE e ON e.ExchangeID = f.ExchangeID
     JOIN STUDENT s ON s.StudentID = f.GivenBy
     JOIN SKILL sk ON sk.SkillID = e.SkillID
     LEFT JOIN SESSION sess ON sess.ExchangeID = e.ExchangeID
     WHERE (e.TeacherID = ? OR e.LearnerID = ?) AND f.GivenBy <> ?
     ORDER BY f.FeedbackID DESC`
  ).all(studentId, studentId, studentId);
}

function mapReview(row, viewerId) {
  const authorRole = row.GivenBy === row.LearnerID ? 'Learner' : 'Teacher';
  return {
    id: `RAT-${row.FeedbackID}`,
    ratingId: `RAT-${String(row.FeedbackID).padStart(4, '0')}`,
    Rating_ID: `RAT-${String(row.FeedbackID).padStart(4, '0')}`,
    sessionId: row.SessionID ? `SES-${String(row.SessionID).padStart(4, '0')}` : '',
    Session_ID: row.SessionID ? `SES-${String(row.SessionID).padStart(4, '0')}` : '',
    author: row.GivenByName,
    authorRole,
    rating: row.Rating,
    skill: row.SkillName,
    sessionDate: row.SessionDate,
    date: row.CreatedAt || '',
    comment: row.Comments || '',
  };
}

function conversationsFor(studentId) {
  const me = Number(studentId);
  const peers = db.prepare(
    `SELECT DISTINCT CASE WHEN SenderID = ? THEN ReceiverID ELSE SenderID END AS PeerID
     FROM MESSAGE WHERE SenderID = ? OR ReceiverID = ?`
  ).all(me, me, me);
  return peers.map((p) => {
    const peer = getStudent(p.PeerID);
    const messages = db.prepare(
      `SELECT m.*, s.Name AS SenderName FROM MESSAGE m
       JOIN STUDENT s ON s.StudentID = m.SenderID
       WHERE (m.SenderID = ? AND m.ReceiverID = ?) OR (m.SenderID = ? AND m.ReceiverID = ?)
       ORDER BY m.MessageID`
    ).all(me, p.PeerID, p.PeerID, me);
    const unread = messages.filter((m) => m.ReceiverID === me && m.IsRead === 0).length;
    const last = messages[messages.length - 1];
    return {
      id: `conv-${p.PeerID}`,
      peerId: p.PeerID,
      peerName: peer.Name,
      peerDept: [peer.Department, peer.YearOfStudy].filter(Boolean).join(' · '),
      peerAvatar: initials(peer.Name),
      avatarBg: 'avatar-indigo',
      onlineStatus: 'offline',
      lastActive: last ? last.SentAt : '',
      skillContext: 'Peer knowledge exchange',
      unreadCount: unread,
      messages: messages.map((m) => ({
        id: `m-${m.MessageID}`,
        messageId: m.MessageID,
        sender: m.SenderName,
        text: m.Body,
        timestamp: m.SentAt,
        isMine: m.SenderID === me,
      })),
    };
  }).sort((a, b) => String(b.lastActive).localeCompare(String(a.lastActive)));
}

// ---------- auth / students ----------
route('POST', '/api/register', (req, body) => {
  required(body, 'name', 'email', 'password');
  if (String(body.password).length < 6) throw bad('Password must be at least 6 characters');
  const r = db.prepare(
    `INSERT INTO STUDENT (Name, Email, Department, YearOfStudy, Bio, HostelBlock, RoomNo, Password)
     VALUES (?,?,?,?,?,?,?,?)`
  ).run(
    body.name, body.email,
    body.department ?? null, body.year ?? body.yearOfStudy ?? null, body.bio ?? null,
    body.hostelBlock ?? null, body.roomNo ?? null,
    hashPassword(body.password)
  );
  return [201, hydrateStudent(r.lastInsertRowid)];
});

route('POST', '/api/login', (req, body) => {
  required(body, 'email', 'password');
  const s = db.prepare('SELECT * FROM STUDENT WHERE Email = ?').get(body.email);
  if (!s || !verifyPassword(body.password, s.Password)) throw new HttpError(401, 'Invalid email or password');
  return hydrateStudent(s.StudentID);
});

route('GET', '/api/students', () =>
  db.prepare(`SELECT ${STUDENT_COLS} FROM STUDENT ORDER BY Name`).all());

route('GET', '/api/students/:id', (req, body, p) => hydrateStudent(p.id));

route('PATCH', '/api/students/:id', (req, body, p) => {
  const cur = getStudent(p.id);
  db.prepare(
    `UPDATE STUDENT SET Name=?, Email=?, Department=?, YearOfStudy=?, Bio=?, HostelBlock=?, RoomNo=?
     WHERE StudentID=?`
  ).run(
    body.name ?? cur.Name,
    body.email ?? cur.Email,
    body.department ?? cur.Department,
    body.year ?? body.yearOfStudy ?? cur.YearOfStudy,
    body.bio ?? cur.Bio,
    body.hostelBlock ?? cur.HostelBlock,
    body.roomNo ?? cur.RoomNo,
    p.id
  );
  return hydrateStudent(p.id);
});

// ---------- skills ----------
route('GET', '/api/skills', (req, body, p, q) => {
  if (q.get('category')) {
    return db.prepare('SELECT * FROM SKILL WHERE Category = ? ORDER BY SkillName').all(q.get('category'));
  }
  return db.prepare('SELECT * FROM SKILL ORDER BY SkillName').all();
});

route('POST', '/api/skills', (req, body) => {
  required(body, 'skillName');
  const r = db.prepare('INSERT INTO SKILL (SkillName, Category) VALUES (?,?)')
    .run(body.skillName, body.category ?? null);
  return [201, db.prepare('SELECT * FROM SKILL WHERE SkillID = ?').get(r.lastInsertRowid)];
});

route('GET', '/api/explore', (req, body, p, q) => {
  const category = q.get('category');
  const search = (q.get('q') || '').trim().toLowerCase();
  let rows = db.prepare(
    `SELECT so.StudentID, so.SkillID, so.ProficiencyLevel, so.Description, so.Availability,
            sk.SkillName, sk.Category, st.Name, st.Department, st.YearOfStudy
     FROM SKILL_OFFERED so
     JOIN SKILL sk ON sk.SkillID = so.SkillID
     JOIN STUDENT st ON st.StudentID = so.StudentID
     ORDER BY sk.SkillName`
  ).all();
  if (category && category !== 'All') {
    rows = rows.filter((r) => String(r.Category || '').toLowerCase() === category.toLowerCase());
  }
  if (search) {
    rows = rows.filter((r) =>
      [r.SkillName, r.Description, r.Name, r.Category].some((v) => String(v || '').toLowerCase().includes(search))
    );
  }
  return rows.map((r) => {
    const rating = teacherRating(r.StudentID);
    const taught = sessionCounts(r.StudentID).sessionsTaught;
    const avail = r.Availability || 'Flexible';
    let availabilityType = 'Flexible';
    if (/weekend/i.test(avail)) availabilityType = 'Weekends';
    else if (/evening/i.test(avail)) availabilityType = 'Evenings';
    else if (/weekday/i.test(avail)) availabilityType = 'Weekdays';
    return {
      id: `exp-${r.StudentID}-${r.SkillID}`,
      skillId: r.SkillID,
      teacherId: r.StudentID,
      name: r.SkillName,
      category: r.Category || 'General',
      level: r.ProficiencyLevel,
      mentorName: r.Name,
      mentorDept: [r.Department, r.YearOfStudy].filter(Boolean).join(' · '),
      mentorAvatar: initials(r.Name),
      avatarBg: 'avatar-indigo',
      mentorRating: rating.avgRating != null ? String(rating.avgRating) : '5.0',
      sessionsDelivered: taught,
      description: r.Description || r.SkillName,
      availability: avail,
      availabilityType,
      topics: (r.Description || '').split(/[.•,]/).map((t) => t.trim()).filter((t) => t.length > 8).slice(0, 4),
    };
  });
});

// ---------- offered / wanted ----------
route('GET', '/api/students/:id/offered', (req, body, p) => {
  getStudent(p.id);
  return offeredRows(p.id).map((r) => mapOffered(r, Number(p.id)));
});
route('POST', '/api/students/:id/offered', (req, body, p) => {
  getStudent(p.id);
  const skill = resolveSkill(body);
  const level = normalizeLevel(body.level, 'Intermediate');
  db.prepare(
    `INSERT INTO SKILL_OFFERED (StudentID, SkillID, ProficiencyLevel, Description, Availability)
     VALUES (?,?,?,?,?)
     ON CONFLICT(StudentID, SkillID) DO UPDATE SET
       ProficiencyLevel = excluded.ProficiencyLevel,
       Description = COALESCE(excluded.Description, SKILL_OFFERED.Description),
       Availability = COALESCE(excluded.Availability, SKILL_OFFERED.Availability)`
  ).run(p.id, skill.SkillID, level, body.description ?? body.Description ?? null, body.availability ?? null);
  return [201, mapOffered(
    offeredRows(p.id).find((r) => r.SkillID === skill.SkillID),
    Number(p.id)
  )];
});
route('PATCH', '/api/students/:id/offered/:skillId', (req, body, p) => {
  getStudent(p.id);
  const cur = db.prepare('SELECT * FROM SKILL_OFFERED WHERE StudentID=? AND SkillID=?').get(p.id, p.skillId);
  if (!cur) throw notFound('Entry not found');
  let skillId = Number(p.skillId);
  if (body.skillName) {
    const skill = findOrCreateSkill(body.skillName, body.category);
    if (skill.SkillID !== skillId) {
      db.prepare('DELETE FROM SKILL_OFFERED WHERE StudentID=? AND SkillID=?').run(p.id, skillId);
      skillId = skill.SkillID;
      db.prepare(
        `INSERT INTO SKILL_OFFERED (StudentID, SkillID, ProficiencyLevel, Description, Availability)
         VALUES (?,?,?,?,?)`
      ).run(
        p.id, skillId,
        normalizeLevel(body.level, cur.ProficiencyLevel),
        body.description ?? cur.Description,
        body.availability ?? cur.Availability
      );
      return mapOffered(offeredRows(p.id).find((r) => r.SkillID === skillId), Number(p.id));
    }
  }
  db.prepare(
    `UPDATE SKILL_OFFERED SET ProficiencyLevel=?, Description=?, Availability=?
     WHERE StudentID=? AND SkillID=?`
  ).run(
    normalizeLevel(body.level, cur.ProficiencyLevel),
    body.description ?? cur.Description,
    body.availability ?? cur.Availability,
    p.id, skillId
  );
  return mapOffered(offeredRows(p.id).find((r) => r.SkillID === skillId), Number(p.id));
});
route('DELETE', '/api/students/:id/offered/:skillId', (req, body, p) => {
  const r = db.prepare('DELETE FROM SKILL_OFFERED WHERE StudentID = ? AND SkillID = ?').run(p.id, p.skillId);
  if (!r.changes) throw notFound('Entry not found');
  return [204];
});

route('GET', '/api/students/:id/wanted', (req, body, p) => {
  getStudent(p.id);
  return wantedRows(p.id).map(mapWanted);
});
route('POST', '/api/students/:id/wanted', (req, body, p) => {
  getStudent(p.id);
  const skill = resolveSkill(body);
  const level = normalizeLevel(body.level || body.desiredLevel || body.preferredLevel, 'Beginner');
  const priority = ['High', 'Medium', 'Low'].includes(body.priority) ? body.priority : 'Medium';
  db.prepare(
    `INSERT INTO SKILL_WANTED (StudentID, SkillID, DesiredLevel, Description, Priority)
     VALUES (?,?,?,?,?)
     ON CONFLICT(StudentID, SkillID) DO UPDATE SET
       DesiredLevel = excluded.DesiredLevel,
       Description = COALESCE(excluded.Description, SKILL_WANTED.Description),
       Priority = excluded.Priority`
  ).run(p.id, skill.SkillID, level, body.description ?? body.targetGoal ?? null, priority);
  return [201, wantedRows(p.id).map(mapWanted).find((r) => r.SkillID === skill.SkillID)];
});
route('PATCH', '/api/students/:id/wanted/:skillId', (req, body, p) => {
  getStudent(p.id);
  const cur = db.prepare('SELECT * FROM SKILL_WANTED WHERE StudentID=? AND SkillID=?').get(p.id, p.skillId);
  if (!cur) throw notFound('Entry not found');
  db.prepare(
    `UPDATE SKILL_WANTED SET DesiredLevel=?, Description=?, Priority=? WHERE StudentID=? AND SkillID=?`
  ).run(
    normalizeLevel(body.level || body.desiredLevel || body.preferredLevel, cur.DesiredLevel),
    body.description ?? body.targetGoal ?? cur.Description,
    ['High', 'Medium', 'Low'].includes(body.priority) ? body.priority : cur.Priority,
    p.id, p.skillId
  );
  return wantedRows(p.id).map(mapWanted).find((r) => r.SkillID === Number(p.skillId));
});
route('DELETE', '/api/students/:id/wanted/:skillId', (req, body, p) => {
  const r = db.prepare('DELETE FROM SKILL_WANTED WHERE StudentID = ? AND SkillID = ?').run(p.id, p.skillId);
  if (!r.changes) throw notFound('Entry not found');
  return [204];
});

route('GET', '/api/students/:id/requests', (req, body, p) => {
  getStudent(p.id);
  return wantedRows(p.id).map(mapWanted);
});

// ---------- matching ----------
route('GET', '/api/students/:id/matches', (req, body, p) => {
  getStudent(p.id);
  const rows = db.prepare(
    `SELECT t.StudentID AS TeacherID, t.Name AS TeacherName, t.Department, t.YearOfStudy, t.HostelBlock, t.Bio,
            sk.SkillID, sk.SkillName, sk.Category, so.ProficiencyLevel, so.Description, so.Availability,
            EXISTS (
              SELECT 1 FROM SKILL_WANTED tw
              JOIN SKILL_OFFERED me ON me.SkillID = tw.SkillID AND me.StudentID = :me
              WHERE tw.StudentID = t.StudentID
            ) AS MutualExchange
     FROM SKILL_WANTED mw
     JOIN SKILL_OFFERED so ON so.SkillID = mw.SkillID
     JOIN STUDENT t ON t.StudentID = so.StudentID
     JOIN SKILL sk ON sk.SkillID = mw.SkillID
     WHERE mw.StudentID = :me AND t.StudentID <> :me
     ORDER BY MutualExchange DESC, (t.HostelBlock = (SELECT HostelBlock FROM STUDENT WHERE StudentID = :me)) DESC`
  ).all({ me: Number(p.id) });

  return rows.map((r) => {
    const rating = teacherRating(r.TeacherID);
    const taught = sessionCounts(r.TeacherID).sessionsTaught;
    const wants = db.prepare(
      `SELECT sk.SkillName FROM SKILL_WANTED sw JOIN SKILL sk ON sk.SkillID = sw.SkillID WHERE sw.StudentID = ?`
    ).all(r.TeacherID).map((x) => x.SkillName);
    return {
      id: `peer-${r.TeacherID}-${r.SkillID}`,
      studentId: displayStudentId(r.TeacherID),
      teacherId: r.TeacherID,
      skillId: r.SkillID,
      name: r.TeacherName,
      dept: [r.Department, r.YearOfStudy].filter(Boolean).join(' · '),
      avatar: initials(r.TeacherName),
      avatarBg: 'avatar-purple',
      rating: rating.avgRating != null ? String(rating.avgRating) : '5.0',
      sessionsDelivered: taught,
      skillOffered: r.SkillName,
      category: r.Category,
      proficiencyLevel: r.ProficiencyLevel,
      availability: r.Availability || 'Flexible',
      bio: r.Bio || '',
      wantsToLearn: wants[0] || '',
      matchReason: r.MutualExchange
        ? `Teaches ${r.SkillName} and also wants a skill you offer (mutual swap)`
        : `Teaches ${r.SkillName}, which is on your learning wishlist`,
      compatibilityScore: r.MutualExchange ? 94 : 82,
      mutualSwapAvailable: Boolean(r.MutualExchange),
      overlapFactors: [
        'Direct Skill Wishlist Match',
        r.MutualExchange ? 'Mutual Reciprocal Skill Swap' : 'Teacher available for this skill',
      ],
      skillsOffered: [{ name: r.SkillName, category: r.Category }],
      teaching: [r.SkillName],
      skills: [r.SkillName, r.Category].filter(Boolean),
    };
  });
});

// ---------- exchanges ----------
const EXCHANGE_SELECT =
  `SELECT e.ExchangeID, e.Status, e.RequestDate, e.SkillID, sk.SkillName,
          e.TeacherID, t.Name AS TeacherName, e.LearnerID, l.Name AS LearnerName
   FROM EXCHANGE e
   JOIN SKILL sk ON sk.SkillID = e.SkillID
   JOIN STUDENT t ON t.StudentID = e.TeacherID
   JOIN STUDENT l ON l.StudentID = e.LearnerID`;

route('POST', '/api/exchanges', (req, body) => {
  required(body, 'teacherId', 'learnerId', 'skillId');
  if (Number(body.teacherId) === Number(body.learnerId)) throw bad('Teacher and learner must be different students');
  getStudent(body.teacherId); getStudent(body.learnerId);
  const offers = db.prepare('SELECT 1 FROM SKILL_OFFERED WHERE StudentID = ? AND SkillID = ?')
    .get(body.teacherId, body.skillId);
  if (!offers) throw bad('That student does not offer this skill');
  const dup = db.prepare(
    `SELECT 1 FROM EXCHANGE WHERE TeacherID=? AND LearnerID=? AND SkillID=? AND Status IN ('Pending','Accepted')`
  ).get(body.teacherId, body.learnerId, body.skillId);
  if (dup) throw new HttpError(409, 'An open exchange already exists for this pair and skill');
  db.prepare(
    `INSERT INTO SKILL_WANTED (StudentID, SkillID, DesiredLevel, Description, Priority)
     VALUES (?,?,?,?,?)
     ON CONFLICT(StudentID, SkillID) DO NOTHING`
  ).run(body.learnerId, body.skillId, 'Beginner', body.note ?? null, 'High');
  const r = db.prepare('INSERT INTO EXCHANGE (TeacherID, LearnerID, SkillID) VALUES (?,?,?)')
    .run(body.teacherId, body.learnerId, body.skillId);
  return [201, db.prepare(`${EXCHANGE_SELECT} WHERE e.ExchangeID = ?`).get(r.lastInsertRowid)];
});

route('GET', '/api/exchanges', (req, body, p, q) => {
  const sid = q.get('studentId'), status = q.get('status');
  let sql = EXCHANGE_SELECT + ' WHERE 1=1';
  const args = [];
  if (sid) { sql += ' AND (e.TeacherID = ? OR e.LearnerID = ?)'; args.push(sid, sid); }
  if (status) { sql += ' AND e.Status = ?'; args.push(status); }
  return db.prepare(sql + ' ORDER BY e.ExchangeID DESC').all(...args);
});

route('GET', '/api/exchanges/:id', (req, body, p) => {
  getExchange(p.id);
  return db.prepare(`${EXCHANGE_SELECT} WHERE e.ExchangeID = ?`).get(p.id);
});

const TRANSITIONS = {
  Pending: ['Accepted', 'Rejected', 'Cancelled'],
  Accepted: ['Completed', 'Cancelled'],
  Completed: [], Rejected: [], Cancelled: [],
};
route('PATCH', '/api/exchanges/:id/status', (req, body, p) => {
  required(body, 'status');
  const ex = getExchange(p.id);
  if (!TRANSITIONS[ex.Status].includes(body.status)) {
    throw bad(`Cannot change status from ${ex.Status} to ${body.status}`);
  }
  db.prepare('UPDATE EXCHANGE SET Status = ? WHERE ExchangeID = ?').run(body.status, p.id);
  return db.prepare(`${EXCHANGE_SELECT} WHERE e.ExchangeID = ?`).get(p.id);
});

// ---------- sessions ----------
route('GET', '/api/exchanges/:id/sessions', (req, body, p) => {
  getExchange(p.id);
  return db.prepare('SELECT * FROM SESSION WHERE ExchangeID = ? ORDER BY SessionDate').all(p.id);
});

route('POST', '/api/exchanges/:id/sessions', (req, body, p) => {
  required(body, 'sessionDate');
  const ex = getExchange(p.id);
  if (!['Accepted', 'Completed'].includes(ex.Status)) throw bad('Sessions can only be scheduled for accepted exchanges');
  const r = db.prepare(
    `INSERT INTO SESSION (ExchangeID, SessionDate, StartTime, DurationMins, Topic, Mode, Location, Status)
     VALUES (?,?,?,?,?,?,?,?)`
  ).run(
    p.id,
    body.sessionDate,
    body.startTime ?? null,
    body.durationMins ?? 60,
    body.topic ?? body.skill ?? null,
    body.mode === 'Online' || /meet|zoom|online/i.test(String(body.mode || '')) ? 'Online' : (body.mode ?? 'Offline'),
    body.location ?? body.link ?? null,
    'Scheduled'
  );
  return [201, db.prepare('SELECT * FROM SESSION WHERE SessionID = ?').get(r.lastInsertRowid)];
});

route('GET', '/api/students/:id/sessions', (req, body, p) => {
  getStudent(p.id);
  return db.prepare(`${SESSION_SELECT} WHERE e.TeacherID = ? OR e.LearnerID = ? ORDER BY s.SessionDate DESC`)
    .all(p.id, p.id)
    .map((row) => mapSession(row, p.id));
});

route('PATCH', '/api/sessions/:id', (req, body, p) => {
  const sess = db.prepare('SELECT * FROM SESSION WHERE SessionID = ?').get(p.id);
  if (!sess) throw notFound('Session not found');
  let status = body.status;
  if (status === 'Upcoming') status = 'Scheduled';
  if (status && !['Scheduled', 'Completed', 'Cancelled'].includes(status)) {
    throw bad('Invalid session status');
  }
  db.prepare(
    `UPDATE SESSION SET Status = COALESCE(?, Status), Topic = COALESCE(?, Topic),
       Location = COALESCE(?, Location), SessionDate = COALESCE(?, SessionDate)
     WHERE SessionID = ?`
  ).run(status ?? null, body.topic ?? null, body.location ?? body.link ?? null, body.sessionDate ?? null, p.id);
  if (status === 'Completed') {
    const ex = getExchange(sess.ExchangeID);
    if (ex.Status === 'Accepted') {
      db.prepare("UPDATE EXCHANGE SET Status = 'Completed' WHERE ExchangeID = ?").run(sess.ExchangeID);
    }
  }
  const row = db.prepare(`${SESSION_SELECT} WHERE s.SessionID = ?`).get(p.id);
  return mapSession(row, body.studentId || row.TeacherID);
});

route('POST', '/api/sessions', (req, body) => {
  required(body, 'teacherId', 'learnerId', 'skillId', 'sessionDate');
  if (Number(body.teacherId) === Number(body.learnerId)) throw bad('Teacher and learner must be different students');
  const offers = db.prepare('SELECT 1 FROM SKILL_OFFERED WHERE StudentID = ? AND SkillID = ?')
    .get(body.teacherId, body.skillId);
  if (!offers) throw bad('That student does not offer this skill');
  let ex = db.prepare(
    `SELECT * FROM EXCHANGE WHERE TeacherID=? AND LearnerID=? AND SkillID=? AND Status IN ('Pending','Accepted','Completed')
     ORDER BY ExchangeID DESC LIMIT 1`
  ).get(body.teacherId, body.learnerId, body.skillId);
  if (!ex) {
    const r = db.prepare('INSERT INTO EXCHANGE (TeacherID, LearnerID, SkillID, Status) VALUES (?,?,?,?)')
      .run(body.teacherId, body.learnerId, body.skillId, 'Accepted');
    ex = getExchange(r.lastInsertRowid);
  } else if (ex.Status === 'Pending') {
    db.prepare("UPDATE EXCHANGE SET Status = 'Accepted' WHERE ExchangeID = ?").run(ex.ExchangeID);
    ex = getExchange(ex.ExchangeID);
  }
  const r = db.prepare(
    `INSERT INTO SESSION (ExchangeID, SessionDate, StartTime, DurationMins, Topic, Mode, Location, Status)
     VALUES (?,?,?,?,?,?,?,?)`
  ).run(
    ex.ExchangeID,
    body.sessionDate,
    body.startTime ?? null,
    body.durationMins ?? 60,
    body.topic ?? body.skill ?? null,
    body.mode === 'Online' || /meet|zoom|online/i.test(String(body.mode || '')) ? 'Online' : 'Offline',
    body.location ?? body.link ?? null,
    'Scheduled'
  );
  const row = db.prepare(`${SESSION_SELECT} WHERE s.SessionID = ?`).get(r.lastInsertRowid);
  return [201, mapSession(row, body.learnerId)];
});

// ---------- feedback ----------
route('GET', '/api/exchanges/:id/feedback', (req, body, p) => {
  getExchange(p.id);
  return db.prepare(
    `SELECT f.*, s.Name AS GivenByName FROM FEEDBACK f
     JOIN STUDENT s ON s.StudentID = f.GivenBy WHERE f.ExchangeID = ?`).all(p.id);
});

route('POST', '/api/exchanges/:id/feedback', (req, body, p) => {
  required(body, 'givenBy', 'rating');
  const ex = getExchange(p.id);
  if (ex.Status !== 'Completed') throw bad('Feedback can only be given for completed exchanges');
  if (![ex.TeacherID, ex.LearnerID].includes(Number(body.givenBy))) {
    throw new HttpError(403, 'Only the teacher or learner of this exchange can leave feedback');
  }
  const r = db.prepare('INSERT INTO FEEDBACK (ExchangeID, GivenBy, Rating, Comments) VALUES (?,?,?,?)')
    .run(p.id, body.givenBy, body.rating, body.comments ?? body.comment ?? null);
  return [201, db.prepare('SELECT * FROM FEEDBACK WHERE FeedbackID = ?').get(r.lastInsertRowid)];
});

route('GET', '/api/students/:id/feedback', (req, body, p) => {
  getStudent(p.id);
  return listFeedbackForStudent(p.id).map((row) => mapReview(row, p.id));
});

// ---------- availability ----------
route('GET', '/api/students/:id/availability', (req, body, p) => {
  getStudent(p.id);
  return getAvailability(p.id);
});

route('PUT', '/api/students/:id/availability', (req, body, p) => {
  getStudent(p.id);
  const days = body.days || body.weeklyAvailability || body;
  if (!Array.isArray(days)) throw bad('days array is required');
  db.exec('BEGIN');
  try {
    db.prepare('DELETE FROM AVAILABILITY WHERE StudentID = ?').run(p.id);
    const ins = db.prepare(
      'INSERT INTO AVAILABILITY (StudentID, DayOfWeek, StartTime, EndTime, Label, Enabled) VALUES (?,?,?,?,?,?)'
    );
    for (const day of days) {
      const dayName = day.day || day.DayOfWeek;
      const enabled = day.enabled === false ? 0 : 1;
      for (const slot of (day.slots || [])) {
        ins.run(p.id, dayName, slot.start, slot.end, slot.period || slot.label || null, enabled);
      }
    }
    db.exec('COMMIT');
  } catch (err) {
    db.exec('ROLLBACK');
    throw err;
  }
  return getAvailability(p.id);
});

// ---------- messages ----------
route('GET', '/api/students/:id/conversations', (req, body, p) => {
  getStudent(p.id);
  return conversationsFor(p.id);
});

route('GET', '/api/students/:id/messages/:peerId', (req, body, p) => {
  getStudent(p.id); getStudent(p.peerId);
  const conv = conversationsFor(p.id).find((c) => Number(c.peerId) === Number(p.peerId));
  return conv || {
    id: `conv-${p.peerId}`,
    peerId: Number(p.peerId),
    peerName: getStudent(p.peerId).Name,
    messages: [],
    unreadCount: 0,
  };
});

route('POST', '/api/messages', (req, body) => {
  required(body, 'senderId', 'receiverId', 'body');
  if (Number(body.senderId) === Number(body.receiverId)) throw bad('Cannot message yourself');
  getStudent(body.senderId); getStudent(body.receiverId);
  const r = db.prepare('INSERT INTO MESSAGE (SenderID, ReceiverID, Body) VALUES (?,?,?)')
    .run(body.senderId, body.receiverId, String(body.body).trim());
  return [201, db.prepare('SELECT * FROM MESSAGE WHERE MessageID = ?').get(r.lastInsertRowid)];
});

route('PATCH', '/api/students/:id/messages/:peerId/read', (req, body, p) => {
  db.prepare('UPDATE MESSAGE SET IsRead = 1 WHERE ReceiverID = ? AND SenderID = ?').run(p.id, p.peerId);
  return { ok: true };
});

// ---------- dashboard ----------
route('GET', '/api/students/:id/dashboard', (req, body, p) => {
  const student = hydrateStudent(p.id);
  const sessions = db.prepare(`${SESSION_SELECT} WHERE e.TeacherID = ? OR e.LearnerID = ? ORDER BY s.SessionDate DESC`)
    .all(p.id, p.id).map((row) => mapSession(row, p.id));
  const matches = db.prepare(
    `SELECT COUNT(*) AS n FROM SKILL_WANTED mw
     JOIN SKILL_OFFERED so ON so.SkillID = mw.SkillID
     WHERE mw.StudentID = ? AND so.StudentID <> ?`
  ).get(p.id, p.id).n;
  const convos = conversationsFor(p.id);
  const incoming = db.prepare(
    `${EXCHANGE_SELECT} WHERE e.TeacherID = ? AND e.Status = 'Pending' ORDER BY e.ExchangeID DESC`
  ).all(p.id);
  return {
    student,
    stats: {
      skillsOffered: student.skillsOffered.length,
      skillsWanted: student.skillsWanted.length,
      upcomingSessions: sessions.filter((s) => s.status === 'Upcoming').length,
      matches,
      sessionsTaught: student.sessionsTaught,
      sessionsAttended: student.sessionsAttended,
      rating: student.rating,
    },
    upcomingSessions: sessions,
    recentMessages: convos.slice(0, 5).map((c) => ({
      id: c.id,
      sender: c.peerName,
      avatar: c.peerAvatar,
      snippet: c.messages.length ? c.messages[c.messages.length - 1].text : '',
      time: c.lastActive,
      unread: c.unreadCount > 0,
    })),
    recentReviews: listFeedbackForStudent(p.id).slice(0, 6).map((row) => mapReview(row, p.id)),
    incomingRequests: incoming,
    conversations: convos,
    availability: getAvailability(p.id),
  };
});

// ---------- reports ----------
route('GET', '/api/reports/top-teachers', () =>
  db.prepare(
    `SELECT t.StudentID, t.Name, COUNT(f.FeedbackID) AS Reviews, ROUND(AVG(f.Rating), 2) AS AvgRating
     FROM EXCHANGE e
     JOIN STUDENT t ON t.StudentID = e.TeacherID
     JOIN FEEDBACK f ON f.ExchangeID = e.ExchangeID AND f.GivenBy = e.LearnerID
     GROUP BY t.StudentID HAVING Reviews >= 1 ORDER BY AvgRating DESC, Reviews DESC`).all());

route('GET', '/api/reports/popular-skills', () =>
  db.prepare(
    `SELECT sk.SkillID, sk.SkillName, sk.Category,
            (SELECT COUNT(*) FROM SKILL_OFFERED WHERE SkillID = sk.SkillID) AS Teachers,
            (SELECT COUNT(*) FROM SKILL_WANTED  WHERE SkillID = sk.SkillID) AS Learners,
            (SELECT COUNT(*) FROM EXCHANGE      WHERE SkillID = sk.SkillID) AS Exchanges
     FROM SKILL sk ORDER BY Learners DESC, Exchanges DESC`).all());

route('GET', '/api/reports/exchange-summary', () =>
  db.prepare('SELECT Status, COUNT(*) AS Total FROM EXCHANGE GROUP BY Status').all());

route('GET', '/api/health', () => ({ ok: true }));

const server = http.createServer(async (req, res) => {
  if (req.method === 'OPTIONS') return send(res, 204);
  const url = new URL(req.url, 'http://localhost');
  try {
    for (const r of routes) {
      if (r.method !== req.method) continue;
      const m = r.regex.exec(url.pathname);
      if (!m) continue;
      const params = {};
      r.keys.forEach((k, i) => (params[k] = decodeURIComponent(m[i + 1])));
      const body = ['POST', 'PATCH', 'PUT'].includes(req.method) ? await readBody(req) : {};
      const out = await r.handler(req, body, params, url.searchParams);
      if (Array.isArray(out) && typeof out[0] === 'number') return send(res, out[0], out[1]);
      return send(res, 200, out);
    }
    throw notFound(`No route for ${req.method} ${url.pathname}`);
  } catch (err) {
    if (err instanceof HttpError) return send(res, err.status, { error: err.message });
    const msg = String(err.message || err);
    if (/UNIQUE constraint/.test(msg)) return send(res, 409, { error: 'Already exists: ' + msg.split(': ').pop() });
    if (/FOREIGN KEY constraint/.test(msg)) return send(res, 400, { error: 'Referenced student, skill or exchange does not exist' });
    if (/CHECK constraint|NOT NULL constraint/.test(msg)) return send(res, 400, { error: 'Invalid value: ' + msg });
    console.error(err);
    send(res, 500, { error: 'Internal server error' });
  }
});

server.listen(PORT, () => console.log(`Skill Exchange API running on http://localhost:${PORT}`));
