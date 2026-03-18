import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { NextFetchEvent, NextRequest } from "next/server";

const clerkEnabled = process.env.NEXT_PUBLIC_AUTH_PROVIDER === "clerk";

const publicRoutes = createRouteMatcher([
  "/",
  "/signin(.*)",
  "/signup(.*)",
  "/select-org(.*)",
  "/privacidad",
  "/api/health(.*)",
]);

const protectedMiddleware = clerkMiddleware(async (authObject, request) => {
  const session = await authObject();

  if (!publicRoutes(request)) {
    await authObject.protect();
  }

  const pathname = request.nextUrl.pathname;
  if (pathname.startsWith("/app") && !pathname.startsWith("/app/api") && !session.orgId) {
    return NextResponse.redirect(new URL("/select-org", request.url));
  }
});

export default function middleware(request: NextRequest, event: NextFetchEvent) {
  if (!clerkEnabled) {
    return NextResponse.next();
  }

  return protectedMiddleware(request, event);
}

export const config = {
  matcher: ["/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|png|gif|svg|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)", "/(api|trpc)(.*)"],
};
