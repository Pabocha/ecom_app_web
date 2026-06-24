import React, { forwardRef } from 'react';

const Input = forwardRef(function Input(
  { label, error, suffix, required = false, className = '', ...props },
  ref,
) {
  return (
    <div>
      {label && (
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="relative">
        <input
          ref={ref}
          required={required}
          className={`w-full rounded-lg border-2 px-4 py-3 text-sm transition-colors focus:outline-none ${error ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-orange-500'} ${suffix ? 'pr-12' : ''} ${className}`}
          {...props}
        />
        {suffix && <div className="absolute right-3 top-1/2 -translate-y-1/2">{suffix}</div>}
      </div>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
