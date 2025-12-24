import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export type StatusFilter = "All" | "Quotation Pending" | "In Progress" | "Material Procurement" | "Execution" | "Completed" | "On Hold" | "Cancelled";
export type TypeFilter = "All" | string;

const STATUS_OPTIONS: StatusFilter[] = [
  "All",
  "Quotation Pending",
  "In Progress",
  "Material Procurement",
  "Execution",
  "Completed",
  "On Hold",
  "Cancelled",
];

interface FiltersBarProps {
  status: StatusFilter;
  type: TypeFilter;
  typeOptions?: string[];
  statusOptions?: StatusFilter[];
  disabled?: boolean;
  onStatusChange: (s: StatusFilter) => void;
  onTypeChange: (t: TypeFilter) => void;
}

export function FiltersBar({
  status,
  type,
  onStatusChange,
  onTypeChange,
  typeOptions = [],
  statusOptions = STATUS_OPTIONS,
  disabled = false,
}: FiltersBarProps) {
  const typeItems = ["All", ...typeOptions.filter(Boolean)];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <div>
        <label className="text-sm font-medium text-[#333132] mb-1 block">Status</label>
        <Select
          value={status}
          onValueChange={(v) => onStatusChange(v as StatusFilter)}
          disabled={disabled}
        >
          <SelectTrigger className="rounded-xl">
            <SelectValue placeholder="All" />
          </SelectTrigger>
          <SelectContent>
            {statusOptions.map((s) => (
              <SelectItem key={s} value={s}>{s}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <label className="text-sm font-medium text-[#333132] mb-1 block">Project Type</label>
        <Select
          value={type}
          onValueChange={(v) => onTypeChange(v as TypeFilter)}
          disabled={disabled}
        >
          <SelectTrigger className="rounded-xl">
            <SelectValue placeholder="All" />
          </SelectTrigger>
          <SelectContent>
            {typeItems.map((t) => (
              <SelectItem key={t} value={t}>{t}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
