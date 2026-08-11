Architecture follows Stanect’s current layout. Keep layers clear; do not invent a parallel folder tree unless asked.

Structure:

- `app/(app)/` → authenticated product routes (dashboard, new, profile, pricing, payment)
- `app/(marketing)/`, `app/(auth)/`, `app/(company)/`, `app/(contact)/` → public surfaces
- `app/(app)/actions/` → server actions (mutations + authenticated reads used by React Query)
- `app/(app)/api/` → webhooks + external payment/auth callbacks only
- `components/ui/` → shared primitives + feature UI folders
- `hooks/` → reusable client logic
- `store/` → Zustand local state only
- `lib/` → utilities, plan limits, Vapi/Paystack helpers, clients
- `schemas/` → Zod schemas
- `types/` → shared types

## Component law (required)

Every React component you create or edit MUST be exactly one of:

### 1. Presentational component
- Receives data and callbacks via **props only**
- Renders UI (markup, styles, light local UI state like hover/open for uncontrolled chrome)
- Does **not** call React Query, Server Actions, Clerk data hooks for fetching, Supabase, Paystack, or Vapi
- Does **not** own business rules (plan limits, ownership, billing)
- Name/shape stays tidy: one visual job

Examples: `PricingTierCard`, `DashboardWelcomeHeader`, `ProfileIdentityHeader`, card media/content pieces

### 2. Container component
- Owns data wiring: React Query, Clerk session ids, calling Server Actions, routing side effects
- Maps server/domain data into props for presentational children
- Stays **thin** — little or no heavy JSX; prefer compose presentational pieces
- Gates/modals that decide access or confirm billing are containers (or thin containers wrapping a presentational dialog body)

Examples: `DashboardCompanionList`, `ProfileContainer`, `PricingPage`, `ConvoAccessGate`, `NewCompanionGate`

### Hard rules
- Do **not** ship mixed “god” components that fetch + render a large UI tree in one file
- If a file both loads data and paints a big layout, **split it**: `*Container` / feature container + presentational view
- Prefer existing feature folders (`HomeDashboard`, `NewTabForm`, `convo`, `profileRelated`, `pricing`) over new top-level trees
- Pages (`app/**/page.tsx`) stay thin: auth/metadata + compose a container

## Data / side-effect layers (not components)

- Server Actions → mutations and authenticated reads
- Hooks → reusable client logic (no JSX)
- Zustand → ephemeral UI / session state only
- Lib / schemas → rules, helpers, validation

## Other architecture rules

- Prefer React Query for server state; Zustand only for local/ephemeral state
- Do not put Supabase or Vapi secrets in client components
- Consistency with neighboring Stanect files beats clever new abstractions
