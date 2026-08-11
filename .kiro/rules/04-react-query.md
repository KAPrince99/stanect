React Query is the source of truth for Stanect server state (users, companions, subscription, avatars).

Rules:

- Never use `useEffect` to fetch server data when a query fits
- Never mirror server lists into ad-hoc `useState` as the source of truth
- Every query needs a stable, unique key (e.g. `["companions", userId]`, `["users", userId]`, `["subscription", userId]`)
- Mutations must invalidate or optimistically update the right caches
- Respect existing staleTimes used in the app (often ~5 minutes for companions/user/subscription)

Responsibilities:

- caching
- syncing
- background refetching
- optimistic updates (especially companion delete)

Rule:
React Query = server state. Zustand = local UI / live session state only.
