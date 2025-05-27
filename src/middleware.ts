import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const protectedRoutes = ["/dashboard", "/dashboard/", "/dashboard/*"];
const onboardingRoutes = ["/auth/onboarding/basic-info", "/auth/onboarding/invite-team"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  // If not authenticated, let NextAuth handle it
  if (!token) return NextResponse.next();

  const onboardingComplete = token.onboardingComplete === true;

  // If trying to access a protected route but onboarding is not complete
  if (protectedRoutes.some(route => pathname.startsWith(route)) && !onboardingComplete) {
    const url = req.nextUrl.clone();
    url.pathname = "/auth/onboarding/basic-info";
    return NextResponse.redirect(url);
  }

  // If trying to access onboarding pages but onboarding is complete
  if (onboardingRoutes.some(route => pathname.startsWith(route)) && onboardingComplete) {
    const url = req.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/auth/onboarding/:path*"
  ]
};
