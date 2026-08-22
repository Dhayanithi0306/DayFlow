import React from 'react';

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const Checkbox = ({ label, id, ...props }: CheckboxProps) => {
  return (
    <label htmlFor={id} className="checkbox-wrapper">
      <input
        type="checkbox"
        id={id}
        className="checkbox-input"
        {...props}
      />
      <div className="checkbox-custom" aria-hidden="true">
        <svg className="checkbox-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      </div>
      <span className="checkbox-label">{label}</span>
    </label>
  );
};
