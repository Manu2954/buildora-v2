import argon2 from "argon2";
import * as crypto from "node:crypto";
import { findUserByEmail, createUser, storeRefreshToken, findRefreshToken, findUserById, revokeRefreshToken } from "./auth.repo";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "../../modules/lib/jwt";

export async function register(params: { email: string; password: string; role?: "ADMIN" | "SALESMAN" | "CUSTOMER" }) {
  const existing = await findUserByEmail(params.email);
  if (existing) return { error: { status: 409, message: "Email already registered" } } as const;
  const hash = await argon2.hash(params.password);
  const user = await createUser({ email: params.email, password: hash, role: params.role ?? "CUSTOMER" });
  const { accessToken, refreshToken, jti, exp } = tokensFor({ id: user.id, role: user.role });
  await storeRefreshToken({ userId: user.id, token: refreshToken, expiresAt: new Date(exp) });
  return { user: { id: user.id, email: user.email, role: user.role }, accessToken, refreshToken } as const;
}

export async function login(params: { email: string; password: string }) {
  const user = await findUserByEmail(params.email);
  if (!user) return { error: { status: 401, message: "Invalid credentials" } } as const;
  const ok = await argon2.verify(user.password, params.password);
  if (!ok) return { error: { status: 401, message: "Invalid credentials" } } as const;
  const { accessToken, refreshToken, exp } = tokensFor({ id: user.id, role: user.role });
  const decoded = verifyRefreshToken(refreshToken);
  await storeRefreshToken({ userId: user.id, token: refreshToken, expiresAt: new Date((decoded.exp ?? Math.floor(exp / 1000)) * 1000) });
  return { user: { id: user.id, email: user.email, role: user.role }, accessToken, refreshToken } as const;
}

export async function refresh(refreshTokenInput: string) {
  let decoded: ReturnType<typeof verifyRefreshToken>;
  try {
    decoded = verifyRefreshToken(refreshTokenInput);
  } catch {
    return { error: { status: 401, message: "Invalid refresh token" } } as const;
  }
  const row = await findRefreshToken(refreshTokenInput);
  if (!row || row.revoked || row.expiresAt < new Date()) return { error: { status: 401, message: "Token expired" } } as const;
  const user = await findUserById(decoded.sub as string);
  if (!user) return { error: { status: 401, message: "Invalid user" } } as const;
  const accessToken = signAccessToken({ sub: user.id, role: user.role });
  return { accessToken } as const;
}

export async function logout(refreshTokenInput: string) {
  await revokeRefreshToken(refreshTokenInput).catch(() => {});
  return { ok: true } as const;
}

export async function me(userId: string) {
  const user = await findUserById(userId);
  if (!user) return { error: { status: 404, message: "Not found" } } as const;
  return { user: { id: user.id, email: user.email, role: user.role } } as const;
}

function tokensFor(user: { id: string; role: "ADMIN" | "SALESMAN" | "CUSTOMER" }) {
  const jti = crypto.randomUUID();
  const accessToken = signAccessToken({ sub: user.id, role: user.role });
  const refreshToken = signRefreshToken({ sub: user.id, role: user.role, jti });
  const decoded = verifyRefreshToken(refreshToken);
  const exp = (decoded.exp ?? 0) * 1000;
  return { accessToken, refreshToken, jti, exp };
}

