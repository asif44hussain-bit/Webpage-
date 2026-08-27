import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import catalog from "./products.json";

const prisma = new PrismaClient();

async function main() {
  console.log(`Seeding ${catalog.length} products...`);

  for (const p of catalog as any[]) {
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        sku: p.sku,
        slug: p.slug,
        name: p.name,
        description: p.description,
        story: p.story || null,
        priceInPaise: p.priceInPaise,
        category: p.category,
        sizes: p.sizes,
        status: p.status,
        dropNumber: p.dropNumber,
        featured: p.status === "LIVE",
        stockCount: p.stockCount,
        images: {
          create: p.images.map((url: string, i: number) => ({
            url,
            alt: `${p.name} — CLOVEKICK`,
            position: i,
          })),
        },
      },
    });
  }

  const liveCount = await prisma.product.count({ where: { status: "LIVE" } });
  console.log(`Live products after seed: ${liveCount}`);

  const adminEmail = process.env.ADMIN_EMAIL || "admin@clovekick.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "change-me-before-deploy";
  const passwordHash = await bcrypt.hash(adminPassword, 10);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: { passwordHash },
    create: { email: adminEmail, passwordHash, role: "ADMIN" },
  });

  console.log(`Admin user ready: ${adminEmail}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
