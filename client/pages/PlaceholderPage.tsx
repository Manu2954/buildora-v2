import { Sidebar } from "@/components/Sidebar";
import { Footer } from "@/components/Footer";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { Construction } from "lucide-react";

interface PlaceholderPageProps {
  title: string;
  description: string;
}

export function PlaceholderPage({ title, description }: PlaceholderPageProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Add top margin for fixed navbar */}
      <div className="pt-16">
        <div className="flex">
          {/* Sidebar Navigation - Optional on desktop for quick access */}
          <div className="hidden xl:block">
            <Sidebar />
          </div>
          
          <main className="flex-1 xl:ml-64">
            <div className="min-h-screen flex flex-col pb-16 md:pb-0">
              <div className="flex-1 flex items-center justify-center p-8">
                <div className="text-center max-w-md">
                  <div className="w-24 h-24 bg-buildora-gold/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Construction className="h-12 w-12 text-buildora-gold" />
                  </div>
                  <h1 className="text-3xl font-bold text-foreground mb-4">{title}</h1>
                  <p className="text-muted-foreground mb-6 leading-relaxed">{description}</p>
                  <p className="text-sm text-muted-foreground">
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
