import { Sidebar } from "@/components/Sidebar";
import { HeroBanner } from "@/components/HeroBanner";
import { CategoriesSection } from "@/components/CategoriesSection";
import { FeaturedDesigns } from "@/components/FeaturedDesigns";
import { QuickActions } from "@/components/QuickActions";
import { PackagesSection } from "@/components/PackagesSection";
import { WhyChooseBuildora } from "@/components/WhyChooseBuildora";
import { Footer } from "@/components/Footer";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { SidebarProvider, useSidebar } from "@/contexts/SidebarContext";

function IndexContent() {
  const { isCollapsed, toggle } = useSidebar();

  return (
    <div className="min-h-screen bg-[#e8e8e8]">
      {/* Mobile: Add top margin for navbar with search */}
      <div className="pt-24 md:pt-16">
        <div className="flex">
          {/* Sidebar Navigation - Only on desktop */}
          <div className="hidden xl:block">
            <Sidebar isCollapsed={isCollapsed} onToggle={toggle} />
          </div>
          
          {/* Main Content */}
          <main 
            className={`flex-1 transition-all duration-300 ease-in-out ${
              isCollapsed ? "xl:ml-16" : "xl:ml-[220px]"
            }`}
          >
            {/* Mobile: Bottom padding for bottom nav */}
            <div className="min-h-screen flex flex-col pb-24 md:pb-0">
              {/* Content sections with smooth transitions */}
              <div className="space-y-6 md:space-y-8 lg:space-y-12">
                {/* Hero Banner */}
                <div className="transition-all duration-500 ease-out">
                  <HeroBanner />
                </div>
                
                {/* Categories Section with app-like full-width containers */}
                <div className="transition-all duration-500 ease-out delay-100">
                  <div className="bg-white md:bg-transparent md:mx-0 mx-4 rounded-t-2xl md:rounded-none shadow-sm md:shadow-none">
                    <CategoriesSection />
                  </div>
                </div>
                
                {/* Featured Designs */}
                <div className="transition-all duration-500 ease-out delay-200">
                  <div className="bg-white md:bg-transparent md:mx-0 mx-4 rounded-t-2xl md:rounded-none shadow-sm md:shadow-none">
                    <FeaturedDesigns />
                  </div>
                </div>
                
                {/* Quick Actions */}
                <div className="transition-all duration-500 ease-out delay-300">
                  <div className="bg-white md:bg-transparent md:mx-0 mx-4 rounded-t-2xl md:rounded-none shadow-sm md:shadow-none">
                    <QuickActions />
                  </div>
                </div>
                
                {/* Packages Section */}
                <div className="transition-all duration-500 ease-out delay-400">
                  <PackagesSection />
                </div>
                
                {/* Why Choose Buildora Section */}
                <div className="transition-all duration-500 ease-out delay-500">
                  <div className="bg-white md:bg-[#f8f8f8] md:mx-0 mx-4 rounded-t-2xl md:rounded-none shadow-sm md:shadow-none">
                    <WhyChooseBuildora />
                  </div>
                </div>
                
                {/* Footer */}
                <div className="transition-all duration-500 ease-out delay-600">
                  <Footer />
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
      
      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />
    </div>
  );
}

export default function Index() {
  return (
    <SidebarProvider>
      <IndexContent />
    </SidebarProvider>
  );
}
