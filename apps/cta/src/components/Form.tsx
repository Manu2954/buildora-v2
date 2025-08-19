import { useState } from "react";
import { CheckCircle } from "lucide-react";

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
  "Other",
];

function Form() {
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    mobileNumber: "",
    location: "",
    requirements: [],
    otherRequirement: "",
    consent: false,
  });
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitted(true);
      setIsSubmitting(false);
    }, 1500);
  };

  const handleRequirementChange = (requirement: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      requirements: checked
        ? [...prev.requirements, requirement]
        : prev.requirements.filter((r) => r !== requirement),
    }));
  };

  if (isSubmitted) {
    return (
      <div className="text-center max-w-md mx-auto">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>
        <h1 className="text-2xl font-bold text-[#333132] mb-4">Thank You!</h1>
        <p className="text-[#666666] mb-6 leading-relaxed">
          Our team will connect with you shortly to understand your requirement and begin your project.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg">
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-[#333132] mb-2">Get Started Today</h3>
        <p className="text-[#666666]">Fill out the form below and our team will reach out to you.</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-[#333132] mb-2">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C69B4B] focus:border-transparent transition-all duration-200 ${errors.fullName ? 'border-red-300' : 'border-gray-300'}`}
            placeholder="Enter your full name"
          />
          {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-[#333132] mb-2">
            Mobile Number <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            value={formData.mobileNumber}
            onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C69B4B] focus:border-transparent transition-all duration-200 ${errors.mobileNumber ? 'border-red-300' : 'border-gray-300'}`}
            placeholder="Enter your 10-digit mobile number"
            maxLength={10}
          />
          {errors.mobileNumber && <p className="text-red-500 text-sm mt-1">{errors.mobileNumber}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-[#333132] mb-2">
            Your Location <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C69B4B] focus:border-transparent transition-all duration-200 ${errors.location ? 'border-red-300' : 'border-gray-300'}`}
            placeholder="Enter your city/location"
          />
          {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
        </div>

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

          {formData.requirements.includes("Other") && (
            <div className="mt-3">
              <input
                type="text"
                value={formData.otherRequirement}
                onChange={(e) => setFormData({ ...formData, otherRequirement: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C69B4B] focus:border-transparent transition-all duration-200"
                placeholder="Please specify your requirement"
              />
            </div>
          )}

          {errors.requirements && (
            <p className="text-red-500 text-sm mt-1">Please select at least one requirement</p>
          )}
        </div>

        <div>
          <label className="flex items-start space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.consent}
              onChange={(e) => setFormData({ ...formData, consent: e.target.checked })}
              className={`w-4 h-4 text-[#C69B4B] bg-gray-100 border-gray-300 rounded focus:ring-[#C69B4B] focus:ring-2 mt-1 ${errors.consent ? 'border-red-300' : ''}`}
            />
            <span className="text-sm text-[#333132] leading-relaxed">
              I agree to be contacted by Buildora Enterprise for my inquiry. <span className="text-red-500">*</span>
            </span>
          </label>
          {errors.consent && <p className="text-red-500 text-sm mt-1">You must agree to be contacted</p>}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-[#C69B4B] text-white font-semibold py-4 px-6 rounded-lg hover:bg-[#a17c36] transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-[#C69B4B]/20 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95"
        >
          {isSubmitting ? "Sending..." : "Send My Requirement"}
        </button>
      </form>
    </div>
  );
}

export default Form;
