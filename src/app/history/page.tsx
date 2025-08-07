'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  History, 
  Plus, 
  Minus, 
  Smartphone, 
  QrCode, 
  Filter,
  Calendar,
  Search
} from 'lucide-react';
import Link from 'next/link';
import { Transaction } from '@/types';

export default function HistoryPage() {
  const { user, loading } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [loadingTransactions, setLoadingTransactions] = useState(true);
  const [filter, setFilter] = useState<'all' | 'topup' | 'payment' | 'nfc' | 'qr'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'week' | 'month'>('all');
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
      return;
    }

    if (user) {
      // Mock transaction data
      const mockTransactions: Transaction[] = [
        {
          id: '1',
          type: 'topup',
          amount: 500000,
          description: 'Nạp tiền từ thẻ ngân hàng',
          recipient: 'Ví điện tử',
          status: 'completed',
          created_at: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
          user_id: user.uid || 'demo-user'
        },
        {
          id: '2',
          type: 'qr',
          amount: -75000,
          description: 'Thanh toán QR Code tại Coffee Shop',
          recipient: 'Highland Coffee',
          status: 'completed',
          created_at: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
          user_id: user.uid || 'demo-user'
        },
        {
          id: '3',
          type: 'nfc',
          amount: -25000,
          description: 'Thanh toán NFC tại cửa hàng tiện lợi',
          recipient: 'Circle K',
          status: 'completed',
          created_at: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
          user_id: user.uid || 'demo-user'
        },
        {
          id: '4',
          type: 'topup',
          amount: 1000000,
          description: 'Nạp tiền từ ATM',
          recipient: 'Ví điện tử',
          status: 'completed',
          created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
          user_id: user.uid || 'demo-user'
        },
        {
          id: '5',
          type: 'payment',
          amount: -150000,
          description: 'Chuyển tiền cho bạn bè',
          recipient: 'Nguyễn Văn A',
          status: 'completed',
          created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
          user_id: user.uid || 'demo-user'
        },
        {
          id: '6',
          type: 'qr',
          amount: -45000,
          description: 'Thanh toán QR Code tại siêu thị',
          recipient: 'Co.opmart',
          status: 'completed',
          created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
          user_id: user.uid || 'demo-user'
        }
      ];

      setTransactions(mockTransactions);
      setLoadingTransactions(false);
    }
  }, [user, loading, router]);

  useEffect(() => {
    // Apply filters
    let filtered = transactions;

    // Type filter
    if (filter !== 'all') {
      filtered = filtered.filter(transaction => transaction.type === filter);
    }

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(transaction =>
        transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.recipient?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Date filter
    if (dateFilter !== 'all') {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      filtered = filtered.filter(transaction => {
        const transactionDate = new Date(transaction.created_at);
        
        switch (dateFilter) {
          case 'today':
            return transactionDate >= today;
          case 'week':
            const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
            return transactionDate >= weekAgo;
          case 'month':
            const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
            return transactionDate >= monthAgo;
          default:
            return true;
        }
      });
    }

    setFilteredTransactions(filtered);
  }, [transactions, filter, searchTerm, dateFilter]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'topup':
        return <Plus className="h-5 w-5 text-green-600" />;
      case 'nfc':
        return <Smartphone className="h-5 w-5 text-purple-600" />;
      case 'qr':
        return <QrCode className="h-5 w-5 text-yellow-600" />;
      default:
        return <Minus className="h-5 w-5 text-red-600" />;
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'topup':
        return 'text-green-600';
      case 'nfc':
      case 'qr':
      case 'payment':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getTransactionSign = (type: string) => {
    return type === 'topup' ? '+' : '-';
  };

  if (loading || loadingTransactions) {
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
          <h1 className="ml-2 text-lg font-semibold text-gray-900">Lịch sử giao dịch</h1>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Search and Filters */}
        <div className="bg-white rounded-xl p-4 shadow-sm space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm giao dịch..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
          </div>

          {/* Filters */}
          <div className="flex space-x-2 overflow-x-auto">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                filter === 'all'
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              Tất cả
            </button>
            <button
              onClick={() => setFilter('topup')}
              className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                filter === 'topup'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              Nạp tiền
            </button>
            <button
              onClick={() => setFilter('nfc')}
              className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                filter === 'nfc'
                  ? 'bg-purple-100 text-purple-700'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              NFC
            </button>
            <button
              onClick={() => setFilter('qr')}
              className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                filter === 'qr'
                  ? 'bg-yellow-100 text-yellow-700'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              QR
            </button>
          </div>

          {/* Date Filter */}
          <div className="flex space-x-2 overflow-x-auto">
            <button
              onClick={() => setDateFilter('all')}
              className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                dateFilter === 'all'
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              Tất cả
            </button>
            <button
              onClick={() => setDateFilter('today')}
              className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                dateFilter === 'today'
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              Hôm nay
            </button>
            <button
              onClick={() => setDateFilter('week')}
              className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                dateFilter === 'week'
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              7 ngày
            </button>
            <button
              onClick={() => setDateFilter('month')}
              className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                dateFilter === 'month'
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              30 ngày
            </button>
          </div>
        </div>

        {/* Transaction List */}
        <div className="space-y-3">
          {filteredTransactions.length === 0 ? (
            <div className="bg-white rounded-xl p-8 shadow-sm text-center">
              <History className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Không có giao dịch</h3>
              <p className="text-gray-600 text-sm">
                {searchTerm || filter !== 'all' || dateFilter !== 'all'
                  ? 'Không tìm thấy giao dịch phù hợp với bộ lọc'
                  : 'Bạn chưa có giao dịch nào'
                }
              </p>
            </div>
          ) : (
            filteredTransactions.map((transaction) => (
              <div key={transaction.id} className="bg-white rounded-xl p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center">
                      {getTransactionIcon(transaction.type)}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 text-sm">
                        {transaction.description}
                      </h3>
                      <div className="flex items-center space-x-2 text-xs text-gray-500 mt-1">
                        <span>{formatDate(transaction.created_at)}</span>
                        {transaction.status && (
                          <>
                            <span>•</span>
                            <span className={`capitalize ${
                              transaction.status === 'completed' 
                                ? 'text-green-600' 
                                : transaction.status === 'failed'
                                ? 'text-red-600'
                                : 'text-yellow-600'
                            }`}>
                              {transaction.status === 'completed' ? 'Thành công' :
                               transaction.status === 'failed' ? 'Thất bại' : 'Đang xử lý'}
                            </span>
                          </>
                        )}
                      </div>
                      {transaction.recipient && (
                        <p className="text-xs text-gray-500 mt-1">
                          Đến: {transaction.recipient}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold ${getTransactionColor(transaction.type)}`}>
                      {getTransactionSign(transaction.type)}{formatCurrency(transaction.amount)}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
