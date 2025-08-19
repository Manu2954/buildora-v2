import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  ShoppingBag,
  ClipboardList,
  User,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Home", href: "/", icon: Home },
  { name: "Services", href: "/services", icon: ShoppingBag },
  { name: "Orders", href: "/orders", icon: ClipboardList },
  { name: "Profile", href: "/profile", icon: User },
];

interface SidebarProps {
  isCollapsed?: boolean;
  onToggle?: () => void;
}

export function Sidebar({ isCollapsed = false, onToggle }: SidebarProps) {
  const location = useLocation();

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-40 bg-white border-r border-gray-200 top-16 transition-all duration-300 ease-in-out",
        isCollapsed ? "w-16" : "w-[220px]",
      )}
    >
      <div className="flex h-full flex-col">
        {/* Toggle Button */}
        <div className="flex items-center justify-end p-3 border-b border-gray-100">
          <button
            onClick={onToggle}
            className="p-2 rounded-lg hover:bg-[#f8f8f8] transition-colors duration-200 text-[#666666] hover:text-[#c59c46]"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3">
          <ul className="space-y-1">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className={cn(
                      "flex items-center text-sm font-medium rounded-lg transition-all duration-200 relative group",
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
                      <span className="font-medium truncate">{item.name}</span>
                    )}

                    {/* Active indicator */}
                    {isActive && (
                      <div className="absolute right-0 top-0 bottom-0 w-1 bg-[#c59c46] rounded-l-full" />
                    )}

                    {/* Tooltip for collapsed state */}
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

        {/* Bottom User Section - Only when expanded */}
        {!isCollapsed && (
          <div className="border-t border-gray-100 p-3">
            <div className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-[#f8f8f8] transition-colors duration-200 cursor-pointer">
              <div className="w-8 h-8 bg-[#c59c46] rounded-full flex items-center justify-center flex-shrink-0">
                <User className="h-4 w-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[#333132] truncate">
                  Welcome!
                </p>
                <p className="text-xs text-[#666666] truncate">
                  Transform your space
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Collapsed state user icon */}
        {isCollapsed && (
          <div className="border-t border-gray-100 p-3">
            <div className="flex justify-center">
              <div className="w-8 h-8 bg-[#c59c46] rounded-full flex items-center justify-center cursor-pointer hover:scale-105 transition-transform duration-200 group">
                <User className="h-4 w-4 text-white" />
                {/* Tooltip */}
                <div className="absolute left-full ml-2 px-2 py-1 bg-[#333132] text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                  Profile
                  <div className="absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-1 w-0 h-0 border-r-4 border-r-[#333132] border-t-2 border-b-2 border-t-transparent border-b-transparent" />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
