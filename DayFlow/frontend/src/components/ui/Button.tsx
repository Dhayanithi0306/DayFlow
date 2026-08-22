import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
}

export const Button = ({ children, isLoading, disabled, ...props }: ButtonProps) => {
  return (
    <button className="btn-primary" disabled={isLoading || disabled} {...props}>
      {isLoading ? (
        <>
          <span className="spinner" aria-hidden="true"></span>
          Signing in...
        </>
      ) : (
        children
      )}
    </button>
  );
};
