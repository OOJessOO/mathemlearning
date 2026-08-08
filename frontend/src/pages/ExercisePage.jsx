import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../api/client.js';
import MathText from '../components/MathText.jsx';
import MathInput from '../components/MathInput.jsx';

function formatTime(totalSeconds) {
  const s = Math.max(0, Math.floor(totalSeconds));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${r < 10 ? '0' : ''}${r}`;
}

let stepId = 0;

export default function ExercisePage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [attempt, setAttempt] = useState(null);
  const [remaining, setRemaining] = useState(null);
  const [error, setError] = useState('');
  const [steps, setSteps] = useState([{ id: ++stepId, text: '', math: '' }]);
  const [finalAnswer, setFinalAnswer] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [confirmingAbandon, setConfirmingAbandon] = useState(false);

  const submittedRef = useRef(false);
  const attemptRef = useRef(null);

  const submit = useCallback(async () => {
    if (submittedRef.current || !attemptRef.current) return;
    submittedRef.current = true;
    setSubmitting(true);
    try {
      const demarche = JSON.stringify(steps);
      await api(`/api/attempts/${attemptRef.current.id}/submit`, {
        method: 'PUT',
        body: { demarche, reponse: finalAnswer },
      });
      navigate(`/results/${attemptRef.current.id}`);
    } catch (err) {
      setError(err.message);
      submittedRef.current = false;
      setSubmitting(false);
    }
  }, [finalAnswer, navigate, steps]);

  useEffect(() => {
    api(`/api/attempts/start/${id}`, { method: 'POST' })
      .then((d) => {
        setAttempt(d.attempt);
        attemptRef.current = d.attempt;
      })
      .catch((e) => setError(e.message));
  }, [id]);

  useEffect(() => {
    if (!attempt) return;
    const deadline = new Date(attempt.deadline).getTime();

    const tick = () => {
      const left = Math.round((deadline - Date.now()) / 1000);
      setRemaining(left);
      if (left <= 0) submit();
    };
    tick();
    const interval = setInterval(tick, 500);
    return () => clearInterval(interval);
  }, [attempt, submit]);

  async function abandon() {
    if (submittedRef.current || !attemptRef.current) return;
    submittedRef.current = true;
    setSubmitting(true);
    try {
      await api(`/api/attempts/${attemptRef.current.id}/abandon`, { method: 'PUT' });
      navigate(`/results/${attemptRef.current.id}`);
    } catch (err) {
      setError(err.message);
      submittedRef.current = false;
      setSubmitting(false);
    }
  }

  function updateStep(index, patch) {
    setSteps((prev) => prev.map((s, i) => (i === index ? { ...s, ...patch } : s)));
  }

  function addStep() {
    setSteps((prev) => [...prev, { id: ++stepId, text: '', math: '' }]);
  }

  function removeStep(index) {
    setSteps((prev) => (prev.length > 1 ? prev.filter((_, i) => i !== index) : prev));
  }

  if (!attempt && !error) return <p className="muted">Préparation de l’exercice…</p>;
  if (error) return <p className="error">{error}</p>;

  const lowTime = remaining !== null && remaining <= 60;

  return (
    <div className="exercise-page">
      <div className="exercise-header">
        <div>
          <h1>{attempt.exercise.title}</h1>
          <div className="exercise-meta">
            <span>Score : {attempt.exercise.points} pts</span>
          </div>
        </div>
        <div className={`timer ${lowTime ? 'timer-danger' : ''}`}>
          <span className="timer-label">Temps</span>
          {remaining !== null ? formatTime(remaining) : '—'}
        </div>
      </div>

      <div className="card enonce-card">
        <h2>Énoncé</h2>
        <p className="enonce">
          <MathText text={attempt.exercise.enonce} />
        </p>
      </div>

      <div className="card">
        <h2>Vos démarches</h2>
        <p className="muted">Écris ton raisonnement étape par étape (texte et formules).</p>
        {steps.map((step, i) => (
          <div className="step-row" key={step.id}>
            <span className="step-num">{i + 1}.</span>
            <input
              className="step-text"
              placeholder="Explication…"
              value={step.text}
              onChange={(e) => updateStep(i, { text: e.target.value })}
            />
            <MathInput
              className="step-math"
              placeholder="Formule…"
              value={step.math}
              onChange={(latex) => updateStep(i, { math: latex })}
            />
            {steps.length > 1 && (
              <button className="btn btn-icon" onClick={() => removeStep(i)} title="Supprimer">
                ✕
              </button>
            )}
          </div>
        ))}
        <button className="btn btn-ghost" onClick={addStep}>
          + Ajouter une étape
        </button>
      </div>

      <div className="card">
        <h2>Votre résultat final</h2>
        <p className="muted">
          Saisis ta réponse finale ci-dessous. Si la limite n’existe pas, écris <code>DNE</code>.
        </p>
        <MathInput
          className="final-answer"
          style={{ fontSize: '1.4rem' }}
          value={finalAnswer}
          onChange={setFinalAnswer}
        />
      </div>

      {error && <p className="error">{error}</p>}

      <div className="actions">
        <button
          className="btn btn-danger"
          disabled={submitting}
          onClick={() => setConfirmingAbandon(true)}
        >
          Abandonner
        </button>
        <button className="btn btn-primary" disabled={submitting} onClick={submit}>
          {submitting ? 'Envoi…' : 'Valider'}
        </button>
      </div>

      {confirmingAbandon && (
        <div className="modal-overlay" onClick={() => setConfirmingAbandon(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Abandonner l’exercice ?</h3>
            <p>
              Tu verras la correction, mais ta note sera de 0 pour cet exercice.
            </p>
            <div className="modal-actions">
              <button className="btn btn-ghost" onClick={() => setConfirmingAbandon(false)}>
                Continuer l’exercice
              </button>
              <button className="btn btn-danger" onClick={abandon}>
                Oui, abandonner
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
