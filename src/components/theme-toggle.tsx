import { Check, Moon, Palette, Sun } from "lucide-react";
import { useTheme, type ColorTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const COLOR_OPTIONS: Array<{ id: ColorTheme; label: string; bg: string }> = [
  { id: "blue", label: "Blue (Default)", bg: "bg-blue-500" },
  { id: "yellow", label: "Yellow", bg: "bg-amber-400" },
  { id: "green", label: "Green", bg: "bg-emerald-500" },
  { id: "burgundy", label: "Burgundy", bg: "bg-rose-700" },
];

export function ThemeToggle() {
  const { theme, colorTheme, setTheme, setColorTheme } = useTheme();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          aria-label="Theme and color options"
          title="Theme and color options"
          className="shrink-0 rounded-full"
        >
          <Palette className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-64 space-y-4 rounded-2xl p-4">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Appearance
          </p>
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant={theme === "light" ? "default" : "outline"}
              size="sm"
              onClick={() => setTheme("light")}
              className="flex items-center justify-center gap-1.5 text-xs font-medium"
            >
              <Sun className="h-3.5 w-3.5" /> Light
            </Button>
            <Button
              variant={theme === "dark" ? "default" : "outline"}
              size="sm"
              onClick={() => setTheme("dark")}
              className="flex items-center justify-center gap-1.5 text-xs font-medium"
            >
              <Moon className="h-3.5 w-3.5" /> Dark
            </Button>
          </div>
        </div>
        <div className="space-y-2 border-t border-border pt-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Theme Color
          </p>
          <div className="grid grid-cols-2 gap-2">
            {COLOR_OPTIONS.map((c) => {
              const selected = colorTheme === c.id;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setColorTheme(c.id)}
                  className={`flex items-center gap-2 rounded-xl border p-2 text-left text-xs font-medium transition ${
                    selected
                      ? "border-primary bg-primary/10 text-foreground shadow-xs"
                      : "border-border bg-card text-muted-foreground hover:bg-muted"
                  }`}
                >
                  <span className={`h-4 w-4 shrink-0 rounded-full ${c.bg}`} />
                  <span className="flex-1 truncate">{c.label}</span>
                  {selected && <Check className="h-3.5 w-3.5 shrink-0 text-primary" />}
                </button>
              );
            })}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
