Component rules for Stanect:

Every component is **presentational** or a **container**. No third category. No mixed god files.

## Presentational

- Props in → UI out
- May use: styling, `cn`, Framer Motion for presentation, local UI-only state (e.g. image error, uncontrolled open)
- Must not use: `useQuery` / `useMutation`, Server Actions, fetching, plan/billing business logic
- Keep focused (~one visual job); split when JSX + concerns grow past ~200–300 lines

Naming tip: descriptive UI names (`*Header`, `*Card`, `*List`, `*View`, `*Dialog` body)

## Container

- Wires data and actions; passes props into presentational children
- May use: React Query, Clerk (`useUser` / ids), `useRouter`, Server Actions, feature hooks
- Must stay thin: loading/error branches + compose presentational UI
- Access gates and confirm flows count as containers

Naming tip: `*Container`, `*Gate`, page-level feature root (`PricingPage`, `ProfileContainer`)

## When editing existing code

1. Decide: is this file presentational or container?
2. If mixed, extract the presentational view first, leave wiring in the container
3. Do not “fix” by adding fetch calls into a presentational file

## Shared primitives

- Live in `components/ui` (`button`, `dialog`, `alert-dialog`, …)
- Treat as presentational building blocks

## Feature folders

Prefer extending:

- `HomeDashboard`
- `NewTabForm`
- `convo`
- `profileRelated`
- `pricing`

## Visual language (presentational)

- Glass: `rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl`
- Type utilities: `type-display`, `type-title`, `type-body`, `type-meta`, `type-label`, `type-cta`
- Primary CTA: amber → orange / `#e88c30`
