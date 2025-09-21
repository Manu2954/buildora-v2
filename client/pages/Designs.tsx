import React from "react";
import { Link } from "react-router-dom";
import { featuredDesigns } from "@/components/FeaturedDesigns";
import { Star, Calendar, Heart } from "lucide-react";

export default function Designs() {
  return (
    <div className="container py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Explore Designs</h1>
          <p className="text-muted-foreground mt-1">Browse all available interior designs</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {featuredDesigns.map((design) => (
          <Link
            key={design.id}
            to={`/designs/${design.id}`}
            className="bg-card rounded-xl border border-border overflow-hidden hover:shadow-lg hover:border-buildora-gold/20 transition-all duration-300"
          >
            <div className="relative aspect-[4/3] overflow-hidden">
              <img src={design.image} alt={design.title} className="w-full h-full object-cover" />
              <div className="absolute top-3 right-3">
                <button
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    design.isWishlisted ? "bg-buildora-gold text-white" : "bg-white/90 text-gray-600"
                  }`}
                  aria-label="wishlist"
                >
                  <Heart className="h-5 w-5" />
                </button>
              </div>
              <div className="absolute bottom-3 left-3">
                <span className="bg-buildora-gold text-white text-xs font-medium px-2 py-1 rounded-md">{design.category}</span>
              </div>
            </div>

            <div className="p-4 md:p-5">
              <h3 className="text-lg md:text-xl font-semibold text-card-foreground mb-2 line-clamp-2">{design.title}</h3>

              <div className="flex items-center gap-2 mb-3">
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="text-sm font-medium text-foreground ml-1">{design.rating}</span>
                </div>
                <span className="text-sm text-muted-foreground">({design.reviews} reviews)</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-buildora-gold">₹{design.price.toLocaleString()}</span>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4 mr-1" />
                  {design.duration} days
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
