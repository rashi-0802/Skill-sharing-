import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  Plus,
  Edit2,
  Trash2,
  Clock,
  Star,
  Users,
  CheckCircle2,
  X,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  Layers,
  Copy,
  Check
} from 'lucide-react';
import { ALL_CATEGORIES, SKILL_LEVELS, resolveOrAddCourse, getCourseById, formatDisplayId } from '../utils/mockData.js';
import { useAuth, addUserSkill, updateUserSkill, deleteUserSkill } from '../utils/auth.js';
import MangaCard from '../components/MangaCard.jsx';
import PowerLevelMeter from '../components/PowerLevelMeter.jsx';
import AnimeIdChip from '../components/AnimeIdChip.jsx';
import { getCategoryAccentColor } from '../utils/categoryColors.js';
import './MySkills.css';

const MySkills = () => {
  const { user } = useAuth();
  const [skills, setSkills] = useState(user.skillsOffered || []);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);
  const [copiedToast, setCopiedToast] = useState(false);

  useEffect(() => {
    if (user?.skillsOffered) {
      setSkills(user.skillsOffered);
    }
  }, [user]);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    category: 'Web Development',
    level: 'Intermediate',
    description: '',
    availability: 'Weekdays after 4 PM'
  });
  const [formErrors, setFormErrors] = useState({});

  const showToast = (msg) => {
    setToastMessage(msg);
    setCopiedToast(false);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  // Open modal for Adding
  const handleOpenAdd = () => {
    setEditingSkill(null);
    setFormData({
      name: '',
      category: 'Web Development',
      level: 'Intermediate',
      description: '',
      availability: 'Weekdays after 4 PM'
    });
    setFormErrors({});
    setModalOpen(true);
  };

  // Open modal for Editing
  const handleOpenEdit = (skill) => {
    setEditingSkill(skill);
    setFormData({
      name: skill.name,
      category: skill.category,
      level: skill.level,
      description: skill.description,
      availability: skill.availability
    });
    setFormErrors({});
    setModalOpen(true);
  };

  const validateForm = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Skill name is required';
    if (!formData.description.trim()) {
      errs.description = 'Please describe what topics you will teach';
    } else if (formData.description.trim().length < 15) {
      errs.description = 'Description should be at least 15 characters';
    }
    if (!formData.availability.trim()) {
      errs.availability = 'Availability schedule is required';
    }
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Submit Add or Edit
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (editingSkill) {
      // Edit existing
      const updated = {
        ...editingSkill,
        name: formData.name.trim(),
        category: formData.category,
        level: formData.level,
        description: formData.description.trim(),
        availability: formData.availability.trim()
      };
      const newSkillsList = updateUserSkill(updated);
      setSkills([...newSkillsList]);
      showToast('Skill updated successfully.');
    } else {
      // Add new
      const newSkill = {
        name: formData.name.trim(),
        category: formData.category,
        level: formData.level,
        description: formData.description.trim(),
        availability: formData.availability.trim()
      };
      const newSkillsList = addUserSkill(newSkill);
      setSkills([...newSkillsList]);
      const createdItem = newSkillsList[0];
      const createdTchId = createdItem?.teachingId || createdItem?.displayId || 'TCR001CRS005';
      showToast({
        text: `Teaching ID ${createdTchId} created`,
        copyId: createdTchId
      });
    }

    setModalOpen(false);
  };

  // Delete handler
  const handleDelete = (skillId) => {
    const target = skills.find((s) => s.id === skillId);
    const newSkillsList = deleteUserSkill(skillId);
    setSkills([...newSkillsList]);
    setDeleteConfirmId(null);
    showToast('Skill deleted.');
  };

  // Categories without 'All'
  const selectableCategories = ALL_CATEGORIES.filter((c) => c !== 'All');

  return (
    <div className="my-skills-page">
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
              border: '2px solid #6366f1',
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
                  color: '#4338ca',
                  border: '1.5px solid #4338ca',
                  boxShadow: '1.5px 1.5px 0px #4338ca',
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
        <div className="my-skills-header">
          <div className="my-skills-title-group">
            <h1>My Teaching Skills</h1>
            <p>
              Manage the skills you offer to mentor other students on campus. Add, edit, or adjust your timetable availability anytime.
            </p>
          </div>

          <button onClick={handleOpenAdd} className="btn btn-primary">
            <Plus size={18} />
            <span>Add New Skill</span>
          </button>
        </div>

        {/* Overview Banner */}
        <div className="my-skills-banner">
          <div className="banner-stats-group">
            <div className="banner-stat-item">
              <span className="banner-stat-val">{skills.length}</span>
              <span className="banner-stat-label">Active Skills Offered</span>
            </div>
            <div className="banner-stat-item">
              <span className="banner-stat-val">
                {skills.reduce((acc, curr) => acc + (curr.learnersHelped || 0), 0)}
              </span>
              <span className="banner-stat-label">Total Peers Mentored</span>
            </div>
            <div className="banner-stat-item">
              <span className="banner-stat-val flex items-center text-amber-500">
                <Star size={18} fill="#f59e0b" />
                <span className="ml-1 text-slate-800">{user.rating || '4.95'}</span>
              </span>
              <span className="banner-stat-label">Average Mentor Rating</span>
            </div>
          </div>

          <Link to="/explore" className="btn btn-sm btn-outline">
            <span>See How Others Teach</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {/* Skills List / Cards */}
        {skills.length > 0 ? (
          <div className="my-skills-grid">
            {skills.map((skill, index) => (
              <MangaCard
                key={skill.id}
                index={index}
                accentColor={getCategoryAccentColor(skill.category, index)}
                cornerLabel={skill.category}
                className="my-skill-card"
              >
                <div>
                  <div className="my-skill-top-row">
                    <div className="my-skill-badges-left">
                      <span className="skill-category-badge">{skill.category}</span>
                      <PowerLevelMeter level={skill.level} />
                    </div>

                    <div className="my-skill-actions-right">
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(skill)}
                        className="skill-icon-action-btn"
                        title="Edit Skill"
                        aria-label={`Edit ${skill.name}`}
                      >
                        <Edit2 size={15} />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteConfirmId(skill.id)}
                        className="skill-icon-action-btn btn-delete"
                        title="Delete Skill"
                        aria-label={`Delete ${skill.name}`}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap my-1.5 text-xs">
                    <AnimeIdChip
                      id={skill.teachingId || skill.displayId}
                      type="TCR"
                      size="md"
                      record={skill}
                      context={{
                        isCurrentUser: true,
                        userName: user?.name,
                        skillName: skill.name
                      }}
                    />
                  </div>

                  <h3 className="my-skill-title">{skill.name}</h3>
                  <p className="my-skill-description">{skill.description}</p>
                </div>

                <div className="my-skill-meta-footer">
                  <div className="my-skill-timing">
                    <Clock size={14} className="text-primary" />
                    <span>{skill.availability}</span>
                  </div>

                  <div className="my-skill-impact">
                    <span><strong>{skill.learnersHelped || 0}</strong> students helped</span>
                    <span className="flex items-center text-amber-500 font-bold">
                      <Star size={13} fill="#f59e0b" />
                      <span className="ml-1 text-slate-800">{skill.rating || '5.0'}</span>
                    </span>
                  </div>
                </div>
              </MangaCard>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="my-skills-empty-card">
            <div className="empty-add-icon">
              <BookOpen size={32} />
            </div>
            <h3 className="empty-add-title">You Haven't Listed Any Skills Yet</h3>
            <p className="empty-add-desc">
              Every student has something valuable to teach — whether it's debugging C programs, design systems in Figma, or public speaking. Add your first skill to start mentoring campus peers!
            </p>
            <button onClick={handleOpenAdd} className="btn btn-primary">
              <Plus size={16} />
              <span>Offer Your First Skill</span>
            </button>
          </div>
        )}
      </div>

      {/* ------------------------------------------------------------------
          Add / Edit Skill Modal
          ------------------------------------------------------------------ */}
      {modalOpen && (
        <div className="modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="modal-card" style={{ maxWidth: '580px' }} onClick={(e) => e.stopPropagation()}>
            <form onSubmit={handleSubmit}>
              <div className="modal-header">
                <h3>{editingSkill ? 'Edit Teaching Skill' : 'Offer a New Skill'}</h3>
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
                  <label className="form-label" htmlFor="skill-name">
                    Skill Name
                  </label>
                  <input
                    id="skill-name"
                    type="text"
                    className={`form-input ${formErrors.name ? 'input-error' : ''}`}
                    placeholder="e.g. C Programming, React & Tailwind, Figma UI Design"
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
                        {formData.name.trim() ? resolveOrAddCourse(formData.name, formData.category) : (editingSkill?.courseId || 'CRS001')}
                      </span>
                    </div>
                    <p className="text-slate-500 text-[11px] leading-tight">
                      Shared Course ID used across all students teaching or requesting this skill. Students connect through this shared Course ID.
                    </p>
                    <div className="flex items-center justify-between pt-1 border-t border-slate-200">
                      <span className="font-semibold text-slate-700">Teaching Record ID:</span>
                      <span className="font-mono font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                        {editingSkill ? editingSkill.teachingId : 'Auto-generated upon save (e.g. TCH...)'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Category & Proficiency Level (Grid) */}
                <div className="modal-form-grid">
                  <div className="form-group">
                    <label className="form-label" htmlFor="skill-category">
                      Category
                    </label>
                    <select
                      id="skill-category"
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
                    <label className="form-label" htmlFor="skill-level">
                      Proficiency Level
                    </label>
                    <select
                      id="skill-level"
                      className="form-input"
                      value={formData.level}
                      onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                    >
                      {SKILL_LEVELS.filter((l) => l !== 'All').map((l) => (
                        <option key={l} value={l}>
                          {l}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Description */}
                <div className="form-group">
                  <label className="form-label" htmlFor="skill-desc">
                    Description & Topics You Can Teach
                  </label>
                  <textarea
                    id="skill-desc"
                    rows={4}
                    className={`form-input ${formErrors.description ? 'input-error' : ''}`}
                    placeholder="Explain what specific topics, coursework questions, or project skills you can help peer learners with..."
                    value={formData.description}
                    onChange={(e) => {
                      setFormData({ ...formData, description: e.target.value });
                      if (formErrors.description) setFormErrors({ ...formErrors, description: null });
                    }}
                  />
                  {formErrors.description && (
                    <span className="form-error-msg">{formErrors.description}</span>
                  )}
                </div>

                {/* Availability */}
                <div className="form-group">
                  <label className="form-label" htmlFor="skill-availability">
                    Your Weekly Timetable Availability
                  </label>
                  <input
                    id="skill-availability"
                    type="text"
                    className={`form-input ${formErrors.availability ? 'input-error' : ''}`}
                    placeholder="e.g. Weekdays after 4 PM, Weekends, Mon & Wed evenings"
                    value={formData.availability}
                    onChange={(e) => {
                      setFormData({ ...formData, availability: e.target.value });
                      if (formErrors.availability) setFormErrors({ ...formErrors, availability: null });
                    }}
                  />
                  {formErrors.availability && (
                    <span className="form-error-msg">{formErrors.availability}</span>
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
                  {editingSkill ? 'Save Changes' : 'Add Skill'}
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
                <span>Remove Teaching Skill?</span>
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
                Are you sure you want to delete this skill from your profile? Other campus students will no longer be able to request sessions for it.
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
                Yes, Delete Skill
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MySkills;
