import { MediaKind, PaymentStatus, Prisma, ProjectStatus } from "@prisma/client";
import { prisma } from "./client";

async function main() {
  const existing = await prisma.project.findUnique({ where: { id: "BE-10234" } });
  if (existing) {
    console.info("Sample project already exists");
    return;
  }

  await prisma.$transaction(async (tx) => {
    const salesman = await tx.contact.create({
      data: {
        name: "Amit Sharma",
        phone: "+91 98765 43210",
      },
    });

    const designer = await tx.contact.create({
      data: {
        name: "Priya Mehta",
      },
    });

    const contractor = await tx.contact.create({
      data: {
        name: "Rohan Verma",
      },
    });

    const afterSales = await tx.contact.create({
      data: {
        name: "Rahul Desai",
        phone: "+91 99876 54321",
        email: "support@buildora.com",
      },
    });

    const quotationFile = await tx.fileObject.create({
      data: {
        name: "BE-10234-Quotation.pdf",
        url: "https://example.com/files/BE-10234-Quotation.pdf",
      },
    });

    const project = await tx.project.create({
      data: {
        id: "BE-10234",
        address: "Sunshine Residency, Andheri West, Mumbai",
        type: "Apartment",
        salesmanId: salesman.id,
        designerId: designer.id,
        contractorId: contractor.id,
        startDate: new Date("2024-06-15T00:00:00.000Z"),
        eta: new Date("2024-11-30T00:00:00.000Z"),
        status: ProjectStatus.IN_PROGRESS,
        sitePhoto:
          "https://images.unsplash.com/photo-1501045661006-fcebe0257c3f?q=80&w=1200&auto=format&fit=crop",
        quotationFileId: quotationFile.id,
        discounts: new Prisma.Decimal(25000),
        extras: new Prisma.Decimal(18000),
        invoices: {
          create: [
            {
              name: "Invoice-1.pdf",
              url: "https://example.com/files/invoice-1.pdf",
            },
            {
              name: "Invoice-2.pdf",
              url: "https://example.com/files/invoice-2.pdf",
            },
          ],
        },
        permits: {
          create: [
            {
              name: "Society NOC.pdf",
              url: "https://example.com/files/society-noc.pdf",
            },
            {
              name: "Electrical Approval.pdf",
              url: "https://example.com/files/electrical-approval.pdf",
            },
          ],
        },
        signoffs: {
          create: [
            {
              name: "Design Sign-off.pdf",
              url: "https://example.com/files/design-signoff.pdf",
            },
            {
              name: "Material Selection Sign-off.pdf",
              url: "https://example.com/files/material-signoff.pdf",
            },
          ],
        },
        materials: {
          create: [
            { type: "Plywood", brand: "GreenPly 710", qty: "45 sheets", status: "Ordered" },
            { type: "Laminate", brand: "Merino 1mm", qty: "120 sqm", status: "Delivered" },
            { type: "Hardware", brand: "Hettich Hinges", qty: "200 pcs", status: "Installed" },
            { type: "Paint", brand: "Asian Royale", qty: "40 L", status: "Delivered" },
          ],
        },
        milestones: {
          create: [
            {
              label: "Advance (20%)",
              amount: new Prisma.Decimal(200000),
              status: PaymentStatus.PAID,
              approved: true,
            },
            {
              label: "Design Sign-off (20%)",
              amount: new Prisma.Decimal(200000),
              status: PaymentStatus.PAID,
              approved: true,
            },
            {
              label: "Material Procurement (30%)",
              amount: new Prisma.Decimal(300000),
              status: PaymentStatus.PENDING,
              approved: true,
            },
            {
              label: "Execution (20%)",
              amount: new Prisma.Decimal(200000),
              status: PaymentStatus.PENDING,
              approved: false,
            },
            {
              label: "Handover (10%)",
              amount: new Prisma.Decimal(100000),
              status: PaymentStatus.PENDING,
              approved: false,
            },
          ],
        },
        designs: {
          create: [
            {
              url: "https://images.unsplash.com/photo-1616596878577-2f8a0eb320f6?q=80&w=800&auto=format&fit=crop",
              title: "Living Room Concept",
            },
            {
              url: "https://images.unsplash.com/photo-1582582494700-1ddb44dcd791?q=80&w=800&auto=format&fit=crop",
              title: "Modular Kitchen - Warm Oak",
            },
            {
              url: "https://images.unsplash.com/photo-1616596878578-e8172be86e43?q=80&w=800&auto=format&fit=crop",
              title: "Master Bedroom Wardrobe",
            },
          ],
        },
        worksiteMedia: {
          create: [
            {
              kind: MediaKind.IMAGE,
              url: "https://images.unsplash.com/photo-1550226891-ef816aed4a98?q=80&w=1200&auto=format&fit=crop",
              caption: "Site inspection",
            },
            {
              kind: MediaKind.IMAGE,
              url: "https://images.unsplash.com/photo-1529429617124-aee711a2cb6d?q=80&w=1200&auto=format&fit=crop",
              caption: "Electrical work in progress",
            },
          ],
        },
      },
    });

    const certificate = await tx.fileObject.create({
      data: {
        name: "Completion-Certificate.pdf",
        url: "https://example.com/files/completion-certificate.pdf",
      },
    });

    const warranty = await tx.fileObject.create({
      data: {
        name: "Warranty-Documents.pdf",
        url: "https://example.com/files/warranty-documents.pdf",
      },
    });

    await tx.projectClosure.create({
      data: {
        projectId: project.id,
        certificateId: certificate.id,
        warrantyId: warranty.id,
        afterSalesId: afterSales.id,
        handoverDate: new Date("2024-12-05T00:00:00.000Z"),
        followupDate: new Date("2025-03-05T00:00:00.000Z"),
      },
    });

    await tx.mediaAsset.createMany({
      data: [
        {
          projectId: project.id,
          kind: MediaKind.IMAGE,
          url: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?q=80&w=1200&auto=format&fit=crop",
          caption: "Final living room",
          isClosure: true,
        },
        {
          projectId: project.id,
          kind: MediaKind.IMAGE,
          url: "https://images.unsplash.com/photo-1538688525198-9b88f6f53126?q=80&w=1200&auto=format&fit=crop",
          caption: "Completed bedroom",
          isClosure: true,
        },
      ],
    });
  });

  console.info("Sample project seeded");
}

main()
  .then(() => prisma.$disconnect())
  .catch((err) => {
    console.error(err);
    return prisma.$disconnect();
  });
