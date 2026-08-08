import { Router } from 'express';
import {
  startAttempt,
  getAttempt,
  submitAttempt,
  abandonAttempt,
  getResult,
  listHistory,
} from '../controllers/attempt.controller.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.use(protect);

router.get('/history', listHistory);
router.post('/start/:exerciseId', startAttempt);
router.get('/:id', getAttempt);
router.put('/:id/submit', submitAttempt);
router.put('/:id/abandon', abandonAttempt);
router.get('/:id/result', getResult);

export default router;
