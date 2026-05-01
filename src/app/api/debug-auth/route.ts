import { NextResponse } from "next/server";

export async function GET() {
  const dbUrl = process.env.DATABASE_URL ?? "";
  let dbHost = "unknown";
  let rawFetchStatus = "untested";
  let dbStatus = "untested";

  // Extract hostname from DATABASE_URL
  try {
    const parsed = new URL(dbUrl);
    dbHost = parsed.hostname;
  } catch {
    dbHost = "invalid URL";
  }

  // Test raw fetch to Neon HTTP endpoint
  try {
    const neonEndpoint = `https://${dbHost}/sql`;
    const res = await fetch(neonEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: "SELECT 1", params: [] }),
      cache: "no-store",
    });
    rawFetchStatus = `${res.status} ${res.statusText}`;
  } catch (e: unknown) {
    rawFetchStatus = "error: " + String(e);
  }

  // Test via drizzle
  try {
    const { db } = await import("@/db");
    const { sql } = await import("drizzle-orm");
    await db.execute(sql`SELECT 1`);
    dbStatus = "ok";
  } catch (e: unknown) {
    dbStatus = "error: " + String(e);
  }

  return NextResponse.json({
    dbHost,
    hasDbUrl: !!dbUrl,
    rawFetchStatus,
    dbStatus,
    hasAuthSecret: !!process.env.AUTH_SECRET,
    hasAdminPassword: !!process.env.ADMIN_PASSWORD,
  });
}
