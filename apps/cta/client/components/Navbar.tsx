import { Link } from "react-router-dom";
import Logo from "@/components/Logo";

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-surface border-b border-border transition-all duration-300 md:rounded-none rounded-b-2xl shadow-sm">
      <div className="px-4 md:px-5 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-16 py-3">
          {/* Left: Brand */}
          <Link to="/" className="flex items-center space-x-3 select-none">
            <Logo size="medium" variant="full" />
          </Link>

          {/* Right: Placeholder actions (kept minimal for CTA) */}
          <div className="hidden sm:flex items-center gap-2">
            <a
              href="tel:+919963360888"
              className="px-4 py-2 bg-primary hover:bg-primary-hover text-white font-medium rounded-lg transition-colors duration-200"
            >
              Call Us
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
