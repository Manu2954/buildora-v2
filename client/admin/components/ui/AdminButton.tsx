import { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
  full?: boolean;
};

export default function AdminButton({ variant = "primary", full, className, ...props }: Props) {
  const base = "inline-flex items-center justify-center rounded-xl md:rounded-2xl text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";
  const variants = {
    primary: "bg-buildora-gold text-white hover:bg-buildora-gold-dark focus:ring-buildora-gold",
    secondary: "border border-border text-buildora-text bg-card hover:bg-muted",
    ghost: "text-buildora-text hover:bg-muted",
  } as const;
  const size = "px-4 py-2";
  return (
    <button
      className={cn(base, variants[variant], size, full && "w-full", className)}
      {...props}
    />
  );
}
