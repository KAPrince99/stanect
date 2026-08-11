Code quality rules for Stanect:

- No placeholder / fake feature code in production paths
- Prefer refactoring over copy-paste across dashboard / profile / pricing
- Reuse existing utilities (`lib/plan-limits`, `lib/plan-utils`, motion helpers, InfoItem patterns) before inventing new ones
- Follow neighboring file patterns strictly within a feature
- Keep marketing promises aligned with enforced plan limits — don’t advertise memory, watermarks, or latency tiers unless implemented
- Don’t leave orphaned gates (`canUserCall` vs UI gates); prefer one source of truth in `lib/plan-utils` + server enforcement
- Avoid drive-by refactors outside the requested task
