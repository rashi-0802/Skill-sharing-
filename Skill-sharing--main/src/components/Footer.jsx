import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Sparkles } from 'lucide-react';
import './Footer.css';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderWavyLink = (to, text) => (
    <li>
      <Link to={to} onClick={scrollToTop} className="footer-nav-link">
        <span className="footer-link-text">{text}</span>
        <svg className="footer-wavy-underline" viewBox="0 0 100 8" preserveAspectRatio="none" aria-hidden="true">
          <path d="M 0,4 Q 25,0 50,4 T 100,4" fill="none" stroke="#FF8FB1" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      </Link>
    </li>
  );

  return (
    <footer className="footer">


      <div className="container footer-container">
        {/* Brand Column */}
        <div className="footer-brand">
          <Link to="/" onClick={scrollToTop} className="footer-logo">
            <div className="footer-logo-box">
              <BookOpen size={20} />
            </div>
            <span className="footer-logo-text">4S</span>
          </Link>
          <p className="footer-desc">
            Student Skill Sharing System — A peer-to-peer campus platform where students can teach what they know and master what they want to develop.
          </p>
          <div className="footer-badge">
            <Sparkles size={14} className="text-secondary" />
            <span>Academic DBMS Project · College Edition</span>
          </div>
        </div>
        
        {/* Navigation Grid */}
        <div className="footer-links-grid">
          <div className="footer-col">
            <h4 className="footer-heading">Platform</h4>
            <ul className="footer-list">
              {renderWavyLink('/explore', 'Explore Skills')}
              {renderWavyLink('/requests', 'Learning Requests')}
              {renderWavyLink('/matches', 'Skill Matches')}
              {renderWavyLink('/sessions', 'Sessions')}
            </ul>
          </div>

          <div className="footer-col">
            <h4 className="footer-heading">Categories</h4>
            <ul className="footer-list">
              {renderWavyLink('/explore', 'Programming')}
              {renderWavyLink('/explore', 'Web Development')}
              {renderWavyLink('/explore', 'UI/UX Design')}
              {renderWavyLink('/explore', 'Data Science')}
              {renderWavyLink('/explore', 'Communication')}
            </ul>
          </div>

          <div className="footer-col">
            <h4 className="footer-heading">Student Portal</h4>
            <ul className="footer-list">
              {renderWavyLink('/register', 'Create Account')}
              {renderWavyLink('/dashboard', 'Dashboard')}
              {renderWavyLink('/my-skills', 'My Skills')}
              {renderWavyLink('/achievements', 'Achievements')}
              {renderWavyLink('/ratings', 'Ratings & Feedback')}
            </ul>
          </div>
        </div>
      </div>

      {/* Footer Bottom Bar */}
      <div className="footer-bottom">
        <div className="container footer-bottom-container">
          <p className="footer-copyright">
            &copy; {new Date().getFullYear()} 4S – Student Skill Sharing System. Designed for university peer collaboration.
          </p>
          <div className="footer-bottom-links">
            <span className="footer-tag">Peer Learning · Campus Community · Zero Cost</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
