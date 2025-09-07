import { countLeadsBetween, createLead, findConfig, upsertConfig } from "./cta.repo";

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

