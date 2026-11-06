import { useState, useEffect } from 'react';
import {
  resolveOrAddCourse,
  getCourseCatalog,
  getCourseById,
  getNextStudentId,
  getNextTeachingId,
  getNextLearningId,
  getNextMatchId,
  getNextSessionId,
  getNextRatingId,
  formatDisplayId,
  findMatches,
  calculateMultiFactorMatch
} from './courseEngine.js';
import {
  getReadableId,
  backfillUserReadableIds,
  extractStudentNumber,
  formatStudentId,
  getOrAssignTeacherCourse,
  buildLearningId,
  AWAITING_TEACHER_ID
} from './idEngine.js';
import {
  calculateDynamicAchievements,
  getBadgeProgress,
  SKILL_MASTER_TARGET
} from './badgeEngine.js';

export {
  resolveOrAddCourse,
  getCourseCatalog,
  getCourseById,
  getNextStudentId,
  getNextTeachingId,
  getNextLearningId,
  getNextMatchId,
  getNextSessionId,
  getNextRatingId,
  formatDisplayId,
  findMatches,
  calculateMultiFactorMatch,
  getReadableId,
  backfillUserReadableIds,
  extractStudentNumber,
  formatStudentId,
  getOrAssignTeacherCourse,
  buildLearningId,
  AWAITING_TEACHER_ID,
  calculateDynamicAchievements,
  getBadgeProgress,
  SKILL_MASTER_TARGET
};

export const DEFAULT_WEEKLY_AVAILABILITY = [
  {
    day: 'Monday',
    dayShort: 'Mon',
    enabled: true,
    slots: [
      { id: 'mon-1', start: '16:00', end: '18:00', label: '4:00 PM – 6:00 PM', period: 'Evening Lab Hours' }
    ]
  },
  {
    day: 'Tuesday',
    dayShort: 'Tue',
    enabled: true,
    slots: [
      { id: 'tue-1', start: '17:00', end: '19:00', label: '5:00 PM – 7:00 PM', period: 'Post-Lecture Slot' }
    ]
  },
  {
    day: 'Wednesday',
    dayShort: 'Wed',
    enabled: false,
    slots: []
  },
  {
    day: 'Thursday',
    dayShort: 'Thu',
    enabled: true,
    slots: [
      { id: 'thu-1', start: '16:00', end: '18:00', label: '4:00 PM – 6:00 PM', period: 'Library Study Hall' }
    ]
  },
  {
    day: 'Friday',
    dayShort: 'Fri',
    enabled: true,
    slots: [
      { id: 'fri-1', start: '16:30', end: '19:00', label: '4:30 PM – 7:00 PM', period: 'Peer Swap Sessions' }
    ]
  },
  {
    day: 'Saturday',
    dayShort: 'Sat',
    enabled: true,
    slots: [
      { id: 'sat-1', start: '10:00', end: '12:30', label: '10:00 AM – 12:30 PM', period: 'Morning Deep Dive' },
      { id: 'sat-2', start: '15:00', end: '17:30', label: '3:00 PM – 5:30 PM', period: 'Afternoon Coding Labs' }
    ]
  },
  {
    day: 'Sunday',
    dayShort: 'Sun',
    enabled: false,
    slots: []
  }
];

export const INITIAL_SESSIONS = [
  {
    id: 'sess-101',
    sessionId: 'SES101',
    Session_ID: 'SES-0101',
    Match_ID: 'MAT-0001',
    matchId: 'MAT-0001',
    courseId: 'CRS003',
    teachingId: 'TCH001',
    SS_ID: 'TCH-0001',
    teacherStudentId: 'STU001',
    learnerStudentId: 'STU006',
    skill: 'React.js & Frontend Architecture',
    topic: 'React State Lifting, Custom Hooks & Context API',
    teacher: 'Vidhi Kedia',
    teacherAvatar: 'VK',
    learner: 'Aarav Mehta',
    learnerAvatar: 'AM',
    learnerDept: 'Computer Science · 2nd Year',
    partnerName: 'Aarav Mehta',
    partnerRole: 'Learner',
    userRole: 'Teacher', // Vidhi is Teaching
    date: '2026-10-06',
    time: '4:00 PM – 5:00 PM',
    duration: '60 mins',
    status: 'Upcoming',
    mode: 'Google Meet',
    link: 'https://meet.google.com/4s-vidhi-aarav',
    notes: 'Walk through lifting state from form components into custom hooks and setting up clean React Context providers.'
  },
  {
    id: 'sess-102',
    sessionId: 'SES102',
    Session_ID: 'SES-0102',
    Match_ID: 'MAT-0002',
    matchId: 'MAT-0002',
    courseId: 'CRS004',
    learningId: 'LRN001',
    Request_ID: 'LRN-0001',
    teachingId: 'TCH012',
    SS_ID: 'TCH-0012',
    teacherStudentId: 'STU002',
    learnerStudentId: 'STU001',
    skill: 'Machine Learning with Scikit-Learn',
    topic: 'Linear & Logistic Regression with Pandas Preprocessing',
    teacher: 'Rashi Chandani',
    teacherAvatar: 'RC',
    learner: 'Vidhi Kedia',
    learnerAvatar: 'VK',
    partnerName: 'Rashi Chandani',
    partnerDept: 'Data Science & AI · 3rd Year',
    partnerRole: 'Teacher',
    userRole: 'Learner', // Vidhi is Learning
    date: '2026-10-09',
    time: '5:30 PM – 6:45 PM',
    duration: '75 mins',
    status: 'Upcoming',
    mode: 'Campus Library Hub',
    link: 'Study Room 3B (Second Floor)',
    notes: 'Hands-on dataset cleaning with Pandas and training our first binary classification model with scikit-learn.'
  },
  {
    id: 'sess-103',
    sessionId: 'SES103',
    Session_ID: 'SES-0103',
    Match_ID: 'MAT-0003',
    matchId: 'MAT-0003',
    courseId: 'CRS003',
    learningId: 'LRN002',
    Request_ID: 'LRN-0002',
    teachingId: 'TCH015',
    SS_ID: 'TCH-0015',
    teacherStudentId: 'STU003',
    learnerStudentId: 'STU001',
    skill: 'Docker & Cloud Deployment Basics',
    topic: 'Containerizing Multi-Service React & Express Apps',
    teacher: 'Riya Sharma',
    teacherAvatar: 'RS',
    learner: 'Vidhi Kedia',
    learnerAvatar: 'VK',
    partnerName: 'Riya Sharma',
    partnerDept: 'Computer Science · 4th Year',
    partnerRole: 'Teacher',
    userRole: 'Learner', // Vidhi is Learning
    date: '2026-10-11',
    time: '3:00 PM – 4:00 PM',
    duration: '60 mins',
    status: 'Upcoming',
    mode: 'Google Meet',
    link: 'https://meet.google.com/4s-docker-swap',
    notes: 'Mutual skill swap session: Riya demonstrates Dockerfile multi-stage builds and docker-compose.'
  },
  {
    id: 'sess-104',
    sessionId: 'SES104',
    Session_ID: 'SES-0104',
    Match_ID: 'MAT-0001',
    matchId: 'MAT-0001',
    courseId: 'CRS004',
    teachingId: 'TCH002',
    SS_ID: 'TCH-0002',
    teacherStudentId: 'STU001',
    learnerStudentId: 'STU008',
    skill: 'Database Systems & SQL Optimization',
    topic: 'B-Tree Indexing & Query Plan Explain Analysis',
    teacher: 'Vidhi Kedia',
    teacherAvatar: 'VK',
    learner: 'Sneha Rao',
    learnerAvatar: 'SR',
    learnerDept: 'Information Technology · 2nd Year',
    partnerName: 'Sneha Rao',
    partnerRole: 'Learner',
    userRole: 'Teacher', // Vidhi was Teaching
    date: '2026-10-02',
    time: '5:00 PM – 6:15 PM',
    duration: '75 mins',
    status: 'Completed',
    mode: 'Campus Library Hub',
    link: 'Discussion Pod A',
    notes: 'Covered SQL EXPLAIN ANALYZE, composite indexes, and avoided table scans. Sneha gave 5-star feedback!',
    rating: 5.0
  },
  {
    id: 'sess-105',
    sessionId: 'SES105',
    Session_ID: 'SES-0105',
    Match_ID: 'MAT-0002',
    matchId: 'MAT-0002',
    skill: 'Python for Beginners & OOP',
    topic: 'Object-Oriented Classes, Inheritance & Dunder Methods',
    teacher: 'Vidhi Kedia',
    teacherAvatar: 'VK',
    learner: 'Rohan Verma',
    learnerAvatar: 'RV',
    learnerDept: 'Electrical Engineering · 2nd Year',
    partnerName: 'Rohan Verma',
    partnerRole: 'Learner',
    userRole: 'Teacher', // Vidhi was Teaching
    date: '2026-09-28',
    time: '4:00 PM – 5:00 PM',
    duration: '60 mins',
    status: 'Completed',
    mode: 'Google Meet',
    link: 'https://meet.google.com/4s-python-session',
    notes: 'Demonstrated Python classes, init constructors, encapsulation, and built a simple bank account class demo.',
    rating: 5.0
  },
  {
    id: 'sess-106',
    sessionId: 'SES106',
    Session_ID: 'SES-0106',
    Match_ID: 'MAT-0003',
    matchId: 'MAT-0003',
    skill: 'UI Prototyping & Figma Basics',
    topic: 'Interactive Prototypes & Auto-Layout Component Variants',
    teacher: 'Vidhi Kedia',
    teacherAvatar: 'VK',
    learner: 'Tanya Kapoor',
    learnerAvatar: 'TK',
    learnerDept: 'Design & Media · 3rd Year',
    partnerName: 'Tanya Kapoor',
    partnerRole: 'Learner',
    userRole: 'Teacher',
    date: '2026-09-25',
    time: '2:00 PM – 3:00 PM',
    duration: '60 mins',
    status: 'Cancelled',
    mode: 'Google Meet',
    link: 'https://meet.google.com/4s-figma-demo',
    notes: 'Session cancelled by learner due to mid-term laboratory exams conflict. Re-scheduling for next month.'
  }
];

