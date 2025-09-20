import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getInteriorOrder, deleteItem, updateItem, submitOrder } from "@/lib/interior";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { currentUser } from "@/lib/api";
import { useState } from "react";

export default function ProjectCart() {
  const user = currentUser<any | null>();
  const draftId = typeof window !== "undefined" ? localStorage.getItem("interiorDraftId") : null;
  const nav = useNavigate();
  const qc = useQueryClient();
  const { data, isLoading, isError, error } = useQuery({ queryKey: ["interior-order", draftId], queryFn: () => getInteriorOrder(draftId!), enabled: !!user && !!draftId });

  const mDel = useMutation({ mutationFn: (itemId: string) => deleteItem(draftId!, itemId), onSuccess: () => qc.invalidateQueries({ queryKey: ["interior-order", draftId] }) });

  const mUpdateQty = useMutation({ mutationFn: ({ itemId, quantity }: { itemId: string; quantity: number }) => updateItem(draftId!, itemId, { quantity }), onSuccess: () => qc.invalidateQueries({ queryKey: ["interior-order", draftId] }) });

  if (!user) return <div className="p-6">Please log in to view your project cart.</div>;
  if (!draftId) return <div className="p-6">Your project cart is empty. <Link className="underline" to="/designs">Explore designs</Link></div>;
  if (isLoading) return <div className="p-6">Loading cart...</div>;
  if (isError) return <div className="p-6 text-red-600">{(error as Error).message}</div>;
  const order = data!;
  const total = order.totalPriceCents;
  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6">
      <h1 className="text-2xl font-semibold mb-4">Project Cart</h1>
      <div className="space-y-3">
        {order.items.map((it) => (
          <div key={it.id} className="border rounded p-3 flex items-center justify-between">
            <div>
              <div className="font-medium">{it.title}</div>
              <div className="text-sm text-muted-foreground">Qty
                <input type="number" min={1} value={it.quantity} onChange={(e) => mUpdateQty.mutate({ itemId: it.id, quantity: parseInt(e.target.value || "1") })} className="ml-2 w-16 border rounded px-2 py-1" />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div>₹{((it.computedPriceCents * it.quantity)/100).toLocaleString()}</div>
              <Button variant="outline" size="sm" onClick={() => mDel.mutate(it.id)}>Remove</Button>
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between mt-6">
        <Link to="/designs" className="underline">Continue browsing</Link>
        <div className="text-lg font-medium">Total: ₹{(total/100).toLocaleString()}</div>
      </div>
      <div className="pt-4">
        <Button onClick={() => nav("/checkout")}>Proceed to Consultation</Button>
      </div>
    </div>
  );
}

