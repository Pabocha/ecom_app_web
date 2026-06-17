import { paymentMethods } from '../data/paymentMethods';
import Icon from '@/components/shared/Icon.jsx';

export default function PaymentSelector({ selectedPayment, onSelectPayment }) {
  return (
    <section className="bg-white rounded-lg shadow-sm p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-[18px] font-black text-[#0d1b2a]">Moyens de paiement</h2>
          <p className="text-[12px] text-gray-400">Cartes internationales et solutions Mobile Money africaines.</p>
        </div>
        <span className="flex items-center gap-1 rounded bg-green-50 px-3 py-1 text-[12px] font-black text-green-600">
          <Icon name="shield" size={14} /> Paiement sécurisé
        </span>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {paymentMethods.map(method => (
          <button
            key={method.id}
            onClick={() => onSelectPayment(method.id)}
            className={`relative rounded-lg border p-3 text-left transition-all hover:-translate-y-0.5 hover:shadow-md ${selectedPayment === method.id ? `${method.tone} ring-2 ring-orange-400` : 'border-gray-100 bg-white'}`}
          >
            <div className="h-12 rounded bg-white flex items-center justify-center border border-gray-100">
              <img src={method.logo} alt={method.name} className="max-h-8 max-w-[120px] object-contain" loading="lazy" />
            </div>
            <div className="mt-3 font-black text-[#0d1b2a] text-[13px]">{method.name}</div>
            <div className="text-[11px] text-gray-400">{method.type}</div>
            <div className="mt-2 text-[10px] font-black text-orange-500">{method.badge}</div>
            {selectedPayment === method.id && (
              <span className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-orange-500 text-white">
                <Icon name="check" size={12} />
              </span>
            )}
          </button>
        ))}
      </div>
    </section>
  );
}