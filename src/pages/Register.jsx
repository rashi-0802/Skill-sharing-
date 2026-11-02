import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  GraduationCap,
  Calendar,
  FileText,
  UserPlus,
  Sparkles,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { DEFAULT_USER, saveUser } from '../utils/auth.js';
import './Auth.css';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    department: '',
    year: '1st Year',
    bio: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [statusMessage, setStatusMessage] = useState(null);

  const yearOptions = [
    '1st Year (Freshman)',
    '2nd Year (Sophomore)',
    '3rd Year (Junior)',
    '4th Year (Senior)',
    'Postgraduate / Masters'
  ];

  // Auto-fill sample student data for convenient testing
  const handleAutoFill = () => {
    setFormData({
      name: 'Vidhi Kedia',
      email: 'kediavidhi62@gmail.com',
      password: 'password123',
      department: 'Computer Science & Engineering',
      year: '3rd Year (Junior)',
      bio: 'Passionate about Web Development, DBMS, and Python. Ready to mentor frontend learners and eager to study Machine Learning.'
    });
    setErrors({});
    setStatusMessage({ type: 'success', text: 'Sample student details filled!' });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData.department.trim()) {
      newErrors.department = 'Course or Department is required';
    }

    if (!formData.bio.trim()) {
      newErrors.bio = 'Please add a short student bio (at least 10 characters)';
    } else if (formData.bio.trim().length < 10) {
      newErrors.bio = 'Bio is too short. Tell others what you enjoy teaching or learning!';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    // Build user object, inheriting default demo skills so their dashboard is immediately rich and interactive
    const newUser = {
      ...DEFAULT_USER,
      id: `usr_${Date.now()}`,
      name: formData.name.trim(),
      email: formData.email.trim(),
      department: formData.department.trim(),
      year: formData.year,
      bio: formData.bio.trim()
    };

    saveUser(newUser);
    setStatusMessage({ type: 'success', text: `Account created for ${newUser.name}! Redirecting to Dashboard...` });

    setTimeout(() => {
      navigate('/dashboard');
    }, 400);
  };

  return (
    <div className="auth-page-wrapper">
      <div className="auth-card" style={{ maxWidth: '580px' }}>
        {/* Header */}
        <div className="auth-header">
          <div className="auth-brand-badge">
            <Sparkles size={13} />
            <span>Join 4S Network</span>
          </div>
          <h1 className="auth-title">Create Student Account</h1>
          <p className="auth-subtitle">
            One account to teach your skills and learn from campus peers
          </p>
        </div>

        {/* Demo Auto-fill Helper */}
        <div className="demo-quick-banner">
          <div className="demo-banner-info">
            <Sparkles size={16} className="text-secondary" />
            <div>
              <strong>Quick Test:</strong> Fill sample student profile
            </div>
          </div>
          <button
            type="button"
            onClick={handleAutoFill}
            className="demo-fill-btn"
          >
            Auto-fill Vidhi Kedia
          </button>
        </div>

        {statusMessage && (
          <div className={`auth-alert-box auth-alert-${statusMessage.type}`}>
            {statusMessage.type === 'success' ? (
              <CheckCircle2 size={16} />
            ) : (
              <AlertCircle size={16} />
            )}
            <span>{statusMessage.text}</span>
          </div>
        )}

        {/* Register Form */}
        <form onSubmit={handleSubmit} className="auth-form" noValidate>
          {/* Full Name */}
          <div className="form-group">
            <label className="form-label" htmlFor="reg-name">
              Full Name
            </label>
            <div className="input-with-icon">
              <User size={18} className="input-icon-left" />
              <input
                id="reg-name"
                type="text"
                className={`form-input has-left-icon ${errors.name ? 'input-error' : ''}`}
                placeholder="e.g. Vidhi Kedia"
                value={formData.name}
                onChange={(e) => {
                  setFormData({ ...formData, name: e.target.value });
                  if (errors.name) setErrors({ ...errors, name: null });
                }}
              />
            </div>
            {errors.name && <span className="form-error-msg">{errors.name}</span>}
          </div>

          {/* Email */}
          <div className="form-group">
            <label className="form-label" htmlFor="reg-email">
              College or Personal Email
            </label>
            <div className="input-with-icon">
              <Mail size={18} className="input-icon-left" />
              <input
                id="reg-email"
                type="email"
                className={`form-input has-left-icon ${errors.email ? 'input-error' : ''}`}
                placeholder="vidhi@university.edu"
                value={formData.email}
                onChange={(e) => {
                  setFormData({ ...formData, email: e.target.value });
                  if (errors.email) setErrors({ ...errors, email: null });
                }}
              />
            </div>
            {errors.email && <span className="form-error-msg">{errors.email}</span>}
          </div>

          {/* Password */}
          <div className="form-group">
            <label className="form-label" htmlFor="reg-password">
              Create Password
            </label>
            <div className="input-with-icon">
              <Lock size={18} className="input-icon-left" />
              <input
                id="reg-password"
                type={showPassword ? 'text' : 'password'}
                className={`form-input has-left-icon has-right-icon ${errors.password ? 'input-error' : ''}`}
                placeholder="Minimum 6 characters"
                value={formData.password}
                onChange={(e) => {
                  setFormData({ ...formData, password: e.target.value });
                  if (errors.password) setErrors({ ...errors, password: null });
                }}
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && <span className="form-error-msg">{errors.password}</span>}
          </div>

          {/* Department & Year (Grid) */}
          <div className="form-row-grid">
            <div className="form-group">
              <label className="form-label" htmlFor="reg-dept">
                Course / Department
              </label>
              <div className="input-with-icon">
                <GraduationCap size={18} className="input-icon-left" />
                <input
                  id="reg-dept"
                  type="text"
                  className={`form-input has-left-icon ${errors.department ? 'input-error' : ''}`}
                  placeholder="e.g. Computer Science"
                  value={formData.department}
                  onChange={(e) => {
                    setFormData({ ...formData, department: e.target.value });
                    if (errors.department) setErrors({ ...errors, department: null });
                  }}
                />
              </div>
              {errors.department && <span className="form-error-msg">{errors.department}</span>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="reg-year">
                Year of Study
              </label>
              <div className="input-with-icon">
                <Calendar size={18} className="input-icon-left" />
                <select
                  id="reg-year"
                  className="form-input has-left-icon"
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                >
                  {yearOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Short Bio */}
          <div className="form-group">
            <label className="form-label" htmlFor="reg-bio">
              Short Student Bio
            </label>
            <textarea
              id="reg-bio"
              rows={3}
              className={`form-input ${errors.bio ? 'input-error' : ''}`}
              placeholder="What skills can you teach? What are you eager to learn on campus?"
              value={formData.bio}
              onChange={(e) => {
                setFormData({ ...formData, bio: e.target.value });
                if (errors.bio) setErrors({ ...errors, bio: null });
              }}
            />
            {errors.bio && <span className="form-error-msg">{errors.bio}</span>}
          </div>

          {/* Submit */}
          <button type="submit" className="btn btn-primary auth-submit-btn">
            <UserPlus size={18} />
            <span>Create 4S Account</span>
          </button>
        </form>

        {/* Footer */}
        <div className="auth-footer">
          <span>Already registered on 4S?</span>
          <Link to="/login" className="auth-footer-link">
            Log in to your account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
