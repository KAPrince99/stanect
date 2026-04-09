import type { BillingInterval } from "./pricingShared";

interface PricingHeaderProps {
  billingInterval: BillingInterval;
  onIntervalChange: (interval: BillingInterval) => void;
}

const INTERVAL_OPTIONS: BillingInterval[] = ["monthly", "yearly"];

export function PricingHeader({
  billingInterval,
  onIntervalChange,
}: PricingHeaderProps) {
  return (
    <div className="mb-12 text-center">
      <h1 className="bg-linear-to-r from-white to-white/70 bg-clip-text text-3xl font-extrabold text-transparent md:text-6xl lg:text-7xl">
        Choose Your Power
      </h1>

      <p className="mx-auto mt-4 max-w-2xl text-md text-white/70 md:text-xl">
        Most people stay quiet.{" "}
        <span className="font-medium text-amber-300">You don’t have to.</span>
      </p>

      <div className="mx-auto mt-8 flex w-fit items-center justify-center gap-4 rounded-full border border-white/10 bg-white/5 p-1.5">
        {INTERVAL_OPTIONS.map((option) => {
          const isActive = billingInterval === option;

          return (
            <button
              key={option}
              type="button"
              onClick={() => onIntervalChange(option)}
              className={`cursor-pointer rounded-full px-4 py-2 font-medium capitalize transition-all duration-200 ${
                isActive
                  ? "bg-white text-black shadow-lg"
                  : "bg-transparent text-white/70"
              }`}
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
}
