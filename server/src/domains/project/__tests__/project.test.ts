import { beforeEach, describe, expect, it, vi } from "vitest";
import { PaymentStatus, Prisma, ProjectStatus } from "@prisma/client";
import { prisma } from "../../../../prisma/client";
import { projectService } from "../service";
import {
  ProjectCreateInputSchema,
  ProjectSchema,
} from "../types";

const sampleProjectInput = {
  id: "BE-10234",
  address: "Sunshine Residency, Andheri West, Mumbai",
  type: "Apartment",
  status: "In Progress",
  salesman: { name: "Amit Sharma", phone: "+91 98765 43210" },
  designer: { name: "Priya Mehta" },
  contractor: { name: "Rohan Verma" },
  startDate: "2024-06-15",
  eta: "2024-11-30",
  sitePhoto: "https://example.com/site.jpg",
  quotationFile: { name: "BE-10234-Quotation.pdf", url: "https://example.com/quote.pdf" },
  discounts: 25000,
  extras: 18000,
  invoices: [
    { name: "Invoice-1.pdf", url: "https://example.com/invoice-1.pdf" },
  ],
  milestones: [
    {
      label: "Advance (20%)",
      amount: 200000,
      status: "Paid",
      approved: true,
      dueDate: "2024-06-30",
    },
  ],
  designs: [
    {
      url: "https://example.com/design.jpg",
      title: "Living Room Concept",
    },
  ],
  materials: [
    {
      type: "Plywood",
      brand: "GreenPly 710",
      qty: "45 sheets",
      status: "Ordered",
    },
  ],
  permits: [
    { name: "Society NOC.pdf", url: "https://example.com/noc.pdf" },
  ],
  signoffs: [
    { name: "Design Sign-off.pdf", url: "https://example.com/signoff.pdf" },
  ],
  worksiteMedia: [
    { url: "https://example.com/media-1.jpg", kind: "image", caption: "Initial survey" },
  ],
  closure: {
    finalMedia: [
      { url: "https://example.com/final-1.jpg", kind: "image" },
    ],
    certificate: { name: "Completion-Certificate.pdf", url: "https://example.com/certificate.pdf" },
    warranty: { name: "Warranty.pdf", url: "https://example.com/warranty.pdf" },
    afterSales: { name: "Rahul Desai", phone: "+91 99876 54321", email: "support@buildora.com" },
    handoverDate: "2024-12-05",
    followupDate: "2025-03-05",
  },
};

const projectRecordMock = {
  id: "BE-10234",
  address: sampleProjectInput.address,
  type: sampleProjectInput.type,
  status: ProjectStatus.IN_PROGRESS,
  salesmanId: null,
  designerId: null,
  contractorId: null,
  startDate: new Date("2024-06-15T00:00:00.000Z"),
  eta: new Date("2024-11-30T00:00:00.000Z"),
  sitePhoto: sampleProjectInput.sitePhoto,
  quotationFileId: null,
  quotationFile: null,
  discounts: new Prisma.Decimal(0),
  extras: new Prisma.Decimal(0),
  createdAt: new Date("2024-01-01T00:00:00.000Z"),
  updatedAt: new Date("2024-01-01T00:00:00.000Z"),
  deletedAt: null,
  salesman: null,
  designer: null,
  contractor: null,
  materials: [],
  milestones: [],
  designs: [],
  worksiteMedia: [],
  closure: null,
  invoices: [],
  permits: [],
  signoffs: [],
} as any;

const serializedProjectMock = ProjectSchema.parse({
  id: "BE-10234",
  address: sampleProjectInput.address,
  type: sampleProjectInput.type,
  status: "In Progress",
  salesman: undefined,
  designer: undefined,
  contractor: undefined,
  startDate: "2024-06-15",
  eta: "2024-11-30",
  sitePhoto: sampleProjectInput.sitePhoto,
  quotationFile: undefined,
  discounts: 0,
  extras: 0,
  invoices: [],
  milestones: [],
  designs: [],
  materials: [],
  permits: [],
  signoffs: [],
  worksiteMedia: [],
  closure: undefined,
  createdAt: "2024-01-01T00:00:00.000Z",
  updatedAt: "2024-01-01T00:00:00.000Z",
});

beforeEach(() => {
  vi.restoreAllMocks();
});

describe("Project validation", () => {
  it("accepts a full project payload", () => {
    expect(() => ProjectCreateInputSchema.parse(sampleProjectInput)).not.toThrow();
  });

  it("rejects invalid project id format", () => {
    expect(() =>
      ProjectCreateInputSchema.parse({
        ...sampleProjectInput,
        id: "invalid",
      }),
    ).toThrow();
  });

  it("rejects negative milestone amount", () => {
    expect(() =>
      ProjectCreateInputSchema.parse({
        ...sampleProjectInput,
        milestones: [
          {
            label: "Bad milestone",
            amount: -10,
          },
        ],
      }),
    ).toThrow();
  });
});

describe("Project service", () => {
  it("maps payment status during milestone creation", async () => {
    vi.spyOn(prisma.project, "findUnique").mockResolvedValueOnce(projectRecordMock as any);
    const milestoneCreateSpy = vi
      .spyOn(prisma.milestone, "create")
      .mockResolvedValueOnce({} as any);
    vi.spyOn(projectService, "get").mockResolvedValueOnce(serializedProjectMock);

    await projectService.createMilestone("BE-10234", {
      label: "Advance",
      amount: 1000,
      status: "Paid",
    });

    expect(milestoneCreateSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          status: PaymentStatus.PAID,
        }),
      }),
    );
  });

  it("maps payment status during milestone update", async () => {
    vi.spyOn(prisma.project, "findUnique").mockResolvedValueOnce(projectRecordMock as any);
    const milestoneUpdateSpy = vi
      .spyOn(prisma.milestone, "update")
      .mockResolvedValueOnce({} as any);
    vi.spyOn(projectService, "get").mockResolvedValueOnce(serializedProjectMock);

    await projectService.updateMilestone("BE-10234", "milestone-id", { status: "Overdue" });

    expect(milestoneUpdateSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          status: PaymentStatus.OVERDUE,
        }),
      }),
    );
  });
});