export const INITIAL_CONVERSATIONS = [
  {
    id: 'conv-1',
    peerName: 'Rashi Chandani',
    peerDept: 'Data Science & AI · 3rd Year',
    peerAvatar: 'RC',
    avatarBg: 'avatar-purple',
    onlineStatus: 'online',
    lastActive: 'Just now',
    skillContext: 'Teaching you: Applied Machine Learning · Learning from you: React.js',
    unreadCount: 1,
    messages: [
      {
        id: 'm1',
        sender: 'Rashi Chandani',
        text: 'Hi Vidhi! I saw your learning request for Machine Learning with Scikit-Learn.',
        timestamp: '10:14 AM',
        isMine: false
      },
      {
        id: 'm2',
        sender: 'Vidhi Kedia',
        text: 'Hey Rashi! Yes, absolutely! I want to understand regression algorithms and model evaluation for our DBMS & AI project.',
        timestamp: '10:18 AM',
        isMine: true
      },
      {
        id: 'm3',
        sender: 'Rashi Chandani',
        text: 'That sounds great! I would also love some help from you with React component lifecycles and custom hooks if you have time.',
        timestamp: '10:22 AM',
        isMine: false
      },
      {
        id: 'm4',
        sender: 'Vidhi Kedia',
        text: 'Deal! A mutual skill swap is perfect. I have already prepared some beginner-friendly React starter templates.',
        timestamp: '10:25 AM',
        isMine: true
      },
      {
        id: 'm5',
        sender: 'Rashi Chandani',
        text: 'Awesome! I booked our Friday 5:30 PM slot in Study Room 3B at the library. Bring your laptop with Jupyter or VS Code installed!',
        timestamp: '10:30 AM',
        isMine: false
      }
    ]
  },
  {
    id: 'conv-2',
    peerName: 'Riya Sharma',
    peerDept: 'Computer Science · 4th Year',
    peerAvatar: 'RS',
    avatarBg: 'avatar-indigo',
    onlineStatus: 'online',
    lastActive: '12m ago',
    skillContext: 'Teaching you: Docker & Cloud Containers · Learning from you: SQL Optimization',
    unreadCount: 1,
    messages: [
      {
        id: 'm201',
        sender: 'Riya Sharma',
        text: 'Hey Vidhi! Noticed your request for Docker containerization.',
        timestamp: 'Yesterday 3:15 PM',
        isMine: false
      },
      {
        id: 'm202',
        sender: 'Vidhi Kedia',
        text: 'Hi Riya! Yes, I want to containerize my React frontend and Node backend together with Docker Compose.',
        timestamp: 'Yesterday 3:45 PM',
        isMine: true
      },
      {
        id: 'm203',
        sender: 'Riya Sharma',
        text: 'I can definitely walk you through multi-stage Docker builds! In exchange, could you help me optimize complex PostgreSQL JOIN queries?',
        timestamp: 'Yesterday 4:02 PM',
        isMine: false
      },
      {
        id: 'm204',
        sender: 'Vidhi Kedia',
        text: '100%! We will analyze execution plans with EXPLAIN ANALYZE and design composite indexes.',
        timestamp: 'Yesterday 4:10 PM',
        isMine: true
      },
      {
        id: 'm205',
        sender: 'Riya Sharma',
        text: 'Super! I scheduled our session for Sunday at 3:00 PM over Google Meet.',
        timestamp: '1 hour ago',
        isMine: false
      }
    ]
  },
  {
    id: 'conv-3',
    peerName: 'Aarav Mehta',
    peerDept: 'Computer Science · 2nd Year',
    peerAvatar: 'AM',
    avatarBg: 'avatar-indigo',
    onlineStatus: 'idle',
    lastActive: '35m ago',
    skillContext: 'Learning from you: React State Lifting & Context API',
    unreadCount: 0,
    messages: [
      {
        id: 'm301',
        sender: 'Aarav Mehta',
        text: 'Hi Vidhi, thanks for accepting my request to learn React.js!',
        timestamp: 'Oct 3, 2:10 PM',
        isMine: false
      },
      {
        id: 'm302',
        sender: 'Vidhi Kedia',
        text: 'Happy to help, Aarav! Have you worked with useState and props passing before?',
        timestamp: 'Oct 3, 2:25 PM',
        isMine: true
      },
      {
        id: 'm303',
        sender: 'Aarav Mehta',
        text: 'Yes, basic props are clear, but I get confused when passing callback functions 3 components deep.',
        timestamp: 'Oct 3, 2:32 PM',
        isMine: false
      },
      {
        id: 'm304',
        sender: 'Vidhi Kedia',
        text: 'That is classic prop-drilling! We will replace that with a clean React Context and custom useStore hook tomorrow at 4 PM.',
        timestamp: 'Oct 3, 2:40 PM',
        isMine: true
      },
      {
        id: 'm305',
        sender: 'Aarav Mehta',
        text: 'Thanks for sending the starter repository! Looking forward to tomorrow.',
        timestamp: '3 hours ago',
        isMine: false
      }
    ]
  },
  {
    id: 'conv-4',
    peerName: 'Devansh Parekh',
    peerDept: 'Computer Science · 4th Year',
    peerAvatar: 'DP',
    avatarBg: 'avatar-indigo',
    onlineStatus: 'offline',
    lastActive: '2h ago',
    skillContext: 'Teaching you: Systems Programming in C · Learning from you: UI Prototyping',
    unreadCount: 0,
    messages: [
      {
        id: 'm401',
        sender: 'Devansh Parekh',
        text: 'Hey Vidhi, saw your profile on 4S. Ready to tackle C double pointers and dynamic memory allocators?',
        timestamp: 'Oct 2, 6:00 PM',
        isMine: false
      },
      {
        id: 'm402',
        sender: 'Vidhi Kedia',
        text: 'Hey Devansh! Yes, pointers to pointers and memory segmentation faults are what I need help debugging.',
        timestamp: 'Oct 2, 6:15 PM',
        isMine: true
      },
      {
        id: 'm403',
        sender: 'Devansh Parekh',
        text: 'We can trace pointer memory addresses directly in Valgrind & GDB. Let me know when you want to schedule!',
        timestamp: 'Oct 2, 6:22 PM',
        isMine: false
      }
    ]
  },
  {
    id: 'conv-5',
    peerName: 'Kavita Joshi',
    peerDept: 'Business Administration · 3rd Year',
    peerAvatar: 'KJ',
    avatarBg: 'avatar-purple',
    onlineStatus: 'online',
    lastActive: '5m ago',
    skillContext: 'Teaching you: Technical Public Speaking · Learning from you: Python OOP',
    unreadCount: 0,
    messages: [
      {
        id: 'm501',
        sender: 'Kavita Joshi',
        text: 'Hello Vidhi! Congratulations on your top peer mentor badge on 4S!',
        timestamp: 'Sep 30, 4:15 PM',
        isMine: false
      },
      {
        id: 'm502',
        sender: 'Vidhi Kedia',
        text: 'Thank you Kavita! I would really love your guidance on public speaking structure for technical product demos.',
        timestamp: 'Sep 30, 4:30 PM',
        isMine: true
      },
      {
        id: 'm503',
        sender: 'Kavita Joshi',
        text: 'We will practice the hook-problem-solution framework and mock your upcoming hackathon slide presentation.',
        timestamp: 'Sep 30, 4:45 PM',
        isMine: false
      }
    ]
  }
];

