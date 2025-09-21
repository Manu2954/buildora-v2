import { Outlet } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { SidebarProvider } from "@/contexts/SidebarContext";

export default function PublicLayout() {
  return (
    <SidebarProvider>
      <Navbar />
      {/* Add top padding to avoid content being hidden under fixed navbar.  */}
      <main className="pt-28 md:pt-20">
        <Outlet />
      </main>
    </SidebarProvider>
  );
}
