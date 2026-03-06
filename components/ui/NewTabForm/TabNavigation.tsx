"use client";
import React, { memo } from "react";
import { MoveLeft, MoveRight } from "lucide-react";
import { Button } from "../button";

interface TabNavigationProps {
  onPrevClick: () => void;
  onNextClick: () => void;
  canGoPrev: boolean;
  canGoNext: boolean;
}

function TabNavigation({
  onPrevClick,
  onNextClick,
  canGoPrev,
  canGoNext,
}: TabNavigationProps) {
  return (
    <section className="flex justify-end gap-4 mx-50 min-w-[400px] max-w-[870px] my-8">
      <Button
        type="button"
        variant="outline"
        size="icon"
        className="bg-background/60 border-border/60 text-foreground hover:bg-accent"
        onClick={onPrevClick}
        disabled={!canGoPrev}
        aria-label="Go to previous tab"
      >
        <MoveLeft className="h-5 w-5" />
      </Button>

      <Button
        type="button"
        variant="outline"
        size="icon"
        className="bg-background/60 border-border/60 text-foreground hover:bg-accent"
        onClick={onNextClick}
        disabled={!canGoNext}
        aria-label="Go to next tab"
      >
        <MoveRight className="h-5 w-5" />
      </Button>
    </section>
  );
}

export default memo(TabNavigation);
