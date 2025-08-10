import { useState } from "react";

interface FormData {
  fullName: string;
  mobile: string;
  location: string;
  requirement: string;
  otherDescription: string;
  interests: string[];
  consent: boolean;
}

interface FormErrors {
  fullName?: string;
  mobile?: string;
  location?: string;
  requirement?: string;
  consent?: string;
}

function Form() {
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    mobile: "",
    location: "",
    requirement: "",
    otherDescription: "",
    interests: [],
    consent: false,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const requirementOptions = [
    "Interior Supplies/Products",
    "Modular Kitchen",
    "Wardrobe or Storage",
    "TV Unit or Showcase",
    "Full Home Interiors",
    "Other",
  ];

  const interestOptions = [
    "Interior Supplies/Products",
    "Modular Kitchen",
    "Wardrobe or Storage",
    "TV Unit or Showcase",
    "Full Home Interiors",
  ];

  const validateForm = (): FormErrors => {
    const newErrors: FormErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    if (!formData.mobile.trim()) {
      newErrors.mobile = "Mobile number is required";
    } else if (!/^[0-9]{10}$/.test(formData.mobile.replace(/\s/g, ""))) {
      newErrors.mobile = "Please enter a valid 10-digit mobile number";
    }

    if (!formData.location.trim()) {
      newErrors.location = "Location is required";
    }

    if (!formData.requirement) {
      newErrors.requirement = "Please select your requirement";
    }

    if (!formData.consent) {
      newErrors.consent = "You must agree to be contacted";
    }

    return newErrors;
  };

  const handleInputChange = (
    field: keyof FormData,
    value: string | boolean | string[],
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleInterestToggle = (interest: string) => {
    const newInterests = formData.interests.includes(interest)
      ? formData.interests.filter((i) => i !== interest)
      : [...formData.interests, interest];

    handleInputChange("interests", newInterests);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    console.log("Form submitted:", formData);

    setFormData({
      fullName: "",
      mobile: "",
      location: "",
      requirement: "",
      otherDescription: "",
      interests: [],
      consent: false,
    });
    setErrors({});
    setIsSubmitted(true);

    setTimeout(() => {
      setIsSubmitted(false);
    }, 5000);
  };

  if (isSubmitted) {
    return (
      <div className="bg-white p-8 rounded-2xl shadow-lg animate-fade-in">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-green-600"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-text-base mb-2">
            Thank You!
          </h3>
          <p className="text-gray-600 leading-relaxed">
            Our team will connect with you shortly to understand your
            requirement and begin your project.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 lg:p-8 rounded-2xl shadow-lg animate-slide-up">
      <h2 className="text-2xl font-bold text-text-base mb-6 text-center lg:text-left">
        Get Started Today
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="form-label">Full Name *</label>
          <input
            type="text"
            value={formData.fullName}
            onChange={(e) => handleInputChange("fullName", e.target.value)}
            className="form-input"
            placeholder="Enter your full name"
          />
          {errors.fullName && <p className="form-error">{errors.fullName}</p>}
        </div>

        <div>
          <label className="form-label">Mobile Number *</label>
          <input
            type="tel"
            value={formData.mobile}
            onChange={(e) => handleInputChange("mobile", e.target.value)}
            className="form-input"
            placeholder="Enter your mobile number"
          />
          {errors.mobile && <p className="form-error">{errors.mobile}</p>}
        </div>

        <div>
          <label className="form-label">Your Location *</label>
          <input
            type="text"
            value={formData.location}
            onChange={(e) => handleInputChange("location", e.target.value)}
            className="form-input"
            placeholder="Enter your city/location"
          />
          {errors.location && <p className="form-error">{errors.location}</p>}
        </div>

        <div>
          <label className="form-label">
            Select or Describe Your Requirement *
          </label>
          <select
            value={formData.requirement}
            onChange={(e) => handleInputChange("requirement", e.target.value)}
            className="form-input"
          >
            <option value="">Choose your requirement</option>
            {requirementOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          {errors.requirement && (
            <p className="form-error">{errors.requirement}</p>
          )}
        </div>

        {formData.requirement === "Other" && (
          <div>
            <label className="form-label">
              Please describe your requirement
            </label>
            <textarea
              value={formData.otherDescription}
              onChange={(e) =>
                handleInputChange("otherDescription", e.target.value)
              }
              className="form-input h-24 resize-none"
              placeholder="Tell us about your specific requirements..."
            />
          </div>
        )}

        <div>
          <label className="form-label">Additional Interests (Optional)</label>
          <div className="space-y-2">
            {interestOptions.map((interest) => (
              <label
                key={interest}
                className="flex items-center gap-3 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={formData.interests.includes(interest)}
                  onChange={() => handleInterestToggle(interest)}
                  className="w-4 h-4 text-brand-gold border-gray-300 rounded focus:ring-brand-gold focus:ring-2"
                />
                <span className="text-sm text-text-base">{interest}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.consent}
              onChange={(e) => handleInputChange("consent", e.target.checked)}
              className="w-4 h-4 text-brand-gold border-gray-300 rounded focus:ring-brand-gold focus:ring-2 mt-0.5"
            />
            <span className="text-sm text-text-base">
              I agree to be contacted by Buildora Enterprise for my inquiry. *
            </span>
          </label>
          {errors.consent && <p className="form-error">{errors.consent}</p>}
        </div>

        <button type="submit" className="w-full btn-primary text-lg">
          Send My Requirement
        </button>
      </form>
    </div>
  );
}

export default Form;
