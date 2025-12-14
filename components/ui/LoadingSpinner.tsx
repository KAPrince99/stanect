"use client";
import { Loader2 } from "lucide-react";

export default function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center my-50">
      <Loader2 className="animate-spin" />
    </div>
  );
}
