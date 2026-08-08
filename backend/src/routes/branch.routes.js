import { Router } from 'express';
import { listBranches } from '../controllers/branch.controller.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.get('/', protect, listBranches);

export default router;
