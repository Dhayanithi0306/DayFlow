import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthCard } from '../../components/AuthCard';
import { InputField } from '../../components/ui/InputField';
import { PasswordField } from '../../components/ui/PasswordField';
import { Checkbox } from '../../components/ui/Checkbox';
import { Button } from '../../components/ui/Button';
import { Alert } from '../../components/ui/Alert';
import { useAuth } from './AuthContext';

export const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Validation state
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  
  // Submission state
  const [globalError, setGlobalError] = useState('');

  // Get the path to redirect to after successful login
  const from = location.state?.from?.pathname || null;

  const validateForm = () => {
    let isValid = true;
    setEmailError('');
    setPasswordError('');

    if (!email.trim()) {
      setEmailError('Email or username is required');
      isValid = false;
    }
    
    if (!password) {
      setPasswordError('Password is required');
      isValid = false;
    }
    
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGlobalError('');

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Calls the real AuthContext which uses our mock auth.service
      await login({ email, password });
      
      // We don't need to manually redirect based on role here initially,
      // because the AuthContext handles the user state, but let's do a smart redirect
      const currentUserStr = localStorage.getItem('dayflow_auth_user');
      if (currentUserStr) {
         const user = JSON.parse(currentUserStr);
         if (user.firstLogin) {
            navigate('/change-password', { replace: true });
         } else if (from && from !== '/login') {
            navigate(from, { replace: true });
         } else {
            // Default role-based redirection
            if (user.role === 'ADMIN') navigate('/admin', { replace: true });
            else if (user.role === 'HR') navigate('/hr', { replace: true });
            else navigate('/employee', { replace: true });
         }
      }
    } catch (err: any) {
      setGlobalError(err.message || 'Incorrect email or password. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthCard 
      title="Welcome back" 
      subtitle="Sign in to continue to your workspace."
    >
      {globalError && (
        <Alert type="error">{globalError}</Alert>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <InputField
          id="email"
          label="Email or username"
          type="text"
          placeholder="name@company.com"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (emailError) setEmailError('');
          }}
          disabled={isSubmitting}
          error={emailError}
          autoComplete="username"
          autoFocus
        />

        <PasswordField
          id="password"
          label="Password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            if (passwordError) setPasswordError('');
          }}
          disabled={isSubmitting}
          error={passwordError}
          autoComplete="current-password"
        />

        <div className="options-row">
          <Checkbox 
            id="remember" 
            label="Remember me for 30 days" 
            disabled={isSubmitting}
          />
          <a href="#" className="auth-link" onClick={(e) => e.preventDefault()}>
            Forgot password?
          </a>
        </div>

        <Button type="submit" isLoading={isSubmitting} loadingText="Signing in...">
          Sign In
        </Button>
      </form>
    </AuthCard>
  );
};
