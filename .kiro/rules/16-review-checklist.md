Before writing code for Stanect, evaluate:

- Does this already exist in `components/ui`, `hooks`, `lib`, or `actions`?
- Can I reuse an existing companion / profile / pricing / convo pattern?
- Is this the simplest change that matches nearby code?
- **Is this component presentational or a container?** (must be exactly one)
- If it fetches/wires AND paints a large UI, will I split it before shipping?
- Should this be a Server Component, Client Component, Server Action, or API webhook route?
- Does this touch plan limits, billing, or ownership? If yes, enforce on the server.
- Will React Query caches need invalidation?
- Does UI copy match what the product actually enforces?

Rule:
Consistency with Stanect > clever new abstractions

Component rule:
Presentational = props → UI. Container = data/wiring → presentational children. Never mix.
