import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import {
  Calendar,
  Clock,
  Video,
  MapPin,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Plus,
  Search,
  Filter,
  Users,
  BookOpen,
  GraduationCap,
  MessageSquare,
  ExternalLink,
  ChevronRight,
  ArrowRight,
  Info,
  X,
  Sparkles,
  Layers,
  RotateCcw
} from 'lucide-react';
import {
  useAuth,
  scheduleSession,
  updateSessionStatus,
  cancelSession
} from '../utils/auth.js';
import AnimeIdChip from '../components/AnimeIdChip.jsx';
import './Sessions.css';

const Sessions = () => {
  const navigate = useNavigate();
  const { user, sessions } = useAuth();
  const shouldReduceMotion = useReducedMotion();

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All'); // 'All', 'Upcoming', 'Completed', 'Cancelled'
  const [roleFilter, setRoleFilter] = useState('All'); // 'All', 'Teaching', 'Learning'

  // Modal State
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [cancelModalSession, setCancelModalSession] = useState(null);
  const [cancelReason, setCancelReason] = useState('');

  // Toast Notification State
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Schedule Session Form State
  const [scheduleForm, setScheduleForm] = useState({
    skill: user.skillsOffered?.[0]?.name || 'React.js & Frontend Architecture',
    topic: '',
    userRole: 'Teacher', // 'Teacher' (Vidhi teaches) or 'Learner' (Vidhi learns)
    partnerName: 'Aarav Mehta',
    partnerDept: 'Computer Science · 2nd Year',
    date: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
    time: '4:00 PM – 5:00 PM',
    duration: '60 mins',
    mode: 'Google Meet',
    link: 'https://meet.google.com/4s-session-room',
    notes: 'Hands-on live problem solving & concepts discussion.'
  });

  // Calculate Counts
  const totalCount = sessions.length;
  const upcomingCount = sessions.filter((s) => s.status === 'Upcoming').length;
  const completedCount = sessions.filter((s) => s.status === 'Completed').length;
  const cancelledCount = sessions.filter((s) => s.status === 'Cancelled').length;

  const teachingCount = sessions.filter(
    (s) => s.userRole === 'Teacher' || s.teacher === user.name
  ).length;
  const learningCount = sessions.filter(
    (s) => s.userRole === 'Learner' || s.learner === user.name
  ).length;

  // Filtered Sessions
  const filteredSessions = useMemo(() => {
    return sessions.filter((session) => {
      // 1. Status Filter
      if (statusFilter !== 'All' && session.status !== statusFilter) {
        return false;
      }

      // 2. Role Filter
      if (roleFilter === 'Teaching') {
        const isTeaching = session.userRole === 'Teacher' || session.teacher === user.name;
        if (!isTeaching) return false;
      }
      if (roleFilter === 'Learning') {
        const isLearning = session.userRole === 'Learner' || session.learner === user.name;
        if (!isLearning) return false;
      }

      // 3. Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const skillMatch = (session.skill || '').toLowerCase().includes(q);
        const topicMatch = (session.topic || '').toLowerCase().includes(q);
        const partnerMatch = (session.partnerName || '').toLowerCase().includes(q);
        const teacherMatch = (session.teacher || '').toLowerCase().includes(q);
        const learnerMatch = (session.learner || '').toLowerCase().includes(q);

        if (!skillMatch && !topicMatch && !partnerMatch && !teacherMatch && !learnerMatch) {
          return false;
        }
      }

      return true;
    });
  }, [sessions, statusFilter, roleFilter, searchQuery, user.name]);

  // Handle Mark as Completed
  const handleMarkCompleted = (session) => {
    updateSessionStatus(session.id, 'Completed');
    showToast(
      `Session "${session.skill}" marked as Completed! Your dashboard metrics have been updated.`
    );
  };

  // Handle Open Cancel Modal
  const handleOpenCancelModal = (session) => {
    setCancelModalSession(session);
    setCancelReason('');
  };

  // Handle Confirm Cancel
  const handleConfirmCancel = (e) => {
    e.preventDefault();
    if (!cancelModalSession) return;
    cancelSession(cancelModalSession.id, cancelReason || 'Cancelled by student');
    const title = cancelModalSession.skill;
    setCancelModalSession(null);
    showToast(`Session "${title}" has been cancelled.`);
  };

  // Handle Schedule Submit
  const handleScheduleSubmit = (e) => {
    e.preventDefault();

    const topicTitle = scheduleForm.topic.trim() || `${scheduleForm.skill} Mentoring Session`;

    scheduleSession({
      skill: scheduleForm.skill,
      topic: topicTitle,
      userRole: scheduleForm.userRole,
      role: scheduleForm.userRole === 'Teacher' ? 'Teaching' : 'Learning',
      partnerName: scheduleForm.partnerName.trim(),
      partnerDept: scheduleForm.partnerDept.trim() || 'College Student',
      partnerAvatar: scheduleForm.partnerName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase(),
      date: scheduleForm.date,
      time: scheduleForm.time,
      duration: scheduleForm.duration,
      mode: scheduleForm.mode,
      link:
        scheduleForm.mode === 'Google Meet'
          ? scheduleForm.link || 'https://meet.google.com/4s-study-hub'
          : scheduleForm.link || 'Campus Central Library Room 2A',
      notes: scheduleForm.notes,
      status: 'Upcoming'
    });

    setIsScheduleModalOpen(false);
    showToast('Session scheduled.');
  };

  return (
    <div className="sessions-page">
      <div className="container">
        {/* Floating Toast Notification */}
        {toastMessage && (
          <div className="app-toast-alert">
            <CheckCircle2 size={18} className="text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Page Header */}
        <div className="sessions-header">
          <span className="sessions-kicker">
            <Calendar size={14} />
            <span>Peer Mentoring Hub</span>
          </span>
          <h1 className="sessions-title">Study &amp; Mentoring Sessions</h1>
          <p className="sessions-subtitle">
            Manage your peer-to-peer knowledge exchanges. On 4S, you can teach one student in a session and learn from another student in a different session—all coordinated through your unified student account.
          </p>
        </div>

        {/* Availability Callout Banner */}
        <div className="availability-banner">
          <div className="availability-banner-content">
            <div className="availability-banner-icon">
              <Clock size={22} />
            </div>
            <div className="availability-banner-text">
              <h4>Manage Your Weekly Free Timetable</h4>
              <p>
                Keep your available days and time slots updated so campus peers can schedule sessions that match your college schedule.
              </p>
            </div>
          </div>
          <Link to="/availability" className="btn btn-primary" style={{ flexShrink: 0 }}>
            <span>Weekly Availability</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        {/* 4 Stat Cards */}
        <div className="sessions-stats-bar">
          <div className="session-stat-card">
            <div className="session-stat-info">
              <h4>Upcoming Sessions</h4>
              <div className="session-stat-number">{upcomingCount}</div>
            </div>
            <div className="session-stat-icon stat-icon-blue">
              <Calendar size={22} />
            </div>
          </div>

          <div className="session-stat-card">
            <div className="session-stat-info">
              <h4>I'm Teaching</h4>
              <div className="session-stat-number">{teachingCount}</div>
            </div>
            <div className="session-stat-icon stat-icon-purple">
              <BookOpen size={22} />
            </div>
          </div>

          <div className="session-stat-card">
            <div className="session-stat-info">
              <h4>I'm Learning</h4>
              <div className="session-stat-number">{learningCount}</div>
            </div>
            <div className="session-stat-icon stat-icon-emerald">
              <GraduationCap size={22} />
            </div>
          </div>

          <div className="session-stat-card">
            <div className="session-stat-info">
              <h4>Completed</h4>
              <div className="session-stat-number">{completedCount}</div>
            </div>
            <div className="session-stat-icon stat-icon-amber">
              <CheckCircle2 size={22} />
            </div>
          </div>
        </div>

        {/* Controls & Filter Bar */}
        <div className="sessions-controls-card">
          <div className="sessions-controls-row">
            <div className="sessions-search-box">
              <Search size={18} className="sessions-search-icon" />
              <input
                type="text"
                placeholder="Search by skill, topic, or partner student..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="sessions-search-input"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: '#94a3b8',
                    cursor: 'pointer'
                  }}
                >
                  <X size={16} />
                </button>
              )}
            </div>

            <div className="sessions-actions-group">
              <button
                onClick={() => setIsScheduleModalOpen(true)}
                className="btn btn-primary"
              >
                <Plus size={18} />
                <span>Schedule a Session</span>
              </button>
            </div>
          </div>

          {/* Filter Tabs Row */}
          <div className="sessions-filter-tabs-row">
            <div className="status-tabs-group" role="tablist" aria-label="Filter by Status">
              <button
                className={`tab-btn ${statusFilter === 'All' ? 'active' : ''}`}
                onClick={() => setStatusFilter('All')}
              >
                <span>All Statuses</span>
                <span className="tab-count-pill">{totalCount}</span>
              </button>
              <button
                className={`tab-btn ${statusFilter === 'Upcoming' ? 'active' : ''}`}
                onClick={() => setStatusFilter('Upcoming')}
              >
                <span>Upcoming</span>
                <span className="tab-count-pill">{upcomingCount}</span>
              </button>
              <button
                className={`tab-btn ${statusFilter === 'Completed' ? 'active' : ''}`}
                onClick={() => setStatusFilter('Completed')}
              >
                <span>Completed</span>
                <span className="tab-count-pill">{completedCount}</span>
              </button>
              <button
                className={`tab-btn ${statusFilter === 'Cancelled' ? 'active' : ''}`}
                onClick={() => setStatusFilter('Cancelled')}
              >
                <span>Cancelled</span>
                <span className="tab-count-pill">{cancelledCount}</span>
              </button>
            </div>

            <div className="role-tabs-group" role="tablist" aria-label="Filter by Role">
              <button
                className={`tab-btn ${roleFilter === 'All' ? 'active' : ''}`}
                onClick={() => setRoleFilter('All')}
              >
                All Roles
              </button>
              <button
                className={`tab-btn ${roleFilter === 'Teaching' ? 'active' : ''}`}
                onClick={() => setRoleFilter('Teaching')}
              >
                <BookOpen size={14} />
                <span>I'm Teaching</span>
              </button>
              <button
                className={`tab-btn ${roleFilter === 'Learning' ? 'active' : ''}`}
                onClick={() => setRoleFilter('Learning')}
              >
                <GraduationCap size={14} />
                <span>I'm Learning</span>
              </button>
            </div>
          </div>
        </div>

        {/* Sessions List */}
        {filteredSessions.length === 0 ? (
          <div className="sessions-empty-card">
            <div className="sessions-empty-icon">
              <Calendar size={32} />
            </div>
            <h3>No sessions found</h3>
            <p>
              {searchQuery || statusFilter !== 'All' || roleFilter !== 'All'
                ? 'Try adjusting your search terms or filters to find what you are looking for.'
                : 'You do not have any sessions scheduled yet. Create a new session or explore campus peers ready to swap skills!'}
            </p>
            <div className="flex justify-center gap-3">
              {(searchQuery || statusFilter !== 'All' || roleFilter !== 'All') && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setStatusFilter('All');
                    setRoleFilter('All');
                  }}
                  className="btn btn-outline"
                >
                  <RotateCcw size={15} />
                  <span>Reset Filters</span>
                </button>
              )}
              <button
                onClick={() => setIsScheduleModalOpen(true)}
                className="btn btn-primary"
              >
                <Plus size={16} />
                <span>Schedule a Session</span>
              </button>
              <Link to="/matches" className="btn btn-outline">
                <Users size={16} />
                <span>Find Peer Matches</span>
              </Link>
            </div>
          </div>
        ) : (
          <div className="sessions-list-container">
            {filteredSessions.map((session, index) => {
              const isUserTeaching =
                session.userRole === 'Teacher' || session.teacher === user.name;
              const isUpcoming = session.status === 'Upcoming';
              const isCompleted = session.status === 'Completed';
              const isCancelled = session.status === 'Cancelled';

              return (
                <motion.div
                  key={session.id}
                  className={`session-card session-card-${session.status.toLowerCase()}`}
                  initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, x: -36 }}
                  animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, x: 0 }}
                  transition={
                    shouldReduceMotion
                      ? { duration: 0.15 }
                      : {
                          type: 'spring',
                          stiffness: 380,
                          damping: 24,
                          delay: (index % 6) * 0.08
                        }
                  }
                >
                  {/* Top Bar with Stamp Badges */}
                  <div className="session-card-top">
                    <div className="session-card-badges">
                      {/* Status Stamp Badge */}
                      {isUpcoming && (
                        <span className="status-stamp stamp-upcoming" title="Active study session">
                          <Clock size={12} className="stamp-icon" />
                          <span>UPCOMING</span>
                          <span className="stamp-seal">●</span>
                        </span>
                      )}

                      {/* Completed Stamp with Quick Stamp-Down Animation */}
                      {isCompleted && (
                        <motion.span
                          className="status-stamp stamp-completed"
                          title="Successfully completed training session"
                          initial={shouldReduceMotion ? { opacity: 1 } : { scale: 2.2, opacity: 0, rotate: -15 }}
                          animate={shouldReduceMotion ? { opacity: 1 } : { scale: 1, opacity: 1, rotate: -4 }}
                          transition={
                            shouldReduceMotion
                              ? { duration: 0.1 }
                              : {
                                  type: 'spring',
                                  stiffness: 550,
                                  damping: 18,
                                  delay: (index % 6) * 0.08 + 0.15
                                }
                          }
                        >
                          <CheckCircle2 size={13} className="stamp-icon" />
                          <span>COMPLETED</span>
                          <span className="stamp-seal">★</span>
                        </motion.span>
                      )}

                      {isCancelled && (
                        <span className="status-stamp stamp-cancelled" title="Cancelled session">
                          <XCircle size={12} className="stamp-icon" />
                          <span>CANCELLED</span>
                          <span className="stamp-seal">✕</span>
                        </span>
                      )}

                      {/* Role Stamp / Tag */}
                      {isUserTeaching ? (
                        <span className="role-stamp role-stamp-teaching">
                          <BookOpen size={12} />
                          <span>You are Teaching</span>
                        </span>
                      ) : (
                        <span className="role-stamp role-stamp-learning">
                          <GraduationCap size={12} />
                          <span>You are Learning</span>
                        </span>
                      )}

                      {/* Duration Tag */}
                      <span className="session-duration-sticker">
                        ⏱ {session.duration}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="session-id-tag font-mono font-bold">
                        {session.sessionId || session.id}
                      </span>
                    </div>
                  </div>

                  {/* Single Learning ID (names learner, teacher, and course) */}
                  <div className="flex items-center gap-2 flex-wrap my-2 text-xs">
                    <span className="text-[10.5px] font-bold text-slate-500 uppercase tracking-wide">Course Enrollment:</span>
                    <AnimeIdChip
                      id={session.learningId || (session.userRole === 'Teacher'
                        ? `LRN006-${session.teachingId || 'TCR001CRS001'}`
                        : `LRN001-${session.teachingId || 'TCR002CRS003'}`)}
                      type="LRN"
                      record={session}
                      context={{
                        skillName: session.skill || session.topic,
                        learnerName: session.learner,
                        teacherName: session.teacher,
                        isLearnerCurrentUser: session.learner === user?.name,
                        isTeacherCurrentUser: session.teacher === user?.name,
                        userName: user?.name
                      }}
                    />
                  </div>

                  {/* Skill & Topic Title */}
                  <h3 className="session-skill-title">{session.skill}</h3>
                  <p className="session-topic-text">{session.topic}</p>

                  {/* Participants Row: Teacher & Learner */}
                  <div className="session-participants-row">
                    {/* Teacher Box */}
                    <div className="participant-box">
                      <div className="participant-avatar participant-avatar-purple">
                        {session.teacherAvatar ||
                          session.teacher
                            .split(' ')
                            .map((n) => n[0])
                            .join('')
                            .slice(0, 2)}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="participant-role-tag">Mentor / Teacher</span>
                          <span className="font-mono text-[10px] text-slate-500 font-semibold">
                            {session.teacherStudentId || (session.teacher === user.name ? user.studentId : 'STU002')}
                          </span>
                        </div>
                        <div className="participant-name">
                          <span>{session.teacher}</span>
                          {session.teacher === user.name && (
                            <span className="participant-you-tag">You</span>
                          )}
                        </div>
                        <span className="participant-dept">
                          {session.teacher === user.name
                            ? user.department
                            : session.partnerDept || 'Mentor'}
                        </span>
                      </div>
                    </div>

                    {/* Learner Box */}
                    <div className="participant-box">
                      <div className="participant-avatar participant-avatar-emerald">
                        {session.learnerAvatar ||
                          session.learner
                            .split(' ')
                            .map((n) => n[0])
                            .join('')
                            .slice(0, 2)}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="participant-role-tag">Mentee / Learner</span>
                          <span className="font-mono text-[10px] text-slate-500 font-semibold">
                            {session.learnerStudentId || (session.learner === user.name ? user.studentId : 'STU001')}
                          </span>
                        </div>
                        <div className="participant-name">
                          <span>{session.learner}</span>
                          {session.learner === user.name && (
                            <span className="participant-you-tag">You</span>
                          )}
                        </div>
                        <span className="participant-dept">
                          {session.learner === user.name
                            ? user.department
                            : session.partnerDept || session.learnerDept || 'Learner'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Logistics: Date, Time, Duration, Mode */}
                  <div className="session-logistics-grid">
                    <div className="logistic-item">
                      <Calendar size={18} className="logistic-item-icon" />
                      <div className="logistic-item-text">
                        <span className="logistic-label">Date</span>
                        <span className="logistic-val">{session.date}</span>
                      </div>
                    </div>

                    <div className="logistic-item">
                      <Clock size={18} className="logistic-item-icon" />
                      <div className="logistic-item-text">
                        <span className="logistic-label">Time &amp; Duration</span>
                        <span className="logistic-val">
                          {session.time} ({session.duration})
                        </span>
                      </div>
                    </div>

                    <div className="logistic-item">
                      {session.mode === 'Google Meet' ? (
                        <Video size={18} className="logistic-item-icon text-indigo-600" />
                      ) : (
                        <MapPin size={18} className="logistic-item-icon text-emerald-600" />
                      )}
                      <div className="logistic-item-text">
                        <span className="logistic-label">Mode</span>
                        <span className="logistic-val">{session.mode}</span>
                      </div>
                    </div>

                    <div className="logistic-item">
                      <ExternalLink size={18} className="logistic-item-icon" />
                      <div className="logistic-item-text">
                        <span className="logistic-label">Meeting Room / Link</span>
                        {session.link?.startsWith('http') ? (
                          <a
                            href={session.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="logistic-val text-primary hover:underline truncate"
                            style={{ maxWidth: '160px' }}
                          >
                            Open Link ↗
                          </a>
                        ) : (
                          <span className="logistic-val truncate" style={{ maxWidth: '160px' }}>
                            {session.link || 'Campus Hub'}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Session Notes if any */}
                  {session.notes && (
                    <div className="session-notes-box">
                      <Info size={14} className="mt-0.5 text-slate-400 flex-shrink-0" />
                      <span>
                        <strong className="text-slate-800">Agenda / Notes:</strong> {session.notes}
                      </span>
                    </div>
                  )}

                  {/* Actions Bar */}
                  <div className="session-card-actions">
                    <div className="session-left-actions">
                      {/* Message Partner */}
                      <Link
                        to={`/messages?user=${encodeURIComponent(session.partnerName)}`}
                        className="btn btn-outline"
                        style={{ padding: '0.45rem 0.85rem' }}
                      >
                        <MessageSquare size={15} />
                        <span>Message {session.partnerName.split(' ')[0]}</span>
                      </Link>

                      {/* Join Meeting if Upcoming */}
                      {isUpcoming && session.link && session.link.startsWith('http') && (
                        <a
                          href={session.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-primary"
                          style={{ padding: '0.45rem 0.85rem' }}
                        >
                          <Video size={15} />
                          <span>Join Meeting</span>
                        </a>
                      )}
                    </div>

                    <div className="session-right-actions">
                      {isUpcoming && (
                        <>
                          <button
                            onClick={() => handleMarkCompleted(session)}
                            className="btn btn-outline"
                            style={{
                              color: '#15803d',
                              borderColor: '#1A1A2E',
                              backgroundColor: '#ecfdf5',
                              padding: '0.45rem 0.85rem'
                            }}
                            title="Mark this session as successfully completed"
                          >
                            <CheckCircle2 size={15} />
                            <span>Mark Completed</span>
                          </button>

                          <button
                            onClick={() => handleOpenCancelModal(session)}
                            className="btn btn-ghost"
                            style={{
                              color: '#dc2626',
                              padding: '0.45rem 0.75rem'
                            }}
                            title="Cancel this session"
                          >
                            <XCircle size={15} />
                            <span>Cancel</span>
                          </button>
                        </>
                      )}

                      {isCompleted && (
                        <button
                          onClick={() => {
                            setScheduleForm({
                              ...scheduleForm,
                              skill: session.skill,
                              partnerName: session.partnerName,
                              partnerDept: session.partnerDept || '',
                              userRole: session.userRole || 'Teacher',
                              topic: `Follow-up: Advanced ${session.skill}`
                            });
                            setIsScheduleModalOpen(true);
                          }}
                          className="btn btn-outline-primary"
                          style={{ padding: '0.45rem 0.85rem' }}
                        >
                          <Plus size={14} />
                          <span>Schedule Follow-Up</span>
                        </button>
                      )}

                      {isCancelled && (
                        <button
                          onClick={() => {
                            setScheduleForm({
                              ...scheduleForm,
                              skill: session.skill,
                              partnerName: session.partnerName,
                              partnerDept: session.partnerDept || '',
                              userRole: session.userRole || 'Teacher',
                              topic: `Re-scheduled: ${session.skill}`
                            });
                            setIsScheduleModalOpen(true);
                          }}
                          className="btn btn-primary"
                          style={{ padding: '0.45rem 0.85rem' }}
                        >
                          <RotateCcw size={14} />
                          <span>Reschedule Session</span>
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Modal: Schedule a Session */}
        {isScheduleModalOpen && (
          <div className="modal-overlay">
            <div className="modal-dialog">
              <div className="modal-header">
                <div>
                  <h3 className="font-bold text-lg">Schedule a Peer Session</h3>
                  <p className="text-xs text-muted">
                    Set up a 1-on-1 teaching or learning exchange with a fellow student.
                  </p>
                </div>
                <button
                  className="modal-close-btn"
                  onClick={() => setIsScheduleModalOpen(false)}
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleScheduleSubmit}>
                <div className="modal-body">
                  {/* Role Selection */}
                  <div className="form-group mb-4">
                    <label className="form-label font-bold">Your Role in this Session</label>
                    <div className="grid grid-cols-2 gap-3 mt-1">
                      <button
                        type="button"
                        onClick={() =>
                          setScheduleForm({
                            ...scheduleForm,
                            userRole: 'Teacher',
                            skill: user.skillsOffered?.[0]?.name || scheduleForm.skill
                          })
                        }
                        className={`p-3 rounded-lg border-2 text-left flex items-start gap-2.5 transition-all ${
                          scheduleForm.userRole === 'Teacher'
                            ? 'border-indigo-600 bg-indigo-50/70 text-indigo-900 ring-2 ring-indigo-500/20 shadow-sm'
                            : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <BookOpen size={18} className="text-indigo-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <span className="font-bold text-sm block">I am Teaching</span>
                          <span className="text-xs text-muted">
                            Share my skills with a learner
                          </span>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          setScheduleForm({
                            ...scheduleForm,
                            userRole: 'Learner',
                            skill: user.skillsWanted?.[0]?.name || 'Machine Learning with Scikit-Learn'
                          })
                        }
                        className={`p-3 rounded-lg border-2 text-left flex items-start gap-2.5 transition-all ${
                          scheduleForm.userRole === 'Learner'
                            ? 'border-emerald-600 bg-emerald-50/70 text-emerald-900 ring-2 ring-emerald-500/20 shadow-sm'
                            : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <GraduationCap size={18} className="text-emerald-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <span className="font-bold text-sm block">I am Learning</span>
                          <span className="text-xs text-muted">
                            Learn from a student mentor
                          </span>
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Skill / Subject */}
                  <div className="form-group mb-4">
                    <label className="form-label font-bold">
                      Skill / Subject <span className="text-red-500">*</span>
                    </label>
                    {scheduleForm.userRole === 'Teacher' ? (
                      <select
                        className="form-control"
                        value={scheduleForm.skill}
                        onChange={(e) =>
                          setScheduleForm({ ...scheduleForm, skill: e.target.value })
                        }
                        required
                      >
                        {user.skillsOffered?.map((sk) => (
                          <option key={sk.id} value={sk.name}>
                            {sk.name} ({sk.category})
                          </option>
                        ))}
                        <option value="Custom Topic">Other / Custom Topic</option>
                      </select>
                    ) : (
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. Applied Machine Learning, Docker, C Pointers"
                        value={scheduleForm.skill}
                        onChange={(e) =>
                          setScheduleForm({ ...scheduleForm, skill: e.target.value })
                        }
                        required
                      />
                    )}
                  </div>

                  {/* Specific Topic / Goal */}
                  <div className="form-group mb-4">
                    <label className="form-label font-bold">Specific Topic / Objective</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Custom React Hooks & Context API for State Management"
                      value={scheduleForm.topic}
                      onChange={(e) =>
                        setScheduleForm({ ...scheduleForm, topic: e.target.value })
                      }
                    />
                  </div>

                  {/* Partner Details */}
                  <div className="form-group-row mb-4">
                    <div className="form-group">
                      <label className="form-label font-bold">
                        Partner Student Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. Aarav Mehta, Rashi Chandani"
                        value={scheduleForm.partnerName}
                        onChange={(e) =>
                          setScheduleForm({ ...scheduleForm, partnerName: e.target.value })
                        }
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label font-bold">Partner Department / Year</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. Computer Science · 2nd Year"
                        value={scheduleForm.partnerDept}
                        onChange={(e) =>
                          setScheduleForm({ ...scheduleForm, partnerDept: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  {/* Date & Time */}
                  <div className="form-group-row mb-4">
                    <div className="form-group">
                      <label className="form-label font-bold">
                        Date <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        className="form-control"
                        value={scheduleForm.date}
                        onChange={(e) =>
                          setScheduleForm({ ...scheduleForm, date: e.target.value })
                        }
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label font-bold">Time Window</label>
                      <select
                        className="form-control"
                        value={scheduleForm.time}
                        onChange={(e) =>
                          setScheduleForm({ ...scheduleForm, time: e.target.value })
                        }
                      >
                        <option value="10:00 AM – 11:00 AM">10:00 AM – 11:00 AM</option>
                        <option value="11:30 AM – 12:30 PM">11:30 AM – 12:30 PM</option>
                        <option value="2:00 PM – 3:00 PM">2:00 PM – 3:00 PM</option>
                        <option value="4:00 PM – 5:00 PM">4:00 PM – 5:00 PM</option>
                        <option value="5:30 PM – 6:45 PM">5:30 PM – 6:45 PM</option>
                        <option value="6:00 PM – 7:00 PM">6:00 PM – 7:00 PM</option>
                        <option value="7:00 PM – 8:00 PM">7:00 PM – 8:00 PM</option>
                      </select>
                    </div>
                  </div>

                  {/* Duration & Mode */}
                  <div className="form-group-row mb-4">
                    <div className="form-group">
                      <label className="form-label font-bold">Duration</label>
                      <select
                        className="form-control"
                        value={scheduleForm.duration}
                        onChange={(e) =>
                          setScheduleForm({ ...scheduleForm, duration: e.target.value })
                        }
                      >
                        <option value="30 mins">30 mins</option>
                        <option value="45 mins">45 mins</option>
                        <option value="60 mins">60 mins (Standard)</option>
                        <option value="75 mins">75 mins</option>
                        <option value="90 mins">90 mins</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label font-bold">Session Mode</label>
                      <select
                        className="form-control"
                        value={scheduleForm.mode}
                        onChange={(e) =>
                          setScheduleForm({
                            ...scheduleForm,
                            mode: e.target.value,
                            link:
                              e.target.value === 'Google Meet'
                                ? 'https://meet.google.com/4s-study-room'
                                : 'Campus Library Hub Study Room 3B'
                          })
                        }
                      >
                        <option value="Google Meet">Google Meet (Online)</option>
                        <option value="Campus Library Hub">Campus Library Hub (In-Person)</option>
                        <option value="CS Department Lab">CS Department Lab (In-Person)</option>
                        <option value="Zoom">Zoom (Online)</option>
                      </select>
                    </div>
                  </div>

                  {/* Meeting Room / Link */}
                  <div className="form-group mb-4">
                    <label className="form-label font-bold">Meeting Link or Location Room</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="https://meet.google.com/... or Study Room 3B"
                      value={scheduleForm.link}
                      onChange={(e) =>
                        setScheduleForm({ ...scheduleForm, link: e.target.value })
                      }
                    />
                  </div>

                  {/* Agenda / Notes */}
                  <div className="form-group">
                    <label className="form-label font-bold">Preparation Notes &amp; Agenda</label>
                    <textarea
                      className="form-control"
                      rows={2}
                      placeholder="What should both students prepare? (e.g. have Node installed, read chapter 4, bring laptop)"
                      value={scheduleForm.notes}
                      onChange={(e) =>
                        setScheduleForm({ ...scheduleForm, notes: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-outline"
                    onClick={() => setIsScheduleModalOpen(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    <CheckCircle2 size={16} />
                    <span>Confirm &amp; Schedule Session</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: Confirm Session Cancellation */}
        {cancelModalSession && (
          <div className="modal-overlay">
            <div className="modal-dialog" style={{ maxWidth: '450px' }}>
              <div className="modal-header">
                <h3 className="font-bold text-lg text-rose-600 flex items-center gap-2">
                  <AlertCircle size={20} />
                  <span>Cancel Study Session</span>
                </h3>
                <button
                  className="modal-close-btn"
                  onClick={() => setCancelModalSession(null)}
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleConfirmCancel}>
                <div className="modal-body">
                  <p className="text-sm text-slate-700 mb-3">
                    Are you sure you want to cancel the session for{' '}
                    <strong>{cancelModalSession.skill}</strong> with{' '}
                    <strong>{cancelModalSession.partnerName}</strong> scheduled for{' '}
                    <strong>{cancelModalSession.date}</strong>?
                  </p>

                  <div className="form-group">
                    <label className="form-label font-bold">
                      Reason for cancellation (optional):
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Schedule conflict with exams, ill, etc."
                      value={cancelReason}
                      onChange={(e) => setCancelReason(e.target.value)}
                    />
                  </div>
                </div>

                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-outline"
                    onClick={() => setCancelModalSession(null)}
                  >
                    Keep Session
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    style={{ backgroundColor: '#dc2626', borderColor: '#b91c1c' }}
                  >
                    Yes, Cancel Session
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

export default Sessions;
