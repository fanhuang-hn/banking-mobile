// Mock authentication system - không cần Firebase thật
const MOCK_USERS = [
  {
    uid: 'demo-user-123',
    email: 'demo.user@ewallet.com',
    password: 'demo123456',
    displayName: 'Người dùng Demo',
    balance: 500000
  },
  {
    uid: 'admin-user-456',
    email: 'admin@ewallet.com',
    password: 'admin123456',
    displayName: 'Admin User',
    balance: 1000000
  }
];

const MOCK_TRANSACTIONS = [
  {
    id: 'mock-tx-1',
    user_id: 'demo-user-123',
    type: 'topup',
    amount: 1000000,
    description: 'Nạp tiền qua Ngân hàng',
    status: 'completed',
    payment_method: 'bank',
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  },
  {
    id: 'mock-tx-2',
    user_id: 'demo-user-123',
    type: 'qr',
    amount: 250000,
    description: 'Thanh toán QR: Mua sắm tại Cửa hàng ABC',
    status: 'completed',
    recipient: 'Cửa hàng ABC',
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
  },
  {
    id: 'mock-tx-3',
    user_id: 'demo-user-123',
    type: 'nfc',
    amount: 150000,
    description: 'Thanh toán NFC tại Nhà hàng XYZ',
    status: 'completed',
    recipient: 'Nhà hàng XYZ',
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
  },
  {
    id: 'mock-tx-4',
    user_id: 'demo-user-123',
    type: 'topup',
    amount: 300000,
    description: 'Nạp tiền qua Thẻ tín dụng',
    status: 'completed',
    payment_method: 'card',
    created_at: new Date(Date.now() - 12 * 60 * 60 * 1000)
  }
];

// Mock auth state
let mockCurrentUser: any = null;
let mockUserData: any = null;
let mockTransactions: any[] = [];

// Mock auth functions
export const mockSignIn = async (email: string, password: string) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const user = MOCK_USERS.find(u => u.email === email && u.password === password);
  
  if (!user) {
    throw new Error('Email hoặc mật khẩu không đúng');
  }
  
  mockCurrentUser = {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName
  };
  
  mockUserData = {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    balance: user.balance,
    created_at: new Date()
  };
  
  mockTransactions = MOCK_TRANSACTIONS.filter(t => t.user_id === user.uid);
  
  // Store in localStorage for persistence
  localStorage.setItem('mockUser', JSON.stringify(mockCurrentUser));
  localStorage.setItem('mockUserData', JSON.stringify(mockUserData));
  localStorage.setItem('mockTransactions', JSON.stringify(mockTransactions));
  
  return mockCurrentUser;
};

export const mockSignOut = async () => {
  mockCurrentUser = null;
  mockUserData = null;
  mockTransactions = [];
  localStorage.removeItem('mockUser');
  localStorage.removeItem('mockUserData');
  localStorage.removeItem('mockTransactions');
};

export const mockCreateUser = async (email: string, password: string, displayName: string) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  const existingUser = MOCK_USERS.find(u => u.email === email);
  if (existingUser) {
    throw new Error('Email đã được sử dụng');
  }
  
  const newUser = {
    uid: `user-${Date.now()}`,
    email,
    password,
    displayName,
    balance: 0
  };
  
  MOCK_USERS.push(newUser);
  
  mockCurrentUser = {
    uid: newUser.uid,
    email: newUser.email,
    displayName: newUser.displayName
  };
  
  mockUserData = {
    uid: newUser.uid,
    email: newUser.email,
    displayName: newUser.displayName,
    balance: newUser.balance,
    created_at: new Date()
  };
  
  mockTransactions = [];
  
  // Store in localStorage
  localStorage.setItem('mockUser', JSON.stringify(mockCurrentUser));
  localStorage.setItem('mockUserData', JSON.stringify(mockUserData));
  localStorage.setItem('mockTransactions', JSON.stringify(mockTransactions));
  
  return mockCurrentUser;
};

export const mockGetCurrentUser = () => {
  if (mockCurrentUser) return mockCurrentUser;
  
  // Try to restore from localStorage
  const stored = localStorage.getItem('mockUser');
  if (stored) {
    mockCurrentUser = JSON.parse(stored);
    const storedData = localStorage.getItem('mockUserData');
    const storedTransactions = localStorage.getItem('mockTransactions');
    
    if (storedData) mockUserData = JSON.parse(storedData);
    if (storedTransactions) mockTransactions = JSON.parse(storedTransactions);
    
    return mockCurrentUser;
  }
  
  return null;
};

export const mockGetUserData = () => {
  return mockUserData;
};

export const mockGetTransactions = () => {
  return mockTransactions.map(t => ({
    ...t,
    created_at: new Date(t.created_at)
  }));
};

export const mockUpdateBalance = (amount: number) => {
  if (mockUserData) {
    mockUserData.balance += amount;
    localStorage.setItem('mockUserData', JSON.stringify(mockUserData));
  }
};

export const mockAddTransaction = (transaction: any) => {
  const newTransaction = {
    ...transaction,
    id: `mock-tx-${Date.now()}`,
    user_id: mockCurrentUser?.uid,
    created_at: new Date()
  };
  
  mockTransactions.unshift(newTransaction);
  localStorage.setItem('mockTransactions', JSON.stringify(mockTransactions));
  
  return newTransaction;
};

// Mock auth state change listeners
const authListeners: ((user: any) => void)[] = [];

export const mockOnAuthStateChanged = (callback: (user: any) => void) => {
  authListeners.push(callback);
  
  // Immediately call with current user
  callback(mockGetCurrentUser());
  
  // Return unsubscribe function
  return () => {
    const index = authListeners.indexOf(callback);
    if (index > -1) {
      authListeners.splice(index, 1);
    }
  };
};

// Notify all listeners when auth state changes
const notifyAuthListeners = (user: any) => {
  authListeners.forEach(callback => callback(user));
};

// Override the original functions to notify listeners
const originalSignIn = mockSignIn;
const originalSignOut = mockSignOut;
const originalCreateUser = mockCreateUser;

export const mockSignInWithNotification = async (email: string, password: string) => {
  const result = await originalSignIn(email, password);
  notifyAuthListeners(result);
  return result;
};

export const mockSignOutWithNotification = async () => {
  await originalSignOut();
  notifyAuthListeners(null);
};

export const mockCreateUserWithNotification = async (email: string, password: string, displayName: string) => {
  const result = await originalCreateUser(email, password, displayName);
  notifyAuthListeners(result);
  return result;
};
