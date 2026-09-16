import { ITextValue } from '@core/models';

const API_ENDPOINTS = {
  AUTH: {
    LOGIN: 'auth/login',
    REGISTER: 'auth/register',
  },
  EXPENSES: {
    BASE: 'expenses/',
    INSIGHTS: 'expenses/insights',
  },
} as const;

const STORAGE_KEYS = {
  ACCESS_TOKEN: 'expense_tracker_access_token',
  THEME: 'expense_tracker_theme',
} as const;

const HTTP_CONTENT_TYPES = {
  JSON: 'application/json',
  FORM_URLENCODED: 'application/x-www-form-urlencoded',
} as const;

const RESULT_KINDS = {
  SUCCESS: 'success',
  ERROR: 'error',
} as const;

const AUTH_MESSAGES = {
  LOGIN_FAILED: 'Login failed. Please try again.',
  REGISTRATION_FAILED: 'Registration failed. Please try again.',
  REGISTRATION_SUCCESS: 'Account created successfully. Redirecting to login...',
} as const;

const EXPENSE_MESSAGES = {
  CREATE_FAILED: 'Could not save the expense. Please try again.',
  UPDATE_FAILED: 'Could not update the expense. Please try again.',
  DELETE_FAILED: 'Could not delete the expense. Please try again.',
  LOAD_FAILED: 'Could not load expenses. Please try again.',
  INSIGHTS_FAILED: 'Could not load insights. Please try again.',
} as const;

const EXPENSE_CATEGORIES: ITextValue[] = [
  { value: 'Food', text: 'Food & Dining', additionalInfo: { icon: 'bi-cup-hot' } },
  { value: 'Groceries', text: 'Groceries', additionalInfo: { icon: 'bi-basket' } },
  { value: 'Transport', text: 'Transport', additionalInfo: { icon: 'bi-car-front' } },
  { value: 'Shopping', text: 'Shopping', additionalInfo: { icon: 'bi-bag' } },
  { value: 'Entertainment', text: 'Entertainment', additionalInfo: { icon: 'bi-film' } },
  { value: 'Bills', text: 'Bills & Utilities', additionalInfo: { icon: 'bi-receipt' } },
  { value: 'Health', text: 'Health', additionalInfo: { icon: 'bi-heart-pulse' } },
  { value: 'Education', text: 'Education', additionalInfo: { icon: 'bi-mortarboard' } },
  { value: 'Travel', text: 'Travel', additionalInfo: { icon: 'bi-airplane' } },
  { value: 'Other', text: 'Other', additionalInfo: { icon: 'bi-three-dots' } },
];

export {
  API_ENDPOINTS,
  STORAGE_KEYS,
  HTTP_CONTENT_TYPES,
  RESULT_KINDS,
  AUTH_MESSAGES,
  EXPENSE_MESSAGES,
  EXPENSE_CATEGORIES,
};
