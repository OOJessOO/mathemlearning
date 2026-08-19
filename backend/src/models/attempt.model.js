import { prisma } from '../config/prisma.js';

export const AttemptModel = {
  findActiveByExercise(userId, exerciseId) {
    return prisma.attempt.findFirst({
      where: { userId, exerciseId, status: 'EN_COURS' },
    });
  },

  findOrCreateActive(userId, exerciseId) {
    return prisma.$transaction(async (tx) => {
      const existing = await tx.attempt.findFirst({
        where: { userId, exerciseId, status: 'EN_COURS' },
      });
      if (existing) return { attempt: existing, created: false };
      const attempt = await tx.attempt.create({ data: { userId, exerciseId } });
      return { attempt, created: true };
    });
  },

  findById(id) {
    return prisma.attempt.findUnique({ where: { id } });
  },

  findByIdWithExercise(id) {
    return prisma.attempt.findUnique({ where: { id }, include: { exercise: true } });
  },

  create(userId, exerciseId) {
    return prisma.attempt.create({
      data: { userId, exerciseId },
    });
  },

  submit(id, { demarche, reponse, note }) {
    return prisma.attempt.update({
      where: { id },
      data: {
        demarche: demarche ?? null,
        reponse: reponse ?? null,
        note,
        status: 'TERMINE',
        submittedAt: new Date(),
      },
    });
  },

  abandon(id) {
    return prisma.attempt.update({
      where: { id },
      data: { status: 'ABANDONNE', submittedAt: new Date() },
    });
  },

  listForUser(userId) {
    return prisma.attempt.findMany({
      where: { userId },
      include: { exercise: { include: { branch: true } } },
      orderBy: { startedAt: 'desc' },
      take: 50,
    });
  },

  listForStats(userId) {
    return prisma.attempt.findMany({
      where: { userId, status: 'TERMINE' },
      select: {
        note: true,
        submittedAt: true,
        exercise: { select: { points: true } },
      },
    });
  },

  totalPoints(userId) {
    return prisma.attempt.aggregate({
      where: { userId, status: 'TERMINE' },
      _sum: { note: true },
    });
  },
};
