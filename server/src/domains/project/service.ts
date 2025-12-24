import {
  MediaKind as DbMediaKind,
  PaymentStatus as DbPaymentStatus,
  Prisma,
  ProjectStatus as DbProjectStatus,
  Role as DbRole,
} from "@prisma/client";
import { prisma } from "../../../prisma/client";
import {
  ContactMini,
  DesignAssetsBatch,
  DesignAssetsBatchSchema,
  DesignAssetInputSchema,
  DesignAsset,
  DesignAssetInput,
  MEDIA_KIND_LABELS,
  MediaAsset,
  MediaAssetInput,
  MediaAssetsBatch,
  MediaAssetsBatchSchema,
  MediaAssetInputSchema,
  MediaKindLabel,
  Milestone,
  MilestoneCreateInput,
  MilestoneCreateSchema,
  MilestoneInputSchema,
  MilestoneSchema,
  MilestoneUpdateInput,
  MilestoneUpdateSchema,
  PAYMENT_STATUS_LABELS,
  PaymentStatusLabel,
  Project,
  ProjectClosure,
  ProjectClosureInputSchema,
  ProjectClosureSchema,
  ProjectClosureUpsertInput,
  ProjectFileAttachment,
  ProjectFileAttachmentSchema,
  ProjectListQuery,
  ProjectListQuerySchema,
  ProjectSchema,
  ProjectStatusLabel,
  ProjectUpdateInput,
  ProjectUpdateInputSchema,
  PROJECT_STATUS_LABELS,
  ProjectCreateInput,
  ProjectCreateInputSchema,
  MaterialLine,
  MaterialLineInput,
  MATERIAL_STATUS_LABELS,
  MaterialLinesBatch,
  MaterialLinesBatchSchema,
  MaterialLineInputSchema,
  FileRef,
  FileRefSchema,
  InvoiceRef,
  InvoiceRefSchema,
} from "./types";

const statusLabelToDb: Record<ProjectStatusLabel, DbProjectStatus> = {
  "Quotation Pending": DbProjectStatus.QUOTATION_PENDING,
  "In Progress": DbProjectStatus.IN_PROGRESS,
  "Material Procurement": DbProjectStatus.MATERIAL_PROCUREMENT,
  "Execution": DbProjectStatus.EXECUTION,
  "Completed": DbProjectStatus.COMPLETED,
  "On Hold": DbProjectStatus.ON_HOLD,
  "Cancelled": DbProjectStatus.CANCELLED,
};

const statusDbToLabel = Object.fromEntries(
  Object.entries(statusLabelToDb).map(([label, db]) => [db, label as ProjectStatusLabel])
) as Record<DbProjectStatus, ProjectStatusLabel>;

const paymentLabelToDb: Record<PaymentStatusLabel, DbPaymentStatus> = {
  Pending: DbPaymentStatus.PENDING,
  Paid: DbPaymentStatus.PAID,
  "Partially Paid": DbPaymentStatus.PARTIALLY_PAID,
  Overdue: DbPaymentStatus.OVERDUE,
};

const paymentDbToLabel = Object.fromEntries(
  Object.entries(paymentLabelToDb).map(([label, db]) => [db, label as PaymentStatusLabel])
) as Record<DbPaymentStatus, PaymentStatusLabel>;

const mediaLabelToDb: Record<MediaKindLabel, DbMediaKind> = {
  image: DbMediaKind.IMAGE,
  video: DbMediaKind.VIDEO,
};

const mediaDbToLabel = Object.fromEntries(
  Object.entries(mediaLabelToDb).map(([label, db]) => [db, label as MediaKindLabel])
) as Record<DbMediaKind, MediaKindLabel>;

const projectInclude = {
  salesman: true,
  designer: true,
  contractor: true,
  quotationFile: true,
  materials: {
    orderBy: { createdAt: "asc" as const },
  },
  milestones: {
    orderBy: { createdAt: "asc" as const },
  },
  designs: {
    orderBy: { createdAt: "asc" as const },
  },
  worksiteMedia: {
    orderBy: { createdAt: "asc" as const },
  },
  closure: {
    include: {
      certificate: true,
      warranty: true,
      afterSales: true,
    },
  },
  invoices: true,
  permits: true,
  signoffs: true,
} satisfies Prisma.ProjectInclude;

type ProjectWithRelations = Prisma.ProjectGetPayload<{
  include: typeof projectInclude;
}>;

const decimalToNumber = (value?: Prisma.Decimal | null): number => {
  if (!value) return 0;
  return Number(value);
};

