# Stanect — Remote Job Application Project Brief

## Role Positioning

**Suggested Title:** Mid-Level Product Engineer (Frontend-focused, Full-stack capable)  
**Project:** Stanect (AI voice companion SaaS)  
**Live:** https://www.stanect.com/

I worked as a product-minded engineer across onboarding, profile, and real-time conversation surfaces, shipping reliability, architecture, and UX improvements that made the product easier to scale and maintain.

---

## Executive Summary (Recruiter-Friendly)

I led a full reliability + UX engineering pass across critical Stanect user journeys: onboarding, companion creation, profile management, and live conversation flow. I delivered persistent onboarding state, multi-layer validation (client + server), robust backend orchestration with failure cleanup, and component architecture refactors (container/presenter + feature foldering). I also standardized interaction feedback (motion, toasts, loaders) to improve product cohesion.

---

## What I Delivered

### 1) Onboarding reliability and conversion readiness

- Implemented persisted onboarding state with Zustand + localStorage
- Added guarded step progression to prevent invalid tab jumps
- Added completion states and clearer progression feedback
- Centralized plan-based session constraints in store logic

### 2) Validation strategy across boundaries

- Added Zod field-level validation in onboarding tabs
- Added submit-time validation summary in preview
- Added server-side validation in create flow
- Reduced invalid payloads and client/server mismatch risk

### 3) Preview-to-create flow hardening

- Rebuilt preview as a true review-and-confirm step
- Added edit-jump controls for fast correction
- Connected preview directly to create mutation
- Routed users directly to created companion page (`/dashboard/:id`)

### 4) Backend orchestration improvements

- Refactored `createCompanion` into clearer orchestration steps
- Added default avatar resolution and country fallback
- Added Vapi response guards + cleanup on downstream failures
- Improved operational safety for partial-failure scenarios

### 5) Architectural maintainability work

- Split large UI flows into container/presenter patterns
- Extracted reusable tab/profile/preview subcomponents
- Consolidated feature modules into dedicated folders (`profileRelated`, `convo`)
- Removed duplicate component paths after migration

### 6) UX consistency and polish

- Added shared motion system for consistent transitions
- Themed toast and loading feedback to match product design language
- Improved empty states and action feedback in dashboard/onboarding flows

---

## Tech Stack and Scope

- **Frontend:** Next.js App Router, React, TypeScript, Tailwind CSS
- **State + Data:** Zustand, TanStack React Query
- **Validation:** Zod
- **Backend/Data:** Next Server Actions, Supabase
- **Auth:** Clerk
- **Voice AI:** Vapi
- **Billing:** Paystack
- **Animation:** Framer Motion

---

## Engineering Signals for Remote Teams

- Works end-to-end across UX, state, API contracts, and backend actions
- Refactors incrementally without breaking product flow
- Handles production concerns: fallback paths, cleanup, guardrails
- Balances speed with maintainability through modular design
- Communicates in product outcomes, not just implementation details

---

## High-Value Resume Bullets

- Re-architected companion onboarding with persistent state and guarded progression, improving flow reliability and reducing invalid user states.
- Implemented multi-layer validation using Zod at input, preview, and server-action boundaries to harden data integrity.
- Refactored companion creation into resilient backend orchestration with defaults, third-party response guards, and cleanup on failure.
- Modularized profile and conversation features into container/presenter structures and dedicated feature folders, improving maintainability and team velocity.
- Standardized interaction patterns (motion, toasts, loading states) across key user journeys for a cohesive product experience.

---

## Interview Talking Points (Impact Narrative)

1. **Reliability:** “I moved critical constraints into the store and server boundaries so the UI can’t drift into invalid states.”
2. **Architecture:** “I split heavy components into presenter/container + reusable subcomponents to reduce coupling and improve iteration speed.”
3. **Production thinking:** “I hardened create flows with fallback handling and cleanup, so partial failures don’t leave inconsistent records.”
4. **User outcomes:** “My goal was reducing friction from ‘create companion’ to first successful conversation with clearer feedback and fewer dead ends.”

---

## Metrics Template (Fill With Real Numbers)

Use this in your portfolio once analytics are available:

- Onboarding completion: `__% -> __%`
- Companion creation failure rate: `__% -> __%`
- Time to first successful call: `__ min -> __ min`
- Support tickets for onboarding/profile issues: `__ -> __`

---

## Portfolio Website Copy (Remote Hiring Version)

I shipped a major reliability and architecture pass on Stanect, an AI voice companion SaaS. My work spanned persistent onboarding state, end-to-end validation, backend create-flow hardening, and modular refactors across profile and conversation features. I focused on reducing user friction while improving maintainability and production resilience, delivering a cleaner path from onboarding to first successful AI conversation.
