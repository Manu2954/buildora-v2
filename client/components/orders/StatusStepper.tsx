export type ProjectStatus =
  | "Quotation Pending"
  | "In Progress"
  | "Material Procurement"
  | "Execution"
  | "Completed"
  | "On Hold"
  | "Cancelled";

const orderedSteps: Exclude<ProjectStatus, "On Hold" | "Cancelled">[] = [
  "Quotation Pending",
  "In Progress",
  "Material Procurement",
  "Execution",
  "Completed",
];

function statusIndex(status: ProjectStatus): number {
  const i = orderedSteps.indexOf(status as any);
  if (i >= 0) return i;
  if (status === "On Hold") return 2;
  if (status === "Cancelled") return 1;
  return 0;
}

export function StatusStepper({ status }: { status: ProjectStatus }) {
  const current = statusIndex(status);
  const isCancelled = status === "Cancelled";
  const isOnHold = status === "On Hold";

  return (
    <div className="rounded-2xl border border-[#D9D9D9] bg-[#F9F9F9] p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span
            className={`inline-block h-2.5 w-2.5 rounded-full ${
              isCancelled
                ? "bg-red-500"
                : isOnHold
                ? "bg-amber-500"
                : "bg-[#C69B4B]"
            }`}
          />
          <span className="text-sm font-medium text-[#333132]">Current Status:</span>
          <span className={`text-sm font-semibold ${isCancelled ? "text-red-600" : isOnHold ? "text-amber-600" : "text-[#333132]"}`}>
            {status}
          </span>
        </div>
        <span className="hidden sm:block text-xs text-[#666666]">Steps</span>
      </div>

      <div className="overflow-x-auto">
        <ol className="min-w-[560px] md:min-w-0 flex items-center">
          {orderedSteps.map((step, i) => {
            const done = i < current && !isCancelled;
            const active = i === current && !isCancelled;
            return (
              <li key={step} className="flex items-center flex-1">
                <div className="flex items-center">
                  <div
                    className={`relative z-10 h-7 w-7 rounded-full grid place-items-center border ${
                      done || active
                        ? "bg-[#C69B4B] border-[#C69B4B] text-white"
                        : "bg-white border-[#D9D9D9] text-[#666666]"
                    }`}
                    aria-current={active ? "step" : undefined}
                  >
                    <span className="text-[10px] font-semibold">
                      {i + 1}
                    </span>
                  </div>
                  {i < orderedSteps.length - 1 && (
                    <div
                      className={`mx-2 h-0.5 w-12 md:w-16 ${
                        i < current - (isCancelled ? 1 : 0)
                          ? "bg-[#C69B4B]"
                          : "bg-[#D9D9D9]"
                      }`}
                    />
                  )}
                </div>
                <span className="text-[11px] md:text-xs text-[#666666] ml-2 mr-3 whitespace-nowrap">
                  {step}
                </span>
              </li>
            );
          })}
        </ol>
        {isCancelled && (
          <div className="mt-3 text-xs text-red-600 font-medium">
            Project was cancelled. Timeline shown for reference.
          </div>
        )}
        {isOnHold && (
          <div className="mt-3 text-xs text-amber-700 font-medium">
            Project is on hold. Execution will resume soon.
          </div>
        )}
      </div>
    </div>
  );
}
