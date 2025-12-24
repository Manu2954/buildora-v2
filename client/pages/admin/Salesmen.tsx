import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminCard from "@/admin/components/ui/AdminCard";
import { apiFetch } from "@/lib/api";

type SalesmanRow = {
  id: string;
  email: string;
  leadCount: number;
};

type SalesmanResponse = {
  id: string;
  email: string;
  _count?: { leadsCreated?: number };
};

export default function Salesmen() {
  const navigate = useNavigate();
  const [rows, setRows] = useState<SalesmanRow[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    apiFetch<SalesmanResponse[]>("/api/salesman/salesmen", { auth: true })
      .then((data) => {
        if (!mounted) return;
        const mapped = data.map((item) => ({
          id: item.id,
          email: item.email,
          leadCount: item._count?.leadsCreated ?? 0,
        }));
        setRows(mapped);
      })
      .catch(() => {
        if (mounted) setRows([]);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="space-y-4 md:space-y-6">
      <AdminCard title="Salesmen">
        <p className="text-sm text-[#666666]">
          Click a salesman to view their leads.
        </p>
      </AdminCard>

      <div className="hidden md:block overflow-x-auto rounded-3xl border border-[#D9D9D9] bg-white">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500 border-b bg-[#F7F7F7]">
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Leads</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={row.id}
                className="border-b last:border-b-0 cursor-pointer hover:bg-gray-50"
                onClick={() => navigate(`/admin/salesmen/${row.id}/leads`)}
              >
                <td className="px-4 py-3 font-medium text-[#333132]">
                  {row.email}
                </td>
                <td className="px-4 py-3">{row.leadCount}</td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td className="px-4 py-8 text-center text-gray-500" colSpan={2}>
                  {loading ? "Loading..." : "No salesmen found"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="md:hidden space-y-3">
        {rows.map((row) => (
          <div
            key={row.id}
            className="bg-white border border-[#D9D9D9] rounded-3xl p-4 shadow-sm"
            onClick={() => navigate(`/admin/salesmen/${row.id}/leads`)}
          >
            <div className="font-medium text-[#333132] break-words">
              {row.email}
            </div>
            <div className="text-sm text-[#666666]">{row.leadCount} leads</div>
          </div>
        ))}
        {rows.length === 0 && (
          <div className="text-center text-[#666666]">
            {loading ? "Loading..." : "No salesmen found"}
          </div>
        )}
      </div>
    </div>
  );
}
