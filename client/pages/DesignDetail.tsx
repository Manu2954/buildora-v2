import { useParams, useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getDesign } from "@/lib/designs";
import { addItem, createDraftOrder, getInteriorOrder } from "@/lib/interior";
import { Button } from "@/components/ui/button";
import { currentUser } from "@/lib/api";
import { useState } from "react";

export default function DesignDetail() {
  const { id } = useParams();
  const nav = useNavigate();
  const qc = useQueryClient();
  const user = currentUser<any | null>();
  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, any>>({});

  const { data, isLoading, isError, error } = useQuery({ queryKey: ["design", id], queryFn: () => getDesign(id!), enabled: !!id });

  const materialsUrl = (data as any)?.customizationOptions?.materialsApiUrl as string | undefined;
  const materialsQuery = useQuery({
    queryKey: ["materials", materialsUrl],
    queryFn: async () => {
      if (!materialsUrl) return [] as any[];
      const res = await fetch(materialsUrl);
      return res.json();
    },
    enabled: !!materialsUrl,
  });

  const m = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("Please log in to add to project cart");
      let draftId = localStorage.getItem("interiorDraftId");
      if (!draftId) {
        const draft = await createDraftOrder();
        draftId = draft.id;
        localStorage.setItem("interiorDraftId", draft.id);
      }
      await addItem(draftId!, { designId: id!, quantity, selectedOptions });
      await qc.invalidateQueries({ queryKey: ["interior-order", draftId] });
      return draftId;
    },
    onSuccess: (draftId) => {
      nav(`/cart`);
    },
  });

  if (isLoading) return <div className="p-6">Loading...</div>;
  if (isError) return <div className="p-6 text-red-600">{(error as Error).message}</div>;
  if (!data) return null;
  const d = data;
  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6">
      <div className="space-y-4">
        <img src={d.images?.[0] || "https://placehold.co/1200x800"} className="w-full h-80 object-cover rounded-md" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <h1 className="text-2xl font-semibold">{d.title}</h1>
          <div className="text-sm text-muted-foreground">{d.category} • {d.style} • {d.budget}</div>
          <div className="text-xs text-muted-foreground">Code: {(d as any)?.customizationOptions?.designCode || "-"}</div>
          <div className="text-lg">Base Price: ₹{(d.basePriceCents/100).toLocaleString()}</div>
          <div className="text-sm">{d.durationDays ? `Duration: ${d.durationDays} days` : null} {(d as any)?.customizationOptions?.recommendedRoomSize ? `• Room Size: ${(d as any)?.customizationOptions?.recommendedRoomSize}` : ""}</div>
          <p className="text-sm text-muted-foreground">{d.description}</p>
          {/* Simplified customization UI: just material/color if present */}
          <div className="space-y-2">
            {Array.isArray((d as any).customizationOptions?.materials) && (
              <select className="border rounded px-2 py-1 w-full" value={selectedOptions.material || ""} onChange={(e) => setSelectedOptions((o) => ({ ...o, material: e.target.value }))}>
                <option value="">Select Material</option>
                {(d as any).customizationOptions.materials.map((m: string) => <option key={m} value={m}>{m}</option>)}
              </select>
            )}
            {Array.isArray((d as any).customizationOptions?.colors) && (
              <select className="border rounded px-2 py-1 w-full" value={selectedOptions.color || ""} onChange={(e) => setSelectedOptions((o) => ({ ...o, color: e.target.value }))}>
                <option value="">Select Color</option>
                {(d as any).customizationOptions.colors.map((c: string) => <option key={c} value={c}>{c}</option>)}
              </select>
            )}
            <div className="flex items-center gap-2">
              <label className="text-sm">Qty</label>
              <input type="number" min={1} value={quantity} onChange={(e) => setQuantity(parseInt(e.target.value || "1"))} className="border rounded px-2 py-1 w-20" />
            </div>
            <div className="pt-2">
              <Button onClick={() => m.mutate()} disabled={m.isPending}>{m.isPending ? "Adding..." : "Add to Project Cart"}</Button>
            </div>
          </div>
        </div>
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">Materials Used</h2>
          {!materialsUrl && <div className="text-sm text-muted-foreground">No external materials source provided.</div>}
          {materialsUrl && materialsQuery.isLoading && <div className="text-sm">Loading materials...</div>}
          {materialsUrl && materialsQuery.isError && <div className="text-sm text-red-600">Failed to load materials.</div>}
          {materialsUrl && Array.isArray(materialsQuery.data) && (
            <div className="overflow-auto border rounded">
              <table className="min-w-full text-sm">
                <thead className="bg-muted">
                  <tr>
                    <th className="text-left p-2">Type</th>
                    <th className="text-left p-2">Brand</th>
                    <th className="text-left p-2">Qty</th>
                    <th className="text-left p-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {(materialsQuery.data as any[]).map((row, idx) => (
                    <tr key={idx} className="border-t">
                      <td className="p-2">{row.type ?? row.material ?? "-"}</td>
                      <td className="p-2">{row.brand ?? "-"}</td>
                      <td className="p-2">{row.qty ?? row.quantity ?? "-"}</td>
                      <td className="p-2">{row.status ?? "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        </div>
      </div>
    </div>
  );
}
