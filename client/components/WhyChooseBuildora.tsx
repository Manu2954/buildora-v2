import {
  Clock,
  Award,
  Gem,
  Gift,
  Shield,
  Users,
  Truck,
  HeartHandshake,
} from "lucide-react";
import { cn } from "@/lib/utils";

const reasons = [
  {
    icon: Clock,
    title: "On-Time Completion",
    description:
      "We guarantee project completion within agreed timelines with no delays",
    stat: "98% on-time delivery",
    color: "from-blue-500 to-blue-600",
  },
  {
    icon: Award,
    title: "Skilled Craftsmen",
    description:
      "Expert artisans with 10+ years of experience in premium interior work",
    stat: "500+ certified craftsmen",
    color: "from-green-500 to-green-600",
  },
  {
    icon: Gem,
    title: "Quality Materials",
    description:
      "Premium quality materials sourced from trusted brands and suppliers",
    stat: "100+ brand partnerships",
    color: "from-purple-500 to-purple-600",
  },
  {
    icon: Gift,
    title: "Loyalty Benefits",
    description:
      "Exclusive rewards, discounts, and priority service for returning customers",
    stat: "Up to 15% rewards",
    color: "from-orange-500 to-orange-600",
  },
  {
    icon: Shield,
    title: "Quality Assurance",
    description:
      "Comprehensive warranty and quality checks at every stage of the project",
    stat: "2-year warranty",
    color: "from-red-500 to-red-600",
  },
  {
    icon: Users,
    title: "Expert Team",
    description:
      "Dedicated project managers and designers for personalized attention",
    stat: "50+ design experts",
    color: "from-teal-500 to-teal-600",
  },
  {
    icon: Truck,
    title: "End-to-End Service",
    description:
      "From design to installation, we handle everything for a hassle-free experience",
    stat: "Complete project management",
    color: "from-indigo-500 to-indigo-600",
  },
  {
    icon: HeartHandshake,
    title: "Customer Satisfaction",
    description:
      "Our priority is your happiness with personalized service and support",
    stat: "4.8/5 customer rating",
    color: "from-pink-500 to-pink-600",
  },
];

export function WhyChooseBuildora() {
  return (
    <section className="px-4 lg:px-6 py-8 lg:py-12 bg-muted/20">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8 lg:mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Why Choose Buildora?
          </h2>
          <p className="text-muted-foreground text-base md:text-lg lg:text-xl max-w-3xl mx-auto">
            Experience the difference with our commitment to excellence,
            quality, and customer satisfaction
          </p>
        </div>

        {/* Mobile: Single column, Tablet: 2 columns, Desktop: 4 columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {reasons.map((reason, index) => (
            <div
              key={reason.title}
              className={cn(
                "bg-card border border-border rounded-xl p-6 text-center",
                "hover:shadow-lg hover:border-buildora-gold/20 transition-all duration-300",
                "group cursor-pointer hover:scale-105",
              )}
            >
              {/* Icon */}
              <div
                className={cn(
                  "w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 rounded-full flex items-center justify-center transition-all duration-300",
                  "bg-gradient-to-br",
                  reason.color,
                  "group-hover:scale-110",
                )}
              >
                <reason.icon className="h-8 w-8 md:h-10 md:w-10 text-white" />
              </div>

              {/* Content */}
              <h3 className="text-lg md:text-xl font-semibold text-card-foreground mb-3">
                {reason.title}
              </h3>

              <p className="text-muted-foreground text-sm md:text-base mb-4 leading-relaxed">
                {reason.description}
              </p>

              {/* Stat */}
              <div
                className={cn(
                  "inline-block px-3 py-1 rounded-full text-xs md:text-sm font-medium",
                  "bg-gradient-to-r",
                  reason.color,
                  "text-white",
                )}
              >
                {reason.stat}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom section with testimonial or additional info */}
        <div className="mt-12 lg:mt-16 text-center">
          <div className="bg-card border border-border rounded-2xl p-6 md:p-8 lg:p-12 max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8">
              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 md:gap-6 w-full md:w-auto">
                <div className="text-center">
                  <div className="text-2xl md:text-3xl lg:text-4xl font-bold text-buildora-gold">
                    2000+
                  </div>
                  <div className="text-sm md:text-base text-muted-foreground">
                    Projects Completed
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl md:text-3xl lg:text-4xl font-bold text-buildora-gold">
                    5000+
                  </div>
                  <div className="text-sm md:text-base text-muted-foreground">
                    Happy Customers
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl md:text-3xl lg:text-4xl font-bold text-buildora-gold">
                    15+
                  </div>
                  <div className="text-sm md:text-base text-muted-foreground">
                    Cities Served
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div className="hidden md:block w-px h-20 bg-border"></div>
              <div className="md:hidden w-20 h-px bg-border"></div>

              {/* CTA */}
              <div className="text-center md:text-left">
                <h4 className="text-xl md:text-2xl font-bold text-card-foreground mb-2">
                  Ready to Transform Your Space?
                </h4>
                <p className="text-muted-foreground mb-4">
                  Join thousands of satisfied customers
                </p>
                <button className="bg-buildora-gold text-white px-6 py-3 rounded-lg font-medium hover:bg-buildora-gold-dark transition-colors min-h-[44px]">
                  Get Started Today
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
