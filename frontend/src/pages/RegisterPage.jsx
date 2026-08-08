import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const NIVEAUX = {
  LYCEE: [
    { value: 'PREMIERE_C', label: '1ère Scientifique (Série C)' },
    { value: 'TERMINALE_C', label: 'Terminale Scientifique (Série C)' },
  ],
  UNIVERSITAIRE: [
    { value: 'L1', label: '1ère année (L1)' },
    { value: 'L2', label: '2ème année (L2)' },
    { value: 'L3', label: '3ème année (L3)' },
    { value: 'L4', label: '4ème année (L4)' },
    { value: 'L5', label: '5ème année (L5)' },
  ],
};

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'LYCEE',
    niveau: 'PREMIERE_C',
  });
  const [error, setError] = useState('');

  function onRoleChange(role) {
    setForm({ ...form, role, niveau: NIVEAUX[role][0].value });
  }

  async function onSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      await register(form);
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">∫ MathemLearning</div>
        <h1>Créer un compte</h1>
        {error && <p className="error">{error}</p>}
        <form onSubmit={onSubmit}>
          <div className="row">
            <input
              placeholder="Prénom"
              value={form.firstName}
              onChange={(e) => setForm({ ...form, firstName: e.target.value })}
              required
            />
            <input
              placeholder="Nom"
              value={form.lastName}
              onChange={(e) => setForm({ ...form, lastName: e.target.value })}
              required
            />
          </div>
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
          <input
            type="password"
            placeholder="Mot de passe"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />

          <div className="role-tabs">
            <button
              type="button"
              className={form.role === 'LYCEE' ? 'active' : ''}
              onClick={() => onRoleChange('LYCEE')}
            >
              Lycéen
            </button>
            <button
              type="button"
              className={form.role === 'UNIVERSITAIRE' ? 'active' : ''}
              onClick={() => onRoleChange('UNIVERSITAIRE')}
            >
              Universitaire
            </button>
          </div>

          <label className="field-label">Votre niveau</label>
          <select
            value={form.niveau}
            onChange={(e) => setForm({ ...form, niveau: e.target.value })}
          >
            {NIVEAUX[form.role].map((n) => (
              <option key={n.value} value={n.value}>
                {n.label}
              </option>
            ))}
          </select>

          <button className="btn btn-primary" type="submit">
            S’inscrire
          </button>
        </form>
        <p className="auth-alt">
          Déjà un compte ? <Link to="/login">Se connecter</Link>
        </p>
      </div>
    </div>
  );
}
