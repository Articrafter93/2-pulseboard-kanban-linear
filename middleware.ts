import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { NextFetchEvent, NextRequest } from "next/server";

const clerkEnabled = process.env.NEXT_PUBLIC_AUTH_PROVIDER === "clerk";

const publicRoutes = createRouteMatcher([
  "/",
  "/signin(.*)",
  "/signup(.*)",
  "/privacidad",
  "/api/health(.*)",
]);

const protectedMiddleware = clerkMiddleware(async (authObject, request) => {
  if (!publicRoutes(request)) {
    await authObject.protect();
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
