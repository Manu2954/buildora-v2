import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdminCard from "@/admin/components/ui/AdminCard";
import AdminButton from "@/admin/components/ui/AdminButton";
import { apiFetch } from "@/lib/api";

type Lead = {
  id: string;
  name: string | null;
  phone: string | null;
  email?: string | null;
  status: "NEW" | "CONTACTED" | "CLOSED";
  createdAt: string;
  createdBy?: { id: string; email: string } | null;
};

const STATUS_STYLES: Record<Lead["status"], { bg: string; color: string }> = {
  NEW: { bg: "#F1F5F9", color: "#334155" },
  CONTACTED: { bg: "#E8F0FE", color: "#1E40AF" },
  CLOSED: { bg: "#E7F5EC", color: "#166534" },
};

export default function SalesmanLeadsAdmin() {
  const navigate = useNavigate();
  const params = useParams();
  const salesmanId = params.id;
  const [rows, setRows] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(false);

  const filteredRows = useMemo(() => {
    if (!salesmanId) return rows;
    return rows.filter((lead) => lead.createdBy?.id === salesmanId);
  }, [rows, salesmanId]);

  async function load() {
    setLoading(true);
    const data = await apiFetch<Lead[]>("/api/salesman/leads/all", { auth: true });
    setRows(data);
    setLoading(false);
  }

  async function updateStatus(id: string, next: Lead["status"]) {
    await apiFetch(`/api/cta/leads/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ status: next }),
      auth: true,
    });
    setRows((r) => r.map((x) => (x.id === id ? { ...x, status: next } : x)));
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-4 md:space-y-6">
      <AdminCard
        title="Salesman Leads"
        actions={
          <AdminButton variant="secondary" onClick={() => navigate("/admin/salesmen")}>Back</AdminButton>
        }
      >
        <p className="text-sm text-[#666666]">
          Showing leads created by the selected salesman.
        </p>
      </AdminCard>

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
            {filteredRows.map((r) => (
              <tr key={r.id} className="border-b last:border-b-0">
                <td className="px-4 py-3 font-medium text-[#333132]">
                  {r.name || "—"}
                </td>
                <td className="px-4 py-3">{r.phone || "—"}</td>
                <td className="px-4 py-3">
                  <select
                    className="text-xs rounded-full px-2 py-1 border border-[#D9D9D9]"
                    style={{
                      background: STATUS_STYLES[r.status].bg,
                      color: STATUS_STYLES[r.status].color,
                    }}
                    value={r.status}
                    onChange={(e) => updateStatus(r.id, e.target.value as Lead["status"])}
                  >
                    <option value="NEW">new</option>
                    <option value="CONTACTED">contacted</option>
                    <option value="CLOSED">closed</option>
                  </select>
                </td>
                <td className="px-4 py-3">
                  {new Date(r.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
            {filteredRows.length === 0 && (
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
        {filteredRows.map((r) => (
          <div key={r.id} className="bg-white border border-[#D9D9D9] rounded-3xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="font-medium text-[#333132] break-words">{r.name || "—"}</div>
              <div className="text-xs text-[#666666]">
                {new Date(r.createdAt).toLocaleDateString()}
              </div>
            </div>
            <div className="text-sm text-[#666666] break-words">{r.phone || "—"}</div>
            <div className="mt-3">
              <select
                className="text-xs rounded-full px-2 py-1 border border-[#D9D9D9]"
                style={{
                  background: STATUS_STYLES[r.status].bg,
                  color: STATUS_STYLES[r.status].color,
                }}
                value={r.status}
                onChange={(e) => updateStatus(r.id, e.target.value as Lead["status"])}
              >
                <option value="NEW">new</option>
                <option value="CONTACTED">contacted</option>
                <option value="CLOSED">closed</option>
              </select>
            </div>
          </div>
        ))}
        {filteredRows.length === 0 && (
          <div className="text-center text-[#666666]">
            {loading ? "Loading..." : "No leads found"}
          </div>
        )}
      </div>
    </div>
  );
}
