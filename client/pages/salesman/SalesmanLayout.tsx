import { Outlet } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import SalesmanSidebar from "@/components/SalesmanSidebar";
import { SidebarProvider, useSidebar } from "@/contexts/SidebarContext";

function SalesmanLayoutContent() {
  const { isCollapsed, toggle } = useSidebar();

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#E8E8E8] text-[#333132] pt-24 md:pt-16">
        <div className="flex">
          <div className="hidden xl:block">
            <SalesmanSidebar isCollapsed={isCollapsed} onToggle={toggle} />
          </div>
          <main
            className={`flex-1 transition-all duration-300 ease-in-out ${
              isCollapsed ? "xl:ml-16" : "xl:ml-[220px]"
            }`}
          >
            <div className="mx-auto w-full max-w-5xl px-4 md:px-6 lg:px-8 pb-24">
              <div className="mb-6">
                <h1 className="text-2xl md:text-3xl font-semibold text-[#333132]">
                  Salesman Portal
                </h1>
                <p className="mt-1 text-sm text-[#666666]">
                  Manage your leads and daily entries.
                </p>
              </div>
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </>
  );
}

export default function SalesmanLayout() {
  return (
    <SidebarProvider>
      <SalesmanLayoutContent />
    </SidebarProvider>
  );
}
