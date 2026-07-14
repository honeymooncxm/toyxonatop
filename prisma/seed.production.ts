/**
 * Production seed — no demo venues, owners, customers, reviews, or ads.
 * Creates only the reference data (services/categories) and one real admin
 * account, read from ADMIN_EMAIL / ADMIN_PASSWORD. Run once after the first
 * deploy: `npx tsx prisma/seed.production.ts`
 */
import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";
import { SERVICES, CATEGORIES } from "./reference-data";

const url = process.env.DATABASE_URL;
if (!url) throw new Error("DATABASE_URL must be set to the Neon connection string.");
const adapter = new PrismaPg({ connectionString: url });
const prisma = new PrismaClient({ adapter });

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    throw new Error(
      "ADMIN_EMAIL and ADMIN_PASSWORD must be set before running the production seed.",
    );
  }
  if (adminPassword === "Admin123!" || adminPassword === "change-me") {
    throw new Error(
      "Refusing to seed with the default/placeholder ADMIN_PASSWORD. Set a real, unique password first.",
    );
  }

  for (const s of SERVICES) {
    await prisma.service.upsert({ where: { slug: s.slug }, update: s, create: s });
  }
  for (const c of CATEGORIES) {
    await prisma.category.upsert({ where: { slug: c.slug }, update: c, create: c });
  }

  const passwordHash = await bcrypt.hash(adminPassword, 10);
  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: { email: adminEmail, name: "Admin", passwordHash, role: "ADMIN" },
  });

  console.log(`Production seed complete. Services: ${SERVICES.length}, categories: ${CATEGORIES.length}, admin: ${admin.email}`);
  console.log("No demo venues/owners/customers/reviews/ads were created — the marketplace starts empty and fills up as real owners register.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
