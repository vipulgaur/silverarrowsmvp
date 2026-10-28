import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { nitro } from "nitro/vite";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { localSyncPlugin } from "./src/lib/api/local-sync-plugin";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function resolveBuildHash(): string {
  try {
    const headPath = path.resolve(__dirname, ".git/HEAD");
    if (fs.existsSync(headPath)) {
      const head = fs.readFileSync(headPath, "utf8").trim();
      if (head.startsWith("ref: ")) {
        const refRel = head.slice(5).trim();
        const refPath = path.resolve(__dirname, ".git", refRel);
        if (fs.existsSync(refPath)) {
          return fs.readFileSync(refPath, "utf8").trim().slice(0, 7);
        }
        const packedPath = path.resolve(__dirname, ".git/packed-refs");
        if (fs.existsSync(packedPath)) {
          const lines = fs.readFileSync(packedPath, "utf8").split("\n");
          for (const line of lines) {
            if (line.endsWith(` ${refRel}`)) {
              return line.split(" ")[0].trim().slice(0, 7);
            }
          }
        }
      } else if (/^[0-9a-f]{7,40}$/i.test(head)) {
        return head.slice(0, 7);
      }
    }
  } catch {
    // fallback below
  }
  return (
    process.env.SHORT_SHA ||
    process.env.COMMIT_SHA?.slice(0, 7) ||
    process.env.VITE_BUILD_HASH ||
    "ad58e63"
  );
}

export default defineConfig(({ command }) => ({
  define: {
    __APP_BUILD_HASH__: JSON.stringify(resolveBuildHash()),
  },
  plugins: [
    tailwindcss(),
    tsconfigPaths({ projects: ["./tsconfig.json"] }),
    localSyncPlugin(),
    tanstackStart({ server: { entry: "server" } }),
    ...(command === "build" ? [nitro({ preset: "node-server" })] : []),
    react(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ["react", "react-dom", "@tanstack/react-router", "@tanstack/react-query"],
  },
  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "react/jsx-runtime",
      "react/jsx-dev-runtime",
      "recharts",
      "lucide-react",
      "date-fns",
      "react-markdown",
      "remark-gfm",
      "sonner",
    ],
  },
  server: {
    host: "0.0.0.0",
    port: 3000,
    hmr: process.env.DISABLE_HMR !== "true",
    watch: process.env.DISABLE_HMR === "true" ? null : {},
  },
}));
