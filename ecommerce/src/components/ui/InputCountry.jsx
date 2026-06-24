import React, { useState, useEffect } from 'react';
import ReactFlagsSelect from 'react-flags-select';

export function InputCountry({ register, setValue, error, label, required = false, className = '' }) {
  const [selectedCountry, setSelectedCountry] = useState('');

  useEffect(() => {
    register('country', { required: required ? 'Le pays est requis' : false });
  }, [register, required]);

  const handleSelectCountry = (code) => {
    setSelectedCountry(code);
    setValue('country', code, { shouldValidate: true }); // force la validation pour enlever l'erreur visuelle
  };

  return (
    <div className={className}>
      {/* 1. Même structure de Label que votre Input */}
      {label && (
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <div className="relative">
        {/* 2. Le sélecteur stylisé avec les classes de votre Input */}
        <ReactFlagsSelect
          selected={selectedCountry}
          onSelect={handleSelectCountry}
          searchable={true}
          searchPlaceholder="Rechercher un pays"
          placeholder="Sélectionnez votre pays"
          // C'est ici qu'on applique le design identique à votre input de base
          selectButtonClassName={`w-full rounded-lg border-2 px-4 py-3 text-sm transition-colors focus:outline-none !min-h-[48px] !m-0
            ${error 
              ? 'border-red-500 focus:border-red-500 text-red-600' 
              : 'border-gray-200 focus:border-orange-500 text-gray-700'
            }`}
        className="menu-flags"/>
      </div>

      {/* 3. Même gestion des messages d'erreurs que votre Input */}
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
}