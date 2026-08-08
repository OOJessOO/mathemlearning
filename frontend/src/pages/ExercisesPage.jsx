import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { api } from '../api/client.js';

function formatDuration(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m} min ${s < 10 ? '0' : ''}${s}`;
}

export default function ExercisesPage() {
  const [params] = useSearchParams();
  const branch = params.get('branch') || '';
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    setData(null);
    api(`/api/exercises${branch ? `?branch=${branch}` : ''}`)
      .then((d) => setData(d))
      .catch((e) => setError(e.message));
  }, [branch]);

  return (
    <div>
      <h1>{branch ? `Exercices — ${branch}` : 'Tous les exercices'}</h1>
      {error && <p className="error">{error}</p>}
      {!data && !error && <p className="muted">Chargement…</p>}
      <div className="exercise-list">
        {data?.exercises.map((ex) => {
          const locked = !ex.unlocked;
          return (
            <Link
              key={ex.id}
              to={locked ? undefined : `/exercises/${ex.id}`}
              className={`exercise-card${locked ? ' locked' : ''}`}
              onClick={(e) => locked && e.preventDefault()}
              aria-disabled={locked}
            >
              <div className="exercise-row">
                <div className="exercise-title">{ex.title}</div>
                {locked ? (
                  <span className="badge badge-locked">Verrouillé — {ex.unlockPoints} pts requis</span>
                ) : ex.done > 0 ? (
                  <span className="badge badge-done">Réussi</span>
                ) : (
                  <span className="badge badge-todo">À faire</span>
                )}
              </div>
              <div className="exercise-meta">
                <span>Temps : {formatDuration(ex.dureeSecondes)}</span>
                <span>Score : {ex.points} pts</span>
              </div>
            </Link>
          );
        })}
        {data && data.exercises.length === 0 && (
          <p className="muted">Aucun exercice dans cette branche pour ton niveau.</p>
        )}
      </div>
    </div>
  );
}
