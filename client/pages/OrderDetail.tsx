import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getOrder } from "@/lib/orders";

export default function OrderDetail() {
  const { id } = useParams();
  const { data, isLoading, isError, error } = useQuery({ queryKey: ["order", id], queryFn: () => getOrder(id!), enabled: !!id });

  if (!id) return <div className="p-6">Invalid order id</div>;
  if (isLoading) return <div className="p-6">Loading...</div>;
  if (isError) return <div className="p-6 text-red-600">{(error as Error).message}</div>;

  const o = data!;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold">Order #{o.id}</h1>
      <div className="mt-2 text-sm text-gray-600">Status: {o.status}</div>
      <div className="mt-6">
        <h2 className="font-semibold">Items</h2>
        <div className="mt-2 space-y-2">
          {o.items.map((it) => (
            <div key={it.id} className="rounded border p-3">
              <div className="font-medium">{it.productName}</div>
              {it.description && <div className="text-sm text-gray-700">{it.description}</div>}
              <div className="text-sm">Qty: {it.quantity}</div>
              <div className="text-sm">Price: ₹{(it.unitPriceCents / 100).toFixed(2)}</div>
              <div className="text-sm">Line Total: ₹{(it.totalCents / 100).toFixed(2)}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-6">
        <h2 className="font-semibold">Shipping</h2>
        <div className="text-sm text-gray-700 mt-1">
          {[o.shipName, o.shipLine1, o.shipCity, o.shipState, o.shipPostalCode, o.shipCountry].filter(Boolean).join(", ")}
        </div>
      </div>
      <div className="mt-6">
        <h2 className="font-semibold">Summary</h2>
        <div className="text-sm mt-1">Subtotal: ₹{(o.subtotalCents / 100).toFixed(2)}</div>
        <div className="text-sm">Tax: ₹{(o.taxCents / 100).toFixed(2)}</div>
        <div className="text-sm">Shipping: ₹{(o.shippingCents / 100).toFixed(2)}</div>
        <div className="font-semibold">Total: ₹{(o.totalCents / 100).toFixed(2)}</div>
      </div>
    </div>
  );
}

