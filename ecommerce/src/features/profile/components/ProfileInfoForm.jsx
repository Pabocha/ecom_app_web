import { Mail, MapPin, Phone, Save } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { InputCountry } from '@/components/ui/InputCountry';

export default function ProfileInfoForm({ form, editing, updateMutation, onInfoSubmit }) {
  const { register, handleSubmit, setValue, formState: { errors } } = form;

  return (
    <form onSubmit={handleSubmit(onInfoSubmit)} className="bg-white rounded-lg shadow-sm p-5">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-[18px] font-black text-[#0d1b2a]">Informations personnelles</h2>
          <p className="text-[12px] text-gray-400">Gérez vos informations de compte</p>
        </div>
        {editing && (
          <Button type="submit" size="sm" loading={updateMutation.isPending}>
            <Save size={14} /> Enregistrer
          </Button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Prénom"
          placeholder="Votre prénom"
          disabled={!editing}
          error={errors.first_name?.message}
          {...register('first_name', { required: editing ? 'Requis' : false })}
        />
        <Input
          label="Nom"
          placeholder="Votre nom"
          disabled={!editing}
          error={errors.last_name?.message}
          {...register('last_name', { required: editing ? 'Requis' : false })}
        />
      </div>

      <div className="mt-4">
        <Input
          label="Email"
          type="email"
          placeholder="votre@email.com"
          disabled={!editing}
          suffix={<Mail size={16} className="text-gray-400" />}
          error={errors.email?.message}
          {...register('email', {
            required: editing ? 'Requis' : false,
            pattern: editing ? { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Email invalide' } : undefined,
          })}
        />
      </div>

      <div className="mt-4">
        <Input
          label="Téléphone"
          type="tel"
          placeholder="+221 77 123 45 67"
          disabled={!editing}
          suffix={<Phone size={16} className="text-gray-400" />}
          error={errors.phone_number?.message}
          {...register('phone_number', {
            required: editing ? 'Requis' : false,
            pattern: editing ? { value: /^\+?[1-9]\d{1,14}$/, message: 'Numéro invalide' } : undefined,
          })}
        />
      </div>

      <div className="mt-4">
        <Input
          label="Adresse"
          placeholder="Votre adresse complète"
          disabled={!editing}
          suffix={<MapPin size={16} className="text-gray-400" />}
          {...register('full_address')}
        />
      </div>

      <div className="mt-4 grid grid-cols-3 gap-4">
        <Input
          label="Ville"
          placeholder="Ville"
          disabled={!editing}
          {...register('city')}
        />
        <Input
          label="Code postal"
          placeholder="Code postal"
          disabled={!editing}
          {...register('postal_code')}
        />
        <InputCountry
          label="Pays"
          register={register}
          setValue={setValue}
          error={errors.country}
          required={false}
        />
      </div>

      {updateMutation.error && (
        <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          ❌ {updateMutation.error?.response?.data?.detail || 'Erreur lors de la mise à jour'}
        </div>
      )}

      {updateMutation.isSuccess && (
        <div className="mt-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
          ✓ Informations mises à jour avec succès
        </div>
      )}
    </form>
  );
}
