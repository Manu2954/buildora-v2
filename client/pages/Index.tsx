import { Sidebar } from "@/components/Sidebar";
import { HeroBanner } from "@/components/HeroBanner";
import { CategoriesSection } from "@/components/CategoriesSection";
import { FeaturedDesigns } from "@/components/FeaturedDesigns";
import { QuickActions } from "@/components/QuickActions";
import { PackagesSection } from "@/components/PackagesSection";
import { Footer } from "@/components/Footer";

export default function Index() {
  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar Navigation */}
      <Sidebar />
      
      {/* Main Content */}
      <main className="flex-1 ml-64">
        <div className="min-h-screen flex flex-col">
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
          
          {/* Footer */}
          <Footer />
        </div>
      </main>
    </div>
  );
}
