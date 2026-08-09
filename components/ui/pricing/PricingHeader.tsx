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
      <h1 className="type-display">Choose your plan</h1>

      <p className="type-body mx-auto mt-4 max-w-xl">
        Most people stay quiet.{" "}
        <span className="font-medium text-amber-300">You don’t have to.</span>
      </p>

      <div className="mx-auto mt-8 flex w-fit items-center justify-center gap-1 rounded-full border border-white/10 bg-white/5 p-1.5">
        {INTERVAL_OPTIONS.map((option) => {
          const isActive = billingInterval === option;

          return (
            <button
              key={option}
              type="button"
              onClick={() => onIntervalChange(option)}
              className={`type-label cursor-pointer rounded-full px-4 py-2 capitalize transition-colors duration-200 ${
                isActive
                  ? "bg-white text-black"
                  : "bg-transparent text-white/65 hover:text-white"
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
