"use client";
import React, { memo, useCallback, useEffect, useMemo, useState } from "react";
import Person from "./Person";
import Voice from "./Voice";
import Preview from "./Preview";
import Avatar from "./Avatar";
import type { PlanType } from "@/lib/plan-limits";
import { useTabFormStore } from "@/store/useTabFormStore";
import TabFormPresenter from "./TabFormPresenter";
import { toast } from "sonner";

interface TabFormProps {
  userPlan?: PlanType;
}

function TabForm({ userPlan = "free" }: TabFormProps) {
  const [isActive, setIsActive] = useState(0);
  const setUserPlan = useTabFormStore((s) => s.setUserPlan);
  const selectedAvatarId = useTabFormStore((s) => s.selectedAvatarId);
  const companionName = useTabFormStore((s) => s.companionName);
  const scene = useTabFormStore((s) => s.scene);
  const voice = useTabFormStore((s) => s.voice);
  const sessionLength = useTabFormStore((s) => s.sessionLength);
  const activePlan = useTabFormStore((s) => s.userPlan);

  useEffect(() => {
    setUserPlan(userPlan);
  }, [setUserPlan, userPlan]);

  const tabs = useMemo(
    () => [
      { name: "Avatar" },
      { name: "Person" },
      { name: "Voice" },
      { name: "Preview" },
    ],
    [],
  );

  const maxMinutes = useMemo(() => {
    if (activePlan === "king") return 60;
    if (activePlan === "pro") return 15;
    return 2;
  }, [activePlan]);

  const isAvatarStepValid = useMemo(
    () => Boolean(selectedAvatarId),
    [selectedAvatarId],
  );
  const isPersonStepValid = useMemo(
    () => companionName.trim().length >= 2 && scene.trim().length >= 2,
    [companionName, scene],
  );
  const isVoiceStepValid = useMemo(() => {
    return (
      Boolean(voice) &&
      sessionLength !== null &&
      Number.isInteger(sessionLength) &&
      sessionLength >= 1 &&
      sessionLength <= maxMinutes
    );
  }, [voice, sessionLength, maxMinutes]);

  const isCurrentStepValid = useMemo(() => {
    if (isActive === 0) return isAvatarStepValid;
    if (isActive === 1) return isPersonStepValid;
    if (isActive === 2) return isVoiceStepValid;
    return true;
  }, [isActive, isAvatarStepValid, isPersonStepValid, isVoiceStepValid]);

  const furthestUnlockedIndex = useMemo(() => {
    if (!isAvatarStepValid) return 0;
    if (!isPersonStepValid) return 1;
    if (!isVoiceStepValid) return 2;
    return 3;
  }, [isAvatarStepValid, isPersonStepValid, isVoiceStepValid]);

  const handlePrevClick = useCallback(() => {
    setIsActive((prev) => Math.max(prev - 1, 0));
  }, []);

  const handleNextClick = useCallback(() => {
    if (!isCurrentStepValid) {
      toast.error("Complete this step before continuing");
      return;
    }

    setIsActive((prev) => Math.min(prev + 1, tabs.length - 1));
  }, [isCurrentStepValid, tabs.length]);

  const handleTabClick = useCallback(
    (targetIndex: number) => {
      if (targetIndex <= isActive || targetIndex <= furthestUnlockedIndex) {
        setIsActive(targetIndex);
        return;
      }

      toast.error("Complete previous steps first");
    },
    [furthestUnlockedIndex, isActive],
  );

  const renderActiveTab = useCallback(() => {
    if (isActive === 0) return <Avatar />;
    if (isActive === 1) return <Person />;
    if (isActive === 2) return <Voice />;
    return <Preview onEditStep={setIsActive} />;
  }, [isActive]);

  const isLastTab = useMemo(
    () => isActive === tabs.length - 1,
    [isActive, tabs.length],
  );
  const canGoPrev = isActive > 0;
  const canGoNext = isActive < tabs.length - 1 && isCurrentStepValid;
  const completedTabs = useMemo(
    () => [isAvatarStepValid, isPersonStepValid, isVoiceStepValid, false],
    [isAvatarStepValid, isPersonStepValid, isVoiceStepValid],
  );

  const activeTabContent = useMemo(() => renderActiveTab(), [renderActiveTab]);

  return (
    <TabFormPresenter
      tabs={tabs}
      completedTabs={completedTabs}
      isActive={isActive}
      onTabClick={handleTabClick}
      activeTabContent={activeTabContent}
      showNavigation={!isLastTab}
      onPrevClick={handlePrevClick}
      onNextClick={handleNextClick}
      canGoPrev={canGoPrev}
      canGoNext={canGoNext}
    />
  );
}
export default memo(TabForm);
