import { Outlet } from "react-router-dom";
import AdminNavbar from "@/admin/components/AdminNavbar";
import AdminSidebar from "@/admin/components/AdminSidebar";
import { useState, useMemo, useEffect } from "react";

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState<boolean>(() => {
    try {
      const raw = localStorage.getItem("admin.sidebar.collapsed");
      return raw ? JSON.parse(raw) : false;
    } catch {
      return false;
    }
  });
  const [mobileOpen, setMobileOpen] = useState(false);
  const gridCols = useMemo(() => (collapsed ? "md:[grid-template-columns:3.5rem_1fr]" : "md:[grid-template-columns:16rem_1fr]"), [collapsed]);

  useEffect(() => {
    try {
      localStorage.setItem("admin.sidebar.collapsed", JSON.stringify(collapsed));
    } catch {}
  }, [collapsed]);

  return (
    <div className="min-h-screen bg-[#E8E8E8] text-[#333132]">
      <AdminNavbar
        onToggleMobile={() => setMobileOpen((v) => !v)}
        onToggleCollapse={() => setCollapsed((v) => !v)}
      />
      <div className="mx-auto w-full max-w-screen-2xl px-4 lg:px-8">
        <div className={`grid grid-cols-1 ${gridCols} gap-4 md:gap-6 py-4 md:py-6 min-h-[calc(100vh-4rem)]`}>
          <div className="hidden md:block sticky self-start top-20">
            <AdminSidebar collapsed={collapsed} />
          </div>
          <main className="min-h-[60vh] space-y-4 md:space-y-6">
            <Outlet />
          </main>
        </div>
      </div>
      {mobileOpen && <AdminSidebar mobile onClose={() => setMobileOpen(false)} />}
    </div>
  );
}
