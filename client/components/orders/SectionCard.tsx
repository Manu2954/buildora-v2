import { cn } from "@/lib/utils";
import React from "react";

export function SectionCard({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <section
      className={cn(
        "bg-white rounded-none md:rounded-[24px] shadow-none md:shadow-[0_6px_20px_rgba(0,0,0,0.08)] border-b md:border border-[#D9D9D9] p-4 md:p-8",
        className,
      )}
      {...props}
    >
      {children}
    </section>
  );
}
