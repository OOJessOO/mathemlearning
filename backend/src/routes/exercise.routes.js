import { Router } from 'express';
import { listExercises, getExercise } from '../controllers/exercise.controller.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.get('/', protect, listExercises);
router.get('/:id', protect, getExercise);

export default router;
