import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/new(.*)",
  "/profile(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  if (!process.env.CLERK_SECRET_KEY) {
    console.error("Missing CLERK_SECRET_KEY in production!");
  }

  const { userId } = await auth();

  if (isProtectedRoute(req) && !userId) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const res = NextResponse.next();
  const isProd = process.env.NODE_ENV === "production";

  // Configuration for external domains
  const clerkDomains = isProd
    ? "https://clerk.stanect.com https://*.clerk.com https://*.clerk.accounts.com"
    : "https://*.clerk.com https://*.clerk.accounts.dev";

  const cloudflareDomains =
    "https://challenges.cloudflare.com https://*.cloudflare.com";

  // Vercel Live / Feedback Toolbar domains
  const vercelLiveDomains =
    "https://vercel.live https://vercel.com https://vitals.vercel-insights.com";

  res.headers.set(
    "Content-Security-Policy",
    `
    default-src 'self' blob:;
    base-uri 'self';
    object-src 'none';
    frame-ancestors 'self';

    script-src
      'self'
      'unsafe-inline'
      'unsafe-eval'
      blob:
      https://js.paystack.co
      ${clerkDomains}
      ${cloudflareDomains}
      ${vercelLiveDomains}
      https://cdn.lordicon.com
      https://va.vercel-scripts.com
      https://*.daily.co;

    script-src-elem
      'self'
      'unsafe-inline'
      'unsafe-eval'
      blob:
      https://js.paystack.co
      ${clerkDomains}
      ${cloudflareDomains}
      ${vercelLiveDomains}
      https://cdn.lordicon.com
      https://va.vercel-scripts.com
      https://*.daily.co;

    style-src 'self' 'unsafe-inline';

    img-src
      'self'
      data:
      blob:
      ${clerkDomains}
      https://img.clerk.com
      https://cdgnwgojnzotbhdzvsnr.supabase.co;

    font-src 'self';

    connect-src
      'self'
      ${clerkDomains}
      ${cloudflareDomains}
      ${vercelLiveDomains}
      https://clerk-telemetry.com
      https://api.vapi.ai
      wss://api.vapi.ai
      https://*.vapi.ai
      https://*.daily.co
      wss://*.daily.co
      https://api.paystack.co
      https://cdn.lordicon.com
      https://*.ingest.sentry.io
      https://cdgnwgojnzotbhdzvsnr.supabase.co
      wss://cdgnwgojnzotbhdzvsnr.supabase.co;

    frame-src
      https://js.paystack.co
      ${clerkDomains}
      ${cloudflareDomains}
      https://vercel.live;

    media-src 'self' blob: https://videos.pexels.com;
    worker-src 'self' blob:;
  `
      .replace(/\s{2,}/g, " ")
      .trim(),
  );

  return res;
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
