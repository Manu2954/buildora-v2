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
  ChevronDown
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
  const [isLoggedIn, setIsLoggedIn] = useState(true);
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
      if (isProfileDropdownOpen && !(event.target as Element).closest('.profile-dropdown')) {
        setIsProfileDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
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
      <nav className={cn(
        "fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 transition-all duration-300",
        isScrolled ? "shadow-lg" : "shadow-sm"
      )}>
        <div className="px-5 lg:px-8">
          <div className="flex items-center justify-between h-16 py-3">
            {/* Left: Logo */}
            <div className="flex items-center space-x-3 flex-shrink-0">
              <Link to="/" className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-[#c59c46] to-[#e6d09f] rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xl">B</span>
                </div>
                <span className="text-2xl font-bold text-[#333132]">Buildora</span>
              </Link>
            </div>

            {/* Center: Desktop Navigation */}
            <div className="hidden lg:flex items-center justify-center flex-1 max-w-2xl mx-8">
              <div className="flex items-center space-x-8">
                {navigationItems.map((item) => {
                  const isActive = location.pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={cn(
                        "text-sm font-medium transition-all duration-200 py-2 relative",
                        isActive 
                          ? "text-[#c59c46]" 
                          : "text-[#333132] hover:text-[#c59c46]"
                      )}
                    >
                      {item.name}
                      {isActive && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#c59c46] rounded-full"></div>
                      )}
                      {!isActive && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#c59c46] rounded-full scale-x-0 hover:scale-x-100 transition-transform duration-200"></div>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Right: Search, Actions, User */}
            <div className="flex items-center space-x-4 flex-shrink-0">
              {/* Search Bar (Desktop) */}
              <div className="hidden md:block">
                <form onSubmit={handleSearch} className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#666666]" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search designs..."
                    className="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-white text-[#333132] placeholder:text-[#666666] focus:outline-none focus:ring-2 focus:ring-[#c59c46] focus:border-transparent transition-all duration-200"
                    aria-label="Search designs and packages"
                  />
                </form>
              </div>

              {/* Get Free Quote Button */}
              <button className="hidden sm:inline-flex items-center px-6 py-2 bg-[#c59c46] text-white font-medium rounded-lg hover:bg-[#a17c36] transition-colors duration-200 text-sm">
                Get Free Quote
              </button>

              {/* Search Icon (Mobile) */}
              <button 
                className="md:hidden p-2 text-[#333132] hover:text-[#c59c46] transition-colors duration-200"
                aria-label="Search"
              >
                <Search className="h-5 w-5" />
              </button>

              {/* Cart/Order Icon */}
              <button 
                className="relative p-2 text-[#333132] hover:text-[#c59c46] transition-colors duration-200"
                aria-label="View cart"
              >
                <ShoppingCart className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 bg-[#c59c46] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                  3
                </span>
              </button>

              {/* User Profile / Auth */}
              {isLoggedIn ? (
                <div className="relative profile-dropdown">
                  <button 
                    onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                    className="flex items-center space-x-2 p-1 rounded-lg border-2 border-transparent hover:border-[#c59c46] transition-all duration-200"
                    aria-label="User profile menu"
                  >
                    <div className="w-8 h-8 bg-[#c59c46] rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-white" />
                    </div>
                    <ChevronDown className={cn(
                      "h-4 w-4 text-[#666666] transition-transform duration-200 hidden sm:block",
                      isProfileDropdownOpen && "transform rotate-180"
                    )} />
                  </button>

                  {/* Profile Dropdown */}
                  {isProfileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                      <Link 
                        to="/orders" 
                        className="flex items-center px-4 py-2 text-sm text-[#333132] hover:bg-[#f8f8f8] hover:text-[#c59c46] transition-colors duration-200"
                      >
                        <ClipboardList className="h-4 w-4 mr-3" />
                        My Orders
                      </Link>
                      <Link 
                        to="/profile" 
                        className="flex items-center px-4 py-2 text-sm text-[#333132] hover:bg-[#f8f8f8] hover:text-[#c59c46] transition-colors duration-200"
                      >
                        <Settings className="h-4 w-4 mr-3" />
                        Settings
                      </Link>
                      <hr className="my-2 border-gray-200" />
                      <button 
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-sm text-[#333132] hover:bg-[#f8f8f8] hover:text-[#c59c46] transition-colors duration-200"
                      >
                        <LogOut className="h-4 w-4 mr-3" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="hidden sm:flex items-center space-x-3">
                  <button className="text-sm font-medium text-[#333132] hover:text-[#c59c46] transition-colors duration-200 px-3 py-2">
                    Sign In
                  </button>
                  <button className="text-sm font-medium bg-[#c59c46] text-white hover:bg-[#a17c36] transition-colors duration-200 px-4 py-2 rounded-lg">
                    Create Account
                  </button>
                </div>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={toggleMenu}
                className="lg:hidden p-2 text-[#333132] hover:text-[#c59c46] transition-colors duration-200"
                aria-label="Toggle menu"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div className={cn(
        "fixed inset-0 z-40 lg:hidden transition-opacity duration-300",
        isMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      )}>
        <div 
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={() => setIsMenuOpen(false)}
        />
        
        {/* Slide-out Panel from Left */}
        <div className={cn(
          "absolute top-0 left-0 h-full w-80 max-w-[85vw] bg-white shadow-2xl transition-transform duration-300 ease-out",
          isMenuOpen ? "transform translate-x-0" : "transform -translate-x-full"
        )}>
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-[#c59c46] to-[#e6d09f] rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">B</span>
                </div>
                <span className="text-xl font-bold text-[#333132]">Menu</span>
              </div>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="p-2 text-[#333132] hover:text-[#c59c46] transition-colors duration-200"
                aria-label="Close menu"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Mobile Search */}
            <div className="p-6 border-b border-gray-200">
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#666666]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search designs..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-white text-[#333132] placeholder:text-[#666666] focus:outline-none focus:ring-2 focus:ring-[#c59c46] focus:border-transparent"
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
                      "flex items-center px-6 py-4 text-lg font-medium transition-colors duration-200",
                      isActive
                        ? "text-[#c59c46] bg-[#f2f2f2] border-r-4 border-[#c59c46]"
                        : "text-[#333132] hover:text-[#c59c46] hover:bg-[#f8f8f8]"
                    )}
                  >
                    <item.icon className="mr-4 h-5 w-5" />
                    {item.name}
                  </Link>
                );
              })}
              
              {/* Mobile Get Quote Button */}
              <div className="px-6 py-4">
                <button className="w-full bg-[#c59c46] text-white font-medium py-3 rounded-lg hover:bg-[#a17c36] transition-colors duration-200">
                  Get Free Quote
                </button>
              </div>
            </div>

            {/* Bottom Section */}
            <div className="border-t border-gray-200 p-6">
              {isLoggedIn ? (
                <div>
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-12 h-12 bg-[#c59c46] rounded-full flex items-center justify-center">
                      <User className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-[#333132]">Welcome Back!</p>
                      <p className="text-sm text-[#666666]">Transform your space</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Link to="/orders" className="flex items-center text-[#333132] hover:text-[#c59c46] transition-colors duration-200">
                      <ClipboardList className="h-5 w-5 mr-2" />
                      <span className="font-medium">My Orders</span>
                    </Link>
                    <Link to="/profile" className="flex items-center text-[#333132] hover:text-[#c59c46] transition-colors duration-200">
                      <Settings className="h-5 w-5 mr-2" />
                      <span className="font-medium">Settings</span>
                    </Link>
                    <button 
                      onClick={handleLogout}
                      className="flex items-center text-[#333132] hover:text-[#c59c46] transition-colors duration-200"
                    >
                      <LogOut className="h-5 w-5 mr-2" />
                      <span className="font-medium">Logout</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <button className="w-full bg-[#c59c46] text-white font-medium py-3 rounded-lg hover:bg-[#a17c36] transition-colors duration-200">
                    Sign In
                  </button>
                  <button className="w-full border-2 border-[#c59c46] text-[#c59c46] font-medium py-3 rounded-lg hover:bg-[#c59c46] hover:text-white transition-all duration-200">
                    Create Account
                  </button>
                </div>
              )}
              
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                <button className="flex items-center text-[#333132] hover:text-[#c59c46] transition-colors duration-200">
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  <span className="font-medium">Cart (3)</span>
                </button>
                <span className="bg-[#c59c46] text-white text-xs px-2 py-1 rounded-full font-medium">
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
