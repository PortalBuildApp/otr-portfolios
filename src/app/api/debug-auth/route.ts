import { NextResponse } from "next/server";
import { Resend } from "resend";

export async function GET() {
  const adminEmail = (process.env.ADMIN_EMAIL ?? "").trim();

  // Test DB connection
  let dbStatus = "untested";
  try {
    const { neon } = await import("@neondatabase/serverless");
    const sql = neon(process.env.DATABASE_URL!);
    await sql`SELECT 1`;
    dbStatus = "ok";
  } catch (e: unknown) {
    const cause = (e as { cause?: unknown })?.cause;
    dbStatus = "error: " + String(e) + " | cause: " + String(cause);
  }

  // Also test raw fetch to Neon host
  let fetchStatus = "untested";
  try {
    const url = new URL(process.env.DATABASE_URL!.replace("postgresql://", "https://").split("@")[1].split("/")[0]);
    const res = await fetch(`https://${url.hostname}`, { signal: AbortSignal.timeout(5000) });
    fetchStatus = "reachable: " + res.status;
  } catch (e: unknown) {
    fetchStatus = "unreachable: " + String(e);
  }

  return NextResponse.json({
    hasAdminEmail: !!adminEmail,
    adminEmail,
    hasAuthSecret: !!process.env.AUTH_SECRET,
    hasResendKey: !!process.env.AUTH_RESEND_KEY,
    resendFrom: process.env.RESEND_FROM,
    hasDbUrl: !!process.env.DATABASE_URL,
    dbStatus,
    fetchStatus,
  });
}

export async function POST() {
  try {
    const resend = new Resend(process.env.AUTH_RESEND_KEY);
    const result = await resend.emails.send({
      from: process.env.RESEND_FROM ?? "onboarding@resend.dev",
      to: process.env.ADMIN_EMAIL!,
      subject: "OTR Portfolios — Resend test",
      html: "<p>Resend is working!</p>",
    });
    return NextResponse.json({ ok: true, result });
  } catch (err: unknown) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
