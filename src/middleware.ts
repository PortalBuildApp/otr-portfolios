import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const isAdminRoute = req.nextUrl.pathname.startsWith("/admin");
  const isLoginPage = req.nextUrl.pathname === "/admin/login";
  const isVerifyPage = req.nextUrl.pathname === "/admin/verify";

  if (isAdminRoute && !isLoginPage && !isVerifyPage && !req.auth) {
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }
});

export const config = {
  matcher: ["/admin/:path*"],
};
