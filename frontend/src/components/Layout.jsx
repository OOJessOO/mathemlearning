import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const NIVEAU_LABEL = {
  PREMIERE_C: '1ère C',
  TERMINALE_C: 'Terminale C',
  L1: 'L1',
  L2: 'L2',
  L3: 'L3',
  L4: 'L4',
  L5: 'L5',
};

function initials(user) {
  return `${(user.firstName || '?')[0]}${(user.lastName || '?')[0]}`.toUpperCase();
}

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  function go(path) {
    setMenuOpen(false);
    navigate(path);
  }

  return (
    <div className="layout">
      <header className="topbar">
        <div className="brand" onClick={() => go('/')}>
          <span className="brand-mark">∫</span> MathemLearning
        </div>

        <button
          className={`menu-toggle${menuOpen ? ' open' : ''}`}
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Menu"
        >
          <span />
          <span />
          <span />
        </button>

        <nav className={`nav${menuOpen ? ' open' : ''}`}>
          <NavLink to="/" onClick={() => setMenuOpen(false)}>
            Branches
          </NavLink>
          <NavLink to="/history" onClick={() => setMenuOpen(false)}>
            Historique
          </NavLink>
          <NavLink to="/profile" onClick={() => setMenuOpen(false)}>
            Profil
          </NavLink>
        </nav>

        <div className="topbar-user">
          <span className="user-chip">
            {user.firstName} · {NIVEAU_LABEL[user.niveau]}
          </span>
          <button
            className="avatar-btn"
            onClick={() => go('/profile')}
            title="Mon profil"
            aria-label="Mon profil"
          >
            {user.avatarUrl ? (
              <img src={user.avatarUrl} alt="Profil" />
            ) : (
              <span>{initials(user)}</span>
            )}
          </button>
          <button className="btn btn-ghost" onClick={logout}>
            Déconnexion
          </button>
        </div>
      </header>
      <main className="content">
        <Outlet />
      </main>
    </div>
  );
}
