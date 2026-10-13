import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { UserPlus, Mail, Lock, User as UserIcon, Sun, Moon } from 'lucide-react';

export const Register: React.FC<{ switchToLogin: () => void }> = ({ switchToLogin }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { apiRequest, darkMode, toggleDarkMode } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await apiRequest('/auth/register', {
        method: 'POST',
        data: { name, email, password },
      });
      setSuccess('Registration successful! Redirecting to login...');
      setTimeout(switchToLogin, 1500);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-page">
      <button onClick={toggleDarkMode} className="theme-toggle-btn" type="button" aria-label="Toggle theme">
        {darkMode ? <Sun size={20} style={{ color: '#facc15' }} /> : <Moon size={20} />}
      </button>

      <div className="card">
        <div className="card-header">
          <UserPlus size={28} style={{ color: 'var(--primary-color)' }} />
          <h2>Create Account</h2>
        </div>

        {error && <div className="alert-error">{error}</div>}
        {success && <div className="alert-success">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name</label>
            <div className="input-wrapper">
              <UserIcon className="input-icon" size={18} />
              <input
                type="text"
                className="input-field"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="John Doe"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Email</label>
            <div className="input-wrapper">
              <Mail className="input-icon" size={18} />
              <input
                type="email"
                className="input-field"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Password</label>
            <div className="input-wrapper">
              <Lock className="input-icon" size={18} />
              <input
                type="password"
                className="input-field"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
              />
            </div>
          </div>

          <button type="submit" className="btn-primary">Register</button>
        </form>

        <p className="switch-text">
          Already have an account?{' '}
          <span onClick={switchToLogin} className="switch-link">Login</span>
        </p>
      </div>
    </div>
  );
};