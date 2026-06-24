import { paymentMethods } from '@/data/paymentMethod';
import { formatPrice } from '@/data/data.js';

export default function CartSummary({ subtotal, shipping, serviceFee, total, selectedPayment, hasItems }) {
  const selected = paymentMethods.find(method => method.id === selectedPayment);

  return (
    <section className="bg-white rounded-lg shadow-sm p-5 sticky top-[92px]">
      <h2 className="text-[18px] font-black text-[#0d1b2a] mb-4">Résumé</h2>
      <div className="space-y-2 text-[13px]">
        <div className="flex justify-between text-gray-500">
          <span>Sous-total</span>
          <span className="font-bold text-[#0d1b2a]">{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between text-gray-500">
          <span>Livraison</span>
          <span className="font-bold text-[#0d1b2a]">{shipping === 0 ? 'Gratuite' : formatPrice(shipping)}</span>
        </div>
        <div className="flex justify-between text-gray-500">
          <span>Frais service</span>
          <span className="font-bold text-[#0d1b2a]">{formatPrice(serviceFee)}</span>
        </div>
      </div>
      <div className="my-4 border-t border-gray-100" />
      <div className="flex justify-between items-end">
        <span className="text-[14px] font-black text-[#0d1b2a]">Total à payer</span>
        <span className="font-['Barlow_Condensed'] text-[32px] font-black text-orange-500">{formatPrice(total)}</span>
      </div>

      {selected && (
        <div className="mt-4 rounded-lg bg-gray-50 p-3">
          <div className="text-[11px] uppercase tracking-wide text-gray-400 font-black mb-2">Paiement choisi</div>
          <div className="flex items-center gap-3">
            <span className="h-10 w-16 rounded bg-white border border-gray-100 flex items-center justify-center">
              <img src={selected.logo} alt={selected.name} className="max-h-6 max-w-12 object-contain" />
            </span>
            <div>
              <div className="text-[13px] font-black text-[#0d1b2a]">{selected.name}</div>
              <div className="text-[11px] text-gray-400">{selected.type}</div>
            </div>
          </div>
        </div>
      )}

      <button disabled={!hasItems} className="mt-4 w-full rounded bg-orange-500 py-3.5 text-[15px] font-black text-white transition-colors hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-gray-300">
        Payer maintenant
      </button>
    </section>
  );
}