const formatDate = (value?: Date | null): string | undefined => {
  if (!value) return undefined;
  return value.toISOString().slice(0, 10);
};

const parseDateInput = (value?: string): Date | undefined => {
  if (!value) return undefined;
  return new Date(`${value}T00:00:00.000Z`);
};

const mapContact = (contact?: {
  name: string;
  phone: string | null;
  email: string | null;
} | null): ContactMini | undefined => {
  if (!contact) return undefined;
  return {
    name: contact.name,
    phone: contact.phone ?? undefined,
    email: contact.email ?? undefined,
  };
};

const mapFile = (file: { name: string; url: string }): FileRef => ({
  name: file.name,
  url: file.url,
});

const mapMilestoneRecord = (milestone: ProjectWithRelations["milestones"][number]): Milestone => ({
  id: milestone.id,
  label: milestone.label,
  amount: decimalToNumber(milestone.amount),
  status: paymentDbToLabel[milestone.status],
  approved: milestone.approved,
  dueDate: formatDate(milestone.dueDate),
});

const mapMaterialRecord = (material: ProjectWithRelations["materials"][number]): MaterialLine => ({
  id: material.id,
  type: material.type,
  brand: material.brand ?? undefined,
  qty: material.qty ?? undefined,
  status: MATERIAL_STATUS_LABELS.includes((material.status ?? "") as (typeof MATERIAL_STATUS_LABELS)[number])
    ? ((material.status as MaterialLine["status"]) ?? undefined)
    : undefined,
});

const mapDesignRecord = (design: ProjectWithRelations["designs"][number]): DesignAsset => ({
  id: design.id,
  url: design.url,
  title: design.title ?? undefined,
});

const mapMediaRecord = (media: ProjectWithRelations["worksiteMedia"][number]): MediaAsset => ({
  id: media.id,
  kind: mediaDbToLabel[media.kind],
  url: media.url,
  caption: media.caption ?? undefined,
});

const mapClosureRecord = (project: ProjectWithRelations): ProjectClosure | undefined => {
  if (!project.closure) return undefined;
  const { closure } = project;
  const finalMedia = project.worksiteMedia
    .filter((item) => item.isClosure)
    .map(mapMediaRecord);
  return {
    finalMedia,
    certificate: closure.certificate ? mapFile(closure.certificate) : undefined,
    warranty: closure.warranty ? mapFile(closure.warranty) : undefined,
    afterSales: mapContact(closure.afterSales),
    handoverDate: formatDate(closure.handoverDate),
    followupDate: formatDate(closure.followupDate),
  };
};

const serializeProject = (project: ProjectWithRelations): Project => {
  const worksiteMedia = project.worksiteMedia
    .filter((item) => !item.isClosure)
    .map(mapMediaRecord);

  return {
    id: project.id,
    address: project.address,
    type: project.type,
    status: statusDbToLabel[project.status],
    salesman: mapContact(project.salesman),
    designer: mapContact(project.designer),
    contractor: mapContact(project.contractor),
    startDate: formatDate(project.startDate),
    eta: formatDate(project.eta),
    sitePhoto: project.sitePhoto ?? undefined,
    quotationFile: project.quotationFile ? mapFile(project.quotationFile) : undefined,
    discounts: decimalToNumber(project.discounts),
    extras: decimalToNumber(project.extras),
    invoices: project.invoices.map(mapFile),
    milestones: project.milestones.map(mapMilestoneRecord),
    designs: project.designs.map(mapDesignRecord),
    materials: project.materials.map(mapMaterialRecord),
    permits: project.permits.map(mapFile),
    signoffs: project.signoffs.map(mapFile),
    worksiteMedia,
    closure: mapClosureRecord(project),
    createdAt: project.createdAt.toISOString(),
    updatedAt: project.updatedAt.toISOString(),
  };
};

const ensureContact = async (
  tx: Prisma.TransactionClient,
  contact: ContactMini | undefined,
  existingId: string | null | undefined,
): Promise<string | undefined> => {
  if (!contact) return existingId ?? undefined;
  if (existingId) {
    await tx.contact.update({
      where: { id: existingId },
      data: {
        name: contact.name,
        phone: contact.phone ?? null,
        email: contact.email ?? null,
      },
    });
    return existingId;
  }
  const created = await tx.contact.create({
    data: {
      name: contact.name,
      phone: contact.phone ?? null,
      email: contact.email ?? null,
    },
  });
  return created.id;
};

