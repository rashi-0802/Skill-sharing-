// Smoke test: run the server (npm start) in one terminal, then `npm test` in another.
const BASE = process.env.BASE || 'http://localhost:3000';
let passed = 0, failed = 0;

async function call(method, path, body) {
  const res = await fetch(BASE + path, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  return { status: res.status, data: text ? JSON.parse(text) : null };
}
function check(name, cond, extra = '') {
  if (cond) { passed++; console.log('  PASS', name); }
  else { failed++; console.log('  FAIL', name, extra); }
}

(async () => {
  let r;
  console.log('Auth & students');
  r = await call('POST', '/api/register', {
    name: 'Test User', email: 't@campus.edu', password: 'secret12',
    department: 'CSE', year: '1st Year', hostelBlock: 'A', roomNo: '9',
  });
  check('register -> 201', r.status === 201 && r.data.StudentID && !r.data.Password, JSON.stringify(r));
  const newId = r.data.StudentID;
  r = await call('POST', '/api/register', { name: 'Dup', email: 't@campus.edu', password: 'secret12' });
  check('duplicate email -> 409', r.status === 409, JSON.stringify(r));
  r = await call('POST', '/api/login', { email: 't@campus.edu', password: 'secret12' });
  check('login ok', r.status === 200 && r.data.Name === 'Test User');
  r = await call('POST', '/api/login', { email: 't@campus.edu', password: 'wrong' });
  check('wrong password -> 401', r.status === 401);
  r = await call('GET', '/api/students');
  check('list students', r.status === 200 && r.data.length >= 12 && !('Password' in r.data[0]));
  r = await call('GET', '/api/students/1');
  check('Vidhi profile has offered+wanted', r.data.skillsOffered.length >= 3 && r.data.skillsWanted.length >= 3, JSON.stringify(r.data));

  console.log('Skills');
  r = await call('GET', '/api/skills');
  check('list skills', r.data.length >= 10);
  r = await call('POST', '/api/skills', { skillName: 'Guitar', category: 'Music' });
  check('create skill', r.status === 201);
  const guitar = r.data.SkillID;
  r = await call('POST', '/api/skills', { skillName: 'Guitar' });
  check('duplicate skill -> 409', r.status === 409);

  console.log('Offered / wanted');
  r = await call('POST', `/api/students/${newId}/offered`, { skillId: guitar, level: 'Advanced' });
  check('offer a skill', r.status === 201);
  r = await call('POST', `/api/students/${newId}/offered`, { skillId: guitar, level: 'Expert' });
  check('re-offer updates level', r.status === 201);
  r = await call('GET', `/api/students/${newId}/offered`);
  check('offered list shows Expert', r.data.length === 1 && r.data[0].Level === 'Expert');
  r = await call('POST', `/api/students/${newId}/wanted`, { skillId: 2 });
  check('want a skill (Python)', r.status === 201);
  r = await call('POST', `/api/students/${newId}/offered`, { skillId: 999 });
  check('unknown skill -> 400', r.status === 400, JSON.stringify(r));
  r = await call('POST', `/api/students/${newId}/offered`, { skillId: 1, level: 'Godlike' });
  check('bad level -> 400', r.status === 400, JSON.stringify(r));

  console.log('Matching & explore');
  r = await call('GET', `/api/students/${newId}/matches`);
  check('matches find Python teachers', r.status === 200 && r.data.some((m) => m.skillOffered === 'Python' || m.SkillName === 'Python'), JSON.stringify(r));
  r = await call('GET', '/api/students/2/matches');
  check('Aarav matched with a Python teacher', r.data.some((m) => m.name === 'Diya Patel' || m.TeacherName === 'Diya Patel'), JSON.stringify(r.data?.slice?.(0, 3)));
  r = await call('GET', '/api/explore');
  check('explore catalog', r.status === 200 && r.data.length >= 8);

  console.log('Exchanges');
  r = await call('POST', '/api/exchanges', { teacherId: 3, learnerId: newId, skillId: 2 });
  check('create exchange', r.status === 201 && r.data.Status === 'Pending', JSON.stringify(r));
  const ex = r.data.ExchangeID;
  r = await call('POST', '/api/exchanges', { teacherId: 3, learnerId: newId, skillId: 2 });
  check('duplicate open exchange -> 409', r.status === 409);
  r = await call('POST', '/api/exchanges', { teacherId: newId, learnerId: newId, skillId: guitar });
  check('self-exchange -> 400', r.status === 400);
  r = await call('POST', '/api/exchanges', { teacherId: 4, learnerId: newId, skillId: 2 });
  check('teacher must offer skill -> 400', r.status === 400);
  r = await call('POST', `/api/exchanges/${ex}/sessions`, { sessionDate: '2026-11-01' });
  check('no session while Pending -> 400', r.status === 400);
  r = await call('PATCH', `/api/exchanges/${ex}/status`, { status: 'Completed' });
  check('Pending -> Completed blocked', r.status === 400);
  r = await call('PATCH', `/api/exchanges/${ex}/status`, { status: 'Accepted' });
  check('Pending -> Accepted', r.status === 200 && r.data.Status === 'Accepted');
  r = await call('POST', `/api/exchanges/${ex}/feedback`, { givenBy: newId, rating: 5 });
  check('no feedback before Completed -> 400', r.status === 400);

  console.log('Sessions');
  r = await call('POST', `/api/exchanges/${ex}/sessions`, { sessionDate: '2026-11-01', mode: 'Online', location: 'Meet' });
  check('schedule session', r.status === 201);
  r = await call('GET', `/api/exchanges/${ex}/sessions`);
  check('list sessions', r.data.length === 1);
  r = await call('GET', `/api/students/${newId}/sessions`);
  check('student session list', r.status === 200 && r.data.length >= 1);

  console.log('Feedback');
  await call('PATCH', `/api/exchanges/${ex}/status`, { status: 'Completed' });
  r = await call('POST', `/api/exchanges/${ex}/feedback`, { givenBy: 4, rating: 5 });
  check('outsider feedback -> 403', r.status === 403);
  r = await call('POST', `/api/exchanges/${ex}/feedback`, { givenBy: newId, rating: 6 });
  check('rating 6 -> 400', r.status === 400);
  r = await call('POST', `/api/exchanges/${ex}/feedback`, { givenBy: newId, rating: 5, comments: 'Great' });
  check('learner feedback ok', r.status === 201);
  r = await call('POST', `/api/exchanges/${ex}/feedback`, { givenBy: newId, rating: 4 });
  check('second review by same person -> 409', r.status === 409);

  console.log('Profile, availability, messages, dashboard');
  r = await call('PATCH', `/api/students/${newId}`, { bio: 'Hello campus', department: 'IT' });
  check('patch profile', r.status === 200 && r.data.bio === 'Hello campus');
  r = await call('PUT', `/api/students/${newId}/availability`, {
    days: [{ day: 'Monday', enabled: true, slots: [{ start: '16:00', end: '18:00', period: 'Lab' }] }],
  });
  check('save availability', r.status === 200 && r.data[0].slots.length === 1, JSON.stringify(r));
  r = await call('POST', '/api/messages', { senderId: newId, receiverId: 1, body: 'Hi Vidhi from tests' });
  check('send message', r.status === 201);
  r = await call('GET', `/api/students/${newId}/conversations`);
  check('list conversations', r.status === 200 && r.data.length >= 1);
  r = await call('GET', `/api/students/${newId}/dashboard`);
  check('dashboard payload', r.status === 200 && r.data.stats && r.data.student, JSON.stringify(r.status));

  console.log('Listing & reports');
  r = await call('GET', `/api/exchanges?studentId=${newId}`);
  check('exchanges for student', r.data.length === 1);
  r = await call('GET', '/api/reports/top-teachers');
  check('top teachers', r.status === 200 && r.data.length >= 1, JSON.stringify(r));
  r = await call('GET', '/api/reports/popular-skills');
  check('popular skills', r.status === 200 && r.data[0].Learners >= 1);
  r = await call('GET', '/api/reports/exchange-summary');
  check('exchange summary', r.status === 200 && r.data.length >= 1);
  r = await call('GET', '/api/nothing');
  check('unknown route -> 404', r.status === 404);

  console.log(`\n${passed} passed, ${failed} failed`);
  process.exit(failed ? 1 : 0);
})();
