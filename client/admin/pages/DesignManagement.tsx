import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import type { DesignDTO } from "@shared/api";
import { Button } from "@/components/ui/button";
import { useState } from "react";

async function adminListDesigns() {
  return apiFetch<{ total: number; items: DesignDTO[] }>(`/api/admin/designs`, { auth: true });
}
async function adminCreateDesign(input: any) {
  return apiFetch<DesignDTO>(`/api/admin/designs`, { method: "POST", auth: true, body: JSON.stringify(input) });
}

export default function DesignManagement() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ["admin-designs"], queryFn: adminListDesigns });
  // Form fields
  const [title, setTitle] = useState("");
  const [designCode, setDesignCode] = useState("");
  const [category, setCategory] = useState("");
  const [style, setStyle] = useState("");
  const [budget, setBudget] = useState<"BASIC"|"PREMIUM"|"LUXURY">("BASIC");
  const [basePriceCents, setBasePriceCents] = useState(1000000);
  const [durationDays, setDurationDays] = useState<number|"">("");
  const [imageUrl, setImageUrl] = useState("");
  const [description, setDescription] = useState("");
  const [colorPalette, setColorPalette] = useState("");
  const [recommendedRoomSize, setRecommendedRoomSize] = useState("Medium");
  const [materialsApiUrl, setMaterialsApiUrl] = useState("");

  const m = useMutation({
    mutationFn: () => adminCreateDesign({
      title,
      description: description || undefined,
      category: category || undefined,
      style: style || undefined,
      budget,
      basePriceCents,
      durationDays: durationDays === "" ? undefined : Number(durationDays),
      images: imageUrl ? [imageUrl] : [],
      customizationOptions: {
        designCode: designCode || undefined,
        colors: colorPalette ? colorPalette.split(",").map((s)=>s.trim()).filter(Boolean) : undefined,
        recommendedRoomSize,
        materialsApiUrl: materialsApiUrl || undefined,
      },
    }),
    onSuccess: () => {
      setTitle(""); setDesignCode(""); setCategory(""); setStyle(""); setBudget("BASIC"); setBasePriceCents(1000000); setDurationDays(""); setImageUrl(""); setDescription(""); setColorPalette(""); setRecommendedRoomSize("Medium"); setMaterialsApiUrl("");
      qc.invalidateQueries({ queryKey: ["admin-designs"] });
    },
  });
  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-semibold">Design Management</h1>
      <div className="border rounded p-3 space-y-2">
        <div className="font-medium">Add Design</div>
        <input value={title} onChange={(e)=>setTitle(e.target.value)} placeholder="Design name" className="border rounded px-2 py-1 w-full" />
        <input value={designCode} onChange={(e)=>setDesignCode(e.target.value)} placeholder="Design Code" className="border rounded px-2 py-1 w-full" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <input value={category} onChange={(e)=>setCategory(e.target.value)} placeholder="Room (e.g., Living Room)" className="border rounded px-2 py-1 w-full" />
          <input value={style} onChange={(e)=>setStyle(e.target.value)} placeholder="Style (e.g., Minimalist)" className="border rounded px-2 py-1 w-full" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <select value={budget} onChange={(e)=>setBudget(e.target.value as any)} className="border rounded px-2 py-1 w-full">
            <option value="BASIC">Budget: Basic</option>
            <option value="PREMIUM">Budget: Premium</option>
            <option value="LUXURY">Budget: Luxury</option>
          </select>
          <input type="number" value={basePriceCents} onChange={(e)=>setBasePriceCents(parseInt(e.target.value||"0"))} className="border rounded px-2 py-1 w-full" placeholder="Base Price (in paise/cents)" />
          <input type="number" value={durationDays as any} onChange={(e)=>setDurationDays(e.target.value as any)} className="border rounded px-2 py-1 w-full" placeholder="Duration (days)" />
        </div>
        <input value={imageUrl} onChange={(e)=>setImageUrl(e.target.value)} placeholder="Full-width Image URL" className="border rounded px-2 py-1 w-full" />
        <textarea value={description} onChange={(e)=>setDescription(e.target.value)} placeholder="Description" className="border rounded px-2 py-1 w-full min-h-[100px]" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <input value={colorPalette} onChange={(e)=>setColorPalette(e.target.value)} placeholder="Colour palette (comma separated)" className="border rounded px-2 py-1 w-full" />
          <select value={recommendedRoomSize} onChange={(e)=>setRecommendedRoomSize(e.target.value)} className="border rounded px-2 py-1 w-full">
            <option>Small</option>
            <option>Medium</option>
            <option>Large</option>
          </select>
        </div>
        <input value={materialsApiUrl} onChange={(e)=>setMaterialsApiUrl(e.target.value)} placeholder="Materials Used (external API URL returning JSON)" className="border rounded px-2 py-1 w-full" />
        <Button onClick={() => m.mutate()} disabled={!title || !basePriceCents}>Create</Button>
      </div>
      {isLoading ? <div>Loading...</div> : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {(data?.items || []).map((d) => (
            <div key={d.id} className="border rounded p-3">
              <div className="font-medium">{d.title}</div>
              <div className="text-sm text-muted-foreground">₹{(d.basePriceCents/100).toLocaleString()} • {d.budget}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
