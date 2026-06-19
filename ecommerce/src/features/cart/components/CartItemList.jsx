import { formatPrice } from '@/data/data.js';
import { ShoppingCart, Trash2 } from 'lucide-react';

function variantLabel(selection) {
  return Object.entries(selection).map(([key, value]) => `${key}: ${value}`).join(' · ');
}

export default function CartItemList({ items, totalQty, onQty, onRemove, onItemClick }) {
  if (items.length === 0) {
    return (
      <div className="py-20 text-center text-gray-400">
        <ShoppingCart size={54} className="mx-auto mb-3 text-gray-200" />
        <div className="font-black text-[#0d1b2a]">Votre panier est vide</div>
        <p className="mt-1 text-[13px]">Ajoutez quelques produits avant de passer au paiement.</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-100">
      {items.map(item => (
        <article key={item.cartKey || item.id} className="p-4 grid grid-cols-[96px_1fr_auto] gap-4">
          <button onClick={() => onItemClick(item.id)} className="overflow-hidden rounded bg-gray-50">
            <img src={item.img} alt={item.name} className="h-24 w-24 object-cover transition-transform hover:scale-105" />
          </button>
          <div>
            <button onClick={() => onItemClick(item.id)} className="text-left text-[15px] font-black text-[#0d1b2a] hover:text-orange-500">
              {item.name}
            </button>
            <div className="mt-1 text-[12px] text-gray-400">{item.supplier || 'TradeHub Seller'}</div>
            {item.selectedVariants && (
              <div className="mt-1 text-[11px] font-bold text-orange-500">{variantLabel(item.selectedVariants)}</div>
            )}
            <div className="mt-3 flex items-center gap-2">
              <button onClick={() => onQty(item.cartKey || item.id, -1)} className="h-8 w-8 rounded border border-gray-200 font-black hover:border-orange-400 hover:text-orange-500">−</button>
              <span className="h-8 min-w-10 rounded bg-gray-50 px-3 text-center text-[14px] font-black leading-8">{item.qty}</span>
              <button onClick={() => onQty(item.cartKey || item.id, 1)} className="h-8 w-8 rounded border border-gray-200 font-black hover:border-orange-400 hover:text-orange-500">+</button>
              <button onClick={() => onRemove(item.cartKey || item.id)} className="ml-2 flex items-center gap-1 text-[12px] font-bold text-gray-400 hover:text-red-500">
                <Trash2 size={13} /> Retirer
              </button>
            </div>
          </div>
          <div className="text-right">
            <div className="font-['Barlow_Condensed'] text-[24px] font-black text-orange-500">{formatPrice(item.price * item.qty)}</div>
            <div className="text-[12px] text-gray-400">{formatPrice(item.price)} / unité</div>
          </div>
        </article>
      ))}
    </div>
  );
}
