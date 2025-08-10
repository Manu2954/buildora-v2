import { Link, useLocation } from "react-router-dom";
import { Home, ShoppingBag, ClipboardList, User } from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Home", href: "/", icon: Home },
  { name: "Services", href: "/services", icon: ShoppingBag },
  { name: "Orders", href: "/orders", icon: ClipboardList },
  { name: "Profile", href: "/profile", icon: User },
];

export function Sidebar() {
  const location = useLocation();

  return (
    <aside className="fixed inset-y-0 left-0 z-40 w-[220px] bg-white border-r border-gray-200 top-16">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center px-4 border-b border-gray-200">
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-[#c59c46] to-[#e6d09f] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">B</span>
            </div>
            <span className="text-xl font-bold text-[#333132]">Buildora</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-4">
          <ul className="space-y-0">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <li key={item.name} className="py-2">
                  <Link
                    to={item.href}
                    className={cn(
                      "flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 relative",
                      isActive
                        ? "bg-[#f2f2f2] text-[#c59c46] border-l-4 border-[#c59c46] ml-0 pl-3"
                        : "text-[#333132] hover:bg-[#f8f8f8] hover:text-[#c59c46]",
                    )}
                    aria-label={item.name}
                  >
                    <item.icon
                      className={cn(
                        "mr-3 h-5 w-5 transition-colors",
                        isActive
                          ? "text-[#c59c46]"
                          : "text-[#666666] hover:text-[#c59c46]",
                      )}
                    />
                    <span className="font-medium">{item.name}</span>
                    {isActive && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#c59c46] rounded-r-full"></div>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Bottom Welcome Section - Fixed */}
        <div className="border-t border-gray-200 p-4 mt-auto">
          <div className="flex items-center space-x-3 px-4 py-3">
            <div className="w-8 h-8 bg-[#c59c46] rounded-full flex items-center justify-center">
              <User className="h-4 w-4 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-[#333132]">Welcome!</p>
              <p className="text-xs text-[#666666]">Transform your space</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
