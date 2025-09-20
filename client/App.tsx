import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Services from "./pages/Services";
import Orders from "./pages/Orders";
import OrderItems from "./pages/OrderItems";
import OrderDetail from "./pages/OrderDetail";
import Profile from "./pages/Profile";
import ProjectDetails from "./pages/ProjectDetails";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Search from "./pages/Search";
import Login from "./pages/Login";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import CtaConfig from "./pages/admin/CtaConfig";
import CtaAnalytics from "./pages/admin/CtaAnalytics";
import Leads from "./pages/admin/Leads";
import LeadDetail from "./pages/admin/LeadDetail";
import Catalog from "./pages/admin/Catalog";
import PublicLayout from "./pages/PublicLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import SignUp from "./pages/SignUp";
import NotFound from "./pages/NotFound";
import ExploreDesigns from "./pages/ExploreDesigns";
import DesignDetail from "./pages/DesignDetail";
import ProjectCart from "./pages/ProjectCart";
import Checkout from "./pages/Checkout";
import InteriorOrderDetail from "./pages/InteriorOrderDetail";
import DesignManagement from "./admin/pages/DesignManagement";
import InteriorOrderManagement from "./admin/pages/InteriorOrderManagement";

const queryClient = new QueryClient();

// Routing is defined in a single <Routes> tree to avoid overlapping catch-alls

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public site with shared layout */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<Index />} />
              <Route path="/services" element={<Services />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/orders/:id" element={<OrderDetail />} />
              <Route path="/order-items" element={<OrderItems />} />
              <Route path="/designs" element={<ExploreDesigns />} />
              <Route path="/designs/:id" element={<DesignDetail />} />
              <Route path="/cart" element={<ProjectCart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/dashboard/interior-orders/:id" element={<InteriorOrderDetail />} />
              <Route path="/project/:id" element={<ProjectDetails />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/search" element={<Search />} />
              <Route path="/login" element={<Login />} />
              <Route path="/sign-up" element={<SignUp />} />
              <Route path="*" element={<NotFound />} />
            </Route>

            {/* Admin routes (own layout) */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route
              path="/admin/*"
              element={<ProtectedRoute roles={["ADMIN"]}><AdminLayout /></ProtectedRoute>}
            >
              <Route index element={<AdminDashboard />} />
              <Route path="cta/config" element={<CtaConfig />} />
              <Route path="cta/analytics" element={<CtaAnalytics />} />
              <Route path="cta/leads" element={<Leads />} />
              <Route path="cta/leads/:id" element={<LeadDetail />} />
              <Route path="catalog" element={<Catalog />} />
              <Route path="designs" element={<DesignManagement />} />
              <Route path="interior-orders" element={<InteriorOrderManagement />} />
            </Route>

            {/* Optionally, add an admin-specific 404 here later */}
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
