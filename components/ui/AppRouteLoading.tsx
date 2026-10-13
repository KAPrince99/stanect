import { Fragment } from "react";

import { companionPortraitAspect } from "./HomeDashboard/CompanionOverviewCardMedia";
import { AvatarSkeleton } from "./NewTabForm/AvatarSkeleton";
import { Pulse } from "./Pulse";

const TAB_SLOT_COUNT = 4;
const PRICING_FEATURE_COUNT = 6;
const PROFILE_INFO_COUNT = 4;

function NewCompanionTabBarSkeleton() {
  return (
    <div className="mx-auto mb-5 flex min-w-0 w-full max-w-[600px] items-center rounded-full border border-white/10 bg-white/8 p-2 backdrop-blur-md">
      {Array.from({ length: TAB_SLOT_COUNT }).map((_, index) => (
        <Fragment key={index}>
          <Pulse className="h-[30px] w-16 shrink-0 rounded-full" />
          {index < TAB_SLOT_COUNT - 1 ? (
            <div
              aria-hidden="true"
              className="mx-1 h-px flex-1 rounded-full bg-white/20"
            />
          ) : null}
        </Fragment>
      ))}
    </div>
  );
}

export function DashboardRouteLoading() {
  return (
    <div
      className="app-column-x relative pt-24 pb-8 lg:pt-28"
      role="status"
      aria-label="Loading dashboard"
    >
      <div className="mx-auto w-full max-w-4xl">
        <div className="mb-5 w-full sm:mb-6">
          <div className="mb-2 flex items-center justify-between gap-3">
            <Pulse className="h-3 w-32" />
            <Pulse className="h-6 w-14 rounded-full" />
          </div>
          <div className="flex w-full items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-2.5 py-2.5 sm:gap-4 sm:px-4">
            <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
              <Pulse className="size-11 shrink-0 rounded-xl" />
              <div className="min-w-0 space-y-1.5">
                <Pulse className="h-2.5 w-20" />
                <Pulse className="h-4 w-28 rounded-md" />
                <Pulse className="h-2.5 w-24" />
              </div>
            </div>
            <Pulse className="ml-auto h-11 w-24 shrink-0 sm:w-48" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className={`flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-xl ${index === 2 ? "hidden lg:block" : ""}`}
            >
              <Pulse className={`w-full rounded-none ${companionPortraitAspect}`} />
              <div className="flex flex-1 flex-col p-3 text-center sm:p-4">
                <Pulse className="mx-auto h-4 w-24 rounded-md sm:h-5" />
                <div className="mt-auto pt-2.5">
                  <Pulse className="h-11 w-full rounded-full bg-amber-400/25" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <span className="sr-only">Loading dashboard…</span>
    </div>
  );
}

export function NewCompanionRouteLoading() {
  return (
    <div
      className="flex min-h-screen flex-col bg-transparent pt-24 pb-28 lg:pb-16"
      role="status"
      aria-label="Loading companion setup"
    >
      <div className="mx-auto w-full max-w-4xl px-4">
        <NewCompanionTabBarSkeleton />
        <AvatarSkeleton announce={false} showNav />
      </div>

      <span className="sr-only">Loading companion setup…</span>
    </div>
  );
}

function PricingTierGhost({ index }: { index: number }) {
  const isPopular = index === 1;
  const isCrown = index === 2;

  return (
    <div className="relative">
      {isPopular ? (
        <Pulse className="absolute top-[-1.25rem] left-1/2 z-20 h-8 w-36 -translate-x-1/2 rounded-full bg-amber-400/30" />
      ) : null}
      {isCrown ? (
        <Pulse className="absolute top-[-2.5rem] left-1/2 z-20 h-14 w-14 -translate-x-1/2 rounded-full bg-amber-400/20" />
      ) : null}

      <div className="relative flex h-full flex-col justify-between rounded-3xl border border-white/10 bg-white/5 p-6 pt-10 backdrop-blur-xl">
        <div>
          <Pulse className="mb-2 h-6 w-16 rounded-md" />
          <div className="mb-5 min-h-14">
            <Pulse className="h-10 w-28 rounded-md sm:h-12 sm:w-36" />
          </div>
          <div className="mb-6 min-h-12">
            <Pulse className="h-4 w-full max-w-48" />
          </div>
          <ul className="mb-8 space-y-3">
            {Array.from({ length: PRICING_FEATURE_COUNT }).map((_, featureIndex) => (
              <li key={featureIndex} className="flex items-start gap-3">
                <Pulse className="mt-0.5 h-4 w-4 shrink-0 rounded-full" />
                <Pulse className="h-4 w-full max-w-48" />
              </li>
            ))}
          </ul>
        </div>
        <Pulse
          className={`h-11 w-full rounded-full ${isPopular || isCrown ? "bg-amber-400/25" : ""}`}
        />
      </div>
    </div>
  );
}

