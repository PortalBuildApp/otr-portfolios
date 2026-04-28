import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    hasAdminEmail: !!process.env.ADMIN_EMAIL,
    adminEmail: process.env.ADMIN_EMAIL,
    hasAuthSecret: !!process.env.AUTH_SECRET,
    hasResendKey: !!process.env.AUTH_RESEND_KEY,
    resendFrom: process.env.RESEND_FROM,
    hasDbUrl: !!process.env.DATABASE_URL,
  });
}
