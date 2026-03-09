# Portfolio Website + Personal Presentation Guide

## Objective

Build a portfolio that makes recruiters decide in under 30 seconds:

1. **Who you are**
2. **What you’re strong at**
3. **What outcomes you can deliver**

This guide gives you a practical structure for your site and exactly how to present yourself and your projects.

---

## 1) Positioning Statement (Your Brand)

Use one clear positioning line across your hero, LinkedIn, and resume:

> **I’m a Product-minded Frontend Engineer (Next.js + TypeScript) who ships reliable user experiences and scalable frontend architecture for SaaS products.**

Alternative (if you want broader scope):

> **I’m a Frontend-leaning Full-Stack Engineer focused on product reliability, UX quality, and maintainable architecture.**

Keep this consistent everywhere.

---

## 2) Website Structure (Recommended Pages)

## Home

- Hero (name, role, one-line value proposition)
- 2–3 strongest projects (cards)
- Skills stack (brief, not overwhelming)
- “How I work” section (product + engineering mindset)
- CTA buttons: `View Projects`, `Contact`, `Download Resume`

## Projects

- Project grid with filters (optional: SaaS / AI / Frontend)
- Each card shows: problem, stack, impact, and role scope

## Project Detail Page (for each key project)

- Problem
- Solution
- Your role and ownership
- Architecture decisions
- Key implementation highlights
- Challenges and trade-offs
- Outcomes (metrics if available)
- Screenshots / short demo GIF
- Tech stack

## About

- Career story (short)
- What kinds of problems you enjoy
- Collaboration style (async communication, ownership, shipping)

## Contact

- Email
- LinkedIn
- GitHub
- Optional Calendly

---

## 3) Visual Style (How It Should Look)

Aim for: **clean, premium, product-focused** (not overly flashy).

### Design principles

- Strong typography hierarchy
- Plenty of whitespace
- Consistent spacing and card system
- Limited color palette (match your brand)
- Subtle motion (no distracting animations)

### Recommended feel

- Dark or neutral premium theme
- Orange/amber accents can be your signature
- Use one button style for primary CTA
- Keep icons and visual language consistent

### Avoid

- Too many animations
- Long walls of text
- Unclear project outcomes
- Generic “I’m passionate” copy without evidence

---

## 4) Hero Section (Exact Formula)

Use this structure:

- **Name**
- **Role title**
- **One-line impact statement**
- **Primary CTA + secondary CTA**

Example:

**Prince Amanor Kabutey**  
**Product-minded Frontend Engineer**  
I build reliable, scalable, and conversion-focused SaaS experiences with Next.js and TypeScript.

Buttons:

- `View Projects`
- `Contact Me`

---

## 5) How to Present Yourself (Tone + Messaging)

Talk like an engineer who understands product:

### Use language like:

- “I improved onboarding reliability by…”
- “I reduced invalid states by centralizing validation…”
- “I refactored into container/presenter to improve maintainability…”

### Don’t overuse:

- “I am passionate about coding” (without proof)
- “I can do everything”

### Your brand themes should be:

- Reliability
- Product thinking
- Architecture clarity
- End-to-end ownership

---

## 6) How to Present Projects (Best Format)

For each project, use this 7-part format:

1. **Context:** What is this product?
2. **Problem:** What was broken or missing?
3. **Actions:** What exactly did you implement?
4. **Engineering decisions:** Why this approach?
5. **Trade-offs:** What constraints existed?
6. **Outcome:** What improved?
7. **Reflection:** What you’d improve next

This format instantly makes you look senior compared to pure feature lists.

---

## 7) Stanect Project Presentation (Suggested Copy Blocks)

## Project Headline

**Stanect — AI Voice Companion SaaS (Next.js + TypeScript + Supabase)**

## What You Did

- Built persistent onboarding with step gating and validation
- Added server-side create-flow hardening with fallback + cleanup logic
- Refactored monolithic UI into reusable container/presenter architecture
- Standardized motion, toasts, and loading UX for consistency

## Why It Matters

- Better user completion flow
- Fewer invalid submissions
- Cleaner, scalable frontend architecture
- Stronger production reliability

## 7.1 Stanect Project Detail Page (Ready to Paste)

### Problem

Stanect’s core user journey (create companion → preview → start conversation) had reliability and UX gaps:

