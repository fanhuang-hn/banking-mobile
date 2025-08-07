'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { doc, updateDoc, increment, addDoc, collection } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { ArrowLeft, CreditCard, Smartphone, Building2 } from 'lucide-react';
import Link from 'next/link';

export default function TopupPage() {
  const { user } = useAuth();
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('bank');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const predefinedAmounts = [50000, 100000, 200000, 500000, 1000000, 2000000];

  const handleAmountSelect = (selectedAmount: number) => {
    setAmount(selectedAmount.toString());
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  const handleTopup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const topupAmount = parseInt(amount);
    if (isNaN(topupAmount) || topupAmount <= 0) {
      setError('Vui lòng nhập số tiền hợp lệ');
      return;
    }

    if (topupAmount < 10000) {
      setError('Số tiền nạp tối thiểu là 10,000 VNĐ');
      return;
    }

    if (topupAmount > 10000000) {
      setError('Số tiền nạp tối đa là 10,000,000 VNĐ');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Simulate payment processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Update user balance
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        balance: increment(topupAmount)
      });

      // Add transaction record
      await addDoc(collection(db, 'transactions'), {
        user_id: user.uid,
        type: 'topup',
        amount: topupAmount,
        description: `Nạp tiền qua ${paymentMethod === 'bank' ? 'Ngân hàng' : paymentMethod === 'card' ? 'Thẻ tín dụng' : 'Ví điện tử'}`,
        status: 'completed',
        payment_method: paymentMethod,
        created_at: new Date()
      });

      setSuccess(true);
      setAmount('');
      
      // Redirect to dashboard after success
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);

    } catch (error: any) {
      setError('Có lỗi xảy ra khi nạp tiền. Vui lòng thử lại.');
      console.error('Topup error:', error);
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
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Nạp tiền thành công!</h2>
          <p className="text-gray-600 mb-4">
            Đã nạp {formatCurrency(parseInt(amount || '0'))} vào ví của bạn
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
          <h1 className="ml-2 text-lg font-semibold text-gray-900">Nạp tiền vào ví</h1>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6">
        <form onSubmit={handleTopup} className="space-y-6">
          {/* Predefined Amounts */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Chọn số tiền nạp
            </label>
            <div className="grid grid-cols-2 gap-3">
              {predefinedAmounts.map((predefinedAmount) => (
                <button
                  key={predefinedAmount}
                  type="button"
                  onClick={() => handleAmountSelect(predefinedAmount)}
                  className={`p-3 border rounded-lg text-sm font-medium transition-colors ${
                    amount === predefinedAmount.toString()
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-300 bg-white text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  {formatCurrency(predefinedAmount)}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Amount */}
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
              Hoặc nhập số tiền khác
            </label>
            <div className="relative">
              <input
                type="number"
                id="amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Nhập số tiền (VNĐ)"
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                min="10000"
                max="10000000"
                step="1000"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">VNĐ</span>
              </div>
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Số tiền từ 10,000 - 10,000,000 VNĐ
            </p>
          </div>

          {/* Payment Method */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Phương thức thanh toán
            </label>
            <div className="space-y-3">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="bank"
                  checked={paymentMethod === 'bank'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="sr-only"
                />
                <div className={`flex items-center w-full p-3 border rounded-lg cursor-pointer transition-colors ${
                  paymentMethod === 'bank'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-300 bg-white hover:bg-gray-50'
                }`}>
                  <Building2 className="h-5 w-5 text-gray-600 mr-3" />
                  <span className="text-sm font-medium text-gray-900">Chuyển khoản ngân hàng</span>
                </div>
              </label>

              <label className="flex items-center">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="card"
                  checked={paymentMethod === 'card'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="sr-only"
                />
                <div className={`flex items-center w-full p-3 border rounded-lg cursor-pointer transition-colors ${
                  paymentMethod === 'card'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-300 bg-white hover:bg-gray-50'
                }`}>
                  <CreditCard className="h-5 w-5 text-gray-600 mr-3" />
                  <span className="text-sm font-medium text-gray-900">Thẻ tín dụng/ghi nợ</span>
                </div>
              </label>

              <label className="flex items-center">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="ewallet"
                  checked={paymentMethod === 'ewallet'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="sr-only"
                />
                <div className={`flex items-center w-full p-3 border rounded-lg cursor-pointer transition-colors ${
                  paymentMethod === 'ewallet'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-300 bg-white hover:bg-gray-50'
                }`}>
                  <Smartphone className="h-5 w-5 text-gray-600 mr-3" />
                  <span className="text-sm font-medium text-gray-900">Ví điện tử khác</span>
                </div>
              </label>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {/* Summary */}
          {amount && !isNaN(parseInt(amount)) && parseInt(amount) > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="text-sm font-medium text-blue-900 mb-2">Thông tin giao dịch</h3>
              <div className="space-y-1 text-sm text-blue-800">
                <div className="flex justify-between">
                  <span>Số tiền nạp:</span>
                  <span className="font-medium">{formatCurrency(parseInt(amount))}</span>
                </div>
                <div className="flex justify-between">
                  <span>Phí giao dịch:</span>
                  <span className="font-medium">0 VNĐ</span>
                </div>
                <div className="border-t border-blue-200 pt-1 flex justify-between font-medium">
                  <span>Tổng cộng:</span>
                  <span>{formatCurrency(parseInt(amount))}</span>
                </div>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !amount || isNaN(parseInt(amount)) || parseInt(amount) <= 0}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Đang xử lý...' : 'Xác nhận nạp tiền'}
          </button>
        </form>
      </div>
    </div>
  );
}
