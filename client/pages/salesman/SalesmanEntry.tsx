import { useEffect, useMemo, useState } from "react";
import AdminCard from "@/admin/components/ui/AdminCard";
import AdminButton from "@/admin/components/ui/AdminButton";
import { apiFetch } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

type Entry = {
  id: string;
  entryDate: string;
  startTime: string;
  endTime: string | null;
  notes: string | null;
  location: string | null;
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

const isSameDay = (value: string, compare: Date) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return false;
  return (
    date.getFullYear() === compare.getFullYear() &&
    date.getMonth() === compare.getMonth() &&
    date.getDate() === compare.getDate()
  );
};

export default function SalesmanEntry() {
  const { toast } = useToast();
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [location, setLocation] = useState("");
  const [notes, setNotes] = useState("");

  const activeEntry = useMemo(() => {
    const today = new Date();
    return entries.find((entry) => {
      if (entry.endTime) return false;
      const baseDate = entry.entryDate || entry.startTime;
      return isSameDay(baseDate, today);
    });
  }, [entries]);

  const loadEntries = async () => {
    setLoading(true);
    try {
      const data = await apiFetch<Entry[]>("/api/salesman/entries", { auth: true });
      setEntries(data);
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Unable to load entries";
      toast({ title: "Failed to load entries", description: msg, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEntries();
  }, []);

  const startWork = async () => {
    if (activeEntry) return;
    setSaving(true);
    try {
      const payload: Record<string, unknown> = {
        startTime: new Date().toISOString(),
      };
      const locationValue = location.trim();
      const notesValue = notes.trim();
      if (locationValue) payload.location = locationValue;
      if (notesValue) payload.notes = notesValue;

      await apiFetch("/api/salesman/entry", {
        method: "POST",
        body: JSON.stringify(payload),
        auth: true,
      });
      toast({ title: "Work started", description: "Entry created for today." });
      setLocation("");
      setNotes("");
      await loadEntries();
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Unable to start work";
      toast({ title: "Start failed", description: msg, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const endWork = async () => {
    if (!activeEntry) return;
    setSaving(true);
    try {
      await apiFetch(`/api/salesman/entry/${activeEntry.id}`, {
        method: "PATCH",
        body: JSON.stringify({ endTime: new Date().toISOString() }),
        auth: true,
      });
      toast({ title: "Work ended", description: "Entry updated." });
      await loadEntries();
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Unable to end work";
      toast({ title: "End failed", description: msg, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <AdminCard title="Daily Entry">
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm mb-1 text-[#666666]">Location (optional)</label>
              <input
                className="w-full border border-[#D9D9D9] rounded-xl px-3 py-2"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                maxLength={200}
              />
            </div>
            <div>
              <label className="block text-sm mb-1 text-[#666666]">Notes (optional)</label>
              <textarea
                className="w-full border border-[#D9D9D9] rounded-xl px-3 py-2 min-h-[80px]"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                maxLength={1000}
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-3 items-center">
            <AdminButton onClick={startWork} disabled={saving || Boolean(activeEntry)}>
              Start Work
            </AdminButton>
            {activeEntry && (
              <AdminButton variant="secondary" onClick={endWork} disabled={saving}>
                End Work
              </AdminButton>
            )}
            {activeEntry && (
              <span className="text-sm text-[#666666]">
                Active since {formatTime(activeEntry.startTime)}
              </span>
            )}
          </div>
        </div>
      </AdminCard>

      <div className="space-y-3">
        <div className="text-base md:text-lg font-semibold text-[#333132]">Previous Entries</div>

        <div className="hidden md:block overflow-x-auto rounded-3xl border border-[#D9D9D9] bg-white">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b bg-[#F7F7F7]">
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Start</th>
                <th className="px-4 py-3">End</th>
                <th className="px-4 py-3">Notes</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry) => (
                <tr key={entry.id} className="border-b last:border-b-0">
                  <td className="px-4 py-3 font-medium text-[#333132]">
                    {formatDate(entry.entryDate || entry.startTime)}
                  </td>
                  <td className="px-4 py-3">{formatTime(entry.startTime)}</td>
                  <td className="px-4 py-3">{formatTime(entry.endTime)}</td>
                  <td className="px-4 py-3">{entry.notes || "-"}</td>
                </tr>
              ))}
              {entries.length === 0 && (
                <tr>
                  <td className="px-4 py-8 text-center text-gray-500" colSpan={4}>
                    {loading ? "Loading..." : "No entries found"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="md:hidden space-y-3">
          {entries.map((entry) => (
            <div key={entry.id} className="bg-white border border-[#D9D9D9] rounded-3xl p-4 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <div className="font-medium text-[#333132]">
                  {formatDate(entry.entryDate || entry.startTime)}
                </div>
                <div className="text-xs text-[#666666]">
                  {formatTime(entry.startTime)} - {formatTime(entry.endTime)}
                </div>
              </div>
              <div className="text-sm text-[#666666]">{entry.notes || "-"}</div>
            </div>
          ))}
          {entries.length === 0 && (
            <div className="text-center text-[#666666]">
              {loading ? "Loading..." : "No entries found"}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
