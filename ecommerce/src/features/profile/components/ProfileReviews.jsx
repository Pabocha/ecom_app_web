import { useState } from 'react';
import { createPortal } from 'react-dom';
import { MessageSquare, Star, X } from 'lucide-react';
import Button from '@/components/ui/Button';
import { usePendingReviews } from '@/features/reviews/hooks/useOrderReviews';
import ProductReviewForm from '@/features/reviews/components/ProductReviewForm';

export default function ProfileReviews() {
  const { pendingItems, isLoading, isError } = usePendingReviews();
  const [selected, setSelected] = useState(null);

  return (
    <div className="bg-white rounded-lg shadow-sm p-5">
      <div className="flex items-center gap-3 mb-5">
        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100 text-orange-500">
          <MessageSquare size={18} />
        </span>
        <div>
          <h2 className="text-[16px] font-black text-[#0d1b2a]">Avis en attente</h2>
          <p className="text-[12px] text-gray-400">Donnez votre avis sur vos commandes livrées</p>
        </div>
      </div>

      <div className="space-y-3">
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 animate-pulse">
                <div className="w-14 h-14 rounded-lg bg-gray-200 shrink-0" />
                <div className="flex-1">
                  <div className="h-4 w-40 bg-gray-200 rounded mb-2" />
                  <div className="h-3 w-24 bg-gray-200 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : isError ? (
          <p className="text-[13px] text-red-500 text-center py-6">Une erreur est survenue lors du chargement des avis.</p>
        ) : pendingItems.length === 0 ? (
          <p className="text-[13px] text-gray-400 text-center py-6">
            Aucun avis en attente. Vos avis apparaîtront ici dès qu'une commande sera livrée.
          </p>
        ) : (
          pendingItems.map(item => (
            <div key={item.key} className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:border-orange-200 transition-colors">
              <div className="w-14 h-14 rounded-lg overflow-hidden bg-gray-50 shrink-0">
                {item.productImage ? (
                  <img src={item.productImage} alt={item.productName} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300 text-[10px]">IMG</div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[13px] font-bold text-[#0d1b2a] truncate">{item.productName}</div>
                <div className="text-[11px] text-gray-400">Commande #{item.orderNumber}</div>
              </div>
              <Button size="sm" onClick={() => setSelected(item)}>
                <Star size={12} /> Noter
              </Button>
            </div>
          ))
        )}
      </div>

      {selected && (
        <ReviewModal
          item={selected}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}

function ReviewModal({ item, onClose }) {
  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <div>
            <h2 className="text-[18px] font-black text-[#0d1b2a]">Laisser un avis</h2>
            <p className="text-[12px] text-gray-400">Commande #{item.orderNumber}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        <div className="px-6 py-5">
          <ProductReviewForm
            product={{ id: item.productId, name: item.productName, image: item.productImage }}
            orderItemId={item.orderItemId}
            onSubmitted={onClose}
          />
        </div>
      </div>
    </div>,
    document.body
  );
}
