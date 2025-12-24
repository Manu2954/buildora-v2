import { useEffect, useMemo, useState } from "react";
import { apiFetch } from "@/lib/api";
import AdminCard from "@/admin/components/ui/AdminCard";

type Lead = {
  id: string;
  name: string | null;
  phone: string | null;
  status: "NEW" | "CONTACTED" | "CLOSED";
  createdAt: string;
};

type LeadListResponse =
  | { items: Lead[]; total: number }
  | Lead[];

const STATUS_STYLES: Record<Lead["status"], { bg: string; color: string; label: string }> = {
  NEW: { bg: "#F1F5F9", color: "#334155", label: "New" },
  CONTACTED: { bg: "#E8F0FE", color: "#1E40AF", label: "Contacted" },
  CLOSED: { bg: "#E7F5EC", color: "#166534", label: "Closed" },
};

function applyLocalFilters(
  leads: Lead[],
  status: string,
  q: string,
  page: number,
  pageSize: number,
) {
  const normalized = q.trim().toLowerCase();
  const filtered = leads.filter((lead) => {
    const statusOk = status === "all" || lead.status === status;
    if (!statusOk) return false;
    if (!normalized) return true;
    const name = lead.name?.toLowerCase() ?? "";
    const phone = lead.phone?.toLowerCase() ?? "";
    return name.includes(normalized) || phone.includes(normalized);
  });
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  return { items: filtered.slice(start, end), total: filtered.length };
}

export default function SalesmanLeads() {
  const [status, setStatus] = useState<string>("all");
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [rows, setRows] = useState<Lead[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(total / pageSize)),
    [total, pageSize],
  );

  async function load() {
    setLoading(true);
    const params = new URLSearchParams();
    if (status && status !== "all") params.set("status", status);
    if (q.trim()) params.set("q", q.trim());
    params.set("page", String(page));
    params.set("pageSize", String(pageSize));

    const data = await apiFetch<LeadListResponse>(
      `/api/salesman/leads?${params.toString()}`,
      { auth: true },
    );

    if (Array.isArray(data)) {
      const filtered = applyLocalFilters(data, status, q, page, pageSize);
      setRows(filtered.items);
      setTotal(filtered.total);
    } else {
      setRows(data.items ?? []);
      setTotal(data.total ?? data.items?.length ?? 0);
    }
    setLoading(false);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, pageSize]);

  return (
    <div className="space-y-4 md:space-y-6">
      <AdminCard title="My Leads">
        <div className="flex flex-col md:flex-row flex-wrap gap-3 md:items-end">
          <div>
            <label className="block text-sm mb-1 text-[#666666]">Status</label>
            <select
              className="border border-[#D9D9D9] rounded-xl px-3 py-2 min-w-[160px]"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="all">All</option>
              <option value="NEW">New</option>
              <option value="CONTACTED">Contacted</option>
              <option value="CLOSED">Closed</option>
            </select>
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm mb-1 text-[#666666]">Search</label>
            <input
              className="w-full border border-[#D9D9D9] rounded-xl px-3 py-2"
              placeholder="Name or phone"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>
          <button
            className="px-4 py-2 rounded-xl border border-[#D9D9D9]"
            onClick={() => {
              setPage(1);
              load();
            }}
            disabled={loading}
          >
            Apply
          </button>
        </div>
      </AdminCard>

      <div className="hidden md:block overflow-x-auto rounded-3xl border border-[#D9D9D9] bg-white">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500 border-b bg-[#F7F7F7]">
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Phone</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Created</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((lead) => {
              const statusMeta = STATUS_STYLES[lead.status];
              return (
                <tr key={lead.id} className="border-b last:border-b-0">
                  <td className="px-4 py-3 font-medium text-[#333132]">
                    {lead.name || "—"}
                  </td>
                  <td className="px-4 py-3">{lead.phone || "—"}</td>
                  <td className="px-4 py-3">
                    <span
                      className="text-xs rounded-full px-2 py-1 border border-[#D9D9D9]"
                      style={{ background: statusMeta.bg, color: statusMeta.color }}
                    >
                      {statusMeta.label}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {new Date(lead.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              );
            })}
            {rows.length === 0 && (
              <tr>
                <td className="px-4 py-8 text-center text-gray-500" colSpan={4}>
                  {loading ? "Loading..." : "No leads found"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="md:hidden space-y-3">
        {rows.map((lead) => {
          const statusMeta = STATUS_STYLES[lead.status];
          return (
            <div
              key={lead.id}
              className="bg-white border border-[#D9D9D9] rounded-3xl p-4 shadow-sm"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="font-medium text-[#333132] break-words">
                  {lead.name || "—"}
                </div>
                <div className="text-xs text-[#666666]">
                  {new Date(lead.createdAt).toLocaleDateString()}
                </div>
              </div>
              <div className="text-sm text-[#666666] break-words">
                {lead.phone || "—"}
              </div>
              <div className="mt-3">
                <span
                  className="text-xs rounded-full px-2 py-1 border border-[#D9D9D9]"
                  style={{ background: statusMeta.bg, color: statusMeta.color }}
                >
                  {statusMeta.label}
                </span>
              </div>
            </div>
          );
        })}
        {rows.length === 0 && (
          <div className="text-center text-[#666666]">
            {loading ? "Loading..." : "No leads found"}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">
          Page {page} of {totalPages} • {total} total
        </div>
        <div className="flex gap-2">
          <button
            className="px-3 py-1 rounded border"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            Prev
          </button>
          <button
            className="px-3 py-1 rounded border"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          >
            Next
          </button>
          <select
            className="border rounded px-2"
            value={pageSize}
            onChange={(e) => {
              setPageSize(parseInt(e.target.value, 10));
              setPage(1);
            }}
          >
            {[10, 20, 50, 100].map((n) => (
              <option key={n} value={n}>
                {n}/page
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
