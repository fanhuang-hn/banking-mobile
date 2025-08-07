'use client';

import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Wallet, Smartphone, QrCode, CreditCard } from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (user) {
    return null; // Will redirect to dashboard
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <div className="max-w-md mx-auto px-4 pt-16 pb-8">
        <div className="text-center mb-12">
          <div className="mx-auto h-20 w-20 bg-blue-500 rounded-full flex items-center justify-center mb-6">
            <Wallet className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Ví điện tử thông minh
          </h1>
          <p className="text-gray-600 text-lg">
            Thanh toán nhanh chóng, an toàn với công nghệ NFC và QR Code
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-2 gap-4 mb-12">
          <div className="bg-white rounded-xl p-6 shadow-sm text-center">
            <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <CreditCard className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Nạp tiền dễ dàng</h3>
            <p className="text-sm text-gray-600">Nạp tiền nhanh chóng từ nhiều nguồn</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm text-center">
            <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Smartphone className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Thanh toán NFC</h3>
            <p className="text-sm text-gray-600">Chạm một lần để thanh toán</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm text-center">
            <div className="h-12 w-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <QrCode className="h-6 w-6 text-yellow-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">QR Code</h3>
            <p className="text-sm text-gray-600">Quét mã để thanh toán instant</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm text-center">
            <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Wallet className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Bảo mật cao</h3>
            <p className="text-sm text-gray-600">Mã hóa và xác thực an toàn</p>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="space-y-4">
          <Link
            href="/register"
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center"
          >
            Tạo tài khoản mới
          </Link>
          
          <Link
            href="/login"
            className="w-full bg-white text-blue-600 py-3 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors border border-blue-600 flex items-center justify-center"
          >
            Đã có tài khoản? Đăng nhập
          </Link>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-sm text-gray-500">
          <p>Demo ứng dụng ví điện tử</p>
          <p className="mt-1">Hỗ trợ NFC trên Chrome Android</p>
        </div>
      </div>
    </div>
  );
}
