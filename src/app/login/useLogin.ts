'use client';

import { useState } from 'react';
import { mockSignInWithNotification } from '@/lib/mockAuth';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { USE_MOCK_AUTH, getDemoAccount } from './authConfig';

interface UseLoginOptions {
  useMockData?: boolean;
}

export const useLogin = (options: UseLoginOptions = {}) => {
  const { useMockData = false } = options; // Default from environment
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (useMockData) {
        // Use mock authentication
        await mockSignInWithNotification(email, password);
      } else {
        // Use Firebase authentication
        await signInWithEmailAndPassword(auth, email, password);
      }
      router.push('/dashboard');
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = () => {
    const demoAccount = getDemoAccount(useMockData);
    setEmail(demoAccount.email);
    setPassword(demoAccount.password);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return {
    // State values
    email,
    password,
    showPassword,
    loading,
    error,
    useMockData,
    
    // State setters
    setEmail,
    setPassword,
    setError,
    
    // Handler functions
    handleLogin,
    handleDemoLogin,
    togglePasswordVisibility
  };
};