import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  User,
  Mail,
  GraduationCap,
  Calendar,
  BookOpen,
  Layers,
  Edit3,
  Star,
  Sparkles,
  Award,
  CheckCircle2,
  Clock,
  ArrowRight,
  Plus,
  MessageSquare,
  X,
  ExternalLink
} from 'lucide-react';
import { useAuth, updateUserProfile } from '../utils/auth.js';
import AnimatedCounter from '../components/AnimatedCounter.jsx';
import PowerLevelMeter from '../components/PowerLevelMeter.jsx';
import './Profile.css';

const Profile = () => {
  const navigate = useNavigate();
  const { user, skills, requests, reviews, achievements } = useAuth();

  const [activeTab, setActiveTab] = useState('skills'); // 'skills', 'reviews', 'achievements'
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Edit Profile Form State
  const [editForm, setEditForm] = useState({
    name: user.name,
    email: user.email,
    department: user.department,
    year: user.year,
    bio: user.bio
  });

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const handleOpenEdit = () => {
    setEditForm({
      name: user.name,
      email: user.email,
      department: user.department,
      year: user.year,
      bio: user.bio
    });
    setIsEditModalOpen(true);
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    if (!editForm.name.trim() || !editForm.email.trim()) {
      showToast('Name and email cannot be empty.');
      return;
    }

    updateUserProfile({
      name: editForm.name,
      email: editForm.email,
      department: editForm.department,
      year: editForm.year,
      bio: editForm.bio
    });

    setIsEditModalOpen(false);
    showToast('Profile updated.');
  };

  const initials = user.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const unlockedAchievementsCount = achievements.filter((a) => a.unlocked).length;

  return (
    <div className="profile-page">
      <div className="container">
        {/* Floating Toast Notification */}
        {toastMessage && (
          <div className="app-toast-alert">
            <CheckCircle2 size={18} className="text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* 1. Student Hero Profile Card */}
        <div className="profile-hero-card card-lift animate-fade-up">
          <div className="profile-hero-top">
            <div className="profile-avatar-group">
              <div className="profile-avatar-large">{initials}</div>
              <div className="profile-identity">
                <h1>{user.name}</h1>
                <div className="profile-meta-row">
                  <span className="flex items-center gap-1 font-semibold text-slate-800">
                    <GraduationCap size={16} className="text-primary" />
                    <span>{user.department}</span>
                  </span>
                  <span>·</span>
                  <span>{user.year}</span>
                  <span>·</span>
                  <span className="px-2 py-0.5 rounded bg-indigo-50 border border-indigo-200 text-indigo-700 font-mono text-xs font-bold">
                    Student ID: {user.studentId || 'STU001'}
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <Mail size={14} className="text-slate-400" />
                    <span>{user.email}</span>
                  </span>
                  <span>·</span>
                  <div className="profile-rating-badge">
                    <Star size={13} fill="#d97706" />
                    <span>{user.rating} Peer Rating</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: '#16a34a'
                    }}
                  ></span>
                  <span className="text-xs font-semibold text-emerald-700">
                    Active 4S Peer · Mentoring & Learning
                  </span>
                </div>
              </div>
            </div>

            <button onClick={handleOpenEdit} className="btn btn-outline-primary">
              <Edit3 size={15} />
              <span>Edit Profile</span>
            </button>
          </div>

          {/* Student Bio */}
          <div className="profile-bio-box">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">
              About Me:
            </span>
            <p>{user.bio}</p>
          </div>

          {/* Key Metrics Strip */}
          <div className="profile-stats-strip">
            <div className="profile-stat-box">
              <span className="profile-stat-val">{skills.length}</span>
              <span className="profile-stat-lbl">Skills Offered</span>
            </div>
            <div className="profile-stat-box">
              <span className="profile-stat-val">{requests.length}</span>
              <span className="profile-stat-lbl">Learning Wishlist</span>
            </div>
            <div className="profile-stat-box">
              <span className="profile-stat-val">{user.sessionsTaught || 18}</span>
              <span className="profile-stat-lbl">Sessions Taught</span>
            </div>
            <div className="profile-stat-box">
              <span className="profile-stat-val">{user.sessionsAttended || 12}</span>
              <span className="profile-stat-lbl">Sessions Attended</span>
            </div>
            <div className="profile-stat-box">
              <span className="profile-stat-val text-amber-600">
                {unlockedAchievementsCount} / {achievements.length}
              </span>
              <span className="profile-stat-lbl">Badges Earned</span>
            </div>
          </div>
        </div>

        {/* 2. Profile Tabs Navigation */}
        <div className="profile-nav-tabs" role="tablist">
          <button
            className={`profile-nav-tab ${activeTab === 'skills' ? 'active' : ''}`}
            onClick={() => setActiveTab('skills')}
          >
            <BookOpen size={16} />
            <span>Skills & Interests</span>
            <span className="profile-tab-count">{skills.length + requests.length}</span>
          </button>

          <button
            className={`profile-nav-tab ${activeTab === 'reviews' ? 'active' : ''}`}
            onClick={() => setActiveTab('reviews')}
          >
            <Star size={16} />
            <span>Ratings & Feedback</span>
            <span className="profile-tab-count">{reviews.length}</span>
          </button>

          <button
            className={`profile-nav-tab ${activeTab === 'achievements' ? 'active' : ''}`}
            onClick={() => setActiveTab('achievements')}
          >
            <Award size={16} />
            <span>Achievements</span>
            <span className="profile-tab-count">{unlockedAchievementsCount}</span>
          </button>
        </div>

        {/* TAB 1: Skills Offered & Wanted */}
        {activeTab === 'skills' && (
          <div className="profile-skills-grid">
            {/* Skills Offered */}
            <div className="profile-section-card">
              <div className="profile-section-header">
                <div className="profile-section-title">
                  <BookOpen size={18} className="text-primary" />
                  <span>Skills I Offer to Teach</span>
                  <span className="text-xs font-semibold text-slate-500">
                    ({skills.length})
                  </span>
                </div>
                <Link to="/my-skills" className="btn btn-sm btn-outline">
                  <Plus size={13} />
                  <span>Manage Skills</span>
                </Link>
              </div>

              <div className="profile-items-list">
                {skills.map((skill) => (
                  <div key={skill.id} className="profile-skill-item">
                    <div className="flex items-center gap-1.5 flex-wrap mb-1 text-xs">
                      <span className="px-1.5 py-0.5 rounded bg-indigo-50 border border-indigo-200 text-indigo-700 font-mono font-bold" title="Teaching Record ID">
                        Teaching ID: {skill.teachingId || 'TCH...'}
                      </span>
                      <span className="px-1.5 py-0.5 rounded bg-emerald-50 border border-emerald-200 text-emerald-700 font-mono font-bold" title="Shared Course ID">
                        Course ID: {skill.courseId || 'CRS...'}
                      </span>
                    </div>
                    <div className="skill-item-header">
                      <span className="skill-item-name">{skill.name}</span>
                      <PowerLevelMeter level={skill.level} />
                    </div>
                    <p className="skill-item-desc">{skill.description}</p>
                    <div className="skill-item-tags">
                      <span className="text-primary font-semibold">
                        📂 {skill.category}
                      </span>
                      <span>·</span>
                      <span className="text-slate-600">
                        🕒 {skill.availability}
                      </span>
                      <span>·</span>
                      <span className="text-emerald-600 font-semibold">
                        👥 {skill.learnersHelped || 0} helped
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Skills Wanted / Learning Requests */}
            <div className="profile-section-card">
              <div className="profile-section-header">
                <div className="profile-section-title">
                  <Layers size={18} className="text-secondary" />
                  <span>Skills I Want to Learn</span>
                  <span className="text-xs font-semibold text-slate-500">
                    ({requests.length})
                  </span>
                </div>
                <Link to="/requests" className="btn btn-sm btn-outline">
                  <Plus size={13} />
                  <span>Manage Requests</span>
                </Link>
              </div>

              <div className="profile-items-list">
                {requests.map((req) => (
                  <div key={req.id} className="profile-skill-item">
                    <div className="flex items-center gap-1.5 flex-wrap mb-1 text-xs">
                      <span className="px-1.5 py-0.5 rounded bg-blue-50 border border-blue-200 text-blue-700 font-mono font-bold" title="Learning Request ID">
                        Learning ID: {req.learningId || req.id}
                      </span>
                      <span className="px-1.5 py-0.5 rounded bg-emerald-50 border border-emerald-200 text-emerald-700 font-mono font-bold" title="Shared Course ID">
                        Course ID: {req.courseId || 'CRS...'}
                      </span>
                    </div>
                    <div className="skill-item-header">
                      <span className="skill-item-name">{req.name}</span>
                      <span
                        className="level-tag"
                        style={{
                          backgroundColor:
                            req.status === 'Matched' ? '#dcfce7' : '#e0f2fe',
                          color: req.status === 'Matched' ? '#15803d' : '#0369a1'
                        }}
                      >
                        {req.status}
                      </span>
                    </div>
                    <p className="skill-item-desc">{req.targetGoal}</p>
                    <div className="skill-item-tags">
                      <span className="text-secondary font-semibold">
                        📂 {req.category}
                      </span>
                      <span>·</span>
                      <span className="text-slate-600">
                        🎯 Target: {req.preferredLevel || 'Intermediate'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Ratings & Feedback Preview */}
        {activeTab === 'reviews' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Reviews & Peer Feedback
                </h3>
                <p className="text-xs text-muted">
                  Ratings received from students after completed teaching and learning sessions.
                </p>
              </div>
              <Link to="/ratings" className="btn btn-primary">
                <span>Open Full Ratings Hub</span>
                <ArrowRight size={15} />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {reviews.map((rev) => (
                <div
                  key={rev.id}
                  style={{
                    backgroundColor: '#ffffff',
                    border: '1px solid var(--border-color)',
                    borderRadius: '12px',
                    padding: '1.25rem',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
                  }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div
                        style={{
                          width: '34px',
                          height: '34px',
                          borderRadius: '50%',
                          backgroundColor: 'var(--primary-light)',
                          color: 'var(--primary)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 700,
                          fontSize: '12px'
                        }}
                      >
                        {rev.author.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                      </div>
                      <div>
                        <span className="font-bold text-sm text-slate-900 block">
                          {rev.author}
                        </span>
                        <span className="text-xs text-muted">
                          {rev.authorRole === 'Teacher' ? 'Student Mentor' : 'Peer Learner'} · {rev.date}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center text-amber-500">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          fill={i < rev.rating ? '#f59e0b' : 'none'}
                          color="#f59e0b"
                        />
                      ))}
                    </div>
                  </div>

                  <span
                    style={{
                      display: 'inline-block',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      color: 'var(--primary)',
                      backgroundColor: 'var(--primary-light)',
                      padding: '0.2rem 0.5rem',
                      borderRadius: '4px',
                      marginBottom: '0.5rem'
                    }}
                  >
                    Topic: {rev.skill}
                  </span>

                  <p className="text-sm text-slate-700 italic">"{rev.comment}"</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: Achievements Preview */}
        {activeTab === 'achievements' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Badges & Peer Milestones
                </h3>
                <p className="text-xs text-muted">
                  Earned for teaching sessions, active learning, and community contributions.
                </p>
              </div>
              <Link to="/achievements" className="btn btn-primary">
                <span>View Full Badges Page</span>
                <ArrowRight size={15} />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {achievements.map((ach) => (
                <div
                  key={ach.id}
                  style={{
                    backgroundColor: ach.unlocked ? '#ffffff' : '#f8fafc',
                    border: `1px solid ${ach.unlocked ? '#cbd5e1' : '#e2e8f0'}`,
                    borderRadius: '12px',
                    padding: '1.25rem',
                    textAlign: 'center',
                    opacity: ach.unlocked ? 1 : 0.6
                  }}
                >
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      margin: '0 auto 0.75rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: ach.unlocked ? '#eef2ff' : '#e2e8f0',
                      color: ach.unlocked ? 'var(--primary)' : '#94a3b8'
                    }}
                  >
                    <Award size={24} />
                  </div>
                  <h4 className="font-bold text-sm text-slate-900 mb-1">{ach.title}</h4>
                  <p className="text-xs text-muted mb-2">{ach.desc}</p>
                  <span
                    style={{
                      fontSize: '0.6875rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      color: ach.unlocked ? '#15803d' : '#64748b',
                      backgroundColor: ach.unlocked ? '#dcfce7' : '#f1f5f9',
                      padding: '0.2rem 0.5rem',
                      borderRadius: '9999px'
                    }}
                  >
                    {ach.unlocked ? '✓ Unlocked' : 'Locked'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Edit Profile Modal */}
        {isEditModalOpen && (
          <div className="profile-modal-overlay">
            <div className="profile-modal-card">
              <div
                style={{
                  padding: '1.25rem 1.5rem',
                  borderBottom: '1px solid var(--border-color)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <h3 className="font-bold text-lg text-slate-900">
                  Edit Student Profile
                </h3>
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#94a3b8',
                    cursor: 'pointer'
                  }}
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSaveProfile}>
                <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {/* Full Name */}
                  <div className="form-group">
                    <label className="form-label font-bold">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      value={editForm.name}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      required
                    />
                  </div>

                  {/* Email */}
                  <div className="form-group">
                    <label className="form-label font-bold">
                      College Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      value={editForm.email}
                      onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                      required
                    />
                  </div>

                  {/* Department & Year Row */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="form-group">
                      <label className="form-label font-bold">Department / Major</label>
                      <input
                        type="text"
                        className="form-control"
                        value={editForm.department}
                        onChange={(e) =>
                          setEditForm({ ...editForm, department: e.target.value })
                        }
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label font-bold">Year of Study</label>
                      <select
                        className="form-control"
                        value={editForm.year}
                        onChange={(e) => setEditForm({ ...editForm, year: e.target.value })}
                      >
                        <option value="1st Year">1st Year</option>
                        <option value="2nd Year">2nd Year</option>
                        <option value="3rd Year">3rd Year</option>
                        <option value="4th Year">4th Year</option>
                        <option value="Postgraduate">Postgraduate</option>
                      </select>
                    </div>
                  </div>

                  {/* Bio */}
                  <div className="form-group">
                    <label className="form-label font-bold">Short Bio</label>
                    <textarea
                      className="form-control"
                      rows={4}
                      value={editForm.bio}
                      onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                      placeholder="Tell campus peers what you enjoy teaching and what you are eager to learn..."
                    />
                  </div>
                </div>

                <div
                  style={{
                    padding: '1rem 1.5rem',
                    borderTop: '1px solid var(--border-color)',
                    backgroundColor: '#f8fafc',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    gap: '0.75rem'
                  }}
                >
                  <button
                    type="button"
                    className="btn btn-outline"
                    onClick={() => setIsEditModalOpen(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    <CheckCircle2 size={16} />
                    <span>Save Changes</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
