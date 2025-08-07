'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { 
  Wallet, 
  Plus, 
  Minus,
  Smartphone, 
  QrCode, 
  History, 
  LogOut,
  Eye,
  EyeOff
} from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const { user, userData, loading, logout } = useAuth();
  const [showBalance, setShowBalance] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
      return;
    }
  }, [user, loading, router]);

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  if (loading) {
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
        <div className="max-w-md mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 bg-blue-500 rounded-full flex items-center justify-center">
              <Wallet className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">Ví điện tử</h1>
              <p className="text-sm text-gray-600">Xin chào, {userData?.displayName || user?.displayName || 'User'}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="p-2 text-gray-600 hover:text-gray-900"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Balance Card */}
      <div className="max-w-md mx-auto px-4 py-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium">Số dư ví</h2>
            <button
              onClick={() => setShowBalance(!showBalance)}
              className="p-1 rounded-full hover:bg-white/20"
            >
              {showBalance ? (
                <Eye className="h-5 w-5" />
              ) : (
                <EyeOff className="h-5 w-5" />
              )}
            </button>
          </div>
          <div className="mb-2">
            <p className="text-3xl font-bold">
              {showBalance ? formatCurrency(userData?.balance || 0) : '••••••••'}
            </p>
          </div>
          <div className="flex items-center justify-between text-blue-100">
            <span className="text-sm">Cập nhật lúc: {new Date().toLocaleTimeString('vi-VN')}</span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="max-w-md mx-auto px-4 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Thao tác nhanh</h3>
        <div className="grid grid-cols-2 gap-4">
          <Link
            href="/topup"
            className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow flex flex-col items-center space-y-2"
          >
            <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
              <Plus className="h-6 w-6 text-green-600" />
            </div>
            <span className="text-sm font-medium text-gray-900">Nạp tiền</span>
          </Link>

          <Link
            href="/nfc-payment"
            className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow flex flex-col items-center space-y-2"
          >
            <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center">
              <Smartphone className="h-6 w-6 text-purple-600" />
            </div>
            <span className="text-sm font-medium text-gray-900">Thanh toán NFC</span>
          </Link>

          <Link
            href="/qr-payment"
            className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow flex flex-col items-center space-y-2"
          >
            <div className="h-12 w-12 bg-yellow-100 rounded-full flex items-center justify-center">
              <QrCode className="h-6 w-6 text-yellow-600" />
            </div>
            <span className="text-sm font-medium text-gray-900">Thanh toán QR</span>
          </Link>

          <Link
            href="/history"
            className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow flex flex-col items-center space-y-2"
          >
            <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
              <History className="h-6 w-6 text-blue-600" />
            </div>
            <span className="text-sm font-medium text-gray-900">Lịch sử</span>
          </Link>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="max-w-md mx-auto px-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Giao dịch gần đây</h3>
          <Link href="/history" className="text-blue-600 text-sm font-medium">
            Xem tất cả
          </Link>
        </div>
        <div className="space-y-3">
          {/* Transaction 1 */}
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                  <Plus className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 text-sm">Nạp tiền từ thẻ ngân hàng</p>
                  <p className="text-xs text-gray-500">2 giờ trước</p>
                </div>
              </div>
              <p className="font-semibold text-green-600">+{formatCurrency(500000)}</p>
            </div>
          </div>

          {/* Transaction 2 */}
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 bg-yellow-100 rounded-full flex items-center justify-center">
                  <QrCode className="h-4 w-4 text-yellow-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 text-sm">Highland Coffee</p>
                  <p className="text-xs text-gray-500">5 giờ trước</p>
                </div>
              </div>
              <p className="font-semibold text-red-600">-{formatCurrency(75000)}</p>
            </div>
          </div>

          {/* Transaction 3 */}
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <Smartphone className="h-4 w-4 text-purple-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 text-sm">Circle K</p>
                  <p className="text-xs text-gray-500">1 ngày trước</p>
                </div>
              </div>
              <p className="font-semibold text-red-600">-{formatCurrency(25000)}</p>
            </div>
          </div>

          {/* Transaction 4 */}
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                  <Plus className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 text-sm">Nạp tiền từ ATM</p>
                  <p className="text-xs text-gray-500">2 ngày trước</p>
                </div>
              </div>
              <p className="font-semibold text-green-600">+{formatCurrency(1000000)}</p>
            </div>
          </div>

          {/* Transaction 5 */}
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 bg-gray-100 rounded-full flex items-center justify-center">
                  <Minus className="h-4 w-4 text-gray-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 text-sm">Nguyễn Văn A</p>
                  <p className="text-xs text-gray-500">3 ngày trước</p>
                </div>
              </div>
              <p className="font-semibold text-red-600">-{formatCurrency(150000)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
