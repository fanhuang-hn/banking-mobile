import { auth, db } from './firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

// Mock user data
export const MOCK_USER = {
  email: 'demo.user@ewallet.com',
  password: 'demo123456',
  displayName: 'Người dùng Demo',
  balance: 500000 // 500,000 VND
};

export const createMockUser = async () => {
  try {
    console.log('Creating mock user...');
    
    // Create user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      MOCK_USER.email,
      MOCK_USER.password
    );

    // Update user profile
    await updateProfile(userCredential.user, {
      displayName: MOCK_USER.displayName
    });

    // Create user document in Firestore
    await setDoc(doc(db, 'users', userCredential.user.uid), {
      uid: userCredential.user.uid,
      email: MOCK_USER.email,
      displayName: MOCK_USER.displayName,
      balance: MOCK_USER.balance,
      created_at: new Date()
    });

    // Add some mock transactions
    const mockTransactions = [
      {
        user_id: userCredential.user.uid,
        type: 'topup',
        amount: 1000000,
        description: 'Nạp tiền qua Ngân hàng',
        status: 'completed',
        payment_method: 'bank',
        created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // 7 days ago
      },
      {
        user_id: userCredential.user.uid,
        type: 'qr',
        amount: 250000,
        description: 'Thanh toán QR: Mua sắm tại Cửa hàng ABC',
        status: 'completed',
        recipient: 'Cửa hàng ABC',
        created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) // 3 days ago
      },
      {
        user_id: userCredential.user.uid,
        type: 'nfc',
        amount: 150000,
        description: 'Thanh toán NFC tại Nhà hàng XYZ',
        status: 'completed',
        recipient: 'Nhà hàng XYZ',
        created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) // 1 day ago
      },
      {
        user_id: userCredential.user.uid,
        type: 'topup',
        amount: 300000,
        description: 'Nạp tiền qua Thẻ tín dụng',
        status: 'completed',
        payment_method: 'card',
        created_at: new Date(Date.now() - 12 * 60 * 60 * 1000) // 12 hours ago
      }
    ];

    // Add transactions to Firestore
    for (const transaction of mockTransactions) {
      await setDoc(doc(db, 'transactions', `mock_${Date.now()}_${Math.random()}`), transaction);
    }

    console.log('Mock user created successfully!');
    console.log('Email:', MOCK_USER.email);
    console.log('Password:', MOCK_USER.password);
    
    return userCredential.user;
  } catch (error: any) {
    if (error.code === 'auth/email-already-in-use') {
      console.log('Mock user already exists');
      return null;
    }
    console.error('Error creating mock user:', error);
    throw error;
  }
};
