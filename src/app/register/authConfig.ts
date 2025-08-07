/**
 * Authentication configuration for register page
 * This file contains configuration for switching between mock and Firebase authentication
 */

// Environment variable to control authentication mode
export const USE_MOCK_AUTH = process.env.NEXT_PUBLIC_USE_MOCK_AUTH !== 'false';

export type AuthMode = 'mock' | 'firebase';

export const getAuthMode = (): AuthMode => USE_MOCK_AUTH ? 'mock' : 'firebase';
