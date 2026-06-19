import { Gift } from 'lucide-react';
import { mockCoupons } from '@/features/profile/data/profileData';

export default function ProfileCoupons() {
  return (
    <div className="bg-white rounded-lg shadow-sm p-5">
      <div className="flex items-center gap-3 mb-5">
        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100 text-orange-500">
          <Gift size={18} />
        </span>
        <div>
          <h2 className="text-[16px] font-black text-[#0d1b2a]">Bons d'achat</h2>
          <p className="text-[12px] text-gray-400">Vos codes promo et réductions</p>
        </div>
      </div>
      <div className="space-y-3">
        {mockCoupons.length === 0 ? (
          <p className="text-[13px] text-gray-400 text-center py-6">Aucun bon d'achat</p>
        ) : (
          mockCoupons.map(coupon => (
            <div key={coupon.code} className={`flex items-center gap-4 p-4 rounded-lg border transition-colors ${coupon.used ? 'border-gray-100 bg-gray-50 opacity-60' : 'border-orange-200 bg-orange-50'}`}>
              <span className={`flex h-10 w-10 items-center justify-center rounded-lg ${coupon.used ? 'bg-gray-200 text-gray-400' : 'bg-orange-100 text-orange-500'}`}>
                <Gift size={18} />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className={`font-['Barlow_Condensed'] text-[18px] font-black ${coupon.used ? 'text-gray-400' : 'text-[#0d1b2a]'}`}>{coupon.code}</span>
                  {coupon.used && <span className="text-[10px] bg-gray-200 text-gray-500 font-black px-1.5 py-0.5 rounded">Utilisé</span>}
                </div>
                <div className="text-[13px] font-bold text-orange-500">{coupon.discount}</div>
                <div className="text-[11px] text-gray-400">{coupon.min} · Expire le {coupon.expires}</div>
              </div>
              {!coupon.used && (
                <button onClick={() => navigator.clipboard?.writeText(coupon.code)} className="shrink-0 bg-[#0d1b2a] text-white px-3 py-2 rounded-lg text-[11px] font-black hover:bg-[#1a2e45] transition-colors">
                  Copier
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