- onboarding values could reset on refresh
- validation could be bypassed during step navigation
- preview and final create action were not fully aligned
- some components had grown too large and difficult to maintain

### Solution

I delivered a full onboarding and architecture pass focused on reliability, clarity, and maintainability:

- persisted onboarding state with guarded progression
- multi-layer validation (field, preview, server)
- hardened create-companion orchestration with fallback + cleanup
- refactored profile and convo areas into cleaner feature modules

### Your Role and Ownership

- owned implementation across frontend UX, state architecture, and backend create flow hardening
- drove refactors from monolithic components to reusable container/presenter patterns
- handled integration consistency across onboarding, preview, profile, and convo experiences

### Architecture Decisions

- centralized invariants in store/server boundaries (instead of only UI checks)
- applied container/presenter split for complex surfaces (`TabForm`, `ProfileContainer`)
- modularized feature folders (`profileRelated`, `convo`) to reduce path sprawl
- standardized motion/toast/loading feedback through shared primitives

### Key Implementation Highlights

- Zustand persistence for onboarding with plan-aware constraints
- Zod validation at input and server action boundaries
- preview-driven creation flow with direct route to `/dashboard/:id` on success
- resilient `createCompanion` flow with default avatar resolution and cleanup on downstream failure

### Challenges and Trade-offs

- balancing fast UX with strict validation without making flow feel blocked
- preserving existing UI feel while refactoring component architecture
- maintaining compatibility during path migrations before removing duplicates

### Outcomes (metrics if available)

Qualitative outcomes observed:

- more stable onboarding progression
- fewer invalid create attempts
- cleaner and more scalable component structure
- improved user confidence through clearer feedback and status transitions

Add real metrics when available:

- onboarding completion: `X% -> Y%`
- create failure rate: `X% -> Y%`
- time to first successful conversation: `X min -> Y min`

### Screenshots / Short Demo GIF

Include these assets on your portfolio page:

- onboarding tabs (before/after progression UX)
- preview review-and-confirm screen
- profile module refactor result
- live convo interface and transcript panel

### Tech Stack

- Next.js (App Router), React, TypeScript
- Zustand, TanStack React Query
- Zod
- Supabase, Clerk
- Vapi
- Tailwind CSS, Framer Motion

---

## 8) Proof Elements to Add (Very Important)

Add proof to increase trust:

- Architecture diagrams (simple, one per project)
- Before/after screenshots
- Small GIFs of improved interaction
- Code snippets for key patterns (validation, store, orchestration)
- Metrics (if available)

Proof > adjectives.

---

## 9) Resume + Portfolio Alignment

Make sure your resume bullets and portfolio details match exactly:

- Same role title
- Same key project claims
- Same stack
- Same outcome framing

If they mismatch, recruiters lose trust.

---

## 10) Personal Introduction Script (Networking/Interviews)

Use this 20–30 second intro:

> I’m a frontend/product engineer focused on building reliable SaaS experiences with Next.js and TypeScript. Recently, I led key improvements on Stanect, where I redesigned onboarding reliability, strengthened server-side creation flows, and refactored profile and conversation modules into scalable architecture. I enjoy owning features end-to-end, from UX quality to production reliability.

---

## 11) “About Me” Page Template

Use this structure:

- **Who I am:** role + core stack
- **What I solve:** reliability, UX flow, architecture quality
- **How I work:** ownership, collaboration, iteration
- **What I’m looking for:** remote product teams, growth-stage SaaS, frontend/product engineering roles

Keep it concise.

---

## 12) What Recruiters Should Feel After Visiting

By the end of your portfolio, they should think:

- “This person can own real product work.”
- “They can improve existing codebases, not just build demos.”
- “They communicate decisions clearly.”
- “I should interview them.”

---

## 13) Final Checklist (Launch-Ready)

- [ ] Clear role/title in hero
- [ ] 2–3 strong project case studies
- [ ] Real engineering decisions and trade-offs shown
- [ ] Outcomes/metrics included where possible
- [ ] Clean, readable design on mobile and desktop
- [ ] Contact links visible on every major page
- [ ] Resume, LinkedIn, and portfolio messaging aligned

---

## 14) Optional Next Step

Create one **“Case Study Lite”** version for each project:

- 90-second read
- 1 architecture visual
- 3 key decisions
- 3 outcomes

This helps recruiters skim quickly and still get depth.
