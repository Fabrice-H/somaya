import { NextResponse, type NextRequest } from "next/server";
import { auth } from "@/features/auth/server/auth";
import { accessDeniedResponse } from "@/features/auth/access-denied";
import { ADMIN_HOME_PATH, INTERNAL_LOGIN_PATH } from "@/features/auth/constants";
import { getLoginPath } from "@/features/auth/login-path";

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const loginPath = getLoginPath();
  const isLoginPath = pathname === loginPath;
  const isAdminPath = pathname === ADMIN_HOME_PATH || pathname.startsWith(`${ADMIN_HOME_PATH}/`);

  if (!isLoginPath && !isAdminPath) return NextResponse.next();

  const session = await auth();
  const isSignedIn = Boolean(session?.user?.id);

  if (isLoginPath) {
    if (isSignedIn) return NextResponse.redirect(new URL(ADMIN_HOME_PATH, req.url));
    return loginPath === INTERNAL_LOGIN_PATH
      ? NextResponse.next()
      : NextResponse.rewrite(new URL(INTERNAL_LOGIN_PATH, req.url));
  }

  if (pathname === INTERNAL_LOGIN_PATH && isSignedIn) return NextResponse.redirect(new URL(ADMIN_HOME_PATH, req.url));
  if (!isSignedIn) return accessDeniedResponse();

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|images|favicon.ico|icon.png|apple-icon.png|robots.txt).*)"],
};
