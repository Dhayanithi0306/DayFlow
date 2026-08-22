import React from 'react';

interface AuthCardProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

export const AuthCard = ({ children, title, subtitle }: AuthCardProps) => {
  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <header className="auth-header">
          <div className="auth-logo">
            <svg className="auth-logo-icon" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
              <path d="M2 17l10 5 10-5"></path>
              <path d="M2 12l10 5 10-5"></path>
            </svg>
            <span>DayFlow</span>
          </div>
          <h1 className="auth-title">{title}</h1>
          <p className="auth-subtitle">{subtitle}</p>
        </header>
        {children}
      </div>
    </div>
  );
};
