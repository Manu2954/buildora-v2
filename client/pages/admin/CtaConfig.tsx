import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import AdminCard from "@/admin/components/ui/AdminCard";
import AdminButton from "@/admin/components/ui/AdminButton";

export default function CtaConfig() {
  const [key, setKey] = useState("cta:homepage");
  const [jsonText, setJsonText] = useState("{}\n");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setMessage(null);
    try {
      const data = await apiFetch<{ key: string; config: Record<string, unknown> }>(`/api/cta/config?key=${encodeURIComponent(key)}`, { auth: true });
      setJsonText(JSON.stringify(data.config ?? {}, null, 2));
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Failed to load config");
    } finally {
      setLoading(false);
    }
  }

  async function save() {
    setLoading(true);
    setMessage(null);
    try {
      const parsed = JSON.parse(jsonText || "{}");
      await apiFetch(`/api/cta/config`, { method: "PUT", body: JSON.stringify({ key, config: parsed }), auth: true });
      setMessage("Saved");
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Failed to save");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AdminCard title="CTA Configuration">
      <div className="flex flex-col md:flex-row items-stretch md:items-end gap-3">
        <div className="flex-1">
          <label className="text-sm block mb-1 text-[#666666]">Config Key</label>
          <input className="w-full border border-[#D9D9D9] rounded-xl px-3 py-2" value={key} onChange={(e)=>setKey(e.target.value)} />
        </div>
        <AdminButton variant="secondary" onClick={load} disabled={loading}>Load</AdminButton>
      </div>
      {message && <div className="text-sm mt-3 text-[#666666]">{message}</div>}
      <div className="mt-4">
        <label className="text-sm block mb-1 text-[#666666]">Config (JSON)</label>
        <textarea className="w-full border border-[#D9D9D9] rounded-xl p-3 font-mono text-sm min-h-[320px]" value={jsonText} onChange={(e)=>setJsonText(e.target.value)} />
      </div>
      <div className="flex justify-end mt-4">
        <AdminButton onClick={save} disabled={loading}>Save</AdminButton>
      </div>
    </AdminCard>
  );
}
