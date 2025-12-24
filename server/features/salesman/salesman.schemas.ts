import { z } from "zod";

export const SalesmanEntrySchema = z.object({
  startTime: z.string().datetime(),
  endTime: z.string().datetime().optional(),
  notes: z.string().max(1000).optional(),
  location: z.string().max(200).optional(),
});

export const SalesmanLeadSchema = z.object({
  name: z.string().min(1).max(100),
  phone: z.string().min(7).max(20),
  location: z.string().min(1).max(300),
  requirement: z.string().min(1).max(500),
  consent: z.boolean().refine((v) => v === true, { message: "Consent required" }),
  email: z.string().email().optional(),
  message: z.string().max(1000).optional(),
});
