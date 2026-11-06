import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  BookmarkPlus,
  Plus,
  Edit2,
  Trash2,
  Users,
  CheckCircle2,
  X,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Tag,
  Sparkles,
  Layers,
  Copy,
  Check
} from 'lucide-react';
import { ALL_CATEGORIES, SKILL_LEVELS, resolveOrAddCourse, getCourseById, formatDisplayId } from '../utils/mockData.js';
import {
  useAuth,
  addUserRequest,
  updateUserRequest,
  deleteUserRequest
} from '../utils/auth.js';
import MangaCard from '../components/MangaCard.jsx';
import PowerLevelMeter from '../components/PowerLevelMeter.jsx';
import AnimeIdChip from '../components/AnimeIdChip.jsx';
import { getCategoryAccentColor } from '../utils/categoryColors.js';
import './LearningRequests.css';

const PREFERRED_LEVEL_OPTIONS = ['Beginner', 'Intermediate', 'Advanced', 'Mastery'];
const CURRENT_LEVEL_OPTIONS = ['None / Beginner', 'Beginner', 'Intermediate', 'Advanced'];
const STATUS_OPTIONS = ['Open', 'Matched', 'Completed'];

const LearningRequests = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [requests, setRequests] = useState(user.skillsWanted || []);
  const [statusFilter, setStatusFilter] = useState('All');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRequest, setEditingRequest] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);
  const [copiedToast, setCopiedToast] = useState(false);

  const showToast = (msg) => {
    setToastMessage(msg);
    setCopiedToast(false);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  useEffect(() => {
    if (user?.skillsWanted) {
      setRequests(user.skillsWanted);
    }
  }, [user]);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    category: 'Data Science',
    currentLevel: 'Beginner',
    preferredLevel: 'Advanced',
    targetGoal: '',
    status: 'Open'
  });
  const [formErrors, setFormErrors] = useState({});

  const handleOpenAdd = () => {
    setEditingRequest(null);
    setFormData({
      name: '',
      category: 'Data Science',
      currentLevel: 'Beginner',
      preferredLevel: 'Advanced',
      targetGoal: '',
      status: 'Open'
    });
    setFormErrors({});
    setModalOpen(true);
  };

  const handleOpenEdit = (req) => {
    setEditingRequest(req);
    setFormData({
      name: req.name,
      category: req.category,
      currentLevel: req.currentLevel || 'Beginner',
      preferredLevel: req.preferredLevel || 'Advanced',
      targetGoal: req.targetGoal,
      status: req.status || 'Open'
    });
    setFormErrors({});
    setModalOpen(true);
  };

  const validateForm = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Skill name is required';
    if (!formData.targetGoal.trim()) {
      errs.targetGoal = 'Please specify your learning goal or project objective';
    } else if (formData.targetGoal.trim().length < 15) {
      errs.targetGoal = 'Goal description should be at least 15 characters';
    }
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (editingRequest) {
      const updated = {
        ...editingRequest,
        name: formData.name.trim(),
        category: formData.category,
        currentLevel: formData.currentLevel,
        preferredLevel: formData.preferredLevel,
        targetGoal: formData.targetGoal.trim(),
        status: formData.status
      };
      const updatedList = updateUserRequest(updated);
      setRequests([...updatedList]);
      showToast('Learning request updated.');
    } else {
      const newReq = {
        name: formData.name.trim(),
        category: formData.category,
        currentLevel: formData.currentLevel,
        preferredLevel: formData.preferredLevel,
        targetGoal: formData.targetGoal.trim(),
        status: formData.status,
        matchesAvailable: 5
      };
      const updatedList = addUserRequest(newReq);
      setRequests([...updatedList]);
      const createdItem = updatedList[0];
      if (createdItem?.status === 'Matched' && createdItem?.learningId && createdItem?.learningId !== 'AWAITING_TEACHER') {
        showToast({
          text: `Learning ID ${createdItem.learningId} created`,
          copyId: createdItem.learningId
        });
      } else {
        showToast('Learning request created! Awaiting teacher match.');
      }
    }

    setModalOpen(false);
  };

  const handleDelete = (reqId) => {
    const target = requests.find((r) => r.id === reqId);
    const updatedList = deleteUserRequest(reqId);
    setRequests([...updatedList]);
    setDeleteConfirmId(null);
    showToast('Learning request deleted.');
  };

  // Filter requests by status tab
  const filteredRequests = statusFilter === 'All'
    ? requests
    : requests.filter((r) => (r.status || 'Open').toLowerCase() === statusFilter.toLowerCase());

  const selectableCategories = ALL_CATEGORIES.filter((c) => c !== 'All');

  // Stats calculation
  const openCount = requests.filter((r) => (r.status || 'Open') === 'Open').length;
  const matchedCount = requests.filter((r) => r.status === 'Matched').length;
  const completedCount = requests.filter((r) => r.status === 'Completed').length;

  return (
    <div className="requests-page">
      <div className="container">
        {/* Toast Notification with Copy Button */}
        {toastMessage && (
          <div
            style={{
              position: 'fixed',
              bottom: '24px',
              right: '24px',
              backgroundColor: '#1e1b4b',
              color: '#ffffff',
              padding: '12px 18px',
              borderRadius: '8px',
              border: '2px solid #0284c7',
              boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              zIndex: 9999,
              fontSize: '13px',
              fontWeight: 600
            }}
          >
            <CheckCircle2 size={18} className="text-emerald-400 flex-shrink-0" />
            <span>{typeof toastMessage === 'string' ? toastMessage : toastMessage.text}</span>
            {toastMessage?.copyId && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  navigator.clipboard?.writeText(toastMessage.copyId);
                  setCopiedToast(true);
                  setTimeout(() => setCopiedToast(false), 2000);
                }}
                className="btn btn-sm"
                style={{
                  padding: '3px 8px',
                  fontSize: '11px',
                  backgroundColor: '#ffffff',
                  color: '#0369a1',
                  border: '1.5px solid #0369a1',
                  boxShadow: '1.5px 1.5px 0px #0369a1',
                  borderRadius: '4px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
                aria-label={`Copy ${toastMessage.copyId}`}
              >
                {copiedToast ? <Check size={11} className="text-emerald-600" /> : <Copy size={11} />}
                <span>{copiedToast ? 'Copied!' : 'Copy'}</span>
              </button>
            )}
          </div>
        )}

        {/* Page Header */}
        <div className="requests-header">
          <div className="requests-title-group">
            <h1>My Learning Requests</h1>
            <p>
              List the skills, tools, or topics you want to learn from fellow campus peers. Connect with student mentors who can guide you.
            </p>
          </div>

          <button onClick={handleOpenAdd} className="btn btn-primary">
            <Plus size={18} />
            <span>New Learning Request</span>
          </button>
        </div>

        {/* Stats Banner */}
        <div className="requests-stats-banner">
          <div className="banner-stats-row">
            <div className="stat-item">
              <span className="stat-val">{requests.length}</span>
              <span className="stat-lbl">Total Learning Goals</span>
            </div>
            <div className="stat-item">
              <span className="stat-val text-blue-600">{openCount}</span>
              <span className="stat-lbl">Open Requests</span>
            </div>
            <div className="stat-item">
              <span className="stat-val text-emerald-600">{matchedCount}</span>
              <span className="stat-lbl">Matched with Peers</span>
            </div>
            <div className="stat-item">
              <span className="stat-val text-slate-500">{completedCount}</span>
              <span className="stat-lbl">Skills Mastered</span>
            </div>
          </div>

          <Link to="/matches" className="btn btn-sm btn-outline">
            <Users size={14} />
            <span>View All Matches</span>
          </Link>
        </div>

        {/* Filters Bar */}
        <div className="requests-filters-bar">
          <div className="status-tabs-group">
            {['All', 'Open', 'Matched', 'Completed'].map((tab) => (
              <button
                key={tab}
                type="button"
                className={`status-tab-btn ${statusFilter === tab ? 'active' : ''}`}
                onClick={() => setStatusFilter(tab)}
              >
                {tab} ({tab === 'All' ? requests.length : tab === 'Open' ? openCount : tab === 'Matched' ? matchedCount : completedCount})
              </button>
            ))}
          </div>

          <span className="text-sm text-muted">
            Showing <strong>{filteredRequests.length}</strong> {filteredRequests.length === 1 ? 'request' : 'requests'}
          </span>
        </div>

        {/* Requests Cards Grid */}
        {filteredRequests.length > 0 ? (
          <div className="requests-cards-grid">
            {filteredRequests.map((req, index) => {
              const status = req.status || 'Open';
              const priority = req.priority || (status === 'Open' ? (index % 3 === 0 ? 'High' : index % 3 === 1 ? 'Medium' : 'Low') : 'Low');
              return (
                <MangaCard
                  key={req.id}
                  index={index}
                  isDashed={true}
                  accentColor={getCategoryAccentColor(req.category, index)}
                  cornerLabel={req.category}
                  className="request-card"
                >
                  <div>
                    {/* Top Row: Category, Status, Priority, Actions */}
                    <div className="request-card-top">
                      <div className="request-tags-left">
                        <span className="skill-category-badge">{req.category}</span>
                        <span className={`status-pill status-${status.toLowerCase()}`}>
                          {status}
                        </span>
                        <span className={`priority-badge priority-${priority.toLowerCase()}`}>
                          <span className="priority-pulse-dot" aria-hidden="true"></span>
                          <span>{priority}</span>
                        </span>
                      </div>

                      <div className="request-actions-right">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(req)}
                          className="req-action-icon-btn"
                          title="Edit Request"
                          aria-label={`Edit ${req.name}`}
                        >
                          <Edit2 size={15} />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteConfirmId(req.id)}
                          className="req-action-icon-btn btn-delete"
                          title="Delete Request"
                          aria-label={`Delete ${req.name}`}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap my-1.5 text-xs">
                      {req.status === 'Matched' ? (
                        <AnimeIdChip
                          id={req.learningId}
                          type="LRN"
                          size="md"
                          record={req}
                          context={{
                            userName: user?.name,
                            isLearnerCurrentUser: true,
                            skillName: req.name,
                            teacherName: req.teacherName || 'Devansh Parekh'
                          }}
                        />
                      ) : (
                        <AnimeIdChip
                          id="AWAITING_TEACHER"
                          size="md"
                          record={req}
                          context={{ skillName: req.name }}
                        />
                      )}
                    </div>

                    <h3 className="request-skill-name">{req.name}</h3>

                    {/* Skill Progression Row with PowerLevelMeter */}
                    <div className="request-level-progression" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap', margin: '0.6rem 0' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                        <span className="text-xs text-muted">Current:</span>
                        <PowerLevelMeter level={req.currentLevel || 'Beginner'} />
                      </div>
                      <ArrowRight size={13} className="text-primary flex-shrink-0" />
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                        <span className="text-xs text-muted">Target:</span>
                        <PowerLevelMeter level={req.preferredLevel || 'Advanced'} />
                      </div>
                    </div>

                    <p className="request-goal-desc">{req.targetGoal}</p>
                  </div>

                  {/* Footer Actions */}
                  <div className="request-card-footer">
                    <span className="text-xs text-muted flex items-center gap-1">
                      <Sparkles size={14} className="text-secondary" />
                      <span>Peers teaching this skill available</span>
                    </span>

                    <button
                      type="button"
                      onClick={() => navigate(`/matches?skill=${encodeURIComponent(req.name)}`)}
                      className="btn btn-sm btn-primary"
                    >
                      <Users size={14} />
                      <span>Find Matches</span>
                    </button>
                  </div>
                </MangaCard>
              );
            })}
          </div>
        ) : (
          /* Empty State */
          <div className="requests-empty-card">
            <div className="empty-req-icon">
              <BookmarkPlus size={32} />
            </div>
            <h3 className="empty-req-title">
              {statusFilter === 'All' ? 'No Learning Requests Listed Yet' : `No ${statusFilter} Requests Found`}
            </h3>
            <p className="empty-req-desc">
              Tell campus peers what you want to master—from machine learning algorithms to Docker containers or public speaking. Other students will reach out to teach you!
            </p>
            <button onClick={handleOpenAdd} className="btn btn-primary">
              <Plus size={16} />
              <span>Create Your First Request</span>
            </button>
          </div>
        )}
      </div>

      {/* ------------------------------------------------------------------
          Add / Edit Learning Request Modal
          ------------------------------------------------------------------ */}
      {modalOpen && (
        <div className="modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="modal-card" style={{ maxWidth: '580px' }} onClick={(e) => e.stopPropagation()}>
            <form onSubmit={handleSubmit}>
              <div className="modal-header">
                <h3>{editingRequest ? 'Edit Learning Request' : 'Create Learning Request'}</h3>
                <button
                  type="button"
                  className="modal-close-btn"
                  onClick={() => setModalOpen(false)}
                  aria-label="Close modal"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="modal-body">
                {/* Skill Name */}
                <div className="form-group">
                  <label className="form-label" htmlFor="req-name">
                    Skill You Want to Learn
                  </label>
                  <input
                    id="req-name"
                    type="text"
                    className={`form-input ${formErrors.name ? 'input-error' : ''}`}
                    placeholder="e.g. Machine Learning with Scikit-Learn, Docker Basics, C Pointers"
                    value={formData.name}
                    onChange={(e) => {
                      setFormData({ ...formData, name: e.target.value });
                      if (formErrors.name) setFormErrors({ ...formErrors, name: null });
                    }}
                  />
                  {formErrors.name && <span className="form-error-msg">{formErrors.name}</span>}

                  {/* ID Relationship & Auto-Resolution Preview */}
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-1.5 my-3">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-700">Course Identifier (Shared):</span>
                      <span className="font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        {formData.name.trim() ? resolveOrAddCourse(formData.name, formData.category) : (editingRequest?.courseId || 'CRS001')}
                      </span>
                    </div>
                    <p className="text-slate-500 text-[11px] leading-tight">
                      Shared Course ID used across all students. The matching engine connects your Learning ID with peer mentors teaching this Course ID.
                    </p>
                    <div className="flex items-center justify-between pt-1 border-t border-slate-200">
                      <span className="font-semibold text-slate-700">Learning Record ID:</span>
                      <span className="font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                        {editingRequest ? (editingRequest.learningId || editingRequest.id) : 'Auto-generated upon save (e.g. LRN...)'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Category & Status (Grid) */}
                <div className="modal-form-grid">
                  <div className="form-group">
                    <label className="form-label" htmlFor="req-category">
                      Category
                    </label>
                    <select
                      id="req-category"
                      className="form-input"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    >
                      {selectableCategories.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="req-status">
                      Request Status
                    </label>
                    <select
                      id="req-status"
                      className="form-input"
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    >
                      {STATUS_OPTIONS.map((st) => (
                        <option key={st} value={st}>
                          {st}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Current Level & Preferred Level (Grid) */}
                <div className="modal-form-grid">
                  <div className="form-group">
                    <label className="form-label" htmlFor="req-curr-level">
                      Your Current Skill Level
                    </label>
                    <select
                      id="req-curr-level"
                      className="form-input"
                      value={formData.currentLevel}
                      onChange={(e) => setFormData({ ...formData, currentLevel: e.target.value })}
                    >
                      {CURRENT_LEVEL_OPTIONS.map((lvl) => (
                        <option key={lvl} value={lvl}>
                          {lvl}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="req-pref-level">
                      Preferred Target Level
                    </label>
                    <select
                      id="req-pref-level"
                      className="form-input"
                      value={formData.preferredLevel}
                      onChange={(e) => setFormData({ ...formData, preferredLevel: e.target.value })}
                    >
                      {PREFERRED_LEVEL_OPTIONS.map((lvl) => (
                        <option key={lvl} value={lvl}>
                          {lvl}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Short Learning Goal Description */}
                <div className="form-group">
                  <label className="form-label" htmlFor="req-goal">
                    Short Learning Goal & Context
                  </label>
                  <textarea
                    id="req-goal"
                    rows={4}
                    className={`form-input ${formErrors.targetGoal ? 'input-error' : ''}`}
                    placeholder="Describe why you want to learn this skill, upcoming coursework requirements, or specific projects you plan to build..."
                    value={formData.targetGoal}
                    onChange={(e) => {
                      setFormData({ ...formData, targetGoal: e.target.value });
                      if (formErrors.targetGoal) setFormErrors({ ...formErrors, targetGoal: null });
                    }}
                  />
                  {formErrors.targetGoal && (
                    <span className="form-error-msg">{formErrors.targetGoal}</span>
                  )}
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingRequest ? 'Save Changes' : 'Post Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------
          Delete Confirmation Dialog
          ------------------------------------------------------------------ */}
      {deleteConfirmId && (
        <div className="modal-overlay" onClick={() => setDeleteConfirmId(null)}>
          <div className="modal-card" style={{ maxWidth: '440px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="flex items-center gap-2 text-rose-600 font-bold">
                <AlertTriangle size={20} />
                <span>Delete Learning Request?</span>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setDeleteConfirmId(null)}
              >
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <p className="text-sm text-slate-600">
                Are you sure you want to remove this learning request? It will be removed from your dashboard and peer search.
              </p>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => setDeleteConfirmId(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary"
                style={{ backgroundColor: '#dc2626', borderColor: '#dc2626' }}
                onClick={() => handleDelete(deleteConfirmId)}
              >
                Yes, Delete Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LearningRequests;