export function PricingRouteLoading() {
  return (
    <div
      className="app-column-x mt-3 min-h-screen bg-transparent py-25 text-white"
      role="status"
      aria-label="Loading pricing"
    >
      <div className="relative z-10 mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <Pulse className="mx-auto h-8 w-64 max-w-full sm:h-10 sm:w-80" />
          <Pulse className="mx-auto mt-4 h-5 w-80 max-w-[90%]" />
          <div className="relative mx-auto mt-8 flex w-fit items-center justify-center gap-1 rounded-full border border-white/10 bg-white/5 p-1.5">
            <Pulse className="h-9 w-20 rounded-full bg-white/20" />
            <Pulse className="h-9 w-20 rounded-full" />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-8">
          {Array.from({ length: 3 }).map((_, index) => (
            <PricingTierGhost key={index} index={index} />
          ))}
        </div>
      </div>

      <span className="sr-only">Loading pricing…</span>
    </div>
  );
}

function ProfileInfoRowGhost() {
  return (
    <div className="grid grid-cols-[50px_3fr] items-center gap-4 rounded-xl border-2 border-white/20 p-2 md:p-5">
      <div className="p-3">
        <Pulse className="size-9 rounded-md" />
      </div>
      <div>
        <Pulse className="h-3 w-20" />
        <Pulse className="mt-1.5 h-4 w-40 max-w-full rounded-md" />
      </div>
    </div>
  );
}

export function ProfileRouteLoading() {
  return (
    <div
      className="mx-auto w-full max-w-4xl space-y-5"
      role="status"
      aria-label="Loading profile"
    >
      <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-xl backdrop-blur-xl md:grid md:grid-cols-2">
        <div className="relative border-b border-white/10 p-8 text-center md:border-b-0 md:border-r md:p-10">
          <div className="relative z-10 grid grid-cols-[1fr_3fr] items-center gap-4 md:place-items-center md:px-6">
            <Pulse className="h-28 w-28 rounded-full md:h-32 md:w-32" />
            <div className="flex flex-col items-start space-y-2">
              <Pulse className="h-6 w-36 md:h-7 md:w-44" />
              <div className="flex items-center gap-2">
                <Pulse className="h-4 w-20" />
                <Pulse className="size-10 shrink-0 rounded-full" />
              </div>
            </div>
          </div>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Pulse className="h-11 w-full rounded-full bg-amber-400/25 sm:w-36" />
            <Pulse className="h-11 w-full rounded-full sm:w-36" />
          </div>
        </div>

        <div className="p-8 md:p-10">
          <div className="mx-auto grid max-w-3xl gap-6">
            {Array.from({ length: PROFILE_INFO_COUNT }).map((_, index) => (
              <ProfileInfoRowGhost key={index} />
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <article className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-xl backdrop-blur-xl md:p-6">
          <Pulse className="h-3 w-24" />
          <Pulse className="mt-2 h-6 w-36" />
          <Pulse className="mt-4 h-1.5 w-full rounded-full" />
        </article>
        <article className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-xl backdrop-blur-xl md:p-6">
          <Pulse className="h-3 w-24" />
          <Pulse className="mt-2 h-6 w-16" />
          <Pulse className="mt-3 h-3 w-28" />
        </article>
        <article className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-xl backdrop-blur-xl md:p-6">
          <Pulse className="h-3 w-24" />
          <Pulse className="mt-2 h-6 w-16" />
          <Pulse className="mt-3 h-3 w-16" />
        </article>
      </div>

      <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl backdrop-blur-xl md:p-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div className="max-w-2xl">
            <Pulse className="mb-2 h-7 w-24 rounded-full" />
            <Pulse className="mt-2 h-6 w-40" />
            <Pulse className="mt-2 h-4 w-72 max-w-full" />
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 md:justify-end">
            <Pulse className="h-4 w-28" />
            <Pulse className="h-3 w-1 rounded-full" />
            <Pulse className="h-4 w-24" />
          </div>
        </div>
      </div>

      <span className="sr-only">Loading profile…</span>
    </div>
  );
}

/** Catch-all for in-app routes that do not have their own loading.tsx. */
export default function AppRouteLoading() {
  return (
    <div
      className="app-column-x relative pt-24 pb-28 lg:pt-28"
      role="status"
      aria-label="Loading"
    >
      <div className="mx-auto w-full max-w-4xl space-y-5">
        <Pulse className="h-6 w-48" />
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-xl backdrop-blur-xl">
          <Pulse className="h-8 w-56 max-w-full rounded-md" />
          <Pulse className="mt-4 h-4 w-full" />
          <Pulse className="mt-2 h-4 w-2/3" />
          <Pulse className="mt-8 h-11 w-36 rounded-full bg-amber-400/25" />
        </div>
      </div>
      <span className="sr-only">Loading…</span>
    </div>
  );
}
