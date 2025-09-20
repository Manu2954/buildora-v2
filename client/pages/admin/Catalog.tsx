import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminCreateProduct, adminListProducts, adminUpdateProduct } from "@/lib/catalog";
import { useState } from "react";

export default function Catalog() {
  const qc = useQueryClient();
  const { data } = useQuery({ queryKey: ["admin", "catalog"], queryFn: () => adminListProducts({ active: "all", page: 1, pageSize: 50 }), staleTime: 5_000 });
  const [form, setForm] = useState({ name: "", sku: "", priceCents: 0, imageUrl: "", description: "", materialsUsed: "", recommendedRoomSize: "", colorPalette: "", designCode: "" });
  const createMut = useMutation({
    mutationFn: () => adminCreateProduct({
      name: form.name,
      sku: form.sku || undefined,
      priceCents: Number(form.priceCents) || 0,
      imageUrl: form.imageUrl || undefined,
      description: form.description || undefined,
      materialsUsed: form.materialsUsed || undefined,
      recommendedRoomSize: form.recommendedRoomSize || undefined,
      colorPalette: form.colorPalette || undefined,
      designCode: form.designCode || undefined,
    }),
    onSuccess: () => { setForm({ name: "", sku: "", priceCents: 0, imageUrl: "", description: "", materialsUsed: "", recommendedRoomSize: "", colorPalette: "", designCode: "" }); qc.invalidateQueries({ queryKey: ["admin", "catalog"] }); },
  });
  const toggleMut = useMutation({
    mutationFn: ({ id, active }: { id: string; active: boolean }) => adminUpdateProduct(id, { active }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "catalog"] }),
  });
  const list = (data as any)?.rows ?? [];
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Catalog</h1>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-xl border bg-white p-4">
          <h2 className="font-semibold mb-2">Create Item</h2>
          <div className="space-y-2">
            <input className="w-full border rounded p-2" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <input className="w-full border rounded p-2" placeholder="SKU" value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} />
            <input className="w-full border rounded p-2" placeholder="Image URL" value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} />
            <textarea className="w-full border rounded p-2" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            <textarea className="w-full border rounded p-2" placeholder="Materials Used" value={form.materialsUsed} onChange={(e) => setForm({ ...form, materialsUsed: e.target.value })} />
            <input className="w-full border rounded p-2" placeholder="Recommended Room Size" value={form.recommendedRoomSize} onChange={(e) => setForm({ ...form, recommendedRoomSize: e.target.value })} />
            <select className="w-full border rounded p-2" value={form.colorPalette} onChange={(e) => setForm({ ...form, colorPalette: e.target.value })}>
              <option value="">Select Color Palette</option>
              <option value="Warm">Warm</option>
              <option value="Cool">Cool</option>
              <option value="Neutral">Neutral</option>
              <option value="Vibrant">Vibrant</option>
              <option value="Earthy">Earthy</option>
              <option value="Monochrome">Monochrome</option>
              <option value="Pastel">Pastel</option>
              <option value="Bold">Bold</option>
            </select>
            <input className="w-full border rounded p-2" placeholder="Design Code" value={form.designCode} onChange={(e) => setForm({ ...form, designCode: e.target.value })} />
            <input type="number" className="w-full border rounded p-2" placeholder="Price (cents)" value={form.priceCents} onChange={(e) => setForm({ ...form, priceCents: Number(e.target.value) || 0 })} />
            <button className="w-full rounded-md bg-[#C69B4B] hover:bg-[#B1873E] text-white py-2 disabled:opacity-50" disabled={!form.name || createMut.isPending} onClick={() => createMut.mutate()}>
              {createMut.isPending ? "Creating..." : "Create"}
            </button>
          </div>
        </div>
        <div className="rounded-xl border bg-white p-4">
          <h2 className="font-semibold mb-2">Items</h2>
          <div className="space-y-2">
            {list.map((it: any) => (
              <div key={it.id} className="rounded border p-3 flex items-center justify-between">
                <div>
                  <div className="font-medium">{it.name} {it.active ? "" : <span className="text-xs text-gray-500">(inactive)</span>}</div>
                  <div className="text-sm text-gray-700">₹{(it.priceCents / 100).toFixed(2)} {it.sku ? `• ${it.sku}` : ""}</div>
                </div>
                <button className="rounded px-3 py-1 border" onClick={() => toggleMut.mutate({ id: it.id, active: !it.active })}>{it.active ? "Disable" : "Enable"}</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
