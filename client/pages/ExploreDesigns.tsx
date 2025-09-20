import { useQuery } from "@tanstack/react-query";
import { listDesigns } from "@/lib/designs";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function ExploreDesigns() {
  const { data, isLoading, isError, error } = useQuery({ queryKey: ["designs"], queryFn: () => listDesigns({ page: 1, pageSize: 24 }) });
  if (isLoading) return <div className="p-6">Loading designs...</div>;
  if (isError) return <div className="p-6 text-red-600">{(error as Error).message}</div>;
  const items = data?.items || [];
  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">Explore Designs</h1>
        <div className="text-sm text-muted-foreground">{data?.total ?? 0} results</div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {items.map((d) => (
          <div key={d.id} className="rounded-lg border bg-card text-card-foreground overflow-hidden">
            <img src={d.images?.[0] || "https://placehold.co/800x500"} alt={d.title} className="w-full h-40 object-cover" />
            <div className="p-4 space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">{d.title}</h3>
                <Badge variant="secondary">{d.budget}</Badge>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2">{d.description}</p>
              <div className="flex items-center justify-between text-sm">
                <span>Base: ₹{(d.basePriceCents / 100).toLocaleString()}</span>
                {d.durationDays ? <span>{d.durationDays} days</span> : null}
              </div>
              <div className="flex gap-2 pt-2">
                <Button asChild size="sm" variant="default"><Link to={`/designs/${d.id}`}>Customize & Add</Link></Button>
                <Button asChild size="sm" variant="outline"><Link to={`/designs/${d.id}`}>View</Link></Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

