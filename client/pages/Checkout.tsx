import { useState } from "react";
import { submitOrder } from "@/lib/interior";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function Checkout() {
  const [preferredAt, setPreferredAt] = useState("");
  const [message, setMessage] = useState("");
  const nav = useNavigate();
  const draftId = typeof window !== "undefined" ? localStorage.getItem("interiorDraftId") : null;
  if (!draftId) return <div className="p-6">No draft order. Add designs first.</div>;

  async function onSubmit() {
    await submitOrder(draftId!, { consultationRequested: true, preferredAt: preferredAt || undefined, message: message || undefined });
    nav(`/dashboard/interior-orders/${draftId}`);
  }

  return (
    <div className="max-w-xl mx-auto p-4 md:p-6 space-y-3">
      <h1 className="text-2xl font-semibold">Book Free Consultation</h1>
      <label className="text-sm">Preferred date & time (optional)</label>
      <input type="datetime-local" value={preferredAt} onChange={(e) => setPreferredAt(e.target.value)} className="border rounded px-3 py-2 w-full" />
      <label className="text-sm">Notes for the architect (optional)</label>
      <textarea value={message} onChange={(e) => setMessage(e.target.value)} className="border rounded px-3 py-2 w-full min-h-[120px]" />
      <div className="pt-2">
        <Button onClick={onSubmit}>Submit and Request Consultation</Button>
      </div>
    </div>
  );
}

