import { MessageSquare, Star } from 'lucide-react';
import Button from '@/components/ui/Button';
import { mockPendingReviews } from '@/features/profile/data/profileData';

export default function ProfileReviews() {
  return (
    <div className="bg-white rounded-lg shadow-sm p-5">
      <div className="flex items-center gap-3 mb-5">
        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100 text-orange-500">
          <MessageSquare size={18} />
        </span>
        <div>
          <h2 className="text-[16px] font-black text-[#0d1b2a]">Avis en attente</h2>
          <p className="text-[12px] text-gray-400">Donnez votre avis sur les produits achetés</p>
        </div>
      </div>
      <div className="space-y-3">
        {mockPendingReviews.length === 0 ? (
          <p className="text-[13px] text-gray-400 text-center py-6">Aucun avis en attente</p>
        ) : (
          mockPendingReviews.map(item => (
            <div key={item.id} className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:border-orange-200 transition-colors">
              <div className="w-14 h-14 rounded-lg overflow-hidden bg-gray-50 shrink-0">
                <img src={item.img} alt={item.name} className="w-full h-full object-cover" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[13px] font-bold text-[#0d1b2a] truncate">{item.name}</div>
                <div className="text-[11px] text-gray-400">Acheté le {item.date}</div>
              </div>
              <Button size="sm">
                <Star size={12} /> Noter
              </Button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
