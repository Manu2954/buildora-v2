import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

const designAds = [
  {
    id: 1,
    title: "Luxury Modern Living Room",
    subtitle: "Transform your space with premium Italian furniture",
    image: "/placeholder.svg",
    ctaText: "View Collection",
    gradient: "from-amber-600 via-amber-500 to-orange-400",
    textColor: "text-white",
  },
  {
    id: 2,
    title: "Scandinavian Kitchen Design",
    subtitle: "Clean lines meets functional beauty",
    image: "/placeholder.svg",
    ctaText: "Explore Designs",
    gradient: "from-slate-600 via-slate-500 to-gray-400",
    textColor: "text-white",
  },
  {
    id: 3,
    title: "Minimalist Bedroom Suite",
    subtitle: "Serene spaces for perfect rest",
    image: "/placeholder.svg",
    ctaText: "Shop Now",
    gradient: "from-emerald-600 via-emerald-500 to-teal-400",
    textColor: "text-white",
  },
  {
    id: 4,
    title: "Contemporary Bathroom",
    subtitle: "Spa-like luxury in your home",
    image: "/placeholder.svg",
    ctaText: "Get Quote",
    gradient: "from-blue-600 via-blue-500 to-cyan-400",
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
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
    // Resume auto-play after 10 seconds
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % designAds.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + designAds.length) % designAds.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const currentAd = designAds[currentSlide];

  return (
    <section className="relative overflow-hidden">
      <div className="relative rounded-2xl mx-4 lg:mx-6 my-4 lg:my-8 overflow-hidden h-[400px] lg:h-[500px]">
        {/* Background Image & Gradient Overlay */}
        <div className="absolute inset-0">
          <img
            src={currentAd.image}
            alt={currentAd.title}
            className="w-full h-full object-cover transition-transform duration-700 ease-out"
          />
          <div className={cn(
            "absolute inset-0 bg-gradient-to-r opacity-80",
            currentAd.gradient
          )} />
        </div>

        {/* Content */}
        <div className="relative z-10 h-full flex items-center">
          <div className="px-8 lg:px-16 max-w-4xl">
            <h1 className={cn(
              "text-3xl md:text-4xl lg:text-6xl font-bold mb-4 lg:mb-6 leading-tight transition-all duration-500",
              currentAd.textColor
            )}>
              {currentAd.title}
            </h1>
            <p className={cn(
              "text-lg lg:text-xl mb-8 max-w-2xl leading-relaxed transition-all duration-500",
              currentAd.textColor === "text-white" ? "text-white/90" : "text-gray-700"
            )}>
              {currentAd.subtitle}
            </p>
            <button 
              className="inline-flex items-center px-8 py-4 text-lg font-semibold bg-white text-buildora-gold rounded-xl shadow-lg hover:bg-white/95 hover:shadow-xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-white/50 transform hover:scale-105"
              aria-label={`${currentAd.ctaText} - ${currentAd.title}`}
            >
              {currentAd.ctaText}
              <ExternalLink className="ml-2 h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
          aria-label="Previous slide"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
          aria-label="Next slide"
        >
          <ChevronRight className="h-6 w-6" />
        </button>

        {/* Slide Indicators */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-3">
          {designAds.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={cn(
                "w-3 h-3 rounded-full transition-all duration-300",
                index === currentSlide
                  ? "bg-white scale-125"
                  : "bg-white/50 hover:bg-white/70"
              )}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Progress Bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
          <div 
            className="h-full bg-white transition-all duration-300 ease-linear"
            style={{ 
              width: `${((currentSlide + 1) / designAds.length) * 100}%` 
            }}
          />
        </div>
      </div>
    </section>
  );
}
