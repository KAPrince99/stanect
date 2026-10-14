export const FAVORITE_COMPANION_IDS_METADATA_KEY = "favorite_companion_ids";
const LOCAL_FAVORITE_COMPANION_IDS_KEY = "stanect:favoriteCompanionIds";

const EMPTY_IDS: string[] = [];
const MAX_FAVORITE_IDS = 500;

export function parseFavoriteCompanionIds(value: unknown): string[] {
  if (!Array.isArray(value)) return EMPTY_IDS;
  const ids = value.filter(
    (entry): entry is string => typeof entry === "string" && entry.length > 0,
  );
  return ids.length > 0 ? ids.slice(0, MAX_FAVORITE_IDS) : EMPTY_IDS;
}

export function readFavoriteCompanionIdsFromMetadata(
  metadata: unknown,
): string[] {
  if (!metadata || typeof metadata !== "object") return EMPTY_IDS;
  return parseFavoriteCompanionIds(
    (metadata as Record<string, unknown>)[FAVORITE_COMPANION_IDS_METADATA_KEY],
  );
}

export function toggleFavoriteId(ids: readonly string[], id: string) {
  const next = new Set(ids);
  const wasFavorite = next.has(id);
  if (wasFavorite) next.delete(id);
  else next.add(id);
  return {
    ids: [...next].slice(0, MAX_FAVORITE_IDS),
    isFavorite: !wasFavorite,
  };
}

export function mergeFavoriteIds(...lists: readonly string[][]) {
  return [...new Set(lists.flat().filter((id) => id.length > 0))].slice(
    0,
    MAX_FAVORITE_IDS,
  );
}

export function getLocalFavoriteCompanionIds(): string[] {
  if (typeof window === "undefined") return EMPTY_IDS;
  try {
    return parseFavoriteCompanionIds(
      JSON.parse(window.localStorage.getItem(LOCAL_FAVORITE_COMPANION_IDS_KEY) ?? "null"),
    );
  } catch {
    return EMPTY_IDS;
  }
}

export function clearLocalFavoriteCompanionIds() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(LOCAL_FAVORITE_COMPANION_IDS_KEY);
  } catch {
    // Ignore private-mode / quota failures.
  }
}
