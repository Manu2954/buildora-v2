import { Check, Star, ArrowRight, Clock, Users } from "lucide-react";
import { cn } from "@/lib/utils";

const packages = [
  {
    name: "Basic",
    price: 49999,
    originalPrice: 69999,
    description: "Perfect for small spaces and essential design needs",
    popular: false,
    badge: "Most Affordable",
    badgeColor: "bg-green-100 text-green-800",
    features: [
      "Space planning & layout",
      "Color consultation",
      "Furniture recommendations",
      "Basic lighting design",
      "2 revision rounds",
      "Digital mood board",
      "Shopping list with links",
      "Email support",
    ],
    timeline: "14-21 days",
    spaces: "1-2 rooms",
    team: "1 Designer",
  },
  {
    name: "Premium",
    price: 99999,
    originalPrice: 129999,
    description: "Comprehensive design with premium materials and execution",
    popular: true,
    badge: "Most Popular",
    badgeColor: "bg-buildora-gold text-white",
    features: [
      "Everything in Basic",
      "Custom furniture design",
      "Premium material sourcing",
      "Project management",
      "Site supervision",
      "3D visualization",
      "Unlimited revisions",
      "Installation coordination",
      "Quality assurance",
      "Phone & email support",
    ],
    timeline: "21-35 days",
    spaces: "3-4 rooms",
    team: "2 Designers + PM",
  },
  {
    name: "Luxury",
    price: 199999,
    originalPrice: 249999,
    description: "Complete luxury transformation with dedicated project team",
    popular: false,
    badge: "Premium Choice",
    badgeColor: "bg-purple-100 text-purple-800",
    features: [
      "Everything in Premium",
      "Dedicated project manager",
      "Luxury brand partnerships",
      "Custom artwork curation",
      "Smart home integration",
      "Landscape design",
      "Post-completion support",
      "Warranty & maintenance",
      "Priority support",
      "24/7 helpline",
    ],
    timeline: "35-50 days",
    spaces: "Full home",
    team: "3 Designers + Dedicated PM",
  },
];

export function PackagesSection() {
  return (
    <section className="px-4 lg:px-6 py-8 lg:py-12 bg-gradient-to-br from-background to-muted/20">
      <div className="text-center mb-8 lg:mb-12">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
          Choose Your Package
        </h2>
        <p className="text-muted-foreground text-base md:text-lg lg:text-xl max-w-3xl mx-auto">
          From basic design guidance to complete luxury transformation, we have
          the perfect package for your needs and budget
        </p>
      </div>

      {/* Mobile: Stack vertically, Desktop: Grid layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 max-w-7xl mx-auto">
        {packages.map((pkg) => (
          <div
            key={pkg.name}
            className={cn(
              "relative bg-card border rounded-2xl p-6 md:p-8 hover:shadow-xl transition-all duration-300",
              "flex flex-col",
              pkg.popular
                ? "border-buildora-gold ring-2 ring-buildora-gold/20 lg:scale-105 lg:z-10"
                : "border-border hover:border-buildora-gold/30",
            )}
          >
            {/* Badge */}
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <div
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium flex items-center shadow-lg",
                  pkg.badgeColor,
                )}
              >
                {pkg.popular && <Star className="h-4 w-4 mr-1 fill-current" />}
                {pkg.badge}
              </div>
            </div>

            {/* Header */}
            <div className="text-center mb-6 mt-4">
              <h3 className="text-2xl md:text-3xl font-bold text-card-foreground mb-2">
                {pkg.name}
              </h3>
              <p className="text-muted-foreground mb-4 leading-relaxed">
                {pkg.description}
              </p>

              {/* Pricing */}
              <div className="mb-4">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <span className="text-3xl md:text-4xl lg:text-5xl font-bold text-buildora-gold">
                    ₹{pkg.price.toLocaleString()}
                  </span>
                  {pkg.originalPrice && (
                    <span className="text-lg text-muted-foreground line-through">
                      ₹{pkg.originalPrice.toLocaleString()}
                    </span>
                  )}
                </div>
                <span className="text-muted-foreground text-sm">
                  starting from
                </span>

                {/* Package details */}
                <div className="grid grid-cols-3 gap-2 mt-4 text-xs md:text-sm">
                  <div className="flex flex-col items-center p-2 bg-muted/30 rounded-lg">
                    <Clock className="h-4 w-4 text-buildora-gold mb-1" />
                    <span className="font-medium">{pkg.timeline}</span>
                  </div>
                  <div className="flex flex-col items-center p-2 bg-muted/30 rounded-lg">
                    <span className="text-lg mb-1">🏠</span>
                    <span className="font-medium">{pkg.spaces}</span>
                  </div>
                  <div className="flex flex-col items-center p-2 bg-muted/30 rounded-lg">
                    <Users className="h-4 w-4 text-buildora-gold mb-1" />
                    <span className="font-medium text-center leading-tight">
                      {pkg.team}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="flex-1 mb-6">
              <h4 className="font-semibold text-card-foreground mb-4">
                What's included:
              </h4>
              <div className="space-y-3">
                {pkg.features.map((feature, index) => (
                  <div key={index} className="flex items-start">
                    <Check className="h-4 w-4 md:h-5 md:w-5 text-buildora-gold mt-0.5 mr-3 flex-shrink-0" />
                    <span className="text-card-foreground text-sm md:text-base leading-relaxed">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA Button */}
            <button
              className={cn(
                "w-full py-3 md:py-4 px-6 rounded-xl font-semibold transition-all duration-300 min-h-[44px]",
                "focus:outline-none focus:ring-4 flex items-center justify-center",
                pkg.popular
                  ? "bg-buildora-gold text-white hover:bg-buildora-gold-dark focus:ring-buildora-gold/20 hover:scale-105"
                  : "bg-card-foreground text-card hover:bg-card-foreground/90 focus:ring-card-foreground/20",
              )}
              aria-label={`View details for ${pkg.name} package`}
            >
              View Details
              <ArrowRight className="ml-2 h-4 w-4" />
            </button>

            {/* Savings indicator */}
            {pkg.originalPrice && (
              <div className="text-center mt-3">
                <span className="text-green-600 text-sm font-medium">
                  Save ₹{(pkg.originalPrice - pkg.price).toLocaleString()}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Bottom CTA */}
      <div className="text-center mt-8 lg:mt-12">
        <p className="text-muted-foreground mb-4">
          Not sure which package is right for you?
        </p>
        <button className="inline-flex items-center px-6 py-3 bg-buildora-gold text-white font-medium rounded-lg hover:bg-buildora-gold-dark transition-colors">
          Get Free Consultation
          <ArrowRight className="ml-2 h-4 w-4" />
        </button>
      </div>
    </section>
  );
}
