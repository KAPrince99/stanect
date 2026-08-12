const LAST_COMPANION_KEY = "stanect:lastCompanionId";

export function getLastCompanionId(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(LAST_COMPANION_KEY);
  } catch {
    return null;
  }
}

export function setLastCompanionId(id: string) {
  if (typeof window === "undefined" || !id) return;
  try {
    window.localStorage.setItem(LAST_COMPANION_KEY, id);
  } catch {
    // Ignore private-mode / quota failures.
  }
}
