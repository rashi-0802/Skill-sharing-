// Mock Skills Catalog and Peer Matches for 4S

export const ALL_CATEGORIES = [
  'All',
  'Programming',
  'C',
  'Python',
  'Web Development',
  'UI/UX Design',
  'Graphic Design',
  'Data Science',
  'Photography',
  'Communication'
];

export const SKILL_LEVELS = ['All', 'Beginner', 'Intermediate', 'Advanced'];

export const AVAILABILITY_OPTIONS = [
  'All',
  'Weekdays',
  'Weekends',
  'Evenings',
  'Flexible'
];

export const INITIAL_EXPLORE_SKILLS = [
  {
    id: 'exp-1',
    name: 'C Programming & Pointer Fundamentals',
    category: 'C',
    level: 'Beginner',
    mentorName: 'Aarav Mehta',
    mentorDept: 'Computer Science · 3rd Year',
    mentorAvatar: 'AM',
    avatarBg: 'avatar-indigo',
    mentorRating: '4.9',
    sessionsDelivered: 28,
    description: 'Master memory allocation, pointers, structs, file handling, and debug segmentation faults with confidence for college exams.',
    availability: 'Weekdays after 4 PM',
    availabilityType: 'Weekdays',
    topics: ['Pointers & Addresses', 'Dynamic Memory (malloc/free)', 'Structs & Unions', 'Makefiles']
  },
  {
    id: 'exp-2',
    name: 'Python for Data Automation & Scripting',
    category: 'Python',
    level: 'Beginner',
    mentorName: 'Sneha Rao',
    mentorDept: 'Information Technology · 2nd Year',
    mentorAvatar: 'SR',
    avatarBg: 'avatar-purple',
    mentorRating: '5.0',
    sessionsDelivered: 32,
    description: 'Learn Python syntax, file parsing, web scraping with BeautifulSoup, and writing scripts to automate mundane college tasks.',
    availability: 'Evenings (6 PM – 8 PM)',
    availabilityType: 'Evenings',
    topics: ['Syntax & Data Structures', 'File I/O', 'Web Scraping', 'Automation Scripts']
  },
  {
    id: 'exp-3',
    name: 'Modern React & Component Architecture',
    category: 'Web Development',
    level: 'Intermediate',
    mentorName: 'Vikram Sengupta',
    mentorDept: 'Electronics & Comm · 4th Year',
    mentorAvatar: 'VS',
    avatarBg: 'avatar-indigo',
    mentorRating: '4.8',
    sessionsDelivered: 45,
    description: 'Build production-ready React web apps. Covers hooks (useState, useEffect, custom hooks), component patterns, and Tailwind CSS.',
    availability: 'Weekends',
    availabilityType: 'Weekends',
    topics: ['Functional Components', 'Custom Hooks', 'Tailwind CSS', 'State Management']
  },
  {
    id: 'exp-4',
    name: 'Figma UI/UX Design Systems & Wireframing',
    category: 'UI/UX Design',
    level: 'Intermediate',
    mentorName: 'Tanya Kapoor',
    mentorDept: 'Design & Media · 3rd Year',
    mentorAvatar: 'TK',
    avatarBg: 'avatar-purple',
    mentorRating: '4.95',
    sessionsDelivered: 24,
    description: 'Learn auto-layout, interactive prototyping, component variants, and design tokens to create polished mobile & web mockups.',
    availability: 'Flexible (Anytime)',
    availabilityType: 'Flexible',
    topics: ['Auto-layout & Grids', 'Design Systems', 'Interactive Prototyping', 'User Flows']
  },
  {
    id: 'exp-5',
    name: 'Data Science with Pandas, SQL & NumPy',
    category: 'Data Science',
    level: 'Intermediate',
    mentorName: 'Ananya Iyer',
    mentorDept: 'Data Science & AI · 3rd Year',
    mentorAvatar: 'AI',
    avatarBg: 'avatar-indigo',
    mentorRating: '4.9',
    sessionsDelivered: 22,
    description: 'Hands-on exploratory data analysis. Clean messy CSVs, write optimized SQL queries, and build interactive dashboards.',
    availability: 'Weekdays',
    availabilityType: 'Weekdays',
    topics: ['Pandas DataFrames', 'SQL Group By & Joins', 'Matplotlib & Seaborn', 'Data Cleaning']
  },
  {
    id: 'exp-6',
    name: 'Public Speaking & Tech Presentation Poise',
    category: 'Communication',
    level: 'Beginner',
    mentorName: 'Kavita Joshi',
    mentorDept: 'Business Administration · 3rd Year',
    mentorAvatar: 'KJ',
    avatarBg: 'avatar-purple',
    mentorRating: '5.0',
    sessionsDelivered: 19,
    description: 'Overcome stage fright and deliver engaging technical talks, college project pitches, and confident interview answers.',
    availability: 'Evenings',
    availabilityType: 'Evenings',
    topics: ['Slide Design & Storytelling', 'Voice Modulation', 'Overcoming Stage Anxiety', 'Q&A Handling']
  },
  {
    id: 'exp-7',
    name: 'DSLR Manual Photography & Light Composition',
    category: 'Photography',
    level: 'Beginner',
    mentorName: 'Kabir Das',
    mentorDept: 'Architecture · 2nd Year',
    mentorAvatar: 'KD',
    avatarBg: 'avatar-indigo',
    mentorRating: '4.85',
    sessionsDelivered: 16,
    description: 'Master aperture, shutter speed, ISO exposure triangle, natural lighting portraits, and framing rules.',
    availability: 'Weekends (Mornings)',
    availabilityType: 'Weekends',
    topics: ['Exposure Triangle', 'Rule of Thirds', 'Golden Hour Lighting', 'Lens Selection']
  },
  {
    id: 'exp-8',
    name: 'Vector Graphic Design in Adobe Illustrator',
    category: 'Graphic Design',
    level: 'Intermediate',
    mentorName: 'Rohan Mehra',
    mentorDept: 'Applied Arts · 3rd Year',
    mentorAvatar: 'RM',
    avatarBg: 'avatar-purple',
    mentorRating: '4.9',
    sessionsDelivered: 20,
    description: 'Learn the pen tool, vector illustration, typography pairing, logo creation, and exporting assets for print & web.',
    availability: 'Flexible (Anytime)',
    availabilityType: 'Flexible',
    topics: ['Pen Tool Mastery', 'Color Palettes', 'Typography Hierarchy', 'Logo Design']
  },
  {
    id: 'exp-9',
    name: 'Data Structures & Algorithms in C++',
    category: 'Programming',
    level: 'Advanced',
    mentorName: 'Devansh Parekh',
    mentorDept: 'Computer Science · 4th Year',
    mentorAvatar: 'DP',
    avatarBg: 'avatar-indigo',
    mentorRating: '4.95',
    sessionsDelivered: 50,
    description: 'Prepare for coding interviews: binary search trees, graph traversals (BFS/DFS), dynamic programming, and heaps.',
    availability: 'Weekdays after 6 PM',
    availabilityType: 'Weekdays',
    topics: ['Trees & Graphs', 'Dynamic Programming', 'Complexity Analysis', 'LeetCode Strategies']
  },
  {
    id: 'exp-10',
    name: 'Adobe Lightroom Color Grading & RAW Editing',
    category: 'Photography',
    level: 'Intermediate',
    mentorName: 'Kabir Das',
    mentorDept: 'Architecture · 2nd Year',
    mentorAvatar: 'KD',
    avatarBg: 'avatar-indigo',
    mentorRating: '4.85',
    sessionsDelivered: 16,
    description: 'Batch edit photos with tone curves, HSL sliders, masking tools, and creating custom Lightroom presets.',
    availability: 'Evenings',
    availabilityType: 'Evenings',
    topics: ['Tone Curves', 'Color Calibration', 'Selective Masking', 'Preset Creation']
  },
  {
    id: 'exp-11',
    name: 'Full-Stack Node.js & Express REST APIs',
    category: 'Web Development',
    level: 'Intermediate',
    mentorName: 'Priya Sharma',
    mentorDept: 'Computer Science · 3rd Year',
    mentorAvatar: 'PS',
    avatarBg: 'avatar-purple',
    mentorRating: '4.9',
    sessionsDelivered: 26,
    description: 'Design robust backend APIs with Node.js, Express middleware, authentication JWTs, and database integration.',
    availability: 'Weekends',
    availabilityType: 'Weekends',
    topics: ['RESTful Routing', 'Middleware', 'JWT Authentication', 'Error Handling']
  },
  {
    id: 'exp-12',
    name: 'Campus Placement GD & HR Interview Preparation',
    category: 'Communication',
    level: 'Intermediate',
    mentorName: 'Kavita Joshi',
    mentorDept: 'Business Administration · 3rd Year',
    mentorAvatar: 'KJ',
    avatarBg: 'avatar-purple',
    mentorRating: '5.0',
    sessionsDelivered: 19,
    description: 'Group discussion moderation, structured behavioral answers using the STAR method, and resume walk-throughs.',
    availability: 'Weekdays',
    availabilityType: 'Weekdays',
    topics: ['STAR Technique', 'GD Entry & Exit Tactics', 'Body Language', 'Mock Interviews']
  }
];

