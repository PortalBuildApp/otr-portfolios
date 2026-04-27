import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/admin/login",
    verifyRequest: "/admin/verify",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isLoginPage = nextUrl.pathname === "/admin/login";
      const isVerifyPage = nextUrl.pathname === "/admin/verify";
      if (isLoginPage || isVerifyPage) return true;
      return isLoggedIn;
    },
  },
  providers: [],
} satisfies NextAuthConfig;
