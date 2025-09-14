import { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
  full?: boolean;
};

export default function AdminButton({ variant = "primary", full, className, ...props }: Props) {
  const base = "inline-flex items-center justify-center rounded-xl md:rounded-2xl text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";
  const variants = {
    primary: "bg-[#C69B4B] text-[#333132] hover:bg-[#B1873E] focus:ring-[#C69B4B]",
    secondary: "border border-[#D9D9D9] text-[#333132] bg-white hover:bg-[#F7F7F7]",
    ghost: "text-[#333132] hover:bg-[#F7F7F7]",
  } as const;
  const size = "px-4 py-2";
  return (
    <button
      className={cn(base, variants[variant], size, full && "w-full", className)}
      {...props}
    />
  );
}