export const DEFAULT_USER = {
  id: 'usr_vidhi_kedia_4s',
  studentId: 'STU001',
  name: 'Vidhi Kedia',
  email: 'kediavidhi62@gmail.com',
  department: 'Computer Science & Engineering',
  year: '3rd Year',
  bio: 'CS student passionate about Full-Stack Web Development, Data Structures, and Database Design. Love teaching frontend basics and excited to learn Machine Learning & Cloud Architectures.',
  rating: '4.95',
  sessionsTaught: 18,
  sessionsAttended: 12,
  skillsOffered: [
    {
      id: 'teach-1',
      teachingId: 'TCH001',
      SS_ID: 'TCH-0001',
      studentId: 'STU001',
      Student_ID: 'STU001',
      courseId: 'CRS003',
      Skill_ID: 'CRS003',
      name: 'React.js & Frontend Architecture',
      category: 'Web Development',
      proficiency: 'Advanced',
      Proficiency_Level: 'Advanced',
      level: 'Advanced',
      experience: 14,
      Years_of_Experience: 14,
      availability: 'Weekdays after 4 PM',
      learnersHelped: 14,
      rating: 5.0,
      description: 'Component lifecycles, custom hooks, state management, and responsive UI with Tailwind CSS.',
      Description: 'Component lifecycles, custom hooks, state management, and responsive UI with Tailwind CSS.'
    },
    {
      id: 'teach-2',
      teachingId: 'TCH002',
      SS_ID: 'TCH-0002',
      studentId: 'STU001',
      Student_ID: 'STU001',
      courseId: 'CRS004',
      Skill_ID: 'CRS004',
      name: 'Database Systems & SQL Optimization',
      category: 'Data Science',
      proficiency: 'Advanced',
      Proficiency_Level: 'Advanced',
      level: 'Advanced',
      experience: 19,
      Years_of_Experience: 19,
      availability: 'Weekends & Evenings',
      learnersHelped: 19,
      rating: 4.9,
      description: 'Relational schema design, normalization, joins, indexing, and transaction ACID properties.',
      Description: 'Relational schema design, normalization, joins, indexing, and transaction ACID properties.'
    },
    {
      id: 'teach-3',
      teachingId: 'TCH003',
      SS_ID: 'TCH-0003',
      studentId: 'STU001',
      Student_ID: 'STU001',
      courseId: 'CRS001',
      Skill_ID: 'CRS001',
      name: 'Python for Beginners & OOP',
      category: 'Python',
      proficiency: 'Intermediate',
      Proficiency_Level: 'Intermediate',
      level: 'Intermediate',
      experience: 11,
      Years_of_Experience: 11,
      availability: 'Weekdays 5 PM – 7 PM',
      learnersHelped: 11,
      rating: 4.8,
      description: 'Python syntax fundamentals, data structures, object-oriented principles, and scripting.',
      Description: 'Python syntax fundamentals, data structures, object-oriented principles, and scripting.'
    },
    {
      id: 'teach-4',
      teachingId: 'TCH004',
      SS_ID: 'TCH-0004',
      studentId: 'STU001',
      Student_ID: 'STU001',
      courseId: 'CRS005',
      Skill_ID: 'CRS005',
      name: 'UI Prototyping & Figma Basics',
      category: 'UI/UX Design',
      proficiency: 'Intermediate',
      Proficiency_Level: 'Intermediate',
      level: 'Intermediate',
      experience: 8,
      Years_of_Experience: 8,
      availability: 'Flexible (Anytime)',
      learnersHelped: 8,
      rating: 5.0,
      description: 'Wireframing, auto-layout, design tokens, interactive components, and developer handoff.',
      Description: 'Wireframing, auto-layout, design tokens, interactive components, and developer handoff.'
    }
  ],
  skillsWanted: [
    {
      id: 'req-1',
      learningId: 'LRN001',
      Request_ID: 'LRN-0001',
      studentId: 'STU001',
      Student_ID: 'STU001',
      courseId: 'CRS004',
      Skill_ID: 'CRS004',
      name: 'Machine Learning with Scikit-Learn',
      category: 'Data Science',
      currentLevel: 'Beginner',
      desiredLevel: 'Advanced',
      Desired_Level: 'Advanced',
      preferredLevel: 'Advanced',
      priority: 'High',
      Priority_Level: 'High',
      status: 'Matched',
      description: 'Want to build predictive models for final semester DBMS & AI mini-project.',
      Description: 'Want to build predictive models for final semester DBMS & AI mini-project.',
      learningGoal: 'Want to build predictive models for final semester DBMS & AI mini-project.',
      targetGoal: 'Want to build predictive models for final semester DBMS & AI mini-project.',
      preferredAvailability: 'Weekday Evenings & Weekends'
    },
    {
      id: 'req-2',
      learningId: 'LRN002',
      Request_ID: 'LRN-0002',
      studentId: 'STU001',
      Student_ID: 'STU001',
      courseId: 'CRS003',
      Skill_ID: 'CRS003',
      name: 'Docker & Cloud Deployment Basics',
      category: 'Web Development',
      currentLevel: 'Beginner',
      desiredLevel: 'Intermediate',
      Desired_Level: 'Intermediate',
      preferredLevel: 'Intermediate',
      priority: 'Medium',
      Priority_Level: 'Medium',
      status: 'Open',
      description: 'Learn containerizing React + Node applications and deploying to cloud containers.',
      Description: 'Learn containerizing React + Node applications and deploying to cloud containers.',
      learningGoal: 'Learn containerizing React + Node applications and deploying to cloud containers.',
      targetGoal: 'Learn containerizing React + Node applications and deploying to cloud containers.',
      preferredAvailability: 'Weekdays'
    },
    {
      id: 'req-3',
      learningId: 'LRN003',
      Request_ID: 'LRN-0003',
      studentId: 'STU001',
      Student_ID: 'STU001',
      courseId: 'CRS007',
      Skill_ID: 'CRS007',
      name: 'Technical Public Speaking & Pitching',
      category: 'Communication',
      currentLevel: 'Intermediate',
      desiredLevel: 'Advanced',
      Desired_Level: 'Advanced',
      preferredLevel: 'Advanced',
      priority: 'High',
      Priority_Level: 'High',
      status: 'Open',
      description: 'Overcome stage anxiety for upcoming college hackathon presentations.',
      Description: 'Overcome stage anxiety for upcoming college hackathon presentations.',
      learningGoal: 'Overcome stage anxiety for upcoming college hackathon presentations.',
      targetGoal: 'Overcome stage anxiety for upcoming college hackathon presentations.',
      preferredAvailability: 'Evenings (6 PM – 8 PM)'
    },
    {
      id: 'req-4',
      learningId: 'LRN004',
      Request_ID: 'LRN-0004',
      studentId: 'STU001',
      Student_ID: 'STU001',
      courseId: 'CRS002',
      Skill_ID: 'CRS002',
      name: 'Systems Programming in C',
      category: 'C',
      currentLevel: 'Beginner',
      desiredLevel: 'Intermediate',
      Desired_Level: 'Intermediate',
      preferredLevel: 'Intermediate',
      priority: 'Medium',
      Priority_Level: 'Medium',
      status: 'Matched',
      description: 'Understand pointers arithmetic, struct memory alignment, and Unix process system calls.',
      Description: 'Understand pointers arithmetic, struct memory alignment, and Unix process system calls.',
      learningGoal: 'Understand pointers arithmetic, struct memory alignment, and Unix process system calls.',
      targetGoal: 'Understand pointers arithmetic, struct memory alignment, and Unix process system calls.',
      preferredAvailability: 'Weekdays after 4 PM'
    }
  ],
  upcomingSessions: INITIAL_SESSIONS,
  weeklyAvailability: DEFAULT_WEEKLY_AVAILABILITY,
  recentMessages: [
    {
      id: 'msg-1',
      sender: 'Rashi Chandani',
      avatar: 'RC',
      snippet: 'Awesome! I booked our Friday 5:30 PM slot in Study Room 3B at the library.',
      time: '10m ago',
      unread: true
    },
    {
      id: 'msg-2',
      sender: 'Riya Sharma',
      avatar: 'RS',
      snippet: 'Super! I scheduled our session for Sunday at 3:00 PM over Google Meet.',
      time: '1h ago',
      unread: true
    },
    {
      id: 'msg-3',
      sender: 'Aarav Mehta',
      avatar: 'AM',
      snippet: 'Thanks for sending the starter repository! Looking forward to tomorrow.',
      time: '3h ago',
      unread: false
    }
  ],
  achievements: [
    {
      id: 'ach-1',
      title: 'Top Peer Mentor',
      desc: 'Maintained 4.9+ rating across 15+ student teaching sessions.',
      icon: 'Award',
      badgeClass: 'badge-gold'
    },
    {
      id: 'ach-2',
      title: 'Campus Knowledge Pioneer',
      desc: 'Created 4 distinct high-demand skill offerings.',
      icon: 'Sparkles',
      badgeClass: 'badge-purple'
    },
    {
      id: 'ach-3',
      title: '100% Punctuality',
      desc: 'Zero missed or canceled sessions this semester.',
      icon: 'CheckCircle2',
      badgeClass: 'badge-blue'
    }
  ],
  recentReviews: [
    {
      id: 'rev-1',
      ratingId: 'RAT-0001',
      Rating_ID: 'RAT-0001',
      sessionId: 'SES-0104',
      Session_ID: 'SES-0104',
      author: 'Sneha Rao',
      authorRole: 'Learner',
      rating: 5,
      skill: 'Database Systems & SQL Optimization',
      sessionDate: '2026-10-02',
      date: '2 days ago',
      comment: 'Vidhi is an outstanding mentor! She explained B-Tree indexing and query optimization using simple drawings that made everything click.'
    },
    {
      id: 'rev-2',
      ratingId: 'RAT-0002',
      Rating_ID: 'RAT-0002',
      sessionId: 'SES-0105',
      Session_ID: 'SES-0105',
      author: 'Rohan Verma',
      authorRole: 'Learner',
      rating: 5,
      skill: 'Python for Beginners & OOP',
      sessionDate: '2026-09-28',
      date: 'Last week',
      comment: 'Super patient with frontend fundamentals and Python classes. Helped me debug my recursion in less than 20 minutes.'
    },
    {
      id: 'rev-3',
      ratingId: 'RAT-0003',
      Rating_ID: 'RAT-0003',
      sessionId: 'SES-0101',
      Session_ID: 'SES-0101',
      author: 'Aarav Mehta',
      authorRole: 'Learner',
      rating: 5,
      skill: 'React.js & Frontend Architecture',
      sessionDate: '2026-09-20',
      date: '2 weeks ago',
      comment: 'Excellent explanation of custom hooks and React component lifecycle. Very approachable and knowledgeable.'
    },
    {
      id: 'rev-4',
      ratingId: 'RAT-0004',
      Rating_ID: 'RAT-0004',
      sessionId: 'SES-0102',
      Session_ID: 'SES-0102',
      author: 'Rashi Chandani',
      authorRole: 'Teacher',
      rating: 5,
      skill: 'Machine Learning with Scikit-Learn',
      sessionDate: '2026-09-15',
      date: '3 weeks ago',
      comment: 'Vidhi is an enthusiastic learner! Asked incisive questions about gradient descent and cost functions during our peer session.'
    }
  ]
};

