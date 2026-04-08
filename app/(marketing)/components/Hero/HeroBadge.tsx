import { Sparkles } from "lucide-react";

export function HeroBadge() {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2 text-sm font-medium tracking-wider backdrop-blur-md animate-fade-in">
      <Sparkles className="h-4 w-4 text-amber-400" />
      <span className="bg-linear-to-r from-amber-400 to-yellow-300 bg-clip-text text-transparent">
        Now Live: Stanect is here
      </span>
      <span className="ml-2">Launch</span>
    </div>
  );
}
