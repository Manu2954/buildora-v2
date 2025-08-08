import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Footer } from "@/components/Footer";
import { Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      
      <main className="flex-1 ml-64">
        <div className="min-h-screen flex flex-col">
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="text-center max-w-md">
              <div className="w-24 h-24 bg-buildora-gold/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-6xl font-bold text-buildora-gold">404</span>
              </div>
              <h1 className="text-3xl font-bold text-foreground mb-4">Page Not Found</h1>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                The page you're looking for doesn't exist. Let's get you back to exploring beautiful designs.
              </p>
              <Link 
                to="/" 
                className="inline-flex items-center px-6 py-3 bg-buildora-gold text-white font-medium rounded-lg hover:bg-buildora-gold-dark transition-colors"
              >
                <Home className="h-5 w-5 mr-2" />
                Return to Home
              </Link>
            </div>
          </div>
          <Footer />
        </div>
      </main>
    </div>
  );
};

export default NotFound;
