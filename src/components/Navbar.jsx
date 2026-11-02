import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  BookOpen,
  Menu,
  X,
  ArrowRight,
  User,
  LogOut,
  LayoutDashboard,
  Calendar,
  MessageSquare,
  Users,
  Clock
} from 'lucide-react';
import { useAuth } from '../utils/auth.js';
import { triggerMangaPanelWipe } from './MangaPanelWipe.jsx';
import { resetScrollToTop } from '../utils/useScrollToTop.js';
import SoundToggle from './SoundToggle.jsx';
import './Navbar.css';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, loggedIn, logoutUser, conversations, achievements } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navbarRef = useRef(null);

  // Compute Skill Master reward: 8 or more badges unlocked
  const unlockedBadgesCount = (achievements || []).filter((a) => a.unlocked).length;
  const isSkillMaster = unlockedBadgesCount >= 8;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on click outside or on Escape key
  useEffect(() => {
    if (!mobileMenuOpen) return;
    const handleOutsideClick = (e) => {
      if (navbarRef.current && !navbarRef.current.contains(e.target)) {
        setMobileMenuOpen(false);
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('touchstart', handleOutsideClick);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('touchstart', handleOutsideClick);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [mobileMenuOpen]);

  const unreadMessagesCount = (conversations || []).reduce(
    (acc, c) => acc + (c.unreadCount || 0),
    0
  );

  const handleHowItWorksClick = (e) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    if (location.pathname !== '/') {
      navigate('/#how-it-works');
      setTimeout(() => {
        const el = document.getElementById('how-it-works');
        if (el) el.scrollIntoView({ behavior: 'instant' });
      }, 50);
    } else {
      const el = document.getElementById('how-it-works');
      if (el) el.scrollIntoView({ behavior: 'instant' });
    }
  };

  const handleHomeClick = (e) => {
    setMobileMenuOpen(false);
    triggerMangaPanelWipe();
    resetScrollToTop();
    if (location.pathname === '/') {
      e.preventDefault();
      resetScrollToTop();
    }
  };

  const handleNavClick = () => {
    setMobileMenuOpen(false);
    triggerMangaPanelWipe();
    resetScrollToTop();
  };

  const handleLogout = () => {
    logoutUser();
    setMobileMenuOpen(false);
    resetScrollToTop();
    navigate('/');
  };

  return (
    <header className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`} ref={navbarRef}>
      <div className="navbar-container">
        {/* ZONE 1 (left): Brand block, flex-shrink: 0 */}
        <div className="navbar-logo-wrap">
          <Link
            to="/"
            onClick={handleHomeClick}
            className="navbar-logo-card"
            aria-label="4S – Student Skill Sharing System"
          >
            <div className="logo-icon-box">
              <BookOpen className="logo-icon" size={22} />
            </div>
            <div className="logo-text-group">
              <span className="logo-name">4S</span>
              <span className="logo-subtext">Student Skill Sharing System</span>
            </div>
          </Link>
        </div>

        {/* ZONE 2 (centre): Nav links list (>=1100px) or Hamburger button (<1100px) */}
        <div className="navbar-zone-center">
          <nav className="navbar-links" aria-label="Main Navigation">
            <Link
              to="/"
              onClick={handleHomeClick}
              className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
            >
              <span className="nav-link-text">Home</span>
              <svg className="nav-wavy-underline" viewBox="0 0 100 8" preserveAspectRatio="none" aria-hidden="true">
                <path d="M 0,4 Q 25,0 50,4 T 100,4" fill="none" stroke="#3A86FF" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            </Link>
            <Link
              to="/explore"
              onClick={handleNavClick}
              className={`nav-link ${location.pathname === '/explore' ? 'active' : ''}`}
            >
              <span className="nav-link-text">Explore Skills</span>
              <svg className="nav-wavy-underline" viewBox="0 0 100 8" preserveAspectRatio="none" aria-hidden="true">
                <path d="M 0,4 Q 25,0 50,4 T 100,4" fill="none" stroke="#3A86FF" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            </Link>

            {!loggedIn && (
              <a
                href="#how-it-works"
                onClick={handleHowItWorksClick}
                className="nav-link"
              >
                <span className="nav-link-text">How It Works</span>
                <svg className="nav-wavy-underline" viewBox="0 0 100 8" preserveAspectRatio="none" aria-hidden="true">
                  <path d="M 0,4 Q 25,0 50,4 T 100,4" fill="none" stroke="#3A86FF" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
              </a>
            )}

            {loggedIn && (
              <>
                <Link
                  to="/matches"
                  onClick={handleNavClick}
                  className={`nav-link ${location.pathname === '/matches' ? 'active' : ''}`}
                >
                  <span className="nav-link-text">Matches</span>
                  <svg className="nav-wavy-underline" viewBox="0 0 100 8" preserveAspectRatio="none" aria-hidden="true">
                    <path d="M 0,4 Q 25,0 50,4 T 100,4" fill="none" stroke="#3A86FF" strokeWidth="2.5" strokeLinecap="round" />
                  </svg>
                </Link>
                <Link
                  to="/sessions"
                  onClick={handleNavClick}
                  className={`nav-link ${location.pathname === '/sessions' ? 'active' : ''}`}
                >
                  <span className="nav-link-text">Sessions</span>
                  <svg className="nav-wavy-underline" viewBox="0 0 100 8" preserveAspectRatio="none" aria-hidden="true">
                    <path d="M 0,4 Q 25,0 50,4 T 100,4" fill="none" stroke="#3A86FF" strokeWidth="2.5" strokeLinecap="round" />
                  </svg>
                </Link>
                <Link
                  to="/availability"
                  onClick={handleNavClick}
                  className={`nav-link ${location.pathname === '/availability' ? 'active' : ''}`}
                >
                  <span className="nav-link-text">Availability</span>
                  <svg className="nav-wavy-underline" viewBox="0 0 100 8" preserveAspectRatio="none" aria-hidden="true">
                    <path d="M 0,4 Q 25,0 50,4 T 100,4" fill="none" stroke="#3A86FF" strokeWidth="2.5" strokeLinecap="round" />
                  </svg>
                </Link>
                <Link
                  to="/messages"
                  onClick={handleNavClick}
                  className={`nav-link ${
                    location.pathname === '/messages' ? 'active' : ''
                  }`}
                >
                  <span className="nav-link-text">Messages</span>
                  {unreadMessagesCount > 0 && (
                    <span className="nav-unread-dot" aria-hidden="true"></span>
                  )}
                  <svg className="nav-wavy-underline" viewBox="0 0 100 8" preserveAspectRatio="none" aria-hidden="true">
                    <path d="M 0,4 Q 25,0 50,4 T 100,4" fill="none" stroke="#3A86FF" strokeWidth="2.5" strokeLinecap="round" />
                  </svg>
                </Link>
                <Link
                  to="/dashboard"
                  onClick={handleNavClick}
                  className={`nav-link ${location.pathname === '/dashboard' ? 'active' : ''}`}
                >
                  <span className="nav-link-text">Dashboard</span>
                  <svg className="nav-wavy-underline" viewBox="0 0 100 8" preserveAspectRatio="none" aria-hidden="true">
                    <path d="M 0,4 Q 25,0 50,4 T 100,4" fill="none" stroke="#3A86FF" strokeWidth="2.5" strokeLinecap="round" />
                  </svg>
                </Link>
              </>
            )}
          </nav>

          {/* Simple hamburger button shown below 1100px in Zone 2 */}
          <button
            className="navbar-hamburger-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            <span className="navbar-hamburger-label">Menu</span>
          </button>
        </div>

        {/* ZONE 3 (right): Action group (sound toggle, chat icon with badge, profile chip, logout button) */}
        <div className="navbar-actions">
          <div className="navbar-sound-toggle-desktop">
            <SoundToggle variant="icon" />
          </div>

          {loggedIn ? (
            <div className="navbar-user-actions-group">
              <Link
                to="/messages"
                onClick={handleNavClick}
                className="navbar-icon-btn navbar-chat-btn"
                title="Direct Messages"
                aria-label={`Direct Messages (${unreadMessagesCount} unread)`}
              >
                <MessageSquare size={17} />
                {unreadMessagesCount > 0 && (
                  <span className="navbar-unread-badge">
                    {unreadMessagesCount}
                  </span>
                )}
              </Link>

              <Link
                to="/profile"
                onClick={handleNavClick}
                className={`navbar-user-chip ${isSkillMaster ? 'navbar-chip-skill-master' : ''}`}
                title={isSkillMaster ? 'Student Profile · Skill Master (8 Badges)' : 'Student Profile'}
              >
                <div className={`navbar-avatar ${isSkillMaster ? 'avatar-gold-ring' : 'avatar-ink-ring'}`}>
                  {user?.name ? user.name.split(' ').map((n) => n[0]).join('') : 'ST'}
                </div>
                <div className="navbar-user-info-stacked">
                  <span className="navbar-username">{user?.name ? user.name.split(' ')[0] : 'Profile'}</span>
                  {isSkillMaster && (
                    <span className="navbar-skill-master-title">Skill Master</span>
                  )}
                </div>
              </Link>

              <button
                onClick={handleLogout}
                className="navbar-icon-btn navbar-logout-btn"
                title="Sign out"
                aria-label="Sign out"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <Link to="/register" onClick={handleNavClick} className="btn btn-primary get-started-btn">
              <span>Get Started</span>
              <ArrowRight size={16} />
            </Link>
          )}
        </div>
      </div>

      {/* Dropdown panel for mobile & tablet (<1100px) */}
      {mobileMenuOpen && (
        <div className="mobile-drawer">
          <div className="mobile-drawer-content">
            <Link
              to="/"
              onClick={handleHomeClick}
              className={`mobile-nav-link ${location.pathname === '/' ? 'active' : ''}`}
            >
              Home
            </Link>
            <Link
              to="/explore"
              onClick={handleNavClick}
              className={`mobile-nav-link ${location.pathname === '/explore' ? 'active' : ''}`}
            >
              Explore Skills
            </Link>

            {!loggedIn && (
              <a
                href="#how-it-works"
                onClick={handleHowItWorksClick}
                className="mobile-nav-link"
              >
                How It Works
              </a>
            )}

            {loggedIn && (
              <>
                <Link
                  to="/matches"
                  onClick={handleNavClick}
                  className={`mobile-nav-link ${location.pathname === '/matches' ? 'active' : ''}`}
                >
                  Matches
                </Link>
                <Link
                  to="/sessions"
                  onClick={handleNavClick}
                  className={`mobile-nav-link ${location.pathname === '/sessions' ? 'active' : ''}`}
                >
                  Sessions
                </Link>
                <Link
                  to="/availability"
                  onClick={handleNavClick}
                  className={`mobile-nav-link ${
                    location.pathname === '/availability' ? 'active' : ''
                  }`}
                >
                  Availability
                </Link>
                <Link
                  to="/messages"
                  onClick={handleNavClick}
                  className={`mobile-nav-link ${location.pathname === '/messages' ? 'active' : ''}`}
                >
                  Messages {unreadMessagesCount > 0 ? `(${unreadMessagesCount})` : ''}
                </Link>
                <Link
                  to="/dashboard"
                  onClick={handleNavClick}
                  className={`mobile-nav-link ${location.pathname === '/dashboard' ? 'active' : ''}`}
                >
                  Dashboard
                </Link>
              </>
            )}

            <div className="mobile-nav-divider"></div>

            <div className="mobile-actions">
              <div style={{ marginBottom: '0.25rem' }}>
                <SoundToggle variant="chip" />
              </div>
              {loggedIn ? (
                <>
                  <Link
                    to="/dashboard"
                    onClick={handleNavClick}
                    className="btn btn-primary mobile-btn"
                  >
                    <LayoutDashboard size={16} />
                    <span>My Student Dashboard</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="btn btn-outline mobile-btn"
                  >
                    <LogOut size={16} />
                    <span>Log out ({user?.name || 'User'})</span>
                  </button>
                </>
              ) : (
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn btn-primary mobile-btn"
                >
                  <span>Get Started</span>
                  <ArrowRight size={16} />
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
