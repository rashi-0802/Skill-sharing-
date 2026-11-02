import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import {
  Star,
  MessageSquare,
  Plus,
  CheckCircle2,
  Calendar,
  BookOpen,
  GraduationCap,
  Users,
  Filter,
  X,
  AlertCircle,
  Clock,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { useAuth, addUserReview } from '../utils/auth.js';
import AnimeIdChip from '../components/AnimeIdChip.jsx';
import { getOrAssignTeacherCourse } from '../utils/idEngine.js';
import './RatingsFeedback.css';

const RatingsFeedback = () => {
  const { user, reviews, sessions } = useAuth();
  const shouldReduceMotion = useReducedMotion();

  const [filterRole, setFilterRole] = useState('All'); // 'All', 'Learner', 'Teacher'
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Review Form State
  const [formAuthor, setFormAuthor] = useState('Sneha Rao');
  const [formAuthorRole, setFormAuthorRole] = useState('Learner');
  const [formRating, setFormRating] = useState(5);
  const [formHoverRating, setFormHoverRating] = useState(0);
  const [formSkill, setFormSkill] = useState(
    user.skillsOffered?.[0]?.name || 'Database Systems & SQL Optimization'
  );
  const [formComment, setFormComment] = useState('');
  const [formError, setFormError] = useState('');

  // Rating interaction feedback: chosen star sparkle burst & screen pulse
  const [sparkleRatingTrigger, setSparkleRatingTrigger] = useState(null);
  const [isScreenPulsing, setIsScreenPulsing] = useState(false);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Filtered Reviews
  const filteredReviews = useMemo(() => {
    return reviews.filter((r) => {
      if (filterRole === 'All') return true;
      return r.authorRole === filterRole;
    });
  }, [reviews, filterRole]);

  // Overall Statistics Calculation
  const totalReviewsCount = reviews.length;
  const averageRating =
    totalReviewsCount > 0
      ? (
          reviews.reduce((acc, r) => acc + (Number(r.rating) || 5), 0) /
          totalReviewsCount
        ).toFixed(2)
      : '5.00';

  // Star Distribution
  const starCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  reviews.forEach((r) => {
    const star = Math.round(Number(r.rating) || 5);
    if (starCounts[star] !== undefined) {
      starCounts[star] += 1;
    }
  });

  const handleOpenModal = () => {
    setFormAuthor('Sneha Rao');
    setFormAuthorRole('Learner');
    setFormRating(5);
    setFormSkill(user.skillsOffered?.[0]?.name || 'React.js & Frontend Architecture');
    setFormComment('');
    setFormError('');
    setSparkleRatingTrigger(5);
    setIsSubmitModalOpen(true);
  };

  // Handle star click with pop, sparkles burst, and screen pulse
  const handleSelectStar = (starVal) => {
    setFormRating(starVal);
    setSparkleRatingTrigger(starVal);

    if (!shouldReduceMotion) {
      setIsScreenPulsing(true);
      setTimeout(() => {
        setIsScreenPulsing(false);
      }, 350);
    }
  };

  const handleSubmitReview = (e) => {
    e.preventDefault();
    setFormError('');

    if (!formAuthor.trim()) {
      setFormError('Please enter reviewer name.');
      return;
    }
    if (!formSkill.trim()) {
      setFormError('Please select or specify the session skill/topic.');
      return;
    }
    if (formRating < 1 || formRating > 5) {
      setFormError('Please select a star rating between 1 and 5.');
      return;
    }
    if (!formComment.trim() || formComment.trim().length < 10) {
      setFormError('Feedback comment must be at least 10 characters long.');
      return;
    }

    addUserReview({
      author: formAuthor.trim(),
      authorRole: formAuthorRole,
      rating: formRating,
      skill: formSkill.trim(),
      comment: formComment.trim(),
      sessionDate: new Date().toISOString().split('T')[0]
    });

    setIsSubmitModalOpen(false);
    showToast('Feedback submitted successfully! Your peer rating has been updated.');
  };

  return (
    <div className={`ratings-page ${isScreenPulsing ? 'screen-pulse-active' : ''}`}>
      <div className="container">
        {/* Floating Toast Notification */}
        {toastMessage && (
          <div className="app-toast-alert">
            <CheckCircle2 size={18} className="text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Page Header */}
        <div className="ratings-header">
          <span className="ratings-kicker">
            <Star size={14} fill="#d97706" />
            <span>Trust &amp; Peer Quality</span>
          </span>
          <h1 className="ratings-title">Ratings &amp; Student Feedback</h1>
          <p className="ratings-subtitle">
            Transparent evaluations received from fellow students after 1-on-1 teaching and learning sessions on 4S. Quality ratings help maintain high teaching standards across campus.
          </p>
        </div>

        {/* 1. Overall Rating Summary Card */}
        <div className="rating-summary-card">
          <div className="rating-score-block">
            <div className="rating-score-num">{averageRating}</div>
            <div className="rating-stars-row">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={20}
                  fill={i < Math.round(Number(averageRating)) ? '#f59e0b' : 'none'}
                  color="#1A1A2E"
                  strokeWidth={2}
                  className="summary-star-icon"
                />
              ))}
            </div>
            <div className="rating-total-text">
              Based on {totalReviewsCount} student review{totalReviewsCount !== 1 ? 's' : ''}
            </div>
          </div>

          {/* Star Distribution Bars */}
          <div className="rating-bars-list">
            {[5, 4, 3, 2, 1].map((stars) => {
              const count = starCounts[stars] || 0;
              const pct = totalReviewsCount > 0 ? (count / totalReviewsCount) * 100 : 0;

              return (
                <div key={stars} className="rating-bar-row">
                  <span className="bar-star-label">{stars} stars</span>
                  <div className="bar-track">
                    <div className="bar-fill" style={{ width: `${pct}%` }}></div>
                  </div>
                  <span className="bar-pct">{count}</span>
                </div>
              );
            })}
          </div>

          {/* Submit Action */}
          <div>
            <button onClick={handleOpenModal} className="btn btn-primary" style={{ flexShrink: 0 }}>
              <Plus size={16} />
              <span>Submit Session Rating</span>
            </button>
          </div>
        </div>

        {/* 2. Controls & Filter Bar */}
        <div className="reviews-controls-bar">
          <div className="review-filter-tabs">
            <button
              className={`review-tab-btn ${filterRole === 'All' ? 'active' : ''}`}
              onClick={() => setFilterRole('All')}
            >
              All Reviews ({reviews.length})
            </button>
            <button
              className={`review-tab-btn ${filterRole === 'Learner' ? 'active' : ''}`}
              onClick={() => setFilterRole('Learner')}
            >
              From Mentees (Teaching Sessions)
            </button>
            <button
              className={`review-tab-btn ${filterRole === 'Teacher' ? 'active' : ''}`}
              onClick={() => setFilterRole('Teacher')}
            >
              From Mentors (Learning Sessions)
            </button>
          </div>

          <div className="text-xs text-muted font-bold">
            Showing {filteredReviews.length} verified review{filteredReviews.length !== 1 ? 's' : ''}
          </div>
        </div>

        {/* 3. Reviews Grid */}
        <div className="reviews-grid">
          {filteredReviews.map((rev) => (
            <div key={rev.id} className="review-card">
              <div>
                <div className="review-card-header">
                  <div className="reviewer-profile">
                    <div className="reviewer-avatar">
                      {rev.author
                        .split(' ')
                        .map((n) => n[0])
                        .join('')
                        .slice(0, 2)}
                    </div>
                    <div>
                      <h4 className="reviewer-name">{rev.author}</h4>
                      <span
                        className={`reviewer-role-badge ${
                          rev.authorRole === 'Teacher' ? 'badge-teacher' : 'badge-learner'
                        }`}
                      >
                        {rev.authorRole === 'Teacher' ? 'Student Mentor' : 'Peer Learner'}
                      </span>
                    </div>
                  </div>

                  <div className="review-stars">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        fill={i < rev.rating ? '#f59e0b' : 'none'}
                        color="#1A1A2E"
                        strokeWidth={2}
                      />
                    ))}
                  </div>
                </div>

                <div className="review-skill-chip flex items-center gap-2 flex-wrap">
                  <span>📚 Skill / Topic: <strong>{rev.skill}</strong></span>
                  {(() => {
                    const teacherStuId = rev.authorRole === 'Teacher' ? 'STU002' : user?.studentId || 'STU001';
                    const tcrId = rev.teachingId && /^TCR\d{3,4}CRS\d{3,4}$/.test(rev.teachingId)
                      ? rev.teachingId
                      : getOrAssignTeacherCourse(teacherStuId, rev.skill);

                    return (
                      <AnimeIdChip
                        type="TCR"
                        id={tcrId}
                        record={{ name: rev.skill, teacher: rev.authorRole === 'Teacher' ? rev.author : user?.name }}
                        context={{
                          userName: user?.name,
                          teacherName: rev.authorRole === 'Teacher' ? rev.author : user?.name,
                          name: rev.skill
                        }}
                      />
                    );
                  })()}
                </div>

                <p className="review-comment-text">"{rev.comment}"</p>
              </div>

              <div className="review-footer-row">
                <span className="flex items-center gap-1 font-bold">
                  <Clock size={12} />
                  <span>{rev.date}</span>
                </span>
                <span className="review-verified-tag">✓ Verified 4S Session</span>
              </div>
            </div>
          ))}
        </div>

        {/* Modal: Submit Feedback Form */}
        {isSubmitModalOpen && (
          <div className="profile-modal-overlay" onClick={() => setIsSubmitModalOpen(false)}>
            <motion.div
              className={`profile-modal-card ${isScreenPulsing ? 'modal-pulse-effect' : ''}`}
              style={{ maxWidth: '520px' }}
              onClick={(e) => e.stopPropagation()}
              initial={shouldReduceMotion ? { opacity: 0 } : { scale: 0.94, opacity: 0 }}
              animate={shouldReduceMotion ? { opacity: 1 } : { scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 450, damping: 24 }}
            >
              <div className="modal-header">
                <div>
                  <h3 className="font-bold text-lg text-slate-900">
                    Submit Session Feedback
                  </h3>
                  <p className="text-xs text-muted">
                    Leave a peer rating and review after a completed knowledge exchange.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsSubmitModalOpen(false)}
                  className="modal-close-btn"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmitReview}>
                <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
                  {formError && (
                    <div className="modal-error-box">
                      <AlertCircle size={15} />
                      <span>{formError}</span>
                    </div>
                  )}

                  {/* Reviewer Role Selection */}
                  <div className="form-group">
                    <label className="form-label font-bold">Feedback Type</label>
                    <div className="grid grid-cols-2 gap-3 mt-1">
                      <button
                        type="button"
                        onClick={() => setFormAuthorRole('Learner')}
                        className={`p-3 rounded-lg border-2 text-left flex items-start gap-2.5 transition-all ${
                          formAuthorRole === 'Learner'
                            ? 'border-indigo-600 bg-indigo-50/70 text-indigo-900 ring-2 ring-indigo-500/20 shadow-sm'
                            : 'border-slate-200 bg-slate-50 text-slate-700'
                        }`}
                      >
                        <GraduationCap size={16} className="text-indigo-600 mt-0.5" />
                        <div>
                          <span className="font-bold text-xs block">Learner Review</span>
                          <span className="text-xs text-muted">Rate your mentor</span>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setFormAuthorRole('Teacher')}
                        className={`p-3 rounded-lg border-2 text-left flex items-start gap-2.5 transition-all ${
                          formAuthorRole === 'Teacher'
                            ? 'border-purple-600 bg-purple-50/70 text-purple-900 ring-2 ring-purple-500/20 shadow-sm'
                            : 'border-slate-200 bg-slate-50 text-slate-700'
                        }`}
                      >
                        <BookOpen size={16} className="text-purple-600 mt-0.5" />
                        <div>
                          <span className="font-bold text-xs block">Mentor Review</span>
                          <span className="text-xs text-muted">Rate your learner</span>
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Reviewer Name */}
                  <div className="form-group">
                    <label className="form-label font-bold">
                      Reviewer Student Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      value={formAuthor}
                      onChange={(e) => setFormAuthor(e.target.value)}
                      placeholder="e.g. Sneha Rao, Rohan Verma, Aarav Mehta"
                      required
                    />
                  </div>

                  {/* Skill / Session Topic */}
                  <div className="form-group">
                    <label className="form-label font-bold">
                      Skill / Session Topic <span className="text-red-500">*</span>
                    </label>
                    <select
                      className="form-control"
                      value={formSkill}
                      onChange={(e) => setFormSkill(e.target.value)}
                      required
                    >
                      {user.skillsOffered?.map((s) => (
                        <option key={s.id} value={s.name}>
                          {s.name} ({s.category})
                        </option>
                      ))}
                      {user.skillsWanted?.map((w) => (
                        <option key={w.id} value={w.name}>
                          {w.name} ({w.category})
                        </option>
                      ))}
                      <option value="General Peer Study Session">General Peer Study Session</option>
                    </select>
                  </div>

                  {/* Interactive Star Rating with One-by-One Pop & Sparkles Burst */}
                  <div className="form-group">
                    <label className="form-label font-bold flex items-center justify-between">
                      <span>Star Rating:</span>
                      <span className="star-rating-pill">
                        {formRating} of 5 Stars
                      </span>
                    </label>

                    <div className="interactive-stars-picker mt-1" role="radiogroup" aria-label="Select star rating">
                      {[1, 2, 3, 4, 5].map((starVal) => {
                        const filled =
                          formHoverRating >= starVal ||
                          (!formHoverRating && formRating >= starVal);
                        const isChosen = formRating === starVal;

                        return (
                          <div key={starVal} className="star-btn-wrapper">
                            <motion.button
                              type="button"
                              className={`star-btn ${filled ? 'star-filled' : 'star-empty'}`}
                              onMouseEnter={() => setFormHoverRating(starVal)}
                              onMouseLeave={() => setFormHoverRating(0)}
                              onClick={() => handleSelectStar(starVal)}
                              aria-label={`Rate ${starVal} stars`}
                              animate={
                                shouldReduceMotion
                                  ? { scale: 1 }
                                  : filled
                                  ? { scale: [1, 1.32, 1] }
                                  : { scale: 1 }
                              }
                              transition={
                                shouldReduceMotion
                                  ? { duration: 0.1 }
                                  : {
                                      duration: 0.28,
                                      ease: 'easeOut',
                                      delay: (starVal - 1) * 0.05
                                    }
                              }
                            >
                              <Star
                                size={32}
                                fill={filled ? '#FFD23F' : '#ffffff'}
                                stroke="#1A1A2E"
                                strokeWidth={2.2}
                                className="star-svg-glyph"
                              />
                            </motion.button>

                            {/* Sparkle burst particles on chosen rating */}
                            {!shouldReduceMotion && isChosen && sparkleRatingTrigger === starVal && (
                              <motion.div
                                className="chosen-star-sparkle-burst"
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: [0, 1.4, 0], opacity: [0, 1, 0] }}
                                transition={{ duration: 0.55, ease: 'easeOut' }}
                                aria-hidden="true"
                              >
                                <span className="sparkle-particle p1">✨</span>
                                <span className="sparkle-particle p2">✦</span>
                                <span className="sparkle-particle p3">★</span>
                                <span className="sparkle-particle p4">✦</span>
                              </motion.div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Feedback Comment */}
                  <div className="form-group">
                    <label className="form-label font-bold">
                      Feedback Comment <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      className="form-control"
                      rows={3}
                      value={formComment}
                      onChange={(e) => setFormComment(e.target.value)}
                      placeholder="Share your experience: How clearly were concepts explained? Were practical examples used? Did the session start on time?"
                      required
                    />
                    <span className="text-xs text-muted">
                      Minimum 10 characters ({formComment.length}/10)
                    </span>
                  </div>
                </div>

                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-outline"
                    onClick={() => setIsSubmitModalOpen(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    <CheckCircle2 size={16} />
                    <span>Submit Feedback</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RatingsFeedback;
