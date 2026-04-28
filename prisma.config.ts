import { defineConfig, env } from "prisma/config";
import path from "node:path";

// Prisma 7 + prisma.config.ts: .env is no longer auto-loaded. Load it ourselves
// so env("DATABASE_URL") below can resolve. .env.local is loaded too for
// Next.js parity (overrides .env if both define the same var).
for (const file of [".env", ".env.local"]) {
  try {
    process.loadEnvFile(path.join(import.meta.dirname, file));
  } catch {
    // file missing is fine — vars may come from the shell or CI
  }
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: env("DATABASE_URL"),
  },
});
