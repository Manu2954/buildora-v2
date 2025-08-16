import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

interface FormData {
  fullName: string;
  mobile: string;
  location: string;
  requirement: string;
  customRequirement: string;
  consent: boolean;
}

interface SubscribeData {
  email: string;
}

export default function Index() {
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    mobile: "",
    location: "",
    requirement: "",
    customRequirement: "",
    consent: false,
  });
  
  const [subscribeData, setSubscribeData] = useState<SubscribeData>({
    email: "",
  });
  
  const [showSuccess, setShowSuccess] = useState(false);
  const [showSubscribeSuccess, setShowSubscribeSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const requirementOptions = [
    "Interior Supplies/Products",
    "Modular Kitchen",
    "Wardrobe or Storage",
    "TV Unit or Showcase",
    "Full Home Interiors",
    "Other"
  ];

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation for required fields
    const mobileValid = /^\d{10,13}$/.test(formData.mobile);
    const isValid =
      formData.fullName &&
      mobileValid &&
      formData.location &&
      formData.requirement &&
      formData.consent &&
      (formData.requirement !== "Other" || formData.customRequirement);

    if (!isValid) {
      setError("Please fill all required fields with valid information.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Backend base URL configured via .env (VITE_API_BASE_URL / REACT_APP_API_BASE_URL)
      const apiBase =
        import.meta.env.VITE_API_BASE_URL || process.env.REACT_APP_API_BASE_URL;
      const response = await fetch(`${apiBase}/api/leads`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: formData.fullName,
          mobileNumber: formData.mobile,
          location: formData.location,
          requirement:
            formData.requirement === "Other"
              ? formData.customRequirement
              : formData.requirement,
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.message || "Failed to submit. Please try again.");
      }

      // Show success toast and message
      toast({
        title: "Lead submitted",
        description: "Thank you! We'll contact you soon.",
      });
      setShowSuccess(true);

      // Reset form
      setFormData({
        fullName: "",
        mobile: "",
        location: "",
        requirement: "",
        customRequirement: "",
        consent: false,
      });

      // Hide success message after 5 seconds
      setTimeout(() => setShowSuccess(false), 5000);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong";
      setError(message);
      toast({ title: "Submission failed", description: message });
    } finally {
      setLoading(false);
    }
  };
  
  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!subscribeData.email) return;
    
    setShowSubscribeSuccess(true);
    setSubscribeData({ email: "" });
    
    setTimeout(() => setShowSubscribeSuccess(false), 5000);
  };
  
  const scrollToForm = () => {
    document.getElementById('cta-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  const mobileValid = /^\d{10,13}$/.test(formData.mobile);
  const isFormValid =
    formData.fullName &&
    mobileValid &&
    formData.location &&
    formData.requirement &&
    formData.consent &&
    (formData.requirement !== "Other" || formData.customRequirement);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-surface border-b border-border">
        <div className="max-w-content-mobile lg:max-w-content-desktop mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
           <div className="flex items-center space-x-3 flex-shrink-0">
              <Link to="/" className="flex items-center space-x-3">
                {/* Brand Icon Logo */}
                <img
                  src="../buildora-icon.png"
                  alt="Buildora Icon"
                  className="h-8 md:h-10 w-auto object-contain"
                  draggable="false"
                />
                {/* Brand Wordmark Logo */}
                <img
                  src="../buildora-icon-v1.jpeg"
                  alt="Buildora - banner"
                  className="h-6 md:h-8 w-auto object-contain"
                  draggable="false"
                />
              </Link>
            </div>
            
            {/* Navigation */}
            <nav className="hidden sm:flex items-center gap-6">
              <Link to="/about"
                // href="https://buildoraenterprise.com/about" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-text hover:text-gold transition-colors"
              >
                About Us
              </Link>
              <Link
                // href="https://buildoraenterprise.com" 
                to={"https://buildoraenterprise.com"}
                target="_blank" 
                rel="noopener noreferrer"
                className="text-text hover:text-gold transition-colors"
              >
                Go to the website
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-content-mobile lg:max-w-content-desktop mx-auto px-4">
        
        {/* Hero Section */}
        <section className="py-8 lg:py-14">
          <div className="bg-surface rounded-3xl p-8 lg:p-12 shadow-card border border-border text-center">
            <h1 className="text-3xl lg:text-5xl font-bold text-text leading-tight lg:leading-snug mb-6">
              Sourcing made simple. Building made easy!
            </h1>
            <p className="text-lg lg:text-xl text-muted mb-8 max-w-2xl mx-auto leading-relaxed">
              From modular kitchens to full interiors — the right expert is just a form away.
            </p>
            <button
              onClick={scrollToForm}
              className="bg-gold hover:bg-gold-hover text-surface font-semibold px-8 py-4 rounded-2xl h-[52px] w-full sm:w-auto sm:min-w-[320px] transition-colors focus:outline-none focus:ring-2 focus:ring-gold focus:ring-opacity-50"
            >
              Send My Requirement
            </button>
          </div>
        </section>

        {/* Trust Chips */}
        <section className="pb-8 lg:pb-14">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <div className="bg-surface border border-border rounded-full px-4 py-3 shadow-sm flex items-center gap-2 text-sm text-muted">
              <div className="w-2 h-2 bg-gold rounded-full"></div>
              Trusted by 50+ dealers & professionals
            </div>
            <div className="bg-surface border border-border rounded-full px-4 py-3 shadow-sm flex items-center gap-2 text-sm text-muted">
              <div className="w-2 h-2 bg-gold rounded-full"></div>
              Verified Manufacturer Partner
            </div>
            <div className="bg-surface border border-border rounded-full px-4 py-3 shadow-sm flex items-center gap-2 text-sm text-muted">
              <div className="w-2 h-2 bg-gold rounded-full"></div>
              Fast Delivery | Best Prices | South India Coverage
            </div>
          </div>
        </section>

        {/* Form Section */}
        <section id="cta-form" className="pb-8 lg:pb-14">
          <div className="bg-surface rounded-3xl p-8 lg:p-12 shadow-card border border-border">
            <h2 className="text-2xl lg:text-3xl font-bold text-text mb-8 text-center">
              Get Started Today
            </h2>
            
            {/* Success Message */}
            {showSuccess && (
              <div className="bg-green-50 border border-green-200 text-green-800 px-6 py-4 rounded-xl mb-6">
                Thank you! Our team will connect with you shortly to understand your requirement and begin your project.
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-800 px-6 py-4 rounded-xl mb-6">
                {error}
              </div>
            )}
            
            <form onSubmit={handleFormSubmit} className="space-y-6 max-w-lg mx-auto">
              <div>
                <label className="block text-sm font-semibold text-text mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full h-12 px-4 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-gold focus:ring-opacity-50 focus:border-gold"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-text mb-2">
                  Mobile Number *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.mobile}
                  onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                  className="w-full h-12 px-4 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-gold focus:ring-opacity-50 focus:border-gold"
                />
                {!mobileValid && formData.mobile && (
                  <p className="text-sm text-red-600 mt-1">Enter a valid mobile number (10-13 digits).</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-text mb-2">
                  Your Location *
                </label>
                <input
                  type="text"
                  required
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full h-12 px-4 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-gold focus:ring-opacity-50 focus:border-gold"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-text mb-2">
                  Select or Describe Your Requirement *
                </label>
                <select
                  required
                  value={formData.requirement}
                  onChange={(e) => setFormData({ ...formData, requirement: e.target.value })}
                  className="w-full h-12 px-4 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-gold focus:ring-opacity-50 focus:border-gold"
                >
                  <option value="">Choose your requirement</option>
                  {requirementOptions.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
              
              {formData.requirement === "Other" && (
                <div>
                  <label className="block text-sm font-semibold text-text mb-2">
                    Describe your requirement *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.customRequirement}
                    onChange={(e) => setFormData({ ...formData, customRequirement: e.target.value })}
                    className="w-full h-12 px-4 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-gold focus:ring-opacity-50 focus:border-gold"
                    placeholder="Tell us about your specific requirement"
                  />
                </div>
              )}
              
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="consent"
                  required
                  checked={formData.consent}
                  onChange={(e) => setFormData({ ...formData, consent: e.target.checked })}
                  className="mt-1 w-4 h-4 text-gold border-border rounded focus:ring-gold focus:ring-2"
                />
                <label htmlFor="consent" className="text-sm text-text">
                  I agree to be contacted by Buildora Enterprise for my inquiry. *
                </label>
              </div>
              
              <button
                type="submit"
                disabled={loading || !isFormValid}
                className="bg-gold hover:bg-gold-hover disabled:opacity-50 disabled:cursor-not-allowed text-surface font-semibold px-8 py-4 rounded-2xl h-[52px] w-full sm:w-auto sm:min-w-[320px] mx-auto block transition-colors focus:outline-none focus:ring-2 focus:ring-gold focus:ring-opacity-50"
              >
                {loading ? "Sending..." : "Send My Requirement"}
              </button>
            </form>
          </div>
        </section>

        {/* Bottom Actions */}
        <section className="pb-8 lg:pb-14">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
            <a
              href="https://buildoraenterprise.com/packages"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-surface border border-border rounded-2xl p-6 shadow-card hover:shadow-lg transition-shadow text-center group"
            >
              <h3 className="text-lg font-semibold text-text mb-2 group-hover:text-gold transition-colors">
                See Packages
              </h3>
              <p className="text-muted text-sm">
                Explore our comprehensive interior packages
              </p>
            </a>
            
            <a
              href="https://buildoraenterprise.com"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-surface border border-border rounded-2xl p-6 shadow-card hover:shadow-lg transition-shadow text-center group"
            >
              <h3 className="text-lg font-semibold text-text mb-2 group-hover:text-gold transition-colors">
                Go to the Website
              </h3>
              <p className="text-muted text-sm">
                Visit our main website for more information
              </p>
            </a>
          </div>
          
          {/* Subscribe Section */}
          <div className="bg-surface rounded-3xl p-8 shadow-card border border-border text-center">
            <h3 className="text-xl font-semibold text-text mb-4">
              Subscribe for latest updates
            </h3>
            
            {showSubscribeSuccess && (
              <div className="bg-green-50 border border-green-200 text-green-800 px-6 py-3 rounded-xl mb-4 inline-block">
                Subscribed! We'll keep you posted.
              </div>
            )}
            
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                required
                value={subscribeData.email}
                onChange={(e) => setSubscribeData({ email: e.target.value })}
                placeholder="Enter your email"
                className="flex-1 h-12 px-4 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-gold focus:ring-opacity-50 focus:border-gold"
              />
              <button
                type="submit"
                className="bg-gold hover:bg-gold-hover text-surface font-semibold px-6 py-3 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-gold focus:ring-opacity-50"
              >
                Subscribe
              </button>
            </form>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-surface border-t border-border">
        <div className="max-w-content-mobile lg:max-w-content-desktop mx-auto px-4 py-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex gap-6 text-muted text-sm">
              <span>About</span>
              <span>Terms</span>
              <span>Privacy</span>
              <span>Contact</span>
            </div>
            <div className="text-muted text-sm">
              © {new Date().getFullYear()} Buildora Enterprise. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
