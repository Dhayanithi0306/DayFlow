import { useState } from 'react';
import { AuthCard } from './components/AuthCard';
import { InputField } from './components/ui/InputField';
import { PasswordField } from './components/ui/PasswordField';
import { Checkbox } from './components/ui/Checkbox';
import { Button } from './components/ui/Button';
import { Alert } from './components/ui/Alert';

function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Validation state
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  
  // Submission state
  const [globalError, setGlobalError] = useState('');
  const [success, setSuccess] = useState(false);

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
    setSuccess(false);

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    // Mock API call to the backend
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simple mock authentication logic
      if (email.includes('@') && password.length >= 6) {
        setSuccess(true);
        // Realistic application flow: redirect instead of lingering on success state
        setTimeout(() => {
          // window.location.href = '/workspace';
        }, 800);
      } else {
        setGlobalError('Incorrect email or password. Please try again.');
      }
    } catch (err) {
      setGlobalError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
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

      {success && (
        <Alert type="success">Signed in successfully</Alert>
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
          disabled={isLoading || success}
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
          disabled={isLoading || success}
          error={passwordError}
          autoComplete="current-password"
        />

        <div className="options-row">
          <Checkbox 
            id="remember" 
            label="Remember me for 30 days" 
            disabled={isLoading || success}
          />
          <a href="#" className="auth-link" onClick={(e) => e.preventDefault()}>
            Forgot password?
          </a>
        </div>

        <Button type="submit" isLoading={isLoading} disabled={success}>
          Sign In
        </Button>
      </form>
    </AuthCard>
  );
}

export default App;
