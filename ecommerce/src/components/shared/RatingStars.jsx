import { Star } from 'lucide-react';

export default function RatingStars({ rating = 0, size = 15 }) {
  const value = Math.min(Math.max(Number(rating) || 0, 0), 5);

  return (
    <span className="flex items-center gap-0.5">
      {Array.from({ length: 5 }, (_, i) => {
        const fill = Math.min(Math.max(value - i, 0), 1) * 100;
        return (
          <span key={i} className="relative inline-block shrink-0">
            <Star size={size} className="text-gray-200" />
            {fill > 0 && (
              <span className="absolute inset-0 overflow-hidden" style={{ width: `${fill}%` }}>
                <Star size={size} className="text-yellow-400 fill-yellow-400" />
              </span>
            )}
          </span>
        );
      })}
    </span>
  );
}
