import { z } from "zod";

import * as repo from "./salesman.repo";
import { SalesmanEntrySchema, SalesmanLeadSchema } from "./salesman.schemas";

export async function createEntry(
  data: z.infer<typeof SalesmanEntrySchema>,
  salesmanId: string
) {
  return repo.createEntry({
    salesmanId,
    startTime: new Date(data.startTime),
    endTime: data.endTime ? new Date(data.endTime) : null,
    notes: data.notes ?? null,
    location: data.location ?? null,
  });
}

export async function createLead(
  data: z.infer<typeof SalesmanLeadSchema>,
  salesmanId: string
) {
  return repo.createSalesmanLead({
    createdById: salesmanId,
    name: data.name,
    phone: data.phone,
    location: data.location,
    requirement: data.requirement,
    email: data.email ?? null,
    message: data.message ?? null,
  });
}

export async function getSalesmanLeads(salesmanId: string) {
  return repo.listSalesmanLeads(salesmanId);
}

export async function getAllSalesmanLeads() {
  return repo.listAllSalesmanLeads();
}

export async function getSalesmenWithLeadCounts() {
  return repo.listSalesmenWithLeadCounts();
}

export async function getSalesmanEntries(salesmanId: string) {
  return repo.listEntriesForSalesman(salesmanId);
}

export async function getAllSalesmanEntries() {
  return repo.listAllSalesmanEntries();
}

export async function endEntry(entryId: string, endTimeIso: string, salesmanId: string) {
  const endTime = new Date(endTimeIso);
  const result = await repo.endEntryForSalesman({ id: entryId, salesmanId, endTime });
  if (result.count === 0) {
    const err = new Error("Entry not found");
    (err as any).status = 404;
    throw err;
  }
  return { ok: true } as const;
}
