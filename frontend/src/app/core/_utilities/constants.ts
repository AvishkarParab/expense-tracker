export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: 'auth/login',
    REGISTER: 'auth/register',
  },
  EXPENSES: {
    BASE: 'expenses/',
  },
} as const;

export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'expense_tracker_access_token',
  THEME: 'expense_tracker_theme',
} as const;

export const HTTP_CONTENT_TYPES = {
  JSON: 'application/json',
  FORM_URLENCODED: 'application/x-www-form-urlencoded',
} as const;

export const RESULT_KINDS = {
  SUCCESS: 'success',
  ERROR: 'error',
} as const;

export const AUTH_MESSAGES = {
  LOGIN_FAILED: 'Login failed. Please try again.',
  REGISTRATION_FAILED: 'Registration failed. Please try again.',
  REGISTRATION_SUCCESS:
    'Account created successfully. Redirecting to login...',
} as const;
