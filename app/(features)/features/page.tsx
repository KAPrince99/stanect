import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Features – Stanect AI",
  description:
    "Practice conversations with AI voice companions. Create scenes, talk live, and manage your plan on Stanect.",
};

const FEATURES = [
  {
    title: "Create companions",
    body: "Build practice partners with a name, scene, voice, avatar, and session length that fit your plan.",
  },
  {
    title: "Live voice practice",
    body: "Talk in real time with Vapi-powered companions — mute, timer, and live transcript included.",
  },
  {
    title: "Your cast on the dashboard",
    body: "See every companion in one place, jump into a session, or create another when your plan allows.",
  },
  {
    title: "Plans that match the product",
    body: "Free trial with a daily talk credit, or Pro/King for longer sessions and more companions — billed in GHS via Paystack.",
  },
  {
    title: "Account hub",
    body: "Update your profile, review usage, and manage billing from one profile page.",
  },
];

export default function FeaturesPage() {
  return (
    <main className="relative min-h-screen overflow-hidden px-4 py-24 text-white sm:px-6">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-linear-to-br from-[#0b1a36] via-[#1a3a80] to-[#1e4ea8]" />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-linear-to-t from-black/40 via-transparent to-transparent" />

      <div className="mx-auto max-w-4xl">
        <p className="type-meta mb-3 uppercase tracking-wider text-amber-300">
          Features
        </p>
        <h1 className="type-display">What Stanect does today</h1>
        <p className="type-body mt-4 max-w-2xl text-white/70">
          Stanect is an AI voice-companion app for conversation practice. These
          are the capabilities that are live in the product — not a wishlist.
        </p>

        <ul className="mt-12 space-y-5">
          {FEATURES.map((feature) => (
            <li
              key={feature.title}
              className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl backdrop-blur-xl"
            >
              <h2 className="type-title">{feature.title}</h2>
              <p className="type-body mt-2 text-white/70">{feature.body}</p>
            </li>
          ))}
        </ul>

        <div className="mt-10 flex flex-wrap gap-3">
          <Link
            href="/pricing"
            className="type-cta inline-flex h-11 items-center rounded-full bg-linear-to-r from-amber-400 to-orange-500 px-8 text-black shadow-lg shadow-amber-500/30"
          >
            View plans
          </Link>
          <Link
            href="/dashboard"
            className="type-cta inline-flex h-11 items-center rounded-full border border-white/20 bg-white/5 px-8 text-white hover:bg-white/10"
          >
            Open dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}
