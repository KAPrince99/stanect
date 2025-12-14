import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher(["/dashboard(.*)", "/new(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();

  if (isProtectedRoute(req) && !userId) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const res = NextResponse.next();

  res.headers.set(
    "Content-Security-Policy",
    `
      default-src 'self';
      script-src 'self' 'unsafe-inline' 'unsafe-eval'
        https://js.paystack.co
        https://*.clerk.com
        https://*.clerk.accounts.dev
        https://cdn.lordicon.com 
        https://va.vercel-scripts.com;        
      style-src 'self' 'unsafe-inline';
      img-src 'self' data: blob: https://*.clerk.com https://img.clerk.com;
      font-src 'self';
      connect-src 'self'
        https://api.paystack.co
        https://*.clerk.com
        https://*.clerk.accounts.dev
        https://cdn.lordicon.com
        https://cdgnwgojnzotbhdzvsnr.supabase.co
        wss://cdgnwgojnzotbhdzvsnr.supabase.co;        
      frame-src https://js.paystack.co;
      media-src 'self' https://videos.pexels.com; 
      worker-src 'self' blob:; 
    `
      .replace(/\s{2,}/g, " ")
      .trim()
  );

  return res;
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
