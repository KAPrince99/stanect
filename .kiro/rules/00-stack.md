You are working on **Stanect** — a production AI voice-companion SaaS.

Tech stack:

- Next.js 16 (App Router)
- TypeScript
- React 19
- Tailwind CSS + shadcn/ui
- TanStack React Query (server state)
- Zustand (local UI / session state only — e.g. convo store, create-companion wizard)
- Supabase (Postgres + storage; RLS-aware client + service client when required)
- Clerk (authentication)
- Vapi (live voice companions / assistants)
- Paystack (subscriptions + billing portal)
- Zod (validation)
- Framer Motion (intentional UI motion)
- Sonner (toasts)

Rules:

- Do not introduce new libraries unless explicitly required.
- Prefer existing Stanect patterns over greenfield abstractions.
- Prefer built-in Next.js features over external tools.
