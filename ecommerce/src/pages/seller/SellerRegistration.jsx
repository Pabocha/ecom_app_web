import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import Button from '@/components/ui/Button.jsx';
import { Building2, Lock } from 'lucide-react';
import Input from '@/components/ui/Input.jsx';
import { InputImage } from '@/components/ui/InputImage.jsx';
import { useVendor } from '@/features/vendor/hooks/useVendor.js';

function StepOne({ onNext, defaultValues }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: 'onBlur', defaultValues });

  return (
    <form onSubmit={handleSubmit(onNext)} className="space-y-5">
      <Input
        label="Nom de la companie"
        placeholder="Nom de votre companie"
        required
        error={errors.company_name?.message}
        {...register('company_name', {
          required: 'Le nom de la companie est requis',
        })}
      />
      <Input
        label="Téléphone"
        type="tel"
        placeholder="+33 6 12 34 56 78"
        required
        error={errors.phone?.message}
        {...register('phone', {
          required: 'Le téléphone est requis',
          pattern: {
            value: /^\+?[1-9]\d{1,14}$/,
            message: 'Numéro invalide',
          },
        })}
      />
      
      <Input
        label="Adresse email de contact"
        type="email"
        placeholder="contact@companie.com"
        required
        error={errors.email_contact?.message}
        {...register('email_contact', {
          required: 'L’email est requis',
          pattern: {
            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: 'Email invalide',
          },
        })}
      />
      <Input
        label="Adresse de la companie"
        type="text"
        placeholder="123 Rue de la Companie, Paris"
        required
        error={errors.address?.message}
        {...register('address', {
          required: 'L’adresse est requise',
        })}
      />
      <Button type="submit" variant="primary" size="lg" fullWidth>
        Suivant
      </Button>
    </form>
  );
}



function StepTwo({ onBack, onSubmit, defaultValues,  }) {
  const {
    register,
    handleSubmit,
    isSubmitting,
    watch,
    formState: { errors },
  } = useForm({ mode: 'onBlur', defaultValues });


  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <Input
        label="Numéro de licence commerciale"
        placeholder="123456789"
        error={errors.license_number?.message}
        {...register('license_number', {})}
      />
 
      <div className="grid gap-5 sm:grid-cols-2">
        <InputImage
          label="Document d'identité"
          name="id_document"
          register={register}
          watch={watch}
          error={errors.id_document}
        />
        <InputImage
          label="Justificatif de domicile"
          name="proof_of_address_document"
          register={register}
          watch={watch}
          error={errors.proof_of_address_document}
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-[1fr_auto]">
        <Button type="button" variant="secondary" size="lg" onClick={onBack}>
          Retour
        </Button>
        <Button type="submit" variant="primary" size="lg" fullWidth disabled={isSubmitting}>
          {isSubmitting ? 'Envoi en cours…' : 'Finaliser l\'inscription'}
        </Button>
      </div>
    </form>
  );
}

export default function SellerRegistrationPage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [stepOneData, setStepOneData] = useState(null);
  const { createVendorAsync: registerVendor, isPending: isSubmitting } = useVendor();

  const handleNext = (data) => {
    setStepOneData(data);
    setCurrentStep(2);
  };

  const handleBack = () => {
    setCurrentStep(1);
  };

  const handleSubmit = async (stepTwoData) => {
    const formData = new FormData();

    if (stepOneData) {
      Object.entries(stepOneData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value);
        }
      });
    }

    Object.entries(stepTwoData).forEach(([key, value]) => {
      if (value instanceof FileList) {
        if (value.length > 0) {
          formData.append(key, value[0]);
        }
      } else if (value !== undefined && value !== null) {
        formData.append(key, value);
      }
    });

    try {
       registerVendor({
        formData,
        config: { headers: { 'Content-Type': 'multipart/form-data' } },
      });
      navigate('/seller-center');
    } catch (error) {
      console.error('Erreur lors de la création du compte vendeur', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0d1b2a] to-[#1a2a3a] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-2xl overflow-hidden rounded-[28px] border border-white/10 bg-white shadow-2xl shadow-black/20">
        <div className="bg-[#0d1b2a] px-6 py-8 text-center">
          <div className="text-sm uppercase tracking-[1px] text-orange-500 font-black">Inscription vendeur</div>
          <h1 className="mt-4 text-3xl font-black text-white">Étape {currentStep} sur 2</h1>
          <p className="mx-auto mt-3 max-w-xl text-sm text-gray-300">
            {currentStep === 1
              ? 'Commencez par vos informations de boutique et de contact. La deuxième étape vous permettra de finaliser votre accès vendeur.'
              : 'Complétez vos informations de connexion et finalisez votre compte vendeur.'}
          </p>
        </div>

        <div className="p-6 space-y-6">
          <div className="rounded-3xl border border-gray-200 bg-slate-50 p-5">
            <div className="flex items-center gap-3 text-sm font-black text-slate-900">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-500/10 text-orange-500">
                {currentStep === 1 ? <Building2 size={20} /> : <Lock size={20} />}
              </span>
              <div>
                <div className="uppercase tracking-[1px] text-orange-500">
                  {currentStep === 1 ? 'À quoi sert cette étape' : 'Finalisez votre accès'}
                </div>
                <p className="mt-2 text-sm text-slate-600">
                  {currentStep === 1
                    ? 'Renseignez le nom de votre boutique, votre secteur et vos contacts pour préparer votre espace vendeur.'
                    : 'Créez votre mot de passe et validez l’accès à votre tableau de bord vendeur.'}
                </p>
              </div>
            </div>
          </div>

          {currentStep === 1 ? (
            <StepOne onNext={handleNext} defaultValues={stepOneData || {}} />
          ) : (
            <StepTwo onBack={handleBack} onSubmit={handleSubmit} defaultValues={stepOneData || {}} isSubmitting={isSubmitting} />
          )}
        </div>
      </div>
    </div>
  );
}
