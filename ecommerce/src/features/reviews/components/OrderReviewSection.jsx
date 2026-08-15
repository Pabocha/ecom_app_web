import { MessageSquare, Star } from 'lucide-react';
import { useOrderReviewStatus } from '@/features/reviews/hooks/useOrderReviews';
import ProductReviewForm from '@/features/reviews/components/ProductReviewForm';

export default function OrderReviewSection({ orderId }) {
  const { data, isLoading } = useOrderReviewStatus(orderId);

  const pendingProducts = (data?.products || []).filter((p) => !p.has_review);

  return (
    <div className="bg-white rounded-lg shadow-sm p-5">
      <div className="flex items-center gap-3 mb-4">
        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100 text-orange-500">
          <MessageSquare size={18} />
        </span>
        <div>
          <h3 className="text-[14px] font-black text-[#0d1b2a]">Laisser un avis</h3>
          <p className="text-[12px] text-gray-400">Votre commande est livrée, notez vos produits</p>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 animate-pulse">
              <div className="w-14 h-14 rounded-lg bg-gray-200 shrink-0" />
              <div className="flex-1">
                <div className="h-4 w-40 bg-gray-200 rounded mb-2" />
                <div className="h-3 w-24 bg-gray-200 rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : pendingProducts.length === 0 ? (
        <div className="text-center py-4">
          <Star size={28} className="mx-auto mb-2 text-gray-300" />
          <p className="text-[13px] text-gray-400">Vous avez déjà noté tous les produits de cette commande. Merci !</p>
        </div>
      ) : (
        <div className="space-y-3">
          {pendingProducts.map((entry) => (
            <ProductReviewForm
              key={entry.product?.id}
              product={entry.product || {}}
              orderItemId={entry.order_item_ids?.[0]}
            />
          ))}
        </div>
      )}
    </div>
  );
}
