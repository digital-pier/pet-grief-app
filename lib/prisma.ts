import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import path from "path";
import fs from "fs";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

function createClient() {
  const dbDir = path.join(process.cwd(), ".data");
  fs.mkdirSync(dbDir, { recursive: true });
  const dbPath = path.join(dbDir, "shared-leash.db");
  const adapter = new PrismaBetterSqlite3({ url: `file:${dbPath}` });
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma || createClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
