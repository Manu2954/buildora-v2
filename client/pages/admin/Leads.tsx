import { useEffect, useMemo, useState } from "react";
import { apiFetch } from "@/lib/api";
import { Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AdminCard from "@/admin/components/ui/AdminCard";

type Lead = { id: string; name: string | null; phone: string | null; email: string | null; status: "NEW"|"CONTACTED"|"CLOSED"; createdAt: string };

export default function Leads() {
  const navigate = useNavigate();
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [status, setStatus] = useState<string>("all");
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [rows, setRows] = useState<Lead[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const totalPages = useMemo(() => Math.max(1, Math.ceil(total / pageSize)), [total, pageSize]);

  async function load() {
    setLoading(true);
    const params = new URLSearchParams();
    if (from) params.set("from", from);
    if (to) params.set("to", to);
    if (status) params.set("status", status);
    if (q) params.set("q", q);
    params.set("page", String(page));
    params.set("pageSize", String(pageSize));
    const data = await apiFetch<{ items: Lead[]; total: number }>(`/api/cta/leads?${params.toString()}`, { auth: true });
    setRows(data.items);
    setTotal(data.total);
    setLoading(false);
  }

  useEffect(() => { load(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [page, pageSize]);

  async function updateStatus(id: string, next: Lead["status"]) {
    await apiFetch(`/api/cta/leads/${id}`, { method: "PATCH", body: JSON.stringify({ status: next }), auth: true });
    setRows((r) => r.map((x) => (x.id === id ? { ...x, status: next } : x)));
  }

  return (
    <div className="space-y-4 md:space-y-6">
      <AdminCard title="Lead Analytics">
        <div className="flex flex-col md:flex-row flex-wrap gap-3 md:items-end">
          <div>
            <label className="block text-sm mb-1 text-[#666666]">From</label>
            <input type="date" className="border border-[#D9D9D9] rounded-xl px-3 py-2" value={from} onChange={(e)=>setFrom(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm mb-1 text-[#666666]">To</label>
            <input type="date" className="border border-[#D9D9D9] rounded-xl px-3 py-2" value={to} onChange={(e)=>setTo(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm mb-1 text-[#666666]">Status</label>
            <select className="border border-[#D9D9D9] rounded-xl px-3 py-2 min-w-[140px]" value={status} onChange={(e)=>setStatus(e.target.value)}>
              <option value="all">All</option>
              <option value="NEW">New</option>
              <option value="CONTACTED">Contacted</option>
              <option value="CLOSED">Closed</option>
            </select>
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm mb-1 text-[#666666]">Search</label>
            <input className="w-full border border-[#D9D9D9] rounded-xl px-3 py-2" placeholder="Name, email or phone" value={q} onChange={(e)=>setQ(e.target.value)} />
          </div>
          <button className="px-4 py-2 rounded-xl border border-[#D9D9D9]" onClick={()=>{ setPage(1); load(); }} disabled={loading}>Apply</button>
        </div>
      </AdminCard>

      {/* Table (desktop) */}
      <div className="hidden md:block overflow-x-auto rounded-3xl border border-[#D9D9D9] bg-white">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500 border-b bg-[#F7F7F7]">
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Mobile</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Created</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr
                key={r.id}
                className="border-b last:border-b-0 cursor-pointer hover:bg-gray-50"
                onClick={()=>navigate(`/admin/cta/leads/${r.id}`)}
              >
                <td className="px-4 py-3 font-medium text-[#333132]">{r.name || "—"}</td>
                <td className="px-4 py-3">{r.phone || "—"}</td>
                <td className="px-4 py-3">
                  <select
                    className="text-xs rounded-full px-2 py-1 border border-[#D9D9D9]"
                    style={{
                      background: r.status === "NEW" ? "#F1F5F9" : r.status === "CONTACTED" ? "#E8F0FE" : "#E7F5EC",
                      color: r.status === "NEW" ? "#334155" : r.status === "CONTACTED" ? "#1E40AF" : "#166534",
                    }}
                    value={r.status}
                    onClick={(e)=>e.stopPropagation()}
                    onChange={(e)=>{ e.stopPropagation(); updateStatus(r.id, e.target.value as any); }}
                  >
                    <option value="NEW">new</option>
                    <option value="CONTACTED">contacted</option>
                    <option value="CLOSED">closed</option>
                  </select>
                </td>
                <td className="px-4 py-3">{new Date(r.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td className="px-4 py-8 text-center text-gray-500" colSpan={5}>{loading ? "Loading..." : "No leads found"}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile list */}
      <div className="md:hidden space-y-3">
        {rows.map((r)=> (
          <div key={r.id} className="bg-white border border-[#D9D9D9] rounded-3xl p-4 shadow-sm" onClick={()=>navigate(`/admin/cta/leads/${r.id}`)}>
            <div className="flex items-center justify-between mb-2">
              <div className="font-medium text-[#333132] break-words">{r.name || "—"}</div>
              <div className="text-xs text-[#666666]">{new Date(r.createdAt).toLocaleDateString()}</div>
            </div>
            <div className="text-sm text-[#666666] break-words">{r.phone || "—"}</div>
            <div className="mt-3">
              <select
                className="text-xs rounded-full px-2 py-1 border border-[#D9D9D9]"
                style={{
                  background: r.status === "NEW" ? "#F1F5F9" : r.status === "CONTACTED" ? "#E8F0FE" : "#E7F5EC",
                  color: r.status === "NEW" ? "#334155" : r.status === "CONTACTED" ? "#1E40AF" : "#166534",
                }}
                value={r.status}
                onClick={(e)=>e.stopPropagation()}
                onChange={(e)=>{ e.stopPropagation(); updateStatus(r.id, e.target.value as any); }}
              >
                <option value="NEW">new</option>
                <option value="CONTACTED">contacted</option>
                <option value="CLOSED">closed</option>
              </select>
            </div>
          </div>
        ))}
        {rows.length === 0 && (
          <div className="text-center text-[#666666]">{loading ? "Loading..." : "No leads found"}</div>
        )}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">Page {page} of {totalPages} • {total} total</div>
        <div className="flex gap-2">
          <button className="px-3 py-1 rounded border" disabled={page<=1} onClick={()=>setPage((p)=>Math.max(1,p-1))}>Prev</button>
          <button className="px-3 py-1 rounded border" disabled={page>=totalPages} onClick={()=>setPage((p)=>Math.min(totalPages,p+1))}>Next</button>
          <select className="border rounded px-2" value={pageSize} onChange={(e)=>{ setPageSize(parseInt(e.target.value,10)); setPage(1); }}>
            {[10,20,50,100].map(n=> <option key={n} value={n}>{n}/page</option>)}
          </select>
        </div>
      </div>
    </div>
  );
}
