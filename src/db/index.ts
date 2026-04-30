import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

// Pass cache: no-store to bypass Next.js fetch patching which breaks Neon HTTP
const sql = neon(process.env.DATABASE_URL!, {
  fetchOptions: { cache: "no-store" },
});

export const db = drizzle(sql, { schema });