// Retrieve stored user or fallback to Vidhi Kedia demo
export const getStoredUser = () => {
  try {
    const raw = localStorage.getItem('4s_active_user');
    let user = raw ? JSON.parse(raw) : null;
    if (!user) user = DEFAULT_USER;

    // Ensure studentId exists and is persistent
    if (!user.studentId) {
      user.studentId = 'STU001';
    }

    // Ensure teaching records have stable IDs
    if (!user.skillsOffered || user.skillsOffered.length === 0) {
      user.skillsOffered = DEFAULT_USER.skillsOffered;
    } else {
      user.skillsOffered = user.skillsOffered.map((s, idx) => {
        const teachingId = s.teachingId || (s.id && s.id.startsWith('TCH') ? s.id : `TCH${String(idx + 1).padStart(3, '0')}`);
        const courseId = s.courseId || resolveOrAddCourse(s.name, s.category);
        return {
          ...s,
          id: s.id || teachingId,
          teachingId,
          studentId: user.studentId,
          courseId,
          proficiency: s.proficiency || s.level || 'Intermediate'
        };
      });
    }

    // Ensure learning records have stable IDs
    if (!user.skillsWanted || user.skillsWanted.length === 0) {
      user.skillsWanted = DEFAULT_USER.skillsWanted;
    } else {
      user.skillsWanted = user.skillsWanted.map((r, idx) => {
        const learningId = r.learningId || (r.id && r.id.startsWith('LRN') ? r.id : `LRN${String(idx + 1).padStart(3, '0')}`);
        const courseId = r.courseId || resolveOrAddCourse(r.name, r.category);
        return {
          ...r,
          id: r.id || learningId,
          learningId,
          studentId: user.studentId,
          courseId,
          currentLevel: r.currentLevel || 'Beginner',
          desiredLevel: r.desiredLevel || r.preferredLevel || 'Intermediate'
        };
      });
    }

    if (!user.upcomingSessions) {
      user.upcomingSessions = INITIAL_SESSIONS;
    } else {
      // Ensure sessions have stable IDs
      user.upcomingSessions = user.upcomingSessions.map((sess, idx) => {
        const sessionId = sess.sessionId || (sess.id && sess.id.startsWith('SES') ? sess.id : `SES${String(idx + 101).padStart(3, '0')}`);
        const courseId = sess.courseId || resolveOrAddCourse(sess.skill || sess.topic);
        return {
          ...sess,
          id: sess.id || sessionId,
          sessionId,
          courseId,
          teachingId: sess.teachingId || '',
          learningId: sess.learningId || '',
          teacherStudentId: sess.teacherStudentId || (sess.userRole === 'Teacher' ? user.studentId : 'STU002'),
          learnerStudentId: sess.learnerStudentId || (sess.userRole === 'Learner' ? user.studentId : 'STU006')
        };
      });
    }

    if (!user.weeklyAvailability) {
      user.weeklyAvailability = DEFAULT_WEEKLY_AVAILABILITY;
    }
    if (!user.recentReviews) {
      user.recentReviews = DEFAULT_USER.recentReviews;
    }

    // Backfill deterministic readable IDs (TCR... and LRN...)
    user = backfillUserReadableIds(user);

    return user;
  } catch (e) {
    console.error('Error reading user from localStorage', e);
  }
  return backfillUserReadableIds(DEFAULT_USER);
};

