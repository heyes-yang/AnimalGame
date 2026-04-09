import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Briefcase, ArrowUpCircle, ArrowDownCircle, Plus, Minus, X } from 'lucide-react';
import DialogueBubble from './DialogueBubble';
import { getAnimalDialogue } from '../data/animalDialogue';
import { ANIMAL_LIFECYCLE_CONFIG, calculateWorkSalary } from '../data/animalTemplates';

const TradingPanel = ({
  userPlayer,
  currentPrice,
  onPlaceOrder,
  onCancelOrder,
  orders,
  onGoToWork,
  workingPlayers,
  gameTime,
  isPaused,
  priceHistory,
  monthStartPrice
}) => {
  const [quickTradeShares, setQuickTradeShares] = useState(100);
  const [userProfit, setUserProfit] = useState(0);
  const [tradeDialogue, setTradeDialogue] = useState({ text: null, isVisible: false, animalIcon: null, emotionIcon: null });
  const [workDuration, setWorkDuration] = useState(5);
  const [workSalary, setWorkSalary] = useState(0);
  const [showWorkModal, setShowWorkModal] = useState(false);
  const [customPrice, setCustomPrice] = useState(currentPrice.toFixed(3));
  const [customType, setCustomType] = useState('buy');
  const [prevMonth, setPrevMonth] = useState(null); // 跟踪上一次的月份

  const limitUpPrice = monthStartPrice * 1.2;
  const limitDownPrice = monthStartPrice * 0.8;

  const calculateUserProfit = () => {
    if (!userPlayer || typeof userPlayer.money !== 'number') return 0;
    const currentTotalValue = 
      (userPlayer.money || 0) + 
      (userPlayer.frozenMoney || 0) + 
      ((userPlayer.shares || 0) + (userPlayer.frozenShares || 0)) * currentPrice;
    const initialTotalValue = (userPlayer.initialMoney || 0) + (userPlayer.initialShares || 0) * (userPlayer.initialPrice || 1.0);
    return currentTotalValue - initialTotalValue;
  };

  const calculateInitialTotalValue = () => {
    if (!userPlayer) return 0;
    return (userPlayer.initialMoney || 0) + (userPlayer.initialShares || 0) * (userPlayer.initialPrice || 1.0);
  };

  const getEmotionState = () => {
    const profit = calculateUserProfit();
    const initialTotalValue = calculateInitialTotalValue();
    const profitRatio = initialTotalValue > 0 ? profit / initialTotalValue : 0;
    if (profitRatio > 0.2) return 'excited';
    if (profitRatio > 0.05) return 'happy';
    if (profitRatio > -0.05) return 'neutral';
    if (profitRatio > -0.2) return 'sad';
    return 'depressed';
  };

  const getEmotionEmoji = (emotion) => {
    switch (emotion) {
      case 'excited': return '🤩';
      case 'happy': return '😊';
      case 'neutral': return '😐';
      case 'sad': return '😟';
      case 'depressed': return '😭';
      default: return '😐';
    }
  };

  useEffect(() => {
    if (userPlayer && typeof userPlayer.money === 'number' && typeof userPlayer.shares === 'number') {
      setUserProfit(calculateUserProfit());
    }
  }, [userPlayer, currentPrice]);

  useEffect(() => {
    if (workDuration > 0) {
      const salary = calculateWorkSalary('cat', workDuration);
      setWorkSalary(salary);
    }
  }, [workDuration]);

  // 只在月份变化时更新默认价格，避免用户输入时被覆盖
  useEffect(() => {
    if (gameTime) {
      const currentMonth = gameTime.getMonth();
      if (prevMonth !== null && prevMonth !== currentMonth) {
        // 月份变化，更新默认价格
        setCustomPrice(currentPrice.toFixed(3));
      }
      setPrevMonth(currentMonth);
    }
  }, [gameTime, currentPrice, prevMonth]);

  const hideDialogue = () => {
    setTradeDialogue({ text: null, isVisible: false, animalIcon: null, emotionIcon: null });
  };

  if (!userPlayer || typeof userPlayer.money !== 'number' || typeof userPlayer.shares !== 'number') {
    return (
      <div className="bg-white rounded-lg shadow-md p-3 h-full flex items-center justify-center">
        <div className="text-center text-gray-500 text-sm">请先选择角色开始游戏</div>
      </div>
    );
  }

  const handleLimitUpBuy = () => {
    onPlaceOrder('buy', Number(limitUpPrice.toFixed(3)), quickTradeShares);
    const dialogue = getAnimalDialogue('user', 'excited', 'buy');
    setTradeDialogue({ text: dialogue, isVisible: true, animalIcon: userPlayer.icon, emotionIcon: '🔥' });
  };

  const handleLimitDownSell = () => {
    const shares = Math.min(quickTradeShares, userPlayer.shares);
    if (shares > 0) {
      onPlaceOrder('sell', Number(limitDownPrice.toFixed(3)), shares);
      const dialogue = getAnimalDialogue('user', 'sad', 'sell');
      setTradeDialogue({ text: dialogue, isVisible: true, animalIcon: userPlayer.icon, emotionIcon: '📉' });
    }
  };

  const handleMarketBuy = () => {
    onPlaceOrder('buy', currentPrice, quickTradeShares);
    const dialogue = getAnimalDialogue('user', 'happy', 'buy');
    setTradeDialogue({ text: dialogue, isVisible: true, animalIcon: userPlayer.icon, emotionIcon: '😊' });
  };

  const handleMarketSell = () => {
    const shares = Math.min(quickTradeShares, userPlayer.shares);
    if (shares > 0) {
      onPlaceOrder('sell', currentPrice, shares);
      const dialogue = getAnimalDialogue('user', 'sad', 'sell');
      setTradeDialogue({ text: dialogue, isVisible: true, animalIcon: userPlayer.icon, emotionIcon: '😟' });
    }
  };

  const handleCustomOrder = () => {
    const price = Number(customPrice);
    if (price > limitUpPrice || price < limitDownPrice) {
      alert(`价格超出涨跌停范围！\n涨停: ¥${limitUpPrice.toFixed(3)}\n跌停: ¥${limitDownPrice.toFixed(3)}`);
      return;
    }
    onPlaceOrder(customType, price, quickTradeShares);
    const emotion = customType === 'buy' ? 'happy' : 'sad';
    const dialogue = getAnimalDialogue('user', emotion, customType);
    setTradeDialogue({ text: dialogue, isVisible: true, animalIcon: userPlayer.icon, emotionIcon: customType === 'buy' ? '😊' : '😟' });
  };

  const userName = userPlayer.name || '玩家';
  const userOrders = {
    buy: orders.buy.filter((order) => order.player === userName),
    sell: orders.sell.filter((order) => order.player === userName)
  };
  const buyOrderCount = userOrders.buy.length;
  const sellOrderCount = userOrders.sell.length;
  const totalOrders = buyOrderCount + sellOrderCount;
  const isUserWorking = workingPlayers && workingPlayers.user;

  const handleGoToWork = () => {
    setShowWorkModal(true);
  };

  const confirmWork = () => {
    if (onGoToWork) {
      onGoToWork(workDuration, workSalary);
    }
    setShowWorkModal(false);
    setTradeDialogue({ text: `我要出去打工${workDuration}天啦！预计能赚 ¥${workSalary}~`, isVisible: true, animalIcon: userPlayer.icon, emotionIcon: '💼' });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-2 sm:p-3 h-full">
      <div className="flex gap-2 h-full">
        {/* 左侧：交易操作区 */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* 用户信息 - 精简版 */}
          <div className="bg-blue-50 rounded-lg p-2 mb-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="text-lg sm:text-xl">{userPlayer.icon || '👤'}</span>
                <div>
                  <div className="font-bold text-gray-800 text-sm">
                    {userName} {getEmotionEmoji(getEmotionState())}
                    {isUserWorking && <span className="ml-1 text-xs bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded-full">打工中</span>}
                  </div>
                  <div className="text-xs text-gray-600">
                    ¥{userPlayer.money.toFixed(0)} | {userPlayer.shares}股
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-base font-bold text-blue-600">¥{currentPrice.toFixed(3)}</div>
                <div className="flex gap-2 text-xs">
                  <span className="text-red-500">↑{limitUpPrice.toFixed(2)}</span>
                  <span className="text-green-500">↓{limitDownPrice.toFixed(2)}</span>
                </div>
              </div>
            </div>
            <div className="flex justify-between items-center mt-1 text-xs">
              <span className="text-gray-600">
                市值: ¥{((userPlayer.money || 0) + (userPlayer.frozenMoney || 0) + ((userPlayer.shares || 0) + (userPlayer.frozenShares || 0)) * currentPrice).toFixed(0)}
              </span>
              <span className={userProfit >= 0 ? 'text-red-600' : 'text-green-600'}>
                盈亏: ¥{userProfit.toFixed(0)}
              </span>
            </div>
          </div>

          {/* 股数选择 */}
          <div className="flex items-center gap-1 mb-2">
            <button onClick={() => setQuickTradeShares(Math.max(100, quickTradeShares - 100))} className="p-1.5 bg-gray-100 rounded hover:bg-gray-200">
              <Minus className="h-3 w-3" />
            </button>
            <input
              type="number"
              min="100"
              max="10000"
              step="100"
              value={quickTradeShares}
              onChange={(e) => setQuickTradeShares(Math.max(100, Math.floor(Number(e.target.value) / 100) * 100))}
              className="flex-1 p-1.5 text-center text-sm border border-gray-300 rounded"
            />
            <button onClick={() => setQuickTradeShares(Math.min(10000, quickTradeShares + 100))} className="p-1.5 bg-gray-100 rounded hover:bg-gray-200">
              <Plus className="h-3 w-3" />
            </button>
            <span className="text-xs text-gray-500 w-8">股</span>
          </div>

          {/* 快捷交易按钮 */}
          <div className="grid grid-cols-2 gap-2 mb-2">
            <div className="space-y-1">
              <button
                onClick={handleLimitUpBuy}
                disabled={(userPlayer.money || 0) < limitUpPrice * quickTradeShares || buyOrderCount >= 3 || isUserWorking || isPaused}
                className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-300 text-white py-1.5 px-2 rounded text-xs font-medium"
              >
                <ArrowUpCircle className="h-3 w-3 inline mr-1" />
                涨停买 {quickTradeShares}
              </button>
              <button
                onClick={handleMarketBuy}
                disabled={(userPlayer.money || 0) < currentPrice * quickTradeShares || buyOrderCount >= 3 || isUserWorking || isPaused}
                className="w-full bg-red-400 hover:bg-red-500 disabled:bg-gray-300 text-white py-1.5 px-2 rounded text-xs"
              >
                <TrendingUp className="h-3 w-3 inline mr-1" />
                市价买
              </button>
            </div>
            <div className="space-y-1">
              <button
                onClick={handleLimitDownSell}
                disabled={(userPlayer.shares || 0) < 100 || sellOrderCount >= 3 || isUserWorking || isPaused}
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white py-1.5 px-2 rounded text-xs font-medium"
              >
                <ArrowDownCircle className="h-3 w-3 inline mr-1" />
                跌停卖 {quickTradeShares}
              </button>
              <button
                onClick={handleMarketSell}
                disabled={(userPlayer.shares || 0) < 100 || sellOrderCount >= 3 || isUserWorking || isPaused}
                className="w-full bg-green-400 hover:bg-green-500 disabled:bg-gray-300 text-white py-1.5 px-2 rounded text-xs"
              >
                <TrendingDown className="h-3 w-3 inline mr-1" />
                市价卖
              </button>
            </div>
          </div>

          {/* 指价挂单 */}
          <div className="bg-purple-50 rounded-lg p-2 mb-2">
            <div className="flex gap-2 mb-2">
              <button
                onClick={() => setCustomType('buy')}
                className={`flex-1 py-1 rounded text-xs font-medium ${customType === 'buy' ? 'bg-red-500 text-white' : 'bg-gray-200'}`}
              >
                买入
              </button>
              <button
                onClick={() => setCustomType('sell')}
                className={`flex-1 py-1 rounded text-xs font-medium ${customType === 'sell' ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
              >
                卖出
              </button>
            </div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs text-gray-600">价格:</span>
              <input
                type="number"
                step="0.001"
                value={customPrice}
                onChange={(e) => setCustomPrice(e.target.value)}
                className="flex-1 p-1.5 text-sm border border-gray-300 rounded"
              />
            </div>
            <button
              onClick={handleCustomOrder}
              disabled={isUserWorking || isPaused}
              className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 text-white py-1.5 rounded text-xs"
            >
              指价挂单
            </button>
          </div>

          {/* 打工按钮 */}
          <button
            onClick={handleGoToWork}
            disabled={isUserWorking || isPaused}
            className="w-full bg-amber-500 hover:bg-amber-600 disabled:bg-gray-300 text-white py-1.5 rounded text-xs flex items-center justify-center gap-1"
          >
            <Briefcase className="h-3 w-3" />
            {isUserWorking ? '打工中...' : '外出打工'}
          </button>
        </div>

        {/* 右侧：我的委托固定区域 */}
        <div className="w-32 flex-shrink-0 border-l border-gray-200 pl-2">
          <div className="text-xs font-bold text-gray-700 mb-1 flex items-center justify-between">
            <span>我的委托</span>
            <span className="text-gray-400 font-normal">({totalOrders}/6)</span>
          </div>
          
          <div 
            className="space-y-1 overflow-y-auto scrollbar-hide"
            style={{ maxHeight: '240px' }}
          >
            {totalOrders > 0 ? (
              [...userOrders.buy, ...userOrders.sell].map(order => (
                <div
                  key={order.id}
                  className={`p-1.5 rounded text-xs ${
                    order.type === 'buy' 
                      ? 'bg-red-50 border border-red-200' 
                      : 'bg-green-50 border border-green-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`font-medium ${order.type === 'buy' ? 'text-red-600' : 'text-green-600'}`}>
                      {order.type === 'buy' ? '买' : '卖'}
                    </span>
                    <button
                      onClick={() => onCancelOrder(order.type, order.id)}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                  <div className="text-gray-600 mt-0.5">
                    {order.shares}股
                  </div>
                  <div className="text-gray-800 font-medium">
                    ¥{order.price.toFixed(3)}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-400 py-4 text-xs">
                <div className="text-lg mb-1">📭</div>
                暂无委托
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 隐藏滚动条样式 */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
      `}</style>

      {/* 对话气泡 */}
      <DialogueBubble 
        text={tradeDialogue.text}
        isVisible={tradeDialogue.isVisible}
        onComplete={hideDialogue}
        animalIcon={tradeDialogue.animalIcon}
        emotionIcon={tradeDialogue.emotionIcon}
      />

      {/* 打工弹窗 */}
      {showWorkModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-4 max-w-xs w-full">
            <h3 className="text-base font-bold text-gray-800 mb-3">💼 选择打工时长</h3>
            <div className="space-y-3">
              <div className="flex flex-wrap justify-center gap-1">
                {ANIMAL_LIFECYCLE_CONFIG.workConfig.durationOptions.map((days) => (
                  <button
                    key={days}
                    onClick={() => setWorkDuration(days)}
                    className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                      workDuration === days ? 'bg-amber-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {days}天
                  </button>
                ))}
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-600">打工期间无法交易</div>
                <div className="text-base font-bold text-amber-600">预计薪资: ¥{workSalary}</div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowWorkModal(false)}
                  className="flex-1 px-3 py-1.5 bg-gray-100 text-gray-700 rounded text-sm"
                >
                  取消
                </button>
                <button
                  onClick={confirmWork}
                  className="flex-1 px-3 py-1.5 bg-amber-500 text-white rounded text-sm"
                >
                  确认
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TradingPanel;
