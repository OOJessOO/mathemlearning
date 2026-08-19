import { BranchModel } from '../models/branch.model.js';
import { catchAsync } from '../utils/catchAsync.js';

export const listBranches = catchAsync(async (req, res) => {
  const userCategorie = req.user.role === 'LYCEE' ? 'LYCEE' : 'UNIVERSITAIRE';
  const branches = await BranchModel.findByCategorie(userCategorie);
  return res.json({ branches });
});
