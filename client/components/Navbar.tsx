import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Search,
  Menu,
  X,
  ShoppingCart,
  User,
  Home,
  ShoppingBag,
  ClipboardList,
  Info,
  Phone,
  Settings,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navigationItems = [
  { name: "Home", href: "/", icon: Home },
  { name: "Services", href: "/services", icon: ShoppingBag },
  { name: "Orders", href: "/orders", icon: ClipboardList },
  { name: "About", href: "/about", icon: Info },
  { name: "Contact", href: "/contact", icon: Phone },
];

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(true); // Demo state
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const location = useLocation();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
    setIsProfileDropdownOpen(false);
  }, [location.pathname]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isProfileDropdownOpen &&
        !(event.target as Element).closest(".profile-dropdown")
      ) {
        setIsProfileDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isProfileDropdownOpen]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Searching for:", searchQuery);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setIsProfileDropdownOpen(false);
  };

  return (
    <>
      <nav
        className={cn(
          "fixed top-0 left-0 right-0 z-50 bg-white border-b border-border transition-all duration-300",
          isScrolled ? "shadow-lg" : "shadow-sm",
        )}
      >
        <div className="px-4 lg:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Brand */}
            <div className="flex items-center space-x-3">
              <Link to="/" className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-buildora-gold to-buildora-gold-light rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xl">B</span>
                </div>
                <span className="text-2xl font-bold text-foreground">
                  Buildora
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              {navigationItems.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={cn(
                      "text-sm font-medium transition-colors hover:text-buildora-gold",
                      isActive ? "text-buildora-gold" : "text-foreground",
                    )}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </div>

            {/* Search Bar (Desktop) */}
            <div className="hidden md:block flex-1 max-w-md mx-8">
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search designs, packages..."
                  className="w-full pl-10 pr-4 py-2 border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-buildora-gold focus:border-transparent"
                  aria-label="Search designs and packages"
                />
              </form>
            </div>

            {/* Right Side Icons */}
            <div className="flex items-center space-x-4">
              {/* Get Free Quote Button */}
              <button className="hidden sm:inline-flex items-center px-4 py-2 bg-buildora-gold text-white font-medium rounded-lg hover:bg-buildora-gold-dark transition-colors text-sm">
                Get Free Quote
              </button>

              {/* Search Icon (Mobile) */}
              <button
                className="md:hidden p-2 text-foreground hover:text-buildora-gold transition-colors"
                aria-label="Search"
              >
                <Search className="h-5 w-5" />
              </button>

              {/* Cart/Order Icon */}
              <button
                className="relative p-2 text-foreground hover:text-buildora-gold transition-colors"
                aria-label="View cart"
              >
                <ShoppingCart className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 bg-buildora-gold text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  3
                </span>
              </button>

              {/* User Profile / Auth */}
              {isLoggedIn ? (
                <div className="relative profile-dropdown">
                  <button
                    onClick={() =>
                      setIsProfileDropdownOpen(!isProfileDropdownOpen)
                    }
                    className="flex items-center space-x-2 p-1 rounded-full border-2 border-transparent hover:border-buildora-gold transition-colors"
                    aria-label="User profile menu"
                  >
                    <div className="w-8 h-8 bg-buildora-gold rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-white" />
                    </div>
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 text-muted-foreground transition-transform hidden sm:block",
                        isProfileDropdownOpen && "transform rotate-180",
                      )}
                    />
                  </button>

                  {/* Profile Dropdown */}
                  {isProfileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-border py-2 z-50">
                      <Link
                        to="/orders"
                        className="flex items-center px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                      >
                        <ClipboardList className="h-4 w-4 mr-3" />
                        My Orders
                      </Link>
                      <Link
                        to="/profile"
                        className="flex items-center px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                      >
                        <Settings className="h-4 w-4 mr-3" />
                        Settings
                      </Link>
                      <hr className="my-2 border-border" />
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                      >
                        <LogOut className="h-4 w-4 mr-3" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="hidden sm:flex items-center space-x-2">
                  <button className="text-sm font-medium text-foreground hover:text-buildora-gold transition-colors">
                    Sign In
                  </button>
                  <span className="text-muted-foreground">/</span>
                  <button className="text-sm font-medium text-buildora-gold hover:text-buildora-gold-dark transition-colors">
                    Create Account
                  </button>
                </div>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={toggleMenu}
                className="lg:hidden p-2 text-foreground hover:text-buildora-gold transition-colors"
                aria-label="Toggle menu"
              >
                {isMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={cn(
          "fixed inset-0 z-40 lg:hidden transition-opacity duration-300",
          isMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none",
        )}
      >
        <div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={() => setIsMenuOpen(false)}
        />

        {/* Slide-out Panel */}
        <div
          className={cn(
            "absolute top-0 right-0 h-full w-80 max-w-[85vw] bg-white shadow-2xl transition-transform duration-300 ease-out",
            isMenuOpen
              ? "transform translate-x-0"
              : "transform translate-x-full",
          )}
        >
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-buildora-gold to-buildora-gold-light rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">B</span>
                </div>
                <span className="text-xl font-bold text-foreground">Menu</span>
              </div>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="p-2 text-foreground hover:text-buildora-gold transition-colors"
                aria-label="Close menu"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Mobile Search */}
            <div className="p-6 border-b border-border">
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search designs, packages..."
                  className="w-full pl-10 pr-4 py-3 border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-buildora-gold focus:border-transparent"
                  aria-label="Search designs and packages"
                />
              </form>
            </div>

            {/* Navigation Items */}
            <div className="flex-1 py-6">
              {navigationItems.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={cn(
                      "flex items-center px-6 py-4 text-lg font-medium transition-colors",
                      isActive
                        ? "text-buildora-gold bg-buildora-gold/5 border-r-4 border-buildora-gold"
                        : "text-foreground hover:text-buildora-gold hover:bg-muted/50",
                    )}
                  >
                    <item.icon className="mr-4 h-5 w-5" />
                    {item.name}
                  </Link>
                );
              })}

              {/* Mobile Get Quote Button */}
              <div className="px-6 py-4">
                <button className="w-full bg-buildora-gold text-white font-medium py-3 rounded-lg hover:bg-buildora-gold-dark transition-colors">
                  Get Free Quote
                </button>
              </div>
            </div>

            {/* Bottom Section */}
            <div className="border-t border-border p-6">
              {isLoggedIn ? (
                <div>
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-12 h-12 bg-buildora-gold rounded-full flex items-center justify-center">
                      <User className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">
                        Welcome Back!
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Transform your space
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Link
                      to="/orders"
                      className="flex items-center text-foreground hover:text-buildora-gold transition-colors"
                    >
                      <ClipboardList className="h-5 w-5 mr-2" />
                      <span className="font-medium">My Orders</span>
                    </Link>
                    <Link
                      to="/profile"
                      className="flex items-center text-foreground hover:text-buildora-gold transition-colors"
                    >
                      <Settings className="h-5 w-5 mr-2" />
                      <span className="font-medium">Settings</span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center text-foreground hover:text-buildora-gold transition-colors"
                    >
                      <LogOut className="h-5 w-5 mr-2" />
                      <span className="font-medium">Logout</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <button className="w-full bg-buildora-gold text-white font-medium py-3 rounded-lg hover:bg-buildora-gold-dark transition-colors">
                    Sign In
                  </button>
                  <button className="w-full border border-buildora-gold text-buildora-gold font-medium py-3 rounded-lg hover:bg-buildora-gold hover:text-white transition-colors">
                    Create Account
                  </button>
                </div>
              )}

              <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                <button className="flex items-center text-foreground hover:text-buildora-gold transition-colors">
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  <span className="font-medium">Cart (3)</span>
                </button>
                <span className="bg-buildora-gold text-white text-xs px-2 py-1 rounded-full">
                  New
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
