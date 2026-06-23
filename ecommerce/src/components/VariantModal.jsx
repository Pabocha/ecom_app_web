import { formatPrice } from '@/data/data.js';
import { X } from 'lucide-react';

function variantLabel(selection) {
  return Object.entries(selection).map(([key, value]) => `${key}: ${value}`).join(' · ');
}

export default function VariantModal({ product, selection, onSelectionChange, onConfirm, onClose }) {
  if (!product) return null;

  return (
    <div className="fixed inset-0 z-[1200] flex items-center justify-center bg-black/55 px-4">
      <div className="w-full max-w-[520px] overflow-hidden rounded-lg bg-white shadow-2xl">
        <div className="flex items-start justify-between border-b border-gray-100 p-5">
          <div className="flex gap-3">
            <img src={product.img} alt={product.name} className="h-20 w-20 rounded object-cover" />
            <div>
              <div className="text-[16px] font-black text-[#0d1b2a]">{product.name}</div>
              <div className="font-['Barlow_Condensed'] text-[24px] font-black text-orange-500">{formatPrice(product.price)}</div>
              <div className="text-[12px] text-gray-400">Choisissez vos options avant l'ajout.</div>
            </div>
          </div>
          <button onClick={onClose} className="rounded bg-gray-100 p-2 text-gray-500 hover:bg-red-50 hover:text-red-500">
            <X size={16} />
          </button>
        </div>

        <div className="space-y-4 p-5">
          {Object.entries(product.variants).map(([variantName, values]) => (
            <div key={variantName}>
              <div className="mb-2 text-[13px] font-black uppercase text-[#0d1b2a]">{variantName}</div>
              <div className="flex flex-wrap gap-2">
                {values.map(value => (
                  <button
                    key={value}
                    onClick={() => onSelectionChange(variantName, value)}
                    className={`rounded border px-3 py-2 text-[13px] font-bold transition-colors ${selection[variantName] === value ? 'border-orange-500 bg-orange-50 text-orange-500' : 'border-gray-200 text-gray-600 hover:border-orange-300'}`}
                  >
                    {value}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between border-t border-gray-100 bg-gray-50 p-5">
          <div className="text-[12px] text-gray-500">
            Sélection : <span className="font-black text-[#0d1b2a]">{variantLabel(selection)}</span>
          </div>
          <button onClick={onConfirm} className="rounded bg-orange-500 px-5 py-3 text-[13px] font-black text-white hover:bg-orange-600">
            Ajouter au panier
          </button>
        </div>
      </div>
    </div>
  );
}
