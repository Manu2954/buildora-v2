import { useEffect, useState } from "react";
import AdminCard from "@/admin/components/ui/AdminCard";
import { apiFetch } from "@/lib/api";

function iso(d: Date) { return d.toISOString().slice(0,10); }

export default function AdminDashboard() {
  const [todayTotal, setTodayTotal] = useState<number | null>(null);
  const [weekTotal, setWeekTotal] = useState<number | null>(null);
  const [recent, setRecent] = useState<Array<{id:string;name:string|null;phone:string|null;createdAt:string}>>([]);

  useEffect(() => {
    const today = new Date();
    const weekStart = new Date(Date.now() - 6*86400000);
    (async () => {
      try {
        const td = await apiFetch<{ total: number }>(`/api/cta/analytics?from=${iso(today)}&to=${iso(today)}`, { auth: true });
        setTodayTotal(td.total);
        const wk = await apiFetch<{ total: number }>(`/api/cta/analytics?from=${iso(weekStart)}&to=${iso(today)}`, { auth: true });
        setWeekTotal(wk.total);
        const rec = await apiFetch<{ items: any[] }>(`/api/cta/leads?page=1&pageSize=5`, { auth: true });
        setRecent(rec.items);
      } catch {}
    })();
  }, []);

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl md:text-2xl font-semibold"><span className="text-[#C69B4B]">Buildora</span> <span className="text-[#333132]">Admin</span> Overview</h1>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        <AdminCard title="Leads Today">
          <div className="text-3xl font-bold text-[#333132]">{todayTotal ?? '—'}</div>
          <p className="text-sm text-[#666666]">New leads received today</p>
        </AdminCard>
        <AdminCard title="Last 7 Days">
          <div className="text-3xl font-bold text-[#333132]">{weekTotal ?? '—'}</div>
          <p className="text-sm text-[#666666]">Leads over the past week</p>
        </AdminCard>
        <AdminCard title="Conversion (placeholder)">
          <div className="text-3xl font-bold text-[#333132]">—</div>
          <p className="text-sm text-[#666666]">Hook up once projects module exists</p>
        </AdminCard>
      </div>

      {/* Recent leads */}
      <AdminCard title="Recent Leads">
        <div className="divide-y divide-[#D9D9D9]">
          {recent.map((r) => (
            <div key={r.id} className="py-3 flex items-center justify-between">
              <div className="min-w-0">
                <div className="font-medium text-[#333132] break-words">{r.name || '—'}</div>
                <div className="text-sm text-[#666666] break-words">{r.phone || '—'}</div>
              </div>
              <div className="text-xs text-[#666666] ml-4 whitespace-nowrap">{new Date(r.createdAt).toLocaleDateString()}</div>
            </div>
          ))}
          {recent.length === 0 && (
            <div className="py-6 text-sm text-[#666666]">No recent leads.</div>
          )}
        </div>
      </AdminCard>
    </div>
  );
}
