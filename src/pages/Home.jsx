import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import {
  BookOpen,
  Users,
  Search,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Clock,
  MessageSquare,
  Video,
  Code,
  Globe,
  Palette,
  Database,
  MessageCircle,
  Camera,
  Star,
  GraduationCap,
  Calendar,
  ShieldCheck,
  Share2,
  ChevronRight,
  Award
} from 'lucide-react';
import MangaCard from '../components/MangaCard.jsx';
import MatchFoundAnimation from '../components/MatchFoundAnimation.jsx';
import SkillBuddies from '../components/SkillBuddies.jsx';
import Leaderboard from '../components/Leaderboard.jsx';
import SkillMasterRewardModal from '../components/SkillMasterRewardModal.jsx';
import { useAuth } from '../utils/auth.js';
import { getStoredUser, saveUser } from '../utils/auth.js';
import { getCategoryAccentColor } from '../utils/categoryColors.js';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const shouldReduceMotion = useReducedMotion();
  const { user, achievements } = useAuth();
  const [showRewardModal, setShowRewardModal] = useState(false);

  // Trigger rules: When student has 8+ badges and has never seen celebration popup (skillMasterShown flag)
  useEffect(() => {
    const unlockedCount = (achievements || []).filter((a) => a.unlocked).length;
    const currentUser = getStoredUser();
    if (unlockedCount >= 8 && !currentUser.skillMasterShown) {
      setShowRewardModal(true);
    }
  }, [achievements]);

  const handleCloseRewardModal = () => {
    setShowRewardModal(false);
    const currentUser = getStoredUser();
    currentUser.skillMasterShown = true;
    saveUser(currentUser);
  };

  // Headline slam-in animation per word variants (clean final state without blur)
  const wordVariants = {
    hidden: shouldReduceMotion
      ? { opacity: 1, scale: 1, rotate: 0, y: 0 }
      : { opacity: 0, scale: 1.3, rotate: -4, y: -10 },
    visible: (i) => ({
      opacity: 1,
      scale: 1,
      rotate: 0,
      y: 0,
      transition: shouldReduceMotion
        ? { duration: 0 }
        : {
            type: 'spring',
            stiffness: 420,
            damping: 15,
            delay: 0.12 * i + 0.25
          }
    })
  };

  const heroShakeVariants = {
    initial: { x: 0, y: 0 },
    animate: shouldReduceMotion
      ? {}
      : {
          x: [0, -2, 2, -1, 1, 0],
          y: [0, 1, -1, 1, 0, 0],
          transition: { delay: 0.5, duration: 0.28 }
        }
  };

  // How it Works Steps Data
  const steps = [
    {
      number: '01',
      title: 'Create Your Profile',
      desc: 'Set up your student account with your university department. List the skills you are confident to teach and the skills you are eager to learn.',
      details: [
        'Tag your current skill level (Beginner, Intermediate, Advanced)',
        'Specify your free weekly timetable slots',
        'Add past projects or coursework highlights'
      ]
    },
    {
      number: '02',
      title: 'Find Your Match',
      desc: 'Our peer algorithm connects you with students whose teaching skills match your learning wishlist, enabling frictionless mutual knowledge exchange.',
      details: [
        'Browse verified student peers across campus',
        'Filter by category, rating, and campus year',
        'Send learning requests with one tap'
      ]
    },
    {
      number: '03',
      title: 'Start Learning',
      desc: 'Schedule 1-on-1 collaborative sessions, share code and design files, exchange real-time feedback, and earn campus skill achievements.',
      details: [
        'Flexible 30 to 60-minute study sessions',
        'Integrated notes, checklists & video links',
        'Leave reciprocal ratings and recommendations'
      ]
    }
  ];

  // Popular Categories Data
  const categories = [
    {
      id: 'programming',
      name: 'Programming',
      icon: Code,
      colorClass: 'icon-box-indigo',
      studentsCount: '180+ Mentors',
      description: 'Master core computational thinking, object-oriented concepts, and algorithms.',
      skills: ['Python', 'C++', 'Java', 'DSA', 'OOP']
    },
    {
      id: 'web-development',
      name: 'Web Development',
      icon: Globe,
      colorClass: 'icon-box-blue',
      studentsCount: '240+ Mentors',
      description: 'Build modern responsive applications from frontend UI to scalable backend APIs.',
      skills: ['React', 'JavaScript', 'HTML/CSS', 'Node.js', 'Tailwind']
    },
    {
      id: 'data-science',
      name: 'Data Science',
      icon: Database,
      colorClass: 'icon-box-indigo',
      studentsCount: '115+ Mentors',
      description: 'Analyze real datasets, write complex SQL queries, and build predictive ML models.',
      skills: ['Machine Learning', 'Pandas', 'SQL', 'Data Viz', 'NumPy']
    },
    {
      id: 'ui-ux-design',
      name: 'UI/UX Design',
      icon: Palette,
      colorClass: 'icon-box-purple',
      studentsCount: '130+ Mentors',
      description: 'Craft user-centric interfaces, design systems, visual assets, and prototypes in Figma.',
      skills: ['UI/UX', 'Figma', 'Wireframing', 'Prototyping', 'Design Systems']
    },
    {
      id: 'graphic-design',
      name: 'Graphic Design',
      icon: Sparkles,
      colorClass: 'icon-box-purple',
      studentsCount: '85+ Mentors',
      description: 'Visual branding, digital vector illustration, posters, typography, and marketing assets.',
      skills: ['Illustrator', 'Photoshop', 'Canva', 'Branding', 'Vector Art']
    },
    {
      id: 'communication',
      name: 'Communication',
      icon: MessageCircle,
      colorClass: 'icon-box-blue',
      studentsCount: '95+ Mentors',
      description: 'Refine campus presentations, group discussions, and technical interview confidence.',
      skills: ['Public Speaking', 'Interview Prep', 'Debating', 'Resume Review']
    },
    {
      id: 'photography',
      name: 'Photography',
      icon: Camera,
      colorClass: 'icon-box-indigo',
      studentsCount: '75+ Mentors',
      description: 'Learn camera exposure controls, lighting techniques, and digital darkroom editing.',
      skills: ['DSLR Basics', 'Adobe Lightroom', 'Composition', 'Color Grading']
    }
  ];

  // Why Choose 4S Data
  const whyPoints = [
    {
      title: 'Peer-to-Peer Learning',
      desc: 'Learn directly from classmates who recently aced the exact same courses. They explain concepts with relatable student context and zero academic intimidation.',
      highlight: 'Relatable, student-to-student explanations',
      icon: GraduationCap,
      colorClass: 'icon-box-indigo'
    },
    {
      title: 'Effortless Skill Discovery',
      desc: 'Explore diverse abilities beyond your departmental syllabus. Cross-pollinate ideas with engineers, designers, business majors, and digital creators across campus.',
      highlight: 'Discover skills outside your core syllabus',
      icon: Search,
      colorClass: 'icon-box-purple'
    },
    {
      title: 'Flexible Study Sessions',
      desc: 'Coordinate 30 or 60-minute sessions that fit into your timetable gaps, hostel study circles, or weekend project sprints without rigid commitments.',
      highlight: 'Tailored around campus lectures & exam schedules',
      icon: Calendar,
      colorClass: 'icon-box-blue'
    },
    {
      title: 'Thriving Campus Community',
      desc: 'Build meaningful connections across academic departments. Find hackathon teammates, exchange peer endorsements, and showcase verified achievements.',
      highlight: 'Inter-departmental networking & peer credentials',
      icon: Users,
      colorClass: 'icon-box-indigo'
    }
  ];

  return (
    <div className="home-container">
      {/* ------------------------------------------------------------------
          1. Hero Section
          ------------------------------------------------------------------ */}
      <section className="hero-section" id="hero">
        {/* Radiating Manga Speed Lines pulsing from centre */}
        <div className="manga-speed-lines" aria-hidden="true"></div>

        {/* Subtle Ambient Background Floating Orbs */}
        <div className="hero-ambient-shape shape-1 animate-float" aria-hidden="true"></div>
        <div className="hero-ambient-shape shape-2 animate-float-reverse" aria-hidden="true"></div>
        <div className="hero-ambient-shape shape-3 animate-float" aria-hidden="true"></div>

        {/* Decorative Floating Skill Stickers in loose orbit around hero */}
        <div className="hero-floating-badge badge-pos-1" aria-hidden="true" style={{ background: 'linear-gradient(135deg, rgba(58, 134, 255, 0.12), #ffffff 65%)' }}>
          <Code size={14} className="text-primary" />
          <span>Python</span>
        </div>
        <div className="hero-floating-badge badge-pos-2" aria-hidden="true" style={{ background: 'linear-gradient(135deg, rgba(46, 196, 182, 0.14), #ffffff 65%)' }}>
          <Globe size={14} className="text-teal-600" />
          <span>React</span>
        </div>
        <div className="hero-floating-badge badge-pos-3" aria-hidden="true" style={{ background: 'linear-gradient(135deg, rgba(255, 143, 177, 0.14), #ffffff 65%)' }}>
          <Palette size={14} className="text-secondary" />
          <span>UI Design</span>
        </div>
        <div className="hero-floating-badge badge-pos-4" aria-hidden="true" style={{ background: 'linear-gradient(135deg, rgba(255, 210, 63, 0.16), #ffffff 65%)' }}>
          <Video size={14} className="text-amber-600" />
          <span>Video Editing</span>
        </div>
        <div className="hero-floating-badge badge-pos-5" aria-hidden="true" style={{ background: 'linear-gradient(135deg, rgba(58, 134, 255, 0.12), #ffffff 65%)' }}>
          <Database size={14} className="text-primary" />
          <span>SQL</span>
        </div>
        <div className="hero-floating-badge badge-pos-6" aria-hidden="true" style={{ background: 'linear-gradient(135deg, rgba(46, 196, 182, 0.14), #ffffff 65%)' }}>
          <MessageCircle size={14} className="text-teal-600" />
          <span>Public Speaking</span>
        </div>

        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <motion.div
            className="hero-content"
            variants={heroShakeVariants}
            initial="initial"
            animate="animate"
          >
            {/* 1. HIGHEST VISUAL PRIORITY: MAIN BRAND LINE */}
            <div className="hero-brand-lockup">
              {/* Student Skill Sharing System with sunrise yellow swipe and dots */}
              <motion.div
                className="hero-brand-subtitle-wrap"
                initial={
                  shouldReduceMotion
                    ? { scale: 1, rotate: 0, opacity: 1, y: 0 }
                    : { scale: 1.25, rotate: -3, opacity: 0, y: -12 }
                }
                animate={{ scale: 1, rotate: 0, opacity: 1, y: 0 }}
                transition={
                  shouldReduceMotion
                    ? { duration: 0 }
                    : { duration: 0.45, ease: [0.34, 1.56, 0.64, 1], delay: 0.1 }
                }
              >
                <span className="hero-brand-subtitle-swipe" aria-hidden="true"></span>
                <span className="hero-brand-subtitle-text">
                  <span className="hero-initial-word">
                    <span className="hero-initial-letter">S<span className="hero-initial-dot dot-blue" aria-hidden="true"></span></span>tudent
                  </span>{' '}
                  <span className="hero-initial-word">
                    <span className="hero-initial-letter">S<span className="hero-initial-dot dot-pink" aria-hidden="true"></span></span>kill
                  </span>{' '}
                  <span className="hero-initial-word">
                    <span className="hero-initial-letter">S<span className="hero-initial-dot dot-yellow" aria-hidden="true"></span></span>haring
                  </span>{' '}
                  <span className="hero-initial-word">
                    <span className="hero-initial-letter">S<span className="hero-initial-dot dot-teal" aria-hidden="true"></span></span>ystem
                  </span>
                </span>
              </motion.div>
            </div>

            {/* Existing Headline: clean sharp multicolour gradient render for Peer to Peer Learning */}
            <h1 className="hero-title animate-fade-up stagger-1">
              <span className="hero-title-highlight hero-title-line">
                <motion.span custom={0} variants={wordVariants} initial="hidden" animate="visible" className="hero-slam-word">
                  Peer
                </motion.span>{' '}
                <motion.span custom={1} variants={wordVariants} initial="hidden" animate="visible" className="hero-slam-word">
                  to
                </motion.span>{' '}
                <motion.span custom={2} variants={wordVariants} initial="hidden" animate="visible" className="hero-slam-word">
                  Peer
                </motion.span>{' '}
                <motion.span custom={3} variants={wordVariants} initial="hidden" animate="visible" className="hero-slam-word">
                  Learning
                </motion.span>
              </span>
            </h1>

            {/* 2. SUBTLE TAGLINE: "LEARN TOGETHER" */}
            <motion.div
              className="hero-tagline-subtle"
              initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.45 }}
              aria-label="Learn Together"
            >
              <span className="hero-tagline-wing left" aria-hidden="true"></span>
              <span className="hero-tagline-sparkle" aria-hidden="true">✧</span>
              <span className="hero-tagline-text">LEARN TOGETHER</span>
              <span className="hero-tagline-sparkle" aria-hidden="true">✧</span>
              <span className="hero-tagline-wing right" aria-hidden="true"></span>
            </motion.div>

            <p className="hero-description animate-fade-up stagger-2">
              A peer-to-peer campus platform where students can teach what they know and master what they want to develop. One student can be both a teacher and a learner using the same account.
            </p>

            <div className="hero-cta-group animate-fade-up stagger-3">
              <Link to="/explore" className="btn btn-primary btn-lg hero-primary-btn btn-interactive">
                <span>Explore Skills</span>
                <ArrowRight size={18} />
              </Link>
              <Link to="/my-skills" className="btn btn-outline btn-lg hero-secondary-btn btn-interactive">
                <Share2 size={18} />
                <span>Share Your Skills</span>
              </Link>
            </div>

            <div className="hero-trust-bar animate-fade-up stagger-4">
              <div className="trust-item">
                <ShieldCheck size={16} className="text-primary" />
                <span>100% Student-to-Student</span>
              </div>
              <div className="trust-item">
                <Award size={16} className="text-secondary" />
                <span>Zero Subscription Fees</span>
              </div>
              <div className="trust-item">
                <GraduationCap size={16} className="text-accent" />
                <span>Verified University Campus Network</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ------------------------------------------------------------------
          2. How It Works (Three Steps)
          ------------------------------------------------------------------ */}
      <section className="how-it-works-section" id="how-it-works">
        <div className="container">
          <div className="section-header">
            <span className="section-kicker">Simple 3-Step Process</span>
            <h2 className="section-title">How 4S Works</h2>
            <p className="section-subtitle">
              Sharing and developing skills shouldn't be complicated. Our structured workflow connects you with the right study partner in minutes.
            </p>
          </div>

          <div className="steps-grid">
            {steps.map((step, index) => (
              <div
                key={step.number}
                className="step-card"
                onMouseEnter={() => setActiveStep(index)}
              >
                <div className="step-badge">{step.number}</div>
                <h3 className="step-title">{step.title}</h3>
                <p className="step-desc">{step.desc}</p>
                <ul className="step-detail-list">
                  {step.details.map((detail, dIdx) => (
                    <li key={dIdx} className="step-detail-item">
                      <span className="step-detail-bullet"></span>
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Interactive Flow Bar */}
          <div className="how-it-works-interactive">
            <div className="flow-step-buttons">
              {steps.map((step, index) => (
                <button
                  key={step.number}
                  className={`flow-btn ${activeStep === index ? 'active' : ''}`}
                  onClick={() => setActiveStep(index)}
                >
                  <span className="flow-num">{step.number}</span>
                  <span className="flow-label">{step.title}</span>
                </button>
              ))}
            </div>

            <div className="flow-detail-panel">
              <div className="flow-detail-content">
                <h4>
                  Step {steps[activeStep].number}: {steps[activeStep].title}
                </h4>
                <p>{steps[activeStep].desc}</p>
                <div className="flow-tags">
                  {steps[activeStep].details.map((d, i) => (
                    <span key={i} className="flow-tag">
                      <CheckCircle2 size={13} className="text-emerald-500" />
                      {d}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flow-action">
                <Link to="/register" className="btn btn-primary">
                  <span>Start Step {steps[activeStep].number}</span>
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------
          3. Skill Buddies Animated Showcase
          ------------------------------------------------------------------ */}
      <SkillBuddies />

      {/* ------------------------------------------------------------------
          4. Popular Skill Categories
          ------------------------------------------------------------------ */}
      <section className="categories-section">
        <div className="container">
          <div className="section-header">
            <span className="section-kicker">Diverse Campus Catalog</span>
            <h2 className="section-title">Popular Skill Categories</h2>
            <p className="section-subtitle">
              From competitive programming to digital product design and foreign languages — find students passionate about mentoring across all fields.
            </p>
          </div>

          <div className="categories-grid">
            {categories.map((cat) => {
              const IconComponent = cat.icon;
              return (
                <div key={cat.id} className="category-card">
                  <div className="category-top">
                    <div className={`category-icon-box ${cat.colorClass}`}>
                      <IconComponent size={24} />
                    </div>
                    <span className="category-count">{cat.studentsCount}</span>
                  </div>

                  <h3 className="category-name">{cat.name}</h3>
                  <p className="category-desc">{cat.description}</p>

                  <div className="category-skills-wrap">
                    {cat.skills.map((skill) => (
                      <span key={skill} className="category-skill-chip">
                        {skill}
                      </span>
                    ))}
                  </div>

                  <Link
                    to={`/explore?category=${encodeURIComponent(cat.name)}`}
                    className="category-action-link"
                  >
                    <span>Browse {cat.name}</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              );
            })}
          </div>

          <div className="categories-footer">
            <Link to="/explore" className="btn btn-outline">
              <span>View All 320+ Skills</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------
          5. Campus Leaderboard (Ranked by badges earned & teaching reviews)
          ------------------------------------------------------------------ */}
      <Leaderboard />

      {/* ------------------------------------------------------------------
          6. Why Choose 4S (Benefits)
          ------------------------------------------------------------------ */}
      <section className="why-section">
        <div className="container">
          <div className="section-header">
            <span className="section-kicker">Platform Advantages</span>
            <h2 className="section-title">Why Choose 4S</h2>
            <p className="section-subtitle">
              Designed specifically for college life — breaking down departmental silos and making knowledge sharing accessible to every student.
            </p>
          </div>

          <div className="why-grid">
            {whyPoints.map((point, index) => {
              const IconComponent = point.icon;
              return (
                <div key={index} className="why-card">
                  <div className={`why-icon-box ${point.colorClass}`}>
                    <IconComponent size={26} />
                  </div>
                  <div className="why-content">
                    <h3>{point.title}</h3>
                    <p>{point.desc}</p>
                    <span className="why-highlight">
                      <CheckCircle2 size={15} />
                      <span>{point.highlight}</span>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
