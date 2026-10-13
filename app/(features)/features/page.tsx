import type { Metadata } from "next";
import Link from "next/link";

import { Button } from "@/components/ui/button";

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
      <div className="pointer-events-none absolute inset-0 -z-10 bg-linear-to-br from-backdrop-from via-backdrop-via to-backdrop-to" />
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
          <Button
            asChild
            variant="primary"
            size="md"
            className="shadow-lg shadow-amber-500/30"
          >
            <Link href="/pricing">View plans</Link>
          </Button>
          <Button asChild variant="secondary" size="md">
            <Link href="/dashboard">Open dashboard</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
