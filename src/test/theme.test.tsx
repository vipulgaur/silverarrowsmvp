import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";

const { log } = vi.hoisted(() => ({ log: vi.fn() }));
vi.mock("@/lib/store", () => ({ useStore: () => ({ log }) }));
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  localStorage.clear();
  log.mockClear();
  document.documentElement.classList.remove("dark");
});

describe("Appearance preference and color themes", () => {
  const setup = () =>
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>,
    );
  it("defaults to light mode with blue accent color and toggles both appearances via popover menu", () => {
    setup();
    expect(document.documentElement.classList.contains("dark")).toBe(false);
    expect(document.documentElement.style.colorScheme).toBe("light");
    expect(document.documentElement.getAttribute("data-color-theme")).toBe("blue");
    expect(localStorage.getItem("silverarrows-theme")).toBe("light");
    expect(localStorage.getItem("silverarrows-color-theme")).toBe("blue");

    fireEvent.click(screen.getByRole("button", { name: /theme and color options/i }));
    fireEvent.click(screen.getByText(/dark/i));
    expect(document.documentElement.classList.contains("dark")).toBe(true);
    expect(localStorage.getItem("silverarrows-theme")).toBe("dark");
    expect(log).toHaveBeenCalledWith("appearance_changed", "user", "Switched appearance to dark");

    if (!screen.queryByText(/light/i)) {
      fireEvent.click(screen.getByRole("button", { name: /theme and color options/i }));
    }
    fireEvent.click(screen.getByText(/light/i));
    expect(document.documentElement.classList.contains("dark")).toBe(false);
    expect(localStorage.getItem("silverarrows-theme")).toBe("light");
  });
  it("restores a saved preference and migrates legacy auto-saved dark+yellow defaults to light+blue", () => {
    // Legacy pre-migration auto-saved dark+yellow is migrated once to light+blue
    localStorage.setItem("silverarrows-theme", "dark");
    localStorage.setItem("silverarrows-color-theme", "yellow");
    setup();
    expect(document.documentElement.classList.contains("dark")).toBe(false);
    expect(document.documentElement.getAttribute("data-color-theme")).toBe("blue");

    // Once migrated, an explicit dark preference is restored on subsequent mounts
    cleanup();
    localStorage.setItem("silverarrows-theme", "dark");
    setup();
    expect(document.documentElement.classList.contains("dark")).toBe(true);
    expect(document.documentElement.style.colorScheme).toBe("dark");
  });
  it("allows switching color themes", () => {
    setup();
    fireEvent.click(screen.getByRole("button", { name: /theme and color options/i }));
    fireEvent.click(screen.getByText(/green/i));
    expect(document.documentElement.getAttribute("data-color-theme")).toBe("green");
    expect(localStorage.getItem("silverarrows-color-theme")).toBe("green");
    expect(log).toHaveBeenCalledWith("theme_color_changed", "user", "Switched theme color to green");
  });
  it("keeps the toggle usable when browser storage is blocked", () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("Blocked");
    });
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("Blocked");
    });
    setup();
    fireEvent.click(screen.getByRole("button", { name: /theme and color options/i }));
    fireEvent.click(screen.getByText(/dark/i));
    expect(document.documentElement.classList.contains("dark")).toBe(true);
  });
});
