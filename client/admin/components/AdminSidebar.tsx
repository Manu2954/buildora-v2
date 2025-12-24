import { Link, useLocation } from "react-router-dom";
import {
  Home,
  BarChart3,
  SlidersHorizontal,
  ClipboardList,
  Users,
  Clock3,
  X,
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { currentUser } from "@/lib/api";

const coreItems = [
  { label: "Overview", href: "/admin", icon: Home },
  { label: "Lead Analytics", href: "/admin/cta/leads", icon: BarChart3 },
  { label: "Projects", href: "/admin/projects", icon: ClipboardList },
  { label: "CTA Config", href: "/admin/cta/config", icon: SlidersHorizontal },
];

const salesmenItems = [
  { label: "Salesmen", href: "/admin/salesmen", icon: Users },
  { label: "Salesman Entries", href: "/admin/salesman-entries", icon: Clock3 },
];

export default function AdminSidebar({ collapsed = false, mobile = false, onClose }: { collapsed?: boolean; mobile?: boolean; onClose?: () => void }) {
  const user = currentUser<{ role?: string } | null>();
  const { pathname } = useLocation();
  if (user?.role !== "ADMIN") return null;
  const width = collapsed ? "w-14" : "w-64";
  const labelClass = collapsed ? "hidden" : "inline";
  const containerBase = "bg-white border border-[#D9D9D9] rounded-3xl shadow-sm h-full overflow-hidden";
  const sections = [
    { label: "Navigation", items: coreItems },
    { label: "Salesmen", items: salesmenItems },
  ];
  const allItems = sections.flatMap((section) => section.items);

  if (mobile) {
    return (
      <div className="fixed inset-0 z-50 md:hidden">
        <div className="absolute inset-0 bg-black/50" onClick={onClose} />
        <div className={`absolute left-0 top-0 bottom-0 w-64 ${containerBase} p-3`}>
          <div className="flex items-center justify-between px-2 py-1">
            <div className="text-xs font-semibold text-[#666666]">Navigation</div>
            <button onClick={onClose} aria-label="Close" className="h-8 w-8 inline-flex items-center justify-center rounded-xl border border-[#D9D9D9]"><X className="h-4 w-4"/></button>
          </div>
          <nav className="px-2 pb-2 space-y-4 mt-2">
            {sections.map((section) => (
              <div key={section.label}>
                <div className="px-2 py-1 text-xs font-semibold text-[#666666]">{section.label}</div>
                <div className="space-y-1">
                  {section.items.map((it) => {
                    const active = pathname === it.href;
                    const Icon = it.icon;
                    return (
                      <Link key={it.href} to={it.href} onClick={onClose} aria-current={active?"page":undefined} className={`flex items-center gap-3 rounded-xl px-3 py-2 min-h-[44px] text-sm ${active ? "bg-[#F7F4EE] text-[#C69B4B]" : "text-[#333132] hover:bg-[#F7F7F7]"}`}>
                        <Icon className="h-4 w-4" />
                        <span>{it.label}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>
        </div>
      </div>
    );
  }

  return (
    <aside id="admin-sidebar" className={`hidden md:block ${width} transition-all duration-200`}>
      <div className={`${containerBase} ${collapsed ? "p-2" : "p-3"}`}> 
        {!collapsed && <div className="px-2 py-1 text-xs font-semibold text-[#666666]">Navigation</div>}
        <nav className={`${collapsed ? "flex flex-col items-center justify-start gap-4" : "px-2 pb-2 space-y-4"}`} aria-label="Admin navigation">
          {(collapsed ? [{ label: "Navigation", items: allItems }] : sections).map((section) => (
            <div key={section.label} className={collapsed ? "" : "space-y-1"}>
              {!collapsed && (
                <div className="px-2 py-1 text-xs font-semibold text-[#666666]">
                  {section.label}
                </div>
              )}
              <div className={`${collapsed ? "flex flex-col items-center gap-4" : "space-y-1"}`}>
                {section.items.map((it) => {
                  const active = pathname === it.href;
                  const Icon = it.icon;
                  const collapsedClasses = collapsed
                    ? `w-10 h-10 rounded-lg flex items-center justify-center ${active ? "bg-[#F7F4EE] text-[#C69B4B] ring-1 ring-[#E9E2D5]" : "text-[#333132] hover:bg-[#F7F7F7]"}`
                    : `gap-3 px-3 py-2 min-h-[44px] rounded-xl ${active ? "bg-[#F7F4EE] text-[#C69B4B]" : "text-[#333132] hover:bg-[#F7F7F7]"}`;
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
                        <TooltipContent side="right" className="text-[#333132]">
                          {it.label}
                        </TooltipContent>
                      </Tooltip>
                    );
                  }
                  return link;
                })}
              </div>
            </div>
          ))}
        </nav>
      </div>
    </aside>
  );
}
