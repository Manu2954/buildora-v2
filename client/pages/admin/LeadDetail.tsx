import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiFetch } from "@/lib/api";
import AdminCard from "@/admin/components/ui/AdminCard";
import AdminButton from "@/admin/components/ui/AdminButton";

type Lead = {
  id: string; name: string|null; phone: string|null; email: string|null;
  location: string|null; requirement: string|null; status: "NEW"|"CONTACTED"|"CLOSED";
  priority: "LOW"|"MEDIUM"|"HIGH"; followUpAt?: string|null;
  assignedTo?: { id: string; email: string; role: string } | null;
  assignedToId?: string | null;
  createdAt: string;
};

type Note = {
  id: string;
  content: string;
  createdAt: string;
  author?: { id: string; email: string } | null;
};

export default function LeadDetail() {
  const { id } = useParams();
  const nav = useNavigate();
  const [lead, setLead] = useState<Lead | null>(null);
  const [salesmen, setSalesmen] = useState<Array<{id:string;email:string}>>([]);
  const [note, setNote] = useState("");
  const [notes, setNotes] = useState<Note[]>([]);
  const [saving, setSaving] = useState(false);

  async function load() {
    const data = await apiFetch<{ lead: Lead; notes: Note[] }>(`/api/cta/leads/${id}`, { auth: true });
    setLead(data.lead);
    setNotes(data.notes || []);
  }

  async function loadUsers() {
    const data = await apiFetch<{ users: Array<{id:string;email:string;role:string}> }>(`/api/core/users?role=SALESMAN`, { auth: true });
    setSalesmen(data.users.map(u=>({id:u.id,email:u.email})));
  }

  useEffect(() => { if (id) { load(); loadUsers(); } }, [id]);

  async function savePatch(patch: Partial<Lead>) {
    setSaving(true);
    const updated = await apiFetch<Lead>(`/api/cta/leads/${id}/update`, { method: "PATCH", body: JSON.stringify(patch), auth: true });
    setLead(updated);
    setSaving(false);
  }

  async function addNote() {
    if (!note.trim()) return;
    await apiFetch(`/api/cta/leads/${id}/notes`, { method: "POST", body: JSON.stringify({ content: note }), auth: true });
    setNote("");
    // Reload to show the new note with author + timestamp
    await load();
  }

  if (!lead) return <div className="text-[#666666]">Loading...</div>;
  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl md:text-2xl font-semibold">Lead Detail</h1>
        <AdminButton variant="secondary" onClick={()=>nav(-1)}>Back</AdminButton>
      </div>

      <div className="grid md:grid-cols-2 gap-4 md:gap-6">
        <AdminCard title="Contact">
          <div className="text-sm break-words"><span className="text-[#666666]">Name:</span> {lead.name || "—"}</div>
          <div className="text-sm break-words"><span className="text-[#666666]">Email:</span> {lead.email || "—"}</div>
          <div className="text-sm break-words"><span className="text-[#666666]">Phone:</span> {lead.phone || "—"}</div>
          <div className="text-sm break-words"><span className="text-[#666666]">Location:</span> {lead.location || "—"}</div>
        </AdminCard>
        <AdminCard title="Management">
          <div className="flex gap-3 items-center">
            <label className="text-sm text-[#666666] w-28">Status</label>
            <select className="border border-[#D9D9D9] rounded-xl px-3 py-2" value={lead.status} onChange={(e)=>savePatch({ status: e.target.value as any })} disabled={saving}>
              <option value="NEW">New</option>
              <option value="CONTACTED">Contacted</option>
              <option value="CLOSED">Closed</option>
            </select>
          </div>
          <div className="flex gap-3 items-center">
            <label className="text-sm text-[#666666] w-28">Priority</label>
            <select className="border border-[#D9D9D9] rounded-xl px-3 py-2" value={lead.priority} onChange={(e)=>savePatch({ priority: e.target.value as any })} disabled={saving}>
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
            </select>
          </div>
          <div className="flex gap-3 items-center">
            <label className="text-sm text-[#666666] w-28">Follow Up</label>
            <input type="datetime-local" className="border border-[#D9D9D9] rounded-xl px-3 py-2" value={lead.followUpAt ? lead.followUpAt.slice(0,16) : ""} onChange={(e)=>savePatch({ followUpAt: e.target.value || null as any })} disabled={saving} />
          </div>
          <div className="flex gap-3 items-center">
            <label className="text-sm text-[#666666] w-28">Assigned</label>
            <select className="border border-[#D9D9D9] rounded-xl px-3 py-2" value={lead.assignedTo?.id || ""} onChange={(e)=>savePatch({ assignedToId: e.target.value || null as any })} disabled={saving}>
              <option value="">Unassigned</option>
              {salesmen.map(s=> <option key={s.id} value={s.id}>{s.email}</option>)}
            </select>
          </div>
        </AdminCard>
      </div>

      <AdminCard title="Requirement">
        <div className="text-sm whitespace-pre-wrap break-words">{lead.requirement || "—"}</div>
      </AdminCard>

      <AdminCard title="Notes">
        <div className="flex flex-col md:flex-row gap-2">
          <input className="flex-1 border border-[#D9D9D9] rounded-xl px-3 py-2" placeholder="Add note..." value={note} onChange={(e)=>setNote(e.target.value)} />
          <AdminButton onClick={addNote}>Add</AdminButton>
        </div>
        <div className="space-y-3 mt-3">
          {notes.length === 0 && (
            <div className="text-sm text-[#666666]">No notes yet.</div>
          )}
          {notes.map((n) => (
            <div key={n.id} className="border border-[#D9D9D9] rounded-2xl p-3 bg-[#FAFAFA]">
              <div className="flex items-center justify-between text-xs text-[#666666] mb-1">
                <span className="break-words">{n.author?.email || "System"}</span>
                <span>{new Date(n.createdAt).toLocaleString()}</span>
              </div>
              <div className="text-sm whitespace-pre-wrap break-words">{n.content}</div>
            </div>
          ))}
        </div>
      </AdminCard>
    </div>
  );
}
