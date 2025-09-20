import { ReactNode } from "react";
import { cn } from "@/lib/utils";

export default function AdminCard({
  children,
  className,
  title,
  actions,
}: {
  children: ReactNode;
  className?: string;
  title?: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <section
      className={cn(
        "bg-card border border-border rounded-2xl shadow-sm",
        "p-4 md:p-6",
        className,
      )}
    >
      {(title || actions) && (
        <div className="mb-4 flex items-center justify-between gap-3">
          {title ? (
            <h2 className="text-base md:text-lg font-semibold text-buildora-text">
              {title}
            </h2>
          ) : (
            <div />
          )}
          {actions}
        </div>
      )}
      {children}
    </section>
  );
}
