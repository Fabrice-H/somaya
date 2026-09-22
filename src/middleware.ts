import { NextResponse, type NextRequest } from "next/server";
import { auth } from "@/features/auth/server/auth";
import { accessDeniedResponse } from "@/features/auth/access-denied";
import {
  ACCOUNT_LOGIN_PATH,
  ACCOUNT_PATH,
  ACCOUNT_PUBLIC_PATHS,
  ADMIN_HOME_PATH,
  ADMIN_SESSION_MAX_AGE_MS,
  INTERNAL_LOGIN_PATH,
} from "@/features/auth/constants";
import { getLoginPath } from "@/features/auth/login-path";

const startsWithPath = (pathname: string, base: string) => pathname === base || pathname.startsWith(`${base}/`);

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const loginPath = getLoginPath();
  const isLoginPath = pathname === loginPath;
  const isAdminPath = startsWithPath(pathname, ADMIN_HOME_PATH);
  const isAccountPath = startsWithPath(pathname, ACCOUNT_PATH);

  if (!isLoginPath && !isAdminPath && !isAccountPath) return NextResponse.next();

  const session = await auth();
  const user = session?.user;
  const isAdmin =
    user?.role === "admin" && (user.issuedAt ?? 0) > 0 && Date.now() - (user.issuedAt ?? 0) <= ADMIN_SESSION_MAX_AGE_MS;
  const isCustomer = user?.role === "customer";

  if (isLoginPath) {
    if (isAdmin) return NextResponse.redirect(new URL(ADMIN_HOME_PATH, req.url));
    return loginPath === INTERNAL_LOGIN_PATH
      ? NextResponse.next()
      : NextResponse.rewrite(new URL(INTERNAL_LOGIN_PATH, req.url));
  }

  if (isAdminPath) {
    if (pathname === INTERNAL_LOGIN_PATH && isAdmin) return NextResponse.redirect(new URL(ADMIN_HOME_PATH, req.url));
    if (!isAdmin) return accessDeniedResponse();
    return NextResponse.next();
  }

  const isPublicAccountPath = (ACCOUNT_PUBLIC_PATHS as readonly string[]).includes(pathname);
  if (isPublicAccountPath) {
    return isCustomer ? NextResponse.redirect(new URL(ACCOUNT_PATH, req.url)) : NextResponse.next();
  }
  if (!isCustomer) {
    const redirect = new URL(ACCOUNT_LOGIN_PATH, req.url);
    redirect.searchParams.set("next", pathname);
    return NextResponse.redirect(redirect);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|webhooks|_next/static|_next/image|images|favicon.ico|icon.png|apple-icon.png|robots.txt).*)"],
};
