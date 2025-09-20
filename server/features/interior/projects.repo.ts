import { prisma } from "../../prisma/client";
const db = prisma as any;

export async function createProject(customerId: string, data: { orderId?: string; siteLocation?: string; salespersonId?: string; designerId?: string; contractor?: string; startDate?: Date | null; eta?: Date | null; comments?: string | null; status?: any }) {
  return db.project.create({
    data: {
      customerId,
      orderId: data.orderId,
      siteLocation: data.siteLocation,
      salespersonId: data.salespersonId,
      designerId: data.designerId,
      contractor: data.contractor,
      startDate: data.startDate ?? undefined,
      eta: data.eta ?? undefined,
      comments: data.comments ?? undefined,
      status: (data.status ?? "IN_PROGRESS") as any,
    },
  });
}

export async function updateProject(id: string, data: Partial<{ siteLocation: string; salespersonId: string; designerId: string; contractor: string; startDate?: Date | null; eta?: Date | null; comments: string; status: any; mediaUploads: any[]; permits: any[]; signOffs: any[]; handoverData: any; rating?: number | null; feedback?: string | null; supportContact?: string | null }>) {
  return db.project.update({
    where: { id },
    data: {
      ...(data.siteLocation !== undefined ? { siteLocation: data.siteLocation } : {}),
      ...(data.salespersonId !== undefined ? { salespersonId: data.salespersonId } : {}),
      ...(data.designerId !== undefined ? { designerId: data.designerId } : {}),
      ...(data.contractor !== undefined ? { contractor: data.contractor } : {}),
      ...(data.startDate !== undefined ? { startDate: data.startDate } : {}),
      ...(data.eta !== undefined ? { eta: data.eta } : {}),
      ...(data.comments !== undefined ? { comments: data.comments } : {}),
      ...(data.status !== undefined ? { status: data.status as any } : {}),
      ...(data.mediaUploads !== undefined ? { mediaUploads: data.mediaUploads as any } : {}),
      ...(data.permits !== undefined ? { permits: data.permits as any } : {}),
      ...(data.signOffs !== undefined ? { signOffs: data.signOffs as any } : {}),
      ...(data.handoverData !== undefined ? { handoverData: data.handoverData as any } : {}),
      ...(data.rating !== undefined ? { rating: data.rating } : {}),
      ...(data.feedback !== undefined ? { feedback: data.feedback } : {}),
      ...(data.supportContact !== undefined ? { supportContact: data.supportContact } : {}),
    },
  });
}

export async function getProjectForUser(id: string, userId: string) {
  return db.project.findFirst({ where: { id, customerId: userId } });
}

export async function listProjectsForUser(userId: string, page: number, pageSize: number) {
  const where = { customerId: userId };
  const [total, items] = await Promise.all([
    db.project.count({ where }),
    db.project.findMany({ where, orderBy: { createdAt: "desc" }, skip: (page - 1) * pageSize, take: pageSize }),
  ]);
  return { total, items };
}

export async function listProjectsAdmin(page: number, pageSize: number) {
  const [total, items] = await Promise.all([
    db.project.count(),
    db.project.findMany({ orderBy: { createdAt: "desc" }, skip: (page - 1) * pageSize, take: pageSize, include: { customer: { select: { id: true, email: true } }, order: { select: { id: true, status: true } } } }),
  ]);
  return { total, items };
}

export async function getProjectAdmin(id: string) {
  return db.project.findUnique({ where: { id }, include: { customer: { select: { id: true, email: true } }, order: true } });
}
