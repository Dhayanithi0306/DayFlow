import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthCard } from '../../components/AuthCard';
import { PasswordField } from '../../components/ui/PasswordField';
import { Button } from '../../components/ui/Button';
import { Alert } from '../../components/ui/Alert';
import { useAuth } from './AuthContext';
import { authService } from './auth.service';

export const ChangePasswordPage = () => {
  const navigate = useNavigate();
  const { updateUser } = useAuth();
  
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [fieldError, setFieldError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setFieldError('');

    if (newPassword.length < 8) {
      setFieldError('Password must be at least 8 characters');
      return;
    }

    if (newPassword !== confirmPassword) {
      setFieldError('Passwords do not match');
      return;
    }

    setIsSubmitting(true);

    try {
      const updatedUser = await authService.changePassword(newPassword);
      updateUser(updatedUser);
      
      // Redirect based on role
      if (updatedUser.role === 'ADMIN') navigate('/admin', { replace: true });
      else if (updatedUser.role === 'HR') navigate('/hr', { replace: true });
      else navigate('/employee', { replace: true });
      
    } catch (err: any) {
      setError(err.message || 'Failed to change password');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthCard 
      title="Change Password" 
      subtitle="Since this is your first login, please set a new password."
    >
      {error && (
        <Alert type="error">{error}</Alert>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <PasswordField
          id="new-password"
          label="New Password"
          placeholder="Min. 8 characters"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          disabled={isSubmitting}
          autoComplete="new-password"
          autoFocus
        />

        <PasswordField
          id="confirm-password"
          label="Confirm Password"
          placeholder="Repeat new password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          disabled={isSubmitting}
          error={fieldError}
          autoComplete="new-password"
        />

        <div style={{ marginTop: '2rem' }}>
          <Button type="submit" isLoading={isSubmitting} loadingText="Saving...">
            Update Password
          </Button>
        </div>
      </form>
    </AuthCard>
  );
};
