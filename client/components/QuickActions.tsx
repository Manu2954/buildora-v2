import { Palette, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

const quickActions = [
  {
    title: "Custom Design",
    description:
      "Get a personalized design tailored to your style and space requirements",
    icon: Palette,
    buttonText: "Start Designing",
    gradient: "from-blue-500 to-purple-600",
    hoverGradient: "from-blue-600 to-purple-700",
    stats: "2000+ custom designs completed",
  },
  {
    title: "Book Consultation",
    description:
      "Schedule a free consultation with our interior design experts today",
    icon: Calendar,
    buttonText: "Book Now",
    gradient: "from-green-500 to-teal-600",
    hoverGradient: "from-green-600 to-teal-700",
    stats: "Available 7 days a week",
  },
];

export function QuickActions() {
  return (
    <section className="px-4 lg:px-6 py-6 lg:py-8">
      <div className="mb-6 lg:mb-8 text-center md:text-left">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-2">
          Quick Actions
        </h2>
        <p className="text-muted-foreground text-base md:text-lg">
          Get started with your dream space transformation
        </p>
      </div>

      {/* Mobile: Stack vertically, Desktop: Side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        {quickActions.map((action) => (
          <div
            key={action.title}
            className={cn(
              "relative bg-card border border-border rounded-xl p-6 md:p-8 overflow-hidden",
              "hover:shadow-lg hover:border-buildora-gold/20 transition-all duration-300",
              "group cursor-pointer min-h-[200px] md:min-h-[240px]",
            )}
            role="button"
            tabIndex={0}
            aria-label={action.description}
          >
            {/* Background gradient overlay */}
            <div
              className={cn(
                "absolute inset-0 bg-gradient-to-br opacity-5 group-hover:opacity-10 transition-opacity",
                action.gradient,
              )}
            />

            <div className="relative z-10 h-full flex flex-col">
              <div className="flex items-start justify-between mb-4">
                <div
                  className={cn(
                    "w-12 h-12 md:w-16 md:h-16 rounded-lg flex items-center justify-center transition-all duration-300",
                    "bg-gradient-to-br",
                    action.gradient,
                    "group-hover:scale-110",
                  )}
                >
                  <action.icon className="h-6 w-6 md:h-8 md:w-8 text-white" />
                </div>

                {/* Stats badge */}
                <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-full">
                  {action.stats}
                </span>
              </div>

              <div className="flex-1">
                <h3 className="text-xl md:text-2xl font-semibold text-card-foreground mb-3">
                  {action.title}
                </h3>

                <p className="text-muted-foreground mb-6 leading-relaxed">
                  {action.description}
                </p>
              </div>

              <button
                className={cn(
                  "w-full md:w-auto inline-flex items-center justify-center px-6 py-3 md:py-4 text-white font-medium rounded-lg transition-all duration-300 min-h-[44px]",
                  "bg-gradient-to-r",
                  action.gradient,
                  "hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-500/20",
                  "transform hover:scale-105 group-hover:from-blue-600 group-hover:to-purple-700",
                )}
                aria-label={`${action.buttonText} - ${action.description}`}
              >
                {action.buttonText}
              </button>
            </div>

            {/* Decorative elements */}
            <div className="absolute top-4 right-4 w-20 h-20 bg-white/5 rounded-full blur-2xl"></div>
            <div className="absolute bottom-4 left-4 w-16 h-16 bg-white/5 rounded-full blur-xl"></div>
          </div>
        ))}
      </div>

      {/* Additional info section */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
        <div className="p-4 bg-muted/30 rounded-lg">
          <h4 className="font-semibold text-foreground mb-1">
            Free Consultation
          </h4>
          <p className="text-sm text-muted-foreground">No hidden charges</p>
        </div>
        <div className="p-4 bg-muted/30 rounded-lg">
          <h4 className="font-semibold text-foreground mb-1">
            Expert Designers
          </h4>
          <p className="text-sm text-muted-foreground">5+ years experience</p>
        </div>
        <div className="p-4 bg-muted/30 rounded-lg">
          <h4 className="font-semibold text-foreground mb-1">Quick Response</h4>
          <p className="text-sm text-muted-foreground">Within 24 hours</p>
        </div>
      </div>
    </section>
  );
}
