'use client';

import { useState, useEffect } from 'react';
import { Language, translations, getDefaultLanguage, getBrowserLanguage } from './i18n';

export const useLanguage = () => {
  const [language, setLanguage] = useState<Language>(getDefaultLanguage());
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // Get language from localStorage or browser
    const savedLanguage = localStorage.getItem('app-language') as Language;
    if (savedLanguage && (savedLanguage === 'vi' || savedLanguage === 'en')) {
      setLanguage(savedLanguage);
    } else {
      const browserLanguage = getBrowserLanguage();
      setLanguage(browserLanguage);
      localStorage.setItem('app-language', browserLanguage);
    }
  }, []);

  const changeLanguage = (newLanguage: Language) => {
    setLanguage(newLanguage);
    localStorage.setItem('app-language', newLanguage);
  };

  const toggleLanguage = () => {
    const newLanguage = language === 'vi' ? 'en' : 'vi';
    changeLanguage(newLanguage);
  };

  const t = translations[language];

  return {
    language,
    changeLanguage,
    toggleLanguage,
    t,
    isClient
  };
};
