import { useMemo, useState } from 'react';
import { MapPin, Truck, Ship, Plane, CreditCard, User, Phone } from 'lucide-react';
import Button from '@/components/ui/Button';
import { useAddresses } from '@/features/profile/hooks/useProfile';
import { usePaymentMethods } from '@/features/payment/hooks/usePaymentMethods';
import { resolveCountry } from '@/features/payment/utils/helpers';
import { useAuth } from '@/features/auth/hooks/useAuth';

const TRANSPORT_MODES = [
  { id: 'road', icon: Truck, label: 'Route', desc: 'Livraison domestique' },
  { id: 'sea', icon: Ship, label: 'Mer', desc: 'International par voie maritime' },
  { id: 'air', icon: Plane, label: 'Air', desc: 'International par voie aérienne' },
];

// MODIFICATION ICI — Formulaire de paiement d'un devis (adresse + transport + infos de paiement)
export default function QuotePaymentForm({
  requirePayment = true,
  isPending,
  submitLabel = 'Payer',
  onSubmit,
}) {
  const { user } = useAuth();
  const { addresses, isLoading: isLoadingAddresses } = useAddresses();

  const [addressId, setAddressId] = useState(null);
  const [transportMode, setTransportMode] = useState('road');
  const [paymentId, setPaymentId] = useState(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  const selectedAddress = useMemo(
    () => addresses?.find((a) => a.id === addressId) || addresses?.find((a) => a.is_default) || addresses?.[0] || null,
    [addresses, addressId],
  );

  const effectiveAddressId = selectedAddress?.id ?? null;

  const country = resolveCountry(user?.country, selectedAddress?.country);
  const { methods } = usePaymentMethods({ country });
  const selectedPayment = methods.find((m) => m.id === paymentId) || methods[0] || null;

  const isReady = Boolean(effectiveAddressId) && (!requirePayment || (selectedPayment?.apiId && firstName?.trim() && lastName?.trim() && phoneNumber?.trim()));

  const handleSubmit = () => {
    if (!isReady) return;
    onSubmit({
      origin_address: effectiveAddressId,
      transport_mode: transportMode,
      ...(requirePayment
        ? {
            paymentMethod: selectedPayment,
            first_name: firstName.trim(),
            last_name: lastName.trim(),
            phone_number: phoneNumber.trim(),
          }
        : {}),
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <MapPin size={15} className="text-orange-500" />
          <h3 className="text-[14px] font-black text-[#0d1b2a]">Adresse de livraison</h3>
        </div>
        {isLoadingAddresses ? (
          <div className="rounded-lg border-2 border-gray-200 px-3 py-2.5 text-[13px] text-gray-400">Chargement des adresses…</div>
        ) : addresses?.length ? (
          <select
            value={effectiveAddressId ?? ''}
            onChange={(e) => setAddressId(Number(e.target.value))}
            className="w-full rounded-lg border-2 border-gray-200 px-3 py-2.5 text-[13px] transition-colors focus:border-orange-500 focus:outline-none"
          >
            {addresses.map((a) => (
              <option key={a.id} value={a.id}>
                {a.first_name} {a.last_name} — {a.street_address}, {a.city} ({a.country})
              </option>
            ))}
          </select>
        ) : (
          <div className="rounded-lg border-2 border-dashed border-gray-200 px-3 py-3 text-[12px] text-gray-400">
            Aucune adresse enregistrée. Ajoutez-en une depuis votre profil.
          </div>
        )}
      </div>

      <div>
        <div className="flex items-center gap-2 mb-2">
          <Truck size={15} className="text-orange-500" />
          <h3 className="text-[14px] font-black text-[#0d1b2a]">Mode de transport</h3>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {TRANSPORT_MODES.map((mode) => {
            const Icon = mode.icon;
            return (
              <button
                key={mode.id}
                type="button"
                onClick={() => setTransportMode(mode.id)}
                className={`flex flex-col items-center gap-1 rounded-lg border-2 p-3 text-center transition-all ${
                  transportMode === mode.id
                    ? 'border-orange-500 bg-orange-50'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <Icon size={17} className={transportMode === mode.id ? 'text-orange-500' : 'text-gray-400'} />
                <span className="text-[12px] font-black text-[#0d1b2a]">{mode.label}</span>
                <span className="text-[9px] text-gray-400 leading-tight">{mode.desc}</span>
              </button>
            );
          })}
        </div>
      </div>

      {requirePayment && (
        <>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <CreditCard size={15} className="text-orange-500" />
              <h3 className="text-[14px] font-black text-[#0d1b2a]">Moyen de paiement</h3>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {methods.map((method) => (
                <button
                  key={method.id}
                  type="button"
                  onClick={() => setPaymentId(method.id)}
                  className={`flex flex-col items-center gap-1 rounded-lg border-2 p-2.5 transition-all ${
                    selectedPayment?.id === method.id
                      ? 'border-orange-500 bg-orange-50'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <span className="h-7 w-11 rounded bg-white border border-gray-100 flex items-center justify-center">
                    {method.logo ? (
                      <img src={method.logo} alt={method.name} className="max-h-4 max-w-8 object-contain" />
                    ) : (
                      <span className="font-black text-gray-300 text-[12px]">
                        {method.name?.charAt(0)?.toUpperCase()}
                      </span>
                    )}
                  </span>
                  <span className="text-[10px] font-black text-[#0d1b2a] truncate w-full text-center">{method.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <User size={15} className="text-orange-500" />
              <h3 className="text-[14px] font-black text-[#0d1b2a]">Informations de paiement</h3>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-gray-400 mb-1">Prénom</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Prénom"
                  className="w-full rounded-lg border-2 border-gray-200 px-3 py-2 text-[13px] focus:border-orange-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-gray-400 mb-1">Nom</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Nom"
                  className="w-full rounded-lg border-2 border-gray-200 px-3 py-2 text-[13px] focus:border-orange-500 focus:outline-none"
                />
              </div>
            </div>
            <div className="mt-3">
              <label className="block text-[11px] font-bold text-gray-400 mb-1">Numéro de téléphone</label>
              <div className="relative">
                <Phone size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+221 77 123 45 67"
                  className="w-full rounded-lg border-2 border-gray-200 pl-9 pr-3 py-2 text-[13px] focus:border-orange-500 focus:outline-none"
                />
              </div>
            </div>
          </div>
        </>
      )}

      <Button fullWidth loading={isPending} disabled={!isReady} onClick={handleSubmit}>
        {submitLabel}
      </Button>
    </div>
  );
}
