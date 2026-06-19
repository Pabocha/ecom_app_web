import { useNavigate } from 'react-router-dom';
import { History } from 'lucide-react';
import { mockRecentViews } from '@/features/profile/data/profileData';

function formatPrice(price) {
  return new Intl.NumberFormat('fr-FR').format(price) + ' FCFA';
}

export default function ProfileRecentViews() {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-lg shadow-sm p-5">
      <div className="flex items-center gap-3 mb-5">
        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100 text-orange-500">
          <History size={18} />
        </span>
        <div>
          <h2 className="text-[16px] font-black text-[#0d1b2a]">Vus récemment</h2>
          <p className="text-[12px] text-gray-400">Les produits que vous avez consultés</p>
        </div>
      </div>
      <div className="space-y-3">
        {mockRecentViews.length === 0 ? (
          <p className="text-[13px] text-gray-400 text-center py-6">Aucun produit consulté récemment</p>
        ) : (
          mockRecentViews.map(item => (
            <div key={item.id} className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:border-orange-200 transition-colors cursor-pointer" onClick={() => navigate(`/product/${item.id}`)}>
              <div className="w-14 h-14 rounded-lg overflow-hidden bg-gray-50 shrink-0">
                <img src={item.img} alt={item.name} className="w-full h-full object-cover" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[13px] font-bold text-[#0d1b2a] truncate">{item.name}</div>
                <div className="text-[12px] font-['Barlow_Condensed'] font-black text-orange-500">{formatPrice(item.price)}</div>
              </div>
              <button className="shrink-0 text-gray-400 hover:text-orange-500 transition-colors">
                <History size={16} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
