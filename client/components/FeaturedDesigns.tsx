import { useState } from "react";
import {
  Star,
  Heart,
  Calendar,
  ArrowRight,
  Filter,
  SlidersHorizontal,
} from "lucide-react";
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
    style: "Modern",
    budget: "Premium",
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
    style: "Luxury",
    budget: "Luxury",
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
    style: "Traditional",
    budget: "Basic",
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
    style: "Modern",
    budget: "Premium",
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
    style: "Contemporary",
    budget: "Basic",
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
    style: "Traditional",
    budget: "Premium",
  },
];

const filterOptions = {
  categories: [
    "All",
    "Living Room",
    "Kitchen",
    "Bedroom",
    "Bathroom",
    "Study Room",
    "Dining Room",
  ],
  budgets: ["All", "Basic", "Premium", "Luxury"],
  styles: ["All", "Modern", "Traditional", "Contemporary", "Luxury"],
};

export function xFeaturedDesigns() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedBudget, setSelectedBudget] = useState("All");
  const [selectedStyle, setSelectedStyle] = useState("All");
  const [showFilters, setShowFilters] = useState(false);
  const [wishlistedItems, setWishlistedItems] = useState(
    new Set(featuredDesigns.filter((d) => d.isWishlisted).map((d) => d.id)),
  );

  const toggleWishlist = (id: number) => {
    const newWishlisted = new Set(wishlistedItems);
    if (newWishlisted.has(id)) {
      newWishlisted.delete(id);
    } else {
      newWishlisted.add(id);
    }
    setWishlistedItems(newWishlisted);
  };

  const filteredDesigns = featuredDesigns.filter((design) => {
    return (
      (selectedCategory === "All" || design.category === selectedCategory) &&
      (selectedBudget === "All" || design.budget === selectedBudget) &&
      (selectedStyle === "All" || design.style === selectedStyle)
    );
  });

  return (
    <section className="px-4 lg:px-6 py-6 lg:py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 lg:mb-8">
        <div className="mb-4 sm:mb-0">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-2">
            Featured Designs
          </h2>
          <p className="text-muted-foreground text-base md:text-lg">
            Handpicked designs from our expert curators
          </p>
        </div>
        <button
          className="inline-flex items-center text-buildora-gold hover:text-buildora-gold-dark font-medium transition-colors text-sm md:text-base"
          aria-label="View all featured designs"
        >
          See All
          <ArrowRight className="ml-1 h-4 w-4" />
        </button>
      </div>

      {/* Filters */}
      <div className="mb-6">
        {/* Mobile Filter Toggle */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="md:hidden flex items-center justify-center w-full py-3 px-4 bg-muted text-foreground rounded-lg font-medium mb-4"
        >
          <Filter className="h-4 w-4 mr-2" />
          Filters
          <SlidersHorizontal className="h-4 w-4 ml-2" />
        </button>

        {/* Filter Options */}
        <div
          className={cn(
            "space-y-4 md:space-y-0 md:flex md:space-x-6",
            showFilters ? "block" : "hidden md:flex",
          )}
        >
          {/* Category Filter */}
          <div className="flex flex-col space-y-2">
            <label className="text-sm font-medium text-foreground">
              Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-buildora-gold focus:border-transparent min-h-[44px]"
            >
              {filterOptions.categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* Budget Filter */}
          <div className="flex flex-col space-y-2">
            <label className="text-sm font-medium text-foreground">
              Budget
            </label>
            <select
              value={selectedBudget}
              onChange={(e) => setSelectedBudget(e.target.value)}
              className="px-3 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-buildora-gold focus:border-transparent min-h-[44px]"
            >
              {filterOptions.budgets.map((budget) => (
                <option key={budget} value={budget}>
                  {budget}
                </option>
              ))}
            </select>
          </div>

          {/* Style Filter */}
          <div className="flex flex-col space-y-2">
            <label className="text-sm font-medium text-foreground">Style</label>
            <select
              value={selectedStyle}
              onChange={(e) => setSelectedStyle(e.target.value)}
              className="px-3 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-buildora-gold focus:border-transparent min-h-[44px]"
            >
              {filterOptions.styles.map((style) => (
                <option key={style} value={style}>
                  {style}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Results count */}
      <p className="text-sm text-muted-foreground mb-4">
        Showing {filteredDesigns.length} of {featuredDesigns.length} designs
      </p>

      {/* Design Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {filteredDesigns.map((design) => (
          <div
            key={design.id}
            className={cn(
              "bg-card rounded-xl border border-border overflow-hidden",
              "hover:shadow-lg hover:border-buildora-gold/20 transition-all duration-300",
              "group cursor-pointer",
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
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleWishlist(design.id);
                  }}
                  className={cn(
                    "w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-colors min-h-[44px]",
                    wishlistedItems.has(design.id)
                      ? "bg-buildora-gold text-white"
                      : "bg-white/90 text-gray-600 hover:bg-white",
                  )}
                  aria-label={
                    wishlistedItems.has(design.id)
                      ? "Remove from wishlist"
                      : "Add to wishlist"
                  }
                >
                  <Heart
                    className={cn(
                      "h-5 w-5",
                      wishlistedItems.has(design.id) && "fill-current",
                    )}
                  />
                </button>
              </div>
              <div className="absolute bottom-3 left-3">
                <span className="bg-buildora-gold text-white text-xs font-medium px-2 py-1 rounded-md">
                  {design.category}
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="p-4 md:p-5">
              <h3 className="text-lg md:text-xl font-semibold text-card-foreground mb-2 line-clamp-2">
                {design.title}
              </h3>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-3">
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="text-sm font-medium text-foreground ml-1">
                    {design.rating}
                  </span>
                </div>
                <span className="text-sm text-muted-foreground">
                  ({design.reviews} reviews)
                </span>
              </div>

              {/* Price and Duration */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <span className="text-lg md:text-xl font-bold text-buildora-gold">
                    ₹{design.price.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4 mr-1" />
                  {design.duration} days
                </div>
              </div>

              {/* Mobile CTA Button */}
              <button className="w-full mt-4 py-3 px-4 bg-buildora-gold text-white font-medium rounded-lg hover:bg-buildora-gold-dark transition-colors md:hidden min-h-[44px]">
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* No results message */}
      {filteredDesigns.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg mb-4">
            No designs found matching your filters
          </p>
          <button
            onClick={() => {
              setSelectedCategory("All");
              setSelectedBudget("All");
              setSelectedStyle("All");
            }}
            className="text-buildora-gold hover:text-buildora-gold-dark font-medium"
          >
            Clear all filters
          </button>
        </div>
      )}
    </section>
  );
}
