import { cn } from "@/lib/utils";

type BrandWordmarkProps = {
  className?: string;
  size?: "sm" | "md" | "lg";
};

/**
 * Renders the company name as a stacked wordmark:
 *  - BUILDORA (gold, bold)
 *  - ENTERPRISE (below, smaller with letter spacing)
 */
export function BrandWordmark({ className, size = "md" }: BrandWordmarkProps) {
  const sizeMap = {
    sm: { top: "text-lg", bottom: "text-[10px]" },
    md: { top: "text-2xl", bottom: "text-xs" },
    lg: { top: "text-3xl", bottom: "text-sm" },
  } as const;

  return (
    <div className={cn("leading-tight select-none", className)} aria-label="BUILDORA ENTERPRISE">
      <div
        className={cn(
          "font-extrabold uppercase text-buildora-gold tracking-[0.08em]",
          sizeMap[size].top,
        )}
      >
        BUILDORA
      </div>
      <div
        className={cn(
          "uppercase tracking-[0.3em] text-foreground/80",
          sizeMap[size].bottom,
        )}
      >
        ENTERPRISE
      </div>
    </div>
  );
}

