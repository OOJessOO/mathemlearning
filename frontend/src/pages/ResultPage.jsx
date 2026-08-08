import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../api/client.js';
import MathText from '../components/MathText.jsx';

export default function ResultPage() {
  const { attemptId } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api(`/api/attempts/${attemptId}/result`)
      .then((d) => setData(d))
      .catch((e) => setError(e.message));
  }, [attemptId]);

  if (error) return <p className="error">{error}</p>;
  if (!data) return <p className="muted">Chargement du résultat…</p>;

  const { attempt, grade, correction } = data;
  const { note, max, status, correct } = grade;
  const pct = max ? Math.round((note / max) * 100) : 0;

  let steps = [];
  try {
    steps = attempt.demarche ? JSON.parse(attempt.demarche) : [];
  } catch {
    steps = [];
  }

  return (
    <div className="result-page">
      <h1>Résultat</h1>
      <div className={`score-card ${status === 'ABANDONNE' ? 'abandon' : correct ? 'success' : 'fail'}`}>
        <div className="score-big">
          {note} / {max}
        </div>
        <div className="score-pct">{pct} %</div>
        <div className="score-status">
          {status === 'ABANDONNE'
            ? 'Exercice abandonné — correction visible ci-dessous.'
            : correct
            ? 'Bravo, bonne réponse !'
            : 'Mauvaise réponse, consulte la correction.'}
        </div>
      </div>

      {attempt.reponse && (
        <div className="card">
          <h2>Votre réponse</h2>
          <div className="answer-display">
            <MathText text={`$${attempt.reponse}$`} />
          </div>
        </div>
      )}

      {steps.length > 0 && (
        <div className="card">
          <h2>Vos démarches</h2>
          <ol className="steps-review">
            {steps.map((s, i) => (
              <li key={i}>
                {s.text && <div className="muted">{s.text}</div>}
                {s.math && (
                  <div className="answer-display">
                    <MathText text={`$${s.math}$`} />
                  </div>
                )}
                {!s.text && !s.math && <span className="muted">(étape vide)</span>}
              </li>
            ))}
          </ol>
        </div>
      )}

      <div className="card correction-card">
        <h2>Correction</h2>
        <div className="enonce">
          <MathText text={correction} />
        </div>
      </div>

      <div className="actions">
        <button className="btn btn-ghost" onClick={() => navigate('/exercises')}>
          Autres exercices
        </button>
        <button className="btn btn-primary" onClick={() => navigate('/')}>
          Choisir une autre branche
        </button>
      </div>
    </div>
  );
}
