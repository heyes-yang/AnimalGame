import React from 'react';
import { X, Wallet, TrendingUp, TrendingDown, Clock, BarChart3, DollarSign, Percent, Briefcase } from 'lucide-react';

const MyInfoModal = ({ isOpen, onClose, userPlayer, currentPrice }) => {
  if (!isOpen || !userPlayer) return null;

  // 计算当前市值
  const currentTotalValue = 
    (userPlayer.money || 0) + 
    (userPlayer.frozenMoney || 0) + 
    ((userPlayer.shares || 0) + (userPlayer.frozenShares || 0)) * currentPrice;

  // 计算初始市值
  const initialTotalValue = 
    (userPlayer.initialMoney || 0) + 
    (userPlayer.initialShares || 0) * (userPlayer.initialPrice || 1.0);

  // 计算盈亏
  const profit = currentTotalValue - initialTotalValue;
  const profitRate = initialTotalValue > 0 ? (profit / initialTotalValue * 100) : 0;

  // 持股盈亏（基于平均买入价）
  const avgBuyPrice = userPlayer.avgBuyPrice || currentPrice;
  const stockProfit = userPlayer.shares * (currentPrice - avgBuyPrice);
  const stockProfitRate = avgBuyPrice > 0 ? (stockProfit / (avgBuyPrice * userPlayer.shares) * 100) : 0;
  
  // 累计打工收入
  const totalWorkIncome = userPlayer.totalWorkIncome || 0;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-sm w-full max-h-[90vh] overflow-y-auto">
        {/* 头部 */}
        <div className="sticky top-0 bg-white border-b p-3 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{userPlayer.icon || '👤'}</span>
            <div>
              <h2 className="text-base font-bold text-gray-800">我的资产</h2>
              <p className="text-xs text-gray-500">{userPlayer.name || '玩家'}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* 内容 */}
        <div className="p-3 space-y-3">
          {/* 总市值 */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-blue-500" />
                <span className="text-sm text-gray-600">总市值</span>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold text-blue-600">¥{currentTotalValue.toFixed(0)}</div>
              </div>
            </div>
          </div>

          {/* 盈亏情况 */}
          <div className={`rounded-lg p-3 ${profit >= 0 ? 'bg-red-50' : 'bg-green-50'}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {profit >= 0 ? (
                  <TrendingUp className="h-5 w-5 text-red-500" />
                ) : (
                  <TrendingDown className="h-5 w-5 text-green-500" />
                )}
                <span className="text-sm text-gray-600">总盈亏</span>
              </div>
              <div className="text-right">
                <div className={`text-lg font-bold ${profit >= 0 ? 'text-red-600' : 'text-green-600'}`}>
                  {profit >= 0 ? '+' : ''}¥{profit.toFixed(0)}
                </div>
                <div className={`text-xs ${profit >= 0 ? 'text-red-500' : 'text-green-500'}`}>
                  {profitRate >= 0 ? '+' : ''}{profitRate.toFixed(2)}%
                </div>
              </div>
            </div>
          </div>

          {/* 现金详情 */}
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <Wallet className="h-4 w-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">现金明细</span>
            </div>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">可用现金</span>
                <span className="font-medium text-gray-800">¥{(userPlayer.money || 0).toFixed(0)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">冻结资金</span>
                <span className="font-medium text-gray-800">¥{(userPlayer.frozenMoney || 0).toFixed(0)}</span>
              </div>
            </div>
          </div>

          {/* 持股详情 */}
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="h-4 w-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">持股明细</span>
            </div>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">可用股份</span>
                <span className="font-medium text-gray-800">{userPlayer.shares || 0} 股</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">冻结股份</span>
                <span className="font-medium text-gray-800">{userPlayer.frozenShares || 0} 股</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">持仓市值</span>
                <span className="font-medium text-gray-800">¥{((userPlayer.shares || 0) * currentPrice).toFixed(0)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">持股盈亏</span>
                <span className={`font-medium ${stockProfit >= 0 ? 'text-red-600' : 'text-green-600'}`}>
                  {stockProfit >= 0 ? '+' : ''}¥{stockProfit.toFixed(0)} ({stockProfitRate >= 0 ? '+' : ''}{stockProfitRate.toFixed(1)}%)
                </span>
              </div>
            </div>
          </div>

          {/* 初始资产 */}
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-4 w-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">初始资产</span>
            </div>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">初始现金</span>
                <span className="font-medium text-gray-800">¥{(userPlayer.initialMoney || 0).toFixed(0)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">初始股份</span>
                <span className="font-medium text-gray-800">{userPlayer.initialShares || 0} 股</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">初始股价</span>
                <span className="font-medium text-gray-800">¥{(userPlayer.initialPrice || 1.0).toFixed(3)}</span>
              </div>
            </div>
          </div>

          {/* 打工收入 */}
          {totalWorkIncome > 0 && (
            <div className="bg-orange-50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <Briefcase className="h-4 w-4 text-orange-500" />
                <span className="text-sm font-medium text-gray-700">打工收入</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">累计打工收入</span>
                <span className="font-bold text-orange-600">¥{totalWorkIncome.toFixed(0)}</span>
              </div>
            </div>
          )}
        </div>

        {/* 底部 */}
        <div className="border-t p-3">
          <button
            onClick={onClose}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded text-sm font-medium"
          >
            关闭
          </button>
        </div>
      </div>
    </div>
  );
};

export default MyInfoModal;
