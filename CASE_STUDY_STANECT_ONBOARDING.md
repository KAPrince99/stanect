# Stanect Case Study — Product Engineer (Frontend-Leaning Fullstack)

## One-line pitch
I redesigned and hardened the companion-creation onboarding flow in Stanect, improving UX clarity, client/server validation safety, and production readiness while keeping feature velocity high.

## Role fit this demonstrates
- Product Engineer (Frontend-leaning Fullstack)
- Frontend Engineer (Design Systems + UX)
- Growth/Product Surface Engineer

Best aligned companies: Vercel, Zapier, Buffer, and similar product-led SaaS teams.

---

## Project context
Stanect is an AI companion product with a multi-step companion setup flow.
The onboarding experience needed to be clearer, more resilient, and easier to scale.

## Problems identified
- Form data was lost on refresh.
- Validation was fragmented and partially client-only.
- Preview was fetching too much data for what it rendered.
- Card and tab UI were tightly coupled and less reusable.
- Navigation allowed users to move forward before completing required fields.
- Typography and visual status states were inconsistent across steps.

---

## What I shipped

### 1) Persistent onboarding state
- Added persisted Zustand state for onboarding values.
- Ensured companion setup survives refresh and tab switches.

### 2) Field-level + flow-level validation
- Added Zod validation for key inputs in onboarding tabs.
- Added completion gating so users cannot advance until current step is valid.
- Added clearer inline and summary validation messaging.

### 3) Efficient preview data strategy
- Replaced broad avatar fetch with targeted single-avatar fetch for preview.
- Built preview companion object from current state + selected avatar.
- Added safe fallbacks when selected avatar is missing.

### 4) Reusable component architecture
- Refactored CompanionCard to support optional:
  - navigation
  - action button
  - hover lift
- This enabled a true read-only preview card without accidental navigation.

### 5) Server action hardening
- Refactored createCompanion into orchestrated helper steps:
  - create companion record
  - create Vapi assistant
  - attach assistant to companion
- Added server-side validation and safer payload normalization.
- Added stronger external API failure handling.
- Added cleanup behavior for partial failures.

### 6) Plan-aware session limits
- Implemented plan-based max session length logic in onboarding Voice step.
- Moved session clamp behavior into Zustand for cleaner component logic.

### 7) Presenter pattern + scalable tab UI
- Split TabForm into logic container and presenter.
- Introduced reusable tab subcomponents:
  - TabGrid
  - TabCard
  - TabNavigation
- Added completion state visuals and connector lines between steps.

### 8) Product polish and visual consistency
- Standardized typography hierarchy across Avatar, Person, Voice, and Preview.
- Matched action color palette to existing brand CTA style.
- Improved completed-step styling to avoid confusion with primary action buttons.

---

## Product thinking demonstrated
- Treating onboarding as a guided funnel with clear completion state.
- Balancing speed and architecture: incremental refactors without stalling delivery.
- UX consistency across micro-interactions (states, copy, hierarchy, action emphasis).
- Defensive engineering against client bypass and external API instability.

---

## Technical highlights interviewers care about
- State management tradeoffs: component state vs persisted global state.
- Client/server validation boundaries and trust model.
- Orchestration design for side-effect-heavy server actions.
- UI architecture for reusable primitives and scalable composition.
- Progressive enhancement of UX without overbuilding.

---

## Resume bullets (copy-ready)
- Re-architected a multi-step onboarding flow with persisted Zustand state, reducing refresh-related state loss and improving completion continuity.
- Implemented step-gated navigation and Zod-backed validation across client and server boundaries to prevent invalid writes and reduce user error paths.
- Refactored monolithic server action into composable orchestration steps, adding robust third-party API failure handling and cleanup logic.
- Built reusable presenter-driven tab system (TabGrid, TabCard, TabNavigation) with completion indicators and themed action styling for clearer progression UX.

---

## 60-second interview story
I owned the companion onboarding experience end-to-end. I started by fixing reliability issues like state loss and weak validation, then improved UX with completion-gated navigation and a clearer review step. I reduced preview overhead by fetching only the selected avatar, and I made the card component reusable for both dashboard and onboarding contexts. On the backend, I split a large server action into smaller orchestration steps with stronger error handling for external API failures. The result was a faster, clearer, and more production-ready onboarding flow with architecture that can scale.

---

## How to tailor this for each company

### Vercel
Emphasize frontend architecture, App Router patterns, and polished UX systems.

### Zapier
Emphasize workflow reliability, validation boundaries, and side-effect orchestration.

### Buffer
Emphasize pragmatic fullstack execution, maintainability, and customer-facing product polish.

---

## Optional next metrics to track
- Step completion rate by tab
- Drop-off rate before preview
- Create Companion click-to-success rate
- Error rate by validation rule and server action stage
- Time to first successful companion creation

These metrics can turn this from a strong engineering case study into a measurable product impact story.
