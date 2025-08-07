/**
 * Authentication configuration
 * This file contains configuration for switching between mock and Firebase authentication
 */

// Environment variable to control authentication mode
// Set NEXT_PUBLIC_USE_MOCK_AUTH=false in .env.local to use Firebase
export const USE_MOCK_AUTH = process.env.NEXT_PUBLIC_USE_MOCK_AUTH !== 'false';

// Demo account credentials for different modes
export const DEMO_ACCOUNTS = {
  mock: {
    email: 'demo.user@ewallet.com',
    password: 'demo123456'
  },
  firebase: {
    email: 'demo@firebase.com',
    password: 'demo123456'
  }
} as const;

export type AuthMode = 'mock' | 'firebase';

export const getAuthMode = (): AuthMode => USE_MOCK_AUTH ? 'mock' : 'firebase';

export const getDemoAccount = (useMockData: boolean = USE_MOCK_AUTH) => {
  return useMockData ? DEMO_ACCOUNTS.mock : DEMO_ACCOUNTS.firebase;
};
