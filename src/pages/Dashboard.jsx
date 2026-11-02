import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  BookOpen,
  Plus,
  Search,
  MessageSquare,
  Calendar,
  Users,
  Award,
  Star,
  CheckCircle2,
  Clock,
  ArrowRight,
  Sparkles,
  ExternalLink,
  GraduationCap,
  BookmarkPlus,
  Video,
  MapPin,
  Layers
} from 'lucide-react';
import { useAuth } from '../utils/auth.js';
import AnimatedCounter from '../components/AnimatedCounter.jsx';
import PowerLevelMeter from '../components/PowerLevelMeter.jsx';
import AnimeIdChip, { AnimeIdGuideButton } from '../components/AnimeIdChip.jsx';
import { formatShortName, ENROLLED_LEARNERS_MAP } from '../utils/idEngine.js';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [toastMessage, setToastMessage] = useState(null);

  // Quick toast notification helper
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Filter actual upcoming study sessions (exclude past/cancelled)
  const upcomingList = useMemo(() => {
    const all = user.upcomingSessions || [];
    const upcomingOnly = all.filter(
      (s) => s.status === 'Upcoming' || s.status === 'Scheduled' || (!s.status && s.date >= '2026-10-01')
    );
    return upcomingOnly.length > 0 ? upcomingOnly.slice(0, 3) : all.slice(0, 2);
  }, [user.upcomingSessions]);

  return (
    <div className="dashboard-page">
      <div className="container">
        {/* Floating Feedback Notification */}
        {toastMessage && (
          <div className="app-toast-alert">
            <CheckCircle2 size={18} className="text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* 1. Welcome Message & Student Profile Banner */}
        <div className="dash-welcome-card">
          <div className="dash-user-profile-header">
            <div className="dash-user-avatar">
              {user.name.split(' ').map((n) => n[0]).join('')}
            </div>
            <div className="dash-user-meta">
              <h1>Welcome back, {user.name}!</h1>
              <div className="dash-user-subtext">
                <span className="font-semibold text-slate-800">{user.department}</span>
                <span>·</span>
                <span>{user.year}</span>
                <span>·</span>
                <span className="flex items-center text-amber-500 font-bold">
                  <Star size={14} fill="#f59e0b" />
                  <span className="ml-1 text-slate-800">{user.rating} Peer Rating</span>
                </span>
              </div>
              <div className="flex items-center gap-2 flex-wrap mt-2">
                <span className="px-2.5 py-1 rounded bg-indigo-50 border border-indigo-200 text-indigo-700 font-mono text-xs font-bold">
                  Student ID: {user.studentId || 'STU001'}
                </span>
                <div className="dash-status-pill">
                  <span
                    style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      backgroundColor: '#16a34a'
                    }}
                  ></span>
                  <span>Active 4S Student · Teacher & Learner Account</span>
                </div>
              </div>
            </div>
          </div>

          <div className="dash-header-actions">
            <Link to="/profile" className="btn btn-outline">
              <span>View Profile</span>
            </Link>
          </div>
        </div>

        {/* 2. Top Metrics Row (Full Width 4 Cards) */}
        <div className="dash-stats-grid">
          {/* Skills I Teach */}
          <div className="dash-stat-card card-lift animate-fade-up stagger-1">
            <div className="stat-left">
              <h3>Skills I Teach</h3>
              <div className="stat-number">
                <AnimatedCounter value={user.skillsOffered?.length || 4} duration={650} />
              </div>
              <p className="stat-subtext">Mentoring 14+ campus peers</p>
            </div>
            <div className="stat-icon-wrapper action-icon-indigo">
              <BookOpen size={24} />
            </div>
          </div>

          {/* Skills I Want to Learn */}
          <div className="dash-stat-card card-lift animate-fade-up stagger-2">
            <div className="stat-left">
              <h3>Skills I Want to Learn</h3>
              <div className="stat-number">
                <AnimatedCounter value={user.skillsWanted?.length || 4} duration={650} />
              </div>
              <p className="stat-subtext">Active learning wishlist</p>
            </div>
            <div className="stat-icon-wrapper action-icon-purple">
              <Layers size={24} />
            </div>
          </div>

          {/* Upcoming Sessions */}
          <div className="dash-stat-card card-lift animate-fade-up stagger-3">
            <div className="stat-left">
              <h3>Upcoming Sessions</h3>
              <div className="stat-number">
                <AnimatedCounter value={upcomingList.length || 2} duration={650} />
              </div>
              <p className="stat-subtext">Scheduled this week</p>
            </div>
            <div className="stat-icon-wrapper action-icon-amber">
              <Calendar size={24} />
            </div>
          </div>

          {/* Matches */}
          <div className="dash-stat-card card-lift animate-fade-up stagger-4">
            <div className="stat-left">
              <h3>Matches</h3>
              <div className="stat-number">
                <AnimatedCounter value={8} duration={650} />
              </div>
              <p className="stat-subtext">Compatible student profiles</p>
            </div>
            <div className="stat-icon-wrapper action-icon-blue">
              <Users size={24} />
            </div>
          </div>
        </div>

        {/* 3. Quick Action Buttons (Full Width 5 Actions) */}
        <div className="dash-quick-actions-bar">
          <Link to="/my-skills" className="dash-action-btn">
            <div className="action-icon-box action-icon-indigo">
              <Plus size={20} />
            </div>
            <div className="action-label-box">
              <span className="action-label-title">Add Skill</span>
              <span className="action-label-desc">Offer a new skill to teach</span>
            </div>
          </Link>

          <Link to="/explore" className="dash-action-btn">
            <div className="action-icon-box action-icon-purple">
              <Search size={20} />
            </div>
            <div className="action-label-box">
              <span className="action-label-title">Find Skills</span>
              <span className="action-label-desc">Browse campus mentors</span>
            </div>
          </Link>

          <Link to="/requests" className="dash-action-btn">
            <div className="action-icon-box action-icon-blue">
              <BookmarkPlus size={20} />
            </div>
            <div className="action-label-box">
              <span className="action-label-title">Create Request</span>
              <span className="action-label-desc">Post what you want to learn</span>
            </div>
          </Link>

          <Link to="/sessions" className="dash-action-btn">
            <div className="action-icon-box action-icon-amber">
              <Calendar size={20} />
            </div>
            <div className="action-label-box">
              <span className="action-label-title">View Sessions</span>
              <span className="action-label-desc">Check upcoming schedule</span>
            </div>
          </Link>

          <Link to="/availability" className="dash-action-btn">
            <div className="action-icon-box action-icon-indigo" style={{ backgroundColor: '#e0e7ff', color: '#4338ca' }}>
              <Clock size={20} />
            </div>
            <div className="action-label-box">
              <span className="action-label-title">Set Availability</span>
              <span className="action-label-desc">Configure free time slots</span>
            </div>
          </Link>
        </div>

        {/* ==================================================================
            ROW 1: Upcoming Study Sessions (Left) & Messages / Matches (Right)
            ================================================================== */}
        <div className="dash-content-grid">
          {/* Section: Upcoming Sessions List */}
          <div className="dash-section-card">
            <div className="dash-section-header">
              <div className="dash-section-title">
                <Calendar size={19} className="text-primary" />
                <span>Upcoming Study Sessions</span>
                <span className="dash-section-count">{upcomingList.length} Scheduled</span>
              </div>
              <Link to="/sessions" className="btn btn-sm btn-outline">
                <span>All Sessions ({user.upcomingSessions?.length || 5})</span>
                <ArrowRight size={13} />
              </Link>
            </div>

            <div className="dash-sessions-list">
              {upcomingList.length > 0 ? (
                upcomingList.map((session) => {
                  const roleLabel =
                    session.role ||
                    (session.userRole === 'Teacher' ? 'Teaching' : 'Learning');
                  const displayTime =
                    session.dateTime ||
                    (session.date ? `${session.date} · ${session.time}` : session.time || 'Schedule Confirmed');
                  const locationText =
                    session.mode && session.link
                      ? `${session.mode} (${session.link})`
                      : session.mode || session.link || 'Campus Meeting';

                  return (
                    <div key={session.id} className="dash-session-item">
                      <div className="session-item-top">
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <span
                              className={`session-role-badge ${
                                roleLabel === 'Teaching' ? 'role-teaching' : 'role-learning'
                              }`}
                            >
                              {roleLabel} Session
                            </span>
                            <AnimeIdChip
                              id={session.learningId || (session.teacherStudentId === 'STU001' ? `LRN006-TCR001CRS001` : `LRN001-TCR002CRS003`)}
                              type="LRN"
                              size="sm"
                              record={session}
                              context={{
                                skillName: session.topic || session.skill,
                                teacherName: session.teacher,
                                learnerName: session.learner,
                                isLearnerCurrentUser: session.learner === user.name,
                                isTeacherCurrentUser: session.teacher === user.name,
                                userName: user.name
                              }}
                            />
                          </div>
                          <h4 className="session-topic-title">{session.topic || session.skill}</h4>
                          <div className="session-partner-info">
                            <span>With <strong>{session.partnerName}</strong></span>
                            <span>·</span>
                            <span>{session.partnerDept || 'Peer Student'}</span>
                          </div>
                        </div>

                        <button
                          onClick={() =>
                            showToast(`Launching ${session.mode || 'session'} room with ${session.partnerName}...`)
                          }
                          className="btn btn-sm btn-primary"
                          style={{ flexShrink: 0 }}
                        >
                          <Video size={14} />
                          <span>Join Call</span>
                        </button>
                      </div>

                      <div className="session-details-row">
                        <div className="session-time-chip">
                          <Clock size={14} className="text-primary" />
                          <span>{displayTime}</span>
                        </div>
                        <div className="session-location-chip" title={locationText}>
                          <MapPin size={13} />
                          <span>{locationText}</span>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="dash-empty-box">
                  <p>No upcoming study sessions scheduled for this week.</p>
                  <Link to="/sessions" className="btn btn-sm btn-outline-primary">
                    <Calendar size={14} />
                    <span>Schedule a Session</span>
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Section: Recent Messages & Recommended Peer Matches */}
          <div className="dash-section-card">
            <div className="dash-section-header">
              <div className="dash-section-title">
                <MessageSquare size={18} className="text-primary" />
                <span>Recent Peer Messages</span>
              </div>
              <Link to="/messages" className="text-primary font-semibold text-xs flex items-center gap-1">
                <span>Open Inbox</span>
                <ArrowRight size={13} />
              </Link>
            </div>

            <div className="dash-messages-list">
              {user.recentMessages?.map((msg) => (
                <div
                  key={msg.id}
                  className="dash-message-item"
                  onClick={() => navigate(`/messages?user=${encodeURIComponent(msg.sender)}`)}
                  title={`Open conversation with ${msg.sender}`}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="msg-avatar">{msg.avatar}</div>
                  <div className="msg-body">
                    <div className="msg-top">
                      <span className="msg-sender">{msg.sender}</span>
                      <span className="msg-time">{msg.time}</span>
                    </div>
                    <p className="msg-snippet">{msg.snippet}</p>
                  </div>
                  {msg.unread && <div className="unread-dot" title="Unread message"></div>}
                </div>
              ))}
            </div>

            {/* Peer Matching Callout */}
            <div className="dash-match-callout">
              <div className="flex items-center gap-2 mb-1">
                <Sparkles size={16} className="text-primary" />
                <h4 className="font-bold text-sm text-slate-900">8 Compatible Campus Matches</h4>
              </div>
              <p className="text-xs text-muted mb-3">
                Students match your exact skills wishlist. Connect with them for a mutual 1-on-1 skill swap.
              </p>
              <Link to="/matches" className="btn btn-sm btn-primary w-full justify-center">
                <span>View Recommended Matches</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>

        {/* ==================================================================
            ROW 2: Skills I Teach (Left) & Skills I Want to Learn (Right)
            ================================================================== */}
        <div className="dash-content-grid">
          {/* Section: Skills I Teach */}
          <div className="dash-section-card">
            <div className="dash-section-header">
              <div className="dash-section-title">
                <BookOpen size={19} className="text-primary" />
                <span>Skills I Teach</span>
                <span className="dash-section-count">{user.skillsOffered?.length || 0} Listed</span>
              </div>
              <div className="flex items-center gap-2">
                <AnimeIdGuideButton />
                <Link to="/my-skills" className="btn btn-sm btn-outline-primary">
                  <Plus size={14} />
                  <span>Manage / Add</span>
                </Link>
              </div>
            </div>

            <div className="dash-skills-list">
              {user.skillsOffered && user.skillsOffered.length > 0 ? (
                user.skillsOffered.map((skill) => {
                  const teachingId = skill.teachingId || skill.displayId || 'TCR001CRS001';
                  const learners = skill.enrolledLearners || ENROLLED_LEARNERS_MAP[teachingId] || [];

                  return (
                    <div key={skill.id} className="dash-skill-item">
                      <div className="dash-skill-main">
                        <div className="flex items-center gap-2 flex-wrap mb-2">
                          <AnimeIdChip
                            id={teachingId}
                            type="TCR"
                            size="lg"
                            record={skill}
                            context={{
                              isCurrentUser: true,
                              userName: user.name,
                              skillName: skill.name
                            }}
                          />
                        </div>
                        <h4>{skill.name}</h4>
                        <p className="dash-skill-desc">{skill.description}</p>
                        <div className="dash-skill-meta">
                          <PowerLevelMeter level={skill.level} />
                          <span>·</span>
                          <span>{skill.category}</span>
                          <span>·</span>
                          <span className="text-primary font-semibold">
                            {skill.learnersHelped || 0} helped
                          </span>
                          <span>·</span>
                          <span className="flex items-center text-amber-500 font-bold">
                            <Star size={12} fill="#f59e0b" />
                            <span className="ml-1">{skill.rating}</span>
                          </span>
                        </div>

                        {/* Enrolled learners list */}
                        <div className="dash-enrolled-learners-block mt-3 pt-2.5 border-t border-slate-100">
                          <div className="flex items-center justify-between text-xs mb-1.5">
                            <span className="font-bold text-slate-700 flex items-center gap-1">
                              <Users size={12} className="text-primary" />
                              <span>Enrolled learners</span>
                            </span>
                            <span className="text-[11px] font-bold text-slate-500">
                              {learners.length > 0
                                ? `${learners.length} ${learners.length === 1 ? 'learner' : 'learners'}`
                                : 'No learners yet'}
                            </span>
                          </div>
                          {learners.length > 0 ? (
                            <div className="flex flex-col gap-1.5">
                              {learners.map((lrn, idx) => (
                                <div
                                  key={idx}
                                  className="flex items-center justify-between gap-2 bg-[#FFFDF9] border border-slate-200 rounded px-2 py-1 text-xs"
                                >
                                  <span className="font-bold text-slate-800">
                                    {formatShortName(lrn.learnerName)}
                                  </span>
                                  <AnimeIdChip
                                    id={lrn.learningId}
                                    type="LRN"
                                    size="sm"
                                    context={{
                                      isLearnerCurrentUser: false,
                                      learnerName: lrn.learnerName,
                                      isTeacherCurrentUser: true,
                                      userName: user.name,
                                      skillName: skill.name
                                    }}
                                  />
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-xs text-slate-400 italic m-0">No learners yet</p>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => showToast(`Skill link for "${skill.name}" copied!`)}
                        className="btn btn-sm btn-outline"
                        style={{ flexShrink: 0 }}
                      >
                        <span>Share</span>
                      </button>
                    </div>
                  );
                })
              ) : (
                <div className="dash-empty-box">
                  <p>No skills offered yet. Share what you know to help campus peers!</p>
                  <Link to="/my-skills" className="btn btn-sm btn-primary">
                    <Plus size={14} />
                    <span>Add Your First Skill</span>
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Section: Skills I Want to Learn */}
          <div className="dash-section-card">
            <div className="dash-section-header">
              <div className="dash-section-title">
                <GraduationCap size={19} className="text-secondary" />
                <span>Skills I Want to Learn</span>
                <span className="dash-section-count" style={{ backgroundColor: 'var(--secondary-light)', color: 'var(--secondary)' }}>
                  {user.skillsWanted?.length || 0} Goals
                </span>
              </div>
              <div className="flex items-center gap-2">
                <AnimeIdGuideButton />
                <Link to="/requests" className="btn btn-sm btn-outline">
                  <Plus size={14} />
                  <span>New Request</span>
                </Link>
              </div>
            </div>

            <div className="dash-skills-list">
              {user.skillsWanted && user.skillsWanted.length > 0 ? (
                user.skillsWanted.map((wish) => {
                  const isMatched = wish.status === 'Matched' || (wish.learningId && wish.learningId.startsWith('LRN') && wish.learningId.includes('-TCR'));
                  const teacherName = wish.teacherName || (wish.teacherStudentId === 'STU004' ? 'Devansh Parekh' : 'Rashi Chandani');
                  let teacherTcrId = wish.teachingId;
                  if (!teacherTcrId && wish.learningId && wish.learningId.includes('-')) {
                    teacherTcrId = wish.learningId.split('-')[1];
                  }
                  if (!teacherTcrId) teacherTcrId = 'TCR002CRS003';

                  return (
                    <div key={wish.id} className="dash-skill-item">
                      <div className="dash-skill-main">
                        <div className="flex items-center gap-2 flex-wrap mb-2">
                          {isMatched ? (
                            <AnimeIdChip
                              id={wish.learningId}
                              type="LRN"
                              size="lg"
                              record={wish}
                              context={{
                                userName: user.name,
                                isLearnerCurrentUser: true,
                                teacherName: teacherName,
                                skillName: wish.name
                              }}
                            />
                          ) : (
                            <AnimeIdChip
                              id="AWAITING_TEACHER"
                              size="lg"
                              record={wish}
                              context={{ skillName: wish.name }}
                            />
                          )}
                        </div>

                        <h4>{wish.name}</h4>

                        {isMatched ? (
                          <>
                            <div className="dash-skill-teacher-line flex items-center gap-1.5 my-1.5 text-xs">
                              <span className="text-slate-600 font-semibold">
                                Taught by {formatShortName(teacherName)}
                              </span>
                              <AnimeIdChip
                                id={teacherTcrId}
                                type="TCR"
                                size="sm"
                                context={{
                                  peerName: teacherName,
                                  skillName: wish.name
                                }}
                              />
                            </div>
                            <p className="dash-skill-desc">{wish.targetGoal}</p>
                            <div className="dash-skill-meta">
                              <span
                                className={`priority-badge ${
                                  wish.priority === 'High'
                                    ? 'priority-high'
                                    : wish.priority === 'Low'
                                    ? 'priority-low'
                                    : 'priority-medium'
                                }`}
                              >
                                <span className="priority-pulse-dot" aria-hidden="true"></span>
                                <span>{wish.priority || 'Medium'} Priority</span>
                              </span>
                              <span>·</span>
                              <span>{wish.category}</span>
                              <span>·</span>
                              <span className="text-secondary font-semibold">
                                Mentor Connected
                              </span>
                            </div>
                          </>
                        ) : (
                          <>
                            {/* Unmatched request: skill name only, no fake teacher line */}
                            <p className="dash-skill-desc">{wish.targetGoal}</p>
                            <div className="dash-skill-meta">
                              <span
                                className={`priority-badge ${
                                  wish.priority === 'High'
                                    ? 'priority-high'
                                    : wish.priority === 'Low'
                                    ? 'priority-low'
                                    : 'priority-medium'
                                }`}
                              >
                                <span className="priority-pulse-dot" aria-hidden="true"></span>
                                <span>{wish.priority || 'Medium'} Priority</span>
                              </span>
                              <span>·</span>
                              <span>{wish.category}</span>
                              <span>·</span>
                              <span className="text-amber-600 font-semibold">
                                Open Request
                              </span>
                            </div>
                          </>
                        )}
                      </div>
                      <Link to="/explore" className="btn btn-sm btn-primary" style={{ flexShrink: 0 }}>
                        <span>Find Mentors</span>
                        <ArrowRight size={13} />
                      </Link>
                    </div>
                  );
                })
              ) : (
                <div className="dash-empty-box">
                  <p>No learning requests active. Post a skill you wish to learn!</p>
                  <Link to="/requests" className="btn btn-sm btn-secondary">
                    <Plus size={14} />
                    <span>Create Learning Request</span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ==================================================================
            ROW 3: Campus Badges (Left) & Recent Peer Reviews (Right)
            ================================================================== */}
        <div className="dash-content-grid">
          {/* Section: Campus Badges */}
          <div className="dash-section-card">
            <div className="dash-section-header">
              <div className="dash-section-title">
                <Award size={18} className="text-amber-500" />
                <span>Campus Achievements</span>
              </div>
              <Link to="/achievements" className="text-primary font-semibold text-xs flex items-center gap-1">
                <span>All Badges</span>
                <ArrowRight size={13} />
              </Link>
            </div>

            <div className="dash-achievements-list">
              {user.achievements?.map((ach) => (
                <div key={ach.id} className="dash-achievement-item">
                  <div className={`ach-icon-box ${ach.badgeClass}`}>
                    <Sparkles size={16} />
                  </div>
                  <div className="ach-info">
                    <h5>{ach.title}</h5>
                    <p>{ach.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section: Recent Peer Reviews & Ratings */}
          <div className="dash-section-card">
            <div className="dash-section-header">
              <div className="dash-section-title">
                <Star size={17} fill="#f59e0b" className="text-amber-500" />
                <span>Recent Peer Reviews</span>
              </div>
              <Link to="/ratings" className="text-primary font-semibold text-xs flex items-center gap-1">
                <span>View All Reviews</span>
                <ArrowRight size={13} />
              </Link>
            </div>

            <div className="dash-reviews-list">
              {user.recentReviews?.map((rev) => (
                <div key={rev.id} className="dash-review-item">
                  <div className="review-header">
                    <span className="review-author">{rev.author}</span>
                    <div className="review-stars">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} size={11} fill="#f59e0b" />
                      ))}
                    </div>
                  </div>
                  <p className="review-comment">"{rev.comment}"</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
