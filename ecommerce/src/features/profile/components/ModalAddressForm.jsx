import { useState } from 'react';
import { X, Home, Building, MapPin } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { InputCountry } from '@/components/ui/InputCountry';
import { useAddressForm } from '@/features/profile/hooks/useProfile';

export default function ModalAddressForm({ address, onClose, addMutation, updateMutation }) {
  const isEditing = !!address;
  const mutation = isEditing ? updateMutation : addMutation;

  const { form } = useAddressForm(address);
  const { register, handleSubmit, setValue, formState: { errors } } = form;

  const onSubmit = (data) => {
    if (isEditing) {
      updateMutation.mutate({ id: address.id, ...data }, { onSuccess: onClose });
    } else {
      addMutation.mutate(data, { onSuccess: onClose });
    }
  };

  return (
    <div className="fixed inset-0 z-[1100] flex items-center justify-center bg-black/55 px-4">
      <div className="w-full max-w-[520px] max-h-[90vh] overflow-y-auto rounded-lg bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 p-5">
          <div>
            <h3 className="text-[16px] font-black text-[#0d1b2a]">
              {isEditing ? 'Modifier l\'adresse' : 'Nouvelle adresse'}
            </h3>
            <p className="text-[12px] text-gray-400">
              {isEditing ? 'Modifiez les informations de cette adresse' : 'Ajoutez une nouvelle adresse de livraison'}
            </p>
          </div>
          <button onClick={onClose} className="rounded bg-gray-100 p-2 text-gray-500 hover:bg-red-50 hover:text-red-500">
            <X size={16} />
          </button>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Prénom"
              placeholder="Prénom"
              error={errors.first_name?.message}
              {...register('first_name', { required: 'Requis' })}
            />
            <Input
              label="Nom"
              placeholder="Nom"
              error={errors.last_name?.message}
              {...register('last_name', { required: 'Requis' })}
            />
          </div>

          <Input
            label="Téléphone"
            type="tel"
            placeholder="+221 77 123 45 67"
            error={errors.phone_number?.message}
            {...register('phone_number', {
              required: 'Requis',
              pattern: { value: /^\+?[1-9]\d{1,14}$/, message: 'Numéro invalide' },
            })}
          />

          {/* MODIFICATION ICI — Textarea pour l'adresse */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Adresse <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={3}
              placeholder="Rue, quartier, repères..."
              className={`w-full rounded-lg border-2 px-4 py-3 text-sm transition-colors focus:outline-none resize-none ${
                errors.street_address?.message
                  ? 'border-red-500 focus:border-red-500'
                  : 'border-gray-200 focus:border-orange-500'
              }`}
              {...register('street_address', { required: 'Requis' })}
            />
            {errors.street_address?.message && (
              <p className="mt-2 text-sm text-red-600">{errors.street_address.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Ville"
              placeholder="Dakar"
              error={errors.city?.message}
              {...register('city', { required: 'Requis' })}
            />
            <Input
              label="Code postal"
              placeholder="Ex: 12345"
              error={errors.postal_code?.message}
              {...register('postal_code')}
            />
          </div>

          <Input
            label="Région / État"
            placeholder="Ex: Dakar, Thiès..."
            error={errors.state_region?.message}
            {...register('state_region')}
          />

          <InputCountry
            label="Pays"
            register={register}
            setValue={setValue}
            error={errors.country?.message}
            required
          />

          {/* Type d'adresse */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Type d'adresse</label>
            <div className="flex gap-3">
              {[
                { value: 'shipping', label: 'Livraison', icon: Home },
                { value: 'billing', label: 'Facturation', icon: Building },
                { value: 'both', label: 'Les deux', icon: MapPin },
              ].map(({ value, label, icon: Icon }) => (
                <label
                  key={value}
                  className="flex items-center gap-2 rounded-lg border-2 px-3 py-2 text-[13px] font-bold cursor-pointer transition-colors has-[:checked]:border-orange-500 has-[:checked]:bg-orange-50 has-[:checked]:text-orange-500 border-gray-200 text-gray-600"
                >
                  <input type="radio" value={value} className="sr-only" {...register('address_type')} />
                  <Icon size={14} /> {label}
                </label>
              ))}
            </div>
          </div>

          {/* Par défaut */}
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              className="rounded border-gray-300 text-orange-500 focus:ring-orange-300"
              {...register('is_default')}
            />
            <span className="text-[13px] font-bold text-gray-700">Définir comme adresse par défaut</span>
          </label>

          {/* Erreur API */}
          {mutation.error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {mutation.error?.response?.data?.detail || 'Erreur lors de l\'opération'}
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="secondary" size="md" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit" size="md" loading={mutation.isPending}>
              {isEditing ? 'Enregistrer' : 'Ajouter'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}