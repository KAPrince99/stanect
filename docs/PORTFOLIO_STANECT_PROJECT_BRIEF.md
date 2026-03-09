# Stanect — Portfolio Project Brief

## 1) Project Snapshot

**Project:** Stanect (AI voice companion SaaS)  
**Live Product:** https://www.stanect.com/  
**Domain:** Conversational AI, communication coaching, subscription SaaS  
**Type:** Full-stack product engineering (frontend-heavy with backend orchestration)

Stanect helps users improve communication confidence through realistic AI voice conversations. I worked across onboarding, dashboard UX, profile architecture, and convo module structure to improve reliability, usability, and maintainability.

---

## 2) My Role

**Title fit:** Mid-level Product/Frontend Engineer (senior-leaning execution)  
**Ownership scope:**

- Onboarding architecture and form state reliability
- Validation strategy (client + server)
- Preview/creation flow and navigation behavior
- Convo and profile module refactoring
- Motion/interaction consistency
- UX polish for empty states, toasts, and loading states
- Production hardening of create-companion backend action

---

## 3) Problem Context

The product had typical scale-up issues:

- Form progress and values were lost on refresh
- Validation was inconsistent across fields and backend boundaries
- Step navigation allowed invalid progression
- Preview and final creation flow were loosely coupled
- Some components were monolithic and hard to maintain
- Motion and visual feedback were inconsistent across surfaces
- Backend create flow needed stronger orchestration and failure handling

---

## 4) What I Built (High-Impact Work)

### A. Reliable onboarding state + progression logic

- Added persisted onboarding state (Zustand + persist)
- Centralized plan-aware constraints in store (session length limits)
- Added guarded tab navigation so users can’t skip invalid steps
- Added completion states and connector progression cues

### B. End-to-end validation strategy

- Added field-level Zod validation in form tabs
- Added submit-time validation summary in Preview
- Added server-side schema validation in create action
- Reduced mismatch risk between client and server requirements

### C. Preview + create flow redesign

- Reworked Preview into a true review-and-confirm step
- Added step-level “Edit” jump actions
- Integrated direct create mutation from preview
- On success, route directly to the created companion detail page

### D. Backend hardening for companion creation

- Refactored `createCompanion` into clear orchestration steps
- Added avatar fallback resolution
- Added safer Vapi response checks and failure cleanup logic
- Added country default fallback (`United States`) where needed

### E. Reusability + maintainability refactors

- Extracted tab shell into presenter and subcomponents (`TabGrid`, `TabCard`, `TabNavigation`)
- Extracted reusable tab headers and preview sections into dedicated components
- Split profile into container/presenter + supporting profile subcomponents
- Organized profile and convo features into dedicated folders (`profileRelated`, `convo`)

### F. Motion and UX consistency

- Created shared motion tokens/variants in `lib/motion.ts`
- Applied coherent transitions across onboarding tabs, selectors, and dashboard surfaces
- Improved loading states (button icon swapping, spinner theming)
- Themed toast system to align with product visual language

---

## 5) Tech Stack

- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **State:** Zustand
- **Data fetching/cache:** TanStack React Query
- **Validation:** Zod
- **UI:** Tailwind CSS + Radix primitives + custom component system
- **Animation:** Framer Motion
- **Auth:** Clerk
- **Database:** Supabase (PostgreSQL)
- **Voice AI:** Vapi
- **Billing:** Paystack

---

## 6) Architectural Decisions I’m Proud Of

1. **Store-level invariants over UI-only checks**  
   Plan-based duration limits are enforced centrally in state, reducing duplicated component logic.

2. **Validation at every boundary**  
   Input-level, step-level, submit-level, and server-level checks prevent bad states from leaking.

3. **Container/Presenter pattern in feature-heavy UIs**  
   Keeps business logic and rendering concerns separate, making components easier to evolve.

4. **Fail-safe backend orchestration**  
   Create flow handles downstream failures with cleanup, improving production reliability.

5. **Single source of truth foldering**  
   Removed duplicate profile and convo component paths after refactors; consolidated feature modules.

---

## 7) Product/Engineering Outcomes (Qualitative)

- Reduced onboarding friction and invalid progression
- Improved confidence in companion creation flow
- Better maintainability via smaller, composable components
- Cleaner module boundaries for profile and convo features
- More cohesive UX through consistent motion and feedback systems

> If you have analytics, replace with measurable outcomes (recommended):
>
> - onboarding completion rate: `X% -> Y%`
> - create-companion failure rate: `X% -> Y%`
> - average time-to-first-conversation: `X min -> Y min`

---

## 8) Portfolio Website Copy (Ready to Paste)

### Short Version (Card)

Built and shipped core product engineering improvements for **Stanect**, an AI voice companion SaaS. Delivered reliable persisted onboarding, multi-layer validation (Zod + server), preview-to-create orchestration, modular refactors (container/presenter), and consistent motion/feedback systems across onboarding, profile, and convo flows.

### Medium Version (Project Detail)

At Stanect, I led a major reliability + UX pass across the user journey from companion creation to live conversation. I redesigned onboarding with persistent state and guarded progression, implemented validation across client and server boundaries, and re-architected preview into a true review-and-confirm flow that creates and routes users directly into their new companion session. I also refactored profile and convo surfaces into modular feature folders with cleaner component boundaries, while improving visual consistency through a shared motion system and themed toasts/loading states.

### Resume Bullets

- Re-architected companion onboarding with persisted state + step gating, improving flow reliability and reducing invalid progression.
- Implemented end-to-end Zod validation (field, submit, and server) for safer data handling and fewer failed submissions.
- Refactored `createCompanion` server action into resilient orchestration with fallback handling and cleanup on downstream failure.
- Modularized profile/convo features into container-presenter patterns and dedicated folders, reducing complexity and improving maintainability.
- Standardized UX feedback (motion tokens, loaders, toast theming) across key product surfaces.

---

## 9) Interview Narrative (STAR-style)

**Situation:** Onboarding and profile/convo flows had growing UX friction and architectural debt.  
**Task:** Improve reliability, conversion-readiness, and maintainability without slowing feature velocity.  
**Action:** Added persisted state, multi-layer validation, guarded progression, backend orchestration hardening, and modular refactors into reusable components and feature folders.  
**Result:** More robust user flow, cleaner architecture, reduced duplication, and a stronger foundation for iteration.

---

## 10) Suggested Supporting Assets

For a stronger portfolio page, include:

- Before/after GIF of tab onboarding transitions
- Screenshot of review-and-confirm preview step
- Screenshot of profile module (container/presenter result)
- Screenshot of convo module folder structure
- Brief architecture diagram (onboarding flow + create orchestration)

---

## 11) Ownership Notes

I contributed both **product-facing UX improvements** and **under-the-hood engineering hardening**, with emphasis on:

- user confidence,
- data integrity,
- modular architecture,
- and production reliability.
