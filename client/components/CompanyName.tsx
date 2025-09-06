import { cn } from "@/lib/utils";

type CompanyNameProps = {
  className?: string;
  size?: "sm" | "md" | "lg";
};

/**
 * Two-line brand wordmark:
 *  BUILDORA (gold, larger) over ENTERPRISE (smaller, letter-spaced, dark).
 *  Uses hex colors per requirement to match the logo reference.
 */
export function CompanyName({ className, size = "md" }: CompanyNameProps) {
  const sizeMap = {
    sm: { top: "text-xl md:text-2xl", bottom: "text-[10px] md:text-xs" },
    md: { top: "text-2xl md:text-3xl", bottom: "text-xs md:text-sm" },
    lg: { top: "text-3xl md:text-4xl", bottom: "text-sm md:text-base" },
  } as const;

  return (
    <div className={cn("inline-block text-left leading-tight select-none", className)} aria-label="BUILDORA ENTERPRISE">
      <div className={cn("font-extrabold uppercase text-[#C69B4B] tracking-wide", sizeMap[size].top)}>
        BUILDORA
      </div>
      <div className={cn("uppercase text-[#333132] tracking-[0.25em] mt-0.5", sizeMap[size].bottom)}>
        ENTERPRISE
      </div>
    </div>
  );
}

