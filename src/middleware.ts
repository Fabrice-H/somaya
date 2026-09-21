import { NextResponse } from "next/server";
import { auth } from "@/features/auth/server/auth";
import { ACCESS_DENIED_PATH, ADMIN_LOGIN_PATH } from "@/features/auth/constants";

export default auth((req) => {
  const { pathname } = req.nextUrl;

  if (pathname === ADMIN_LOGIN_PATH) {
    return req.auth ? NextResponse.redirect(new URL("/admin", req.url)) : NextResponse.next();
  }

  if (!req.auth) {
    return NextResponse.rewrite(new URL(ACCESS_DENIED_PATH, req.url), { status: 403 });
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*"],
};
