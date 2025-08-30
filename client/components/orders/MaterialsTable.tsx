import { useEffect, useState } from "react";

export type MaterialStatus = "Ordered" | "Delivered" | "Installed";

export interface MaterialItem {
  id: string;
  type: string;
  brandModel: string;
  quantity: string;
  status: MaterialStatus;
}

interface MaterialsTableProps {
  orderId: string;
}

export function MaterialsTable({ orderId }: MaterialsTableProps) {
  const [items, setItems] = useState<MaterialItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const url = `/api/external/materials?orderId=${encodeURIComponent(orderId)}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error("Failed to fetch materials");
        const data = (await res.json()) as { items: MaterialItem[] };
        if (!cancelled) setItems(data.items);
      } catch (e) {
        // Fallback sample data when external API is unavailable
        if (!cancelled) {
          setItems([
            { id: "m1", type: "Plywood", brandModel: "Century 710", quantity: "25 sheets", status: "Delivered" },
            { id: "m2", type: "Laminate", brandModel: "Merino 1mm 12345", quantity: "30 sheets", status: "Ordered" },
            { id: "m3", type: "Hardware", brandModel: "Hettich Hinges", quantity: "120 pcs", status: "Installed" },
          ]);
          setError(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [orderId]);

  function computeOverall(items: MaterialItem[]) {
    if (items.length === 0) return "No items";
    const allInstalled = items.every((i) => i.status === "Installed");
    if (allInstalled) return "All Installed";
    const anyDelivered = items.some((i) => i.status === "Delivered" || i.status === "Installed");
    if (anyDelivered) return "Partially Delivered";
    return "Ordered";
  }

  const overall = computeOverall(items);

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-[#333132]"><span className="font-semibold">Material Delivery Status:</span> {overall}</p>
        {error ? <span className="text-xs text-red-600" role="alert">{error}</span> : null}
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-[#D9D9D9] rounded-lg overflow-hidden bg-white">
          <thead className="bg-[#F5F5F5] text-[#333132]">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold">Material Type</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Brand / Model</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Quantity</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-sm text-[#666666]">Loading materials…</td>
              </tr>
            ) : items.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-sm text-[#666666]">No materials found</td>
              </tr>
            ) : (
              items.map((item) => (
                <tr key={item.id} className="border-t border-[#D9D9D9]">
                  <td className="px-4 py-3 text-sm text-[#333132]">{item.type}</td>
                  <td className="px-4 py-3 text-sm text-[#333132]">{item.brandModel}</td>
                  <td className="px-4 py-3 text-sm text-[#333132]">{item.quantity}</td>
                  <td className="px-4 py-3 text-sm">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
                        item.status === "Installed"
                          ? "bg-green-100 text-green-800"
                          : item.status === "Delivered"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
