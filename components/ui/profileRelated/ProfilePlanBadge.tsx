import { memo } from "react";
import LordIcon from "../lordIcon";
import { lordColors } from "@/lib/brand";

interface ProfilePlanBadgeProps {
  userPlan: string;
}

function ProfilePlanBadge({ userPlan }: ProfilePlanBadgeProps) {
  if (userPlan === "pro") {
    return (
      <LordIcon
        src="https://cdn.lordicon.com/ypilrraw.json"
        trigger="loop"
        colors={lordColors({ primary: "accent", secondary: "gold" })}
        height={40}
        width={40}
      />
    );
  }

  if (userPlan === "king") {
    return (
      <LordIcon
        src="https://cdn.lordicon.com/qwghwbtk.json"
        trigger="loop"
        colors={lordColors({ primary: "accent", secondary: "cream", tertiary: "gold", quaternary: "slate" })}
        height={40}
        width={40}
      />
    );
  }

  return (
    <LordIcon
      src="https://cdn.lordicon.com/vgdksfqv.json"
      trigger="loop"
      colors={lordColors({ primary: "white", secondary: "accent", tertiary: "accent" })}
      height={40}
      width={40}
    />
  );
}

export default memo(ProfilePlanBadge);
