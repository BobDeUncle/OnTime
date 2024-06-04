type PasswordValidationResult = {
  isValid: boolean;
  message: string;
};

export const validatePassword = (password: string, confirmPassword: string): PasswordValidationResult => {
  if (password === '') {
    return { isValid: false, message: 'Password cannot be empty' };
  }
  
  if (confirmPassword === '') {
    return { isValid: false, message: 'Confirmation password cannot be empty' };
  }

  if (password !== confirmPassword) {
    return { isValid: false, message: 'Passwords do not match' };
  }

  if (password.length < 6) {
    return { isValid: false, message: 'Password must be at least 6 characters long' };
  }

  if (!/[A-Z]/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one uppercase letter' };
  }

  if (!/[a-z]/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one lowercase letter' };
  }

  if (!/\d/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one digit' };
  }

  return { isValid: true, message: '' };
};
