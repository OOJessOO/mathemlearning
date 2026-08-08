import { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('ml_token');
    if (!token) {
      setLoading(false);
      return;
    }
    api('/api/auth/me')
      .then((d) => setUser(d.user))
      .catch(() => localStorage.removeItem('ml_token'))
      .finally(() => setLoading(false));
  }, []);

  async function login(email, password) {
    const d = await api('/api/auth/login', { method: 'POST', body: { email, password } });
    localStorage.setItem('ml_token', d.token);
    setUser(d.user);
  }

  async function register(data) {
    const d = await api('/api/auth/register', { method: 'POST', body: data });
    localStorage.setItem('ml_token', d.token);
    setUser(d.user);
  }

  async function refresh() {
    const d = await api('/api/auth/me');
    setUser(d.user);
    return d.user;
  }

  function logout() {
    localStorage.removeItem('ml_token');
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refresh }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
