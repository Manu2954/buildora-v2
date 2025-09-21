import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { featuredDesigns } from "@/components/FeaturedDesigns";
import { Star, Heart } from "lucide-react";

export default function DesignDetail() {
  const { id } = useParams();
  const nav = useNavigate();
  const designId = Number(id);
  const design = featuredDesigns.find((d) => d.id === designId);

  const [isWishlisted, setIsWishlisted] = useState<boolean>(!!design?.isWishlisted);
  const [selectedSize, setSelectedSize] = useState<string>("Medium");

  if (!design) {
    return (
      <div className="container py-12">
        <h2 className="text-xl font-semibold">Design not found</h2>
        <p className="mt-2 text-muted-foreground">The design you are looking for does not exist.</p>
        <div className="mt-4">
          <button onClick={() => nav(-1)} className="py-2 px-4 bg-buildora-gold text-white rounded">Go Back</button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{design.title}</h1>
          <p className="text-muted-foreground mt-1">{design.style} • {design.category}</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsWishlisted((s) => !s)}
            className={`inline-flex items-center gap-2 py-2 px-3 rounded-lg ${isWishlisted ? "bg-buildora-gold text-white" : "bg-card border border-border"}`}
          >
            <Heart className="h-5 w-5" />
            {isWishlisted ? "Wishlisted" : "Add to Wishlist"}
          </button>

          <Link to="/designs" className="text-sm text-muted-foreground">Back to designs</Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <img src={design.image} alt={design.title} className="w-full h-[480px] object-cover" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* 3D render placeholder */}
            <div className="bg-card border border-border rounded-lg p-4 flex flex-col items-center justify-center">
              <div className="w-full h-40 bg-muted rounded-md flex items-center justify-center">3D Render Placeholder</div>
              <p className="mt-3 text-sm text-muted-foreground">Interactive 3D model will appear here</p>
            </div>

            {/* Video placeholder */}
            <div className="bg-card border border-border rounded-lg p-4 flex flex-col items-center justify-center">
              <div className="w-full h-40 bg-muted rounded-md flex items-center justify-center">Video Preview</div>
              <p className="mt-3 text-sm text-muted-foreground">Video walkthrough</p>
            </div>

            {/* Materials table */}
            <div className="bg-card border border-border rounded-lg p-4">
              <h3 className="font-semibold mb-3">Materials Used</h3>
              <div className="overflow-auto max-h-40">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="text-muted-foreground">
                      <th className="py-2">Material Type</th>
                      <th className="py-2">Detail</th>
                    </tr>
                  </thead>
                  <tbody>
                    {design.materials?.map((m, i) => (
                      <tr key={i} className="border-t border-border">
                        <td className="py-2">{m.type}</td>
                        <td className="py-2">{m.detail ?? "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-4">
            <h3 className="font-semibold mb-2">Description</h3>
            <p className="text-muted-foreground">{design.description}</p>
          </div>
        </div>

        <aside className="space-y-4">
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-400" />
                <div>
                  <div className="font-semibold">{design.rating}</div>
                  <div className="text-sm text-muted-foreground">{design.reviews} reviews</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-buildora-gold">₹{design.price.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">{design.duration} days</div>
              </div>
            </div>

            <div className="mt-4">
              <label className="text-sm font-medium">Recommended room size</label>
              <select value={selectedSize} onChange={(e) => setSelectedSize(e.target.value)} className="w-full mt-2 px-3 py-2 border border-input rounded-md bg-background">
                <option>Small</option>
                <option>Medium</option>
                <option>Large</option>
                <option>Extra Large</option>
              </select>
            </div>

            <div className="mt-4">
              <button className="w-full py-3 bg-buildora-gold text-white rounded-md">Add to Project</button>
            </div>

            <div className="mt-3">
              <button className="w-full py-3 border border-border rounded-md">Request Quote</button>
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-4">
            <h4 className="font-semibold mb-2">Design Code</h4>
            <div className="text-muted-foreground">{design.code ?? "N/A"}</div>

            <h4 className="font-semibold mt-4 mb-2">Budget</h4>
            <div className="text-muted-foreground">{design.budget}</div>

            <h4 className="font-semibold mt-4 mb-2">Style</h4>
            <div className="text-muted-foreground">{design.style}</div>
          </div>

          <div className="bg-card border border-border rounded-lg p-4">
            <h4 className="font-semibold mb-2">Customer Reviews</h4>
            <div className="text-sm text-muted-foreground">No reviews yet</div>
          </div>
        </aside>
      </div>
    </div>
  );
}
