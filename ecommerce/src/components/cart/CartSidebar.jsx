import { memo, useMemo } from 'react';
import { formatPrice } from '../../data/data.js';
import Icon from '../shared/Icon.jsx';

const CartSidebarItem = memo(function CartSidebarItem({ item, onQty, onRemove }) {
  const itemId = item.cartKey || item.id;

  return (
    <div key={itemId} className="flex gap-3 py-3 border-b border-gray-100">
      <img src={item.img} alt={item.name} className="w-16 h-16 rounded object-cover shrink-0" />
      <div className="flex-1 min-w-0">
        <div className="text-[13px] font-semibold text-[#0d1b2a] leading-tight mb-1 line-clamp-2">{item.name}</div>
        <div className="font-['Barlow_Condensed'] text-[16px] font-black text-orange-500">{formatPrice(item.price)}</div>
        <div className="flex items-center gap-2 mt-1.5">
          <button onClick={() => onQty(itemId, -1)} className="w-6 h-6 rounded bg-gray-100 hover:bg-orange-500 hover:text-white flex items-center justify-center text-[14px] font-bold transition-colors">−</button>
          <span className="text-[14px] font-bold w-5 text-center">{item.qty}</span>
          <button onClick={() => onQty(itemId, 1)} className="w-6 h-6 rounded bg-gray-100 hover:bg-orange-500 hover:text-white flex items-center justify-center text-[14px] font-bold transition-colors">+</button>
        </div>
      </div>
      <button onClick={() => onRemove(itemId)} className="text-gray-300 hover:text-red-500 transition-colors self-start text-[14px]">
        <Icon name="trash" size={14} />
      </button>
    </div>
  );
});

function CartSidebar({ open, onClose, items, onQty, onRemove, onOpenCartPage }) {
  const total = useMemo(() => items.reduce((s, i) => s + i.price * i.qty, 0), [items]);
  const totalQty = useMemo(() => items.reduce((s, i) => s + i.qty, 0), [items]);

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-black/50 z-[999] transition-opacity duration-300 ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      />
      {/* Sidebar */}
      <div className={`fixed top-0 right-0 w-[380px] h-screen bg-white z-[1000] flex flex-col transition-transform duration-300 ease-[cubic-bezier(.4,0,.2,1)] ${open ? 'translate-x-0' : 'translate-x-full'}`}>
        {/* Header */}
        <div className="bg-[#0d1b2a] text-white px-5 py-4 flex items-center justify-between">
          <h3 className="font-bold text-[16px] flex items-center gap-2">
            <Icon name="cart" /> Mon Panier ({totalQty})
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-[18px] transition-colors">
            <Icon name="times" size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-4">
          {items.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <Icon name="cartDownload" size={48} className="mx-auto mb-3 text-gray-200" />
              <p className="font-medium">Votre panier est vide</p>
              <p className="text-[12px] mt-1">Ajoutez des articles pour commencer</p>
            </div>
          ) : (
            items.map((item) => (
              <CartSidebarItem key={item.cartKey || item.id} item={item} onQty={onQty} onRemove={onRemove} />
            ))
          )}
        </div>

        {/* Footer */}
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
              <Icon name="lock" /> Passer la commande
            </button>
          </div>
        )}
      </div>
    </>
  );
}

export default memo(CartSidebar);
