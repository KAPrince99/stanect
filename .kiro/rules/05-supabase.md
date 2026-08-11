Supabase rules for Stanect:

- Never call Supabase from client components or hooks directly
- Access Supabase from server actions / server-only lib helpers
- Prefer selective queries; avoid `select('*')` unless the full row is required
- Respect RLS with the publishable/user client for normal reads/writes
- Use the service client only for privileged operations after an explicit auth + ownership check
- User identity key is `clerk_user_id`; companions are owned via `owner_id`
- Storage (e.g. profile pictures) must stay scoped to the authenticated user

Core domains:

- `users` — plan, status, usage seconds, profile fields, Paystack metadata
- `companions` — scene/voice/duration + Vapi `assistant_id`
- `avatars` — companion avatar catalog

Never bypass auth to “make it work.”
