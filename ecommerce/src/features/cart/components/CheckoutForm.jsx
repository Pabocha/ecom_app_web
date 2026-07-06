import { Phone, MapPin, PencilLine } from 'lucide-react';
import Input from '@/components/ui/Input';

const countryOptions = [
  { value: 'SN', label: 'Sénégal' },
  { value: 'CI', label: "Côte d'Ivoire" },
  { value: 'ML', label: 'Mali' },
  { value: 'BF', label: 'Burkina Faso' },
  { value: 'FR', label: 'France' },
  { value: 'US', label: 'États-Unis' },
];

export default function CheckoutForm({
  form,
  addressEditing,
  setAddressEditing,
  showPhone,
}) {
  const { register, formState: { errors } } = form;

  const watchFullAddress = form.watch('full_address');
  const watchCity = form.watch('city');
  const watchCountry = form.watch('country');
  const watchPostalCode = form.watch('postal_code');

  const hasAddress = watchFullAddress || watchCity || watchCountry;
  const countryLabel = countryOptions.find((c) => c.value === watchCountry)?.label || watchCountry || '';

  return (
    <div className="space-y-4">
      {/* MODIFICATION ICI — Section adresse de livraison */}
      <section className="bg-white rounded-lg shadow-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <MapPin size={18} className="text-orange-500" />
            <h2 className="text-[18px] font-black text-[#0d1b2a]">Adresse de livraison</h2>
          </div>
          {hasAddress && !addressEditing && (
            <button
              type="button"
              onClick={() => setAddressEditing(true)}
              className="flex items-center gap-1 text-[13px] font-bold text-orange-500 hover:text-orange-600 transition-colors"
            >
              <PencilLine size={14} />
              Modifier
            </button>
          )}
        </div>

        {hasAddress && !addressEditing ? (
          <div className="rounded-lg bg-gray-50 p-4 text-[14px] text-gray-700 space-y-1">
            {watchFullAddress && <p className="font-medium">{watchFullAddress}</p>}
            <p>
              {[watchCity, watchPostalCode].filter(Boolean).join(', ')}
              {countryLabel && <span> {countryLabel}</span>}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <Input
              label="Adresse complète"
              placeholder="Numéro, rue, quartier..."
              error={errors.full_address?.message}
              {...register('full_address', { required: 'L\'adresse est requise' })}
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Ville"
                placeholder="Ville"
                error={errors.city?.message}
                {...register('city', { required: 'La ville est requise' })}
              />
              <Input
                label="Code postal"
                placeholder="Code postal"
                {...register('postal_code')}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Pays <span className="text-red-500">*</span>
              </label>
              <select
                {...register('country', { required: 'Le pays est requis' })}
                className={`w-full rounded-lg border-2 px-4 py-3 text-sm transition-colors focus:outline-none ${errors.country ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-orange-500'}`}
              >
                <option value="">Sélectionnez un pays</option>
                {countryOptions.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
              {errors.country && <p className="mt-2 text-sm text-red-600">{errors.country.message}</p>}
            </div>
            {hasAddress && (
              <button
                type="button"
                onClick={() => setAddressEditing(false)}
                className="text-[13px] font-bold text-orange-500 hover:text-orange-600 transition-colors"
              >
                Valider l'adresse
              </button>
            )}
          </div>
        )}
      </section>

      {/* MODIFICATION ICI — Section téléphone (conditionnelle) */}
      {showPhone && (
        <section className="bg-white rounded-lg shadow-sm p-5">
          <div className="flex items-center gap-2 mb-4">
            <Phone size={18} className="text-orange-500" />
            <h2 className="text-[18px] font-black text-[#0d1b2a]">Numéro de téléphone</h2>
          </div>
          <p className="text-[12px] text-gray-400 mb-3">
            Ce numéro sera utilisé pour confirmer le paiement via votre méthode de paiement choisie.
          </p>
          <Input
            type="tel"
            placeholder="+221 77 123 45 67"
            error={errors.phone_number?.message}
            {...register('phone_number', {
              required: showPhone ? 'Le numéro de téléphone est requis' : false,
              pattern: showPhone ? { value: /^\+?[1-9]\d{1,14}$/, message: 'Numéro invalide' } : undefined,
            })}
          />
        </section>
      )}
    </div>
  );
}
