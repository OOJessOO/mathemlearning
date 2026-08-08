import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  async function onSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      await login(form.email, form.password);
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">∫ MathemLearning</div>
        <h1>Connexion</h1>
        {error && <p className="error">{error}</p>}
        <form onSubmit={onSubmit}>
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
          <button className="btn btn-primary" type="submit">
            Se connecter
          </button>
        </form>
        <p className="auth-alt">
          Pas encore de compte ? <Link to="/register">S’inscrire</Link>
        </p>
        <p className="auth-demo">
          Démo : <code>eleve@mathemlearning.fr</code> ou <code>etudiant@mathemlearning.fr</code> —
          mot de passe <code>password123</code>
        </p>
      </div>
    </div>
  );
}
