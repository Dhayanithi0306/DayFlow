import React, { InputHTMLAttributes } from 'react';

export interface RadioProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  helperText?: string;
}

export const Radio: React.FC<RadioProps> = ({ label, helperText, className = '', id, disabled, ...props }) => {
  const radioId = id || label.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="flex items-start gap-2.5">
      <input
        type="radio"
        id={radioId}
        disabled={disabled}
        className={`w-4 h-4 mt-0.5 text-indigo-600 border-slate-300 focus:ring-indigo-500 disabled:opacity-50 cursor-pointer ${className}`}
        {...props}
      />
      <div className="text-sm">
        <label htmlFor={radioId} className="font-medium text-slate-800 cursor-pointer select-none">
          {label}
        </label>
        {helperText && <p className="text-xs text-slate-500">{helperText}</p>}
      </div>
    </div>
  );
};
