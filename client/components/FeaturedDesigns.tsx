import { Star, Heart, Calendar, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const featuredDesigns = [
  {
    id: 1,
    title: "Modern Minimalist Living",
    category: "Living Room",
    image: "/placeholder.svg",
    rating: 4.8,
    reviews: 124,
    price: 89999,
    duration: 21,
    isWishlisted: false,
  },
  {
    id: 2,
    title: "Luxury Kitchen Design",
    category: "Kitchen",
    image: "/placeholder.svg",
    rating: 4.9,
    reviews: 98,
    price: 145000,
    duration: 28,
    isWishlisted: true,
  },
  {
    id: 3,
    title: "Cozy Bedroom Retreat",
    category: "Bedroom",
    image: "/placeholder.svg",
    rating: 4.7,
    reviews: 156,
    price: 67500,
    duration: 18,
    isWishlisted: false,
  },
  {
    id: 4,
    title: "Spa-like Bathroom",
    category: "Bathroom",
    image: "/placeholder.svg",
    rating: 4.9,
    reviews: 89,
    price: 78000,
    duration: 15,
    isWishlisted: false,
  },
  {
    id: 5,
    title: "Contemporary Study",
    category: "Study Room",
    image: "/placeholder.svg",
    rating: 4.6,
    reviews: 67,
    price: 55000,
    duration: 14,
    isWishlisted: true,
  },
  {
    id: 6,
    title: "Family Dining Space",
    category: "Dining Room",
    image: "/placeholder.svg",
    rating: 4.8,
    reviews: 112,
    price: 92000,
    duration: 20,
    isWishlisted: false,
  },
];

export function FeaturedDesigns() {
  return (
    <section className="px-6 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-foreground mb-2">Featured Designs</h2>
          <p className="text-muted-foreground text-lg">Handpicked designs from our expert curators</p>
        </div>
        <button 
          className="inline-flex items-center text-buildora-gold hover:text-buildora-gold-dark font-medium transition-colors"
          aria-label="View all featured designs"
        >
          See All
          <ArrowRight className="ml-1 h-4 w-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {featuredDesigns.map((design) => (
          <div
            key={design.id}
            className={cn(
              "bg-card rounded-xl border border-border overflow-hidden",
              "hover:shadow-lg hover:border-buildora-gold/20 transition-all duration-300",
              "group cursor-pointer"
            )}
            role="button"
            tabIndex={0}
            aria-label={`View ${design.title} design details`}
          >
            {/* Image */}
            <div className="relative aspect-[4/3] overflow-hidden">
              <img
                src={design.image}
                alt={design.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-3 right-3">
                <button 
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center transition-colors",
                    design.isWishlisted 
                      ? "bg-buildora-gold text-white" 
                      : "bg-white/90 text-gray-600 hover:bg-white"
                  )}
                  aria-label={design.isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                >
                  <Heart className={cn("h-5 w-5", design.isWishlisted && "fill-current")} />
                </button>
              </div>
              <div className="absolute bottom-3 left-3">
                <span className="bg-buildora-gold text-white text-xs font-medium px-2 py-1 rounded-md">
                  {design.category}
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="p-5">
              <h3 className="text-lg font-semibold text-card-foreground mb-2 line-clamp-1">
                {design.title}
              </h3>
              
              {/* Rating */}
              <div className="flex items-center gap-2 mb-3">
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="text-sm font-medium text-foreground ml-1">{design.rating}</span>
                </div>
                <span className="text-sm text-muted-foreground">({design.reviews} reviews)</span>
              </div>

              {/* Price and Duration */}
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-lg font-bold text-buildora-gold">
                    ₹{design.price.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4 mr-1" />
                  {design.duration} days
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
