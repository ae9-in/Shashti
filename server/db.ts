import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

let internalPrisma: PrismaClient | null = null;

function getPrisma(): PrismaClient {
  if (internalPrisma) return internalPrisma;

  if (globalForPrisma.prisma) {
    internalPrisma = globalForPrisma.prisma;
    return internalPrisma;
  }

  try {
    internalPrisma = new PrismaClient();
    if (process.env.NODE_ENV !== "production") {
      globalForPrisma.prisma = internalPrisma;
    }
    return internalPrisma;
  } catch (error) {
    console.error("Failed to initialize Prisma Client:", error);
    throw error;
  }
}

// Export a proxy that forwards all property accesses to the lazily initialized PrismaClient.
// This prevents Prisma initialization errors from blocking serverless startup for non-DB routes.
export const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    const client = getPrisma();
    const value = Reflect.get(client, prop);
    if (typeof value === "function") {
      return value.bind(client);
    }
    return value;
  },
});
