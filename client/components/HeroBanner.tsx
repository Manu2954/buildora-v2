import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, ExternalLink, Quote } from "lucide-react";
import { cn } from "@/lib/utils";

const designAds = [
  {
    id: 1,
    title: "Transform Your Space",
    subtitle: "Professional interior design & execution packages for new or existing spaces. From supplies to architects, we handle everything for your dream space.",
    image: "/placeholder.svg",
    ctaText: "Explore Designs",
    secondaryCta: "Get Free Quote",
    gradient: "from-[#c59c46] via-[#e6d09f] to-[#e8e8e8]",
    textColor: "text-white",
  },
  {
    id: 2,
    title: "Luxury Redefined",
    subtitle: "Experience premium craftsmanship with our luxury interior design packages. Turn your vision into reality with our expert team.",
    image: "/placeholder.svg",
    ctaText: "View Luxury Collection",
    secondaryCta: "Book Consultation",
    gradient: "from-slate-600 via-slate-500 to-gray-400",
    textColor: "text-white",
  },
  {
    id: 3,
    title: "Modern Living Spaces",
    subtitle: "Contemporary designs that blend functionality with aesthetics. Create spaces that reflect your lifestyle and personality.",
    image: "/placeholder.svg",
    ctaText: "Browse Designs",
    secondaryCta: "Get Started",
    gradient: "from-emerald-600 via-emerald-500 to-teal-400",
    textColor: "text-white",
  },
];

export function HeroBanner() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-advance slides
  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % designAds.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 12000);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % designAds.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 12000);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + designAds.length) % designAds.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 12000);
  };

  const currentAd = designAds[currentSlide];

  return (
    <section className="relative overflow-hidden">
      {/* Mobile: Full-width with rounded top corners */}
      <div className="relative mx-4 my-4 lg:mx-6 lg:my-8 overflow-hidden h-[400px] md:h-[500px] lg:h-[600px] rounded-2xl md:rounded-2xl">
        {/* Background Image & Gradient Overlay */}
        <div className="absolute inset-0">
          <img
            src={currentAd.image}
            alt={currentAd.title}
            className="w-full h-full object-cover transition-transform duration-700 ease-out"
          />
          <div className={cn(
            "absolute inset-0 bg-gradient-to-r opacity-90",
            currentAd.gradient
          )} />
        </div>

        {/* Content */}
        <div className="relative z-10 h-full flex items-center">
          <div className="px-6 md:px-12 lg:px-16 max-w-6xl mx-auto w-full">
            <div className="text-center md:text-left max-w-4xl">
              {/* Mobile: Bigger, centered headings */}
              <h1 className={cn(
                "text-3xl md:text-4xl lg:text-6xl font-bold mb-4 md:mb-6 leading-tight transition-all duration-500",
                "text-center md:text-left",
                currentAd.textColor
              )}>
                {currentAd.title}
              </h1>
              
              {/* Mobile: Reduced text size for readability */}
              <p className={cn(
                "text-sm md:text-lg lg:text-xl mb-6 md:mb-8 max-w-2xl leading-relaxed transition-all duration-500",
                "text-center md:text-left mx-auto md:mx-0",
                currentAd.textColor === "text-white" ? "text-white/90" : "text-gray-700"
              )}>
                {currentAd.subtitle}
              </p>
              
              {/* Mobile: Stack buttons vertically with app-like styling */}
              <div className="flex flex-col md:flex-row gap-4 md:gap-6 justify-center md:justify-start items-center">
                <button 
                  className="w-full md:w-auto inline-flex items-center justify-center px-6 md:px-8 py-4 text-base md:text-lg font-semibold bg-white text-[#c59c46] rounded-2xl shadow-lg hover:bg-white/95 hover:shadow-xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-white/50 transform hover:scale-105 active:scale-95 min-h-[52px]"
                  aria-label={`${currentAd.ctaText} - ${currentAd.title}`}
                >
                  {currentAd.ctaText}
                  <ExternalLink className="ml-2 h-4 w-4 md:h-5 md:w-5" />
                </button>
                
                <button 
                  className="w-full md:w-auto inline-flex items-center justify-center px-6 md:px-8 py-4 text-base md:text-lg font-semibold bg-transparent border-2 border-white text-white rounded-2xl hover:bg-white hover:text-[#c59c46] transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-white/50 transform hover:scale-105 active:scale-95 min-h-[52px]"
                  aria-label={`${currentAd.secondaryCta} - Get consultation`}
                >
                  {currentAd.secondaryCta}
                  <Quote className="ml-2 h-4 w-4 md:h-5 md:w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Arrows - Hidden on mobile for app-like feel */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors hidden md:flex"
          aria-label="Previous slide"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors hidden md:flex"
          aria-label="Next slide"
        >
          <ChevronRight className="h-6 w-6" />
        </button>

        {/* Slide Indicators - More prominent on mobile */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-3">
          {designAds.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={cn(
                "transition-all duration-300 rounded-full",
                "w-3 h-3 md:w-4 md:h-4", // Larger on mobile
                index === currentSlide
                  ? "bg-white scale-125 shadow-lg"
                  : "bg-white/50 hover:bg-white/70"
              )}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Progress Bar - More visible on mobile */}
        <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-white/20 rounded-b-2xl overflow-hidden">
          <div 
            className="h-full bg-white transition-all duration-300 ease-linear rounded-b-2xl"
            style={{ 
              width: `${((currentSlide + 1) / designAds.length) * 100}%` 
            }}
          />
        </div>

        {/* Mobile swipe hint */}
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 text-white/70 text-sm md:hidden bg-black/20 px-3 py-1 rounded-full backdrop-blur-sm">
          ← Swipe for more →
        </div>
      </div>
    </section>
  );
}
