Custom hooks rules for Stanect:

- Hooks hold React Query wiring, Vapi/session orchestration, and small UI state
- Hooks must NOT return JSX
- Hooks typically return data, loading/error flags, and actions
- Keep domain rules (plan limits, ownership, billing) in `lib/` or server actions — hooks call them, they don’t redefine them
- Existing patterns to extend: `useConvoSession`, `useConvoData`, `usePrefetchRoute`, form/gate hooks under feature folders

Never put payment secrets, service-role Supabase, or permanent business policy only inside a hook.
