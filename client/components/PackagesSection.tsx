import { Check, Star } from "lucide-react";
import { cn } from "@/lib/utils";

const packages = [
  {
    name: "Basic",
    price: 49999,
    description: "Perfect for small spaces and essential design needs",
    popular: false,
    features: [
      "Space planning & layout",
      "Color consultation",
      "Furniture recommendations", 
      "Basic lighting design",
      "2 revision rounds",
      "Digital mood board",
      "Shopping list with links",
    ],
    timeline: "14-21 days",
    spaces: "1-2 rooms",
  },
  {
    name: "Premium",
    price: 99999,
    description: "Comprehensive design with premium materials and execution",
    popular: true,
    features: [
      "Everything in Basic",
      "Custom furniture design",
      "Premium material sourcing",
      "Project management",
      "Site supervision",
      "3D visualization",
      "Unlimited revisions",
      "Installation coordination",
    ],
    timeline: "21-35 days",
    spaces: "3-4 rooms",
  },
  {
    name: "Luxury",
    price: 199999,
    description: "Complete luxury transformation with dedicated project team",
    popular: false,
    features: [
      "Everything in Premium",
      "Dedicated project manager",
      "Luxury brand partnerships",
      "Custom artwork curation",
      "Smart home integration",
      "Landscape design",
      "Post-completion support",
      "Warranty & maintenance",
    ],
    timeline: "35-50 days",
    spaces: "Full home",
  },
];

export function PackagesSection() {
  return (
    <section className="px-6 py-12 bg-gradient-to-br from-background to-muted/20">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-foreground mb-4">Choose Your Package</h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          From basic design guidance to complete luxury transformation, we have the perfect package for your needs
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {packages.map((pkg) => (
          <div
            key={pkg.name}
            className={cn(
              "relative bg-card border rounded-2xl p-8 hover:shadow-xl transition-all duration-300",
              pkg.popular 
                ? "border-buildora-gold ring-2 ring-buildora-gold/20 scale-105" 
                : "border-border hover:border-buildora-gold/30"
            )}
          >
            {pkg.popular && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <div className="bg-buildora-gold text-white px-4 py-2 rounded-full text-sm font-medium flex items-center">
                  <Star className="h-4 w-4 mr-1 fill-current" />
                  Most Popular
                </div>
              </div>
            )}

            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-card-foreground mb-2">{pkg.name}</h3>
              <p className="text-muted-foreground mb-4">{pkg.description}</p>
              <div className="mb-4">
                <span className="text-4xl font-bold text-buildora-gold">₹{pkg.price.toLocaleString()}</span>
                <span className="text-muted-foreground ml-2">starting from</span>
              </div>
              <div className="flex justify-center gap-4 text-sm text-muted-foreground">
                <span>📅 {pkg.timeline}</span>
                <span>🏠 {pkg.spaces}</span>
              </div>
            </div>

            <div className="space-y-4 mb-8">
              {pkg.features.map((feature, index) => (
                <div key={index} className="flex items-start">
                  <Check className="h-5 w-5 text-buildora-gold mt-0.5 mr-3 flex-shrink-0" />
                  <span className="text-card-foreground text-sm">{feature}</span>
                </div>
              ))}
            </div>

            <button 
              className={cn(
                "w-full py-3 px-6 rounded-xl font-semibold transition-all duration-300",
                "focus:outline-none focus:ring-4",
                pkg.popular
                  ? "bg-buildora-gold text-white hover:bg-buildora-gold-dark focus:ring-buildora-gold/20"
                  : "bg-card-foreground text-card hover:bg-card-foreground/90 focus:ring-card-foreground/20"
              )}
              aria-label={`View details for ${pkg.name} package`}
            >
              View Details
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
