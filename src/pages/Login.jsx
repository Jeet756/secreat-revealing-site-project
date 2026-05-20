import { useState } from 'react';
import Alert from '../components/Alert';
import { apiCall, parseError, API_BASE } from '../utils/api';
import './AuthPage.css';

export default function Login({ onLogin, onDone }) {
  const [form, setForm]       = useState({ username: '', password: '' });
  const [msg, setMsg]         = useState(null);
  const [type, setType]       = useState('info');
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);

  const update = (field) => (e) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async () => {
    if (!form.username || !form.password) {
      setType('error'); setMsg('Please fill in all fields.'); return;
    }
    setLoading(true); setMsg(null);
    try {
      const d = await apiCall('POST', `${API_BASE}/get-auth-token`, form);
      if (d?.token) {
        onLogin({ username: form.username, password: form.password, token: d.token });
      } else {
        setType('error'); setMsg('Login failed: no token returned.');
      }
    } catch (e) {
      setType('error'); setMsg(parseError(e));
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => { if (e.key === 'Enter') handleSubmit(); };

  return (
    <div className="auth-page">
      <div className="auth-header">
        <div className="auth-icon">🔑</div>
        <h2 className="auth-title">Welcome Back</h2>
        <p className="auth-subtitle">Sign in to access your secrets</p>
      </div>

      <Alert type={type} msg={msg} />

      <div className="form-group">
        <label>Username</label>
        <input
          type="text"
          value={form.username}
          onChange={update('username')}
          onKeyDown={handleKey}
          placeholder="Your username"
          autoComplete="username"
        />
      </div>

      <div className="form-group">
        <label>Password</label>
        <div className="password-wrapper">
          <input
            type={showPwd ? 'text' : 'password'}
            value={form.password}
            onChange={update('password')}
            onKeyDown={handleKey}
            placeholder="Your password"
            autoComplete="current-password"
          />
          <button
            type="button"
            className="password-toggle"
            onClick={() => setShowPwd(!showPwd)}
            tabIndex={-1}
          >
            {showPwd ? '🙈' : '👁'}
          </button>
        </div>
      </div>

      <div className="auth-actions">
        <button className="btn btn-gold auth-submit" disabled={loading} onClick={handleSubmit}>
          {loading ? (
            <span className="btn-dots"><span /><span /><span /></span>
          ) : 'Login'}
        </button>
        <button className="btn btn-outline" onClick={onDone}>← Back</button>
      </div>

      <p className="auth-switch">
        Don't have an account?{' '}
        <span onClick={() => { onDone(); setTimeout(() => document.querySelector('[data-nav="register"]')?.click(), 50); }}>
          Register
        </span>
      </p>
    </div>
  );
}
