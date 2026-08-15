import { useState } from 'react';
import { Star, MessageSquare } from 'lucide-react';
import Button from '@/components/ui/Button';
import { useSubmitProductReview } from '@/features/reviews/hooks/useOrderReviews';

export default function ProductReviewForm({ product, orderItemId, onSubmitted }) {
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState('');
  const submit = useSubmitProductReview();

  const serverError =
    submit.error?.response?.data?.non_field_errors?.[0] ||
    submit.error?.response?.data?.detail ||
    submit.error?.message;

  const handleSubmit = () => {
    if (!rating || !orderItemId) return;
    submit.mutate(
      {
        product: product.id,
        order_item: orderItemId,
        rating,
        comment: comment.trim(),
      },
      { onSuccess: () => onSubmitted?.() },
    );
  };

  return (
    <div className="flex items-start gap-3 p-3 rounded-lg border border-gray-100">
      <div className="w-14 h-14 rounded-lg overflow-hidden bg-gray-50 shrink-0">
        {product.image ? (
          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300 text-[10px]">IMG</div>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="text-[13px] font-bold text-[#0d1b2a] truncate">{product.name}</div>

        <div className="flex items-center gap-1 mt-1.5">
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              type="button"
              onMouseEnter={() => setHovered(value)}
              onMouseLeave={() => setHovered(0)}
              onClick={() => setRating(value)}
              className="p-0.5 transition-transform hover:scale-110"
            >
              <Star
                size={20}
                className={(value <= (hovered || rating) ? 'fill-orange-400 text-orange-400' : 'text-gray-300')}
              />
            </button>
          ))}
          <span className="ml-1 text-[11px] text-gray-400">
            {rating ? `${rating}/5` : 'Notez ce produit'}
          </span>
        </div>

        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={2}
          placeholder="Partagez votre expérience avec ce produit (optionnel)..."
          className="mt-2 w-full text-[13px] rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-300 resize-none"
        />

        {serverError && (
          <p className="mt-1 text-[12px] text-red-500">{serverError}</p>
        )}

        <div className="mt-2 flex items-center gap-3">
          <Button
            size="sm"
            loading={submit.isPending}
            disabled={!rating || !orderItemId}
            onClick={handleSubmit}
          >
            <Star size={12} /> Envoyer l'avis
          </Button>
          {submit.isSuccess && (
            <span className="text-[12px] font-bold text-green-600 flex items-center gap-1">
              <MessageSquare size={12} /> Merci pour votre avis !
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
