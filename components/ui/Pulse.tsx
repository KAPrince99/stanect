import { cn } from "@/lib/utils";

export function Pulse({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-full bg-white/10", className)} />;
}