// Check if explicitly logged in
export const isUserLoggedIn = () => {
  try {
    return localStorage.getItem('4s_is_logged_in') === 'true';
  } catch {
    return false;
  }
};

// Save user into localStorage
export const saveUser = (userData) => {
  try {
    localStorage.setItem('4s_active_user', JSON.stringify(userData));
    localStorage.setItem('4s_is_logged_in', 'true');
    window.dispatchEvent(new Event('4s_auth_change'));
  } catch (e) {
    console.error('Error saving user to localStorage', e);
  }
};

// Skills Offered CRUD helpers
export const getUserSkills = () => {
  const user = getStoredUser();
  return user.skillsOffered || [];
};

export const addUserSkill = (skill) => {
  const user = getStoredUser();
  const currentSkills = user.skillsOffered || [];
  const rawTeachingId = getNextTeachingId();
  const SS_ID = formatDisplayId('TCH', rawTeachingId);
  const courseId = skill.courseId || skill.Skill_ID || resolveOrAddCourse(skill.name, skill.category);
  const stuId = user.studentId || 'STU001';
  const readableId = getOrAssignTeacherCourse(stuId, skill.name);

  const newSkillWithId = {
    ...skill,
    id: SS_ID,
    teachingId: readableId,
    SS_ID,
    readableId,
    displayId: readableId,
    studentId: stuId,
    Student_ID: stuId,
    courseId,
    Skill_ID: courseId,
    enrolledLearners: [],
    proficiency: skill.level || skill.proficiency || skill.Proficiency_Level || 'Intermediate',
    Proficiency_Level: skill.level || skill.proficiency || skill.Proficiency_Level || 'Intermediate',
    level: skill.level || skill.proficiency || skill.Proficiency_Level || 'Intermediate',
    rating: 5.0,
    learnersHelped: 0,
    experience: Number(skill.experience || skill.Years_of_Experience || 0),
    Years_of_Experience: Number(skill.experience || skill.Years_of_Experience || 0),
    description: skill.description || skill.Description || '',
    Description: skill.description || skill.Description || ''
  };
  const updatedSkills = [newSkillWithId, ...currentSkills];
  user.skillsOffered = updatedSkills;
  saveUser(user);
  return updatedSkills;
};

