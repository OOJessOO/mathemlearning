import { prisma } from '../config/prisma.js';

export const BranchModel = {
  findByCategorie(categorie) {
    return prisma.branch.findMany({
      where: { categorie },
      orderBy: [{ order: 'asc' }, { name: 'asc' }],
      include: { _count: { select: { exercises: true } } },
    });
  },
};
