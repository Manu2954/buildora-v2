import { useState } from "react";
import { apiFetch } from "@/lib/api";
import AdminCard from "@/admin/components/ui/AdminCard";
import AdminButton from "@/admin/components/ui/AdminButton";

function fmt(d: Date) {
  return d.toISOString().slice(0, 10);
}

export default function CtaAnalytics() {
  const today = new Date();
  const last7 = new Date(Date.now() - 6 * 86400000);
  const [from, setFrom] = useState(fmt(last7));
  const [to, setTo] = useState(fmt(today));
  const [result, setResult] = useState<{ total: number; from: string; to: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const data = await apiFetch<{ total: number; from: string; to: string }>(`/api/cta/analytics?from=${from}&to=${to}`, { auth: true });
      setResult(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load analytics");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AdminCard title="CTA Analytics">
      <div className="flex flex-col md:flex-row gap-3 md:items-end">
        <div>
          <label className="block text-sm mb-1 text-[#666666]">From</label>
          <input className="border border-[#D9D9D9] rounded-xl px-3 py-2" type="date" value={from} onChange={(e)=>setFrom(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm mb-1 text-[#666666]">To</label>
          <input className="border border-[#D9D9D9] rounded-xl px-3 py-2" type="date" value={to} onChange={(e)=>setTo(e.target.value)} />
        </div>
        <AdminButton variant="secondary" onClick={load} disabled={loading}>Run</AdminButton>
      </div>
      {error && <div className="text-sm text-red-600 mt-3">{error}</div>}
      {result && (
        <div className="mt-4 border border-[#D9D9D9] rounded-3xl p-4">
          <div className="text-sm text-[#666666]">{result.from} → {result.to}</div>
          <div className="text-2xl font-bold text-[#333132]">Total Leads: {result.total}</div>
        </div>
      )}
    </AdminCard>
  );
}
