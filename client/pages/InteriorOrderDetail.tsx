import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getInteriorOrder } from "@/lib/interior";

export default function InteriorOrderDetail() {
  const { id } = useParams();
  const { data, isLoading, isError, error } = useQuery({ queryKey: ["interior-order", id], queryFn: () => getInteriorOrder(id!), enabled: !!id });
  if (isLoading) return <div className="p-6">Loading order...</div>;
  if (isError) return <div className="p-6 text-red-600">{(error as Error).message}</div>;
  if (!data) return null;
  const o = data;
  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Order #{o.id.slice(0, 8)}</h1>
        <span className="text-sm px-2 py-1 rounded bg-muted">{o.status}</span>
      </div>
      <div className="border rounded">
        <div className="p-3 border-b font-medium">Items</div>
        <div className="p-3 space-y-2">
          {o.items.map((it) => (
            <div key={it.id} className="flex items-center justify-between">
              <div>
                <div className="font-medium">{it.title}</div>
                <div className="text-xs text-muted-foreground">Qty {it.quantity}</div>
              </div>
              <div>₹{((it.computedPriceCents * it.quantity) / 100).toLocaleString()}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="border rounded">
        <div className="p-3 border-b font-medium">Milestones</div>
        <div className="p-3 space-y-2">
          {(o.milestones || []).map((m, idx) => (
            <div key={idx} className="flex items-center justify-between text-sm">
              <div>{m.label}</div>
              <div>
                ₹{(m.amountCents / 100).toLocaleString()} • {m.status}
                {m.approved ? " • Approved" : ""}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="border rounded">
        <div className="p-3 border-b font-medium">Invoices</div>
        <div className="p-3 space-y-2 text-sm">
          {(o.invoices || []).length === 0 ? <div>No invoices yet</div> : null}
          {(o.invoices || []).map((inv) => (
            <div key={inv.id} className="flex items-center justify-between">
              <div>{inv.label || inv.id}</div>
              <a href={inv.url} className="underline" target="_blank">View</a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

