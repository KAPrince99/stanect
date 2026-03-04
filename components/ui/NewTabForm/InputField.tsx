import React from "react";
import { Input } from "../input";

export default function InputField({ label, icon, className, ...props }: any) {
  return (
    <div className="space-y-2">
      {label && (
        <label className="text-white/90 text-lg font-medium flex items-center gap-2">
          {icon} {label}
        </label>
      )}
      <Input
        {...props}
        className={`bg-white/5 border-white/10 text-white h-11 rounded-xl  placeholder:text-white/50 ${className}`}
      />
    </div>
  );
}