export const updateUserSkill = (updatedSkill) => {
  const user = getStoredUser();
  const currentSkills = user.skillsOffered || [];
  const index = currentSkills.findIndex((s) => s.id === updatedSkill.id || s.teachingId === updatedSkill.teachingId || s.SS_ID === updatedSkill.SS_ID);
  if (index !== -1) {
    const courseId = updatedSkill.courseId || updatedSkill.Skill_ID || resolveOrAddCourse(updatedSkill.name, updatedSkill.category);
    currentSkills[index] = {
      ...currentSkills[index],
      ...updatedSkill,
      courseId,
      Skill_ID: courseId,
      proficiency: updatedSkill.level || updatedSkill.proficiency || updatedSkill.Proficiency_Level || currentSkills[index].proficiency,
      Proficiency_Level: updatedSkill.level || updatedSkill.proficiency || updatedSkill.Proficiency_Level || currentSkills[index].proficiency
    };
    user.skillsOffered = currentSkills;
    saveUser(user);
  }
  return user.skillsOffered;
};

export const deleteUserSkill = (skillId) => {
  const user = getStoredUser();
  const currentSkills = user.skillsOffered || [];
  const filtered = currentSkills.filter((s) => s.id !== skillId && s.teachingId !== skillId && s.SS_ID !== skillId);
  user.skillsOffered = filtered;
  saveUser(user);
  return filtered;
};

// Learning Requests CRUD helpers
export const getUserRequests = () => {
  const user = getStoredUser();
  return user.skillsWanted || [];
};

export const addUserRequest = (request) => {
  const user = getStoredUser();
  const currentRequests = user.skillsWanted || [];
  const rawLearningId = getNextLearningId();
  const Request_ID = formatDisplayId('LRN', rawLearningId);
  const courseId = request.courseId || request.Skill_ID || resolveOrAddCourse(request.name, request.category);

  const stuId = user.studentId || 'STU001';
  const status = request.status || 'Open';
  const readableId = status === 'Matched' && request.teacherStudentId
    ? buildLearningId(stuId, getOrAssignTeacherCourse(request.teacherStudentId, request.name))
    : AWAITING_TEACHER_ID;

  const newRequestWithId = {
    ...request,
    id: Request_ID,
    learningId: readableId,
    displayId: readableId,
    readableId: readableId,
    Request_ID,
    studentId: stuId,
    Student_ID: stuId,
    courseId,
    Skill_ID: courseId,
    currentLevel: request.currentLevel || 'Beginner',
    desiredLevel: request.desiredLevel || request.preferredLevel || request.Desired_Level || 'Intermediate',
    Desired_Level: request.desiredLevel || request.preferredLevel || request.Desired_Level || 'Intermediate',
    preferredLevel: request.desiredLevel || request.preferredLevel || request.Desired_Level || 'Intermediate',
    priority: request.priority || request.Priority_Level || 'Medium',
    Priority_Level: request.priority || request.Priority_Level || 'Medium',
    description: request.targetGoal || request.learningGoal || request.description || request.Description || `Learn and master ${request.name}`,
    Description: request.targetGoal || request.learningGoal || request.description || request.Description || `Learn and master ${request.name}`,
    learningGoal: request.learningGoal || request.targetGoal || `Learn and master ${request.name}`,
    targetGoal: request.learningGoal || request.targetGoal || `Learn and master ${request.name}`,
    preferredAvailability: request.preferredAvailability || request.availability || 'Flexible',
    status: request.status || 'Open'
  };
  const updatedRequests = [newRequestWithId, ...currentRequests];
  user.skillsWanted = updatedRequests;
  saveUser(user);
  return updatedRequests;
};

export const updateUserRequest = (updatedRequest) => {
  const user = getStoredUser();
  const currentRequests = user.skillsWanted || [];
  const index = currentRequests.findIndex((r) => r.id === updatedRequest.id || r.learningId === updatedRequest.learningId || r.Request_ID === updatedRequest.Request_ID);
  if (index !== -1) {
    const courseId = updatedRequest.courseId || updatedRequest.Skill_ID || resolveOrAddCourse(updatedRequest.name, updatedRequest.category);
    currentRequests[index] = {
      ...currentRequests[index],
      ...updatedRequest,
      courseId,
      Skill_ID: courseId,
      desiredLevel: updatedRequest.desiredLevel || updatedRequest.preferredLevel || updatedRequest.Desired_Level || currentRequests[index].desiredLevel,
      Desired_Level: updatedRequest.desiredLevel || updatedRequest.preferredLevel || updatedRequest.Desired_Level || currentRequests[index].desiredLevel
    };
    user.skillsWanted = currentRequests;
    saveUser(user);
  }
  return user.skillsWanted;
};

export const deleteUserRequest = (requestId) => {
  const user = getStoredUser();
  const currentRequests = user.skillsWanted || [];
  const filtered = currentRequests.filter((r) => r.id !== requestId && r.learningId !== requestId && r.Request_ID !== requestId);
  user.skillsWanted = filtered;
  saveUser(user);
  return filtered;
};

// Record a new learning request made by the student from Explore Skills
export const submitLearningRequest = (requestData) => {
  const user = getStoredUser();
  const currentRequests = user.skillsWanted || [];
  const rawLearningId = getNextLearningId();
  const Request_ID = formatDisplayId('LRN', rawLearningId);
  const courseId = requestData.courseId || requestData.Skill_ID || resolveOrAddCourse(requestData.skillName, requestData.category);

  const newReq = {
    id: Request_ID,
    learningId: Request_ID,
    Request_ID,
    studentId: user.studentId || 'STU001',
    Student_ID: user.studentId || 'STU001',
    courseId,
    Skill_ID: courseId,
    name: requestData.skillName,
    category: requestData.category,
    currentLevel: 'Beginner',
    desiredLevel: 'Intermediate',
    Desired_Level: 'Intermediate',
    preferredLevel: 'Intermediate',
    priority: 'High',
    Priority_Level: 'High',
    status: 'Open',
    description: requestData.note || `Request to learn ${requestData.skillName} from ${requestData.mentorName}`,
    Description: requestData.note || `Request to learn ${requestData.skillName} from ${requestData.mentorName}`,
    learningGoal: requestData.note || `Request to learn ${requestData.skillName} from ${requestData.mentorName}`,
    targetGoal: requestData.note || `Request to learn ${requestData.skillName} from ${requestData.mentorName}`,
    preferredAvailability: requestData.timeSlot || 'Flexible',
    preferredTimeSlot: requestData.timeSlot,
    mentorRequested: requestData.mentorName
  };
  user.skillsWanted = [newReq, ...currentRequests];
  saveUser(user);

  if (requestData.mentorName) {
    sendChatMessage(
      requestData.mentorName,
      `Hi ${requestData.mentorName.split(' ')[0]}! I sent a request to learn "${requestData.skillName}". Looking forward to coordinating a session with you!`
    );
  }

  return newReq;
};

