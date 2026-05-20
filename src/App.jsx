import { useState, useCallback } from 'react';
import Navbar   from './components/Navbar';
import Toast    from './components/Toast';
import Home     from './pages/Home';
import Login    from './pages/Login';
import Register from './pages/Register';

let toastId = 0;

export default function App() {
  const [page, setPage] = useState('home');
  const [auth, setAuth] = useState(null);
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((type, msg, duration) => {
    const id = ++toastId;
    setToasts((t) => [...t, { id, type, msg, duration }]);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((t) => t.filter((x) => x.id !== id));
  }, []);

  const handleLogin = (creds) => {
    setAuth(creds);
    setPage('home');
    addToast('success', `Welcome back, ${creds.username}!`);
  };

  const handleLogout = () => {
    addToast('info', 'Logged out successfully.');
    setAuth(null);
    setPage('home');
  };

  return (
    <div className="app-shell">
      <Navbar auth={auth} page={page} onNav={setPage} onLogout={handleLogout} />

      <div className="main-card">
        {page === 'home'     && <Home auth={auth} onNav={setPage} addToast={addToast} />}
        {page === 'login'    && <Login onLogin={handleLogin} onDone={() => setPage('home')} />}
        {page === 'register' && <Register onDone={() => setPage('login')} />}
      </div>

      <Toast toasts={toasts} onRemove={removeToast} />
    </div>
  );
}
