import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ["warn", "error"]
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export async function getDemoUserId() {
  const existing = await prisma.user.findFirst();
  if (existing) return existing.id;
  const created = await prisma.user.create({ data: {} });
  return created.id;
}
