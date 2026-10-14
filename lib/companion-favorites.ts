const FAVORITE_COMPANION_IDS_KEY = "stanect:favoriteCompanionIds";
const FAVORITES_CHANGED_EVENT = "stanect:favorites-changed";

const EMPTY_IDS: string[] = [];

let cachedRaw: string | null = null;
let cachedIds: string[] = EMPTY_IDS;

function readRaw(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(FAVORITE_COMPANION_IDS_KEY);
  } catch {
    return null;
  }
}

function parseIds(raw: string | null): string[] {
  if (!raw) return EMPTY_IDS;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return EMPTY_IDS;
    const ids = parsed.filter(
      (value): value is string => typeof value === "string" && value.length > 0,
    );
    return ids.length > 0 ? ids : EMPTY_IDS;
  } catch {
    return EMPTY_IDS;
  }
}

function writeIds(ids: string[]) {
  const raw = JSON.stringify(ids);
  cachedRaw = raw;
  cachedIds = ids.length > 0 ? ids : EMPTY_IDS;
  try {
    window.localStorage.setItem(FAVORITE_COMPANION_IDS_KEY, raw);
  } catch {
    // Ignore private-mode / quota failures.
  }
  window.dispatchEvent(new Event(FAVORITES_CHANGED_EVENT));
}

export function getFavoriteCompanionIds(): string[] {
  const raw = readRaw();
  if (raw === cachedRaw) return cachedIds;
  cachedRaw = raw;
  cachedIds = parseIds(raw);
  return cachedIds;
}

export function toggleFavoriteCompanion(id: string): boolean {
  if (typeof window === "undefined" || !id) return false;
  const next = new Set(getFavoriteCompanionIds());
  const isFavorite = next.has(id);
  if (isFavorite) next.delete(id);
  else next.add(id);
  writeIds([...next]);
  return !isFavorite;
}

export function subscribeToFavoriteCompanions(onStoreChange: () => void) {
  if (typeof window === "undefined") return () => {};

  const onStorage = (event: StorageEvent) => {
    if (event.key === FAVORITE_COMPANION_IDS_KEY || event.key === null) {
      onStoreChange();
    }
  };

  window.addEventListener("storage", onStorage);
  window.addEventListener(FAVORITES_CHANGED_EVENT, onStoreChange);
  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(FAVORITES_CHANGED_EVENT, onStoreChange);
  };
}
