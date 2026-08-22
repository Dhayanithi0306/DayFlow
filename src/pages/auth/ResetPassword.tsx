import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PasswordInput } from '../../components/ui/PasswordInput';
import { Button } from '../../components/ui/Button';
import { mockResetPassword } from '../../services/authService';

export const ResetPassword: React.FC = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const validatePassword = (pwd: string) => {
    return pwd.length >= 8 && /[A-Z]/.test(pwd) && /[a-z]/.test(pwd) && /[0-9]/.test(pwd) && /[!@#$%^&*(),.?":{}|<>]/.test(pwd);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (!validatePassword(password)) {
      setError('Password must contain at least 8 characters, one uppercase, one lowercase, one number, and one special character.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);
    try {
      await mockResetPassword(password);
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Failed to reset password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900">Create new password</h2>
        <p className="text-slate-500 mt-2">Your new password must be different from previous used passwords.</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-lg text-sm text-red-600">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <PasswordInput
          label="New Password"
          placeholder="Enter new password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <PasswordInput
          label="Confirm New Password"
          placeholder="Confirm new password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <Button type="submit" isLoading={isLoading} className="mt-6">
          Reset Password
        </Button>
      </form>
    </div>
  );
};
