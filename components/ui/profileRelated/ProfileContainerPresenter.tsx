"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { memo, ReactNode } from "react";

import { TIERS } from "@/app/constants";
import { PLAN_LIMITS, type PlanType } from "@/lib/plan-limits";
import { motionTransition, motionVariants } from "@/lib/motion";
import ProfileIdentityHeader from "./ProfileIdentityHeader";
import ProfileInfoList, { ProfileInfoItem } from "./ProfileInfoList";
import ProfileBillingActions from "./ProfileBillingSection";
import ProfileSecuritySection from "./ProfileSecuritySection";
import ProfileDangerZone from "./ProfileDangerZone";

const FREE_DAILY_SECONDS = 360;

interface ProfileContainerPresenterProps {
  userId: string;
  imgSrc: string;
  userFullName: string;
  userFirstNameInitial: string;
  planLabel: string;
  userPlan: string;
  subscriptionStatus: string;
  dailySecondsUsed: number;
  companionCount: number;
  infoItems: ProfileInfoItem[];
  actions: ReactNode;
}

function formatMinutes(seconds: number) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  if (mins <= 0) return `${secs}s`;
  return `${mins}m ${secs}s`;
}

function ProfileContainerPresenter({
  userId,
  imgSrc,
  userFullName,
  userFirstNameInitial,
  planLabel,
  userPlan,
  subscriptionStatus,
  dailySecondsUsed,
  companionCount,
  infoItems,
  actions,
}: ProfileContainerPresenterProps) {
  const planKey = (
    userPlan === "pro" || userPlan === "king" ? userPlan : "free"
  ) as PlanType;
  const isPaid = planKey !== "free";
  const maxCompanions = PLAN_LIMITS[planKey].maxCompanions;
  const used = Math.max(0, dailySecondsUsed || 0);
  const progress = isPaid
    ? 100
    : Math.min(100, Math.round((used / FREE_DAILY_SECONDS) * 100));
  const tier = TIERS.find((t) => t.key === planKey) ?? TIERS[0];
  const sessionLimit =
    planKey === "pro" || planKey === "king"
      ? PLAN_LIMITS[planKey].sessionLimit
      : undefined;

  return (
    <div className="mx-auto w-full max-w-4xl space-y-5">
      <motion.div
        variants={motionVariants.fadeUp}
        initial="hidden"
        animate="visible"
        transition={motionTransition.soft}
        className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-xl backdrop-blur-xl md:grid md:grid-cols-2"
      >
        <div className="relative border-b border-white/10 p-8 text-center md:border-b-0 md:border-r md:p-10">
          <ProfileIdentityHeader
            key={imgSrc}
            imgSrc={imgSrc}
            userFullName={userFullName}
            userFirstNameInitial={userFirstNameInitial}
            planLabel={planLabel}
            userPlan={userPlan}
          />
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            {actions}
          </div>
        </div>

        <div className="p-8 md:p-10">
          <ProfileInfoList items={infoItems} />
        </div>
      </motion.div>

      <motion.div
        variants={motionVariants.fadeUp}
        initial="hidden"
        animate="visible"
        transition={{ ...motionTransition.soft, delay: 0.06 }}
        className="grid grid-cols-1 gap-5 sm:grid-cols-3"
      >
        <article className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-xl backdrop-blur-xl md:p-6">
          <p className="type-meta uppercase tracking-wider text-white/60">
            Daily credit
          </p>
          <p className="type-title mt-2 text-white">
            {isPaid
              ? "Unlimited"
              : `${formatMinutes(used)} / ${formatMinutes(FREE_DAILY_SECONDS)}`}
          </p>
          {!isPaid ? (
            <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-[#e88c30]"
                style={{ width: `${progress}%` }}
              />
            </div>
          ) : (
            <p className="type-meta mt-3 text-white/55">
              {sessionLimit
                ? `${Math.round(sessionLimit / 60)}-min sessions`
                : "Open daily use"}
            </p>
          )}
        </article>

        <article className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-xl backdrop-blur-xl md:p-6">
          <p className="type-meta uppercase tracking-wider text-white/60">
            Companions
          </p>
          <p className="type-title mt-2 text-white">
            {companionCount}
            <span className="type-meta ml-1 text-white/50">
              / {maxCompanions}
            </span>
          </p>
          <Link
            href={companionCount >= maxCompanions ? "/dashboard" : "/new"}
            className="type-meta mt-3 inline-block text-amber-300 transition hover:text-amber-200"
          >
            {companionCount >= maxCompanions
              ? "View companions"
              : "Create companion"}
          </Link>
        </article>

        <article className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-xl backdrop-blur-xl md:p-6">
          <p className="type-meta uppercase tracking-wider text-white/60">
            Plan status
          </p>
          <p className="type-title mt-2 text-white">{tier.name}</p>
          <p className="type-meta mt-3 capitalize text-emerald-400">
            {subscriptionStatus || "active"}
          </p>
        </article>
      </motion.div>

      <motion.div
        variants={motionVariants.fadeUp}
        initial="hidden"
        animate="visible"
        transition={{ ...motionTransition.soft, delay: 0.1 }}
        className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl backdrop-blur-xl md:p-8"
      >
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div className="max-w-2xl">
            <p className="type-meta mb-2 inline-flex items-center rounded-full border border-amber-300/20 bg-amber-400/10 px-3 py-1 uppercase tracking-wide text-amber-300">
              {tier.name} plan
            </p>
            <h2 className="type-title mt-2">Plan & billing</h2>
            <p className="type-body mt-2 text-white/70">
              {tier.features.slice(0, 3).join(" · ")}
            </p>
            {isPaid ? (
              <div className="mt-4">
                <ProfileBillingActions userId={userId} />
              </div>
            ) : null}
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 md:justify-end">
            <ProfileSecuritySection />
            <span className="text-white/20" aria-hidden>
              ·
            </span>
            <ProfileDangerZone />
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default memo(ProfileContainerPresenter);
