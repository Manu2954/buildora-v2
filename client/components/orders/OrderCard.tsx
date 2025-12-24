import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

export interface OrderItem {
  id: string;
  address: string;
  type: string;
  startDate: string;
  completionDate: string;
  status: string;
  thumbnail: string;
}

export function OrderCard({ item }: { item: OrderItem }) {
  const statusVariant =
    item.status === "Completed"
      ? "default"
      : item.status === "Cancelled"
      ? "destructive"
      : "secondary";

  return (
    <div className="bg-white rounded-[24px] shadow-[0_6px_20px_rgba(0,0,0,0.08)] overflow-hidden border border-[#D9D9D9]">
      <div className="relative">
        <img
          src={item.thumbnail}
          alt={`${item.type} preview`}
          loading="lazy"
          className="w-full h-40 object-cover"
        />
        <div className="absolute top-3 left-3">
          <Badge variant={statusVariant as any} className="rounded-full">
            {item.status}
          </Badge>
        </div>
      </div>
      <div className="p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-[#333132]">Project {item.id}</h3>
          <span className="text-sm text-[#666666]">{item.type}</span>
        </div>
        <div className="space-y-1.5 text-sm">
          <p className="text-[#666666]"><span className="text-[#333132] font-medium">Site:</span> {item.address}</p>
          <p className="text-[#666666]"><span className="text-[#333132] font-medium">Start:</span> {item.startDate}</p>
          <p className="text-[#666666]"><span className="text-[#333132] font-medium">ETA:</span> {item.completionDate}</p>
        </div>
        <div className="mt-4">
          <Button asChild className="w-full rounded-xl bg-[#C69B4B] hover:bg-[#B1873E]">
            <Link to={`/project/${item.id}`} aria-label={`View details for project ${item.id}`}>
              View Details
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
