"use client";

import React, { useState } from "react";

import { cn } from "@/lib/utils";

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
  onFocus,
  onBlur,
  ...props
}: InputFieldProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="space-y-2">
      {label && (
        <label className="type-label flex items-center gap-2">
          {icon} {label}
        </label>
      )}
      <Input
        {...props}
        onFocus={(event) => {
          setIsFocused(true);
          onFocus?.(event);
        }}
        onBlur={(event) => {
          setIsFocused(false);
          onBlur?.(event);
        }}
        className={cn(
          "h-11 rounded-xl border-white/10 bg-white/5 text-white shadow-none ring-0 placeholder:text-white/50",
          "focus:border-white/10 focus:ring-0 focus-visible:border-white/10 focus-visible:ring-0",
          isFocused && "animate-search-border",
          className,
        )}
      />
      {error ? <p className="text-sm text-red-300">{error}</p> : null}
    </div>
  );
}
