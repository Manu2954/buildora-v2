import { useState } from "react";

type FormData = {
  name: string;
  phone: string;
  location: string;
  requirement: string;
  other: string;
  interests: string[];
  consent: boolean;
};

const requirementOptions = [
  "Interior Supplies/Products",
  "Modular Kitchen",
  "Wardrobe or Storage",
  "TV Unit or Showcase",
  "Full Home Interiors",
  "Other"
];

export default function Form() {
  const [form, setForm] = useState<FormData>({
    name: "",
    phone: "",
    location: "",
    requirement: "",
    other: "",
    interests: [],
    consent: false
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);

  const toggleInterest = (value: string) => {
    setForm((f) => {
      const interests = f.interests.includes(value)
        ? f.interests.filter((i) => i !== value)
        : [...f.interests, value];
      return { ...f, interests };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    if (!form.name.trim()) newErrors.name = "Full Name is required";
    if (!form.phone.trim()) newErrors.phone = "Mobile Number is required";
    if (!form.location.trim()) newErrors.location = "Location is required";
    if (!form.requirement) newErrors.requirement = "Please select a requirement";
    if (form.requirement === "Other" && !form.other.trim())
      newErrors.other = "Please describe your requirement";
    if (!form.consent) newErrors.consent = "Consent is required";

    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      setSuccess(true);
      setForm({
        name: "",
        phone: "",
        location: "",
        requirement: "",
        other: "",
        interests: [],
        consent: false
      });
    } else {
      setSuccess(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-3xl shadow-sm space-y-4"
    >
      {success && (
        <p className="text-green-600 text-sm">
          Thank you! Our team will connect with you shortly to understand your
          requirement and begin your project.
        </p>
      )}
      <div>
        <label className="block text-sm font-medium mb-1" htmlFor="name">
          Full Name
        </label>
        <input
          id="name"
          type="text"
          className="w-full border rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-gold"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        {errors.name && <p className="text-red-600 text-sm">{errors.name}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium mb-1" htmlFor="phone">
          Mobile Number
        </label>
        <input
          id="phone"
          type="tel"
          pattern="[0-9]{10}"
          className="w-full border rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-gold"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />
        {errors.phone && <p className="text-red-600 text-sm">{errors.phone}</p>}
      </div>
      <div>
        <label
          className="block text-sm font-medium mb-1"
          htmlFor="location"
        >
          Your Location
        </label>
        <input
          id="location"
          type="text"
          className="w-full border rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-gold"
          value={form.location}
          onChange={(e) => setForm({ ...form, location: e.target.value })}
        />
        {errors.location && (
          <p className="text-red-600 text-sm">{errors.location}</p>
        )}
      </div>
      <div>
        <label className="block text-sm font-medium mb-1" htmlFor="requirement">
          Select or Describe Your Requirement
        </label>
        <select
          id="requirement"
          className="w-full border rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-gold"
          value={form.requirement}
          onChange={(e) => setForm({ ...form, requirement: e.target.value })}
        >
          <option value="">Select...</option>
          {requirementOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        {errors.requirement && (
          <p className="text-red-600 text-sm">{errors.requirement}</p>
        )}
      </div>
      {form.requirement === "Other" ? (
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="other">
            Describe Your Requirement
          </label>
          <input
            id="other"
            type="text"
            className="w-full border rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-gold"
            value={form.other}
            onChange={(e) => setForm({ ...form, other: e.target.value })}
          />
          {errors.other && <p className="text-red-600 text-sm">{errors.other}</p>}
        </div>
      ) : (
        <div className="space-y-2">
          <p className="text-sm font-medium">Additional Interests (optional)</p>
          {requirementOptions
            .filter((o) => o !== "Other")
            .map((opt) => (
              <label key={opt} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={form.interests.includes(opt)}
                  onChange={() => toggleInterest(opt)}
                />
                <span>{opt}</span>
              </label>
            ))}
        </div>
      )}
      <div>
        <label className="flex items-start gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.consent}
            onChange={(e) => setForm({ ...form, consent: e.target.checked })}
          />
          <span>I agree to be contacted by Buildora Enterprise for my inquiry.</span>
        </label>
        {errors.consent && (
          <p className="text-red-600 text-sm">{errors.consent}</p>
        )}
      </div>
      <button
        type="submit"
        className="w-full lg:w-auto bg-brand-gold hover:bg-brand-gold600 text-white rounded-2xl px-5 py-3 font-medium transition-colors"
      >
        Send My Requirement
      </button>
    </form>
  );
}
