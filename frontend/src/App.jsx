import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';
import Layout from './components/Layout.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import BranchesPage from './pages/BranchesPage.jsx';
import ExercisesPage from './pages/ExercisesPage.jsx';
import ExercisePage from './pages/ExercisePage.jsx';
import ResultPage from './pages/ResultPage.jsx';
import HistoryPage from './pages/HistoryPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';

function Protected({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="center-page">Chargement…</div>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  const { user } = useAuth();
  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/" replace /> : <LoginPage />} />
      <Route path="/register" element={user ? <Navigate to="/" replace /> : <RegisterPage />} />
      <Route
        element={
          <Protected>
            <Layout />
          </Protected>
        }
      >
        <Route path="/" element={<BranchesPage />} />
        <Route path="/exercises" element={<ExercisesPage />} />
        <Route path="/exercises/:id" element={<ExercisePage />} />
        <Route path="/results/:attemptId" element={<ResultPage />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
