import type { Prisma } from "@prisma/client";
import { prisma } from "../../prisma/client";

export async function findConfig(key: string) {
  return prisma.ctaConfig.findUnique({ where: { key } });
}

export async function upsertConfig(key: string, json: Record<string, unknown>) {
  const payload = json as Prisma.JsonValue;
  return prisma.ctaConfig.upsert({
    where: { key },
    create: { key, json: payload },
    update: { json: payload },
  });
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

export async function listLeads(params: {
  from?: Date;
  to?: Date;
  status?: "NEW" | "CONTACTED" | "CLOSED";
  q?: string;
  skip: number;
  take: number;
}) {
  const where: any = {};
  if (params.from || params.to) {
    where.createdAt = {};
    if (params.from) where.createdAt.gte = params.from;
    if (params.to) where.createdAt.lte = params.to;
  }
  if (params.status) where.status = params.status;
  if (params.q) {
    where.OR = [
      { name: { contains: params.q, mode: "insensitive" } },
      { phone: { contains: params.q } },
      { email: { contains: params.q, mode: "insensitive" } },
    ];
  }
  const [items, total] = await Promise.all([
    prisma.lead.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: params.skip,
      take: params.take,
      select: {
        id: true,
        name: true,
        phone: true,
        email: true,
        status: true,
        createdAt: true,
      },
    }),
    prisma.lead.count({ where }),
  ]);
  return { items, total };
}

export async function setLeadStatus(id: string, status: "NEW" | "CONTACTED" | "CLOSED") {
  return prisma.lead.update({ where: { id }, data: { status } });
}

export async function getLeadById(id: string) {
  return prisma.lead.findUnique({
    where: { id },
    include: {
      assignedTo: { select: { id: true, email: true, role: true } },
    },
  });
}

export async function updateLead(id: string, data: Partial<{ assignedToId: string | null; followUpAt: Date | null; priority: "LOW"|"MEDIUM"|"HIGH"; status: "NEW"|"CONTACTED"|"CLOSED" }>) {
  return prisma.lead.update({ where: { id }, data });
}

export async function createLeadNote(params: { leadId: string; authorId?: string; content: string }) {
  const note = await prisma.leadNote.create({ data: { leadId: params.leadId, authorId: params.authorId, content: params.content } });
  return note;
}

export async function listLeadNotes(leadId: string) {
  return prisma.leadNote.findMany({
    where: { leadId },
    orderBy: { createdAt: "desc" },
    include: { author: { select: { id: true, email: true } } },
  });
}

export async function logLeadEvent(params: {
  leadId: string;
  actorId?: string;
  type: string;
  data?: unknown;
}) {
  const jsonData =
    params.data === undefined
      ? undefined
      : (JSON.parse(JSON.stringify(params.data)) as Prisma.JsonValue);
  return prisma.leadEvent.create({
    data: { leadId: params.leadId, actorId: params.actorId, type: params.type, data: jsonData },
  });
}
