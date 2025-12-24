import { prisma } from "../../prisma/client";

export async function createEntry(data: {
  salesmanId: string;
  startTime: Date;
  endTime?: Date | null;
  notes?: string | null;
  location?: string | null;
}) {
  return prisma.salesmanEntry.create({ data });
}

export async function listEntriesForSalesman(salesmanId: string) {
  return prisma.salesmanEntry.findMany({
    where: { salesmanId },
    orderBy: { entryDate: "desc" },
  });
}

export async function listAllSalesmanEntries() {
  return prisma.salesmanEntry.findMany({
    orderBy: { entryDate: "desc" },
    include: { salesman: { select: { id: true, email: true } } },
  });
}

export async function endEntryForSalesman(params: {
  id: string;
  salesmanId: string;
  endTime: Date;
}) {
  return prisma.salesmanEntry.updateMany({
    where: { id: params.id, salesmanId: params.salesmanId },
    data: { endTime: params.endTime },
  });
}

export async function createSalesmanLead(data: {
  createdById: string;
  name: string;
  phone: string;
  location: string;
  requirement: string;
  email?: string | null;
  message?: string | null;
}) {
  return prisma.lead.create({ data });
}

export async function listSalesmanLeads(salesmanId: string) {
  return prisma.lead.findMany({
    where: { createdById: salesmanId },
    orderBy: { createdAt: "desc" },
    include: {
      assignedTo: { select: { id: true, email: true, role: true } },
    },
  });
}

export async function listAllSalesmanLeads() {
  return prisma.lead.findMany({
    where: { createdById: { not: null } },
    orderBy: { createdAt: "desc" },
    include: {
      createdBy: { select: { id: true, email: true } },
      assignedTo: { select: { id: true, email: true, role: true } },
    },
  });
}

export async function listSalesmenWithLeadCounts() {
  return prisma.user.findMany({
    where: { role: "SALESMAN" },
    select: {
      id: true,
      email: true,
      _count: { select: { leadsCreated: true } },
    },
  });
}
