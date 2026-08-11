Error handling rules for Stanect:

- Never swallow errors silently
- Prefer try/catch in async Server Actions and API routes
- Return user-friendly messages to the client; toast with Sonner on the UI
- Never expose stack traces, Supabase internals, or secret provider payloads
- Log unexpected server failures for debugging
- Surface real failures for billing, companion create/delete, and Vapi assistant ops — don’t fake success
- On companion create failure after Vapi assistant creation, roll back / clean up when the existing action pattern does
- On delete companion, handle cache updates carefully (list vs detail query shapes)
