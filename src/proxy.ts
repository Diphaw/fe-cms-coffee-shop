import { type NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  const token = request.cookies.get("cms_token")?.value;
  const hasToken = Boolean(token);
  const isLoginPath = request.nextUrl.pathname.startsWith("/login");

  if (hasToken && isLoginPath) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }
  if (!hasToken && !isLoginPath) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
