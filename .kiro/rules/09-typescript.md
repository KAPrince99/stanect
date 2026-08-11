TypeScript rules for Stanect:

- Prefer real types over `any`
- Share domain types in `types/types.ts` (companions, users, avatars, etc.)
- Use Zod schemas in `schemas/` for runtime validation of user input
- Prefer extending existing interfaces over duplicating near-identical shapes
- Keep server action return types intentional and UI-friendly

Use:

- `type` for unions / aliases
- `interface` for object shapes when extending or sharing across modules

Do not silence type errors to ship; fix the types (avoid relying on `ignoreBuildErrors` for new work).
