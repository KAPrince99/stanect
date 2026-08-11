Clerk is Stanect’s only authentication system.

Rules:

- Never manually manage auth state or roll custom sessions
- Never trust a client-supplied user id alone — verify with Clerk on the server
- Protect product routes with Clerk middleware / `auth()`
- Sync users to Supabase via the Clerk webhook; do not invent a parallel user registry
- Profile “Manage account” / sign-out / delete-account flows use Clerk APIs
- After Clerk account deletion, cascade product cleanup (companions, Vapi assistants, billing) when implementing delete flows

Signed-in product surfaces: dashboard, create companion (`/new`), profile, pricing checkout paths that require a user.
