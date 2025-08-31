import { Sidebar } from "@/components/Sidebar";
import { Footer } from "@/components/Footer";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { useSidebar } from "@/contexts/SidebarContext";
import { HeroBanner } from "@/components/orders/HeroBanner";
import { FiltersBar, StatusFilter, TypeFilter } from "@/components/orders/FiltersBar";
import { OrderCard, type OrderItem } from "@/components/orders/OrderCard";
import { useMemo, useState } from "react";

const heroImg =
  "https://images.unsplash.com/photo-1505691723518-36a5ac3b2aa5?q=80&w=1600&auto=format&fit=crop";

const ORDERS: OrderItem[] = [
  {
    id: "BE-10234",
    address: "Sunshine Residency, Andheri West, Mumbai",
    type: "Apartment",
    startDate: "2024-06-15",
    completionDate: "2024-11-30",
    status: "In Progress",
    thumbnail:
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "BE-10198",
    address: "Lakeview Villa, Powai, Mumbai",
    type: "Villa",
    startDate: "2024-03-02",
    completionDate: "2024-09-10",
    status: "Execution",
    thumbnail:
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "BE-10076",
    address: "Orion Tech Park, BKC, Mumbai",
    type: "Commercial",
    startDate: "2023-11-20",
    completionDate: "2024-02-25",
    status: "Completed",
    thumbnail:
      "https://images.unsplash.com/photo-1538688525198-9b88f6f53126?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "BE-10301",
    address: "Green Heights, Thane",
    type: "Apartment",
    startDate: "2024-07-05",
    completionDate: "2024-12-20",
    status: "Quotation Pending",
    thumbnail:
      "https://images.unsplash.com/photo-1501045661006-fcebe0257c3f?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "BE-10322",
    address: "Maple Woods, Navi Mumbai",
    type: "Apartment",
    startDate: "2024-08-01",
    completionDate: "2025-01-15",
    status: "Material Procurement",
    thumbnail:
      "https://images.unsplash.com/photo-1502672023488-70e25813eb80?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "BE-09987",
    address: "Seaside Promenade, Juhu",
    type: "Villa",
    startDate: "2023-08-18",
    completionDate: "2024-01-20",
    status: "Cancelled",
    thumbnail:
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?q=80&w=1200&auto=format&fit=crop",
  },
];

export default function Orders() {
  const { isCollapsed, toggle } = useSidebar();

  const [status, setStatus] = useState<StatusFilter>("All");
  const [type, setType] = useState<TypeFilter>("All");

  const filtered = useMemo(() => {
    return ORDERS.filter((o) =>
      (status === "All" || o.status === status) && (type === "All" || o.type === type),
    );
  }, [status, type]);

  return (
    <div className="min-h-screen bg-[#E8E8E8]">
      <div className="pt-24 md:pt-16">
        <div className="flex">
          <div className="hidden xl:block">
            <Sidebar isCollapsed={isCollapsed} onToggle={toggle} />
          </div>

          <main className={`flex-1 transition-all duration-300 ease-in-out ${isCollapsed ? "xl:ml-16" : "xl:ml-[220px]"}`}>
            <div className="max-w-[960px] mx-auto px-4 md:px-6 lg:px-0 pb-24">
              <HeroBanner imageUrl={heroImg} className="mt-2" />

              <div className="mt-6 md:mt-8 flex items-center justify-between gap-4">
                <h2 className="text-xl md:text-2xl font-bold text-[#333132]">Your Projects</h2>
                <div className="hidden md:block text-sm text-[#666666]">{filtered.length} of {ORDERS.length} shown</div>
              </div>

              <div className="mt-4">
                <FiltersBar status={status} type={type} onStatusChange={setStatus} onTypeChange={setType} />
              </div>

              <div
                className="relative mt-6 md:mt-8"
                style={{
                  backgroundImage:
                    "url('data:image/svg+xml;utf8,\
<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'400\' height=\'400\' viewBox=\'0 0 400 400\'>\
<defs><pattern id=\'p\' width=\'80\' height=\'80\' patternUnits=\'userSpaceOnUse\'>\
<g fill=\'none\' stroke=\'%23D9D9D9\' stroke-opacity=\'.35\' stroke-width=\'1\'>\
<circle cx=\'20\' cy=\'20\' r=\'6\'/>\
<rect x=\'50\' y=\'10\' width=\'14\' height=\'14\' rx=\'2\'/>\
<path d=\'M10 60h20M20 50v20\'/>\
</g></pattern></defs>\
<rect width=\'100%\' height=\'100%\' fill=\'url(%23p)\'/>\
</svg>')",
                  backgroundSize: "auto",
                }}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {filtered.map((item) => (
                    <OrderCard key={item.id} item={item} />
                  ))}
                </div>
              </div>

              <div className="mt-10">
                <Footer />
              </div>
            </div>
          </main>
        </div>
      </div>
      <MobileBottomNav />
    </div>
  );
}
