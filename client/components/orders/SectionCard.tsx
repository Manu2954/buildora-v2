import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionCardProps {
  id?: string;
  title: string;
  description?: string;
  className?: string;
  headerAction?: ReactNode;
  children: ReactNode;
}

export function SectionCard({ id, title, description, className, headerAction, children }: SectionCardProps) {
  return (
    <section id={id} aria-labelledby={id ? `${id}-title` : undefined} className="scroll-mt-24">
      <div
        className={cn(
          "bg-white rounded-[24px] border border-[#D9D9D9] shadow-sm",
          className,
        )}
      >
        <div className="flex items-start justify-between p-6">
          <div>
            <h2 id={id ? `${id}-title` : undefined} className="text-2xl font-bold text-[#333132]">
              {title}
            </h2>
            {description ? (
              <p className="mt-1 text-sm text-[#666666]">{description}</p>
            ) : null}
          </div>
          {headerAction ? <div className="ml-4 shrink-0">{headerAction}</div> : null}
        </div>
        <div className="px-6 pb-6">{children}</div>
      </div>
    </section>
  );
}
