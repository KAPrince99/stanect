Forms in Stanect:

- Validate with Zod schemas (`schemas/`, e.g. companion create)
- Multi-step create flow uses the NewTabForm wizard + Zustand tab state
- Profile / dialogs may use controlled inputs + Server Actions
- Always validate again on the server inside the Server Action
- Disable submit while loading; show errors via field messages and/or Sonner toasts

Rules:

- Do not add React Hook Form unless the team explicitly adopts it — current flows are Zod + controlled state
- Keep form UX consistent with existing InputField / glass dialog patterns
- Plan limits (duration, companion count) must be enforced server-side, not only in the UI
