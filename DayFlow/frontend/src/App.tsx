import { useState } from 'react';

function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const validateForm = () => {
    if (!email.trim()) return 'Email or username is required.';
    if (!password) return 'Password is required.';
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);

    // Mock API call to the backend since it doesn't exist yet
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simple mock authentication logic
      if (email.includes('@') && password.length >= 6) {
        setSuccess('Login successful! Redirecting...');
        // Here you would set auth state and redirect, e.g.,
        // localStorage.setItem('token', 'mock-jwt-token');
        // window.location.href = '/dashboard';
      } else {
        setError('Invalid credentials. Please try again.');
      }
    } catch (err) {
      setError('A network error occurred. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="brand-section">
        <h1 className="brand-logo">DayFlow</h1>
        <p className="brand-subtitle">Welcome back! Please enter your details.</p>
      </div>

      {error && (
        <div className="alert alert-error" role="alert">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          {error}
        </div>
      )}

      {success && (
        <div className="alert alert-success" role="alert">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <label htmlFor="email" className="form-label">Email or Username</label>
          <input
            id="email"
            type="text"
            className="form-input"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
            autoComplete="username"
          />
        </div>

        <div className="form-group">
          <label htmlFor="password" className="form-label">Password</label>
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            className="form-input"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
            autoComplete="current-password"
          />
          <button 
            type="button"
            className="password-toggle"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                <line x1="1" y1="1" x2="23" y2="23"></line>
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
            )}
          </button>
        </div>

        <div className="options-row">
          <label className="remember-me">
            <input type="checkbox" className="remember-checkbox" disabled={isLoading} />
            Remember for 30 days
          </label>
          <a href="#" className="forgot-password" onClick={(e) => e.preventDefault()}>
            Forgot password?
          </a>
        </div>

        <button type="submit" className="btn-primary" disabled={isLoading}>
          {isLoading ? (
            <>
              <span className="spinner"></span>
              Signing in...
            </>
          ) : (
            'Sign In'
          )}
        </button>
      </form>
    </div>
  );
}

export default App;
