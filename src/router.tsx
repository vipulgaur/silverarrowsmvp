import { createRouter as createTanStackRouter, ErrorComponent } from "@tanstack/react-router";
import { useEffect } from "react";
import { routeTree } from "./routeTree.gen";

function isDynamicImportError(error: unknown): boolean {
  const msg = error instanceof Error ? error.message : String(error ?? "");
  return (
    msg.includes("Failed to fetch dynamically imported module") ||
    msg.includes("Importing a module script failed") ||
    msg.includes("error loading dynamically imported module")
  );
}

function RouterErrorFallback({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (isDynamicImportError(error)) {
      const reloadKey = `sa-chunk-reload:${window.location.pathname}`;
      try {
        const lastReload = Number(window.sessionStorage.getItem(reloadKey) ?? "0");
        if (Date.now() - lastReload > 5000) {
          window.sessionStorage.setItem(reloadKey, String(Date.now()));
          window.location.reload();
          return;
        }
      } catch {
        window.location.reload();
        return;
      }
    }
  }, [error]);

  return (
    <div className="p-6">
      <ErrorComponent error={error} />
      <button
        type="button"
        onClick={() => {
          reset();
          if (typeof window !== "undefined") window.location.reload();
        }}
        className="mt-3 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground"
      >
        Reload Page
      </button>
    </div>
  );
}

export function createRouter() {
  if (typeof window !== "undefined") {
    window.addEventListener("vite:preloadError", (event) => {
      event.preventDefault();
      const reloadKey = "sa-vite-preload-reload";
      try {
        const last = Number(window.sessionStorage.getItem(reloadKey) ?? "0");
        if (Date.now() - last > 10000) {
          window.sessionStorage.setItem(reloadKey, String(Date.now()));
          window.location.reload();
        }
      } catch {
        /* ignore storage error */
      }
    });
  }

  const router = createTanStackRouter({
    routeTree,
    scrollRestoration: true,
    defaultErrorComponent: RouterErrorFallback,
  });

  return router;
}

export const getRouter = createRouter;

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof createRouter>;
  }
}
