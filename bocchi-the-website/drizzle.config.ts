import { type Config } from "drizzle-kit";

import { env } from "@rithik/bocchi-the-website/env";

export default {
  schema: "./src/server/db/schema.ts",
  driver: "better-sqlite",
  dbCredentials: {
    url: env.DATABASE_URL,
  },
  tablesFilter: ["bocchi-the-website_*"],
} satisfies Config;
