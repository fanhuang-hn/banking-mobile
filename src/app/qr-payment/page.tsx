'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { doc, getDoc, updateDoc, increment, addDoc, collection } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { ArrowLeft, QrCode, Camera, CameraOff, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import QRCode from 'react-qr-code';
import { Html5QrcodeScanner } from 'html5-qrcode';

export default function QRPaymentPage() {
  const { user } = useAuth();
  const [mode, setMode] = useState<'generate' | 'scan'>('generate');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [merchant, setMerchant] = useState('');
  const [loading, setLoading] = useState(false);
  const [userBalance, setUserBalance] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [qrData, setQrData] = useState('');
  const [scanner, setScanner] = useState<Html5QrcodeScanner | null>(null);
  const [scanResult, setScanResult] = useState('');
  const router = useRouter();

  useEffect(() => {
    // Get user balance
    if (user) {
      getUserBalance();
    }
  }, [user]);

  useEffect(() => {
    // Initialize QR scanner when in scan mode
    if (mode === 'scan' && !scanner) {
      initializeScanner();
    }

    // Cleanup scanner when switching modes
    return () => {
      if (scanner) {
        scanner.clear();
      }
    };
  }, [mode]);

  const getUserBalance = async () => {
    if (!user) return;
    
    try {
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        setUserBalance(userDoc.data().balance || 0);
      }
    } catch (error) {
      console.error('Error fetching user balance:', error);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  const generateQRCode = () => {
    if (!amount || !description.trim()) {
      setError('Vui lòng nhập đầy đủ thông tin');
      return;
    }

    const paymentAmount = parseInt(amount);
    if (isNaN(paymentAmount) || paymentAmount <= 0) {
      setError('Số tiền không hợp lệ');
      return;
    }

    const transactionId = `qr_${Date.now()}`;
    const qrPayload = {
      type: 'payment_request',
      amount: paymentAmount,
      description: description,
      merchant: user?.displayName || user?.email || 'Unknown',
      recipient_id: user?.uid,
      transaction_id: transactionId,
      created_at: new Date().toISOString()
    };

    setQrData(JSON.stringify(qrPayload));
    setError('');
  };

  const initializeScanner = () => {
    const html5QrcodeScanner = new Html5QrcodeScanner(
      'qr-reader',
      { 
        fps: 10, 
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0
      },
      false
    );

    html5QrcodeScanner.render(
      (decodedText) => {
        setScanResult(decodedText);
        html5QrcodeScanner.clear();
        processScannedQR(decodedText);
      },
      (error) => {
        console.log('QR scan error:', error);
      }
    );

    setScanner(html5QrcodeScanner);
  };

  const processScannedQR = async (qrText: string) => {
    try {
      const qrData = JSON.parse(qrText);
      
      if (qrData.type !== 'payment_request') {
        setError('QR code không hợp lệ');
        return;
      }

      // Confirm payment
      const confirmed = window.confirm(
        `Bạn có muốn thanh toán ${formatCurrency(qrData.amount)} cho ${qrData.merchant}?\n\nMô tả: ${qrData.description}`
      );

      if (!confirmed) return;

      if (qrData.amount > userBalance) {
        setError('Số dư không đủ để thực hiện giao dịch');
        return;
      }

      setLoading(true);

      // Process payment
      await processPayment(qrData);

    } catch (error) {
      setError('QR code không hợp lệ hoặc có lỗi xảy ra');
      console.error('QR processing error:', error);
    }
  };

  const processPayment = async (qrData: any) => {
    if (!user) return;

    try {
      // Update user balance
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        balance: increment(-qrData.amount)
      });

      // Add transaction record
      await addDoc(collection(db, 'transactions'), {
        user_id: user.uid,
        type: 'qr',
        amount: qrData.amount,
        description: `Thanh toán QR: ${qrData.description}`,
        status: 'completed',
        recipient: qrData.merchant,
        transaction_id: qrData.transaction_id,
        created_at: new Date()
      });

      setSuccess(true);
      setUserBalance(prev => prev - qrData.amount);

      // Redirect after success
      setTimeout(() => {
        router.push('/dashboard');
      }, 3000);

    } catch (error) {
      setError('Có lỗi xảy ra khi xử lý thanh toán');
      console.error('Payment error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-xl p-6 text-center shadow-lg">
          <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Thanh toán thành công!</h2>
          <p className="text-gray-600 mb-4">
            Giao dịch QR đã được xử lý thành công
          </p>
          <p className="text-sm text-gray-500">Đang chuyển về trang chính...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center">
          <Link href="/dashboard" className="p-2 -ml-2 text-gray-600 hover:text-gray-900">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="ml-2 text-lg font-semibold text-gray-900">Thanh toán QR</h1>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Mode Selector */}
        <div className="bg-white rounded-xl p-1 shadow-sm flex">
          <button
            onClick={() => setMode('generate')}
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
              mode === 'generate'
                ? 'bg-yellow-500 text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <QrCode className="h-4 w-4 inline mr-2" />
            Tạo QR
          </button>
          <button
            onClick={() => setMode('scan')}
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
              mode === 'scan'
                ? 'bg-yellow-500 text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Camera className="h-4 w-4 inline mr-2" />
            Quét QR
          </button>
        </div>

        {/* Balance Display */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Số dư hiện tại:</span>
            <span className="text-lg font-semibold text-yellow-600">
              {formatCurrency(userBalance)}
            </span>
          </div>
        </div>

        {/* Generate QR Mode */}
        {mode === 'generate' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Tạo mã QR nhận tiền</h3>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
                    Số tiền yêu cầu
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      id="amount"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="Nhập số tiền"
                      className="block w-full px-3 py-2 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
                      min="1000"
                      step="1000"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">VNĐ</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Mô tả giao dịch
                  </label>
                  <input
                    type="text"
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Ví dụ: Thanh toán hóa đơn, Mua hàng..."
                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
                  />
                </div>

                <button
                  onClick={generateQRCode}
                  disabled={!amount || !description.trim()}
                  className="w-full bg-yellow-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Tạo mã QR
                </button>
              </div>
            </div>

            {/* Generated QR Code */}
            {qrData && (
              <div className="bg-white rounded-xl p-6 shadow-sm text-center">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Mã QR của bạn</h3>
                <div className="bg-white p-4 rounded-lg border-2 border-gray-200 inline-block">
                  <QRCode
                    size={200}
                    style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                    value={qrData}
                    viewBox={`0 0 256 256`}
                  />
                </div>
                <p className="text-sm text-gray-600 mt-4">
                  Cho người thanh toán quét mã này để chuyển {formatCurrency(parseInt(amount))}
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  Mô tả: {description}
                </p>
                <button
                  onClick={() => {
                    setQrData('');
                    setAmount('');
                    setDescription('');
                  }}
                  className="mt-4 text-yellow-600 hover:text-yellow-700 text-sm font-medium"
                >
                  <RefreshCw className="h-4 w-4 inline mr-1" />
                  Tạo mã mới
                </button>
              </div>
            )}
          </div>
        )}

        {/* Scan QR Mode */}
        {mode === 'scan' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Quét mã QR để thanh toán</h3>
              
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Đang xử lý thanh toán...</p>
                </div>
              ) : (
                <div>
                  <div id="qr-reader" className="w-full"></div>
                  {scanResult && (
                    <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">Kết quả quét:</p>
                      <p className="text-xs text-gray-500 break-all">{scanResult}</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Instructions */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="text-sm font-medium text-blue-900 mb-2">Hướng dẫn quét QR</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Đưa camera điện thoại hướng về mã QR</li>
                <li>• Đảm bảo mã QR nằm trong khung quét</li>
                <li>• Giữ thiết bị ổn định cho đến khi quét thành công</li>
                <li>• Xác nhận thông tin trước khi thanh toán</li>
              </ul>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
}
