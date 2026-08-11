Next.js App Router rules for Stanect:

- Use Server Components by default for pages/layouts.
- Use Client Components when needed (interactivity, hooks, React Query, Vapi SDK, motion).
- Authenticated product pages under `app/(app)/` should gate with Clerk (`auth()` / middleware).
- Prefer Server Actions over Route Handlers for internal mutations.
- Keep page files thin: auth + composition; put UI in `components/ui/...`.

Rendering rules:

- Server Component → auth, metadata, layout shell, page composition
- Client Component → forms, dashboards, convo session, profile interactions

Do not fetch with `useEffect` when React Query already covers the data.
