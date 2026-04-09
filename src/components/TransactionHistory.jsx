import React, { useState } from 'react';
import { TrendingUp, TrendingDown, GitMerge, MessageCircle, History } from 'lucide-react';
import ChatRoom from './ChatRoom';

const TransactionHistory = ({ transactions, chatMessages = [] }) => {
  const [activeTab, setActiveTab] = useState('chat'); // 默认显示聊天室

  const getTransactionIcon = (type) => {
    switch (type) {
      case '撮合成交': return <GitMerge className="h-3 w-3 text-blue-500" />;
      case '买入': return <TrendingUp className="h-3 w-3 text-red-500" />;
      case '卖出': return <TrendingDown className="h-3 w-3 text-green-500" />;
      default: return null;
    }
  };

  const getTransactionColor = (type) => {
    switch (type) {
      case '撮合成交': return 'bg-blue-50 border-blue-200';
      case '买入': return 'bg-red-50 border-red-200';
      case '卖出': return 'bg-green-50 border-green-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  const recentTransactions = transactions.slice(-10).reverse();

  return (
    <div className="bg-white rounded-lg shadow-md p-2 sm:p-3">
      {/* 切换按钮 */}
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-sm font-bold text-gray-800">
          {activeTab === 'transactions' ? '交易记录' : '聊天室'}
        </h2>
        <div className="flex bg-gray-100 rounded p-0.5">
          <button
            onClick={() => setActiveTab('chat')}
            className={`flex items-center gap-1 px-2 py-1 rounded text-xs transition-colors ${
              activeTab === 'chat'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <MessageCircle className="h-3 w-3" />
            <span>聊天</span>
          </button>
          <button
            onClick={() => setActiveTab('transactions')}
            className={`flex items-center gap-1 px-2 py-1 rounded text-xs transition-colors ${
              activeTab === 'transactions'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <History className="h-3 w-3" />
            <span>记录</span>
          </button>
        </div>
      </div>

      {/* 内容区域 */}
      {activeTab === 'transactions' ? (
        recentTransactions.length > 0 ? (
          <div 
            className="overflow-y-auto space-y-1 scrollbar-hide"
            style={{ maxHeight: '320px' }}
          >
            {recentTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className={`p-2 rounded border ${getTransactionColor(transaction.type)}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {getTransactionIcon(transaction.type)}
                    <div>
                      <div className="font-medium text-gray-800 text-xs">
                        {transaction.player || '玩家'}
                      </div>
                      <div className="text-xs text-gray-600">
                        {transaction.action} {transaction.shares}股 @ ¥{transaction.price}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-medium text-gray-800">
                      ¥{(transaction.price * transaction.shares).toFixed(0)}
                    </div>
                    <div className="text-xs text-gray-500">
                      {transaction.time}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 py-4 text-xs">
            暂无交易记录
          </div>
        )
      ) : (
        <ChatRoom chatMessages={chatMessages} />
      )}

      {/* 隐藏滚动条的样式 */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
      `}</style>
    </div>
  );
};

export default TransactionHistory;
