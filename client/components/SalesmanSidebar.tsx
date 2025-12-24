import { Link, useLocation } from "react-router-dom";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  PlusCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { currentUser } from "@/lib/api";

const navigation = [
  { name: "My Leads", href: "/salesman/leads", icon: ClipboardList },
  { name: "New Lead", href: "/salesman/leads/new", icon: PlusCircle },
  { name: "Daily Entry", href: "/salesman/entry", icon: CalendarDays },
];

interface SalesmanSidebarProps {
  isCollapsed?: boolean;
  onToggle?: () => void;
}

export default function SalesmanSidebar({
  isCollapsed = false,
  onToggle,
}: SalesmanSidebarProps) {
  const location = useLocation();
  const user = currentUser<{ role?: string } | null>();
  const items = user?.role === "SALESMAN" ? navigation : [];

  const isItemActive = (href: string) => {
    if (href === "/salesman/leads") {
      return location.pathname === "/salesman" || location.pathname === href;
    }
    return location.pathname === href;
  };

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-40 bg-white border-r border-gray-200 top-16 transition-all duration-300 ease-in-out",
        isCollapsed ? "w-16" : "w-[220px]",
      )}
    >
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-end p-3 border-b border-gray-100">
          <button
            onClick={onToggle}
            className="p-2 rounded-lg hover:bg-[#f8f8f8] transition-colors duration-200 text-[#666666] hover:text-[#c59c46]"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            type="button"
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </button>
        </div>

        <nav className="flex-1 p-3" aria-label="Salesman navigation">
          <ul className="space-y-1">
            {items.map((item) => {
              const isActive = isItemActive(item.href);
              return (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className={cn(
                      "flex items-center text-base font-medium rounded-lg transition-all duration-200 relative group",
                      "hover:bg-[#f8f8f8] focus:outline-none focus:ring-2 focus:ring-[#c59c46]/20",
                      isCollapsed ? "p-3 justify-center" : "px-3 py-2.5",
                      isActive
                        ? "text-[#c59c46] bg-[#c59c46]/10"
                        : "text-[#333132] hover:text-[#c59c46]",
                    )}
                    aria-label={item.name}
                    title={isCollapsed ? item.name : undefined}
                  >
                    <item.icon
                      className={cn(
                        "h-5 w-5 transition-colors flex-shrink-0",
                        isActive
                          ? "text-[#c59c46]"
                          : "text-[#666666] group-hover:text-[#c59c46]",
                        !isCollapsed && "mr-3",
                      )}
                    />

                    {!isCollapsed && (
                      <span className="font-medium truncate">
                        {item.name}
                      </span>
                    )}

                    {isActive && (
                      <div className="absolute right-0 top-0 bottom-0 w-1 bg-[#c59c46] rounded-l-full" />
                    )}

                    {isCollapsed && (
                      <div className="absolute left-full ml-2 px-2 py-1 bg-[#333132] text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                        {item.name}
                        <div className="absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-1 w-0 h-0 border-r-4 border-r-[#333132] border-t-2 border-b-2 border-t-transparent border-b-transparent" />
                      </div>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </aside>
  );
}
