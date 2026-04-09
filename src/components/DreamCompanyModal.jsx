import React from 'react';

const DreamCompanyModal = ({ 
  isOpen, 
  onClose, 
  dreamCompany, 
  currentPrice,
  DREAM_COMPANY 
}) => {
  if (!isOpen) return null;

  // 计算相关数据
  const totalMarketCap = (dreamCompany?.shares || 0) * currentPrice;
  const playerShares = 1000000 - (dreamCompany?.shares || 0); // 玩家持有的股份
  const holdingRatio = ((dreamCompany?.shares || 0) / 1000000 * 100).toFixed(2);
  const profitRate = dreamCompany?.yearlyProfit ? 
    ((dreamCompany.yearlyProfit / (dreamCompany.yearlyBuyAmount || 1)) * 100).toFixed(2) : 0;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        {/* 标题栏 */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-4 text-white rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🏛️</span>
              <span className="font-bold text-lg">森林梦想公司</span>
            </div>
            <button 
              onClick={onClose} 
              className="text-white/80 hover:text-white text-2xl"
            >
              ×
            </button>
          </div>
          <div className="text-sm text-white/80 mt-1">
            Forest Dream Company
          </div>
        </div>
        
        {/* 内容区 */}
        <div className="p-4 space-y-3">
          {/* 公司简介 */}
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-3 border border-indigo-200">
            <div className="text-center">
              <div className="text-3xl mb-2">🏛️</div>
              <h3 className="font-bold text-indigo-700">森林梦想公司</h3>
              <p className="text-xs text-gray-600 mt-1">
                森林股市的发股主体，每年年度大会进行股份交易
              </p>
            </div>
          </div>
          
          {/* 核心数据 */}
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-blue-50 rounded-lg p-3 border border-blue-200 text-center">
              <div className="text-xs text-blue-600 mb-1">公司持股</div>
              <div className="text-lg font-bold text-blue-700">
                {(dreamCompany?.shares || 0).toLocaleString()}
              </div>
              <div className="text-xs text-gray-500">
                占比 {holdingRatio}%
              </div>
            </div>
            <div className="bg-purple-50 rounded-lg p-3 border border-purple-200 text-center">
              <div className="text-xs text-purple-600 mb-1">总市值</div>
              <div className="text-lg font-bold text-purple-700">
                ¥{totalMarketCap.toLocaleString()}
              </div>
              <div className="text-xs text-gray-500">
                按 ¥{currentPrice.toFixed(3)}/股计算
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-green-50 rounded-lg p-3 border border-green-200 text-center">
              <div className="text-xs text-green-600 mb-1">当前股价</div>
              <div className="text-lg font-bold text-green-700">
                ¥{currentPrice.toFixed(3)}
              </div>
              <div className="text-xs text-gray-500">
                实时报价
              </div>
            </div>
            <div className="bg-amber-50 rounded-lg p-3 border border-amber-200 text-center">
              <div className="text-xs text-amber-600 mb-1">今年利润</div>
              <div className={`text-lg font-bold ${dreamCompany?.yearlyProfit >= 0 ? 'text-red-600' : 'text-green-600'}`}>
                {dreamCompany?.yearlyProfit >= 0 ? '+' : ''}¥{(dreamCompany?.yearlyProfit || 0).toLocaleString()}
              </div>
              <div className="text-xs text-gray-500">
                年度累计
              </div>
            </div>
          </div>
          
          {/* 交易统计 */}
          <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
            <div className="text-xs text-gray-600 mb-2 font-bold">📊 年度交易统计</div>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div>
                <div className="text-sm font-bold text-gray-700">
                  {(dreamCompany?.totalTradedShares || 0).toLocaleString()}
                </div>
                <div className="text-xs text-gray-500">累计交易股数</div>
              </div>
              <div>
                <div className="text-sm font-bold text-red-600">
                  ¥{(dreamCompany?.yearlyBuyAmount || 0).toLocaleString()}
                </div>
                <div className="text-xs text-gray-500">买入金额</div>
              </div>
              <div>
                <div className="text-sm font-bold text-green-600">
                  ¥{(dreamCompany?.yearlySellAmount || 0).toLocaleString()}
                </div>
                <div className="text-xs text-gray-500">卖出金额</div>
              </div>
            </div>
          </div>
          
          {/* 股份分布 */}
          <div className="bg-indigo-50 rounded-lg p-3 border border-indigo-200">
            <div className="text-xs text-gray-600 mb-2 font-bold">📈 股份分布</div>
            <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
              <div 
                className="bg-indigo-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${holdingRatio}%` }}
              />
            </div>
            <div className="flex justify-between text-xs mt-1">
              <span className="text-indigo-600">公司 {holdingRatio}%</span>
              <span className="text-gray-500">玩家 {(100 - parseFloat(holdingRatio)).toFixed(2)}%</span>
            </div>
          </div>
          
          {/* 说明 */}
          <div className="text-xs text-gray-500 bg-gray-50 rounded-lg p-2">
            <div className="font-bold mb-1">💡 公司说明</div>
            <ul className="list-disc list-inside space-y-0.5">
              <li>公司初始持有100万股，分配后剩余股份由公司持有</li>
              <li>每年年度大会按当前股价波动±2%进行股份交易</li>
              <li>所有持股的动物和玩家都可以参与交易</li>
            </ul>
          </div>
        </div>
        
        {/* 关闭按钮 */}
        <div className="p-3 border-t border-gray-200">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition"
          >
            关闭
          </button>
        </div>
      </div>
    </div>
  );
};

export default DreamCompanyModal;
