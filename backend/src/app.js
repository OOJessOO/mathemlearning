import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes.js';
import branchRoutes from './routes/branch.routes.js';
import exerciseRoutes from './routes/exercise.routes.js';
import attemptRoutes from './routes/attempt.routes.js';
import statsRoutes from './routes/stats.routes.js';

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
    credentials: true,
  })
);
app.use(express.json());

app.get('/api/health', (req, res) => res.json({ ok: true }));
app.use('/api/auth', authRoutes);
app.use('/api/branches', branchRoutes);
app.use('/api/exercises', exerciseRoutes);
app.use('/api/attempts', attemptRoutes);
app.use('/api/stats', statsRoutes);

app.use((req, res) => res.status(404).json({ error: 'Route introuvable' }));

app.use((err, req, res, _next) => {
  console.error('Erreur non gérée:', err);
  res.status(500).json({ error: 'Erreur interne du serveur' });
});

export default app;
