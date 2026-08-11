SERVER ACTIONS ARE THE DEFAULT MUTATION LAYER FOR STANECT.

Use Server Actions for:

- create / update / delete companions
- profile updates
- usage / stats updates
- plan-gated reads that need auth
- any authenticated internal mutation

Rules:

- Live under `app/(app)/actions/` (or colocated feature actions if split later)
- Validate inputs with Zod when accepting form/user payload
- Always authenticate with Clerk server-side (`auth()` / `currentUser()`)
- Prefer selective Supabase queries (avoid `select('*')` when a narrow select works)
- Ownership checks for companions and user-scoped rows
- Never return raw secrets, service keys, or unnecessary DB dumps
- Use service client (`lib/supa-service`) only when RLS cannot perform the operation (e.g. privileged deletes); still verify ownership first

Typical flow:

Client UI
→ React Query query/mutation
→ Server Action
→ Supabase / Vapi / Paystack helper
→ result mapped for the UI

Never use Route Handlers for ordinary in-app form mutations.
