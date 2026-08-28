import { useState } from 'react';
import { X, Repeat } from 'lucide-react';
import Button from '@/components/ui/Button';
import { formatPrice, quoteLineUnitPrice } from '@/utils/helpers';

// MODIFICATION ICI — Modale de contre-proposition sur un devis existant
export default function QuoteCounterModal({ quote, onClose, counterMutation }) {
  const [lines, setLines] = useState(
    (quote?.lines || []).map((line) => ({
      id: line.id,
      product: line.product,
      variant: line.variant,
      product_name: line.product_name,
      quantity: String(line.quantity ?? 1),
      price: String(Math.round(quoteLineUnitPrice(line))),
    })),
  );

  const update = (index, field, value) => {
    setLines((prev) => prev.map((l, i) => (i === index ? { ...l, [field]: value } : l)));
  };

  const isValid = lines.length > 0 && lines.every(
    (l) => Number(l.quantity) > 0 && Number(l.price) > 0,
  );

  const submit = () => {
    if (!isValid) return;
    counterMutation.mutate(
      {
        id: quote.id,
        payload: {
          lines: lines.map((l) => ({
            ...(l.variant != null ? { variant: l.variant } : { product: l.product }),
            quantity: Number(l.quantity),
            negotiated_price: String(Number(l.price)),
          })),
        },
      },
      { onSuccess: onClose },
    );
  };

  return (
    <div className="fixed inset-0 z-[1100] flex items-center justify-center bg-black/55 px-4">
      <div className="w-full max-w-[540px] max-h-[90vh] overflow-y-auto rounded-lg bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-gray-100 p-5">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-50 text-orange-600">
              <Repeat size={17} />
            </span>
            <div>
              <h3 className="text-[16px] font-black text-[#0d1b2a]">Contre-proposer</h3>
              <p className="text-[12px] text-gray-400">Ajustez les quantités et les prix proposés</p>
            </div>
          </div>
          <button onClick={onClose} className="rounded bg-gray-100 p-2 text-gray-500 hover:bg-red-50 hover:text-red-500">
            <X size={16} />
          </button>
        </div>

        <div className="p-5 space-y-3">
          {lines.map((l, index) => (
            <div key={l.id ?? index} className="rounded-lg border-2 border-gray-100 p-3">
              <div className="text-[13px] font-black text-[#0d1b2a] mb-2">{l.product_name || `Produit #${l.product || l.variant}`}</div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-gray-400 mb-1">Quantité</label>
                  <input
                    type="number"
                    min="1"
                    value={l.quantity}
                    onChange={(e) => update(index, 'quantity', e.target.value)}
                    className="w-full rounded-lg border-2 border-gray-200 px-3 py-2 text-[13px] focus:border-orange-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-400 mb-1">Prix unitaire (FCFA)</label>
                  <input
                    type="number"
                    min="0"
                    value={l.price}
                    onChange={(e) => update(index, 'price', e.target.value)}
                    className="w-full rounded-lg border-2 border-gray-200 px-3 py-2 text-[13px] focus:border-orange-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          ))}

          <div className="pt-1 text-right text-[12px] text-gray-500">
            Total : {formatPrice(lines.reduce((s, l) => s + Number(l.price || 0) * Number(l.quantity || 0), 0))}
          </div>

          <div className="flex items-center gap-3 pt-2">
            <Button variant="ghost" fullWidth onClick={onClose}>Annuler</Button>
            <Button fullWidth loading={counterMutation.isPending} disabled={!isValid} onClick={submit}>
              Envoyer la contre-proposition
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
