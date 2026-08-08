import { Router } from 'express';
import { register, login, me, updateAvatar } from '../controllers/auth.controller.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, me);
router.put('/avatar', protect, updateAvatar);

export default router;
