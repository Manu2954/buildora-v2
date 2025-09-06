import React from "react";

type Size = "sm" | "md" | "lg" | "xl";

interface BrandMarkProps {
  size?: Size;
  align?: "left" | "center" | "right";
  className?: string;
}

// Stacked wordmark: BUILDORA (gold) with ENTERPRISE below (smaller, tracking-wide)
export function BrandMark({ size = "md", align = "left", className = "" }: BrandMarkProps) {
  const sizeClasses: Record<Size, { top: string; bottom: string }> = {
    sm: { top: "text-xl", bottom: "text-[10px]" },
    md: { top: "text-2xl", bottom: "text-xs" },
    lg: { top: "text-3xl", bottom: "text-sm" },
    xl: { top: "text-4xl", bottom: "text-base" },
  };

  const alignClass = align === "center" ? "items-center text-center" : align === "right" ? "items-end text-right" : "items-start text-left";

  return (
    <div className={`leading-none select-none ${alignClass} ${className}`} aria-label="BUILDORA ENTERPRISE">
      <div className={`font-extrabold tracking-tight text-gold ${sizeClasses[size].top}`}>BUILDORA</div>
      <div className={`font-medium tracking-[0.3em] text-text/80 mt-0.5 ${sizeClasses[size].bottom}`}>ENTERPRISE</div>
    </div>
  );
}

export default BrandMark;

