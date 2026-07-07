import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Mail, Phone, Eye, EyeOff, X } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { useLogin } from '@/features/auth/hooks/useAuth';
import { useUIStore } from '@/stores/uiStore';

// AJOUT — Modal de connexion (utilisée par PrivateRoute quand l'utilisateur n'est pas connecté)
export default function LoginModal() {
  const navigate = useNavigate();
  const open = useUIStore((state) => state.loginModalOpen);
  const closeLoginModal = useUIStore((state) => state.closeLoginModal);

  // MODIFICATION ICI — Utilise le hook useLogin avec onSuccess qui ferme la modale (pas de navigation)
  const { login, isPending, error, resetError } = useLogin({
    onSuccess: closeLoginModal,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    shouldUnregister: true,
    mode: 'onBlur',
  });

  const [loginType, setLoginType] = useState('email');
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = (data) => {
    const payload = { password: data.password };
    if (loginType === 'email') {
      payload.email = data.email;
    } else {
      payload.email = data.phone;
    }
    login(payload);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-md mx-4 bg-white rounded-lg shadow-2xl overflow-hidden">
        {/* Close button */}
        <button
          type="button"
          onClick={closeLoginModal}
          className="absolute top-3 right-3 z-10 text-gray-400 hover:text-gray-700 transition-colors"
        >
          <X size={22} />
        </button>

        {/* Header */}
        <div className="bg-gradient-to-r from-[#0d1b2a] to-[#1a2a3a] px-6 py-8 text-center">
          <h1 className="text-3xl font-black text-white font-['Barlow_Condensed']">
            Trade<span className="text-orange-500">Hub</span>
          </h1>
          <p className="text-gray-300 text-sm mt-2">Connectez-vous pour continuer</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
          <div className="flex gap-3 mb-6">
            <Button
              type="button"
              variant={loginType === 'email' ? 'primary' : 'secondary'}
              size="md"
              fullWidth
              onClick={() => { setLoginType('email'); resetError(); }}
            >
              <span className="flex items-center gap-2"><Mail size={18} /> Email</span>
            </Button>
            <Button
              type="button"
              variant={loginType === 'phone' ? 'primary' : 'secondary'}
              size="md"
              fullWidth
              onClick={() => { setLoginType('phone'); resetError(); }}
            >
              <span className="flex items-center gap-2"><Phone size={18} /> Téléphone</span>
            </Button>
          </div>

          {loginType === 'email' ? (
            <Input
              label="Email"
              type="email"
              placeholder="votre@email.com"
              error={errors.email?.message}
              {...register('email', {
                required: "L'email est requis",
                pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Email invalide' },
              })}
            />
          ) : (
            <Input
              label="Numéro de téléphone"
              type="tel"
              placeholder="+221 77 123 45 67"
              error={errors.phone?.message}
              {...register('phone', {
                required: 'Le numéro est requis',
                pattern: { value: /^\+?[1-9]\d{1,14}$/, message: 'Numéro invalide' },
              })}
            />
          )}

          <Input
            label="Mot de passe"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            error={errors.password?.message}
            suffix={
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-gray-500 hover:text-gray-700">
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            }
            {...register('password', {
              required: 'Le mot de passe est requis',
              minLength: { value: 4, message: 'Au moins 4 caractères' },
            })}
          />

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <Button type="submit" variant="primary" size="lg" fullWidth loading={isPending}>
            {isPending ? 'Connexion...' : 'Se connecter'}
          </Button>

          <div className="text-center pt-4 border-t border-gray-200">
            <p className="text-gray-600 text-sm">
              Pas encore de compte ?{' '}
              <button
                type="button"
                onClick={() => { closeLoginModal(); navigate('/signup'); }}
                className="text-orange-500 font-bold hover:text-orange-600 transition-colors"
              >
                S'inscrire
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
