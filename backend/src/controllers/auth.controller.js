import bcrypt from 'bcryptjs';
import { UserModel } from '../models/user.model.js';
import { signToken } from '../middleware/auth.js';

const ROLE_NIVEAUX = {
  LYCEE: ['PREMIERE_C', 'TERMINALE_C'],
  UNIVERSITAIRE: ['L1', 'L2', 'L3', 'L4', 'L5'],
};

export async function register(req, res) {
  const { email, password, firstName, lastName, role, niveau } = req.body;

  if (!email || !password || !firstName || !lastName || !role || !niveau) {
    return res.status(400).json({ error: 'Tous les champs sont requis' });
  }

  const allowedNiveaux = ROLE_NIVEAUX[role];
  if (!allowedNiveaux) {
    return res.status(400).json({ error: 'Rôle invalide' });
  }
  if (!allowedNiveaux.includes(niveau)) {
    return res.status(400).json({ error: 'Niveau incohérent avec le rôle choisi' });
  }

  const existing = await UserModel.findByEmail(email);
  if (existing) return res.status(409).json({ error: 'Email déjà utilisé' });

  const hashed = await bcrypt.hash(password, 10);
  const user = await UserModel.create({
    email,
    password: hashed,
    firstName,
    lastName,
    role,
    niveau,
  });

  const token = signToken(user);
  return res.status(201).json({ token, user: publicUser(user) });
}

export async function login(req, res) {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email et mot de passe requis' });
  }

  const user = await UserModel.findByEmail(email);
  if (!user) return res.status(401).json({ error: 'Email ou mot de passe incorrect' });

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(401).json({ error: 'Email ou mot de passe incorrect' });

  const token = signToken(user);
  return res.json({ token, user: publicUser(user) });
}

export async function me(req, res) {
  return res.json({ user: publicUser(req.user) });
}

export async function updateAvatar(req, res) {
  const { avatarUrl } = req.body;

  if (avatarUrl !== null && typeof avatarUrl !== 'string') {
    return res.status(400).json({ error: 'avatarUrl requis' });
  }
  if (typeof avatarUrl === 'string') {
    if (!/^data:image\/(png|jpeg|webp);base64,/.test(avatarUrl)) {
      return res.status(400).json({ error: 'Format d’image invalide' });
    }
    if (avatarUrl.length > 500_000) {
      return res.status(400).json({ error: 'Image trop volumineuse' });
    }
  }

  const user = await UserModel.updateAvatar(req.user.id, avatarUrl ?? null);
  return res.json({ user: publicUser(user) });
}

function publicUser(user) {
  return {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    role: user.role,
    niveau: user.niveau,
    avatarUrl: user.avatarUrl,
  };
}
