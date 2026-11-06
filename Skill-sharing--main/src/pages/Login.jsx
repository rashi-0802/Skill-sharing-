import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, LogIn, Sparkles, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { DEFAULT_USER, saveUser } from '../utils/auth.js';
import api, { ApiClientError } from '../utils/api.js';
import './Auth.css';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [statusMessage, setStatusMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fill sample student credentials for seeded account
  const handleQuickFill = () => {
    setEmail('kediavidhi62@gmail.com');
    setPassword('password123');
    setErrors({});
    setStatusMessage({
      type: 'success',
      text: 'Demo credentials filled: kediavidhi62@gmail.com / password123',
    });
  };

  const validate = () => {
    const newErrors = {};
    if (!email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid university or personal email';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate() || isLoading) return;

    setIsLoading(true);
    setStatusMessage(null);

    try {
      // Authenticate directly against the SQLite backend (normalized lowercase email)
      const student = await api.auth.login({
        email: email.trim().toLowerCase(),
        password,
      });

      // Save user to auth state / localStorage and trigger auth sync
      saveUser(student);
      setStatusMessage({
        type: 'success',
        text: `Welcome back, ${student.name}! Redirecting to your dashboard...`,
      });

      setTimeout(() => {
        navigate('/dashboard');
      }, 400);
    } catch (err) {
      console.error('Login error:', err);
      const message =
        err instanceof ApiClientError
          ? err.message
          : 'Unable to connect to backend server. Please verify backend is running.';
      setStatusMessage({ type: 'error', text: message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page-wrapper">
      <div className="auth-card">
        {/* Header */}
        <div className="auth-header">
          <div className="auth-brand-badge">
            <Sparkles size={13} />
            <span>4S Peer Portal</span>
          </div>
          <h1 className="auth-title">Student Login</h1>
          <p className="auth-subtitle">
            Sign in to access your skills, sessions, and campus matches
          </p>
        </div>

        {/* Quick Demo Login Helper */}
        <div className="demo-quick-banner">
          <div className="demo-banner-info">
            <Sparkles size={16} className="text-primary" />
            <div>
              <strong>Demo Account:</strong> {DEFAULT_USER.name}
              <div style={{ fontSize: '0.8rem', opacity: 0.85 }}>kediavidhi62@gmail.com · password123</div>
            </div>
          </div>
          <button
            type="button"
            onClick={handleQuickFill}
            className="demo-fill-btn"
          >
            Auto-fill Credentials
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="auth-form" noValidate>
          {/* Email */}
          <div className="form-group">
            <label className="form-label" htmlFor="login-email">
              College or Personal Email
            </label>
            <div className="input-with-icon">
              <Mail size={18} className="input-icon-left" />
              <input
                id="login-email"
                type="email"
                className={`form-input has-left-icon ${errors.email ? 'input-error' : ''}`}
                placeholder="name@university.edu"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors({ ...errors, email: null });
                }}
              />
            </div>
            {errors.email && <span className="form-error-msg">{errors.email}</span>}
          </div>

          {/* Password */}
          <div className="form-group">
            <label className="form-label" htmlFor="login-password">
              Password
            </label>
            <div className="input-with-icon">
              <Lock size={18} className="input-icon-left" />
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                className={`form-input has-left-icon has-right-icon ${errors.password ? 'input-error' : ''}`}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
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

          {/* Submit Button */}
          <button
            type="submit"
            className="btn btn-primary auth-submit-btn"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                <span>Signing in...</span>
              </>
            ) : (
              <>
                <LogIn size={18} />
                <span>Login to Dashboard</span>
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="auth-footer">
          <span>Don't have a 4S account yet?</span>
          <Link to="/register" className="auth-footer-link">
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
