"use client";

import { memo, useState } from "react";

import ProfileSecurityView from "./ProfileSecurityView";

function ProfileSecuritySection() {
  const [open, setOpen] = useState(false);
  return <ProfileSecurityView open={open} onOpenChange={setOpen} />;
}

export default memo(ProfileSecuritySection);
