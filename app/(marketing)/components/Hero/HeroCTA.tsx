import WrapButton from "@/components/ui/wrap-button";

export function HeroCTA() {
  return (
    <div className="mt-8 flex flex-wrap items-center justify-center gap-4 animate-fade-up animation-delay-800">
      <WrapButton
        className="text-lg font-display shadow-2xl shadow-amber-500/25 transition-all duration-300 hover:scale-105 hover:shadow-amber-500/40 md:text-xl"
        href="/dashboard"
      >
        Start For Free
      </WrapButton>
    </div>
  );
}
