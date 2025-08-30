import { Star } from "lucide-react";

interface StarRatingProps {
  value: number;
  max?: number;
  onChange?: (next: number) => void;
  disabled?: boolean;
  label?: string;
}

export function StarRating({ value, max = 5, onChange, disabled, label }: StarRatingProps) {
  const items = Array.from({ length: max }, (_, i) => i + 1);
  return (
    <div>
      {label ? (
        <label className="block text-sm font-medium text-[#333132] mb-2">{label}</label>
      ) : null}
      <div role="radiogroup" aria-label={label ?? "Rating"} className="flex items-center gap-1">
        {items.map((n) => (
          <button
            key={n}
            type="button"
            role="radio"
            aria-checked={value >= n}
            onClick={() => !disabled && onChange && onChange(n)}
            disabled={disabled}
            className="p-1 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C69B4B] disabled:opacity-60"
            aria-label={`${n} star${n > 1 ? "s" : ""}`}
          >
            <Star
              className={`h-6 w-6 ${value >= n ? "fill-[#C69B4B] text-[#C69B4B]" : "text-[#D9D9D9]"}`}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
