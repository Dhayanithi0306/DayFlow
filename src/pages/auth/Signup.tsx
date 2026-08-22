import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Input } from '../../components/ui/Input';
import { PasswordInput } from '../../components/ui/PasswordInput';
import { Button } from '../../components/ui/Button';
import { mockSignup } from '../../services/authService';

export const Signup: React.FC = () => {
  const [formData, setFormData] = useState({
    employeeId: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'employee'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validatePassword = (password: string) => {
    const minLength = password.length >= 8;
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    return minLength && hasUpper && hasLower && hasNumber && hasSpecial;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.employeeId || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (!validatePassword(formData.password)) {
      setError('Password must contain at least 8 characters, one uppercase, one lowercase, one number, and one special character.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);
    try {
      await mockSignup(formData);
      navigate('/verify-email', { state: { email: formData.email } });
    } catch (err: any) {
      setError(err.message || 'Failed to sign up');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900">Create an account</h2>
        <p className="text-slate-500 mt-2">Join your organization on Dayflow</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-lg text-sm text-red-600">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Employee ID"
          name="employeeId"
          placeholder="e.g. EMP001"
          value={formData.employeeId}
          onChange={handleChange}
        />
        <Input
          label="Email address"
          type="email"
          name="email"
          placeholder="name@dayflow.com"
          value={formData.email}
          onChange={handleChange}
        />
        
        <PasswordInput
          label="Password"
          name="password"
          placeholder="Create a strong password"
          value={formData.password}
          onChange={handleChange}
        />
        <PasswordInput
          label="Confirm Password"
          name="confirmPassword"
          placeholder="Confirm your password"
          value={formData.confirmPassword}
          onChange={handleChange}
        />

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Role</label>
          <select 
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full px-4 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-shadow"
          >
            <option value="employee">Employee</option>
            <option value="hr">HR</option>
          </select>
        </div>

        <Button type="submit" isLoading={isLoading} className="mt-6">
          Sign Up
        </Button>
      </form>

      <p className="mt-8 text-center text-sm text-slate-600">
        Already have an account?{' '}
        <Link to="/" className="font-medium text-indigo-600 hover:text-indigo-500">
          Sign in
        </Link>
      </p>
    </div>
  );
};
