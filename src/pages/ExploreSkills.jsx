import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import {
  Search,
  Filter,
  X,
  Star,
  Clock,
  User,
  GraduationCap,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  BookOpen,
  Calendar,
  Send,
  MessageSquare
} from 'lucide-react';
import {
  ALL_CATEGORIES,
  SKILL_LEVELS,
  AVAILABILITY_OPTIONS,
  getCatalogSkills
} from '../utils/mockData.js';
import { useAuth, submitLearningRequest } from '../utils/auth.js';
import MangaCard from '../components/MangaCard.jsx';
import PowerLevelMeter from '../components/PowerLevelMeter.jsx';
import { getCategoryAccentColor } from '../utils/categoryColors.js';
import './ExploreSkills.css';

const ExploreSkills = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  // URL query params initialization
  const initialCategoryQuery = searchParams.get('category');
  const normalizedCategory = initialCategoryQuery
    ? ALL_CATEGORIES.find((c) => c.toLowerCase() === initialCategoryQuery.toLowerCase()) || 'All'
    : 'All';

  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [selectedCategory, setSelectedCategory] = useState(normalizedCategory);
  const [selectedLevel, setSelectedLevel] = useState('All');
  const [selectedAvailability, setSelectedAvailability] = useState('All');

  // Modals state
  const [profileModalSkill, setProfileModalSkill] = useState(null);
  const [requestModalSkill, setRequestModalSkill] = useState(null);
  const [requestNote, setRequestNote] = useState('');
  const [requestTimeSlot, setRequestTimeSlot] = useState('Weekday Evening');
  const [toastMessage, setToastMessage] = useState(null);

  // Sync category if URL param changes
  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) {
      const match = ALL_CATEGORIES.find(
        (c) => c.toLowerCase() === cat.toLowerCase().replace('-', ' ') || c.toLowerCase() === cat.toLowerCase()
      );
      if (match) setSelectedCategory(match);
    }
  }, [searchParams]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const skillsList = useMemo(() => getCatalogSkills(), []);

  // Filter skills based on search term, category, level, and availability
  const filteredSkills = useMemo(() => {
    return skillsList.filter((skill) => {
      // 1. Search Query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = skill.name.toLowerCase().includes(query);
        const matchesDesc = skill.description.toLowerCase().includes(query);
        const matchesMentor = skill.mentorName.toLowerCase().includes(query);
        const matchesTopics = skill.topics?.some((t) => t.toLowerCase().includes(query));
        if (!matchesName && !matchesDesc && !matchesMentor && !matchesTopics) {
          return false;
        }
      }

      // 2. Category
      if (selectedCategory !== 'All') {
        if (selectedCategory === 'Programming') {
          // Programming also includes C and Python if viewed broadly, or exact category
          if (skill.category !== 'Programming' && skill.category !== 'C' && skill.category !== 'Python') {
            return false;
          }
        } else if (skill.category.toLowerCase() !== selectedCategory.toLowerCase()) {
          return false;
        }
      }

      // 3. Level
      if (selectedLevel !== 'All' && skill.level !== selectedLevel) {
        return false;
      }

      // 4. Availability
      if (selectedAvailability !== 'All') {
        if (selectedAvailability === 'Flexible') {
          if (skill.availabilityType !== 'Flexible') return false;
        } else if (skill.availabilityType !== selectedAvailability) {
          return false;
        }
      }

      return true;
    });
  }, [skillsList, searchQuery, selectedCategory, selectedLevel, selectedAvailability]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedLevel('All');
    setSelectedAvailability('All');
    setSearchParams({});
  };

  const handleOpenRequestModal = (skill) => {
    setRequestModalSkill(skill);
    setRequestNote(`Hi ${skill.mentorName.split(' ')[0]}, I would love to learn "${skill.name}" from you. I want to build a solid foundation for my coursework.`);
    setRequestTimeSlot(skill.availability.includes('Weekend') ? 'Weekend Morning' : 'Weekday Evening');
  };

  const handleSubmitRequest = (e) => {
    e.preventDefault();
    if (!requestModalSkill) return;

    // Submit request via auth helper
    submitLearningRequest({
      skillId: requestModalSkill.id,
      skillName: requestModalSkill.name,
      category: requestModalSkill.category,
      mentorName: requestModalSkill.mentorName,
      mentorAvatar: requestModalSkill.mentorAvatar,
      requestedBy: user.name,
      userDepartment: user.department,
      timeSlot: requestTimeSlot,
      note: requestNote
    });

    const targetMentor = requestModalSkill.mentorName;
    setRequestModalSkill(null);
    showToast(`Learning request for "${requestModalSkill.name}" sent to ${targetMentor}!`);
  };

  return (
    <div className="explore-page">
      <div className="container">
        {/* Floating Toast Notification */}
        {toastMessage && (
          <div
            style={{
              position: 'fixed',
              bottom: '24px',
              right: '24px',
              backgroundColor: '#1e1b4b',
              color: '#ffffff',
              padding: '12px 20px',
              borderRadius: '8px',
              boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              zIndex: 9999,
              fontSize: '14px',
              fontWeight: 500
            }}
          >
            <CheckCircle2 size={18} className="text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Header Section */}
        <div className="explore-header-section">
          <span className="explore-kicker">University Knowledge Hub</span>
          <h1 className="explore-title">Explore Campus Skills</h1>
          <p className="explore-subtitle">
            Search peer-to-peer skills offered by fellow students across departments. Request a study session or exchange knowledge for free.
          </p>
        </div>

        {/* Search & Control Filter Bar */}
        <div className="explore-control-card">
          {/* Main Search Input */}
          <div className="search-input-box">
            <Search size={20} className="search-icon-left" />
            <input
              type="text"
              className="explore-search-input"
              placeholder="Search by skill name (e.g. Python, React, C, Figma, SQL, Public Speaking) or student mentor..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                type="button"
                className="search-clear-btn"
                onClick={() => setSearchQuery('')}
                aria-label="Clear search"
              >
                <X size={18} />
              </button>
            )}
          </div>

          {/* Category Filter Pills Bar */}
          <div className="category-filter-bar">
            {ALL_CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                className={`category-pill-btn ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Secondary Filters: Level & Availability */}
          <div className="secondary-filters-row">
            <div className="filter-selectors-group">
              <div className="filter-select-wrapper">
                <span className="font-semibold text-slate-700">Level:</span>
                <select
                  className="filter-select"
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(e.target.value)}
                >
                  {SKILL_LEVELS.map((lvl) => (
                    <option key={lvl} value={lvl}>
                      {lvl === 'All' ? 'All Skill Levels' : lvl}
                    </option>
                  ))}
                </select>
              </div>

              <div className="filter-select-wrapper">
                <span className="font-semibold text-slate-700">Availability:</span>
                <select
                  className="filter-select"
                  value={selectedAvailability}
                  onChange={(e) => setSelectedAvailability(e.target.value)}
                >
                  {AVAILABILITY_OPTIONS.map((avail) => (
                    <option key={avail} value={avail}>
                      {avail === 'All' ? 'Any Availability' : avail}
                    </option>
                  ))}
                </select>
              </div>

              {(searchQuery || selectedCategory !== 'All' || selectedLevel !== 'All' || selectedAvailability !== 'All') && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="btn btn-sm btn-ghost text-primary font-semibold"
                >
                  <X size={14} />
                  <span>Reset Filters</span>
                </button>
              )}
            </div>

            <div className="filter-results-count">
              Showing <strong>{filteredSkills.length}</strong> {filteredSkills.length === 1 ? 'skill' : 'skills'}
            </div>
          </div>
        </div>

        {/* Skills Cards Grid */}
        {filteredSkills.length > 0 ? (
          <div className="explore-skills-grid">
            {filteredSkills.map((skill, index) => (
              <MangaCard
                key={skill.id}
                index={index}
                accentColor={getCategoryAccentColor(skill.category, index)}
                cornerLabel={skill.category}
                className="explore-skill-card"
              >
                <div>
                  <div className="skill-card-top-tags">
                    <span className="skill-category-badge">{skill.category}</span>
                    <PowerLevelMeter level={skill.level} />
                  </div>

                  <h3 className="skill-card-title">{skill.name}</h3>
                  <p className="skill-card-desc">{skill.description}</p>

                  {/* Mentor Profile Snapshot */}
                  <div className="skill-mentor-box">
                    <div className="mentor-profile-left">
                      <div className={`mentor-avatar ${skill.avatarBg}`}>
                        {skill.mentorAvatar}
                      </div>
                      <div className="mentor-text-info">
                        <h4>{skill.mentorName}</h4>
                        <p>{skill.mentorDept}</p>
                      </div>
                    </div>
                    <div className="mentor-rating-badge">
                      <Star size={12} fill="#b45309" />
                      <span>{skill.mentorRating}</span>
                    </div>
                  </div>

                  {/* Availability */}
                  <div className="skill-availability-row">
                    <Clock size={14} className="text-primary" />
                    <span>Availability: <strong>{skill.availability}</strong></span>
                  </div>
                </div>

                {/* Actions: View Profile & Request to Learn */}
                <div className="skill-card-actions">
                  <button
                    type="button"
                    onClick={() => setProfileModalSkill(skill)}
                    className="btn btn-sm btn-outline"
                  >
                    <span>View Profile</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleOpenRequestModal(skill)}
                    className="btn btn-sm btn-primary btn-request-learn"
                  >
                    <Send size={13} />
                    <span>Request to Learn</span>
                  </button>
                </div>
              </MangaCard>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="explore-empty-state">
            <div className="empty-icon-wrap">
              <Search size={32} />
            </div>
            <h3 className="empty-title">No Matching Skills Found</h3>
            <p className="empty-desc">
              We couldn't find any student skills matching "{searchQuery || selectedCategory}". Try searching with different keywords, selecting another category, or resetting your filters.
            </p>
            <button
              type="button"
              onClick={handleResetFilters}
              className="btn btn-primary"
            >
              <span>Reset All Filters</span>
            </button>
          </div>
        )}
      </div>

      {/* ------------------------------------------------------------------
          Modal 1: View Mentor & Skill Profile
          ------------------------------------------------------------------ */}
      {profileModalSkill && (
        <div className="modal-overlay" onClick={() => setProfileModalSkill(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Student Mentor Profile</h3>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setProfileModalSkill(null)}
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>

            <div className="modal-body">
              {/* Mentor Header */}
              <div className="flex items-center gap-4">
                <div className={`mentor-avatar ${profileModalSkill.avatarBg}`} style={{ width: '3.5rem', height: '3.5rem', fontSize: '1.25rem' }}>
                  {profileModalSkill.mentorAvatar}
                </div>
                <div>
                  <h4 className="text-lg font-bold text-slate-900">{profileModalSkill.mentorName}</h4>
                  <p className="text-sm text-muted">{profileModalSkill.mentorDept}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="flex items-center text-amber-500 font-bold text-xs">
                      <Star size={13} fill="#f59e0b" />
                      <span className="ml-1 text-slate-800">{profileModalSkill.mentorRating} Rating</span>
                    </span>
                    <span className="text-xs text-muted">· {profileModalSkill.sessionsDelivered} sessions delivered</span>
                  </div>
                </div>
              </div>

              {/* Skill Details */}
              <div style={{ backgroundColor: '#f8fafc', padding: '1rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <span className="skill-category-badge">{profileModalSkill.category}</span>
                  <PowerLevelMeter level={profileModalSkill.level} />
                </div>
                <h4 className="text-base font-bold mt-2 text-slate-900">{profileModalSkill.name}</h4>
                <p className="text-sm text-muted mt-1">{profileModalSkill.description}</p>
              </div>

              {/* Topics Covered */}
              <div>
                <h5 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">Key Topics Covered:</h5>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  {profileModalSkill.topics?.map((topic, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-slate-700">
                      <CheckCircle2 size={16} className="text-primary flex-shrink-0" />
                      <span>{topic}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Timing */}
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Clock size={16} className="text-primary" />
                <span>Preferred Timetable: <strong>{profileModalSkill.availability}</strong></span>
              </div>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => setProfileModalSkill(null)}
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  const s = profileModalSkill;
                  setProfileModalSkill(null);
                  handleOpenRequestModal(s);
                }}
              >
                <Send size={14} />
                <span>Request to Learn</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------
          Modal 2: Request to Learn Form
          ------------------------------------------------------------------ */}
      {requestModalSkill && (
        <div className="modal-overlay" onClick={() => setRequestModalSkill(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <form onSubmit={handleSubmitRequest}>
              <div className="modal-header">
                <h3>Request to Learn</h3>
                <button
                  type="button"
                  className="modal-close-btn"
                  onClick={() => setRequestModalSkill(null)}
                  aria-label="Close modal"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="modal-body">
                {/* Skill summary box */}
                <div style={{ backgroundColor: '#f8fafc', padding: '0.875rem 1rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)' }}>
                  <p className="text-xs text-muted">You are requesting a 1-on-1 peer session for:</p>
                  <h4 className="text-base font-bold text-slate-900 mt-1">{requestModalSkill.name}</h4>
                  <p className="text-xs text-primary font-semibold mt-0.5">Mentor: {requestModalSkill.mentorName} ({requestModalSkill.mentorDept})</p>
                </div>

                {/* Preferred time slot */}
                <div className="form-group">
                  <label className="form-label" htmlFor="req-slot">
                    Your Preferred Session Timing
                  </label>
                  <select
                    id="req-slot"
                    className="form-input"
                    value={requestTimeSlot}
                    onChange={(e) => setRequestTimeSlot(e.target.value)}
                  >
                    <option value="Weekday Evening (5 PM – 7 PM)">Weekday Evening (5 PM – 7 PM)</option>
                    <option value="Weekday Afternoon (2 PM – 4 PM)">Weekday Afternoon (2 PM – 4 PM)</option>
                    <option value="Weekend Morning (10 AM – 12 PM)">Weekend Morning (10 AM – 12 PM)</option>
                    <option value="Weekend Afternoon (3 PM – 5 PM)">Weekend Afternoon (3 PM – 5 PM)</option>
                    <option value="Flexible (Mutual Schedule)">Flexible (Mutual Schedule)</option>
                  </select>
                </div>

                {/* Personal learning note */}
                <div className="form-group">
                  <label className="form-label" htmlFor="req-note">
                    Message / What do you want to learn?
                  </label>
                  <textarea
                    id="req-note"
                    rows={4}
                    className="form-input"
                    value={requestNote}
                    onChange={(e) => setRequestNote(e.target.value)}
                    required
                    placeholder="Tell the student mentor what specific topics or project questions you need help with..."
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setRequestModalSkill(null)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  <Send size={15} />
                  <span>Send Learning Request</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExploreSkills;