// -----------------------------------------------------------------------------
// SESSIONS CRUD HELPERS
// -----------------------------------------------------------------------------
export const getUserSessions = () => {
  const user = getStoredUser();
  return user.upcomingSessions || INITIAL_SESSIONS;
};

export const scheduleSession = (sessionData) => {
  const user = getStoredUser();
  const currentSessions = user.upcomingSessions || INITIAL_SESSIONS;

  const isTeaching = sessionData.userRole === 'Teacher' || sessionData.role === 'Teaching';
  const rawSessionId = sessionData.sessionId || sessionData.Session_ID || getNextSessionId();
  const Session_ID = formatDisplayId('SES', rawSessionId);
  const matchId = sessionData.Match_ID || sessionData.matchId || '';
  const Match_ID = matchId ? formatDisplayId('MAT', matchId) : '';
  const courseId = sessionData.courseId || sessionData.Skill_ID || resolveOrAddCourse(sessionData.skill || sessionData.topic);

  const newSession = {
    id: Session_ID,
    sessionId: Session_ID,
    Session_ID,
    courseId,
    Skill_ID: courseId,
    Match_ID,
    matchId: Match_ID,
    teachingId: sessionData.SS_ID || sessionData.teachingId || '',
    SS_ID: sessionData.SS_ID || sessionData.teachingId || '',
    learningId: sessionData.Request_ID || sessionData.learningId || '',
    Request_ID: sessionData.Request_ID || sessionData.learningId || '',
    skill: sessionData.skill || sessionData.topic || 'General Skill Swap',
    topic: sessionData.topic || sessionData.skill,
    teacher: isTeaching ? user.name : (sessionData.partnerName || 'Peer Mentor'),
    teacherStudentId: isTeaching ? (user.studentId || 'STU001') : (sessionData.teacherStudentId || 'STU002'),
    teacherAvatar: isTeaching ? 'VK' : (sessionData.partnerAvatar || 'PM'),
    learner: isTeaching ? (sessionData.partnerName || 'Peer Learner') : user.name,
    learnerStudentId: isTeaching ? (sessionData.learnerStudentId || 'STU002') : (user.studentId || 'STU001'),
    learnerAvatar: isTeaching ? (sessionData.partnerAvatar || 'PL') : 'VK',
    learnerDept: sessionData.partnerDept || 'College Department',
    partnerName: sessionData.partnerName || 'Campus Student',
    partnerDept: sessionData.partnerDept || 'Campus Student',
    partnerRole: isTeaching ? 'Learner' : 'Teacher',
    userRole: isTeaching ? 'Teacher' : 'Learner',
    date: sessionData.date || new Date().toISOString().split('T')[0],
    time: sessionData.time || sessionData.dateTime || '4:00 PM – 5:00 PM',
    duration: sessionData.duration || '60 mins',
    status: sessionData.status || 'Upcoming',
    mode: sessionData.mode || 'Google Meet',
    link: sessionData.link || (sessionData.mode === 'Google Meet' ? 'https://meet.google.com/4s-study-hub' : 'Campus Library Hub Room 2A'),
    notes: sessionData.notes || 'Collaborative study & mentoring session.'
  };

  const updatedSessions = [newSession, ...currentSessions];
  user.upcomingSessions = updatedSessions;
  saveUser(user);
  return updatedSessions;
};

export const updateSessionStatus = (sessionId, newStatus, extraNotes = '') => {
  const user = getStoredUser();
  const currentSessions = user.upcomingSessions || INITIAL_SESSIONS;
  const index = currentSessions.findIndex((s) => s.id === sessionId);

  if (index !== -1) {
    currentSessions[index] = {
      ...currentSessions[index],
      status: newStatus,
      ...(extraNotes ? { notes: `${currentSessions[index].notes} (${extraNotes})` } : {})
    };

    // If completed and user was teaching, increment teaching count
    if (newStatus === 'Completed') {
      if (currentSessions[index].userRole === 'Teacher') {
        user.sessionsTaught = (user.sessionsTaught || 18) + 1;
      } else {
        user.sessionsAttended = (user.sessionsAttended || 12) + 1;
      }
    }

    user.upcomingSessions = [...currentSessions];
    saveUser(user);
  }
  return user.upcomingSessions;
};

export const cancelSession = (sessionId, reason = 'Cancelled by student') => {
  return updateSessionStatus(sessionId, 'Cancelled', reason);
};

export const deleteSession = (sessionId) => {
  const user = getStoredUser();
  const currentSessions = user.upcomingSessions || INITIAL_SESSIONS;
  const filtered = currentSessions.filter((s) => s.id !== sessionId);
  user.upcomingSessions = filtered;
  saveUser(user);
  return filtered;
};

// -----------------------------------------------------------------------------
// AVAILABILITY CRUD HELPERS
// -----------------------------------------------------------------------------
export const getUserAvailability = () => {
  const user = getStoredUser();
  return user.weeklyAvailability || DEFAULT_WEEKLY_AVAILABILITY;
};

export const saveUserAvailability = (weeklyAvailability) => {
  const user = getStoredUser();
  user.weeklyAvailability = weeklyAvailability;
  saveUser(user);
  return weeklyAvailability;
};

export const toggleDayAvailability = (dayName) => {
  const current = getUserAvailability();
  const updated = current.map((item) => {
    if (item.day.toLowerCase() === dayName.toLowerCase()) {
      return { ...item, enabled: !item.enabled };
    }
    return item;
  });
  return saveUserAvailability(updated);
};

export const addAvailabilitySlot = (dayName, slot) => {
  const current = getUserAvailability();
  const updated = current.map((item) => {
    if (item.day.toLowerCase() === dayName.toLowerCase()) {
      const newSlot = {
        id: `slot_${Date.now()}`,
        start: slot.start || '16:00',
        end: slot.end || '18:00',
        label: slot.label || `${slot.start} – ${slot.end}`,
        period: slot.period || 'General Study Slot'
      };
      return {
        ...item,
        enabled: true,
        slots: [...(item.slots || []), newSlot]
      };
    }
    return item;
  });
  return saveUserAvailability(updated);
};

export const removeAvailabilitySlot = (dayName, slotId) => {
  const current = getUserAvailability();
  const updated = current.map((item) => {
    if (item.day.toLowerCase() === dayName.toLowerCase()) {
      const filteredSlots = (item.slots || []).filter((s) => s.id !== slotId);
      return {
        ...item,
        slots: filteredSlots,
        enabled: filteredSlots.length > 0
      };
    }
    return item;
  });
  return saveUserAvailability(updated);
};

// -----------------------------------------------------------------------------
// MESSAGING & CHAT HELPERS
// -----------------------------------------------------------------------------
export const getChatConversations = () => {
  try {
    const raw = localStorage.getItem('4s_chat_conversations');
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Error reading chat conversations from localStorage', e);
  }
  return INITIAL_CONVERSATIONS;
};

