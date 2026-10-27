import type { AppData } from "../types";

let syncDebounceTimer: ReturnType<typeof setTimeout> | null = null;

/**
 * Sends local updates to the development server sync bus so that
 * all other open browsers (Safari, Chrome, etc.) receive the changes live.
 */
export function pushLocalSync(data: AppData): void {
  if (typeof window === "undefined" || !window.fetch) return;
  if (syncDebounceTimer) clearTimeout(syncDebounceTimer);

  syncDebounceTimer = setTimeout(() => {
    try {
      fetch("/api/local-sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }).catch(() => {
        /* silent catch if server is in production or offline */
      });
    } catch {
      /* ignore fetch errors */
    }
  }, 100);
}

/**
 * Signals the development sync bus to reset the shared store for all browsers.
 */
export function resetLocalSync(): void {
  if (typeof window === "undefined" || !window.fetch) return;
  try {
    fetch("/api/local-sync/reset", {
      method: "POST",
    }).catch(() => {
      /* silent catch */
    });
  } catch {
    /* ignore fetch errors */
  }
}

/**
 * Retrieves the latest shared snapshot from the local development sync bus.
 */
export async function fetchLocalSync(): Promise<AppData | null> {
  if (typeof window === "undefined" || !window.fetch) return null;
  try {
    const res = await fetch("/api/local-sync");
    if (!res.ok) return null;
    const json = (await res.json()) as { data?: AppData | null };
    return json?.data ?? null;
  } catch {
    return null;
  }
}

/**
 * Subscribes to Server-Sent Events from the local development sync bus.
 * Whenever another browser modifies the academy state, this fires with the
 * new snapshot so this browser updates its local state and UI immediately.
 */
export function initLocalSyncListener(
  onSync: (data: AppData) => void,
  onReset: () => void,
): () => void {
  if (typeof window === "undefined" || typeof window.EventSource === "undefined") {
    return () => {};
  }

  let es: EventSource | null = null;
  let active = true;

  try {
    es = new EventSource("/api/local-sync/events");

    es.onmessage = (event) => {
      if (!active) return;
      try {
        const payload = JSON.parse(event.data) as {
          type: "init" | "sync" | "reset";
          data?: AppData | null;
        };
        if ((payload.type === "init" || payload.type === "sync") && payload.data) {
          onSync(payload.data);
        } else if (payload.type === "reset") {
          onReset();
        }
      } catch {
        /* ignore parse errors */
      }
    };

    es.onerror = () => {
      /* EventSource handles reconnect automatically */
    };
  } catch {
    return () => {};
  }

  return () => {
    active = false;
    if (es) {
      es.close();
      es = null;
    }
  };
}
