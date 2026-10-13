import React, { useState,useEffect } from 'react';
import {useNavigate} from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { User } from '../context/AuthContext';
import { LogIn, Mail, Lock, Sun, Moon } from 'lucide-react';

export const Login: React.FC<{ switchToRegister: () => void }> = ({ switchToRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const { login, apiRequest, darkMode, toggleDarkMode } = useAuth();
  const navigate=useNavigate();
  useEffect(()=>{
    const token=localStorage.getItem("token");
    if(token){
      navigate("/",{replace:true})
    } 
  })
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const res = await apiRequest<{ token: string; user: User }>('/auth/login', {
        method: 'POST',
        data: { email, password },
      });
      login(res.token, res.user);
     if(res.token!==undefined){
       navigate('/', { replace: true });
     }
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
          <LogIn size={28} style={{ color: 'var(--primary-color)' }} />
          <h2>Welcome Back</h2>
        </div>

        {error && <div className="alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
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

          <button type="submit" className="btn-primary">Login</button>
        </form>

        <p className="switch-text">
          Don't have an account?{' '}
          <span onClick={switchToRegister} className="switch-link">Register</span>
        </p>
      </div>
    </div>
  );
};