import { Sofa, ChefHat, Bed, Bath } from "lucide-react";
import { cn } from "@/lib/utils";

const categories = [
  {
    name: "Living Room",
    icon: Sofa,
    description: "Comfortable & stylish living spaces",
    count: "240+ designs"
  },
  {
    name: "Kitchen",
    icon: ChefHat,
    description: "Modern & functional kitchen designs",
    count: "180+ designs"
  },
  {
    name: "Bedroom",
    icon: Bed,
    description: "Relaxing & cozy bedroom spaces",
    count: "320+ designs"
  },
  {
    name: "Bathroom",
    icon: Bath,
    description: "Elegant & spa-like bathrooms",
    count: "150+ designs"
  },
];

export function CategoriesSection() {
  return (
    <section className="px-4 lg:px-6 py-6 lg:py-8">
      <div className="mb-6 lg:mb-8">
        <h2 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">Design Categories</h2>
        <p className="text-muted-foreground text-lg">Explore our curated collections for every space</p>
      </div>
      
      <div className="flex gap-4 overflow-x-auto pb-4 lg:grid lg:grid-cols-4 lg:overflow-visible">
        {categories.map((category) => (
          <div
            key={category.name}
            className={cn(
              "flex-shrink-0 w-64 lg:w-auto",
              "bg-card border border-border rounded-xl p-6",
              "hover:shadow-lg hover:border-buildora-gold/20 transition-all duration-300",
              "cursor-pointer group"
            )}
            role="button"
            tabIndex={0}
            aria-label={`Browse ${category.name} designs`}
          >
            <div className="flex items-center justify-center w-16 h-16 bg-buildora-gold/10 rounded-xl mb-4 group-hover:bg-buildora-gold/20 transition-colors">
              <category.icon className="h-8 w-8 text-buildora-gold" />
            </div>
            <h3 className="text-xl font-semibold text-card-foreground mb-2">{category.name}</h3>
            <p className="text-muted-foreground text-sm mb-3">{category.description}</p>
            <span className="text-buildora-gold text-sm font-medium">{category.count}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
