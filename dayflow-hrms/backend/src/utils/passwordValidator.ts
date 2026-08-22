export interface PasswordValidationResult {
  isValid: boolean;
  message?: string;
}

export const validatePassword = (password: string): PasswordValidationResult => {
  if (!password || password.length < 8) {
    return {
      isValid: false,
      message: 'Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number and one special character.',
    };
  }

  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

  if (!hasUppercase || !hasLowercase || !hasNumber || !hasSpecialChar) {
    return {
      isValid: false,
      message: 'Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number and one special character.',
    };
  }

  return { isValid: true };
};
