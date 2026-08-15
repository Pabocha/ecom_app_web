import { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, PackagePlus, Minus, Plus, ChevronDown } from 'lucide-react';
import { useReturnableItems } from '@/features/order/hooks/useReturns';
import { RETURN_REASONS } from '@/features/order/data/orderData';
import { formatPrice } from '@/utils/helpers';

export default function ProductPickerModal({ existingDraft, onConfirm, onClose }) {
  const { data: items, isLoading, isError } = useReturnableItems();
  const [selected, setSelected] = useState(() => {
    const map = new Map();
    (existingDraft?.items || []).forEach((i) => map.set(i.order_line_id, { ...i }));
    return map;
  });
  const [reason, setReason] = useState(existingDraft?.reason || '');
  const [description, setDescription] = useState(existingDraft?.description || '');

  const toggle = (item) => {
    setSelected((prev) => {
      const next = new Map(prev);
      if (next.has(item.order_line_id)) {
        next.delete(item.order_line_id);
      } else {
        next.set(item.order_line_id, {
          order_id: item.order_id,
          order_number: item.order_number,
          order_line_id: item.order_line_id,
          product_id: item.product_id,
          variant_id: item.variant_id,
          product_name: item.product_name,
          product_image: item.product_image,
          unit_price: item.unit_price,
          quantity: item.returnable_quantity,
        });
      }
      return next;
    });
  };

  const setQty = (orderLineId, value) => {
    const item = items?.find((it) => it.order_line_id === orderLineId);
    const max = item?.returnable_quantity || 1;
    setSelected((prev) => {
      const next = new Map(prev);
      const current = next.get(orderLineId);
      if (!current) return prev;
      next.set(orderLineId, { ...current, quantity: Math.min(Math.max(value, 1), max) });
      return next;
    });
  };

  const confirm = () => {
    const selectedItems = Array.from(selected.values());
    if (selectedItems.length === 0) return;
    onConfirm(selectedItems, reason, description);
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100 text-orange-500">
              <PackagePlus size={18} />
            </span>
            <div>
              <h2 className="text-[18px] font-black text-[#0d1b2a]">Choisir un produit à retourner</h2>
              <p className="text-[12px] text-gray-400">Uniquement vos commandes livrées</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        <div className="px-6 py-4 overflow-y-auto flex-1">
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 animate-pulse">
                  <div className="w-12 h-12 rounded-lg bg-gray-200 shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 w-40 bg-gray-200 rounded" />
                    <div className="h-3 w-24 bg-gray-200 rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : isError ? (
            <p className="text-[13px] text-red-500 text-center py-6">Une erreur est survenue lors du chargement des produits.</p>
          ) : items.length === 0 ? (
            <div className="text-center py-10">
              <PackagePlus size={40} className="mx-auto mb-3 text-gray-300" />
              <p className="text-[13px] text-gray-500 font-bold">Aucun produit retournable</p>
              <p className="text-[12px] text-gray-400 mt-1">Vous n'avez pas encore de commande livrée sans retour en cours.</p>
            </div>
          ) : (
            <>
              <div className="space-y-3">
                {items.map((item) => {
                  const isSelected = selected.has(item.order_line_id);
                  const selectedEntry = selected.get(item.order_line_id);
                  return (
                    <div
                      key={item.order_line_id}
                      className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                        isSelected ? 'border-orange-300 bg-orange-50/50' : 'border-gray-100'
                      }`}
                    >
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                        {item.product_image ? (
                          <img src={item.product_image} alt={item.product_name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-300 text-[9px]">IMG</div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-[13px] font-bold text-[#0d1b2a] truncate">{item.product_name}</div>
                        <div className="text-[11px] text-gray-400">Commande #{item.order_number}</div>
                        <div className="text-[12px] font-bold text-orange-500 mt-0.5">{formatPrice(item.unit_price)}</div>
                      </div>
                      {isSelected ? (
                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            type="button"
                            onClick={() => setQty(item.order_line_id, selectedEntry.quantity - 1)}
                            className="p-1 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
                          >
                            <Minus size={13} />
                          </button>
                          <span className="text-[13px] font-black text-[#0d1b2a] w-7 text-center">{selectedEntry.quantity}</span>
                          <button
                            type="button"
                            onClick={() => setQty(item.order_line_id, selectedEntry.quantity + 1)}
                            className="p-1 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
                          >
                            <Plus size={13} />
                          </button>
                          <button
                            type="button"
                            onClick={() => toggle(item)}
                            className="ml-2 px-2.5 py-1.5 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-[11px] font-bold transition-colors"
                          >
                            Retirer
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => toggle(item)}
                          disabled={item.returnable_quantity <= 0}
                          className="shrink-0 px-3 py-1.5 rounded-lg bg-[#0d1b2a] hover:bg-[#0d1b2a]/90 text-white text-[11px] font-bold transition-colors disabled:opacity-40"
                        >
                          Sélectionner
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>

              {selected.size > 0 && (
                <div className="mt-4 space-y-3">
                  <div>
                    <label className="text-[12px] font-black text-[#0d1b2a] block mb-1.5">Motif du retour</label>
                    <div className="relative">
                      <select
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        className="w-full px-3 py-2 pr-8 rounded-lg border border-gray-200 text-[13px] focus:outline-none focus:ring-2 focus:ring-orange-500/40 appearance-none"
                      >
                        <option value="">Sélectionnez un motif…</option>
                        {RETURN_REASONS.map((r) => (
                          <option key={r.key} value={r.key}>{r.label}</option>
                        ))}
                      </select>
                      <ChevronDown size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                  <div>
                    <label className="text-[12px] font-black text-[#0d1b2a] block mb-1.5">Description (optionnel)</label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={2}
                      placeholder="Précisez le problème rencontré…"
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 text-[13px] focus:outline-none focus:ring-2 focus:ring-orange-500/40"
                    />
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {items?.length > 0 && (
          <div className="border-t border-gray-100 px-6 py-4 bg-gray-50 rounded-b-2xl flex items-center justify-between gap-3">
            <div className="text-[12px] text-gray-500">
              {selected.size > 0 ? (
                <>
                  <span className="font-black text-[#0d1b2a]">{selected.size} produit{selected.size > 1 ? 's' : ''}</span> sélectionné{selected.size > 1 ? 's' : ''}
                  <div>
                    Total :{' '}
                    <span className="font-black text-orange-500">
                      {formatPrice(Array.from(selected.values()).reduce((sum, i) => sum + i.unit_price * i.quantity, 0))}
                    </span>
                  </div>
                </>
              ) : (
                'Sélectionnez au moins un produit'
              )}
            </div>
            <button
              onClick={confirm}
              disabled={selected.size === 0}
              className="px-4 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-[13px] font-bold disabled:opacity-40 transition-colors"
            >
              Envoyer au support
            </button>
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
}
