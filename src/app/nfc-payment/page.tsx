'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Smartphone, Wifi, WifiOff, AlertTriangle, CheckCircle, Zap, Waves } from 'lucide-react';
import Link from 'next/link';

declare global {
  interface Navigator {
    nfc?: any;
  }
}

export default function NFCPaymentPage() {
  const { user, userData } = useAuth();
  const [amount, setAmount] = useState('');
  const [merchant, setMerchant] = useState('');
  const [loading, setLoading] = useState(false);
  const [nfcSupported, setNfcSupported] = useState(false);
  const [nfcEnabled, setNfcEnabled] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [tapAnimation, setTapAnimation] = useState(false);
  const [rippleAnimation, setRippleAnimation] = useState(false);
  const [pulseAnimation, setPulseAnimation] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    // Check NFC support - simulate for demo
    setNfcSupported(true);
    setNfcEnabled(true);
  }, [user, router]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  const handleNFCPayment = async () => {
    if (!user || !userData) return;

    const paymentAmount = parseInt(amount);
    if (isNaN(paymentAmount) || paymentAmount <= 0) {
      setError('Vui lòng nhập số tiền hợp lệ');
      return;
    }

    if (paymentAmount > userData.balance) {
      setError('Số dư không đủ để thực hiện giao dịch');
      return;
    }

    if (!merchant.trim()) {
      setError('Vui lòng nhập tên merchant');
      return;
    }

    setLoading(true);
    setScanning(true);
    setError('');

    try {
      // Start animations
      setTapAnimation(true);
      setPulseAnimation(true);
      
      // Simulate scanning delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setScanning(false);
      setProcessing(true);
      setRippleAnimation(true);

      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Simulate successful payment
      setProcessing(false);
      setSuccess(true);
      setTapAnimation(false);
      setPulseAnimation(false);
      setRippleAnimation(false);

      // Reset form after success
      setTimeout(() => {
        setAmount('');
        setMerchant('');
        setSuccess(false);
      }, 3000);

    } catch (error: any) {
      setError(error.message || 'Có lỗi xảy ra khi xử lý thanh toán');
      setScanning(false);
      setProcessing(false);
      setTapAnimation(false);
      setPulseAnimation(false);
      setRippleAnimation(false);
    } finally {
      setLoading(false);
    }
  };

  const triggerTapAnimation = () => {
    setTapAnimation(true);
    setTimeout(() => setTapAnimation(false), 600);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
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
          <h1 className="ml-2 text-lg font-semibold text-gray-900">Thanh toán NFC</h1>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Balance Card */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-purple-100 text-sm mb-1">Số dư hiện tại</p>
              <p className="text-2xl font-bold">{formatCurrency(userData?.balance || 0)}</p>
            </div>
            <div className="h-12 w-12 bg-white/20 rounded-full flex items-center justify-center">
              <Smartphone className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        {/* NFC Status */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center space-x-3">
            {nfcSupported && nfcEnabled ? (
              <>
                <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center">
                  <Wifi className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">NFC đã kích hoạt</p>
                  <p className="text-sm text-gray-500">Sẵn sàng để thanh toán</p>
                </div>
              </>
            ) : (
              <>
                <div className="h-10 w-10 bg-red-100 rounded-full flex items-center justify-center">
                  <WifiOff className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">NFC chưa khả dụng</p>
                  <p className="text-sm text-gray-500">Vui lòng bật NFC trong cài đặt</p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Payment Form */}
        <div className="bg-white rounded-xl p-6 shadow-sm space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Thông tin thanh toán</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tên merchant
            </label>
            <input
              type="text"
              value={merchant}
              onChange={(e) => setMerchant(e.target.value)}
              placeholder="Nhập tên cửa hàng"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Số tiền thanh toán
            </label>
            <div className="relative">
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                disabled={loading}
                max={userData?.balance || 0}
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <span className="text-gray-500 text-sm">VND</span>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Tối đa: {formatCurrency(userData?.balance || 0)}
            </p>
          </div>

          {amount && (
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Số dư sau giao dịch:</span>
                <span className="font-medium">{formatCurrency((userData?.balance || 0) - parseInt(amount))}</span>
              </div>
            </div>
          )}
        </div>

        {/* NFC Animation Area */}
        <div className="bg-white rounded-xl p-8 shadow-sm">
          <div className="text-center">
            {success ? (
              <div className="space-y-4">
                <div className="h-20 w-20 bg-green-100 rounded-full flex items-center justify-center mx-auto animate-bounce">
                  <CheckCircle className="h-10 w-10 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-green-600">Thanh toán thành công!</h3>
                  <p className="text-sm text-gray-600">Giao dịch đã được xử lý</p>
                </div>
              </div>
            ) : scanning ? (
              <div className="space-y-4">
                <div className="relative">
                  <div className={`h-20 w-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto ${pulseAnimation ? 'animate-pulse' : ''}`}>
                    <Smartphone className="h-10 w-10 text-blue-600" />
                  </div>
                  {rippleAnimation && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="h-20 w-20 bg-blue-400 rounded-full animate-ping opacity-20"></div>
                      <div className="absolute h-32 w-32 bg-blue-300 rounded-full animate-ping opacity-10"></div>
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-blue-600">Đang quét NFC...</h3>
                  <p className="text-sm text-gray-600">Vui lòng đưa thiết bị gần terminal</p>
                </div>
              </div>
            ) : processing ? (
              <div className="space-y-4">
                <div className="h-20 w-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto">
                  <Zap className="h-10 w-10 text-yellow-600 animate-bounce" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-yellow-600">Đang xử lý...</h3>
                  <p className="text-sm text-gray-600">Vui lòng đợi</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div 
                  className={`relative h-24 w-24 mx-auto cursor-pointer transition-transform ${tapAnimation ? 'scale-110' : 'hover:scale-105'}`}
                  onClick={triggerTapAnimation}
                >
                  <div className="h-24 w-24 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
                    <Smartphone className="h-12 w-12 text-white" />
                  </div>
                  
                  {/* Ripple Effect */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-24 w-24 bg-purple-400 rounded-full animate-ping opacity-20"></div>
                  </div>
                  
                  {/* NFC Waves */}
                  <div className="absolute -top-2 -right-2">
                    <div className="flex space-x-1">
                      <Waves className="h-4 w-4 text-purple-400 animate-pulse" />
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Chạm để thanh toán</h3>
                  <p className="text-sm text-gray-600">Đưa thiết bị gần terminal NFC</p>
                </div>
                
                {/* Tap Guide Animation */}
                <div className="flex justify-center space-x-2 mt-4">
                  <div className="h-2 w-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                  <div className="h-2 w-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                  <div className="h-2 w-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <p className="text-red-700 font-medium">{error}</p>
            </div>
          </div>
        )}

        {/* Payment Button */}
        <button
          onClick={handleNFCPayment}
          disabled={
            loading ||
            !amount ||
            !merchant ||
            parseInt(amount) <= 0 ||
            parseInt(amount) > (userData?.balance || 0) ||
            !nfcEnabled
          }
          className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-4 px-6 rounded-xl font-semibold shadow-lg hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-4 focus:ring-purple-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        >
          {loading ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span>Đang xử lý...</span>
            </div>
          ) : (
            <>
              <Smartphone className="inline-block h-5 w-5 mr-2" />
              Thanh toán NFC
            </>
          )}
        </button>

        {/* Instructions */}
        <div className="bg-blue-50 rounded-xl p-4">
          <h4 className="font-semibold text-blue-900 mb-2">Hướng dẫn sử dụng:</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Đảm bảo NFC đã được bật trên thiết bị</li>
            <li>• Nhập thông tin thanh toán chính xác</li>
            <li>• Đưa thiết bị gần terminal NFC khi có yêu cầu</li>
            <li>• Giữ thiết bị ổn định trong quá trình quét</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
