import {
  Outlet,
  ScrollRestoration,
  createRootRoute,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import type { ReactNode } from "react";
import { StoreProvider } from "@/lib/store";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";
import appCss from "@/styles.css?url";
import "@/styles.css";

const cssHref = appCss.includes("?") ? appCss : `${appCss}?direct`;

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "SilverArrows — Aviation E-Learning & Flight Logger",
      },
      {
        name: "description",
        content:
          "Aviation theory E-Learning (Air Manual - Pooley & Air Law) and Flight Logger academy operations platform.",
      },
    ],
    links: [
      {
        rel: "stylesheet",
        href: cssHref,
      },
      {
        rel: "preconnect",
        href: "https://fonts.googleapis.com",
      },
      {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: "anonymous",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap",
      },
    ],
  }),
  component: RootComponent,
});

function RootComponent() {
  return (
    <RootDocument>
      <StoreProvider>
        <ThemeProvider>
          <Outlet />
          <Toaster position="bottom-right" richColors />
        </ThemeProvider>
      </StoreProvider>
    </RootDocument>
  );
}

const THEME_INIT_SCRIPT = `(function(){try{var m=localStorage.getItem("silverarrows-default-light-blue-v1");var t=localStorage.getItem("silverarrows-theme");var c=localStorage.getItem("silverarrows-color-theme");if(!m&&t!==null&&c!==null){localStorage.setItem("silverarrows-default-light-blue-v1","1");localStorage.setItem("silverarrows-theme","light");localStorage.setItem("silverarrows-color-theme","blue");t="light";c="blue";}else if(!m){localStorage.setItem("silverarrows-default-light-blue-v1","1");}var mode=(t==="dark"||t==="light")?t:"light";var color=(c==="yellow"||c==="blue"||c==="green"||c==="burgundy")?c:"blue";document.documentElement.classList.toggle("dark",mode==="dark");document.documentElement.style.colorScheme=mode;document.documentElement.setAttribute("data-color-theme",color);}catch(e){document.documentElement.classList.remove("dark");document.documentElement.style.colorScheme="light";document.documentElement.setAttribute("data-color-theme","blue");}})();`;

function RootDocument({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      data-color-theme="blue"
      style={{ colorScheme: "light" }}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
        <HeadContent />
      </head>
      <body className="min-h-screen bg-background text-foreground antialiased selection:bg-primary/20 selection:text-primary">
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
