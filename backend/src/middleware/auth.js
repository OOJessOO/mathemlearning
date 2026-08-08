import jwt from 'jsonwebtoken';
import { UserModel } from '../models/user.model.js';

const JWT_SECRET = process.env.JWT_SECRET || 'mathemlearning_dev_secret_change_me';

export function signToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role, niveau: user.niveau },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

export async function protect(req, res, next) {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (!token) return res.status(401).json({ error: 'Non authentifié' });

    const payload = jwt.verify(token, JWT_SECRET);
    const user = await UserModel.findById(payload.id);
    if (!user) return res.status(401).json({ error: 'Utilisateur introuvable' });

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Session invalide ou expirée' });
  }
}
