import { forwardRef } from 'react';

const Input = forwardRef(function Input({ label, error, icon: Icon, className = '', ...props }, ref) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-sm font-medium text-dark-300">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-400">
            <Icon size={18} />
          </div>
        )}
        <input
          ref={ref}
          className={`input-field ${Icon ? 'pl-10' : ''} ${error ? 'border-emergency-500 focus:border-emergency-500 focus:ring-emergency-500/20' : ''} ${className}`}
          {...props}
        />
      </div>
      {error && (
        <p className="text-sm text-emergency-400">{error}</p>
      )}
    </div>
  );
});

export default Input;
