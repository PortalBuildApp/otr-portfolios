import { neon, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

// Bypass Next.js fetch instrumentation by using the native fetch reference
// captured before Next.js patches globalThis.fetch
neonConfig.fetchFunction = (url: string, init?: RequestInit) =>
  fetch(url, { ...init, cache: "no-store" });

const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle(sql, { schema });
