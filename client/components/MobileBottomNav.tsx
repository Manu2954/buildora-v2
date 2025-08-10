import { Link, useLocation } from "react-router-dom";
import { Home, ShoppingBag, ClipboardList, User, Search } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  {
    name: "Home",
    href: "/",
    icon: Home,
    id: "home"
  },
  {
    name: "Services", 
    href: "/services",
    icon: ShoppingBag,
    id: "services"
  },
  {
    name: "Search",
    href: "/search",
    icon: Search,
    id: "search"
  },
  {
    name: "Orders",
    href: "/orders",
    icon: ClipboardList,
    id: "orders"
  },
  {
    name: "Profile",
    href: "/profile",
    icon: User,
    id: "profile"
  },
];

export function MobileBottomNav() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 md:hidden">
      {/* App-like bottom navigation with rounded top corners */}
      <div className="bg-white border-t border-gray-200 rounded-t-2xl shadow-lg">
        <div className="grid grid-cols-5 h-20">
          {navItems.map((item) => {
            const isActive = location.pathname === item.href;
            
            return (
              <Link
                key={item.id}
                to={item.href}
                className={cn(
                  "flex flex-col items-center justify-center space-y-1 transition-all duration-300",
                  "min-h-[64px] relative p-2 rounded-t-2xl",
                  isActive
                    ? "text-[#c59c46] bg-[#f8f8f8] transform scale-105"
                    : "text-[#666666] hover:text-[#333132] active:scale-95"
                )}
                aria-label={`Navigate to ${item.name}`}
              >
                {/* Active indicator - pill shape */}
                {isActive && (
                  <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-[#c59c46] rounded-full" />
                )}
                
                <div className={cn(
                  "p-2 rounded-xl transition-all duration-300",
                  isActive && "bg-[#c59c46]/10"
                )}>
                  <item.icon className={cn(
                    "h-6 w-6 transition-all duration-300",
                    isActive ? "text-[#c59c46] scale-110" : "text-[#666666]"
                  )} />
                </div>
                
                <span className={cn(
                  "text-xs font-medium transition-all duration-300",
                  isActive ? "text-[#c59c46] font-semibold" : "text-[#666666]"
                )}>
                  {item.name}
                </span>
              </Link>
            );
          })}
        </div>
        
        {/* Safe area for devices with home indicator */}
        <div className="h-2 bg-white" />
      </div>
    </nav>
  );
}
