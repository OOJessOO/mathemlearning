import { BranchModel } from '../models/branch.model.js';

export async function listBranches(req, res) {
  const userCategorie = req.user.role === 'LYCEE' ? 'LYCEE' : 'UNIVERSITAIRE';
  const branches = await BranchModel.findByCategorie(userCategorie);
  return res.json({ branches });
}
