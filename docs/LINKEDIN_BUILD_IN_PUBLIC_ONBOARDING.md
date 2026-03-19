# Building Stanect Onboarding in Public: From Friction to Flow

I just wrapped an onboarding sprint for Stanect that started with one bug:
"form values disappear on refresh."

That bug exposed a bigger issue: UX friction + weak flow guarantees across state, validation, preview, and backend orchestration.

Here is what I shipped.

1. State that survives and stays valid

- Added persisted Zustand state (partial localStorage persistence)
- Kept only meaningful onboarding fields
- Moved plan constraints into the store so rules are centralized

2. Real validation at the right boundaries

- Integrated Zod field validation with typed inline errors
- Reused shared schema logic across client + server
- Blocked step progression until current step is valid

3. Safer defaults and fallback paths

- Default avatar auto-selects to first option
- Server-side avatar fallback prevents empty payload failures
- Country fallback defaults to "United States"

4. Clearer architecture

- Refactored tab flow into container/presenter structure
- Extracted reusable TabGrid, TabCard, and TabNavigation
- Added completed-step states + progress connectors

5. Preview that mirrors production

- Rebuilt preview from real onboarding state
- Added review summary + jump-to-edit actions
- Added full-form validation summary before create

6. Backend hardening

- Split createCompanion into focused orchestration helpers
- Added server-side schema validation before DB/API calls
- Added downstream failure guards + cleanup logic

7. Motion consistency

- Introduced shared motion tokens/variants
- Unified transitions across tabs, options, avatar selection, and preview

Why this mattered:

- Better data integrity
- Lower onboarding drop-off risk
- Cleaner component boundaries
- Higher production confidence

Big takeaway: conversion improves when uncertainty is removed.

For users: clear states and next steps.
For engineers: deterministic state, consistent validation, resilient fallbacks.

#buildinpublic #frontend #react #nextjs #typescript #zustand #zod #productengineering #webdev #softwareengineering
