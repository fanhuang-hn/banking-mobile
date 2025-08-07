'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { 
  mockOnAuthStateChanged, 
  mockSignOutWithNotification,
  mockGetUserData,
  mockGetTransactions,
  mockUpdateBalance,
  mockAddTransaction
} from '@/lib/mockAuth';

interface AuthContextType {
  user: any | null;
  userData: any | null;
  transactions: any[];
  loading: boolean;
  logout: () => Promise<void>;
  updateUserBalance: (amount: number) => void;
  addTransaction: (transaction: any) => any;
  refreshData: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userData: null,
  transactions: [],
  loading: true,
  logout: async () => {},
  updateUserBalance: () => {},
  addTransaction: () => {},
  refreshData: () => {},
});

export const useAuth = () => {
  return useContext(AuthContext);
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<any | null>(null);
  const [userData, setUserData] = useState<any | null>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshData = () => {
    if (user) {
      const data = mockGetUserData();
      const txns = mockGetTransactions();
      setUserData(data);
      setTransactions(txns);
    }
  };

  useEffect(() => {
    const unsubscribe = mockOnAuthStateChanged((user) => {
      setUser(user);
      
      if (user) {
        // Load user data and transactions
        refreshData();
      } else {
        setUserData(null);
        setTransactions([]);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    // Refresh data when user changes
    if (user) {
      refreshData();
    }
  }, [user]);

  const logout = async () => {
    try {
      await mockSignOutWithNotification();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const updateUserBalance = (amount: number) => {
    mockUpdateBalance(amount);
    refreshData();
  };

  const addTransaction = (transaction: any) => {
    const newTransaction = mockAddTransaction(transaction);
    refreshData();
    return newTransaction;
  };

  const value = {
    user,
    userData,
    transactions,
    loading,
    logout,
    updateUserBalance,
    addTransaction,
    refreshData,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
