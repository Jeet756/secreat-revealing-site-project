import './Navbar.css';

export default function Navbar({ auth, page, onNav, onLogout }) {
  const initials = auth?.username
    ? auth.username.slice(0, 2).toUpperCase()
    : null;

  return (
    <header className="site-header">
      <div className="header-inner">
        <div className="brand">
          <div className="brand-icon">✦</div>
          <div className="brand-text">
            <h1>Secrets</h1>
            <p className="brand-sub">A vault of anonymous confessions</p>
          </div>
        </div>

        <nav className="header-nav">
          {auth ? (
            <div className="auth-row">
              <div className="user-badge">
                <div className="user-avatar">{initials}</div>
                <span className="user-name">{auth.username}</span>
              </div>
              <button className="nav-btn nav-btn-ghost" onClick={onLogout}>
                Logout
              </button>
            </div>
          ) : (
            page === 'home' && (
              <div className="auth-row">
                <button className="nav-btn nav-btn-ghost" onClick={() => onNav('login')}>
                  Login
                </button>
                <button className="nav-btn nav-btn-gold" onClick={() => onNav('register')}>
                  Register
                </button>
              </div>
            )
          )}
        </nav>
      </div>
    </header>
  );
}
