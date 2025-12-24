import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminCard from "@/admin/components/ui/AdminCard";
import AdminButton from "@/admin/components/ui/AdminButton";
import { apiFetch } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

export default function SalesmanLeadForm() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [location, setLocation] = useState("");
  const [requirement, setRequirement] = useState("");
  const [consent, setConsent] = useState(false);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isValidEmail = (value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  };

  const validate = () => {
    const next: Record<string, string> = {};
    if (!name.trim()) next.name = "Name is required";
    if (!phone.trim()) next.phone = "Phone is required";
    if (!location.trim()) next.location = "Location is required";
    if (!requirement.trim()) next.requirement = "Requirement is required";
    if (email.trim() && !isValidEmail(email.trim())) next.email = "Enter a valid email";
    if (!consent) next.consent = "Consent required";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    try {
      const payload: Record<string, unknown> = {
        name: name.trim(),
        phone: phone.trim(),
        location: location.trim(),
        requirement: requirement.trim(),
        consent,
      };
      const emailValue = email.trim();
      const messageValue = message.trim();
      if (emailValue) payload.email = emailValue;
      if (messageValue) payload.message = messageValue;

      await apiFetch("/api/salesman/leads", {
        method: "POST",
        body: JSON.stringify(payload),
        auth: true,
      });
      toast({ title: "Lead submitted", description: "Lead has been saved." });
      navigate("/salesman/leads", { replace: true });
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Unable to submit lead";
      toast({ title: "Submission failed", description: msg, variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <AdminCard title="New Lead">
        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm mb-1 text-[#666666]">Name</label>
              <input
                className="w-full border border-[#D9D9D9] rounded-xl px-3 py-2"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={100}
              />
              {errors.name && (
                <p className="mt-1 text-xs text-[#B91C1C]">{errors.name}</p>
              )}
            </div>
            <div>
              <label className="block text-sm mb-1 text-[#666666]">Phone</label>
              <input
                className="w-full border border-[#D9D9D9] rounded-xl px-3 py-2"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                maxLength={20}
              />
              {errors.phone && (
                <p className="mt-1 text-xs text-[#B91C1C]">{errors.phone}</p>
              )}
            </div>
            <div>
              <label className="block text-sm mb-1 text-[#666666]">Email</label>
              <input
                className="w-full border border-[#D9D9D9] rounded-xl px-3 py-2"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                maxLength={200}
              />
              {errors.email && (
                <p className="mt-1 text-xs text-[#B91C1C]">{errors.email}</p>
              )}
            </div>
            <div>
              <label className="block text-sm mb-1 text-[#666666]">Location</label>
              <input
                className="w-full border border-[#D9D9D9] rounded-xl px-3 py-2"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                maxLength={300}
              />
              {errors.location && (
                <p className="mt-1 text-xs text-[#B91C1C]">{errors.location}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm mb-1 text-[#666666]">Requirement</label>
            <textarea
              className="w-full border border-[#D9D9D9] rounded-xl px-3 py-2 min-h-[120px]"
              value={requirement}
              onChange={(e) => setRequirement(e.target.value)}
              maxLength={500}
            />
            {errors.requirement && (
              <p className="mt-1 text-xs text-[#B91C1C]">{errors.requirement}</p>
            )}
          </div>

          <div>
            <label className="block text-sm mb-1 text-[#666666]">Message</label>
            <textarea
              className="w-full border border-[#D9D9D9] rounded-xl px-3 py-2 min-h-[120px]"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              maxLength={1000}
            />
          </div>

          <div>
            <label className="flex items-start gap-2 text-sm text-[#333132]">
              <input
                type="checkbox"
                className="mt-1 h-4 w-4 rounded border border-[#D9D9D9]"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
              />
              <span>I confirm I have consent to submit this lead.</span>
            </label>
            {errors.consent && (
              <p className="mt-1 text-xs text-[#B91C1C]">{errors.consent}</p>
            )}
          </div>

          <div className="flex flex-wrap gap-3">
            <AdminButton type="submit" disabled={isSubmitting}>
              Submit
            </AdminButton>
            <AdminButton
              type="button"
              variant="secondary"
              onClick={() => navigate("/salesman/leads")}
            >
              Cancel
            </AdminButton>
          </div>
        </form>
      </AdminCard>
    </div>
  );
}
