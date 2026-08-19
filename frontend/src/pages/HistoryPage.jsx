import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/client.js';

const STATUS_LABEL = {
  TERMINE: 'Terminé',
  ABANDONNE: 'Abandonné',
  EN_COURS: 'En cours',
};

export default function HistoryPage() {
  const [attempts, setAttempts] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    api('/api/attempts/history')
      .then((d) => setAttempts(d.attempts))
      .catch((e) => setError(e.message));
  }, []);

  return (
    <div>
      <h1>Historique</h1>
      {error && <p className="error">{error}</p>}
      {attempts.length === 0 && !error && <p className="muted">Aucune tentative pour l'instant.</p>}
      {attempts.length > 0 && (
        <table className="history-table">
          <thead>
            <tr>
              <th>Exercice</th>
              <th>Branche</th>
              <th>Statut</th>
              <th>Note</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {attempts.map((a) => (
              <tr key={a.id} onClick={() => navigate(`/results/${a.id}`)} className="clickable">
                <td data-label="Exercice">{a.title}</td>
                <td data-label="Branche">{a.branch}</td>
                <td data-label="Statut">
                  <span className={`badge badge-${a.status.toLowerCase()}`}>
                    {STATUS_LABEL[a.status]}
                  </span>
                </td>
                <td data-label="Note">{a.note != null ? `${a.note} / ${a.max}` : '—'}</td>
                <td data-label="Date">{new Date(a.startedAt).toLocaleString('fr-FR')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
