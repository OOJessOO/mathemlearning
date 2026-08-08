import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/client.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function BranchesPage() {
  const [branches, setBranches] = useState([]);
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    api('/api/branches')
      .then((d) => setBranches(d.branches))
      .catch((e) => setError(e.message));
    api('/api/stats')
      .then((d) => setStats(d.stats))
      .catch((e) => setError(e.message));
  }, []);

  const pct = stats ? Math.round(stats.levelProgress * 100) : 0;

  return (
    <div>
      <section className="hero">
        <div className="hero-main">
          <h1>Bienvenue, {user.firstName}</h1>
          <p className="subtitle">
            Entraîne-toi sur une branche des mathématiques. Chaque bonne réponse te rapproche du
            niveau suivant.
          </p>
        </div>

        {stats && (
          <div className="stats-card">
            <div className="stats-row">
              <div className="stat">
                <div className="stat-value">{stats.level}</div>
                <div className="stat-label">Niveau</div>
              </div>
              <div className="stat">
                <div className="stat-value">{stats.streak}</div>
                <div className="stat-label">Série (jours)</div>
              </div>
              <div className="stat">
                <div className="stat-value">{stats.successRate}%</div>
                <div className="stat-label">Réussite</div>
              </div>
            </div>
            <div className="progress">
              <div className="progress-track">
                <div className="progress-fill" style={{ width: `${pct}%` }} />
              </div>
              <div className="progress-label">
                {stats.pointsInLevel} / {stats.pointsForLevel} pts — niveau {stats.level + 1} dans{' '}
                {stats.pointsForLevel - stats.pointsInLevel} pts
              </div>
            </div>
          </div>
        )}
      </section>

      {error && <p className="error">{error}</p>}

      <div className="branch-grid">
        {branches.map((b) => (
          <button
            key={b.id}
            className="branch-card"
            onClick={() => navigate(`/exercises?branch=${b.slug}`)}
          >
            <div className="branch-name">{b.name}</div>
            <div className="branch-count">{b._count.exercises} exercices</div>
          </button>
        ))}
      </div>
    </div>
  );
}
