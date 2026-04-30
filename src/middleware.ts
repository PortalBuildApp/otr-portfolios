import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const SECRET = new TextEncoder().encode(process.env.AUTH_SECRET!);
const COOKIE = "otr_admin";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Always allow login page through — no cookie check
  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  const token = req.cookies.get(COOKIE)?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }

  try {
    await jwtVerify(token, SECRET);
    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }
}

export const config = {
  matcher: ["/admin/:path*"],
};
