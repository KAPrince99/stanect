Stanect is an AI **voice companion** SaaS for conversation practice.

Product identity:

- Users create scene-based AI companions (voice, avatar, duration, context)
- Users practice live voice calls powered by Vapi
- Monetization is subscription plans (Free / Pro / King) via Paystack
- Core loop: auth → create companion → talk → manage plan/profile

When building features:

- Optimize for a clear practice stage: dashboard cast, create funnel, live convo, account/billing
- Preserve the signed-in visual language (glass on blue gradient, amber CTAs, type utilities)
- Enforce plan limits for real: companion caps, free trial window, daily talk credit, session length
- Do not invent fashion / try-on / image-generation product behavior
- Do not market capabilities that are not implemented (persistent memory tiers, watermarks, VIP onboarding, “ultra-low latency” as a separate product switch) unless you are also shipping them
- Prefer trust features: honest pricing copy, ownership checks, metering integrity, clean account deletion / billing lifecycle

Primary surfaces:

- Marketing site
- Dashboard (user’s cast)
- `/new` companion setup
- `/dashboard/[id]` conversation
- `/pricing` + Paystack payment flow
- `/profile` account hub
