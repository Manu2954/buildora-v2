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
    <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-white border-t border-border">
      <div className="grid grid-cols-5 h-16">
        {navItems.map((item) => {
          const isActive = location.pathname === item.href;
          
          return (
            <Link
              key={item.id}
              to={item.href}
              className={cn(
                "flex flex-col items-center justify-center space-y-1 transition-colors",
                "min-h-[44px] relative",
                isActive
                  ? "text-buildora-gold"
                  : "text-muted-foreground hover:text-foreground"
              )}
              aria-label={`Navigate to ${item.name}`}
            >
              {/* Active indicator */}
              {isActive && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-buildora-gold rounded-full" />
              )}
              
              <item.icon className={cn(
                "h-5 w-5 transition-transform",
                isActive && "scale-110"
              )} />
              
              <span className={cn(
                "text-xs font-medium",
                isActive ? "text-buildora-gold" : "text-muted-foreground"
              )}>
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
      
      {/* Safe area for devices with home indicator */}
      <div className="h-safe-area-inset-bottom bg-white" />
    </nav>
  );
}
