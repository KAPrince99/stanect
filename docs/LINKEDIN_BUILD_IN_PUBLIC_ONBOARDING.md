# Building Stanect Onboarding in Public: From Friction to Flow 🚀

Today I’m sharing a full engineering sprint I just wrapped on Stanect’s onboarding flow.

What started as a small bug report (“form values disappear on refresh”) turned into a full UX + architecture upgrade across state, validation, backend orchestration, and motion.

## The original pain points

- Onboarding state reset on page refresh
- Validation happened too late and inconsistently
- Users could move forward with incomplete steps
- Preview experience felt disconnected from real creation logic
- Motion and transitions felt inconsistent across tabs/options/cards
- Server create flow was too monolithic and fragile for production

## What we shipped

### 1) Reliable persisted onboarding state

- Added persisted Zustand store with localStorage partial persistence
- Preserved only meaningful onboarding fields
- Added plan-aware state constraints directly in the store (not scattered in components)

### 2) Real field-level validation with Zod

- Wired Zod validation into onboarding inputs
- Added typed inline errors for immediate feedback
- Reused schema definitions on both client and server for consistency

### 3) Safer defaults + failure-resistant flows

- Default avatar auto-selects to first available option
- Submit-time avatar fallback on the server to prevent empty payload failures
- Country fallback defaulted to `United States` in create flow

### 4) Onboarding architecture cleanup

- Split tab flow into container/presenter pattern
- Extracted reusable `TabGrid`, `TabCard`, `TabNavigation`
- Added gated progression: users can’t advance until current step is valid
- Added completed-step visual states and progress connectors

### 5) Preview re-architecture (review + confirm)

- Refactored Preview to build real companion payload from state
- Added review summary + edit step jumps
- Added full-form validation summary before create
- Converted preview action into production-like create mutation flow

### 6) Reusable UI components

- Upgraded companion card API with optional behavior flags:
  - optional convo button
  - optional navigation
  - optional hover lift
- Allowed same component to work in dashboard and read-only preview contexts

### 7) Backend hardening for production

- Refactored `createCompanion` into clear orchestration helpers
- Added server-side schema validation before DB/API calls
- Added Vapi response guards and cleanup logic on downstream failure
- Reduced mutation side-effects and improved failure handling

### 8) Motion system refinement

- Introduced shared motion tokens/variants in a central motion config
- Applied consistent motion language across tabs, voice options, avatar selection, preview, and dashboard empty state
- Iterated heavily on tab/content timing so interaction feels intentional, not flashy

## Why this sprint mattered

This wasn’t “just polish.” It improved:

- **Data integrity** (less invalid submissions)
- **Conversion readiness** (fewer drop-off moments in onboarding)
- **Maintainability** (clearer component boundaries)
- **Production confidence** (safer backend orchestration + cleanup)

## Engineering principles I leaned on

- Put invariants in the store, not in random components
- Validate at every boundary (input + submit + server)
- Build for fallback paths, not happy paths only
- Refactor toward reusable behavior, not one-off UI
- Motion should communicate state change, never distract from it

## If you’re building onboarding right now

My biggest takeaway: the fastest way to improve conversion is often **removing uncertainty**.

For users: clear states, clear constraints, clear next steps.
For engineers: deterministic state, consistent validation, resilient orchestration.

That combination compounds.

---

#buildinpublic #frontend #react #nextjs #typescript #zustand #zod #productengineering #webdev #softwareengineering
