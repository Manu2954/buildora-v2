import { logout } from "@/lib/api";
import { useNavigate, Link } from "react-router-dom";
import AdminButton from "@/admin/components/ui/AdminButton";
import { Menu } from "lucide-react";

export default function AdminNavbar({
  onToggleMobile,
  onToggleCollapse,
}: {
  onToggleMobile?: () => void;
  onToggleCollapse?: () => void;
}) {
  const navigate = useNavigate();
  const onLogout = () => {
    logout();
    navigate("/admin/login", { replace: true });
  };
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background shadow-sm">
      <div className="mx-auto max-w-7xl px-4 md:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3 md:gap-6">
          {/* Mobile menu toggle */}
          <button
            className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-card"
            aria-label="Open menu"
            onClick={onToggleMobile}
          >
            <Menu className="h-5 w-5 text-buildora-text" />
          </button>
          {/* Desktop collapse toggle */}
          <button
            className="hidden md:inline-flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-card"
            aria-label="Toggle sidebar"
            onClick={onToggleCollapse}
          >
            <Menu className="h-5 w-5 text-buildora-text" />
          </button>
          <Link to="/admin" className="text-xl md:text-2xl font-semibold tracking-tight">
            <span className="text-buildora-gold">Buildora</span> <span className="text-buildora-text">Admin</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-[15px] text-muted-foreground">
            <Link to="/admin" className="hover:text-buildora-gold min-h-[44px] inline-flex items-center">Overview</Link>
            <Link to="/admin/cta/leads" className="hover:text-buildora-gold min-h-[44px] inline-flex items-center">Leads</Link>
            <Link to="/admin/cta/config" className="hover:text-buildora-gold min-h-[44px] inline-flex items-center">CTA Config</Link>
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <AdminButton variant="secondary" onClick={onLogout} aria-label="Logout">Logout</AdminButton>
        </div>
      </div>
    </header>
  );
}
