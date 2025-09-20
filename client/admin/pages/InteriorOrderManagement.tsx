import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import type { InteriorOrderDTO } from "@shared/api";
import { Button } from "@/components/ui/button";

async function adminListInteriorOrders() {
  return apiFetch<{ total: number; orders: InteriorOrderDTO[] }>(`/api/admin/interior/orders`, { auth: true });
}
async function adminUpdateOrder(id: string, status: InteriorOrderDTO["status"]) {
  return apiFetch(`/api/admin/interior/orders/${id}`, { method: "PUT", auth: true, body: JSON.stringify({ status }) });
}

export default function InteriorOrderManagement() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ["admin-interior-orders"], queryFn: adminListInteriorOrders });
  const m = useMutation({ mutationFn: ({ id, status }: { id: string; status: InteriorOrderDTO["status"] }) => adminUpdateOrder(id, status), onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-interior-orders"] }) });
  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-semibold">Interior Orders</h1>
      {isLoading ? <div>Loading...</div> : (
        <div className="space-y-2">
          {(data?.orders || []).map((o) => (
            <div key={o.id} className="border rounded p-3 flex items-center justify-between">
              <div>
                <div className="font-medium">{o.id.slice(0,8)} • {o.status}</div>
                <div className="text-sm text-muted-foreground">Items: {o.items.length} • Total ₹{(o.totalPriceCents/100).toLocaleString()}</div>
              </div>
              <div className="flex gap-2">
                {(["QUOTATION_PENDING","IN_PROGRESS","MATERIAL_PROCUREMENT","EXECUTION","COMPLETED","CANCELLED"] as const).map(s => (
                  <Button key={s} size="sm" variant={o.status===s?"default":"outline"} onClick={()=>m.mutate({id:o.id,status:s})}>{s.replace(/_/g, " ")}</Button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
