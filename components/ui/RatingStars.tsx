import { Star } from "lucide-react";
import clsx from "clsx";

export function RatingStars({
  rating,
  size = 16,
  className,
}: {
  rating: number;
  size?: number;
  className?: string;
}) {
  return (
    <div className={clsx("flex items-center gap-0.5", className)} aria-label={`${rating} / 5`}>
      {Array.from({ length: 5 }).map((_, i) => {
        const filled = i + 1 <= Math.round(rating);
        return (
          <Star
            key={i}
            size={size}
            className={filled ? "fill-gold-500 text-gold-500" : "fill-none text-charcoal-200"}
            strokeWidth={1.5}
          />
        );
      })}
    </div>
  );
}
