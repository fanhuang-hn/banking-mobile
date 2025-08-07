export interface User {
  uid: string;
  email: string;
  displayName?: string;
  balance: number;
  created_at: Date;
}

export interface Transaction {
  id: string;
  user_id: string;
  type: 'topup' | 'payment' | 'nfc' | 'qr';
  amount: number;
  description: string;
  status: 'pending' | 'completed' | 'failed';
  created_at: Date;
  payment_method?: string;
  recipient?: string;
}

export interface NFCData {
  amount: number;
  merchant: string;
  transaction_id: string;
}

export interface QRPayment {
  amount: number;
  merchant: string;
  description: string;
  transaction_id: string;
}
