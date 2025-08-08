import { Sidebar } from "@/components/Sidebar";
import { HeroBanner } from "@/components/HeroBanner";
import { CategoriesSection } from "@/components/CategoriesSection";
import { FeaturedDesigns } from "@/components/FeaturedDesigns";
import { QuickActions } from "@/components/QuickActions";
import { PackagesSection } from "@/components/PackagesSection";
import { WhyChooseBuildora } from "@/components/WhyChooseBuildora";
import { Footer } from "@/components/Footer";
import { MobileBottomNav } from "@/components/MobileBottomNav";

export default function Index() {
  return (
    <div className="min-h-screen bg-background">
      {/* Add top margin for fixed navbar */}
      <div className="pt-16">
        <div className="flex">
          {/* Sidebar Navigation - Optional on desktop for quick access */}
          <div className="hidden xl:block">
            <Sidebar />
          </div>
          
          {/* Main Content */}
          <main className="flex-1 xl:ml-64">
            <div className="min-h-screen flex flex-col pb-16 md:pb-0">
              {/* Hero Banner */}
              <HeroBanner />
              
              {/* Categories Section */}
              <CategoriesSection />
              
              {/* Featured Designs */}
              <FeaturedDesigns />
              
              {/* Quick Actions */}
              <QuickActions />
              
              {/* Packages Section */}
              <PackagesSection />
              
              {/* Why Choose Buildora Section */}
              <WhyChooseBuildora />
              
              {/* Footer */}
              <Footer />
            </div>
          </main>
        </div>
      </div>
      
      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />
    </div>
  );
}
