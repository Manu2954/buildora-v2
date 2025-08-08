import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function HeroBanner() {
  return (
    <section className="relative overflow-hidden">
      <div className="bg-gradient-to-r from-buildora-gold via-buildora-gold-light to-buildora-background rounded-2xl mx-6 my-8 p-12 lg:p-16">
        <div className="max-w-4xl">
          <h1 className="text-4xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Transform Your Space
          </h1>
          <p className="text-lg lg:text-xl text-white/90 mb-8 max-w-2xl leading-relaxed">
            Professional interior design & execution packages for new or existing spaces. 
            From supplies to architects, we handle everything for your dream space.
          </p>
          <button 
            className={cn(
              "inline-flex items-center px-8 py-4 text-lg font-semibold",
              "bg-white text-buildora-gold rounded-xl shadow-lg",
              "hover:bg-white/95 hover:shadow-xl transition-all duration-300",
              "focus:outline-none focus:ring-4 focus:ring-white/50",
              "transform hover:scale-105"
            )}
            aria-label="Explore interior design collections"
          >
            Explore Designs
            <ArrowRight className="ml-2 h-5 w-5" />
          </button>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-8 right-8 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
        <div className="absolute bottom-8 right-16 w-24 h-24 bg-white/5 rounded-full blur-xl"></div>
      </div>
    </section>
  );
}