export const saveChatConversations = (conversations) => {
  try {
    localStorage.setItem('4s_chat_conversations', JSON.stringify(conversations));
    window.dispatchEvent(new Event('4s_chat_change'));
  } catch (e) {
    console.error('Error saving chat conversations', e);
  }
};

export const sendChatMessage = (peerName, text) => {
  const conversations = getChatConversations();
  let conversationIndex = conversations.findIndex(
    (c) => c.peerName.toLowerCase() === peerName.toLowerCase()
  );

  const now = new Date();
  const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const newMsg = {
    id: `msg_${Date.now()}`,
    sender: 'Vidhi Kedia',
    text: text.trim(),
    timestamp: timeString,
    isMine: true
  };

  if (conversationIndex === -1) {
    // Create new conversation
    const newConv = {
      id: `conv_${Date.now()}`,
      peerName: peerName,
      peerDept: 'Campus Student',
      peerAvatar: peerName.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase(),
      avatarBg: 'avatar-indigo',
      onlineStatus: 'online',
      lastActive: 'Just now',
      skillContext: 'Direct peer knowledge exchange',
      unreadCount: 0,
      messages: [newMsg]
    };
    const updated = [newConv, ...conversations];
    saveChatConversations(updated);
    return updated;
  } else {
    const target = conversations[conversationIndex];
    const updatedConv = {
      ...target,
      lastActive: 'Just now',
      messages: [...target.messages, newMsg]
    };

    // Move updated conversation to top
    const remaining = conversations.filter((_, idx) => idx !== conversationIndex);
    const updated = [updatedConv, ...remaining];
    saveChatConversations(updated);
    return updated;
  }
};

export const markConversationAsRead = (peerName) => {
  const conversations = getChatConversations();
  const updated = conversations.map((conv) => {
    if (conv.peerName.toLowerCase() === peerName.toLowerCase()) {
      return { ...conv, unreadCount: 0 };
    }
    return conv;
  });
  saveChatConversations(updated);
  return updated;
};

// Legacy single message bridge
export const sendMessageToPeer = (peerName, snippet, peerAvatar = 'SP') => {
  sendChatMessage(peerName, snippet);
  const user = getStoredUser();
  const currentMessages = user.recentMessages || [];
  const newMsg = {
    id: `msg_${Date.now()}`,
    sender: peerName,
    avatar: peerAvatar,
    snippet,
    time: 'Just now',
    unread: false
  };
  user.recentMessages = [newMsg, ...currentMessages.filter((m) => m.sender !== peerName)];
  saveUser(user);
  return user.recentMessages;
};

// -----------------------------------------------------------------------------
// PROFILE & REVIEWS CRUD HELPERS
// -----------------------------------------------------------------------------
export const updateUserProfile = (profileData) => {
  const user = getStoredUser();
  user.name = profileData.name !== undefined ? profileData.name.trim() : user.name;
  user.email = profileData.email !== undefined ? profileData.email.trim() : user.email;
  user.department = profileData.department !== undefined ? profileData.department.trim() : user.department;
  user.year = profileData.year !== undefined ? profileData.year : user.year;
  user.bio = profileData.bio !== undefined ? profileData.bio.trim() : user.bio;
  if (profileData.avatar) user.avatar = profileData.avatar;
  saveUser(user);
  return user;
};

export const getUserReviews = () => {
  const user = getStoredUser();
  return user.recentReviews || DEFAULT_USER.recentReviews;
};

export const addUserReview = (reviewData) => {
  const user = getStoredUser();
  const currentReviews = user.recentReviews || DEFAULT_USER.recentReviews;
  const rawRatingId = reviewData.ratingId || reviewData.Rating_ID || getNextRatingId();
  const Rating_ID = formatDisplayId('RAT', rawRatingId);
  const rawSessionId = reviewData.Session_ID || reviewData.sessionId || 'SES-0104';
  const Session_ID = formatDisplayId('SES', rawSessionId);

  const newReview = {
    id: Rating_ID,
    ratingId: Rating_ID,
    Rating_ID,
    Session_ID,
    sessionId: Session_ID,
    author: reviewData.author?.trim() || 'Fellow Campus Peer',
    authorRole: reviewData.authorRole || 'Learner',
    rating: Number(reviewData.rating) || 5,
    skill: reviewData.skill?.trim() || 'Peer Knowledge Exchange',
    sessionDate: reviewData.sessionDate || new Date().toISOString().split('T')[0],
    date: 'Just now',
    comment: reviewData.comment?.trim() || 'Great collaborative learning exchange!'
  };

  const updatedReviews = [newReview, ...currentReviews];
  user.recentReviews = updatedReviews;

  // Re-calculate user rating
  const totalStars = updatedReviews.reduce((sum, r) => sum + (Number(r.rating) || 5), 0);
  user.rating = (totalStars / updatedReviews.length).toFixed(2);

  saveUser(user);
  return updatedReviews;
};

// Logout helper
export const logoutUser = () => {
  try {
    localStorage.removeItem('4s_is_logged_in');
    window.dispatchEvent(new Event('4s_auth_change'));
  } catch (e) {
    console.error('Error logging out', e);
  }
};

// React hook for observing auth state
export const useAuth = () => {
  const [user, setUser] = useState(getStoredUser());
  const [loggedIn, setLoggedIn] = useState(isUserLoggedIn());
  const [conversations, setConversations] = useState(getChatConversations());

  useEffect(() => {
    const syncAuth = () => {
      setUser(getStoredUser());
      setLoggedIn(isUserLoggedIn());
    };

    const syncChat = () => {
      setConversations(getChatConversations());
    };

    window.addEventListener('4s_auth_change', syncAuth);
    window.addEventListener('4s_chat_change', syncChat);
    window.addEventListener('storage', syncAuth);
    window.addEventListener('storage', syncChat);

    return () => {
      window.removeEventListener('4s_auth_change', syncAuth);
      window.removeEventListener('4s_chat_change', syncChat);
      window.removeEventListener('storage', syncAuth);
      window.removeEventListener('storage', syncChat);
    };
  }, []);

  return {
    user,
    loggedIn,
    saveUser,
    logoutUser,
    skills: user.skillsOffered || [],
    requests: user.skillsWanted || [],
    sessions: user.upcomingSessions || INITIAL_SESSIONS,
    availability: user.weeklyAvailability || DEFAULT_WEEKLY_AVAILABILITY,
    reviews: user.recentReviews || DEFAULT_USER.recentReviews,
    achievements: calculateDynamicAchievements(user),
    conversations,
    addUserSkill,
    updateUserSkill,
    deleteUserSkill,
    addUserRequest,
    updateUserRequest,
    deleteUserRequest,
    scheduleSession,
    updateSessionStatus,
    cancelSession,
    deleteSession,
    saveUserAvailability,
    toggleDayAvailability,
    addAvailabilitySlot,
    removeAvailabilitySlot,
    sendChatMessage,
    markConversationAsRead,
    sendMessageToPeer,
    updateUserProfile,
    addUserReview,
    calculateDynamicAchievements
  };
};
