import { useState } from "react";

interface FormData {
  fullName: string;
  mobile: string;
  location: string;
  requirement: string;
  otherDescription: string;
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
    value: string | boolean,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
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
      consent: false,
    });
    setErrors({});
    setIsSubmitted(true);

    setTimeout(() => {
      setIsSubmitted(false);
    }, 5000);
  };

  return (
    <div className="bg-white p-6 lg:p-8 rounded-2xl shadow-lg animate-slide-up">
      <h2 className="text-2xl font-bold text-text-base mb-6 text-center lg:text-left">
        Get Started Today
      </h2>
      {isSubmitted && (
        <div className="mb-6 p-4 text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg">
          Thank you! Our team will connect with you shortly to understand your requirement and begin your project.
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="fullName" className="form-label">Full Name *</label>
          <input
            id="fullName"
            type="text"
            value={formData.fullName}
            onChange={(e) => handleInputChange("fullName", e.target.value)}
            className="form-input"
            placeholder="Enter your full name"
          />
          {errors.fullName && <p className="form-error">{errors.fullName}</p>}
        </div>

        <div>
          <label htmlFor="mobile" className="form-label">Mobile Number *</label>
          <input
            id="mobile"
            type="tel"
            value={formData.mobile}
            onChange={(e) => handleInputChange("mobile", e.target.value)}
            className="form-input"
            placeholder="Enter your mobile number"
          />
          {errors.mobile && <p className="form-error">{errors.mobile}</p>}
        </div>

        <div>
          <label htmlFor="location" className="form-label">Your Location *</label>
          <input
            id="location"
            type="text"
            value={formData.location}
            onChange={(e) => handleInputChange("location", e.target.value)}
            className="form-input"
            placeholder="Enter your city/location"
          />
          {errors.location && <p className="form-error">{errors.location}</p>}
        </div>

        <div>
          <label htmlFor="requirement" className="form-label">
            Select or Describe Your Requirement *
          </label>
          <select
            id="requirement"
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
            <label htmlFor="otherDescription" className="form-label">
              Please describe your requirement
            </label>
            <textarea
              id="otherDescription"
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
          <div className="flex items-start gap-3">
            <input
              id="consent"
              type="checkbox"
              checked={formData.consent}
              onChange={(e) => handleInputChange("consent", e.target.checked)}
              className="w-4 h-4 text-brand-gold border-gray-300 rounded focus:ring-brand-gold focus:ring-2 mt-0.5"
            />
            <label htmlFor="consent" className="text-sm text-text-base">
              I agree to be contacted by Buildora Enterprise for my inquiry. *
            </label>
          </div>
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
