Performance rules for Stanect:

- Server Components by default; client only where interactive
- Prefetch critical routes with existing `usePrefetchRoute` patterns
- Keep React Query keys precise; invalidate narrowly on mutations
- Avoid over-fetching companion/user fields you don’t render
- Convo / Vapi UI is performance-sensitive — avoid unnecessary re-renders in live session components
- Prefer lightweight skeletons (`AppRouteLoading`) over blocking spinners when patterns already exist
- Do not add `useMemo` / `useCallback` by default; follow existing memo usage in the repo
- Lazy-load heavy marketing/three.js surfaces when touching those areas
