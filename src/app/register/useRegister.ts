'use client';

import { useState } from 'react';
import { mockCreateUserWithNotification } from '@/lib/mockAuth';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { USE_MOCK_AUTH } from './authConfig';

interface UseRegisterOptions {
  useMockData?: boolean;
}

interface FormData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export const useRegister = (options: UseRegisterOptions = {}) => {
  const { useMockData = USE_MOCK_AUTH } = options;
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validateForm = (t: any): string | null => {
    if (formData.password !== formData.confirmPassword) {
      return t.passwordMismatch;
    }

    if (formData.password.length < 6) {
      return t.passwordTooShort;
    }

    return null;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Note: t will be passed from component
    return { needsTranslations: true };
  };

  const submitRegister = async (e: React.FormEvent, t: any) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validate form
    const validationError = validateForm(t);
    if (validationError) {
      setError(validationError);
      setLoading(false);
      return;
    }

    try {
      if (useMockData) {
        // Use mock authentication
        await mockCreateUserWithNotification(
          formData.email,
          formData.password,
          formData.fullName
        );
      } else {
        // Use Firebase authentication
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          formData.email,
          formData.password
        );
        
        // Update user profile with display name
        await updateProfile(userCredential.user, {
          displayName: formData.fullName
        });
      }
      router.push('/dashboard');
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return {
    // State values
    formData,
    showPassword,
    showConfirmPassword,
    loading,
    error,
    useMockData,
    
    // State setters
    setFormData,
    setError,
    
    // Handler functions
    handleChange,
    handleRegister,
    submitRegister,
    togglePasswordVisibility,
    toggleConfirmPasswordVisibility
  };
};
