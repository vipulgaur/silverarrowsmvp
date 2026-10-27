import type { Plugin } from "vite";
import type { IncomingMessage, ServerResponse } from "node:http";
import fs from "node:fs";
import path from "node:path";

/**
 * Local Cross-Browser Synchronization Plugin for SilverArrows.
 * Provides instant live sync between Safari, Chrome, and any other browser
 * running on localhost during development and testing.
 */
export function localSyncPlugin(): Plugin {
  const storeFilePath = path.resolve(process.cwd(), ".silverarrows-shared-store.local.json");
  const clients = new Set<ServerResponse>();
  let memoryStore: string | null = null;

  try {
    if (fs.existsSync(storeFilePath)) {
      memoryStore = fs.readFileSync(storeFilePath, "utf-8");
    }
  } catch {
    memoryStore = null;
  }

  function broadcast(type: string, data?: unknown) {
    const payload = JSON.stringify({ type, data });
    const message = `data: ${payload}\n\n`;
    for (const client of clients) {
      try {
        client.write(message);
      } catch {
        clients.delete(client);
      }
    }
  }

  return {
    name: "silverarrows-local-sync",
    configureServer(server) {
      server.middlewares.use((req: IncomingMessage, res: ServerResponse, next: () => void) => {
        const url = req.url?.split("?")[0];

        if (req.method === "OPTIONS" && url?.startsWith("/api/local-sync")) {
          res.writeHead(204, {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
          });
          res.end();
          return;
        }

        // SSE Realtime Broadcast Stream across all browsers
        if (url === "/api/local-sync/events") {
          res.writeHead(200, {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache, no-transform",
            "Connection": "keep-alive",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "*",
          });
          res.write(
            `data: ${JSON.stringify({
              type: "init",
              data: memoryStore ? JSON.parse(memoryStore) : null,
            })}\n\n`,
          );
          clients.add(res);

          req.on("close", () => {
            clients.delete(res);
          });
          return;
        }

        // Fetch shared store
        if (url === "/api/local-sync" && req.method === "GET") {
          res.writeHead(200, {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          });
          res.end(JSON.stringify({ data: memoryStore ? JSON.parse(memoryStore) : null }));
          return;
        }

        // Push update from any browser & broadcast to all others
        if (url === "/api/local-sync" && req.method === "POST") {
          let body = "";
          req.on("data", (chunk: Buffer | string) => {
            body += chunk.toString();
          });
          req.on("end", () => {
            try {
              if (body) {
                const parsed = JSON.parse(body);
                memoryStore = body;
                try {
                  fs.writeFileSync(storeFilePath, body, "utf-8");
                } catch {
                  /* ignore disk write errors */
                }
                broadcast("sync", parsed);
              }
              res.writeHead(200, {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
              });
              res.end(JSON.stringify({ ok: true }));
            } catch {
              res.writeHead(400, {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
              });
              res.end(JSON.stringify({ error: "Invalid JSON payload" }));
            }
          });
          return;
        }

        // Reset shared store back to seedData
        if (url === "/api/local-sync/reset" && req.method === "POST") {
          memoryStore = null;
          try {
            if (fs.existsSync(storeFilePath)) {
              fs.unlinkSync(storeFilePath);
            }
          } catch {
            /* ignore deletion errors */
          }
          broadcast("reset");
          res.writeHead(200, {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          });
          res.end(JSON.stringify({ ok: true, reset: true }));
          return;
        }

        next();
      });
    },
  };
}
