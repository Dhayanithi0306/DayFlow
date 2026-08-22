import React, { forwardRef } from 'react';

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  ({ label, error, id, className = '', ...props }, ref) => {
    return (
      <div className="form-group">
        <label htmlFor={id} className="form-label">
          {label}
        </label>
        <div className="input-wrapper">
          <input
            id={id}
            ref={ref}
            className={`form-input ${error ? 'has-error' : ''} ${className}`}
            aria-invalid={!!error}
            aria-describedby={error ? `${id}-error` : undefined}
            {...props}
          />
        </div>
        {error && (
          <div id={`${id}-error`} className="form-error-msg" role="alert">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            {error}
          </div>
        )}
      </div>
    );
  }
);
InputField.displayName = 'InputField';
