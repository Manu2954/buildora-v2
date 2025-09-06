import { prisma } from '../prisma.js';

export async function analyticsSummary(from: Date, to: Date) {
  const total = await prisma.lead.count({ where: { createdAt: { gte: from, lte: to } } });

  const byDay = (await prisma.$queryRaw<{ date: string; count: number }[]>`
    SELECT to_char(date_trunc('day', "createdAt"), 'YYYY-MM-DD') AS date, COUNT(*)::int AS count
    FROM "Lead"
    WHERE "createdAt" BETWEEN ${from} AND ${to}
    GROUP BY 1
    ORDER BY 1
  `).map((r) => ({ date: r.date, count: Number(r.count) }));

  const bySourceRaw = await prisma.lead.groupBy({
    by: ['source'],
    where: { createdAt: { gte: from, lte: to } },
    _count: { _all: true },
  });
  const bySource = bySourceRaw.map((r) => ({ source: r.source, count: r._count._all }));

  const byVariantRaw = await prisma.lead.groupBy({
    by: ['variant'],
    where: { createdAt: { gte: from, lte: to } },
    _count: { _all: true },
  });
  const byVariant = byVariantRaw.map((r) => ({ variant: r.variant, count: r._count._all }));

  return { total, byDay, bySource, byVariant };
}
