
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "sqlite",
  schema: "./test/support/db/schema.ts",
  out: './test/drizzle',
  dbCredentials: {
    url: './test/database.db'
  }
});
