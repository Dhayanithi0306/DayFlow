import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';

export const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="text-center space-y-6">
        <h1 className="text-8xl font-black text-indigo-900">404</h1>
        <p className="text-2xl font-bold text-slate-800">Page not found</p>
        <p className="text-slate-500 max-w-md mx-auto">
          Sorry, we couldn't find the page you're looking for. Please check the URL or return to the login page.
        </p>
        <div className="pt-6">
          <Link to="/" tabIndex={-1}>
            <Button className="w-auto px-8 inline-flex">Back to Login</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
