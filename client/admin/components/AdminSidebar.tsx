import { Link, useLocation } from "react-router-dom";
import { Home, BarChart3, SlidersHorizontal, X } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const items = [
  { label: "Overview", href: "/admin", icon: Home },
  { label: "Lead Analytics", href: "/admin/cta/leads", icon: BarChart3 },
  { label: "CTA Config", href: "/admin/cta/config", icon: SlidersHorizontal },
  { label: "Catalog", href: "/admin/catalog", icon: SlidersHorizontal },
];

export default function AdminSidebar({ collapsed = false, mobile = false, onClose }: { collapsed?: boolean; mobile?: boolean; onClose?: () => void }) {
  const { pathname } = useLocation();
  const width = collapsed ? "w-14" : "w-64";
  const labelClass = collapsed ? "hidden" : "inline";
  const containerBase = "bg-card border border-border rounded-2xl shadow-sm h-full overflow-hidden";

  if (mobile) {
    return (
      <div className="fixed inset-0 z-50 md:hidden">
        <div className="absolute inset-0 bg-black/50" onClick={onClose} />
        <div className={`absolute left-0 top-0 bottom-0 w-64 ${containerBase} p-3`}>
          <div className="flex items-center justify-between px-2 py-1">
            <div className="text-xs font-semibold text-muted-foreground">Navigation</div>
            <button onClick={onClose} aria-label="Close" className="h-8 w-8 inline-flex items-center justify-center rounded-xl border border-border bg-card"><X className="h-4 w-4 text-buildora-text"/></button>
          </div>
          <nav className="px-2 pb-2 space-y-1 mt-2">
            {items.map((it) => {
              const active = pathname === it.href;
              const Icon = it.icon;
              return (
              <Link key={it.href} to={it.href} onClick={onClose} aria-current={active?"page":undefined} className={`flex items-center gap-3 rounded-xl px-3 py-2 min-h-[44px] text-sm ${active ? "bg-buildora-gold text-white" : "text-buildora-text hover:bg-muted"}`}>
                <Icon className="h-4 w-4" />
                <span>{it.label}</span>
              </Link>
              );
            })}
          </nav>
        </div>
      </div>
    );
  }

  return (
    <aside id="admin-sidebar" className={`hidden md:block ${width} transition-all duration-200`}>
      <div className={`${containerBase} ${collapsed ? "p-2 flex items-center justify-center h-60" : "p-3"}`}>
        {!collapsed && <div className="px-2 py-1 text-xs font-semibold text-muted-foreground">Navigation</div>}
        <nav className={`${collapsed ? "flex flex-col items-center justify-center gap-4" : "px-2 pb-2 space-y-1"}`} aria-label="Admin navigation">
          {items.map((it) => {
            const active = pathname === it.href;
            const Icon = it.icon;
            const collapsedClasses = collapsed
              ? `w-10 h-10 rounded-lg flex items-center justify-center ${active ? "bg-buildora-gold text-white ring-1 ring-sidebar-ring" : "text-buildora-text hover:bg-muted"}`
              : `gap-3 px-3 py-2 min-h-[44px] rounded-xl ${active ? "bg-buildora-gold text-white" : "text-buildora-text hover:bg-muted"}`;
            const link = (
              <Link
                key={it.href}
                to={it.href}
                aria-current={active ? "page" : undefined}
                aria-label={it.label}
                className={`${collapsed ? "" : "flex items-center"} text-[15px] ${collapsedClasses}`}
              >
                <Icon className="h-5 w-5 shrink-0" />
                {!collapsed && <span className={labelClass}>{it.label}</span>}
              </Link>
            );
            if (collapsed) {
              return (
                <Tooltip key={it.href}>
                  <TooltipTrigger asChild>{link}</TooltipTrigger>
                  <TooltipContent side="right" className="text-buildora-text">
                    {it.label}
                  </TooltipContent>
                </Tooltip>
              );
            }
            return link;
          })}
        </nav>
      </div>
    </aside>
  );
}
