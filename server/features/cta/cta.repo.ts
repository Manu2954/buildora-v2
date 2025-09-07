import { prisma } from "../../prisma/client";

export async function findConfig(key: string) {
  return prisma.ctaConfig.findUnique({ where: { key } });
}

export async function upsertConfig(key: string, json: Record<string, unknown>) {
  return prisma.ctaConfig.upsert({ where: { key }, create: { key, json }, update: { json } });
}

export async function createLead(data: {
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  message?: string | null;
  location?: string | null;
  requirement?: string | null;
  page?: string | null;
  variant?: string | null;
  source?: string | null;
  utmSource?: string | null;
  utmMedium?: string | null;
  utmCampaign?: string | null;
  utmTerm?: string | null;
  utmContent?: string | null;
  fingerprint?: string | null;
  ip?: string | null;
  userAgent?: string | null;
}) {
  return prisma.lead.create({ data });
}

export async function countLeadsBetween(from: Date, to: Date) {
  return prisma.lead.count({ where: { createdAt: { gte: from, lte: to } } });
}

