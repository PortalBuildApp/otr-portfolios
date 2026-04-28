import { neon, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

// Required for Vercel serverless environment
neonConfig.fetchEndpoint = (host) => {
  return `https://${host}/sql/v1`;
};

const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle(sql, { schema });
