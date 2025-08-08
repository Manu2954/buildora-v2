import { Palette, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

const quickActions = [
  {
    title: "Custom Design",
    description: "Get a personalized design tailored to your style and space",
    icon: Palette,
    buttonText: "Start Designing",
    gradient: "from-blue-500 to-purple-600",
  },
  {
    title: "Book Consultation",
    description: "Schedule a free consultation with our interior design experts",
    icon: Calendar,
    buttonText: "Book Now",
    gradient: "from-green-500 to-teal-600",
  },
];

export function QuickActions() {
  return (
    <section className="px-4 lg:px-6 py-6 lg:py-8">
      <div className="mb-6 lg:mb-8">
        <h2 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">Quick Actions</h2>
        <p className="text-muted-foreground text-lg">Get started with your dream space transformation</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {quickActions.map((action) => (
          <div
            key={action.title}
            className={cn(
              "relative bg-card border border-border rounded-xl p-8 overflow-hidden",
              "hover:shadow-lg hover:border-buildora-gold/20 transition-all duration-300",
              "group cursor-pointer"
            )}
            role="button"
            tabIndex={0}
            aria-label={action.description}
          >
            {/* Background gradient overlay */}
            <div className={cn(
              "absolute inset-0 bg-gradient-to-br opacity-5 group-hover:opacity-10 transition-opacity",
              action.gradient
            )} />
            
            <div className="relative z-10">
              <div className="flex items-center mb-4">
                <div className={cn(
                  "w-12 h-12 rounded-lg flex items-center justify-center mr-4",
                  "bg-gradient-to-br", action.gradient
                )}>
                  <action.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-card-foreground">{action.title}</h3>
              </div>
              
              <p className="text-muted-foreground mb-6 leading-relaxed">
                {action.description}
              </p>
              
              <button 
                className={cn(
                  "inline-flex items-center px-6 py-3 text-white font-medium rounded-lg",
                  "bg-gradient-to-r", action.gradient,
                  "hover:shadow-lg transition-all duration-300",
                  "focus:outline-none focus:ring-4 focus:ring-blue-500/20",
                  "transform hover:scale-105"
                )}
                aria-label={`${action.buttonText} - ${action.description}`}
              >
                {action.buttonText}
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
