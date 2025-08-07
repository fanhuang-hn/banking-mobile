/**
 * Language configuration and translations for the login page
 */

export type Language = 'vi' | 'en';

export interface LoginTranslations {
  title: string;
  subtitle: string;
  email: string;
  emailPlaceholder: string;
  password: string;
  passwordPlaceholder: string;
  login: string;
  loggingIn: string;
  demoAccount: string;
  fillDemoInfo: string;
  noAccount: string;
  signUp: string;
  demoAccountInfo: string;
  demoInstructions: string;
  mockMode: string;
  firebaseMode: string;
  forgotPassword: string;
}

export const translations: Record<Language, LoginTranslations> = {
  vi: {
    title: 'Đăng nhập ví điện tử',
    subtitle: 'Truy cập vào tài khoản của bạn',
    email: 'Email',
    emailPlaceholder: 'Nhập email của bạn',
    password: 'Mật khẩu',
    passwordPlaceholder: 'Nhập mật khẩu',
    login: 'Đăng nhập',
    loggingIn: 'Đang đăng nhập...',
    demoAccount: 'Tài khoản demo',
    fillDemoInfo: 'Điền thông tin tài khoản demo',
    noAccount: 'Chưa có tài khoản?',
    signUp: 'Đăng ký ngay',
    demoAccountInfo: 'Tài khoản demo',
    demoInstructions: 'Nhấn "Điền thông tin tài khoản demo" để tự động điền thông tin, sau đó nhấn "Đăng nhập"',
    mockMode: 'Chế độ Demo',
    firebaseMode: 'Chế độ Firebase',
    forgotPassword: 'Quên mật khẩu?'
  },
  en: {
    title: 'E-Wallet Login',
    subtitle: 'Access your account',
    email: 'Email',
    emailPlaceholder: 'Enter your email',
    password: 'Password',
    passwordPlaceholder: 'Enter your password',
    login: 'Login',
    loggingIn: 'Logging in...',
    demoAccount: 'Demo Account',
    fillDemoInfo: 'Fill demo account info',
    noAccount: "Don't have an account?",
    signUp: 'Sign up now',
    demoAccountInfo: 'Demo Account',
    demoInstructions: 'Click "Fill demo account info" to auto-fill credentials, then click "Login"',
    mockMode: 'Mock Mode',
    firebaseMode: 'Firebase Mode',
    forgotPassword: 'Forgot password?'
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
