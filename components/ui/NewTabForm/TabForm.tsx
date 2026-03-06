"use client";
import React, { memo, useCallback, useEffect, useMemo, useState } from "react";
import Person from "./Person";
import Voice from "./Voice";
import Preview from "./Preview";
import Avatar from "./Avatar";
import { MoveLeft, MoveRight } from "lucide-react";
import type { PlanType } from "@/lib/plan-limits";
import { useTabFormStore } from "@/store/useTabFormStore";

interface TabFormProps {
  userPlan?: PlanType;
}

function TabForm({ userPlan = "free" }: TabFormProps) {
  const [isActive, setIsActive] = useState(0);
  const setUserPlan = useTabFormStore((s) => s.setUserPlan);

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

  const handlePrevClick = useCallback(() => {
    setIsActive((prev) => Math.max(prev - 1, 0));
  }, []);

  const handleNextClick = useCallback(() => {
    setIsActive((prev) => Math.min(prev + 1, tabs.length - 1));
  }, [tabs.length]);

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

  return (
    <main className="-ml-30">
      <div className="flex items-center justify-between min-w-[400px] max-w-[600px] mx-auto mb-5 rounded-lg bg-white/10 p-2">
        {tabs.map((tab, index) => (
          <div
            className={`px-2.5 py-1 cursor-pointer ${isActive === index ? "bg-white/20 rounded-sm" : ""}`}
            key={tab.name}
            onClick={() => setIsActive(index)}
          >
            {tab.name}
          </div>
        ))}
      </div>
      <div className="max-h-screen lg:mx-50">{renderActiveTab()}</div>
      {!isLastTab && (
        <section className="flex justify-end gap-20 mx-50 min-w-[400px] max-w-[870px] my-8">
          <div className="cursor-pointer" onClick={handlePrevClick}>
            <MoveLeft className="h-5 w-5" />
          </div>
          <div className="cursor-pointer" onClick={handleNextClick}>
            <MoveRight className="h-5 w-5" />
          </div>
        </section>
      )}
    </main>
  );
}
export default memo(TabForm);
