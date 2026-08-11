Route Handlers (`app/(app)/api/...`) in Stanect are for external edges only.

Use Route Handlers for:

- Clerk webhook (`api/clerk-webhook`)
- Paystack webhook / callback / verify / subscribe / cancel / portal
- Other third-party webhooks or OAuth-style callbacks

Do NOT use Route Handlers for:

- companion CRUD
- profile edits
- ordinary authenticated form posts that can be Server Actions

Rules:

- Verify webhook signatures (Svix for Clerk; Paystack secret for Paystack)
- Keep handlers idempotent where payment events can retry
- Never expose secret keys to the client
- After billing events, update `users.plan`, `status`, and `metadata` carefully

Internal product mutations → Server Actions.
