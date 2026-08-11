Styling rules for Stanect:

- Tailwind CSS only (no CSS modules for product UI)
- Prefer `cn` / `clsx` for conditional classes
- Use existing type utilities: `type-display`, `type-title`, `type-body`, `type-meta`, `type-label`, `type-cta`, `type-brand`
- Mobile-first; respect app shell padding (`pt-24`, dock clearance)
- Match signed-in visual language:
  - blue gradient canvas from app layout
  - glass surfaces: `rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl`
  - primary CTA: amber→orange gradient, black text (`from-amber-400 to-orange-500`)
  - accent: `#e88c30` for icons / progress / emphasis links
- Prefer Framer Motion via `@/lib/motion` helpers; purposeful motion only
- Avoid inventing a new visual system (no purple SaaS defaults, no cream/serif marketing drift on app pages)
- Prefer shadcn primitives already in the repo (Button, Dialog, AlertDialog)
- Avoid inline styles except rare dynamic values (e.g. progress width)
