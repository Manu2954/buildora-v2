import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { Sidebar } from "@/components/Sidebar";
import { Footer } from "@/components/Footer";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { useSidebar } from "@/contexts/SidebarContext";
import { HeroBanner } from "@/components/orders/HeroBanner";
import { FiltersBar, type StatusFilter, type TypeFilter } from "@/components/orders/FiltersBar";
import { OrderCard, type OrderItem } from "@/components/orders/OrderCard";
import { Button } from "@/components/ui/button";
import { listProjects } from "@/lib/projects";
import { PROJECT_STATUS_LABELS, type Project } from "@/lib/types/project";
import { currentUser } from "@/lib/api";

const heroImg =
  "https://images.unsplash.com/photo-1505691723518-36a5ac3b2aa5?q=80&w=1600&auto=format&fit=crop";

const FALLBACK_THUMBNAIL = heroImg;
const DEFAULT_PAGE_SIZE = 50;
const STATUS_FILTER_OPTIONS: StatusFilter[] = ["All", ...PROJECT_STATUS_LABELS];

const formatDisplayDate = (value?: string) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const toOrderItem = (project: Project): OrderItem => {
  const worksiteMedia = project.worksiteMedia ?? [];
  const worksiteImage = worksiteMedia.find((media) => media.kind === "image");
  const designImage = project.designs?.[0]?.url;
  const thumbnail =
    project.sitePhoto ?? worksiteImage?.url ?? designImage ?? FALLBACK_THUMBNAIL;

  return {
    id: project.id,
    address: project.address,
    type: project.type,
    startDate: formatDisplayDate(project.startDate),
    completionDate: formatDisplayDate(project.eta),
    status: project.status,
    thumbnail,
  };
};

export default function Orders() {
  const { isCollapsed, toggle } = useSidebar();
  const user = currentUser<{ id: string; role: string } | null>();
  const [status, setStatus] = useState<StatusFilter>("All");
  const [type, setType] = useState<TypeFilter>("All");

  const { data, isLoading, isFetching, error, refetch } = useQuery({
    queryKey: ["projects", "orders"],
    queryFn: () => listProjects({ page: 1, pageSize: DEFAULT_PAGE_SIZE }),
    staleTime: 30_000,
    enabled: Boolean(user),
  });

  const projects = data?.items ?? [];
  const orders = useMemo(() => projects.map(toOrderItem), [projects]);

  const typeOptions = useMemo(() => {
    const seen = new Set<string>();
    orders.forEach((order) => {
      if (order.type) seen.add(order.type);
    });
    return Array.from(seen).sort((a, b) => a.localeCompare(b));
  }, [orders]);

  const filtered = useMemo(() => {
    return orders.filter(
      (order) =>
        (status === "All" || order.status === status) &&
        (type === "All" || order.type === type),
    );
  }, [orders, status, type]);

  const hasOrders = orders.length > 0;
  const hasFilteredOrders = filtered.length > 0;
  const showList = Boolean(user) && !error && hasFilteredOrders;
  const showEmptyFilteredState =
    Boolean(user) && !error && !isLoading && hasOrders && !hasFilteredOrders;
  const showNoDataState = Boolean(user) && !error && !isLoading && !hasOrders;

  const totalLabel = hasOrders ? orders.length.toString() : isLoading ? "…" : "0";
  const filteredLabel = hasFilteredOrders
    ? filtered.length.toString()
    : isLoading && !hasOrders
      ? "…"
      : hasOrders
        ? "0"
        : "0";

  const errorMessage = error instanceof Error ? error.message : undefined;
  const isUnauthorized =
    errorMessage?.toLowerCase().includes("token") ||
    errorMessage?.toLowerCase().includes("unauthorized");

  return (
    <div className="min-h-screen bg-[#E8E8E8]">
      <div className="pt-24 md:pt-16">
        <div className="flex">
          <div className="hidden xl:block">
            <Sidebar isCollapsed={isCollapsed} onToggle={toggle} />
          </div>

          <main
            className={`flex-1 transition-all duration-300 ease-in-out ${
              isCollapsed ? "xl:ml-16" : "xl:ml-[220px]"
            }`}
          >
            <div className="max-w-[960px] mx-auto px-4 md:px-6 lg:px-0 pb-24">
              <HeroBanner imageUrl={heroImg} className="mt-2" />

              <div className="mt-6 md:mt-8 flex items-center justify-between gap-4">
                <h2 className="text-xl md:text-2xl font-bold text-[#333132]">
                  Your Projects
                </h2>
                <div className="hidden md:block text-sm text-[#666666]">
                  {filteredLabel} of {totalLabel} shown
                </div>
              </div>

              <div className="mt-4">
                <FiltersBar
                  status={status}
                  type={type}
                  onStatusChange={setStatus}
                  onTypeChange={setType}
                  typeOptions={typeOptions}
                  statusOptions={STATUS_FILTER_OPTIONS}
                  disabled={Boolean(error) || !user}
                />
              </div>

              {!user ? (
                <div className="mt-8 rounded-xl border border-[#D9D9D9] bg-white p-8 text-center text-sm text-[#666666]">
                  Please {" "}
                  <a href="/login" className="text-[#C69B4B] hover:underline">
                    sign in
                  </a>{" "}
                  to view your projects.
                </div>
              ) : null}

              {user && (isLoading || isFetching) ? (
                <div className="mt-8 text-sm text-[#666666]">
                  Loading your projects…
                </div>
              ) : null}

              {user && error ? (
                <div className="mt-8 rounded-xl border border-[#F5D0D0] bg-[#FEF2F2] p-4 text-sm text-[#991B1B]">
                  <p className="font-medium">
                    {isUnauthorized
                      ? "You are not authorized to view these projects."
                      : "Unable to fetch your projects."}
                  </p>
                  <p className="mt-1 text-[#7F1D1D]">
                    {isUnauthorized
                      ? "Please sign in with the correct account."
                      : "Please check your connection and try again."}
                  </p>
                  {isUnauthorized ? (
                    <Button
                      className="mt-3 rounded-xl bg-[#C69B4B] hover:bg-[#B1873E]"
                      onClick={() => (window.location.href = "/login")}
                    >
                      Sign In
                    </Button>
                  ) : (
                    <Button
                      className="mt-3 rounded-xl bg-[#C69B4B] hover:bg-[#B1873E]"
                      onClick={() => refetch()}
                    >
                      Retry
                    </Button>
                  )}
                </div>
              ) : null}

              {showEmptyFilteredState ? (
                <div className="mt-8 rounded-xl border border-dashed border-[#D9D9D9] bg-white p-8 text-center text-sm text-[#666666]">
                  No projects match the selected filters. Adjust the filters or check back later.
                </div>
              ) : null}

              {showNoDataState ? (
                <div className="mt-8 rounded-xl border border-dashed border-[#D9D9D9] bg-white p-8 text-center text-sm text-[#666666]">
                  No projects available yet. Once you start a project, it will appear here.
                </div>
              ) : null}

              {showList ? (
                <div className="relative mt-6 md:mt-8">
                  <div className="absolute inset-0 pointer-events-none opacity-5 bg-[radial-gradient(ellipse_at_center,_rgba(0,0,0,0.04)_1px,_transparent_1px)] [background-size:24px_24px]" />
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {filtered.map((item) => (
                      <OrderCard key={item.id} item={item} />
                    ))}
                  </div>
                </div>
              ) : null}

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
