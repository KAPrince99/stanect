import { memo } from "react";
import LordIcon from "../lordIcon";

interface ProfilePlanBadgeProps {
  userPlan: string;
}

function ProfilePlanBadge({ userPlan }: ProfilePlanBadgeProps) {
  if (userPlan === "pro") {
    return (
      <LordIcon
        src="https://cdn.lordicon.com/ypilrraw.json"
        trigger="loop"
        colors="primary:#e88c30,secondary:#ffc738"
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
        colors="primary:#e88c30,secondary:#ebe6ef,tertiary:#ffc738,quaternary:#646e78"
        height={40}
        width={40}
      />
    );
  }

  return (
    <LordIcon
      src="https://cdn.lordicon.com/vgdksfqv.json"
      trigger="loop"
      colors="primary:#ffffff,secondary:#e88c30,tertiary:#e88c30"
      height={40}
      width={40}
    />
  );
}

export default memo(ProfilePlanBadge);
