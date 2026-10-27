import { cn } from "@/lib/utils";

export function BrandLogo({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-2.5 font-bold tracking-tight text-foreground select-none",
        className,
        "w-auto sm:w-auto md:w-auto lg:w-auto shrink-0 pr-1",
      )}
    >
      <img
        src="/favicon.png"
        alt="SilverArrows"
        className="h-8 w-8 shrink-0 rounded-lg object-contain"
      />
      <div className="flex flex-col leading-none whitespace-nowrap">
        <span className="text-base font-extrabold tracking-tight">SilverArrows</span>
        <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
          Flight Academy
        </span>
      </div>
    </div>
  );
}
