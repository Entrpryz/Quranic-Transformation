// prisma.config.ts
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "npx ts-node src/prisma/seed.ts", // Ensure this path is correct
  },
  engine: "classic",
  datasource: {
    url: env("DATABASE_URL"),
  },
});