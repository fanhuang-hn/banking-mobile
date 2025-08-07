/**
 * Language configuration and translations for the register page
 */

export type Language = 'vi' | 'en';

export interface RegisterTranslations {
  title: string;
  subtitle: string;
  fullName: string;
  fullNamePlaceholder: string;
  email: string;
  emailPlaceholder: string;
  password: string;
  passwordPlaceholder: string;
  confirmPassword: string;
  confirmPasswordPlaceholder: string;
  register: string;
  registering: string;
  alreadyHaveAccount: string;
  signIn: string;
  mockMode: string;
  firebaseMode: string;
  // Error messages
  passwordMismatch: string;
  passwordTooShort: string;
}

export const translations: Record<Language, RegisterTranslations> = {
  vi: {
    title: 'Tạo tài khoản mới',
    subtitle: 'Đăng ký để sử dụng ví điện tử',
    fullName: 'Họ và tên',
    fullNamePlaceholder: 'Nhập họ và tên',
    email: 'Email',
    emailPlaceholder: 'Nhập email của bạn',
    password: 'Mật khẩu',
    passwordPlaceholder: 'Tạo mật khẩu',
    confirmPassword: 'Xác nhận mật khẩu',
    confirmPasswordPlaceholder: 'Nhập lại mật khẩu',
    register: 'Đăng ký',
    registering: 'Đang đăng ký...',
    alreadyHaveAccount: 'Đã có tài khoản?',
    signIn: 'Đăng nhập',
    mockMode: 'Chế độ Demo',
    firebaseMode: 'Chế độ Firebase',
    passwordMismatch: 'Mật khẩu xác nhận không khớp',
    passwordTooShort: 'Mật khẩu phải có ít nhất 6 ký tự'
  },
  en: {
    title: 'Create New Account',
    subtitle: 'Sign up to use e-wallet',
    fullName: 'Full Name',
    fullNamePlaceholder: 'Enter your full name',
    email: 'Email',
    emailPlaceholder: 'Enter your email',
    password: 'Password',
    passwordPlaceholder: 'Create password',
    confirmPassword: 'Confirm Password',
    confirmPasswordPlaceholder: 'Re-enter password',
    register: 'Register',
    registering: 'Registering...',
    alreadyHaveAccount: 'Already have an account?',
    signIn: 'Sign in',
    mockMode: 'Mock Mode',
    firebaseMode: 'Firebase Mode',
    passwordMismatch: 'Password confirmation does not match',
    passwordTooShort: 'Password must be at least 6 characters'
  }
};

// Default language
export const DEFAULT_LANGUAGE: Language = 'vi';

// Get browser language or fallback to default
export const getBrowserLanguage = (): Language => {
  if (typeof window === 'undefined') return DEFAULT_LANGUAGE;
  
  const browserLang = navigator.language.toLowerCase();
  if (browserLang.startsWith('en')) return 'en';
  if (browserLang.startsWith('vi')) return 'vi';
  
  return DEFAULT_LANGUAGE;
};

// Environment variable to control default language
export const getDefaultLanguage = (): Language => {
  const envLang = process.env.NEXT_PUBLIC_DEFAULT_LANGUAGE as Language;
  return envLang && (envLang === 'vi' || envLang === 'en') ? envLang : DEFAULT_LANGUAGE;
};
