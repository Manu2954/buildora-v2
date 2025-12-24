import { useEffect, useState } from "react";
import AdminCard from "@/admin/components/ui/AdminCard";
import { apiFetch } from "@/lib/api";

type Entry = {
  id: string;
  entryDate: string;
  startTime: string;
  endTime: string | null;
  notes: string | null;
  location: string | null;
  salesman: { id: string; email: string };
};

const formatDate = (value?: string | null) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString();
};

const formatTime = (value?: string | null) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

export default function SalesmanEntriesAdmin() {
  const [rows, setRows] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    apiFetch<Entry[]>("/api/salesman/entries/all", { auth: true })
      .then((data) => {
        if (mounted) setRows(data);
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
      <AdminCard title="Salesman Entries">
        <p className="text-sm text-[#666666]">
          Daily entry logs across all salesmen.
        </p>
      </AdminCard>

      <div className="hidden md:block overflow-x-auto rounded-3xl border border-[#D9D9D9] bg-white">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500 border-b bg-[#F7F7F7]">
              <th className="px-4 py-3">Salesman</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Start</th>
              <th className="px-4 py-3">End</th>
              <th className="px-4 py-3">Notes</th>
              <th className="px-4 py-3">Location</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((entry) => (
              <tr key={entry.id} className="border-b last:border-b-0">
                <td className="px-4 py-3 font-medium text-[#333132]">
                  {entry.salesman?.email || "—"}
                </td>
                <td className="px-4 py-3">{formatDate(entry.entryDate || entry.startTime)}</td>
                <td className="px-4 py-3">{formatTime(entry.startTime)}</td>
                <td className="px-4 py-3">{formatTime(entry.endTime)}</td>
                <td className="px-4 py-3">{entry.notes || "-"}</td>
                <td className="px-4 py-3">{entry.location || "-"}</td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td className="px-4 py-8 text-center text-gray-500" colSpan={6}>
                  {loading ? "Loading..." : "No entries found"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="md:hidden space-y-3">
        {rows.map((entry) => (
          <div key={entry.id} className="bg-white border border-[#D9D9D9] rounded-3xl p-4 shadow-sm">
            <div className="text-sm text-[#666666]">{entry.salesman?.email || "—"}</div>
            <div className="mt-2 flex items-center justify-between">
              <div className="font-medium text-[#333132]">
                {formatDate(entry.entryDate || entry.startTime)}
              </div>
              <div className="text-xs text-[#666666]">
                {formatTime(entry.startTime)} - {formatTime(entry.endTime)}
              </div>
            </div>
            <div className="mt-2 text-sm text-[#666666]">{entry.notes || "-"}</div>
            <div className="text-xs text-[#666666]">{entry.location || "-"}</div>
          </div>
        ))}
        {rows.length === 0 && (
          <div className="text-center text-[#666666]">
            {loading ? "Loading..." : "No entries found"}
          </div>
        )}
      </div>
    </div>
  );
}
