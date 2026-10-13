import type { CompanionProps } from "@/types/types";

/** Wait after the last keystroke before filtering the grid. */
export const SEARCH_DEBOUNCE_MS = 250;

export type SearchableCompanion = Pick<CompanionProps, "companion_name" | "scene">;

export function normalizeSearchQuery(query: string): string {
  return query.trim().toLowerCase();
}

export function matchCompanion(
  query: string,
  companion: SearchableCompanion,
): boolean {
  const needle = normalizeSearchQuery(query);
  if (!needle) return true;

  return (
    companion.companion_name.toLowerCase().includes(needle) ||
    companion.scene.toLowerCase().includes(needle)
  );
}

export function filterCompanions<T extends SearchableCompanion>(
  companions: T[],
  query: string,
): T[] {
  if (!normalizeSearchQuery(query)) return companions;
  return companions.filter((companion) => matchCompanion(query, companion));
}
