import { Outlet } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { SidebarProvider } from "@/contexts/SidebarContext";

export default function PublicLayout() {
  return (
    <SidebarProvider>
      <Navbar />
      <Outlet />
    </SidebarProvider>
  );
}

