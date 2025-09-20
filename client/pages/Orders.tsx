import { Sidebar } from "@/components/Sidebar";
import { Footer } from "@/components/Footer";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { useSidebar } from "@/contexts/SidebarContext";
import { HeroBanner } from "@/components/orders/HeroBanner";
import { FiltersBar, StatusFilter, TypeFilter } from "@/components/orders/FiltersBar";
import { OrderCard, type OrderItem } from "@/components/orders/OrderCard";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { listMyOrders } from "@/lib/orders";
import { currentUser } from "@/lib/api";

const heroImg =
  "https://images.unsplash.com/photo-1505691723518-36a5ac3b2aa5?q=80&w=1600&auto=format&fit=crop";

const PLACEHOLDER_IMG = "https://images.unsplash.com/photo-1505691723518-36a5ac3b2aa5?q=80&w=1200&auto=format&fit=crop";

function mapStatusToUi(status: "PENDING" | "PAID" | "FULFILLED" | "CANCELLED" | "REFUNDED"): StatusFilter {
  switch (status) {
    case "PENDING":
      return "Quotation Pending";
    case "PAID":
      return "Material Procurement";
    case "FULFILLED":
      return "Completed";
    case "CANCELLED":
    case "REFUNDED":
      return "Cancelled";
    default:
      return "In Progress";
  }
}

export default function Orders() {
  const { isCollapsed, toggle } = useSidebar();
  const user = currentUser<any | null>();

  const [status, setStatus] = useState<StatusFilter>("All");
  const [type, setType] = useState<TypeFilter>("All");

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["orders", status],
    queryFn: async () => {
      const apiStatus = status === "All" ? "all" : undefined; // backend uses enum; we can extend later
      return listMyOrders({ status: apiStatus, page: 1, pageSize: 50 });
    },
    enabled: !!user,
  });

  const orders: OrderItem[] = useMemo(() => {
    const list = data?.orders ?? [];
    const mapped: OrderItem[] = list.map((o) => ({
      id: o.id,
      address: [o.shipLine1, o.shipCity, o.shipState].filter(Boolean).join(", ") || "-",
      type: "Apartment",
      startDate: o.createdAt?.slice(0, 10) ?? "",
      completionDate: o.updatedAt?.slice(0, 10) ?? "",
      status: mapStatusToUi(o.status),
      thumbnail: PLACEHOLDER_IMG,
    }));
    return mapped.filter((o) => (status === "All" || o.status === status) && (type === "All" || o.type === type));
  }, [data, status, type]);

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
                <div className="hidden md:block text-sm text-[#666666]">
                  {!user ? "Please sign in to view your orders" : isLoading ? "Loading..." : isError ? (error as Error).message : `${orders.length} shown`}
                </div>
              </div>

              <div className="mt-4">
                <FiltersBar status={status} type={type} onStatusChange={setStatus} onTypeChange={setType} />
              </div>

              <div
                className="relative mt-6 md:mt-8"
              >
                <div className="absolute inset-0 pointer-events-none opacity-5 bg-[radial-gradient(ellipse_at_center,_rgba(0,0,0,0.04)_1px,_transparent_1px)] [background-size:24px_24px]" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {orders.map((item) => (
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
