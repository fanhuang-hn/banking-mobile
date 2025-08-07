'use client';

import Link from 'next/link';
import { Eye, EyeOff, LogIn, User, Languages } from 'lucide-react';
import { useLogin } from './useLogin';
import { getDemoAccount } from './authConfig';
import { useLanguage } from './useLanguage';

export default function LoginPage() {
  const {
    email,
    password,
    showPassword,
    loading,
    error,
    useMockData,
    setEmail,
    setPassword,
    handleLogin,
    handleDemoLogin,
    togglePasswordVisibility
  } = useLogin(); // Uses default config from environment
  
  const { language, toggleLanguage, t, isClient } = useLanguage();
  const demoAccount = getDemoAccount(useMockData);

  // Prevent hydration mismatch
  if (!isClient) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      {/* Language Toggle Button */}
      <button
        onClick={toggleLanguage}
        className="fixed top-4 right-4 z-10 bg-white hover:bg-gray-50 border border-gray-200 rounded-lg p-2 shadow-sm transition-colors duration-200"
        title={language === 'vi' ? 'Switch to English' : 'Chuyển sang tiếng Việt'}
      >
        <div className="flex items-center space-x-2">
          <Languages className="h-4 w-4 text-gray-600" />
          <span className="text-sm font-medium text-gray-600">
            {language === 'vi' ? 'EN' : 'VI'}
          </span>
        </div>
      </button>

      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-blue-500 rounded-full flex items-center justify-center">
            <LogIn className="h-8 w-8 text-white" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            {t.title}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {t.subtitle}
          </p>
          
          {/* Authentication Mode Indicator */}
          <div className="mt-3">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              useMockData 
                ? 'bg-yellow-100 text-yellow-800' 
                : 'bg-green-100 text-green-800'
            }`}>
              {useMockData ? `🧪 ${t.mockMode}` : `🔥 ${t.firebaseMode}`}
            </span>
          </div>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                {t.email}
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder={t.emailPlaceholder}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                {t.password}
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  className="relative block w-full px-3 py-2 pr-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder={t.passwordPlaceholder}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? t.loggingIn : t.login}
            </button>
          </div>

          {/* Demo Account Button */}
          <div>
            <button
              type="button"
              onClick={handleDemoLogin}
              className="group relative w-full flex justify-center py-3 px-4 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <User className="h-4 w-4 mr-2" />
              {t.fillDemoInfo}
            </button>
          </div>

          {/* Forgot password button */}
          <div>
            <button
              type="button"
              className="group relative w-full flex justify-center py-3 px-4 border border-red-300 text-sm font-medium rounded-lg text-white bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              {t.forgotPassword}
            </button>   
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              {t.noAccount}{' '}
              <Link href="/register" className="font-medium text-blue-600 hover:text-blue-500">
                {t.signUp}
              </Link>
            </p>
          </div>

          {/* Demo Account Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-sm font-medium text-blue-900 mb-2">
              {t.demoAccountInfo} ({useMockData ? t.mockMode : t.firebaseMode})
            </h3>
            <div className="text-sm text-blue-800 space-y-1">
              <p><strong>Email:</strong> {demoAccount.email}</p>
              <p><strong>Password:</strong> {demoAccount.password}</p>
              <p className="text-xs text-blue-600 mt-2">
                {t.demoInstructions}
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
