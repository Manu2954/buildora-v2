import { Sofa, ChefHat, Bed, Bath } from "lucide-react";
import { cn } from "@/lib/utils";

const categories = [
  {
    name: "Living Room",
    icon: Sofa,
    description: "Comfortable & stylish living spaces",
    count: "240+ designs",
    color: "from-blue-500 to-blue-600"
  },
  {
    name: "Kitchen",
    icon: ChefHat,
    description: "Modern & functional kitchen designs",
    count: "180+ designs",
    color: "from-green-500 to-green-600"
  },
  {
    name: "Bedroom",
    icon: Bed,
    description: "Relaxing & cozy bedroom spaces",
    count: "320+ designs",
    color: "from-purple-500 to-purple-600"
  },
  {
    name: "Bathroom",
    icon: Bath,
    description: "Elegant & spa-like bathrooms",
    count: "150+ designs",
    color: "from-teal-500 to-teal-600"
  },
];

export function CategoriesSection() {
  return (
    <section className="px-4 lg:px-6 py-6 lg:py-8">
      <div className="mb-6 lg:mb-8 text-center md:text-left">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-2">
          Design Categories
        </h2>
        <p className="text-muted-foreground text-base md:text-lg">
          Explore our curated collections for every space
        </p>
      </div>
      
      {/* Desktop: Grid layout, Mobile: Horizontal scrollable */}
      <div className="relative">
        {/* Mobile: Horizontal scroll */}
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide md:hidden">
          {categories.map((category, index) => (
            <div
              key={category.name}
              className="flex-shrink-0 w-72 bg-card border border-border rounded-xl p-6 hover:shadow-lg hover:border-buildora-gold/20 transition-all duration-300 cursor-pointer group"
              role="button"
              tabIndex={0}
              aria-label={`Browse ${category.name} designs`}
            >
              <div className={cn(
                "flex items-center justify-center w-16 h-16 rounded-xl mb-4 transition-all duration-300",
                "bg-gradient-to-br", category.color,
                "group-hover:scale-110"
              )}>
                <category.icon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-card-foreground mb-2">
                {category.name}
              </h3>
              <p className="text-muted-foreground text-sm mb-3 leading-relaxed">
                {category.description}
              </p>
              <span className="text-buildora-gold text-sm font-medium">
                {category.count}
              </span>
            </div>
          ))}
        </div>

        {/* Desktop: Grid layout */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <div
              key={category.name}
              className="bg-card border border-border rounded-xl p-6 hover:shadow-lg hover:border-buildora-gold/20 transition-all duration-300 cursor-pointer group hover:scale-105"
              role="button"
              tabIndex={0}
              aria-label={`Browse ${category.name} designs`}
            >
              <div className={cn(
                "flex items-center justify-center w-16 h-16 rounded-xl mb-4 transition-all duration-300",
                "bg-gradient-to-br", category.color,
                "group-hover:scale-110"
              )}>
                <category.icon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-card-foreground mb-2">
                {category.name}
              </h3>
              <p className="text-muted-foreground text-sm mb-3 leading-relaxed">
                {category.description}
              </p>
              <span className="text-buildora-gold text-sm font-medium">
                {category.count}
              </span>
            </div>
          ))}
        </div>

        {/* Mobile scroll indicators */}
        <div className="flex justify-center mt-4 space-x-2 md:hidden">
          {categories.map((_, index) => (
            <div
              key={index}
              className="w-2 h-2 bg-muted rounded-full"
            />
          ))}
        </div>
      </div>

      {/* Touch swipe hint for mobile */}
      <p className="text-center text-muted-foreground text-sm mt-4 md:hidden">
        ← Swipe to explore more categories →
      </p>
    </section>
  );
}
