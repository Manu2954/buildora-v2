import { prisma } from "../../prisma/client";

export type CreateProductInput = {
  name: string;
  sku?: string | null;
  description?: string | null;
  priceCents: number;
  imageUrl?: string | null;
  active?: boolean;
  materialsUsed?: string | null;
  recommendedRoomSize?: string | null;
  colorPalette?: string | null;
  designCode?: string | null;
};

export async function createProduct(data: CreateProductInput) {
  return prisma.product.create({ data });
}

export async function updateProduct(id: string, data: Partial<CreateProductInput>) {
  return prisma.product.update({ where: { id }, data });
}

export async function listProducts(params: { page: number; pageSize: number; q?: string; active?: boolean | undefined }) {
  const where: any = {};
  if (params.active !== undefined) where.active = params.active;
  if (params.q) where.OR = [{ name: { contains: params.q, mode: "insensitive" } }, { sku: { contains: params.q, mode: "insensitive" } }];
  const [total, rows] = await Promise.all([
    prisma.product.count({ where }),
    prisma.product.findMany({ where, orderBy: { createdAt: "desc" }, skip: (params.page - 1) * params.pageSize, take: params.pageSize }),
  ]);
  return { total, rows };
}

export async function getActiveProducts() {
  return prisma.product.findMany({ where: { active: true }, orderBy: { createdAt: "desc" } });
}

export async function getProduct(id: string) {
  return prisma.product.findUnique({ where: { id } });
}
