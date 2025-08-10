import { useEffect, useRef, useState } from "react";
import { Check } from "lucide-react";
import { beTokens } from "@/lib/beTokens";

const trustChips = [
  "Trusted by 50+ dealers & professionals",
  "Verified Manufacturer Partner",
  "Fast Delivery | Best Prices | South India Coverage",
];

const requirementOptions = [
  "Interior Supplies/Products",
  "Modular Kitchen",
  "Wardrobe or Storage",
  "TV Unit or Showcase",
  "Full Home Interiors",
  "Other",
];

const interestOptions = requirementOptions.filter((o) => o !== "Other");

export default function EnterpriseCTA() {
  const formRef = useRef<HTMLDivElement>(null);
  const [showSticky, setShowSticky] = useState(true);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setShowSticky(!entry.isIntersecting),
      { threshold: 0 },
    );
    if (formRef.current) {
      observer.observe(formRef.current);
    }
    return () => observer.disconnect();
  }, []);

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // form state
  const [fullName, setFullName] = useState("");
  const [mobile, setMobile] = useState("");
  const [location, setLocation] = useState("");
  const [requirement, setRequirement] = useState("");
  const [otherRequirement, setOtherRequirement] = useState("");
  const [interests, setInterests] = useState<string[]>([]);
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (success) {
      const t = setTimeout(() => setSuccess(false), 5000);
      return () => clearTimeout(t);
    }
  }, [success]);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!fullName.trim()) e.fullName = "Full Name is required";
    if (!mobile.trim()) e.mobile = "Mobile Number is required";
    else if (!/^\d{10}$/.test(mobile))
      e.mobile = "Enter a valid 10-digit number";
    if (!location.trim()) e.location = "Your Location is required";
    if (!requirement) e.requirement = "Requirement is required";
    if (!consent) e.consent = "You must agree to be contacted";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSuccess(true);
    setFullName("");
    setMobile("");
    setLocation("");
    setRequirement("");
    setOtherRequirement("");
    setInterests([]);
    setConsent(false);
  };

  const toggleInterest = (option: string) => {
    setInterests((prev) =>
      prev.includes(option)
        ? prev.filter((i) => i !== option)
        : [...prev, option],
    );
  };

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        background: beTokens.colors.background,
        color: beTokens.colors.text,
      }}
    >
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div
          className="mx-auto w-full px-4"
          style={{ maxWidth: beTokens.spacing.containerDesktop }}
        >
          <div className="h-14 flex items-center">
            <img
              src="/buildora-icon.png"
              alt="Buildora Enterprise"
              className="h-8 w-auto select-none pointer-events-none"
              draggable="false"
            />
            <img
              src="/buildora-icon-v1.png"
              alt="Buildora Enterprise"
              className="h-6 w-auto ml-2 select-none pointer-events-none"
              draggable="false"
            />
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="text-center py-8 sm:py-10 lg:py-14 xl:py-[72px] px-4">
          <div
            className="mx-auto"
            style={{ maxWidth: beTokens.spacing.containerDesktop }}
          >
            <h1 className="text-3xl font-bold">
              Sourcing made simple. Building made easy!
            </h1>
            <p className="mt-4">
              From modular kitchens to full interiors — the right expert is just
              a form away.
            </p>
            <button
              onClick={scrollToForm}
              className="mt-8 px-6 py-3 font-semibold text-white rounded-2xl focus:outline-none focus:ring-2"
              style={{
                background: beTokens.colors.gold,
                borderRadius: beTokens.radii.button,
              }}
            >
              Send My Requirement
            </button>

            <div className="mt-8">
              {/* Mobile chips */}
              <div
                className="flex md:hidden gap-3 overflow-x-auto snap-x snap-mandatory pb-2"
                aria-label="trust tags"
              >
                {trustChips.map((chip) => (
                  <div
                    key={chip}
                    className="flex-none snap-start flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-2 text-sm"
                  >
                    <span
                      className="flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center"
                      style={{ background: beTokens.colors.gold }}
                    >
                      <Check
                        className="w-3 h-3"
                        color={beTokens.colors.white}
                      />
                    </span>
                    <span className="text-left whitespace-nowrap">{chip}</span>
                  </div>
                ))}
              </div>
              {/* Desktop chips */}
              <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 gap-3">
                {trustChips.map((chip) => (
                  <div
                    key={chip}
                    className="flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-2 text-sm"
                  >
                    <span
                      className="flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center"
                      style={{ background: beTokens.colors.gold }}
                    >
                      <Check
                        className="w-3 h-3"
                        color={beTokens.colors.white}
                      />
                    </span>
                    <span className="text-left">{chip}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Form Section */}
        <section ref={formRef} className="px-4 pb-24">
          <div
            className="mx-auto"
            style={{ maxWidth: beTokens.spacing.containerDesktop }}
          >
            <div
              className="bg-white border border-gray-200 shadow-sm p-6 md:p-8"
              style={{ borderRadius: beTokens.radii.card }}
            >
              <h2 className="text-2xl font-bold text-center mb-6">
                Get Started Today
              </h2>
              {success && (
                <div
                  className="mb-6 p-4 border border-green-200 bg-green-50 text-green-800 text-sm rounded-lg transition-opacity"
                  role="status"
                >
                  Thank you! Our team will connect with you shortly to
                  understand your requirement and begin your project.
                </div>
              )}
              <form onSubmit={handleSubmit} noValidate className="space-y-5">
                <div>
                  <label
                    htmlFor="fullName"
                    className="block text-sm font-medium"
                  >
                    Full Name
                  </label>
                  <input
                    id="fullName"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className={`mt-1 w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 ${errors.fullName ? "border-red-500" : "border-gray-300"}`}
                    aria-invalid={!!errors.fullName}
                    aria-describedby={
                      errors.fullName ? "fullName-error" : undefined
                    }
                  />
                  {errors.fullName && (
                    <p
                      id="fullName-error"
                      className="mt-1 text-sm text-red-600"
                    >
                      {errors.fullName}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="mobile" className="block text-sm font-medium">
                    Mobile Number
                  </label>
                  <input
                    id="mobile"
                    type="tel"
                    inputMode="tel"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    className={`mt-1 w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 ${errors.mobile ? "border-red-500" : "border-gray-300"}`}
                    aria-invalid={!!errors.mobile}
                    aria-describedby={
                      errors.mobile ? "mobile-error" : undefined
                    }
                  />
                  {errors.mobile && (
                    <p id="mobile-error" className="mt-1 text-sm text-red-600">
                      {errors.mobile}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="location"
                    className="block text-sm font-medium"
                  >
                    Your Location
                  </label>
                  <input
                    id="location"
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className={`mt-1 w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 ${errors.location ? "border-red-500" : "border-gray-300"}`}
                    aria-invalid={!!errors.location}
                    aria-describedby={
                      errors.location ? "location-error" : undefined
                    }
                  />
                  {errors.location && (
                    <p
                      id="location-error"
                      className="mt-1 text-sm text-red-600"
                    >
                      {errors.location}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="requirement"
                    className="block text-sm font-medium"
                  >
                    Requirement
                  </label>
                  <select
                    id="requirement"
                    value={requirement}
                    onChange={(e) => setRequirement(e.target.value)}
                    className={`mt-1 w-full px-4 py-3 border rounded-md bg-white focus:outline-none focus:ring-2 ${errors.requirement ? "border-red-500" : "border-gray-300"}`}
                    aria-invalid={!!errors.requirement}
                    aria-describedby={
                      errors.requirement ? "requirement-error" : undefined
                    }
                  >
                    <option value="">Select</option>
                    {requirementOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                  {requirement === "Other" && (
                    <input
                      type="text"
                      placeholder="Describe your requirement"
                      value={otherRequirement}
                      onChange={(e) => setOtherRequirement(e.target.value)}
                      className="mt-3 w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2"
                    />
                  )}
                  {errors.requirement && (
                    <p
                      id="requirement-error"
                      className="mt-1 text-sm text-red-600"
                    >
                      {errors.requirement}
                    </p>
                  )}
                </div>

                <div>
                  <span className="block text-sm font-medium">
                    Interested in (optional)
                  </span>
                  <div className="mt-2 space-y-2">
                    {interestOptions.map((opt) => (
                      <label key={opt} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={interests.includes(opt)}
                          onChange={() => toggleInterest(opt)}
                          className="w-4 h-4 text-[#C69B4B] border-gray-300 rounded focus:ring-[#C69B4B]"
                        />
                        <span>{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="flex items-start space-x-2">
                    <input
                      type="checkbox"
                      checked={consent}
                      onChange={(e) => setConsent(e.target.checked)}
                      className={`mt-1 w-4 h-4 text-[#C69B4B] border-gray-300 rounded focus:ring-[#C69B4B] ${errors.consent ? "border-red-500" : ""}`}
                      aria-invalid={!!errors.consent}
                      aria-describedby={
                        errors.consent ? "consent-error" : undefined
                      }
                    />
                    <span className="text-sm">
                      I agree to be contacted by Buildora Enterprise for my
                      inquiry.
                    </span>
                  </label>
                  {errors.consent && (
                    <p id="consent-error" className="mt-1 text-sm text-red-600">
                      {errors.consent}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full py-3 font-semibold text-white rounded-2xl focus:outline-none focus:ring-2"
                  style={{
                    background: beTokens.colors.gold,
                    borderRadius: beTokens.radii.button,
                  }}
                >
                  Send My Requirement
                </button>
              </form>
            </div>
          </div>
        </section>

        {/* Banner Section */}
        <section className="w-full">
          <img
            src="https://via.placeholder.com/1200x675"
            alt=""
            loading="lazy"
            className="w-full object-cover aspect-[16/9] md:rounded-3xl"
          />
          {/* TODO: replace src with /public/banner.jpg */}
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-10">
        <div
          className="mx-auto px-4 py-8 text-sm flex flex-col md:flex-row md:justify-between gap-4"
          style={{ maxWidth: beTokens.spacing.containerDesktop }}
        >
          <div className="flex flex-wrap items-center gap-3 text-[#666]">
            <a href="#" className="hover:underline">
              About
            </a>
            <span>·</span>
            <a href="#" className="hover:underline">
              Terms
            </a>
            <span>·</span>
            <a href="#" className="hover:underline">
              Privacy
            </a>
            <span>·</span>
            <a href="#" className="hover:underline">
              Contact
            </a>
          </div>
          <p
            className="text-center md:text-right"
            style={{ color: beTokens.colors.text }}
          >
            © {new Date().getFullYear()} Buildora Enterprise. All rights
            reserved.
          </p>
        </div>
      </footer>

      {/* Sticky CTA */}
      {showSticky && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg p-4 pb-[calc(env(safe-area-inset-bottom)+16px)]">
          <button
            onClick={scrollToForm}
            className="w-full py-3 font-semibold text-white rounded-2xl focus:outline-none focus:ring-2"
            style={{
              background: beTokens.colors.gold,
              borderRadius: beTokens.radii.button,
            }}
          >
            Send My Requirement
          </button>
        </div>
      )}
    </div>
  );
}
