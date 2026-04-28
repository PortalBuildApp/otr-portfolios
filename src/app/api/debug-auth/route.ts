import { NextResponse } from "next/server";
import { Resend } from "resend";

export async function GET() {
  const adminEmail = (process.env.ADMIN_EMAIL ?? "").trim();

  // Test DB connection using WebSocket mode (same as app)
  let dbStatus = "untested";
  try {
    const { db } = await import("@/db");
    await db.execute("SELECT 1");
    dbStatus = "ok";
  } catch (e: unknown) {
    dbStatus = "error: " + String(e);
  }

  return NextResponse.json({
    hasAdminEmail: !!adminEmail,
    adminEmail,
    hasAuthSecret: !!process.env.AUTH_SECRET,
    hasResendKey: !!process.env.AUTH_RESEND_KEY,
    resendFrom: process.env.RESEND_FROM,
    hasDbUrl: !!process.env.DATABASE_URL,
    dbStatus,
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
