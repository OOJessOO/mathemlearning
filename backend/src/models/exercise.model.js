import { prisma } from '../config/prisma.js';

export const ExerciseModel = {
  findMany({ niveau, branchSlug, categorie }) {
    return prisma.exercise.findMany({
      where: {
        niveau,
        ...(branchSlug ? { branch: { slug: branchSlug, categorie } } : {}),
      },
      include: {
        branch: true,
        attempts: { where: { status: 'TERMINE' }, select: { id: true } },
      },
      orderBy: { createdAt: 'asc' },
    });
  },

  findById(id) {
    return prisma.exercise.findUnique({ where: { id }, include: { branch: true } });
  },
};