import {
  INITIAL_COURSES,
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
  buildMatchRecord
} from './courseEngine.js';

export {
  INITIAL_COURSES,
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
  buildMatchRecord
};

// Potential Campus Peer Matches for 4S Matches Page
export const SAMPLE_PEER_MATCHES = [
  {
    id: 'peer-match-1',
    studentId: 'STU002',
    name: 'Rashi Chandani',
    dept: 'Data Science & AI · 3rd Year',
    avatar: 'RC',
    avatarBg: 'avatar-purple',
    rating: '4.95',
    sessionsDelivered: 36,
    teachingId: 'TCH012',
    courseId: 'CRS004',
    skillOffered: 'Applied Machine Learning & Scikit-Learn',
    category: 'Data Science',
    proficiencyLevel: 'Advanced',
    availability: 'Weekday Evenings & Weekends',
    availabilityType: 'Evenings',
    bio: 'Specializing in UI/UX wireframing, Graphic Design, and predictive machine learning with Scikit-Learn. Passionate about exchanging knowledge with fellow campus peers.',
    wantsToLearn: 'React.js & Frontend Architecture',
    matchReason: 'Teaches UI/UX, Graphic Design & ML; wants to learn React (which you offer)',
    compatibilityScore: 96,
    mutualSwapAvailable: true,
    overlapFactors: ['Direct Skill Wishlist Match', 'Mutual Reciprocal Skill Swap', 'Evening Timetable Alignment'],
    teachingRecords: [
      {
        teachingId: 'TCH010',
        studentId: 'STU002',
        courseId: 'CRS005',
        skillName: 'UI/UX Design',
        category: 'UI/UX Design',
        proficiency: 'Advanced',
        experience: 30,
        availability: 'Weekday Evenings & Weekends'
      },
      {
        teachingId: 'TCH011',
        studentId: 'STU002',
        courseId: 'CRS006',
        skillName: 'Graphic Design',
        category: 'Graphic Design',
        proficiency: 'Advanced',
        experience: 25,
        availability: 'Weekday Evenings & Weekends'
      },
      {
        teachingId: 'TCH012',
        studentId: 'STU002',
        courseId: 'CRS004',
        skillName: 'Applied Machine Learning & Scikit-Learn',
        category: 'Data Science',
        proficiency: 'Advanced',
        experience: 36,
        availability: 'Weekday Evenings & Weekends'
      }
    ],
    skills: ['UI/UX', 'UI/UX Design', 'Graphic Design', 'Applied Machine Learning & Scikit-Learn', 'Data Science'],
    skillsOffered: [
      { name: 'UI/UX', category: 'UI/UX Design' },
      { name: 'Graphic Design', category: 'Graphic Design' },
      { name: 'Applied Machine Learning & Scikit-Learn', category: 'Data Science' }
    ],
    teaching: ['UI/UX', 'Graphic Design', 'Applied Machine Learning & Scikit-Learn']
  },
  {
    id: 'peer-match-2',
    studentId: 'STU003',
    name: 'Riya Sharma',
    dept: 'Computer Science · 4th Year',
    avatar: 'RS',
    avatarBg: 'avatar-indigo',
    rating: '4.9',
    sessionsDelivered: 29,
    teachingId: 'TCH013',
    courseId: 'CRS001',
    skillOffered: 'Python & Data Science Mentorship',
    category: 'Python',
    proficiencyLevel: 'Advanced',
    availability: 'Weekdays after 4 PM',
    availabilityType: 'Weekdays',
    bio: 'Software engineer mentoring peers in Python, Data Science, and Web Development containerization. Looking to strengthen SQL query tuning.',
    wantsToLearn: 'Database Systems & SQL Optimization',
    matchReason: 'Teaches Python & Data Science; wants to learn SQL Database Optimization (which you offer)',
    compatibilityScore: 94,
    mutualSwapAvailable: true,
    overlapFactors: ['Direct Skill Wishlist Match', 'Mutual Reciprocal Skill Swap', 'Weekday Schedule Compatibility'],
    teachingRecords: [
      {
        teachingId: 'TCH013',
        studentId: 'STU003',
        courseId: 'CRS001',
        skillName: 'Python',
        category: 'Python',
        proficiency: 'Advanced',
        experience: 29,
        availability: 'Weekdays after 4 PM'
      },
      {
        teachingId: 'TCH014',
        studentId: 'STU003',
        courseId: 'CRS004',
        skillName: 'Data Science',
        category: 'Data Science',
        proficiency: 'Advanced',
        experience: 24,
        availability: 'Weekdays after 4 PM'
      },
      {
        teachingId: 'TCH015',
        studentId: 'STU003',
        courseId: 'CRS003',
        skillName: 'Web Development',
        category: 'Web Development',
        proficiency: 'Intermediate',
        experience: 18,
        availability: 'Weekdays after 4 PM'
      }
    ],
    skills: ['Python', 'Data Science', 'Web Development', 'Docker Containers & Cloud Deployment'],
    skillsOffered: [
      { name: 'Python', category: 'Python' },
      { name: 'Data Science', category: 'Data Science' },
      { name: 'Web Development', category: 'Web Development' }
    ],
    teaching: ['Python', 'Data Science', 'Web Development']
  },
  {
    id: 'peer-match-3',
    studentId: 'STU004',
    name: 'Devansh Parekh',
    dept: 'Computer Science · 4th Year',
    avatar: 'DP',
    avatarBg: 'avatar-indigo',
    rating: '4.95',
    sessionsDelivered: 48,
    teachingId: 'TCH016',
    courseId: 'CRS002',
    skillOffered: 'Systems Programming in C & Pointer Memory',
    category: 'C',
    proficiencyLevel: 'Advanced',
    availability: 'Weekdays after 5 PM',
    availabilityType: 'Weekdays',
    bio: 'Systems programmer with deep focus on memory layouts, pointers, custom allocators, and Unix system calls. Ready to help students preparing for core operating systems coursework.',
    wantsToLearn: 'UI Prototyping & Figma Basics',
    matchReason: 'Teaches your requested skill "Systems Programming in C" and wants to learn Figma UI Prototyping (which you offer)',
    compatibilityScore: 90,
    mutualSwapAvailable: true,
    overlapFactors: ['Direct Skill Wishlist Match', 'Mutual Reciprocal Skill Swap', 'Matching Free Timetable'],
    teachingRecords: [
      {
        teachingId: 'TCH016',
        studentId: 'STU004',
        courseId: 'CRS002',
        skillName: 'Systems Programming in C & Pointer Memory',
        category: 'C',
        proficiency: 'Advanced',
        experience: 48,
        availability: 'Weekdays after 5 PM'
      }
    ],
    skills: ['Systems Programming in C & Pointer Memory', 'C', 'C Programming', 'Programming'],
    skillsOffered: [
      { name: 'Systems Programming in C & Pointer Memory', category: 'C' },
      { name: 'C', category: 'C' },
      { name: 'Programming', category: 'Programming' }
    ],
    teaching: ['C', 'Systems Programming in C & Pointer Memory']
  },
  {
    id: 'peer-match-4',
    studentId: 'STU005',
    name: 'Kavita Joshi',
    dept: 'Business Administration · 3rd Year',
    avatar: 'KJ',
    avatarBg: 'avatar-purple',
    rating: '5.0',
    sessionsDelivered: 19,
    teachingId: 'TCH017',
    courseId: 'CRS007',
    skillOffered: 'Technical Public Speaking & Pitching',
    category: 'Communication',
    proficiencyLevel: 'Advanced',
    availability: 'Evenings (6 PM – 8 PM)',
    availabilityType: 'Evenings',
    bio: 'University debate finalist. Experienced in coaching technical students to deliver compelling presentations, hackathon pitches, and placement interviews without stage anxiety.',
    wantsToLearn: 'Python for Beginners & OOP',
    matchReason: 'Teaches your requested skill "Technical Public Speaking & Pitching" and wants to learn Python (which you offer)',
    compatibilityScore: 88,
    mutualSwapAvailable: true,
    overlapFactors: ['Direct Skill Wishlist Match', 'Mutual Reciprocal Skill Swap', 'Evenings Timetable Match'],
    teachingRecords: [
      {
        teachingId: 'TCH017',
        studentId: 'STU005',
        courseId: 'CRS007',
        skillName: 'Technical Public Speaking & Pitching',
        category: 'Communication',
        proficiency: 'Advanced',
        experience: 19,
        availability: 'Evenings (6 PM – 8 PM)'
      }
    ],
    skills: ['Technical Public Speaking & Pitching', 'Communication', 'Public Speaking', 'Interview Preparation'],
    skillsOffered: [
      { name: 'Technical Public Speaking & Pitching', category: 'Communication' },
      { name: 'Communication', category: 'Communication' }
    ],
    teaching: ['Communication', 'Technical Public Speaking & Pitching', 'Public Speaking']
  },
  {
    id: 'peer-match-5',
    studentId: 'STU006',
    name: 'Arjun Mehta',
    dept: 'Computer Science · 3rd Year',
    avatar: 'AM',
    avatarBg: 'avatar-indigo',
    rating: '4.9',
    sessionsDelivered: 34,
    teachingId: 'TCH018',
    courseId: 'CRS002',
    skillOffered: 'C Programming & Web Development',
    category: 'C',
    proficiencyLevel: 'Advanced',
    availability: 'Weekdays after 4 PM',
    availabilityType: 'Weekdays',
    bio: 'Helping peers master C programming, pointers, web development fundamentals, and data structures algorithms.',
    wantsToLearn: 'React.js & Frontend Architecture',
    matchReason: 'Teaches C & Web Development; eager for modern frontend component mentoring',
    compatibilityScore: 86,
    mutualSwapAvailable: true,
    overlapFactors: ['Complementary CS Department', 'Weekday Schedule Compatibility'],
    teachingRecords: [
      {
        teachingId: 'TCH018',
        studentId: 'STU006',
        courseId: 'CRS002',
        skillName: 'C Programming',
        category: 'C',
        proficiency: 'Advanced',
        experience: 34,
        availability: 'Weekdays after 4 PM'
      },
      {
        teachingId: 'TCH019',
        studentId: 'STU006',
        courseId: 'CRS003',
        skillName: 'Web Development',
        category: 'Web Development',
        proficiency: 'Advanced',
        experience: 28,
        availability: 'Weekdays after 4 PM'
      }
    ],
    skills: ['C', 'Web Development', 'C Programming', 'Programming', 'Data Structures & Algorithms in C++'],
    skillsOffered: [
      { name: 'C', category: 'C' },
      { name: 'Web Development', category: 'Web Development' },
      { name: 'Data Structures & Algorithms in C++', category: 'Programming' }
    ],
    teaching: ['C', 'Web Development', 'Programming']
  },
  {
    id: 'peer-match-6',
    studentId: 'STU007',
    name: 'Tanya Kapoor',
    dept: 'Design & Media · 3rd Year',
    avatar: 'TK',
    avatarBg: 'avatar-purple',
    rating: '4.95',
    sessionsDelivered: 24,
    teachingId: 'TCH020',
    courseId: 'CRS005',
    skillOffered: 'Figma UI/UX Systems & Prototyping',
    category: 'UI/UX Design',
    proficiencyLevel: 'Advanced',
    availability: 'Flexible (Anytime)',
    availabilityType: 'Flexible',
    bio: 'Creating production design tokens, wireframes, and micro-interactions in Figma. Happy to collaborate on UI/UX mockups.',
    wantsToLearn: 'Web Development & Tailwind CSS',
    matchReason: 'Design mentor who wants to learn the web implementation side of design systems',
    compatibilityScore: 82,
    mutualSwapAvailable: true,
    overlapFactors: ['Design & Code Synergy', 'Flexible Timetable Match'],
    teachingRecords: [
      {
        teachingId: 'TCH020',
        studentId: 'STU007',
        courseId: 'CRS005',
        skillName: 'Figma UI/UX Systems & Prototyping',
        category: 'UI/UX Design',
        proficiency: 'Advanced',
        experience: 24,
        availability: 'Flexible (Anytime)'
      }
    ],
    skills: ['Figma UI/UX Systems & Prototyping', 'UI/UX Design', 'UI/UX', 'Figma', 'Wireframing', 'Prototyping'],
    skillsOffered: [
      { name: 'Figma UI/UX Systems & Prototyping', category: 'UI/UX Design' },
      { name: 'UI/UX Design', category: 'UI/UX Design' }
    ],
    teaching: ['UI/UX Design', 'Figma UI/UX Systems & Prototyping']
  },
  {
    id: 'peer-match-7',
    studentId: 'STU008',
    name: 'Sneha Rao',
    dept: 'Information Technology · 2nd Year',
    avatar: 'SR',
    avatarBg: 'avatar-purple',
    rating: '5.0',
    sessionsDelivered: 32,
    teachingId: 'TCH021',
    courseId: 'CRS001',
    skillOffered: 'Python for Data Automation & Scripting',
    category: 'Python',
    proficiencyLevel: 'Advanced',
    availability: 'Evenings (6 PM – 8 PM)',
    availabilityType: 'Evenings',
    bio: 'Python programmer teaching syntax, file automation, web scraping, and writing utility scripts to automate college tasks.',
    wantsToLearn: 'Database Systems & SQL Optimization',
    matchReason: 'Teaches Python programming & scripting and wants to learn database systems',
    compatibilityScore: 95,
    mutualSwapAvailable: true,
    overlapFactors: ['Direct Skill Wishlist Match', 'Mutual Reciprocal Skill Swap', 'Evening Timetable Alignment'],
    teachingRecords: [
      {
        teachingId: 'TCH021',
        studentId: 'STU008',
        courseId: 'CRS001',
        skillName: 'Python for Data Automation & Scripting',
        category: 'Python',
        proficiency: 'Advanced',
        experience: 32,
        availability: 'Evenings (6 PM – 8 PM)'
      }
    ],
    skills: ['Python for Data Automation & Scripting', 'Python', 'Python Programming', 'Automation', 'Scripting'],
    skillsOffered: [
      { name: 'Python for Data Automation & Scripting', category: 'Python' },
      { name: 'Python', category: 'Python' }
    ],
    teaching: ['Python', 'Python for Data Automation & Scripting']
  },
  {
    id: 'peer-match-8',
    studentId: 'STU009',
    name: 'Rohan Mehra',
    dept: 'Applied Arts · 3rd Year',
    avatar: 'RM',
    avatarBg: 'avatar-purple',
    rating: '4.9',
    sessionsDelivered: 20,
    teachingId: 'TCH022',
    courseId: 'CRS006',
    skillOffered: 'Vector Graphic Design in Adobe Illustrator',
    category: 'Graphic Design',
    proficiencyLevel: 'Intermediate',
    availability: 'Flexible (Anytime)',
    availabilityType: 'Flexible',
    bio: 'Graphic design mentor. Learn pen tool mastery, typography hierarchy, logo branding, and exporting vector graphics.',
    wantsToLearn: 'Web Development & Frontend Architecture',
    matchReason: 'Teaches Graphic Design and wants to learn Frontend Web Development',
    compatibilityScore: 91,
    mutualSwapAvailable: true,
    overlapFactors: ['Creative & Code Synergy', 'Mutual Reciprocal Skill Swap', 'Flexible Timetable Match'],
    teachingRecords: [
      {
        teachingId: 'TCH022',
        studentId: 'STU009',
        courseId: 'CRS006',
        skillName: 'Vector Graphic Design in Adobe Illustrator',
        category: 'Graphic Design',
        proficiency: 'Intermediate',
        experience: 20,
        availability: 'Flexible (Anytime)'
      }
    ],
    skills: ['Vector Graphic Design in Adobe Illustrator', 'Graphic Design', 'Adobe Illustrator', 'Logo Design', 'Typography'],
    skillsOffered: [
      { name: 'Vector Graphic Design in Adobe Illustrator', category: 'Graphic Design' },
      { name: 'Graphic Design', category: 'Graphic Design' }
    ],
    teaching: ['Graphic Design', 'Vector Graphic Design in Adobe Illustrator']
  },
  {
    id: 'peer-match-9',
    studentId: 'STU010',
    name: 'Vikram Sengupta',
    dept: 'Electronics & Comm · 4th Year',
    avatar: 'VS',
    avatarBg: 'avatar-indigo',
    rating: '4.8',
    sessionsDelivered: 45,
    teachingId: 'TCH023',
    courseId: 'CRS003',
    skillOffered: 'Modern React & Component Architecture',
    category: 'Web Development',
    proficiencyLevel: 'Advanced',
    availability: 'Weekends',
    availabilityType: 'Weekends',
    bio: 'Build production-ready React web apps. Covers hooks, responsive Tailwind CSS layouts, and modern web development architecture.',
    wantsToLearn: 'Python for Beginners & OOP',
    matchReason: 'Teaches Web Development with React and wants to learn Python scripting',
    compatibilityScore: 89,
    mutualSwapAvailable: true,
    overlapFactors: ['Web Tech Alignment', 'Weekend Schedule Compatibility'],
    teachingRecords: [
      {
        teachingId: 'TCH023',
        studentId: 'STU010',
        courseId: 'CRS003',
        skillName: 'Modern React & Component Architecture',
        category: 'Web Development',
        proficiency: 'Advanced',
        experience: 45,
        availability: 'Weekends'
      }
    ],
    skills: ['Modern React & Component Architecture', 'Web Development', 'React', 'Frontend Development'],
    skillsOffered: [
      { name: 'Modern React & Component Architecture', category: 'Web Development' },
      { name: 'Web Development', category: 'Web Development' }
    ],
    teaching: ['Web Development', 'Modern React & Component Architecture']
  },
  {
    id: 'peer-match-10',
    studentId: 'STU011',
    name: 'Ananya Iyer',
    dept: 'Data Science & AI · 3rd Year',
    avatar: 'AI',
    avatarBg: 'avatar-indigo',
    rating: '4.9',
    sessionsDelivered: 22,
    teachingId: 'TCH024',
    courseId: 'CRS004',
    skillOffered: 'Data Science with Pandas, SQL & NumPy',
    category: 'Data Science',
    proficiencyLevel: 'Intermediate',
    availability: 'Weekdays',
    availabilityType: 'Weekdays',
    bio: 'Hands-on exploratory data analysis. Clean messy CSV datasets, write optimized SQL queries, and build insightful dashboards.',
    wantsToLearn: 'React.js & Frontend Architecture',
    matchReason: 'Teaches Data Science and wants to learn React component architecture',
    compatibilityScore: 94,
    mutualSwapAvailable: true,
    overlapFactors: ['Direct Skill Wishlist Match', 'Mutual Reciprocal Skill Swap', 'Weekday Schedule Compatibility'],
    teachingRecords: [
      {
        teachingId: 'TCH024',
        studentId: 'STU011',
        courseId: 'CRS004',
        skillName: 'Data Science with Pandas, SQL & NumPy',
        category: 'Data Science',
        proficiency: 'Intermediate',
        experience: 22,
        availability: 'Weekdays'
      }
    ],
    skills: ['Data Science with Pandas, SQL & NumPy', 'Data Science', 'Pandas', 'SQL'],
    skillsOffered: [
      { name: 'Data Science with Pandas, SQL & NumPy', category: 'Data Science' },
      { name: 'Data Science', category: 'Data Science' }
    ],
    teaching: ['Data Science', 'Data Science with Pandas, SQL & NumPy']
  },
  {
    id: 'peer-match-11',
    studentId: 'STU012',
    name: 'Kabir Das',
    dept: 'Architecture & Visual Arts · 2nd Year',
    avatar: 'KD',
    avatarBg: 'avatar-indigo',
    rating: '4.9',
    sessionsDelivered: 22,
    teachingId: 'TCH025',
    courseId: 'CRS008',
    skillOffered: 'DSLR Photography & Composition',
    category: 'Photography',
    proficiencyLevel: 'Intermediate',
    availability: 'Weekends & Evenings',
    availabilityType: 'Weekends',
    bio: 'Architecture student passionate about DSLR camera composition, lighting techniques, and Adobe Lightroom RAW editing.',
    wantsToLearn: 'Python for Data Automation & Scripting',
    matchReason: 'Teaches Photography & Lightroom; eager to learn Python scripting for automated image workflows',
    compatibilityScore: 89,
    mutualSwapAvailable: true,
    overlapFactors: ['Visual Media Synergy', 'Weekend Timetable Alignment'],
    teachingRecords: [
      {
        teachingId: 'TCH025',
        studentId: 'STU012',
        courseId: 'CRS008',
        skillName: 'DSLR Photography & Composition',
        category: 'Photography',
        proficiency: 'Intermediate',
        experience: 22,
        availability: 'Weekends & Evenings'
      }
    ],
    skills: ['DSLR Photography & Composition', 'Photography', 'Adobe Lightroom Color Grading', 'Composition', 'Visual Arts'],
    skillsOffered: [
      { name: 'DSLR Photography & Composition', category: 'Photography' },
      { name: 'Photography', category: 'Photography' },
      { name: 'Adobe Lightroom Color Grading', category: 'Photography' }
    ],
    teaching: ['Photography', 'DSLR Photography & Composition']
  }
];

