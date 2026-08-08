import { Router } from 'express';
import { getStats } from '../controllers/stats.controller.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.get('/', protect, getStats);

export default router;
