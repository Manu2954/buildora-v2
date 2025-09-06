import { useState } from "react";
import { Footer } from "@/components/Footer";
import BrandMark from "@/components/BrandMark";
import {
  CheckCircle,
  Shield,
  Truck,
  Users,
  MapPin
} from "lucide-react";

interface FormData {
  fullName: string;
  mobileNumber: string;
  location: string;
  requirements: string[];
  otherRequirement: string;
  consent: boolean;
}

const requirementOptions = [
  "Interior Supplies/Products",
  "Modular Kitchen",
  "Wardrobe or Storage",
  "TV Unit or Showcase",
  "Full Home Interiors",
  "Other"
];

const trustTags = [
  {
    icon: Users,
    title: "Trusted by 50+ dealers",
    subtitle: "& professionals",
    color: "from-blue-500 to-blue-600"
  },
  {
    icon: Shield,
    title: "Verified Manufacturer",
    subtitle: "Partner",
    color: "from-green-500 to-green-600"
  },
  {
    icon: Truck,
    title: "Fast Delivery",
    subtitle: "Best Prices",
    color: "from-purple-500 to-purple-600"
  },
  {
    icon: MapPin,
    title: "South India",
    subtitle: "Coverage",
    color: "from-orange-500 to-orange-600"
  }
];

