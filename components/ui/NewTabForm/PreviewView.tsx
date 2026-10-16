"use client";

import { CompanionProps } from "@/types/types";
import { Loader2, MoveRight } from "lucide-react";
import { memo } from "react";
import { motion } from "framer-motion";

import CompanionOverviewCard from "../HomeDashboard/CompanionOverviewCard";
import { Button } from "../button";
import { motionTransition, motionVariants } from "@/lib/motion";
import PreviewSummary from "./PreviewSummary";
import PreviewEditSteps from "./PreviewEditSteps";
import PreviewValidationIssues from "./PreviewValidationIssues";

interface PreviewViewProps {
  previewCompanion: CompanionProps;
  validationIssues: string[];
  isCreating: boolean;
  onEditStep?: (index: number) => void;
  onCreate: () => void;
}

function PreviewView({
  previewCompanion,
  validationIssues,
  isCreating,
  onEditStep,
  onCreate,
}: PreviewViewProps) {
  return (
    <main className="w-full">
      <div className="mx-auto grid max-w-4xl grid-cols-1 items-center gap-6 px-0 sm:gap-8 lg:grid-cols-2 lg:gap-12">
        <motion.div
          className="mx-auto w-full max-w-[320px]"
          variants={motionVariants.cardPop}
          initial="initial"
          animate="animate"
          transition={motionTransition.soft}
        >
          <CompanionOverviewCard
            companion={previewCompanion}
            showConvoButton={false}
            enableNavigation={false}
            enableHoverLift={false}
          />
        </motion.div>
        <motion.div
          className="mx-auto w-full max-w-md space-y-10"
          variants={motionVariants.fadeUp}
          initial="hidden"
          animate="visible"
          transition={motionTransition.soft}
        >
          <div className="space-y-5 rounded-2xl border border-white/10 bg-white/5 p-5 sm:p-6 md:p-8">
            <h3 className="type-display text-center text-[1.5rem] sm:text-[1.875rem]">
              Review companion
            </h3>
            <p className="type-body text-center">
              Confirm the details below before creating your companion.
            </p>

            <PreviewSummary companion={previewCompanion} />
            <PreviewEditSteps onEditStep={onEditStep} />
            <PreviewValidationIssues issues={validationIssues} />

            <Button
              variant="primary"
              size="lg"
              className="w-full shadow-xl shadow-amber-500/20"
              disabled={isCreating || validationIssues.length > 0}
              onClick={onCreate}
            >
              Create Companion
              {isCreating ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <MoveRight className="h-5 w-5" />
              )}
            </Button>

            <p className="type-meta text-center">
              You can edit these details later in your dashboard.
            </p>
          </div>
        </motion.div>
      </div>
    </main>
  );
}

export default memo(PreviewView);
