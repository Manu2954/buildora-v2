import React from "react";
import { cn } from "@/lib/utils";

type LogoProps = {
  size?: "small" | "medium" | "large" | "xl";
  variant?: "full" | "icon" | "text";
  className?: string;
  showText?: boolean;
  textClassName?: string;
  as?: keyof JSX.IntrinsicElements;
};

const sizeClasses: Record<NonNullable<LogoProps["size"]>, string> = {
  small: "w-6 h-6",
  medium: "w-8 h-8",
  large: "w-12 h-12",
  xl: "w-16 h-16",
};

const textSizeClasses: Record<NonNullable<LogoProps["size"]>, string> = {
  small: "text-sm",
  medium: "text-lg",
  large: "text-xl",
  xl: "text-2xl",
};

export default function Logo({
  size = "medium",
  variant = "full",
  className = "",
  showText = true,
  textClassName = "",
  as: As = "span",
}: LogoProps) {
  const initialSrc =
    // "https://pub-a0507326095e47999eb50c28c682ef43.r2.dev/buildora-icon.jpg";
    "/buildora-icon.png";
  // Progressive fallbacks (some may not exist; handler will iterate)
  const fallbacks = [
    "/logo.png",
    "/assets/images/logo.jpg",
    "/buildora-icon.png",
    "/buildora-icon-v1.png",
    "/buildora-icon-v1.jpeg",
  ];

  const handleImgError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const el = e.currentTarget;
    const idx = Number(el.dataset.fallbackIndex || "0");
    if (idx < fallbacks.length) {
      el.src = fallbacks[idx];
      el.dataset.fallbackIndex = String(idx + 1);
    } else {
      el.style.display = "none"; // Hide if all fallbacks fail
    }
  };

  return (
    <As className={cn("inline-flex items-center gap-2 align-middle", className)}>
      {(variant === "full" || variant === "icon") && (
        <img
          src={initialSrc}
          alt="Buildora Logo"
          className={cn(sizeClasses[size], "object-contain")}
          onError={handleImgError}
        />
      )}
      {showText && (variant === "full" || variant === "text") && (
        <span
          className={cn(
            "font-brand font-bold leading-none text-left",
            textSizeClasses[size],
            textClassName,
          )}
          aria-label="BUILDORA ENTERPRISE"
        >
          <span
            className={cn("block uppercase tracking-wide")}
            style={{ color: "#C69B4B", letterSpacing: "1px", marginBottom: "-5px", paddingBottom: "1px", fontSize: size === "small" ? undefined : "x-large" }}
          >
            BUILDORA
          </span>
          <span
            className={cn("block uppercase")}
            style={{ color: "#333132", letterSpacing: "2px", fontSize: size === "small" ? undefined : "large", paddingLeft: "1px" }}
          >
            ENTERPRISE
          </span>
        </span>
      )}
    </As>
  );
}
