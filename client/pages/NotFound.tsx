import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Footer } from "@/components/Footer";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { useSidebar } from "@/contexts/SidebarContext";
import { Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const { isCollapsed, toggle } = useSidebar();

  useEffect(() => {
    // optionally report to analytics here; suppress console noise
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-[#e8e8e8]">
      {/* Add top margin for fixed navbar */}
      <div className="pt-24 md:pt-16">
        <div className="flex">
          {/* Sidebar Navigation - Only on desktop */}
          <div className="hidden xl:block">
            <Sidebar isCollapsed={isCollapsed} onToggle={toggle} />
          </div>

          <main
            className={`flex-1 transition-all duration-300 ease-in-out ${
              isCollapsed ? "xl:ml-16" : "xl:ml-[220px]"
            }`}
          >
            <div className="min-h-screen flex flex-col pb-24 md:pb-0">
              <div className="flex-1 flex items-center justify-center p-8">
                <div className="text-center max-w-md">
                  <div className="w-24 h-24 bg-[#c59c46]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-6xl font-bold text-[#c59c46]">
                      404
                    </span>
                  </div>
                  <h1 className="text-3xl font-bold text-[#333132] mb-4">
                    Page Not Found
                  </h1>
                  <p className="text-[#666666] mb-6 leading-relaxed">
                    The page you're looking for doesn't exist. Let's get you
                    back to exploring beautiful designs.
                  </p>
                  <Link
                    to="/"
                    className="inline-flex items-center px-6 py-3 bg-[#c59c46] text-white font-medium rounded-lg hover:bg-[#a17c36] transition-colors min-h-[44px]"
                  >
                    <Home className="h-5 w-5 mr-2" />
                    Return to Home
                  </Link>
                </div>
              </div>
              <Footer />
            </div>
          </main>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />
    </div>
  );
};

export default NotFound;
