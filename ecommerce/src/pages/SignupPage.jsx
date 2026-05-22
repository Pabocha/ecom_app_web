import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../components/shared/Icon.jsx';

export default function SignupPage({ onLogin }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    passwordConfirm: '',
    firstName: '',
    lastName: '',
    phone: '',
    street: '',
    city: '',
    postalCode: '',
    country: '',
    gender: '',
    dateOfBirth: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const countries = ['France', 'Belgique', 'Suisse', 'Canada', 'Autres'];

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email invalide';
    }
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'Le prénom est requis';
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Le nom est requis';
    }
    if (!formData.phone || !/^\d{10,}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Numéro invalide (min 10 chiffres)';
    }
    if (!formData.street.trim()) {
      newErrors.street = 'L\'adresse est requise';
    }
    if (!formData.city.trim()) {
      newErrors.city = 'La ville est requise';
    }
    if (!formData.postalCode || formData.postalCode.length < 3) {
      newErrors.postalCode = 'Code postal invalide';
    }
    if (!formData.country) {
      newErrors.country = 'Le pays est requis';
    }
    if (!formData.gender) {
      newErrors.gender = 'Le genre est requis';
    }
    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = 'La date de naissance est requise';
    }
    if (formData.password.length < 6) {
      newErrors.password = 'Min 6 caractères';
    }
    if (formData.password !== formData.passwordConfirm) {
      newErrors.passwordConfirm = 'Les mots de passe ne correspondent pas';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    const user = {
      email: formData.email,
      phone: formData.phone,
      firstName: formData.firstName,
      lastName: formData.lastName,
      street: formData.street,
      city: formData.city,
      postalCode: formData.postalCode,
      country: formData.country,
      gender: formData.gender,
      dateOfBirth: formData.dateOfBirth,
      createdAt: new Date().toISOString(),
    };

    localStorage.setItem('user', JSON.stringify(user));
    onLogin(user);
    navigate('/');
    setLoading(false);
  };

  const handleOAuth = (provider) => {
    console.log(`OAuth ${provider} - Mock handler`);
    alert(`Inscription ${provider} - À implémenter avec backend`);
  };

  const FormField = ({ label, name, type = 'text', placeholder, required = true, error }) => (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        name={name}
        value={formData[name]}
        onChange={handleChange}
        placeholder={placeholder}
        className={`w-full px-3 py-2.5 border-2 rounded-lg focus:outline-none transition-colors text-sm ${
          error ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-orange-500'
        }`}
      />
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0d1b2a] to-[#1a2a3a] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#0d1b2a] to-[#1a2a3a] px-6 py-8 text-center">
          <h1 className="text-3xl font-black text-white font-['Barlow_Condensed']">
            Trade<span className="text-orange-500">Hub</span>
          </h1>
          <p className="text-gray-300 text-sm mt-2">Créer votre compte</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Email & Password Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Email"
              name="email"
              type="email"
              placeholder="votre@email.com"
              error={errors.email}
            />
            <FormField
              label="Téléphone"
              name="phone"
              type="tel"
              placeholder="+33 6 12 34 56 78"
              error={errors.phone}
            />
          </div>

          {/* Names Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Prénom"
              name="firstName"
              placeholder="Jean"
              error={errors.firstName}
            />
            <FormField
              label="Nom"
              name="lastName"
              placeholder="Dupont"
              error={errors.lastName}
            />
          </div>

          {/* Address */}
          <FormField
            label="Adresse"
            name="street"
            placeholder="123 Rue de la Paix"
            error={errors.street}
          />

          {/* City, Postal, Country Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              label="Ville"
              name="city"
              placeholder="Paris"
              error={errors.city}
            />
            <FormField
              label="Code postal"
              name="postalCode"
              placeholder="75001"
              error={errors.postalCode}
            />
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Pays <span className="text-red-500">*</span>
              </label>
              <select
                name="country"
                value={formData.country}
                onChange={handleChange}
                className={`w-full px-3 py-2.5 border-2 rounded-lg focus:outline-none transition-colors text-sm ${
                  errors.country ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-orange-500'
                }`}
              >
                <option value="">Sélectionner</option>
                {countries.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              {errors.country && <p className="text-red-500 text-xs mt-1">{errors.country}</p>}
            </div>
          </div>

          {/* Gender & Date of Birth */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Genre <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-3">
                {['Homme', 'Femme', 'Autre'].map(g => (
                  <label key={g} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="gender"
                      value={g}
                      checked={formData.gender === g}
                      onChange={handleChange}
                      className="w-4 h-4"
                    />
                    <span className="text-sm text-gray-700">{g}</span>
                  </label>
                ))}
              </div>
              {errors.gender && <p className="text-red-500 text-xs mt-1">{errors.gender}</p>}
            </div>
            <FormField
              label="Date de naissance"
              name="dateOfBirth"
              type="date"
              error={errors.dateOfBirth}
            />
          </div>

          {/* Passwords Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Mot de passe <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className={`w-full px-3 py-2.5 border-2 rounded-lg focus:outline-none transition-colors text-sm pr-10 ${
                    errors.password ? 'border-red-500' : 'border-gray-200 focus:border-orange-500'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <Icon name="eyeOff" size={16} /> : <Icon name="eye" size={16} />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Confirmer le mot de passe <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPasswordConfirm ? 'text' : 'password'}
                  name="passwordConfirm"
                  value={formData.passwordConfirm}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className={`w-full px-3 py-2.5 border-2 rounded-lg focus:outline-none transition-colors text-sm pr-10 ${
                    errors.passwordConfirm ? 'border-red-500' : 'border-gray-200 focus:border-orange-500'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                  className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
                >
                  {showPasswordConfirm ? <Icon name="eyeOff" size={16} /> : <Icon name="eye" size={16} />}
                </button>
              </div>
              {errors.passwordConfirm && <p className="text-red-500 text-xs mt-1">{errors.passwordConfirm}</p>}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed mt-6"
          >
            {loading ? 'Création...' : 'Créer mon compte'}
          </button>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Ou s'inscrire avec</span>
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

          {/* Login Link */}
          <div className="text-center mt-6 pt-6 border-t border-gray-200">
            <p className="text-gray-600 text-sm">
              Vous avez déjà un compte ?{' '}
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="text-orange-500 font-bold hover:text-orange-600 transition-colors"
              >
                Se connecter
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