const createFileObject = async (
  tx: Prisma.TransactionClient,
  file: FileRef | undefined,
): Promise<string | undefined> => {
  if (!file) return undefined;
  const created = await tx.fileObject.create({
    data: {
      name: file.name,
      url: file.url,
    },
  });
  return created.id;
};

const createAttachments = async (
  tx: Prisma.TransactionClient,
  projectId: string,
  type: "invoices" | "permits" | "signoffs",
  files: FileRef[],
): Promise<void> => {
  if (!files.length) return;
  const payload = files.map((file) => ({ name: file.name, url: file.url }));
  switch (type) {
    case "invoices":
      await tx.project.update({ where: { id: projectId }, data: { invoices: { create: payload } } });
      break;
    case "permits":
      await tx.project.update({ where: { id: projectId }, data: { permits: { create: payload } } });
      break;
    case "signoffs":
      await tx.project.update({ where: { id: projectId }, data: { signoffs: { create: payload } } });
      break;
    default:
      throw new Error("Unsupported attachment type");
  }
};

const replaceAttachments = async (
  tx: Prisma.TransactionClient,
  project: ProjectWithRelations,
  type: "invoices" | "permits" | "signoffs",
  files: FileRef[] | undefined,
): Promise<void> => {
  if (files === undefined) return;
  const existing = project[type];
  if (existing.length) {
    switch (type) {
      case "invoices":
        await tx.project.update({ where: { id: project.id }, data: { invoices: { set: [] } } });
        break;
      case "permits":
        await tx.project.update({ where: { id: project.id }, data: { permits: { set: [] } } });
        break;
      case "signoffs":
        await tx.project.update({ where: { id: project.id }, data: { signoffs: { set: [] } } });
        break;
      default:
        throw new Error("Unsupported attachment type");
    }
    await tx.fileObject.deleteMany({
      where: { id: { in: existing.map((f) => f.id) } },
    });
  }
  if (files.length) {
    await createAttachments(tx, project.id, type, files);
  }
};

const mapMilestoneInput = (milestone: MilestoneCreateInput) => ({
  label: milestone.label,
  amount: new Prisma.Decimal(milestone.amount),
  status: paymentLabelToDb[milestone.status ?? "Pending"],
  approved: milestone.approved ?? false,
  dueDate: parseDateInput(milestone.dueDate) ?? null,
});

const mapMaterialInput = (
  material: MaterialLineInput,
): Prisma.MaterialLineItemCreateWithoutProjectInput => {
  const status: string | null = material.status ?? null;
  return {
    type: material.type,
    brand: material.brand ?? null,
    qty: material.qty ?? null,
    status,
  } as Prisma.MaterialLineItemCreateWithoutProjectInput;
};

const mapDesignInput = (design: DesignAssetInput): Prisma.DesignAssetCreateWithoutProjectInput => ({
  url: design.url,
  title: design.title ?? null,
});

const mapMediaInput = (
  media: MediaAssetInput,
  isClosure: boolean,
): Prisma.MediaAssetCreateWithoutProjectInput => ({
  kind: mediaLabelToDb[(media.kind ?? "image") as MediaKindLabel],
  url: media.url,
  caption: media.caption ?? null,
  isClosure,
});

const ensureProjectExists = async (
  id: string,
  client: Prisma.TransactionClient | typeof prisma = prisma,
) => {
  const project = await client.project.findUnique({
    where: { id },
    include: projectInclude,
  });
  if (!project || project.deletedAt) {
    throw new Error("Project not found");
  }
  return project;
};

const generateProjectId = async (): Promise<string> => {
  for (let attempt = 0; attempt < 10; attempt += 1) {
    const candidate = `BE-${Math.floor(10000 + Math.random() * 900000)}`;
    const existing = await prisma.project.findUnique({ where: { id: candidate } });
    if (!existing) return candidate;
  }
  throw new Error("Unable to generate project id");
};

