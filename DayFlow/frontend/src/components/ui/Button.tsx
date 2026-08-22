import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  loadingText?: string;
}

export const Button = ({ children, isLoading, loadingText, disabled, ...props }: ButtonProps) => {
  return (
    <button className="btn-primary" disabled={isLoading || disabled} {...props}>
      {isLoading ? (
        <>
          <span className="spinner" aria-hidden="true"></span>
          {loadingText || 'Signing in...'}
        </>
      ) : (
        children
      )}
    </button>
  );
};
