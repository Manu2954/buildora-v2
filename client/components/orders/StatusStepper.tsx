export type ProjectStatus =
  | "Quotation Pending"
  | "In Progress"
  | "Material Procurement"
  | "Execution"
  | "Completed"
  | "On Hold"
  | "Cancelled";

const steps: Exclude<ProjectStatus, "On Hold" | "Cancelled">[] = [
  "Quotation Pending",
  "In Progress",
  "Material Procurement",
  "Execution",
  "Completed",
];

function currentIndex(status: ProjectStatus) {
  const idx = steps.indexOf(status as any);
  if (idx >= 0) return idx;
  if (status === "On Hold") return 2;
  if (status === "Cancelled") return 1;
  return 0;
}

export function StatusStepper({ status }: { status: ProjectStatus }) {
  const idx = currentIndex(status);
  const isCancelled = status === "Cancelled";
  const isOnHold = status === "On Hold";

  return (
    <div className="rounded-[24px] border border-[#D9D9D9] bg-white shadow-sm p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="text-xs text-[#666666] sm:order-2">Steps</div>
      </div>
      <div className="overflow-x-auto [-webkit-overflow-scrolling:touch]">
        <ol className="min-w-[520px] sm:min-w-0 grid grid-cols-5 gap-4 sm:gap-6">
          {steps.map((s, i) => {
            const active = i === idx && !isCancelled;
            const past = i < idx && !isCancelled;
            const circleBase = "grid place-items-center rounded-full h-10 w-10 sm:h-11 sm:w-11 border transition-colors duration-200";
            const circleClass = active
              ? `${circleBase} bg-[#C69B4B] border-[#C69B4B] text-white`
              : past
              ? `${circleBase} bg-[#F7F0E4] border-[#C69B4B] text-[#C69B4B]`
              : `${circleBase} bg-white border-[#D9D9D9] text-[#666666]`;
            const labelClass = active
              ? "mt-2 text-[11px] sm:text-xs font-semibold text-[#C69B4B] text-center"
              : "mt-2 text-[11px] sm:text-xs text-[#666666] text-center";
            return (
              <li key={s} className="snap-start flex flex-col items-center">
                <button
                  type="button"
                  className={`${circleClass} min-h-[44px] min-w-[44px]`}
                  aria-label={`Step ${i + 1}: ${s}`}
                >
                  <span className="text-[12px] sm:text-[13px] font-bold">{i + 1}</span>
                </button>
                <div className={labelClass}>{s}</div>
              </li>
            );
          })}
        </ol>
      </div>
      {(isCancelled || isOnHold) && (
        <div className={`mt-3 text-xs ${isCancelled ? "text-red-600" : "text-amber-700"}`}>
          {isCancelled ? "Project was cancelled. Timeline shown for reference." : "Project is on hold. Execution will resume soon."}
        </div>
      )}
    </div>
  );
}
