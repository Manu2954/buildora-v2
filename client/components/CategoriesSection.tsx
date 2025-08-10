import { Sofa, ChefHat, Bed, Bath } from "lucide-react";
import { cn } from "@/lib/utils";

const categories = [
  {
    name: "Living Room",
    icon: Sofa,
    description: "Comfortable & stylish living spaces",
    count: "240+ designs",
    color: "from-blue-500 to-blue-600",
  },
  {
    name: "Kitchen",
    icon: ChefHat,
    description: "Modern & functional kitchen designs",
    count: "180+ designs",
    color: "from-green-500 to-green-600",
  },
  {
    name: "Bedroom",
    icon: Bed,
    description: "Relaxing & cozy bedroom spaces",
    count: "320+ designs",
    color: "from-purple-500 to-purple-600",
  },
  {
    name: "Bathroom",
    icon: Bath,
    description: "Elegant & spa-like bathrooms",
    count: "150+ designs",
    color: "from-teal-500 to-teal-600",
  },
];

export function CategoriesSection() {
  return (
    <section className="px-4 lg:px-6 py-6 lg:py-8">
      {/* Mobile: Full-width container with rounded top corners */}
      <div className="md:max-w-none max-w-full">
        <div className="mb-6 lg:mb-8 text-center">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#333132] mb-3">
            Design Categories
          </h2>
          <p className="text-[#666666] text-base md:text-lg px-4">
            Explore our curated collections for every space
          </p>
        </div>

        {/* Mobile: Vertical list with horizontal scroll for each category */}
        <div className="md:hidden space-y-4">
          {categories.map((category, index) => (
            <div
              key={category.name}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 cursor-pointer group active:scale-95"
              role="button"
              tabIndex={0}
              aria-label={`Browse ${category.name} designs`}
            >
              <div className="flex items-center space-x-4">
                <div
                  className={cn(
                    "flex items-center justify-center w-16 h-16 rounded-2xl transition-all duration-300",
                    "bg-gradient-to-br",
                    category.color,
                    "group-hover:scale-110 shadow-lg",
                  )}
                >
                  <category.icon className="h-8 w-8 text-white" />
                </div>

                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-[#333132] mb-1">
                    {category.name}
                  </h3>
                  <p className="text-[#666666] text-sm mb-2 leading-relaxed">
                    {category.description}
                  </p>
                  <span className="text-[#c59c46] text-sm font-semibold bg-[#c59c46]/10 px-2 py-1 rounded-lg">
                    {category.count}
                  </span>
                </div>

                <div className="text-[#c59c46] opacity-60 group-hover:opacity-100 transition-opacity">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tablet: 2 columns */}
        <div className="hidden md:grid lg:hidden md:grid-cols-2 gap-6">
          {categories.map((category, index) => (
            <div
              key={category.name}
              className="bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-lg hover:border-[#c59c46]/20 transition-all duration-300 cursor-pointer group hover:scale-105"
              role="button"
              tabIndex={0}
              aria-label={`Browse ${category.name} designs`}
            >
              <div
                className={cn(
                  "flex items-center justify-center w-16 h-16 rounded-xl mb-4 transition-all duration-300",
                  "bg-gradient-to-br",
                  category.color,
                  "group-hover:scale-110",
                )}
              >
                <category.icon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-[#333132] mb-2">
                {category.name}
              </h3>
              <p className="text-[#666666] text-sm mb-3 leading-relaxed">
                {category.description}
              </p>
              <span className="text-[#c59c46] text-sm font-medium">
                {category.count}
              </span>
            </div>
          ))}
        </div>

        {/* Desktop: Grid layout */}
        <div className="hidden lg:grid lg:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <div
              key={category.name}
              className="bg-white border border-gray-100 rounded-xl p-6 hover:shadow-lg hover:border-[#c59c46]/20 transition-all duration-300 cursor-pointer group hover:scale-105"
              role="button"
              tabIndex={0}
              aria-label={`Browse ${category.name} designs`}
            >
              <div
                className={cn(
                  "flex items-center justify-center w-16 h-16 rounded-xl mb-4 transition-all duration-300",
                  "bg-gradient-to-br",
                  category.color,
                  "group-hover:scale-110",
                )}
              >
                <category.icon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-[#333132] mb-2">
                {category.name}
              </h3>
              <p className="text-[#666666] text-sm mb-3 leading-relaxed">
                {category.description}
              </p>
              <span className="text-[#c59c46] text-sm font-medium">
                {category.count}
              </span>
            </div>
          ))}
        </div>

        {/* Mobile swipe hint */}
        <p className="text-center text-[#666666] text-sm mt-6 md:hidden">
          👆 Tap any category to explore designs
        </p>
      </div>
    </section>
  );
}
