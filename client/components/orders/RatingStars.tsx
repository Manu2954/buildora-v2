import { Star } from "lucide-react";

interface RatingStarsProps {
  value: number;
  onChange?: (v: number) => void;
  max?: number;
}

export function RatingStars({ value, onChange, max = 5 }: RatingStarsProps) {
  return (
    <div className="flex items-center gap-1" role="img" aria-label={`Rating: ${value} out of ${max} stars`}>
      {Array.from({ length: max }, (_, i) => i + 1).map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange?.(n)}
          className="p-1 rounded-md hover:bg-[#F2F2F2]"
          aria-label={`Rate ${n} star${n > 1 ? "s" : ""}`}
        >
          <Star
            className="w-5 h-5"
            fill={n <= value ? "#C69B4B" : "transparent"}
            stroke={n <= value ? "#C69B4B" : "#666666"}
          />
        </button>
      ))}
    </div>
  );
}
