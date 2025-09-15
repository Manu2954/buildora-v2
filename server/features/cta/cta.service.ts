import { countLeadsBetween, createLead, findConfig, upsertConfig, listLeads, setLeadStatus, getLeadById, updateLead as updateLeadRepo, createLeadNote, listLeadNotes, logLeadEvent } from "./cta.repo";

export async function getConfig(key: string) {
  const cfg = await findConfig(key);
  return { key, config: (cfg?.json as Record<string, unknown>) ?? {} } as const;
}

export async function putConfig(key: string, config: Record<string, unknown>) {
  await upsertConfig(key, config);
  return { ok: true, key } as const;
}

export async function submitLead(input: {
  name: string;
  phone: string;
  location: string;
  requirement: string;
  consent: true;
  email?: string;
  message?: string;
  page?: string;
  variant?: string;
  source?: string;
  utm?: {
    source?: string;
    medium?: string;
    campaign?: string;
    term?: string;
    content?: string;
  };
  fingerprint?: string;
  ip?: string;
  userAgent?: string;
}) {
  const lead = await createLead({
    name: input.name,
    email: input.email,
    phone: input.phone,
    message: input.message,
    location: input.location,
    requirement: input.requirement,
    page: input.page,
    variant: input.variant,
    source: input.source,
    utmSource: input.utm?.source ?? null,
    utmMedium: input.utm?.medium ?? null,
    utmCampaign: input.utm?.campaign ?? null,
    utmTerm: input.utm?.term ?? null,
    utmContent: input.utm?.content ?? null,
    fingerprint: input.fingerprint ?? null,
    ip: input.ip ?? null,
    userAgent: input.userAgent ?? null,
  });
  return { id: lead.id } as const;
}

export async function analytics(from: Date, to: Date) {
  const total = await countLeadsBetween(from, to);
  return { from: from.toISOString().slice(0, 10), to: to.toISOString().slice(0, 10), total } as const;
}

export async function leadsList(params: {
  from?: Date;
  to?: Date;
  status?: "NEW" | "CONTACTED" | "CLOSED";
  q?: string;
  page: number;
  pageSize: number;
}) {
  const skip = (params.page - 1) * params.pageSize;
  const { items, total } = await listLeads({
    from: params.from,
    to: params.to,
    status: params.status,
    q: params.q,
    skip,
    take: params.pageSize,
  });
  return { items, total, page: params.page, pageSize: params.pageSize } as const;
}

export async function updateLeadStatus(id: string, status: "NEW" | "CONTACTED" | "CLOSED") {
  const lead = await setLeadStatus(id, status);
  await logLeadEvent({ leadId: id, type: "STATUS_CHANGE", data: { status } });
  return { id: lead.id, status: lead.status } as const;
}

export async function leadDetail(id: string) {
  const lead = await getLeadById(id);
  if (!lead) return null;
  const notes = await listLeadNotes(id);
  return { lead, notes } as const;
}

export async function updateLead(id: string, data: Partial<{ assignedToId: string | null; followUpAt: string; priority: "LOW"|"MEDIUM"|"HIGH"; status: "NEW"|"CONTACTED"|"CLOSED" }>, actorId?: string) {
  const patch: any = {};
  if (data.assignedToId !== undefined) patch.assignedToId = data.assignedToId;
  if (data.followUpAt !== undefined) patch.followUpAt = data.followUpAt ? new Date(data.followUpAt) : null;
  if (data.priority !== undefined) patch.priority = data.priority;
  if (data.status !== undefined) patch.status = data.status;
  const lead = await updateLeadRepo(id, patch);
  await logLeadEvent({ leadId: id, actorId, type: "LEAD_UPDATE", data: patch });
  return lead as any;
}

export async function addLeadNote(id: string, content: string, authorId?: string) {
  const note = await createLeadNote({ leadId: id, authorId, content });
  await logLeadEvent({ leadId: id, actorId: authorId, type: "NOTE_ADDED", data: { noteId: note.id } });
  return note;
}
