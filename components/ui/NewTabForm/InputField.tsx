import React from "react";
import { Input } from "../input";

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: React.ReactNode;
  className?: string;
  error?: string;
}

export default function InputField({
  label,
  icon,
  className,
  error,
  ...props
}: InputFieldProps) {
  return (
    <div className="space-y-2">
      {label && (
        <label className="type-label flex items-center gap-2">
          {icon} {label}
        </label>
      )}
      <Input
        {...props}
        className={`bg-white/5 border-white/10 text-white h-11 rounded-xl  placeholder:text-white/50 ${className}`}
      />
      {error ? <p className="text-sm text-red-300">{error}</p> : null}
    </div>
  );
}