export const projectService = {
  async list(query: ProjectListQuery) {
    const parsed = ProjectListQuerySchema.parse(query);
    const where: Prisma.ProjectWhereInput = {
      deletedAt: null,
    };

    if (parsed.status) {
      where.status = statusLabelToDb[parsed.status];
    }
    if (parsed.type) {
      where.type = parsed.type;
    }
    if (parsed.q) {
      where.address = { contains: parsed.q, mode: "insensitive" };
    }
    if (parsed.startFrom || parsed.startTo) {
      where.startDate = {};
      if (parsed.startFrom) {
        where.startDate.gte = parseDateInput(parsed.startFrom);
      }
      if (parsed.startTo) {
        const date = parseDateInput(parsed.startTo);
        if (date) {
          where.startDate.lte = date;
        }
      }
    }
    if (parsed.etaFrom || parsed.etaTo) {
      where.eta = {};
      if (parsed.etaFrom) {
        where.eta.gte = parseDateInput(parsed.etaFrom);
      }
      if (parsed.etaTo) {
        const date = parseDateInput(parsed.etaTo);
        if (date) {
          where.eta.lte = date;
        }
      }
    }

    const skip = (parsed.page - 1) * parsed.pageSize;
    const [items, total] = await Promise.all([
      prisma.project.findMany({
        where,
        include: projectInclude,
        orderBy: { createdAt: "desc" },
        skip,
        take: parsed.pageSize,
      }),
      prisma.project.count({ where }),
    ]);

    return {
      items: items.map(serializeProject),
      page: parsed.page,
      pageSize: parsed.pageSize,
      total,
      totalPages: Math.ceil(total / parsed.pageSize),
    };
  },

  async get(id: string) {
    const project = await prisma.project.findUnique({
      where: { id },
      include: projectInclude,
    });
    if (!project || project.deletedAt) return null;
    return serializeProject(project);
  },

  async create(input: ProjectCreateInput) {
    const payload = ProjectCreateInputSchema.parse(input);
    const projectId = payload.id ?? (await generateProjectId());

    return prisma.$transaction(async (tx) => {
      const salesmanId = await ensureContact(tx, payload.salesman, undefined);
      const designerId = await ensureContact(tx, payload.designer, undefined);
      const contractorId = await ensureContact(tx, payload.contractor, undefined);
      const quotationFileId = await createFileObject(tx, payload.quotationFile);

      const project = await tx.project.create({
        data: {
          id: projectId,
          address: payload.address,
          type: payload.type,
          status: statusLabelToDb[payload.status ?? "In Progress"],
          salesmanId: salesmanId ?? undefined,
          designerId: designerId ?? undefined,
          contractorId: contractorId ?? undefined,
          startDate: parseDateInput(payload.startDate) ?? null,
          eta: parseDateInput(payload.eta) ?? null,
          sitePhoto: payload.sitePhoto ?? null,
          quotationFileId: quotationFileId ?? undefined,
          discounts: new Prisma.Decimal(payload.discounts ?? 0),
          extras: new Prisma.Decimal(payload.extras ?? 0),
          materials: payload.materials.length
            ? {
                create: payload.materials.map((material) => mapMaterialInput(
                  MaterialLineInputSchema.parse(material),
                )),
              }
            : undefined,
          milestones: payload.milestones.length
            ? {
                create: payload.milestones.map((milestone) => mapMilestoneInput(
                  MilestoneCreateSchema.parse(milestone),
                )),
              }
            : undefined,
          designs: payload.designs.length
            ? {
                create: payload.designs.map((design) => mapDesignInput(
                  DesignAssetInputSchema.parse(design),
                )),
              }
            : undefined,
          worksiteMedia: payload.worksiteMedia.length
            ? {
                create: payload.worksiteMedia.map((media) =>
                  mapMediaInput(MediaAssetInputSchema.parse(media), false),
                ),
              }
            : undefined,
        },
        include: projectInclude,
      });

      if (payload.invoices.length) {
        await createAttachments(tx, project.id, "invoices", payload.invoices.map((file) => InvoiceRefSchema.parse(file)));
      }
      if (payload.permits.length) {
        await createAttachments(tx, project.id, "permits", payload.permits.map((file) => FileRefSchema.parse(file)));
      }
      if (payload.signoffs.length) {
        await createAttachments(tx, project.id, "signoffs", payload.signoffs.map((file) => FileRefSchema.parse(file)));
      }

      if (payload.closure) {
        const closurePayload = ProjectClosureInputSchema.parse(payload.closure);
        const certificateId = await createFileObject(tx, closurePayload.certificate);
        const warrantyId = await createFileObject(tx, closurePayload.warranty);
        const afterSalesId = await ensureContact(tx, closurePayload.afterSales, undefined);

        await tx.projectClosure.create({
          data: {
            projectId: project.id,
            certificateId: certificateId ?? undefined,
            warrantyId: warrantyId ?? undefined,
            afterSalesId: afterSalesId ?? undefined,
            handoverDate: parseDateInput(closurePayload.handoverDate) ?? null,
            followupDate: parseDateInput(closurePayload.followupDate) ?? null,
          },
        });

        if (closurePayload.finalMedia.length) {
          await tx.mediaAsset.createMany({
            data: closurePayload.finalMedia.map((media) => ({
              projectId: project.id,
              kind: mediaLabelToDb[(media.kind ?? "image") as MediaKindLabel],
              url: media.url,
              caption: media.caption ?? null,
              isClosure: true,
              createdAt: new Date(),
              updatedAt: new Date(),
            })),
          });
        }
      }

      const fresh = await tx.project.findUnique({
        where: { id: project.id },
        include: projectInclude,
      });
      if (!fresh) throw new Error("Failed to reload project");
      return serializeProject(fresh);
    });
  },

  async update(id: string, input: ProjectUpdateInput) {
    const payload = ProjectUpdateInputSchema.parse(input);

    return prisma.$transaction(async (tx) => {
      const project = await ensureProjectExists(id, tx);

      const salesmanId = await ensureContact(tx, payload.salesman, project.salesmanId);
      const designerId = await ensureContact(tx, payload.designer, project.designerId);
      const contractorId = await ensureContact(tx, payload.contractor, project.contractorId);

      const quotationFileId = payload.quotationFile
        ? await createFileObject(tx, payload.quotationFile)
        : project.quotationFileId ?? undefined;

      if (payload.quotationFile && project.quotationFileId) {
        await tx.fileObject.deleteMany({ where: { id: project.quotationFileId } });
      }

      await tx.project.update({
        where: { id },
        data: {
          address: payload.address ?? project.address,
          type: payload.type ?? project.type,
          status: payload.status ? statusLabelToDb[payload.status] : project.status,
          salesmanId: salesmanId ?? null,
          designerId: designerId ?? null,
          contractorId: contractorId ?? null,
          startDate: payload.startDate ? parseDateInput(payload.startDate) ?? null : project.startDate,
          eta: payload.eta ? parseDateInput(payload.eta) ?? null : project.eta,
          sitePhoto: payload.sitePhoto ?? project.sitePhoto,
          quotationFileId: quotationFileId ?? null,
          discounts: payload.discounts !== undefined ? new Prisma.Decimal(payload.discounts) : project.discounts,
          extras: payload.extras !== undefined ? new Prisma.Decimal(payload.extras) : project.extras,
        },
      });

      if (payload.materials) {
        await tx.materialLineItem.deleteMany({ where: { projectId: id } });
        if (payload.materials.length) {
          await tx.materialLineItem.createMany({
            data: payload.materials.map((material) => ({
              projectId: id,
              ...mapMaterialInput(MaterialLineInputSchema.parse(material)),
            })),
          });
        }
      }

      if (payload.milestones) {
        await tx.milestone.deleteMany({ where: { projectId: id } });
        if (payload.milestones.length) {
          await tx.milestone.createMany({
            data: payload.milestones.map((milestone) => ({
              projectId: id,
              ...mapMilestoneInput(MilestoneCreateSchema.parse(milestone)),
            })),
          });
        }
      }

      if (payload.designs) {
        await tx.designAsset.deleteMany({ where: { projectId: id } });
        if (payload.designs.length) {
          await tx.designAsset.createMany({
            data: payload.designs.map((design) => ({
              projectId: id,
              ...mapDesignInput(DesignAssetInputSchema.parse(design)),
            })),
          });
        }
      }

      if (payload.worksiteMedia) {
        await tx.mediaAsset.deleteMany({ where: { projectId: id, isClosure: false } });
        if (payload.worksiteMedia.length) {
          await tx.mediaAsset.createMany({
            data: payload.worksiteMedia.map((media) => ({
              projectId: id,
              ...mapMediaInput(MediaAssetInputSchema.parse(media), false),
            })),
          });
        }
      }

      await replaceAttachments(tx, project, "invoices", payload.invoices);
      await replaceAttachments(tx, project, "permits", payload.permits);
      await replaceAttachments(tx, project, "signoffs", payload.signoffs);

      if (payload.closure) {
        await this.upsertClosure(id, payload.closure, tx, project);
      }

      const fresh = await tx.project.findUnique({
        where: { id },
        include: projectInclude,
      });
      if (!fresh) throw new Error("Failed to reload project");
      return serializeProject(fresh);
    });
  },

  async delete(id: string) {
    await prisma.project.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  },

  async createMilestone(projectId: string, input: MilestoneCreateInput) {
    const payload = MilestoneCreateSchema.parse(input);
    await ensureProjectExists(projectId);
    await prisma.milestone.create({
      data: {
        projectId,
        ...mapMilestoneInput(payload),
      },
    });
    return this.get(projectId);
  },

  async updateMilestone(projectId: string, milestoneId: string, input: MilestoneUpdateInput) {
    const payload = MilestoneUpdateSchema.parse(input);
    await ensureProjectExists(projectId);
    await prisma.milestone.update({
      where: { id: milestoneId },
      data: {
        label: payload.label,
        amount: payload.amount !== undefined ? new Prisma.Decimal(payload.amount) : undefined,
        status: payload.status ? paymentLabelToDb[payload.status] : undefined,
        approved: payload.approved,
        dueDate: payload.dueDate ? parseDateInput(payload.dueDate) ?? null : undefined,
      },
    });
    return this.get(projectId);
  },

  async addMaterials(projectId: string, batch: MaterialLinesBatch) {
    const payload = MaterialLinesBatchSchema.parse(batch);
    await ensureProjectExists(projectId);
    await prisma.materialLineItem.createMany({
      data: payload.materials.map((material) => ({
        projectId,
        ...mapMaterialInput(MaterialLineInputSchema.parse(material)),
      })),
    });
    return this.get(projectId);
  },

  async addDesigns(projectId: string, batch: DesignAssetsBatch) {
    const payload = DesignAssetsBatchSchema.parse(batch);
    await ensureProjectExists(projectId);
    await prisma.designAsset.createMany({
      data: payload.designs.map((design) => ({
        projectId,
        ...mapDesignInput(DesignAssetInputSchema.parse(design)),
      })),
    });
    return this.get(projectId);
  },

  async addMedia(projectId: string, batch: MediaAssetsBatch) {
    const payload = MediaAssetsBatchSchema.parse(batch);
    await ensureProjectExists(projectId);
    await prisma.mediaAsset.createMany({
      data: payload.media.map((media) => ({
        projectId,
        ...mapMediaInput(MediaAssetInputSchema.parse(media), false),
      })),
    });
    return this.get(projectId);
  },

  async attachFile(projectId: string, attachment: ProjectFileAttachment) {
    const payload = ProjectFileAttachmentSchema.parse(attachment);
    await ensureProjectExists(projectId);
    const relation = `${payload.type}s` as "invoices" | "permits" | "signoffs";
    await createAttachments(prisma, projectId, relation, [payload.file]);
    return this.get(projectId);
  },

  async upsertClosure(
    projectId: string,
    closure: ProjectClosureUpsertInput,
    tx?: Prisma.TransactionClient,
    cached?: ProjectWithRelations,
  ) {
    const client = tx ?? prisma;
    const payload = ProjectClosureInputSchema.parse(closure);
      const project = cached ?? (await ensureProjectExists(projectId, client));

    const certificateId = await createFileObject(client, payload.certificate);
    const warrantyId = await createFileObject(client, payload.warranty);
    const afterSalesId = await ensureContact(client, payload.afterSales, project.closure?.afterSalesId);

    const existingClosure = await client.projectClosure.findUnique({
      where: { projectId },
    });

    if (existingClosure) {
      await client.projectClosure.update({
        where: { projectId },
        data: {
          certificateId: certificateId ?? existingClosure.certificateId,
          warrantyId: warrantyId ?? existingClosure.warrantyId,
          afterSalesId: afterSalesId ?? existingClosure.afterSalesId,
          handoverDate: payload.handoverDate ? parseDateInput(payload.handoverDate) ?? null : existingClosure.handoverDate,
          followupDate: payload.followupDate ? parseDateInput(payload.followupDate) ?? null : existingClosure.followupDate,
        },
      });
      await client.mediaAsset.deleteMany({ where: { projectId, isClosure: true } });
    } else {
      await client.projectClosure.create({
        data: {
          projectId,
          certificateId: certificateId ?? undefined,
          warrantyId: warrantyId ?? undefined,
          afterSalesId: afterSalesId ?? undefined,
          handoverDate: parseDateInput(payload.handoverDate) ?? null,
          followupDate: parseDateInput(payload.followupDate) ?? null,
        },
      });
    }

    if (payload.finalMedia.length) {
      await client.mediaAsset.createMany({
        data: payload.finalMedia.map((media) => ({
          projectId,
          ...mapMediaInput(MediaAssetInputSchema.parse(media), true),
        })),
      });
    }

    if (!tx) {
      return this.get(projectId);
    }
    return undefined;
  },
};
