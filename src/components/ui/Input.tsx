import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        <label className="block text-sm font-medium text-slate-700 mb-1.5">
          {label}
        </label>
        <input
          ref={ref}
          className={`w-full px-4 py-2.5 rounded-lg border ${
            error ? 'border-red-500 focus:ring-red-500' : 'border-slate-300 focus:ring-indigo-600'
          } bg-white text-slate-900 focus:outline-none focus:ring-2 focus:border-transparent transition-shadow ${className}`}
          {...props}
        />
        {error && <p className="mt-1.5 text-sm text-red-600">{error}</p>}
      </div>
    );
  }
);
Input.displayName = 'Input';
