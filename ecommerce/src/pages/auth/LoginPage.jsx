import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import Button from '@/components/ui/Button.jsx';
import Input from '@/components/ui/Input.jsx';
import { useLogin } from '@/features/auth/hooks/useAuth';
import { Eye, EyeOff, Mail, Phone } from 'lucide-react';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, isPending, error, resetError } = useLogin();

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

  const handleOAuth = (provider) => {
    alert(`Authentification ${provider} à implémenter`);
  };

  const onSubmit = (data) => {
    const payload = {
      password: data.password,
    };

    if (loginType === 'email') {
      payload.email = data.email;
    } else {
      payload.email = data.phone;
    }

    login(payload);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0d1b2a] to-[#1a2a3a] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-[#0d1b2a] to-[#1a2a3a] px-6 py-8 text-center">
          <h1 className="text-3xl font-black text-white font-['Barlow_Condensed']">
            Trade<span className="text-orange-500">Hub</span>
          </h1>
          <p className="text-gray-300 text-sm mt-2">Connexion à votre compte</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
          <div className="flex gap-3 mb-6">
            <Button
              type="button"
              variant={loginType === 'email' ? 'primary' : 'secondary'}
              size="md"
              fullWidth
              onClick={() => {
                setLoginType('email');
                resetError();
              }}
            >
              <span className="flex items-center gap-2">
                <Mail size={18} /> Email
              </span>
            </Button>
            <Button
              type="button"
              variant={loginType === 'phone' ? 'primary' : 'secondary'}
              size="md"
              fullWidth
              onClick={() => {
                setLoginType('phone');
                resetError();
              }}
            >
              <span className="flex items-center gap-2">
                <Phone size={18} /> Téléphone
              </span>
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
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: 'Email invalide',
                },
              })}
            />
          ) : (
            <Input
              label="Numéro de téléphone"
              type="tel"
              placeholder="+33 6 12 34 56 78"
              error={errors.phone?.message}
              {...register('phone', {
                required: 'Le numéro de téléphone est requis',
                pattern: {
                  value: /^\+?[1-9]\d{1,14}$/,
                  message: 'Numéro de téléphone invalide',
                },
              })}
            />
          )}

          <Input
            label="Mot de passe"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            error={errors.password?.message}
            suffix={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-gray-500 hover:text-gray-700"
              >
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
              ❌ {error}
            </div>
          )}

          <Button type="submit" variant="primary" size="lg" fullWidth loading={isPending}>
            {isPending ? 'Connexion...' : 'Se connecter'}
          </Button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Ou continuer avec</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button
              type="button"
              variant="secondary"
              size="md"
              fullWidth
              onClick={() => handleOAuth('Google')}
            >
              <span className="flex items-center gap-2">
                <span className="text-xl">🔍</span>
                <span className="font-semibold text-gray-700 text-sm">Google</span>
              </span>
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="md"
              fullWidth
              onClick={() => handleOAuth('Facebook')}
            >
              <span className="flex items-center gap-2">
                <span className="text-xl">f</span>
                <span className="font-semibold text-gray-700 text-sm">Facebook</span>
              </span>
            </Button>
          </div>

          <div className="text-center mt-6 pt-6 border-t border-gray-200">
            <p className="text-gray-600 text-sm">
              Pas encore de compte ?{' '}
              <button
                type="button"
                onClick={() => navigate('/signup')}
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
