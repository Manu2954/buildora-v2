import { prisma } from "../../prisma/client";
const db = prisma as any;

export type DesignCreateInput = {
  title: string;
  description?: string | null;
  category?: string | null;
  style?: string | null;
  budget?: "BASIC" | "PREMIUM" | "LUXURY";
  basePriceCents: number;
  durationDays?: number | null;
  images?: string[];
  customizationOptions?: Record<string, any> | null;
  active?: boolean;
};

export async function createDesign(data: DesignCreateInput) {
  return db.design.create({
    data: {
      title: data.title,
      description: data.description ?? null,
      category: data.category ?? null,
      style: data.style ?? null,
      budget: (data.budget ?? "BASIC") as any,
      basePriceCents: data.basePriceCents,
      durationDays: data.durationDays ?? null,
      images: data.images ?? [],
      customizationOptions: data.customizationOptions ?? undefined,
      active: data.active ?? true,
    },
  });
}

export async function updateDesign(id: string, data: Partial<DesignCreateInput>) {
  return db.design.update({
    where: { id },
    data: {
      ...(data.title !== undefined ? { title: data.title } : {}),
      ...(data.description !== undefined ? { description: data.description } : {}),
      ...(data.category !== undefined ? { category: data.category } : {}),
      ...(data.style !== undefined ? { style: data.style } : {}),
      ...(data.budget !== undefined ? { budget: data.budget as any } : {}),
      ...(data.basePriceCents !== undefined ? { basePriceCents: data.basePriceCents } : {}),
      ...(data.durationDays !== undefined ? { durationDays: data.durationDays } : {}),
      ...(data.images !== undefined ? { images: data.images } : {}),
      ...(data.customizationOptions !== undefined ? { customizationOptions: data.customizationOptions } : {}),
      ...(data.active !== undefined ? { active: data.active } : {}),
    },
  });
}

export async function getDesign(id: string) {
  return db.design.findUnique({ where: { id } });
}

export async function deleteDesign(id: string) {
  return db.design.delete({ where: { id } });
}

export async function listDesigns(params: { category?: string; style?: string; budget?: any; q?: string; page: number; pageSize: number; active?: boolean }) {
  const where: any = {};
  if (params.active !== undefined) where.active = params.active;
  if (params.category) where.category = { equals: params.category };
  if (params.style) where.style = { equals: params.style };
  if (params.budget) where.budget = params.budget;
  if (params.q) where.OR = [{ title: { contains: params.q, mode: "insensitive" } }, { description: { contains: params.q, mode: "insensitive" } }];

  const [total, items] = await Promise.all([
    db.design.count({ where }),
    db.design.findMany({ where, orderBy: { createdAt: "desc" }, skip: (params.page - 1) * params.pageSize, take: params.pageSize }),
  ]);

  return { total, items };
}
