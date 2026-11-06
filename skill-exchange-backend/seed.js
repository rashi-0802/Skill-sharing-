// Creates all tables from schema.sql and loads sample campus data.
// Run with: npm run seed   (this RESETS the database)
const fs = require('fs');
const path = require('path');
const { db, hashPassword } = require('./db');

db.exec(fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8'));

const pass = hashPassword('password123');

const addStudent = db.prepare(
  `INSERT INTO STUDENT (Name, Email, Department, YearOfStudy, Bio, HostelBlock, RoomNo, Password)
   VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
);

const students = [
  ['Vidhi Kedia', 'kediavidhi62@gmail.com', 'Computer Science & Engineering', '3rd Year',
    'CS student passionate about Full-Stack Web Development, Data Structures, and Database Design.', 'A', '101'],
  ['Aarav Sharma', 'aarav@campus.edu', 'Computer Science', '2nd Year',
    'Learning React and teaching C fundamentals to first-year peers.', 'A', '101'],
  ['Diya Patel', 'diya@campus.edu', 'Data Science & AI', '3rd Year',
    'Python mentor who wants to learn video editing for project demos.', 'A', '204'],
  ['Rohan Mehta', 'rohan@campus.edu', 'Applied Arts', '3rd Year',
    'Video and graphic design mentor exploring frontend development.', 'B', '112'],
  ['Sneha Iyer', 'sneha@campus.edu', 'Information Technology', '2nd Year',
    'Python scripting mentor who wants stronger SQL skills.', 'B', '305'],
  ['Kabir Singh', 'kabir@campus.edu', 'Architecture', '2nd Year',
    'Photography enthusiast learning public speaking for reviews.', 'C', '210'],
  ['Rashi Chandani', 'rashi@campus.edu', 'Data Science & AI', '3rd Year',
    'Machine learning mentor looking to improve React component skills.', 'A', '310'],
  ['Riya Sharma', 'riya@campus.edu', 'Computer Science', '4th Year',
    'Docker and cloud mentor who wants help with SQL optimization.', 'B', '118'],
  ['Devansh Parekh', 'devansh@campus.edu', 'Computer Science', '4th Year',
    'Systems programming in C. Wants to learn Figma prototyping.', 'C', '102'],
  ['Kavita Joshi', 'kavita@campus.edu', 'Business Administration', '3rd Year',
    'Debate finalist coaching technical public speaking.', 'A', '220'],
  ['Tanya Kapoor', 'tanya@campus.edu', 'Design & Media', '3rd Year',
    'Figma design systems mentor who wants to learn Tailwind.', 'B', '401'],
  ['Ananya Iyer', 'ananya@campus.edu', 'Data Science & AI', '3rd Year',
    'Pandas and SQL mentor exploring React dashboards.', 'C', '215'],
];
students.forEach((s) => addStudent.run(...s, pass));

const addSkill = db.prepare('INSERT INTO SKILL (SkillName, Category) VALUES (?, ?)');
[
  ['Photoshop', 'Graphic Design'],
  ['Python', 'Python'],
  ['Video Editing', 'Media'],
  ['Mathematics', 'Academics'],
  ['Public Speaking', 'Communication'],
  ['React.js & Frontend Architecture', 'Web Development'],
  ['Database Systems & SQL Optimization', 'Data Science'],
  ['Machine Learning with Scikit-Learn', 'Data Science'],
  ['Docker & Cloud Deployment Basics', 'Web Development'],
  ['Systems Programming in C', 'C'],
  ['UI Prototyping & Figma Basics', 'UI/UX Design'],
  ['Vector Graphic Design in Adobe Illustrator', 'Graphic Design'],
  ['DSLR Photography & Composition', 'Photography'],
  ['Data Science with Pandas, SQL & NumPy', 'Data Science'],
].forEach((s) => addSkill.run(...s));

const offered = db.prepare(
  'INSERT INTO SKILL_OFFERED (StudentID, SkillID, ProficiencyLevel, Description, Availability) VALUES (?, ?, ?, ?, ?)'
);
[
  [1, 6, 'Advanced', 'Component lifecycles, custom hooks, state management, and responsive UI with Tailwind CSS.', 'Weekdays after 4 PM'],
  [1, 7, 'Advanced', 'Relational schema design, normalization, joins, indexing, and transaction ACID properties.', 'Weekends & Evenings'],
  [1, 2, 'Intermediate', 'Python syntax, data structures, OOP, and scripting for college labs.', 'Weekdays 5 PM – 7 PM'],
  [1, 11, 'Intermediate', 'Wireframing, auto-layout, design tokens, and developer handoff in Figma.', 'Flexible (Anytime)'],
  [2, 10, 'Advanced', 'Pointers, malloc/free, structs, and debugging segmentation faults.', 'Weekdays after 4 PM'],
  [3, 2, 'Expert', 'Python for data work, notebooks, and automation scripts.', 'Weekdays'],
  [4, 3, 'Advanced', 'Cutting, colour, captions, and export presets for campus videos.', 'Flexible (Anytime)'],
  [4, 12, 'Intermediate', 'Pen tool, typography pairing, and logo creation.', 'Flexible (Anytime)'],
  [5, 2, 'Advanced', 'Python syntax, file parsing, and automating college tasks.', 'Evenings (6 PM – 8 PM)'],
  [6, 13, 'Intermediate', 'Aperture, shutter, ISO, and natural-light portraits.', 'Weekends (Mornings)'],
  [7, 8, 'Advanced', 'Regression, classification, and model evaluation with scikit-learn.', 'Weekday Evenings & Weekends'],
  [7, 11, 'Advanced', 'UI/UX wireframing and graphic layout for ML project demos.', 'Weekday Evenings & Weekends'],
  [8, 9, 'Advanced', 'Dockerfiles, docker-compose, and containerizing React + Express apps.', 'Weekdays after 4 PM'],
  [8, 2, 'Advanced', 'Python and data workflows for backend services.', 'Weekdays after 4 PM'],
  [9, 10, 'Advanced', 'Pointers, memory layouts, and Unix system calls.', 'Weekdays after 5 PM'],
  [10, 5, 'Advanced', 'Hook-problem-solution talks, pitches, and interview answers.', 'Evenings (6 PM – 8 PM)'],
  [11, 11, 'Advanced', 'Auto-layout, variants, design tokens, and interactive prototypes.', 'Flexible (Anytime)'],
  [12, 14, 'Intermediate', 'Cleaning CSVs, SQL group-by, and simple dashboards.', 'Weekdays'],
  [2, 6, 'Beginner', 'Helping peers start with React components and props.', 'Weekdays after 4 PM'],
].forEach((r) => offered.run(...r));

const wanted = db.prepare(
  'INSERT INTO SKILL_WANTED (StudentID, SkillID, DesiredLevel, Description, Priority) VALUES (?, ?, ?, ?, ?)'
);
[
  [1, 8, 'Advanced', 'Want to build predictive models for a DBMS & AI mini-project.', 'High'],
  [1, 9, 'Intermediate', 'Learn containerizing React + Node applications.', 'Medium'],
  [1, 5, 'Advanced', 'Overcome stage anxiety for hackathon presentations.', 'High'],
  [1, 10, 'Intermediate', 'Pointers, structs, and Unix process system calls.', 'Medium'],
  [2, 6, 'Intermediate', 'Need help lifting state and using React Context.', 'High'],
  [2, 2, 'Beginner', 'Want Python practice alongside C labs.', 'Medium'],
  [3, 3, 'Beginner', 'Want to edit project demo videos.', 'Medium'],
  [4, 4, 'Intermediate', 'Need maths help for design-related calculations.', 'Low'],
  [4, 6, 'Beginner', 'Want to implement Figma designs in React.', 'High'],
  [5, 7, 'Advanced', 'Want stronger SQL joins and indexing.', 'High'],
  [6, 5, 'Beginner', 'Need confidence for architecture reviews.', 'Medium'],
  [7, 6, 'Intermediate', 'Want React hooks and component architecture.', 'High'],
  [8, 7, 'Advanced', 'Want to optimize PostgreSQL-style JOIN queries.', 'High'],
  [9, 11, 'Beginner', 'Want Figma basics for tool UIs.', 'Medium'],
  [10, 2, 'Beginner', 'Want Python OOP for automation scripts.', 'Medium'],
  [11, 6, 'Intermediate', 'Want to implement design systems in the browser.', 'High'],
  [12, 6, 'Intermediate', 'Want React for data dashboards.', 'Medium'],
].forEach((r) => wanted.run(...r));

const addEx = db.prepare(
  'INSERT INTO EXCHANGE (TeacherID, LearnerID, SkillID, Status, RequestDate) VALUES (?, ?, ?, ?, ?)'
);
addEx.run(7, 1, 8, 'Accepted', '2026-09-28');   // 1 Rashi teaches Vidhi ML
addEx.run(1, 2, 6, 'Accepted', '2026-09-30');   // 2 Vidhi teaches Aarav React
addEx.run(1, 5, 7, 'Completed', '2026-09-20');  // 3 Vidhi taught Sneha SQL
addEx.run(3, 1, 2, 'Completed', '2026-09-18');  // 4 Diya taught Vidhi Python (for ratings)
addEx.run(8, 1, 9, 'Pending', '2026-10-08');    // 5 Vidhi requested Docker from Riya
addEx.run(3, 2, 2, 'Completed', '2026-09-12');  // 6 Diya taught Aarav Python (reports)

const addSes = db.prepare(
  `INSERT INTO SESSION (ExchangeID, SessionDate, StartTime, DurationMins, Topic, Mode, Location, Status)
   VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
);
addSes.run(1, '2026-10-09', '17:30', 75, 'Linear & Logistic Regression with Pandas Preprocessing', 'Offline', 'Campus Library Hub · Study Room 3B', 'Scheduled');
addSes.run(2, '2026-10-06', '16:00', 60, 'React State Lifting, Custom Hooks & Context API', 'Online', 'https://meet.google.com/4s-vidhi-aarav', 'Scheduled');
addSes.run(3, '2026-10-02', '17:00', 75, 'B-Tree Indexing & Query Plan Explain Analysis', 'Offline', 'Discussion Pod A', 'Completed');
addSes.run(4, '2026-09-28', '16:00', 60, 'Python classes, inheritance & dunder methods', 'Online', 'https://meet.google.com/4s-python-session', 'Completed');
addSes.run(6, '2026-09-20', '15:00', 60, 'Python basics for first-year labs', 'Offline', 'Hostel A common room', 'Completed');

const addFb = db.prepare(
  'INSERT INTO FEEDBACK (ExchangeID, GivenBy, Rating, Comments, CreatedAt) VALUES (?, ?, ?, ?, ?)'
);
addFb.run(3, 5, 5, 'Vidhi is an outstanding mentor! She explained B-Tree indexing with simple drawings.', '2026-10-02 18:30:00');
addFb.run(4, 1, 5, 'Diya explains Python really clearly.', '2026-09-28 17:10:00');
addFb.run(6, 2, 5, 'Great Python tips for lab work.', '2026-09-20 16:20:00');
addFb.run(6, 3, 4, 'Aarav is a quick learner.', '2026-09-20 16:25:00');

const addAvail = db.prepare(
  'INSERT INTO AVAILABILITY (StudentID, DayOfWeek, StartTime, EndTime, Label, Enabled) VALUES (?, ?, ?, ?, ?, ?)'
);
[
  [1, 'Monday', '16:00', '18:00', 'Evening Lab Hours', 1],
  [1, 'Tuesday', '17:00', '19:00', 'Post-Lecture Slot', 1],
  [1, 'Thursday', '16:00', '18:00', 'Library Study Hall', 1],
  [1, 'Friday', '16:30', '19:00', 'Peer Swap Sessions', 1],
  [1, 'Saturday', '10:00', '12:30', 'Morning Deep Dive', 1],
  [1, 'Saturday', '15:00', '17:30', 'Afternoon Coding Labs', 1],
  [7, 'Friday', '17:30', '19:00', 'ML lab', 1],
  [2, 'Monday', '16:00', '17:00', 'React practice', 1],
].forEach((r) => addAvail.run(...r));

const addMsg = db.prepare(
  'INSERT INTO MESSAGE (SenderID, ReceiverID, Body, SentAt, IsRead) VALUES (?, ?, ?, ?, ?)'
);
addMsg.run(7, 1, 'Hi Vidhi! I saw your learning request for Machine Learning with Scikit-Learn.', '2026-10-01 10:14:00', 1);
addMsg.run(1, 7, 'Hey Rashi! Yes — I want regression algorithms for our DBMS & AI project.', '2026-10-01 10:18:00', 1);
addMsg.run(7, 1, 'Awesome! I booked our Friday 5:30 PM slot in Study Room 3B at the library.', '2026-10-01 10:30:00', 0);
addMsg.run(8, 1, 'Hey Vidhi! Noticed your request for Docker containerization.', '2026-10-02 15:15:00', 1);
addMsg.run(1, 8, 'Hi Riya! I want to containerize React + Node with Docker Compose.', '2026-10-02 15:45:00', 1);
addMsg.run(8, 1, 'I scheduled a session idea for Sunday 3:00 PM over Google Meet.', '2026-10-03 16:02:00', 0);
addMsg.run(2, 1, 'Hi Vidhi, thanks for accepting my request to learn React.js!', '2026-10-03 14:10:00', 1);
addMsg.run(1, 2, 'Happy to help, Aarav! Have you worked with useState before?', '2026-10-03 14:25:00', 1);
addMsg.run(2, 1, 'Thanks for sending the starter repository! Looking forward to tomorrow.', '2026-10-03 18:00:00', 1);

console.log('Database created and seeded: skillexchange.db');
console.log('Demo password for all students: password123');
console.log('Try: kediavidhi62@gmail.com  or  aarav@campus.edu');
