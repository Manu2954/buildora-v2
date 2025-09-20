import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { listPublicProducts } from "@/lib/catalog";
import { createOrder } from "@/lib/orders";
import { currentUser } from "@/lib/api";
import { useNavigate } from "react-router-dom";

export default function OrderItems() {
  const { data, isLoading, isError, error } = useQuery({ queryKey: ["catalog", "public"], queryFn: listPublicProducts });
  const navigate = useNavigate();
  const user = currentUser<any | null>();
  const [selected, setSelected] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", line1: "", city: "", state: "", postalCode: "", country: "IN" });

  const orderMutation = useMutation({
    mutationFn: async (product: any) => {
      return createOrder({
        items: [{
          productName: product.name,
          sku: product.sku ?? null,
          description: product.description ?? null,
          materialsUsed: product.materialsUsed ?? null,
          recommendedRoomSize: product.recommendedRoomSize ?? null,
          colorPalette: product.colorPalette ?? null,
          designCode: product.designCode ?? null,
          unitPriceCents: product.priceCents,
          quantity: 1,
        }],
        shipping: form,
      });
    },
    onSuccess: (order) => {
      navigate(`/orders/${order.id}`);
    },
  });

  if (isLoading) return <div className="p-6">Loading...</div>;
  if (isError) return <div className="p-6 text-red-600">{(error as Error).message}</div>;

  const items = data?.items ?? [];

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Choose a Package</h1>
      {!user && <div className="mb-4 text-sm text-gray-600">Please sign in to place an order.</div>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((p) => (
          <div key={p.id} className="rounded-xl border bg-white p-4 shadow-sm">
            <div className="font-semibold text-lg">{p.name}</div>
            {p.imageUrl && <img src={p.imageUrl} alt={p.name} className="mt-2 h-36 w-full object-cover rounded-md" />}
            <div className="mt-2 text-sm text-gray-700">{p.description || ""}</div>
            <div className="mt-2 font-medium">₹{(p.priceCents / 100).toFixed(2)}</div>
            <button
              className="mt-3 w-full rounded-md bg-[#C69B4B] hover:bg-[#B1873E] text-white py-2"
              disabled={!user}
              onClick={() => setSelected((s) => (s === p.id ? null : p.id))}
            >
              {selected === p.id ? "Hide Form" : "Order Now"}
            </button>
            {selected === p.id && (
              <div className="mt-3 space-y-2">
                <input className="w-full border rounded p-2" placeholder="Full Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                <input className="w-full border rounded p-2" placeholder="Address line 1" value={form.line1} onChange={(e) => setForm({ ...form, line1: e.target.value })} />
                <div className="grid grid-cols-2 gap-2">
                  <input className="border rounded p-2" placeholder="City" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
                  <input className="border rounded p-2" placeholder="State" value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <input className="border rounded p-2" placeholder="Postal Code" value={form.postalCode} onChange={(e) => setForm({ ...form, postalCode: e.target.value })} />
                  <input className="border rounded p-2" placeholder="Country (2-letter)" value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} />
                </div>
                <button
                  className="w-full rounded-md bg-black text-white py-2 disabled:opacity-50"
                  disabled={orderMutation.isPending || !form.name || !form.line1 || !form.city || !form.state || !form.postalCode || !form.country}
                  onClick={() => orderMutation.mutate(p)}
                >
                  {orderMutation.isPending ? "Placing..." : "Place Order"}
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