/**
 * Requirement 6, 7, 8, 10, 11 & Part 3:
 * Finds all recommended teachers for a specific Learning Request record using:
 * The 7-step matching logic in findMatches().
 */
export const findMatchesForLearningRequest = (
  learningRequest,
  peersList = SAMPLE_PEER_MATCHES
) => {
  if (!learningRequest) return [];
  return findMatches(learningRequest, { peersList });
};

// Helper to get skills from localStorage or initialize
export const getCatalogSkills = () => {
  try {
    const raw = localStorage.getItem('4s_explore_skills');
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Error reading explore skills', e);
  }
  return INITIAL_EXPLORE_SKILLS;
};

// -----------------------------------------------------------------------------
// NORMALIZED SKILL COMPARISON & STUDENT MATCHING UTILITIES
// -----------------------------------------------------------------------------

/**
 * Normalizes text for case-insensitive, punctuation-resilient matching.
 * Converts to lowercase, trims whitespace, and collapses multiple spaces.
 */
export const normalizeText = (text) => {
  if (!text || typeof text !== 'string') return '';
  return text
    .toLowerCase()
    .replace(/[^\w\s+#.-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
};

/**
 * Extracts all offered skills from any student object structure, supporting:
 * - student.skillOffered (string)
 * - student.category (string)
 * - student.skills (array of strings OR objects with .name or .skill)
 * - student.skillsOffered (array of objects with .name, .category)
 * - student.teaching (array of strings)
 * - student.topics (array of strings)
 */
export const getStudentOfferedSkills = (student) => {
  if (!student) return [];
  const skills = [];

  // 1. Primary skillOffered string
  if (student.skillOffered && typeof student.skillOffered === 'string') {
    skills.push(student.skillOffered);
  }

  // 2. Primary category string
  if (student.category && typeof student.category === 'string') {
    skills.push(student.category);
  }

  // 3. skills array (can be strings or objects)
  if (Array.isArray(student.skills)) {
    student.skills.forEach((s) => {
      if (typeof s === 'string') {
        skills.push(s);
      } else if (s && typeof s === 'object') {
        if (s.name) skills.push(s.name);
        if (s.skill) skills.push(s.skill);
        if (s.category) skills.push(s.category);
      }
    });
  }

  // 4. skillsOffered array (array of objects with name, category)
  if (Array.isArray(student.skillsOffered)) {
    student.skillsOffered.forEach((s) => {
      if (typeof s === 'string') {
        skills.push(s);
      } else if (s && typeof s === 'object') {
        if (s.name) skills.push(s.name);
        if (s.category) skills.push(s.category);
      }
    });
  }

  // 5. teaching array (strings)
  if (Array.isArray(student.teaching)) {
    student.teaching.forEach((s) => {
      if (typeof s === 'string') skills.push(s);
    });
  }

  // 6. topics array (strings)
  if (Array.isArray(student.topics)) {
    student.topics.forEach((t) => {
      if (typeof t === 'string') skills.push(t);
    });
  }

  return [...new Set(skills.filter(Boolean))];
};

/**
 * Determines whether a student offers the queried skill using normalized comparison.
 * Supports exact match, substring containment, and token overlap without false positives
 * for short tokens like "C".
 */
export const doesStudentOfferSkill = (student, query) => {
  if (!query || !query.trim()) return true;
  const rawQuery = query.trim();
  const normQuery = normalizeText(rawQuery);
  if (!normQuery) return true;

  // Check student name alias (e.g. searching "Arjun" or "Aarav" matches student name)
  if (student.name) {
    const normName = normalizeText(student.name);
    if (normQuery.length >= 3 && normName.includes(normQuery)) return true;
    if (normQuery === 'aarav' && normName.includes('arjun')) return true;
    if (normQuery === 'arjun' && normName.includes('aarav')) return true;
  }

  const offeredSkills = getStudentOfferedSkills(student);

  // Check each offered skill
  for (const skill of offeredSkills) {
    const normSkill = normalizeText(skill);
    if (!normSkill) continue;

    // Exact normalized match
    if (normSkill === normQuery) return true;

    // Special handling for single-letter or very short queries (e.g. "C")
    // Prevents matching words that simply contain 'c' like 'docker' or 'react'
    if (normQuery.length === 1) {
      const skillWords = normSkill.split(/\s+/);
      if (skillWords.includes(normQuery)) return true;
      continue;
    }

    // Special handling for single-letter skills (e.g. student offers "C")
    // Prevents matching queries that simply contain the letter 'c' like 'graphic design' or 'data science'
    if (normSkill.length === 1) {
      const queryWords = normQuery.split(/\s+/);
      if (queryWords.includes(normSkill)) return true;
      continue;
    }

    // Guard generic terms (e.g. student offers "Programming" or "Design")
    // Should match when user searches "Programming", but NOT when user searches "Python Programming"
    const genericTerms = new Set(['programming', 'development', 'design', 'skills', 'basics']);
    if (genericTerms.has(normSkill) && normQuery !== normSkill) {
      continue;
    }

    // Bidirectional containment (e.g., query "python" in "python for data automation",
    // or query "python programming" contains "python")
    if (normSkill.includes(normQuery) || normQuery.includes(normSkill)) {
      return true;
    }

    // Normalized token overlap for descriptive titles like
    // "Machine Learning with Scikit-Learn" vs "Applied Machine Learning & Scikit-Learn"
    const stopwords = new Set(['with', 'and', 'for', 'in', 'the', 'of', 'to', 'a', 'an', '&']);
    const qTokens = normQuery.split(/\s+/).filter((t) => !stopwords.has(t) && t.length > 1);
    const sTokens = normSkill.split(/\s+/).filter((t) => !stopwords.has(t) && t.length > 1);

    if (qTokens.length > 0 && sTokens.length > 0) {
      const matchCount = qTokens.filter((t) =>
        sTokens.some((st) => st === t || st.includes(t) || t.includes(st))
      ).length;

      // For 2-token queries (like "data science" or "graphic design"), require BOTH tokens to match
      // For 3+ token queries, require at least 2 tokens and >= 60%
      if (qTokens.length === 2 && matchCount === 2) {
        return true;
      } else if (qTokens.length >= 3 && matchCount >= 2 && matchCount >= Math.ceil(qTokens.length * 0.6)) {
        return true;
      }
    }
  }

  return false;
};

/**
 * Returns the specific offered skill that best matches the search query for card display.
 * If no search query is active, returns the primary peer.skillOffered.
 */
export const getMatchingSkillDisplay = (peer, query) => {
  if (!peer) return '';
  if (!query || !query.trim()) return peer.skillOffered;
  const normQuery = normalizeText(query);
  const offeredSkills = getStudentOfferedSkills(peer);
  for (const skill of offeredSkills) {
    const normSkill = normalizeText(skill);
    if (normSkill === normQuery) return skill;
    if (normQuery.length === 1 && normSkill.split(/\s+/).includes(normQuery)) return skill;
    if (normSkill.includes(normQuery) || normQuery.includes(normSkill)) return skill;
  }
  return peer.skillOffered;
};

/**
 * Calculates a transparent frontend demo compatibility score based on:
 * 1. Skill match (+12 to +18 pts)
 * 2. Availability / timetable match (+8 to +10 pts)
 * 3. Proficiency level (+4 to +8 pts)
 * Baseline is 60%, capped between 75% and 98%.
 * Note: Calculated purely via simple frontend heuristics (not AI-generated).
 */
export const calculateCompatibility = (
  requestedSkillName = '',
  peer = null,
  availabilityMatch = true
) => {
  let score = 65;

  // 1. Skill match
  if (requestedSkillName && peer) {
    if (doesStudentOfferSkill(peer, requestedSkillName)) {
      score += 18;
    } else {
      score += 8;
    }
  } else if (requestedSkillName && typeof peer === 'string') {
    const req = normalizeText(requestedSkillName);
    const pSkill = normalizeText(peer);
    if (req && pSkill && (req.includes(pSkill) || pSkill.includes(req))) {
      score += 15;
    } else {
      score += 8;
    }
  } else {
    score += 12;
  }

  // 2. Availability match
  if (availabilityMatch) {
    score += 9;
  }

  // 3. Proficiency level
  const level = peer?.proficiencyLevel || 'Intermediate';
  if (level === 'Advanced') {
    score += 6;
  } else if (level === 'Intermediate') {
    score += 4;
  } else {
    score += 2;
  }

  return Math.min(Math.max(score, 75), 98);
};
