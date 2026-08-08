import { prisma } from '../config/prisma.js';

export const UserModel = {
  findById(id) {
    return prisma.user.findUnique({ where: { id } });
  },
  findByEmail(email) {
    return prisma.user.findUnique({ where: { email } });
  },
  create(data) {
    return prisma.user.create({ data });
  },
  updateAvatar(userId, avatarUrl) {
    return prisma.user.update({ where: { id: userId }, data: { avatarUrl } });
  },
};
