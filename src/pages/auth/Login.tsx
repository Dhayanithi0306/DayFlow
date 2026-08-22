import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Input } from '../../components/ui/Input';
import { PasswordInput } from '../../components/ui/PasswordInput';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';
import { mockLogin } from '../../services/authService';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    try {
      const user = await mockLogin(email, password);
      login(user);
      if (user.role === 'employee') {
        navigate('/employee/dashboard');
      } else {
        navigate('/admin/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900">Welcome back</h2>
        <p className="text-slate-500 mt-2">Sign in to your Dayflow account</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-lg text-sm text-red-600">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          label="Email address"
          type="email"
          placeholder="name@dayflow.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        
        <div className="space-y-1.5">
          <PasswordInput
            label="Password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className="flex justify-between items-center px-1">
            <label className="flex items-center text-sm text-slate-600">
              <input type="checkbox" className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-600 mr-2" />
              Remember me
            </label>
            <Link to="/forgot-password" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
              Forgot password?
            </Link>
          </div>
        </div>

        <Button type="submit" isLoading={isLoading} className="mt-6">
          Sign In
        </Button>
      </form>

      <p className="mt-8 text-center text-sm text-slate-600">
        Don't have an account?{' '}
        <Link to="/signup" className="font-medium text-indigo-600 hover:text-indigo-500">
          Sign up
        </Link>
      </p>
    </div>
  );
};
