import "dotenv/config";
import { prisma } from "./prisma/client";
const db = prisma as any;
import argon2 from "argon2";

async function main() {
  const adminEmail = process.env.SEED_ADMIN_EMAIL || "admin@example.com";
  const adminPass = process.env.SEED_ADMIN_PASSWORD || "admin123";
  let admin = await db.user.findUnique({ where: { email: adminEmail } });
  if (!admin) {
    const hash = await argon2.hash(adminPass);
    admin = await db.user.create({ data: { email: adminEmail, password: hash, role: "ADMIN" } });
    console.log("Created admin:", adminEmail);
  } else {
    console.log("Admin exists:", adminEmail);
  }

  const designs = [
    {
      title: "Minimalist Living Room",
      description: "Clean lines, neutral palette, warm wood accents.",
      category: "Living Room",
      style: "Minimalist",
      budget: "BASIC" as const,
      basePriceCents: 1500000,
      durationDays: 20,
      images: [
        "https://images.unsplash.com/photo-1505691723518-36a5ac3b2aa5?q=80&w=1600&auto=format&fit=crop",
      ],
      customizationOptions: { materials: ["Laminate", "Veneer", "Acrylic"], colors: ["Oak", "Walnut", "White"] },
    },
    {
      title: "Warm Oak Modular Kitchen",
      description: "Ergonomic modular layout with premium finishes.",
      category: "Kitchen",
      style: "Modern",
      budget: "PREMIUM" as const,
      basePriceCents: 3000000,
      durationDays: 35,
      images: [
        "https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=1600&auto=format&fit=crop",
      ],
      customizationOptions: { countertop: ["Quartz", "Granite"], hardware: ["Hettich", "Blum"] },
    },
  ];

  if (!(db as any).design) {
    console.warn("Prisma client does not have 'design' model. Did you run 'npm run prisma:generate' and 'npm run db:push'? Skipping design seeding.");
  } else {
    for (const d of designs) {
      const exists = await (db as any).design.findFirst({ where: { title: d.title } });
      if (!exists) await (db as any).design.create({ data: d as any });
    }
  }

  console.log("Seed complete");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
