import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../components/shared/Icon.jsx';

export default function LoginPage({ onLogin }) {
  const navigate = useNavigate();
  const [loginType, setLoginType] = useState('email');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const validateEmail = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
  const validatePhone = (p) => /^\d{10,}$/.test(p.replace(/\D/g, ''));

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (loginType === 'email') {
      if (!validateEmail(email)) {
        setError('Email invalide');
        setLoading(false);
        return;
      }
    } else {
      if (!validatePhone(phone)) {
        setError('Numéro de téléphone invalide (min 10 chiffres)');
        setLoading(false);
        return;
      }
    }

    if (password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      setLoading(false);
      return;
    }

    const user = {
      email: loginType === 'email' ? email : '',
      phone: loginType === 'phone' ? phone : '',
      firstName: 'User',
      lastName: 'Login',
      createdAt: new Date().toISOString(),
    };

    localStorage.setItem('user', JSON.stringify(user));
    onLogin(user);
    navigate('/');
    setLoading(false);
  };

  const handleOAuth = (provider) => {
    console.log(`OAuth ${provider} - Mock handler. Real integration requires backend setup.`);
    alert(`Connexion ${provider} - À implémenter avec backend`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0d1b2a] to-[#1a2a3a] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#0d1b2a] to-[#1a2a3a] px-6 py-8 text-center">
          <h1 className="text-3xl font-black text-white font-['Barlow_Condensed']">
            Trade<span className="text-orange-500">Hub</span>
          </h1>
          <p className="text-gray-300 text-sm mt-2">Connexion à votre compte</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Login Type Toggle */}
          <div className="flex gap-3 mb-6">
            <button
              type="button"
              onClick={() => {
                setLoginType('email');
                setError('');
              }}
              className={`flex-1 py-2.5 px-3 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
                loginType === 'email'
                  ? 'bg-orange-500 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Icon name="message" size={18} />
              Email
            </button>
            <button
              type="button"
              onClick={() => {
                setLoginType('phone');
                setError('');
              }}
              className={`flex-1 py-2.5 px-3 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
                loginType === 'phone'
                  ? 'bg-orange-500 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Icon name="phone" size={18} />
              Téléphone
            </button>
          </div>

          {/* Email/Phone Input */}
          {loginType === 'email' ? (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre@email.com"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:outline-none transition-colors"
              />
            </div>
          ) : (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Numéro de téléphone
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+33 6 12 34 56 78"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:outline-none transition-colors"
              />
            </div>
          )}

          {/* Password Input */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Mot de passe
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:outline-none transition-colors pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3.5 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <Icon name="eyeOff" size={20} /> : <Icon name="eye" size={20} />}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Ou continuer avec</span>
            </div>
          </div>

          {/* OAuth Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => handleOAuth('Google')}
              className="flex items-center justify-center gap-2 py-2.5 px-4 border-2 border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <span className="text-xl">🔍</span>
              <span className="font-semibold text-gray-700 text-sm">Google</span>
            </button>
            <button
              type="button"
              onClick={() => handleOAuth('Facebook')}
              className="flex items-center justify-center gap-2 py-2.5 px-4 border-2 border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <span className="text-xl">f</span>
              <span className="font-semibold text-gray-700 text-sm">Facebook</span>
            </button>
          </div>

          {/* Sign Up Link */}
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
