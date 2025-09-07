import { prisma } from "../../prisma/client";

export async function findUserByEmail(email: string) {
  return prisma.user.findUnique({ where: { email } });
}

export async function findUserById(id: string) {
  return prisma.user.findUnique({ where: { id } });
}

export async function createUser(data: { email: string; password: string; role: "ADMIN" | "SALESMAN" | "CUSTOMER" }) {
  return prisma.user.create({ data });
}

export async function storeRefreshToken(params: { userId: string; token: string; expiresAt: Date }) {
  return prisma.refreshToken.create({
    data: { userId: params.userId, token: params.token, expiresAt: params.expiresAt },
  });
}

export async function findRefreshToken(token: string) {
  return prisma.refreshToken.findUnique({ where: { token } });
}

export async function revokeRefreshToken(token: string) {
  return prisma.refreshToken.update({ where: { token }, data: { revoked: true } });
}

