import { COLORS } from "../constants/colors";

export interface ValidationResult {
  isValid: boolean;
  error: string;
}

export const validateEmail = (email: string): ValidationResult => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!email) {
    return { isValid: false, error: "Email is required" };
  }

  if (!emailRegex.test(email)) {
    return { isValid: false, error: "Please enter a valid email address" };
  }

  return { isValid: true, error: "" };
};

export const validatePassword = (
  password: string,
  minLength: number = 6,
): ValidationResult => {
  if (!password) {
    return { isValid: false, error: "Password is required" };
  }

  if (password.length < minLength) {
    return {
      isValid: false,
      error: `Password must be at least ${minLength} characters`,
    };
  }

  return { isValid: true, error: "" };
};

export const validateStrongPassword = (password: string): ValidationResult => {
  if (!password) {
    return { isValid: false, error: "Password is required" };
  }

  if (password.length < 8) {
    return {
      isValid: false,
      error: "Password must be at least 8 characters",
    };
  }

  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);

  if (!hasUpperCase || !hasLowerCase || !hasNumbers) {
    return {
      isValid: false,
      error: "Password must contain uppercase, lowercase, and numbers",
    };
  }

  return { isValid: true, error: "" };
};

export const validatePasswordConfirmation = (
  password: string,
  confirmPassword: string,
): ValidationResult => {
  if (!confirmPassword) {
    return { isValid: false, error: "Please confirm your password" };
  }

  if (password !== confirmPassword) {
    return { isValid: false, error: "Passwords do not match" };
  }

  return { isValid: true, error: "" };
};

export const validateFullName = (name: string): ValidationResult => {
  const trimmedName = name.trim();

  if (!trimmedName) {
    return { isValid: false, error: "Full name is required" };
  }

  if (trimmedName.length < 2) {
    return {
      isValid: false,
      error: "Full name must be at least 2 characters",
    };
  }

  if (trimmedName.length > 50) {
    return {
      isValid: false,
      error: "Full name must be less than 50 characters",
    };
  }

  // Check for at least first and last name
  const nameParts = trimmedName.split(" ").filter((part) => part.length > 0);
  if (nameParts.length < 2) {
    return {
      isValid: false,
      error: "Please enter your first and last name",
    };
  }

  return { isValid: true, error: "" };
};

export const validateRequired = (
  value: string,
  fieldName: string,
): ValidationResult => {
  if (!value || value.trim().length === 0) {
    return { isValid: false, error: `${fieldName} is required` };
  }

  return { isValid: true, error: "" };
};

export const validateMinLength = (
  value: string,
  minLength: number,
  fieldName: string,
): ValidationResult => {
  if (value.length < minLength) {
    return {
      isValid: false,
      error: `${fieldName} must be at least ${minLength} characters`,
    };
  }

  return { isValid: true, error: "" };
};

export interface PasswordStrength {
  strength: number;
  text: string;
  color: string;
}

export const getPasswordStrength = (
  password: string,
  colors: {
    weak: string;
    fair: string;
    good: string;
    strong: string;
    default: string;
  } = {
    weak: COLORS.ERROR,
    fair: COLORS.WARNING,
    good: COLORS.INFO,
    strong: COLORS.SUCCESS,
    default: COLORS.DARK_GRAY,
  },
): PasswordStrength => {
  if (!password) {
    return { strength: 0, text: "", color: colors.default };
  }

  let score = 0;
  const checks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    numbers: /\d/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };

  score = Object.values(checks).filter(Boolean).length;

  if (score <= 2) return { strength: 1, text: "Weak", color: colors.weak };
  if (score <= 3) return { strength: 2, text: "Fair", color: colors.fair };
  if (score <= 4) return { strength: 3, text: "Good", color: colors.good };
  return { strength: 4, text: "Strong", color: colors.strong };
};
