import { Sidebar } from "@/components/Sidebar";
import { Footer } from "@/components/Footer";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { useSidebar } from "@/contexts/SidebarContext";
import { Construction } from "lucide-react";

interface PlaceholderPageProps {
  title: string;
  description: string;
}

export function PlaceholderPage({ title, description }: PlaceholderPageProps) {
  const { isCollapsed, toggle } = useSidebar();

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
                    <Construction className="h-12 w-12 text-[#c59c46]" />
                  </div>
                  <h1 className="text-3xl font-bold text-[#333132] mb-4">{title}</h1>
                  <p className="text-[#666666] mb-6 leading-relaxed">{description}</p>
                  <p className="text-sm text-[#666666]">
                    Continue prompting to have this page content generated!
                  </p>
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
}
