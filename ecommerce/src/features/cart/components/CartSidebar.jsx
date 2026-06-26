import { memo, useMemo } from 'react';
import { formatPrice } from '@/data/data.js';
import { Loader, Lock, ShoppingCart, Trash2, X } from 'lucide-react';

function variantLabel(selection) {
  return Object.entries(selection).map(([key, value]) => `${key}: ${value}`).join(' · ');
}

const CartSidebarItem = memo(function CartSidebarItem({ item, onQty, onRemove, isLoading }) {
  const itemId = item.cartKey || item.id;

  return (
    <div key={itemId} className="flex gap-3 py-3 border-b border-gray-100">
      <img src={item.img} alt={item.name} className="w-16 h-16 rounded object-cover shrink-0" />
      <div className="flex-1 min-w-0">
        <div className="text-[13px] font-semibold text-[#0d1b2a] leading-tight mb-1 line-clamp-2">{item.name}</div>
        {item.selectedVariants && (
          <div className="text-[11px] font-bold text-orange-500 mb-1">{variantLabel(item.selectedVariants)}</div>
        )}
        <div className="font-['Barlow_Condensed'] text-[16px] font-black text-orange-500">{formatPrice(item.price)}</div>
        <div className="flex items-center gap-2 mt-1.5">
          <button onClick={() => onQty(itemId, -1)} disabled={isLoading} className="w-6 h-6 rounded bg-gray-100 hover:bg-orange-500 hover:text-white disabled:opacity-40 flex items-center justify-center text-[14px] font-bold transition-colors">−</button>
          {isLoading ? (
            <Loader size={14} className="animate-spin text-orange-500 mx-auto" />
          ) : (
            <span className="text-[14px] font-bold w-5 text-center">{item.qty}</span>
          )}
          <button onClick={() => onQty(itemId, 1)} disabled={isLoading} className="w-6 h-6 rounded bg-gray-100 hover:bg-orange-500 hover:text-white disabled:opacity-40 flex items-center justify-center text-[14px] font-bold transition-colors">+</button>
        </div>
      </div>
      <button onClick={() => onRemove(itemId)} disabled={isLoading} className="text-gray-300 hover:text-red-500 disabled:opacity-40 transition-colors self-start text-[14px]">
        <Trash2 size={14} />
      </button>
    </div>
  );
});

function CartSidebar({ open, onClose, items, onQty, onRemove, onOpenCartPage, loadingKeys }) {
  const total = useMemo(() => items.reduce((s, i) => s + i.price * i.qty, 0), [items]);
  const totalQty = useMemo(() => items.reduce((s, i) => s + i.qty, 0), [items]);

  return (
    <>
      <div onClick={onClose} className={`fixed inset-0 bg-black/50 z-[999] transition-opacity duration-300 ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} />
      <div className={`fixed top-0 right-0 w-[380px] h-screen bg-white z-[1000] flex flex-col transition-transform duration-300 ease-[cubic-bezier(.4,0,.2,1)] ${open ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="bg-[#0d1b2a] text-white px-5 py-4 flex items-center justify-between">
          <h3 className="font-bold text-[16px] flex items-center gap-2">
            <ShoppingCart size={16} /> Mon Panier ({totalQty})
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-[18px] transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {items.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <ShoppingCart size={48} className="mx-auto mb-3 text-gray-200" />
              <p className="font-medium">Votre panier est vide</p>
              <p className="text-[12px] mt-1">Ajoutez des articles pour commencer</p>
            </div>
          ) : (
            items.map((item) => {
              const itemKey = item.cartKey || String(item.id);
              return (
                <CartSidebarItem key={itemKey} item={item} onQty={onQty} onRemove={onRemove} isLoading={loadingKeys?.[itemKey]} />
              );
            })
          )}
        </div>

        {items.length > 0 && (
          <div className="p-5 border-t-2 border-gray-100 bg-gray-50">
            <div className="flex justify-between items-center mb-3.5">
              <span className="text-[14px] text-gray-400">Total ({totalQty} articles)</span>
              <span className="font-['Barlow_Condensed'] text-[24px] font-black text-orange-500">{formatPrice(total)}</span>
            </div>
            <button
              onClick={() => {
                onClose();
                onOpenCartPage?.();
              }}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3.5 text-[15px] font-black rounded transition-colors flex items-center justify-center gap-2"
            >
              <Lock size={16} /> Passer la commande
            </button>
          </div>
        )}
      </div>
    </>
  );
}

export default memo(CartSidebar);