export default function CTA() {
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    mobileNumber: "",
    location: "",
    requirements: [],
    otherRequirement: "",
    consent: false
  });
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    if (!formData.mobileNumber.trim()) {
      newErrors.mobileNumber = "Mobile number is required";
    } else if (!/^[6-9]\d{9}$/.test(formData.mobileNumber)) {
      newErrors.mobileNumber = "Please enter a valid 10-digit mobile number";
    }

    if (!formData.location.trim()) {
      newErrors.location = "Location is required";
    }

    if (formData.requirements.length === 0) {
      newErrors.requirements = ["Please select at least one requirement"];
    }

    if (!formData.consent) {
      newErrors.consent = true as any;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const base = import.meta.env.VITE_API_BASE_URL as string | undefined;
      const apiBase = (base && base.trim().length > 0) ? base : "";

      const requirementSummary = (() => {
        const baseReq = formData.requirements.join(", ");
        const other = formData.otherRequirement?.trim() ? ` (Other: ${formData.otherRequirement.trim()})` : "";
        return `${baseReq}${other}`;
      })();

      // Map to backend schema (now stores location, requirement, consent separately)
      const payload = {
        name: formData.fullName,
        phone: formData.mobileNumber,
        location: formData.location,
        requirement: requirementSummary,
        consent: formData.consent,
        // Optional context
        message: undefined as string | undefined,
        page: window.location.href,
        source: "cta-landing",
        variant: "default",
      };

      const res = await fetch(`${apiBase}/api/cta/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => null);
        throw new Error(err?.message || `Request failed with ${res.status}`);
      }

      // Success
      setIsSubmitted(true);
      setFormData({
        fullName: "",
        mobileNumber: "",
        location: "",
        requirements: [],
        otherRequirement: "",
        consent: false,
      });
      setErrors({});
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRequirementChange = (requirement: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      requirements: checked
        ? [...prev.requirements, requirement]
        : prev.requirements.filter(r => r !== requirement)
    }));
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setFormData(prev => ({
          ...prev,
          location: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`
        }));
      },
      () => {
        alert("Unable to retrieve your location.");
      },
      { enableHighAccuracy: true }
    );
  };

  const handleAddFromMaps = () => {
    const query = formData.location ? encodeURIComponent(formData.location) : "";
    window.open(`https://maps.google.com/?q=${query}`, "_blank");
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-[#e8e8e8]">
        <div className="pt-24 md:pt-16">
          <main className="min-h-screen flex flex-col pb-24 md:pb-0">
            <div className="flex-1 flex items-center justify-center p-8">
              <div className="text-center max-w-md bg-white rounded-2xl p-8 shadow-lg">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <h1 className="text-2xl font-bold text-[#333132] mb-4">Thank You!</h1>
                <p className="text-[#666666] mb-6 leading-relaxed">
                  Our team will connect with you shortly to understand your requirement and begin your project.
                </p>
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="bg-[#C69B4B] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#a17c36] transition-colors"
                >
                  Submit Another Request
                </button>
              </div>
            </div>
            <Footer />
          </main>
        </div>
        {/* <MobileBottomNav /> */}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#e8e8e8]">
      <div className="pt-24 md:pt-16">
      <main className="min-h-screen flex flex-col pb-24 md:pb-0">
              
              {/* Banner Image */}
              <div className="w-full h-32 md:h-48 lg:h-64 overflow-hidden">
                <img
                  src="/banner1.jpg"
                  alt="BUILDORA ENTERPRISE - Interior Design Project"
                  className="w-full h-full object-cover"
                  draggable="false"
                />
              </div>

              {/* Main Content */}
              <div className="flex-1 px-4 lg:px-8 py-8 lg:py-12">
                <div className="max-w-7xl mx-auto">
                  {submitError && (
                    <div className="mb-4 p-3 rounded-md bg-red-50 text-red-700 border border-red-200">
                      {submitError}
                    </div>
                  )}
                  
                  {/* Top Section - Branding */}
                  <div className="text-center mb-8 lg:mb-12">
                    <div className="flex items-center justify-center space-x-4 mb-6">
                      {/* Company Icon */}
                      <img
                        src="/buildora-icon.png"
                        alt="BUILDORA ENTERPRISE icon"
                        className="w-16 h-16 md:w-20 md:h-20 rounded-xl object-cover"
                      />
                      {/* Company Wordmark */}
                      <BrandMark size="lg" align="left" />
                    </div>
                  </div>

                  {/* Desktop Layout: Two Columns */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
                    
                    {/* Left Column: Hero Content & Trust Tags */}
                    <div className="space-y-8">
                      {/* Hero Headlines */}
                      <div className="text-center lg:text-left">
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#333132] mb-4 leading-tight">
                          Sourcing made simple. Building made easy.
                        </h2>
                        <p className="text-lg md:text-xl text-[#666666] leading-relaxed">
                          From modular kitchens to full interiors — the right expert is just a form away.
                        </p>
                      </div>

                      {/* Trust Tags */}
                      <div className="space-y-6">
                        <h3 className="text-xl font-semibold text-[#333132] text-center lg:text-left">
                          Why Choose <span className="inline-block align-middle ml-1"><BrandMark size="sm" align="left" /></span>?
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4">
                          {trustTags.map((tag, index) => (
                            <div
                              key={index}
                              className="flex items-center space-x-3 bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300"
                            >
                              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${tag.color} flex items-center justify-center flex-shrink-0`}>
                                <tag.icon className="h-6 w-6 text-white" />
                              </div>
                              <div>
                                <p className="font-semibold text-[#333132]">{tag.title}</p>
                                <p className="text-sm text-[#666666]">{tag.subtitle}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Right Column: Form */}
                    <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg">
                      <div className="mb-6">
                        <h3 className="text-2xl font-bold text-[#333132] mb-2">Get Started Today</h3>
                        <p className="text-[#666666]">Fill out the form below and our team will reach out to you.</p>
                      </div>

                      <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Full Name */}
                        <div>
                          <label className="block text-sm font-medium text-[#333132] mb-2">
                            Full Name <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={formData.fullName}
                            onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C69B4B] focus:border-transparent transition-all duration-200 ${errors.fullName ? 'border-red-300' : 'border-gray-300'}`}
                            placeholder="Enter your full name"
                          />
                          {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
                        </div>

                        {/* Mobile Number */}
                        <div>
                          <label className="block text-sm font-medium text-[#333132] mb-2">
                            Mobile Number <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="tel"
                            value={formData.mobileNumber}
                            onChange={(e) => setFormData({...formData, mobileNumber: e.target.value})}
                            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C69B4B] focus:border-transparent transition-all duration-200 ${errors.mobileNumber ? 'border-red-300' : 'border-gray-300'}`}
                            placeholder="Enter your 10-digit mobile number"
                            maxLength={10}
                          />
                          {errors.mobileNumber && <p className="text-red-500 text-sm mt-1">{errors.mobileNumber}</p>}
                        </div>

                        {/* Location */}
                        <div>
                          <label className="block text-sm font-medium text-[#333132] mb-2">
                            Your Location <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={formData.location}
                            onChange={(e) => setFormData({...formData, location: e.target.value})}
                            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C69B4B] focus:border-transparent transition-all duration-200 ${errors.location ? 'border-red-300' : 'border-gray-300'}`}
                            placeholder="Enter your city/location"
                          />
                          <div className="flex space-x-2 mt-2">
                            <button
                              type="button"
                              onClick={handleUseCurrentLocation}
                              className="px-3 py-2 text-sm bg-gray-100 rounded hover:bg-gray-200"
                            >
                              Use current location
                            </button>
                            <button
                              type="button"
                              onClick={handleAddFromMaps}
                              className="px-3 py-2 text-sm bg-gray-100 rounded hover:bg-gray-200"
                            >
                              Add from maps
                            </button>
                          </div>
                          {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
                        </div>

                        {/* Requirements */}
                        <div>
                          <label className="block text-sm font-medium text-[#333132] mb-3">
                            Select or Describe Your Requirement <span className="text-red-500">*</span>
                          </label>
                          <div className="space-y-3">
                            {requirementOptions.map((option) => (
                              <label key={option} className="flex items-center space-x-3 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={formData.requirements.includes(option)}
                                  onChange={(e) => handleRequirementChange(option, e.target.checked)}
                                  className="w-4 h-4 text-[#C69B4B] bg-gray-100 border-gray-300 rounded focus:ring-[#C69B4B] focus:ring-2"
                                />
                                <span className="text-[#333132]">{option}</span>
                              </label>
                            ))}
                          </div>
                          
                          {/* Other Requirement Text Box */}
                          {formData.requirements.includes("Other") && (
                            <div className="mt-3">
                              <input
                                type="text"
                                value={formData.otherRequirement}
                                onChange={(e) => setFormData({...formData, otherRequirement: e.target.value})}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C69B4B] focus:border-transparent transition-all duration-200"
                                placeholder="Please specify your requirement"
                              />
                            </div>
                          )}
                          
                          {errors.requirements && <p className="text-red-500 text-sm mt-1">Please select at least one requirement</p>}
                        </div>

                        {/* Consent Checkbox */}
                        <div>
                          <label className="flex items-start space-x-3 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={formData.consent}
                              onChange={(e) => setFormData({...formData, consent: e.target.checked})}
                              className={`w-4 h-4 text-[#C69B4B] bg-gray-100 border-gray-300 rounded focus:ring-[#C69B4B] focus:ring-2 mt-1 ${errors.consent ? 'border-red-300' : ''}`}
                            />
                            <span className="text-sm text-[#333132] leading-relaxed">
                              I agree to be contacted by BUILDORA ENTERPRISE for my inquiry. <span className="text-red-500">*</span>
                            </span>
                          </label>
                          {errors.consent && <p className="text-red-500 text-sm mt-1">You must agree to be contacted</p>}
                        </div>

                        {/* Submit Button */}
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full bg-[#C69B4B] text-white font-semibold py-4 px-6 rounded-lg hover:bg-[#a17c36] transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-[#C69B4B]/20 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95"
                        >
                          {isSubmitting ? "Sending..." : "Send My Requirement"}
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
              
              <Footer />
          </main>
        </div>
      {/* Mobile bottom navigation removed for CTA page */}
    </div>
  );
}

