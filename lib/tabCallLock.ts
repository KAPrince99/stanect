const OWNER_KEY = "stanect-call-owner";
const HEARTBEAT_KEY = "stanect-call-heartbeat";

export const tabId =
  typeof window !== "undefined" ? crypto.randomUUID() : "server";

export function claimCallOwnership() {
  if (typeof window === "undefined") return true;

  const currentOwner = localStorage.getItem(OWNER_KEY);

  if (!currentOwner) {
    localStorage.setItem(OWNER_KEY, tabId);
    startHeartbeat();
    return true;
  }

  return currentOwner === tabId;
}

export function releaseCallOwnership() {
  if (typeof window === "undefined") return;

  const owner = localStorage.getItem(OWNER_KEY);
  if (owner === tabId) {
    localStorage.removeItem(OWNER_KEY);
    localStorage.removeItem(HEARTBEAT_KEY);
  }
}

export function isCallOwner() {
  if (typeof window === "undefined") return true;
  return localStorage.getItem(OWNER_KEY) === tabId;
}

/* ----------------------------- HEARTBEAT ----------------------------- */

let heartbeatInterval: any;

function startHeartbeat() {
  stopHeartbeat();

  heartbeatInterval = setInterval(() => {
    localStorage.setItem(HEARTBEAT_KEY, Date.now().toString());
  }, 2000);
}

function stopHeartbeat() {
  if (heartbeatInterval) clearInterval(heartbeatInterval);
}

/* ------------------------- STALE LOCK RECOVERY ------------------------ */

export function recoverStaleLock() {
  const beat = localStorage.getItem(HEARTBEAT_KEY);
  if (!beat) return;

  const lastBeat = Number(beat);
  const diff = Date.now() - lastBeat;

  if (diff > 5000) {
    localStorage.removeItem(OWNER_KEY);
    localStorage.removeItem(HEARTBEAT_KEY);
  }
}

/* --------------------------- TAB CLOSE CLEANUP ------------------------ */

if (typeof window !== "undefined") {
  window.addEventListener("beforeunload", () => {
    releaseCallOwnership();
  });
}
