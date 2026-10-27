import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useStore } from "@/lib/store";

export type ThemeMode = "light" | "dark";
export type ColorTheme = "yellow" | "blue" | "green" | "burgundy";

interface ThemeContextValue {
  theme: ThemeMode;
  colorTheme: ColorTheme;
  toggleTheme: () => void;
  setTheme: (t: ThemeMode) => void;
  setColorTheme: (c: ColorTheme) => void;
}

const THEME_KEY = "silverarrows-theme";
const COLOR_THEME_KEY = "silverarrows-color-theme";
const DEFAULT_LIGHT_BLUE_MIGRATION_KEY = "silverarrows-default-light-blue-v1";

const ThemeContext = createContext<ThemeContextValue | null>(null);

function resolveInitialAppearance(): { theme: ThemeMode; colorTheme: ColorTheme } {
  let resolvedTheme: ThemeMode = "light";
  let resolvedColor: ColorTheme = "blue";

  try {
    if (typeof window !== "undefined" && typeof localStorage !== "undefined") {
      const migrated = localStorage.getItem(DEFAULT_LIGHT_BLUE_MIGRATION_KEY);
      const savedTheme = localStorage.getItem(THEME_KEY);
      const savedColor = localStorage.getItem(COLOR_THEME_KEY);

      // If browser storage has old pre-migration session values (both theme and color were auto-saved),
      // migrate once to the new default: Light mode + Blue accent.
      if (!migrated && savedTheme !== null && savedColor !== null) {
        localStorage.setItem(DEFAULT_LIGHT_BLUE_MIGRATION_KEY, "1");
        localStorage.setItem(THEME_KEY, "light");
        localStorage.setItem(COLOR_THEME_KEY, "blue");
        return { theme: "light", colorTheme: "blue" };
      }

      if (!migrated) {
        localStorage.setItem(DEFAULT_LIGHT_BLUE_MIGRATION_KEY, "1");
      }

      if (savedTheme === "light" || savedTheme === "dark") {
        resolvedTheme = savedTheme;
      }
      if (
        savedColor === "yellow" ||
        savedColor === "blue" ||
        savedColor === "green" ||
        savedColor === "burgundy"
      ) {
        resolvedColor = savedColor;
      }
    }
  } catch {
    // Guarded browser storage
  }

  return { theme: resolvedTheme, colorTheme: resolvedColor };
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeMode>(() => resolveInitialAppearance().theme);
  const [colorTheme, setColorThemeState] = useState<ColorTheme>(
    () => resolveInitialAppearance().colorTheme,
  );
  const { log } = useStore();

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    document.documentElement.style.colorScheme = theme;
    document.documentElement.setAttribute("data-color-theme", colorTheme);
    try {
      localStorage.setItem(DEFAULT_LIGHT_BLUE_MIGRATION_KEY, "1");
      localStorage.setItem(THEME_KEY, theme);
      localStorage.setItem(COLOR_THEME_KEY, colorTheme);
    } catch {
      // Guarded browser storage
    }
  }, [theme, colorTheme]);

  function setTheme(t: ThemeMode) {
    setThemeState(t);
    log("appearance_changed", "user", `Switched appearance to ${t}`);
  }

  function setColorTheme(c: ColorTheme) {
    setColorThemeState(c);
    log("theme_color_changed", "user", `Switched theme color to ${c}`);
  }

  function toggleTheme() {
    setTheme(theme === "dark" ? "light" : "dark");
  }

  return (
    <ThemeContext.Provider
      value={{
        theme,
        colorTheme,
        toggleTheme,
        setTheme,
        setColorTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

const fallback: ThemeContextValue = {
  theme: "light",
  colorTheme: "blue",
  toggleTheme: () => {},
  setTheme: () => {},
  setColorTheme: () => {},
};

export function useTheme(): ThemeContextValue {
  return useContext(ThemeContext) ?? fallback;
}
