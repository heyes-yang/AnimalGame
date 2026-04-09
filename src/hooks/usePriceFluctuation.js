import { useEffect, useCallback, useRef } from 'react';
import { 
  ANIMAL_STRATEGIES, 
  SEASON_ACTIVITY_MODIFIERS,
  getActivityBySeason,
  generateOrderPrice,
  generateOrderShares,
  decideTradeDirection,
  adjustForLiquidity,
  checkShouldGoToWork,
  getWorkIncome,
  getWorkMessage
} from '../data/animalStrategies';
import { 
  getAnimalChatMessage, 
  generateRandomChatMessage,
  getWeatherChatMessage,
  getAnnualMeetingChatMessage
} from '../data/chatMessages';
import { 
  ANIMAL_TEMPLATES, 
  ANIMAL_STATUS, 
  ANIMAL_LIFECYCLE_CONFIG,
  HIBERNATION_CONFIG,
  getRandomNewAnimal,
  getAnimalSalaryRange,
  calculateWorkSalary
} from '../data/animalTemplates';

const INITIAL_PRICE = 1.0;

// 天气配置
const WEATHER_TYPES = {
  sunny: { icon: '☀️', name: '晴天', color: 'text-yellow-500' },
  cloudy: { icon: '⛅', name: '多云', color: 'text-gray-400' },
  rainy: { icon: '🌧️', name: '雨天', color: 'text-blue-400' },
  snowy: { icon: '❄️', name: '雪天', color: 'text-blue-200' },
  windy: { icon: '💨', name: '大风', color: 'text-gray-500' },
  foggy: { icon: '🌫️', name: '雾天', color: 'text-gray-400' }
};

// 季节配置
const SEASONS = {
  spring: { name: '春季', icon: '🌸', months: [2, 3, 4] }, // 3-5月
  summer: { name: '夏季', icon: '🌻', months: [5, 6, 7] }, // 6-8月
  autumn: { name: '秋季', icon: '🍂', months: [8, 9, 10] }, // 9-11月
  winter: { name: '冬季', icon: '❄️', months: [11, 0, 1] }  // 12-2月
};

// 根据季节获取可用天气
const getSeasonWeather = (season) => {
  switch (season) {
    case 'spring':
      return ['sunny', 'cloudy', 'rainy', 'windy'];
    case 'summer':
      return ['sunny', 'cloudy', 'rainy'];
    case 'autumn':
      return ['sunny', 'cloudy', 'rainy', 'windy', 'foggy'];
    case 'winter':
      return ['sunny', 'cloudy', 'snowy', 'foggy'];
    default:
      return ['sunny', 'cloudy'];
  }
};

export const usePriceFluctuation = (gameState) => {
  const {
    currentPrice,
    setCurrentPrice,
    priceHistory,
    setPriceHistory,
    players,
    setPlayers,
    userPlayer,
    setUserPlayer,
    transactions,
    setTransactions,
    orders,
    setOrders,
    orderCounters,
    setOrderCounters,
    gameStarted,
    isPaused,
    monthlyWeather,
    setMonthlyWeather,
    chatMessages,
    setChatMessages,
    workingPlayers,
    setWorkingPlayers,
    dailyVolumes,
    setDailyVolumes,
    monthStartPrice, // 【新增】月初价格
    setMonthStartPrice, // 【新增】设置月初价格的函数
    animalStatus, // 【新增】动物状态
    setAnimalStatus, // 【新增】设置动物状态
    gameStartMonth, // 【新增】游戏开始月份
    setGameStartMonth // 【新增】设置游戏开始月份
  } = gameState;

  // 获取 gameTime
  const gameTime = gameState.gameTime;
  const lastMonthRef = useRef(null);

  // 生成唯一订单编码
  const generateOrderCode = (playerKey, orderType) => {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    return `${playerKey}_${orderType}_${timestamp}_${random}`;
  };

  // 处理订单撮合 - 集合竞价规则
  // 每天撮合两次：取买一（最高买价）和卖一（最低卖价）进行撮合
  // 【修改】成交价规则：取买卖双方的中间价，避免价格单向下跌
  // 【修改】相同价格按时间先后排序（先下单先成交）
  const processOrders = useCallback(() => {
    if (isPaused) return; // 暂停时不处理订单

    // 从订单ID中提取时间戳的辅助函数
    const extractTimestamp = (id) => {
      const match = id.match(/_(\d+)_/);
      return match ? parseInt(match[1], 10) : 0;
    };

    // 买单按价格从大到小排序（最高买价排第一，即买一）
    // 相同价格按时间戳从小到大排序（先下单先成交）
    const buyOrders = [...orders.buy]
      .map(order => ({
        ...order,
        price: Number(order.price) // 确保价格是数字
      }))
      .sort((a, b) => {
        if (b.price !== a.price) return b.price - a.price;
        // 【修改】相同价格按时间戳排序（时间戳小的先下单，先成交）
        return extractTimestamp(a.id) - extractTimestamp(b.id);
      });
    
    // 卖单按价格从小到大排序（最低卖价排第一，即卖一）
    // 相同价格按时间戳从小到大排序（先下单先成交）
    const sellOrders = [...orders.sell]
      .map(order => ({
        ...order,
        price: Number(order.price) // 确保价格是数字
      }))
      .sort((a, b) => {
        if (a.price !== b.price) return a.price - b.price;
        // 【修改】相同价格按时间戳排序（时间戳小的先下单，先成交）
        return extractTimestamp(a.id) - extractTimestamp(b.id);
      });
    
    const newTransactions = [];
    const updatedCounters = { ...orderCounters };
    let todayVolume = 0; // 当日成交量累计

    // 每天进行2次撮合
    const maxMatchesPerRound = 2;

    for (let round = 0; round < maxMatchesPerRound; round++) {
      // 检查是否还有订单可以撮合
      if (buyOrders.length === 0 || sellOrders.length === 0) break;

      // 取买一（最高买价）和卖一（最低卖价）
      const buyOrder = buyOrders[0];
      const sellOrder = sellOrders[0];

      // 检查是否可以成交：买一价格 >= 卖一价格
      if (buyOrder.price >= sellOrder.price) {
        // 【修改】成交价计算规则：
        // 1. 如果买卖价格差距超过1%，优先按现价成交（保护挂跌停价的用户）
        // 2. 否则取买卖双方的中间价
        const priceGap = ((buyOrder.price - sellOrder.price) / sellOrder.price) * 100; // 价格差距百分比
        let tradePrice;
        
        if (priceGap > 1) {
          // 价格差距超过1%，优先按现价成交
          // 现价应该在卖价和买价之间，否则取中间价
          if (currentPrice >= sellOrder.price && currentPrice <= buyOrder.price) {
            tradePrice = Number(currentPrice.toFixed(3));
            console.log(`💰 价格差距${priceGap.toFixed(2)}% > 1%，按现价¥${tradePrice}成交（卖价¥${sellOrder.price} vs 买价¥${buyOrder.price}）`);
          } else {
            // 现价不在买卖区间内，取中间价
            tradePrice = Number(((buyOrder.price + sellOrder.price) / 2).toFixed(3));
            console.log(`💰 现价¥${currentPrice}不在买卖区间内，取中间价¥${tradePrice}`);
          }
        } else {
          // 价格差距不超过1%，取中间价
          tradePrice = Number(((buyOrder.price + sellOrder.price) / 2).toFixed(3));
        }
        
        // 确定成交数量 - 取买卖双方订单数量的较小值
        const tradeShares = Math.min(buyOrder.shares, sellOrder.shares);
        
        // 累加当日成交量
        todayVolume += tradeShares;

        console.log(`🔄 撮合成交(第${round + 1}次): 买一${buyOrder.player}(¥${buyOrder.price}) ↔ 卖一${sellOrder.player}(¥${sellOrder.price}), 成交价¥${tradePrice}(中间价), 数量${tradeShares}股`);

        // 创建成交记录
        newTransactions.push({
          id: Date.now() + Math.random(),
          type: '撮合成交',
          player: `${buyOrder.player} ↔ ${sellOrder.player}`,
          action: `买入/卖出`,
          price: tradePrice,
          shares: tradeShares,
          time: new Date().toLocaleTimeString()
        });

        // 更新买卖双方的资产
        setPlayers(prev => {
          const updated = { ...prev };
          
          // 【买方处理】
          // 下单时冻结：委托价 × 委托数量
          // 成交时实际需要：成交价 × 成交数量
          // 差额返还：(委托价 - 成交价) × 成交数量
          const buyerKey = buyOrder.playerKey || Object.keys(prev).find(key => prev[key]?.name === buyOrder.player);
          if (buyerKey && updated[buyerKey]) {
            // 成交所需资金
            const actualCost = tradePrice * tradeShares;
            // 原冻结资金
            const frozenMoneyUsed = buyOrder.price * tradeShares;
            // 返还差额（委托价 > 成交价时）
            const refundMoney = frozenMoneyUsed - actualCost;
            
            console.log(`📥 买方 ${updated[buyerKey].name}: 成交${tradeShares}股@¥${tradePrice}, 实付¥${actualCost.toFixed(2)}, 原冻结¥${frozenMoneyUsed.toFixed(2)}, 返还¥${refundMoney.toFixed(2)}`);
            
            updated[buyerKey] = {
              ...updated[buyerKey],
              shares: updated[buyerKey].shares + tradeShares,  // 增加持股
              money: updated[buyerKey].money + refundMoney,    // 返还差额资金
              frozenMoney: Math.max(0, (updated[buyerKey].frozenMoney || 0) - frozenMoneyUsed), // 释放冻结资金
              currentPrice: tradePrice
            };
          }
          
          // 【卖方处理】
          // 下单时：股份从 shares 转移到 frozenShares（shares已减少，frozenShares已增加）
          // 成交时：frozenShares 减少（股份真正卖出），同时 shares 不变（下单时已减）
          // 收入：成交价 × 成交数量
          const sellerKey = sellOrder.playerKey || Object.keys(prev).find(key => prev[key]?.name === sellOrder.player);
          if (sellerKey && updated[sellerKey]) {
            const revenue = tradePrice * tradeShares;
            const oldFrozenShares = updated[sellerKey].frozenShares || 0;
            const newFrozenShares = Math.max(0, oldFrozenShares - tradeShares);
            
            console.log(`📤 卖方 ${updated[sellerKey].name}: 成交${tradeShares}股@¥${tradePrice}, 收入¥${revenue.toFixed(2)}, 冻结股份 ${oldFrozenShares} -> ${newFrozenShares}`);
            
            updated[sellerKey] = {
              ...updated[sellerKey],
              money: updated[sellerKey].money + revenue,        // 增加收入
              frozenShares: newFrozenShares,                    // 释放冻结股份
              currentPrice: tradePrice
            };
            
            // 【关键】卖方股份在下单时已经减少，成交时不需要再减少
            // 总股份守恒：买方 +tradeShares，卖方 shares不变（下单时已减），frozenShares减少
          }
          
          return updated;
        });

        // 如果用户是买方或卖方，更新用户资产
        if (userPlayer && userPlayer.name && (userPlayer.name === buyOrder.player || userPlayer.name === sellOrder.player)) {
          setUserPlayer(prev => {
            if (!prev || typeof prev.money !== 'number' || typeof prev.shares !== 'number') {
              return prev;
            }
            
            if (prev.name === buyOrder.player) {
              // 买方处理
              const actualCost = tradePrice * tradeShares;
              const frozenMoneyUsed = buyOrder.price * tradeShares;
              const refundMoney = frozenMoneyUsed - actualCost;
              
              console.log(`📥 用户买单成交: ${tradeShares}股@¥${tradePrice}, 实付¥${actualCost.toFixed(2)}, 返还¥${refundMoney.toFixed(2)}`);
              
              return {
                ...prev,
                shares: prev.shares + tradeShares,
                money: prev.money + refundMoney,
                frozenMoney: Math.max(0, (prev.frozenMoney || 0) - frozenMoneyUsed),
                currentPrice: tradePrice
              };
            } else if (prev.name === sellOrder.player) {
              // 卖方处理
              // 下单时：股份从 shares 转移到 frozenShares
              // 成交时：frozenShares 减少，shares 不变
              const revenue = tradePrice * tradeShares;
              const oldFrozenShares = prev.frozenShares || 0;
              const newFrozenShares = Math.max(0, oldFrozenShares - tradeShares);
              
              console.log(`📤 用户卖单成交: ${tradeShares}股@¥${tradePrice}, 收入¥${revenue.toFixed(2)}, 冻结股份 ${oldFrozenShares} -> ${newFrozenShares}`);
              
              return {
                ...prev,
                money: prev.money + revenue,
                frozenShares: newFrozenShares,
                currentPrice: tradePrice
              };
              // 注意：卖方股份在下单时已经减少，成交时不需要再减少
            }
            return prev;
          });
        }

        // 重置已成交订单的计数器
        delete updatedCounters[buyOrder.id];
        delete updatedCounters[sellOrder.id];

        // 更新订单数量
        buyOrder.shares -= tradeShares;
        sellOrder.shares -= tradeShares;
        // 更新订单的冻结金额（部分成交时）
        buyOrder.frozenMoney = buyOrder.price * buyOrder.shares;
        sellOrder.frozenShares = sellOrder.shares;

        // 如果买单完全成交，从列表移除
        if (buyOrder.shares <= 0) {
          buyOrders.shift(); // 移除买一
        }
        
        // 如果卖单完全成交，从列表移除
        if (sellOrder.shares <= 0) {
          sellOrders.shift(); // 移除卖一
        }
      } else {
        // 买一价格 < 卖一价格，无法成交，结束撮合
        break;
      }
    }

    // 更新未成交订单的计数器
    buyOrders.forEach(order => {
      updatedCounters[order.id] = (updatedCounters[order.id] || 0) + 1;
    });
    
    sellOrders.forEach(order => {
      updatedCounters[order.id] = (updatedCounters[order.id] || 0) + 1;
    });

    // 更新订单状态
    setOrders({ buy: buyOrders, sell: sellOrders });
    setOrderCounters(updatedCounters);
    
    // 添加成交记录
    if (newTransactions.length > 0) {
      setTransactions(prev => [...prev, ...newTransactions]);
      
      // 更新当前价格为最新成交价
      const latestTransaction = newTransactions[newTransactions.length - 1];
      setCurrentPrice(latestTransaction.price);
      setPriceHistory(prev => [...prev, latestTransaction.price]);
    }
    
    // 记录今日成交量
    if (setDailyVolumes) {
      setDailyVolumes(prev => [...prev, todayVolume]);
      if (todayVolume > 0) {
        console.log(`📊 今日成交量: ${todayVolume}股`);
      }
    }
  }, [orders, orderCounters, setOrders, setOrderCounters, setTransactions, setPlayers, userPlayer, setUserPlayer, setCurrentPrice, setPriceHistory, isPaused, setDailyVolumes]);

  // 生成AI玩家订单 - 重构：使用每种动物独特的交易策略
  const generateAIOrders = useCallback(() => {
    if (isPaused) return; // 暂停时不生成新订单

    const newOrders = { buy: [], sell: [] };
    const playerUpdates = {}; // 记录需要更新的玩家资产
    const newChatMessages = []; // 记录新的聊天消息

    // 获取当前季节
    const currentMonth = gameTime ? gameTime.getMonth() : 0;
    let currentSeason = 'winter';
    if (currentMonth >= 2 && currentMonth <= 4) currentSeason = 'spring';
    else if (currentMonth >= 5 && currentMonth <= 7) currentSeason = 'summer';
    else if (currentMonth >= 8 && currentMonth <= 10) currentSeason = 'autumn';

    const playerEntries = Object.entries(players);

    console.log(`📋 开始生成动物订单，当前季节: ${currentSeason}`);
    
    playerEntries.forEach(([key, player]) => {
      // 跳过用户玩家
      if (key === 'user') return;
      
      // 【新增】检查动物状态
      const currentStatus = animalStatus?.[key]?.status || ANIMAL_STATUS.ACTIVE;
      if (currentStatus === ANIMAL_STATUS.LEFT) {
        console.log(`  ⏭️ ${player?.name || key} 已离开游戏，跳过`);
        return;
      }
      if (currentStatus === ANIMAL_STATUS.HIBERNATING) {
        // 冬眠期间有很小的概率会醒来交易
        if (Math.random() > HIBERNATION_CONFIG.tradeProbabilityDuringHibernation) {
          console.log(`  😴 ${player?.name || key} 正在冬眠中，跳过`);
          return;
        } else {
          console.log(`  😴 ${player?.name || key} 冬眠中短暂醒来，进行交易`);
        }
      }
      
      // 跳过打工中的玩家
      if (workingPlayers && workingPlayers[key]) {
        console.log(`  ⏭️ ${player?.name || key} 正在打工中，跳过`);
        return;
      }
      
      // 检查该动物已有订单数量（买单最多3个，卖单最多3个）
      const existingBuyOrders = orders.buy.filter(o => o.playerKey === key).length;
      const existingSellOrders = orders.sell.filter(o => o.playerKey === key).length;
      
      // 添加玩家数据有效性检查
      if (!player || typeof player.money !== 'number' || typeof player.shares !== 'number') {
        console.warn('玩家数据无效:', key, player);
        return;
      }
      
      // 亏损90%离场
      if (player.money < player.initialMoney * 0.1) {
        console.log(`  ⏭️ ${player.name} 亏损超过90%，跳过`);
        return;
      }

      // 获取该动物在当前季节的积极性
      const activity = getActivityBySeason(key, currentSeason);
      console.log(`  🐾 ${player.name}: 资金¥${player.money.toFixed(2)}, 股份${player.shares}, 积极性${(activity * 100).toFixed(0)}%, 已有买单${existingBuyOrders}个, 卖单${existingSellOrders}个`);
      
      // 根据积极性决定是否生成订单
      if (Math.random() > activity) {
        console.log(`    ❌ 积极性检查未通过，今天不交易`);
        return;
      }

      // 使用策略决定买卖方向
      const orderType = decideTradeDirection(key, player, currentPrice, priceHistory);
      
      // 【修改】获取当前最高买单价格，供卖单参考
      const highestBuyPrice = orders.buy.length > 0 
        ? Math.max(...orders.buy.map(o => Number(o.price))) 
        : currentPrice;
      
      // 使用策略生成价格（传入最高买单价格和月初价格，月初价格从状态获取）
      const orderPrice = generateOrderPrice(key, currentPrice, orderType, priceHistory, highestBuyPrice, monthStartPrice);
      
      // 【修复】计算实际可用资源
      // shares 和 money 已经是扣除了冻结后的值（下单时会减少）
      // 所以可用资源直接就是 shares 和 money
      const availableShares = player.shares;
      const availableMoney = player.money;
      
      // 使用策略生成数量（基于可用资源）
      const orderShares = generateOrderShares(key, availableShares, availableMoney, currentPrice);

      // 检查资源是否足够并创建订单
      console.log(`    🎯 决定${orderType === 'buy' ? '买入' : '卖出'}，价格¥${orderPrice.toFixed(3)}，数量${orderShares}股`);
      
      if (orderType === 'buy' && availableMoney >= orderPrice * orderShares) {
        // 检查买单数量是否已达上限
        if (existingBuyOrders >= 3) {
          console.log(`    ❌ 买单已达上限(3个)，跳过`);
          return;
        }
        console.log(`    ✅ 生成买单委托: ¥${orderPrice.toFixed(3)} × ${orderShares}股`);
        
        // 买单：冻结资金
        const frozenMoney = orderPrice * orderShares;
        const orderCode = generateOrderCode(key, 'buy');
        newOrders.buy.push({
          id: orderCode,
          code: orderCode,
          player: player.name,
          price: Number(orderPrice.toFixed(3)),
          shares: orderShares,
          type: 'buy',
          frozenMoney: frozenMoney,
          playerKey: key
        });
        // 记录需要更新的玩家资产 - 保留原有的冻结值
        if (!playerUpdates[key]) playerUpdates[key] = { 
          money: player.money, 
          shares: player.shares,
          frozenMoney: player.frozenMoney || 0,
          frozenShares: player.frozenShares || 0
        };
        playerUpdates[key].money -= frozenMoney;
        playerUpdates[key].frozenMoney += frozenMoney;
        
        // 生成聊天消息
        const chatMsg = getAnimalChatMessage(key, 'buy');
        newChatMessages.push(chatMsg);
      } else if (orderType === 'sell' && availableShares >= orderShares) {
        // 检查卖单数量是否已达上限
        if (existingSellOrders >= 3) {
          console.log(`    ❌ 卖单已达上限(3个)，跳过`);
          return;
        }
        console.log(`    ✅ 生成卖单委托: ¥${orderPrice.toFixed(3)} × ${orderShares}股`);
        
        // 卖单：冻结股份
        const sellOrderCode = generateOrderCode(key, 'sell');
        newOrders.sell.push({
          id: sellOrderCode,
          code: sellOrderCode,
          player: player.name,
          price: Number(orderPrice.toFixed(3)),
          shares: orderShares,
          type: 'sell',
          frozenShares: orderShares,
          playerKey: key
        });
        // 记录需要更新的玩家资产 - 保留原有的冻结值
        if (!playerUpdates[key]) playerUpdates[key] = { 
          money: player.money, 
          shares: player.shares,
          frozenMoney: player.frozenMoney || 0,
          frozenShares: player.frozenShares || 0
        };
        playerUpdates[key].shares -= orderShares;
        playerUpdates[key].frozenShares += orderShares;
        
        // 生成聊天消息
        const chatMsg = getAnimalChatMessage(key, 'sell');
        newChatMessages.push(chatMsg);
      }
    });

    // 更新玩家资产（冻结资源）
    if (Object.keys(playerUpdates).length > 0) {
      setPlayers(prev => {
        const updated = { ...prev };
        Object.entries(playerUpdates).forEach(([key, updates]) => {
          if (updated[key]) {
            updated[key] = { ...updated[key], ...updates };
          }
        });
        return updated;
      });
    }

    // 更新订单，同时初始化新订单的计数器
    setOrders(prev => ({
      buy: [...prev.buy, ...newOrders.buy],
      sell: [...prev.sell, ...newOrders.sell]
    }));
    
    // 初始化新订单的计数器
    if (newOrders.buy.length > 0 || newOrders.sell.length > 0) {
      console.log(`📋 今日生成 ${newOrders.buy.length} 个买单，${newOrders.sell.length} 个卖单`);
      setOrderCounters(prev => {
        const updated = { ...prev };
        [...newOrders.buy, ...newOrders.sell].forEach(order => {
          updated[order.id] = 0; // 初始化为 0，下一轮撮合时才会 +1
        });
        return updated;
      });
    } else {
      console.log(`📋 今日无新订单生成`);
    }
    
    // 返回聊天消息供外部使用
    return newChatMessages;
  }, [players, currentPrice, priceHistory, gameTime, setOrders, setPlayers, isPaused, workingPlayers, orders, monthStartPrice]);

  // 更新玩家情绪 - 添加数据验证
  const updatePlayerEmotions = useCallback(() => {
    if (isPaused) return; // 暂停时不更新情绪

    setPlayers(prev => {
      const updated = { ...prev };
      Object.keys(updated).forEach(key => {
        const player = updated[key];
        if (player && typeof player.shares === 'number' && typeof player.money === 'number' && typeof player.initialMoney === 'number') {
          // 【修复】计算当前总价值时需要包含冻结的资金和股份
          const currentTotalValue = player.money + (player.frozenMoney || 0) + 
                                    (player.shares + (player.frozenShares || 0)) * currentPrice;
          const initialTotalValue = player.initialMoney + (player.initialShares || 0) * (player.initialPrice || 1.0);
          const profit = currentTotalValue - initialTotalValue;
          const profitRatio = initialTotalValue > 0 ? profit / initialTotalValue : 0;
          
          // 根据盈亏比例更新情绪
          if (profitRatio > 0.1) {
            updated[key].emotion = 'excited';
          } else if (profitRatio > 0.02) {
            updated[key].emotion = 'happy';
          } else if (profitRatio > -0.02) {
            updated[key].emotion = 'neutral';
          } else if (profitRatio > -0.1) {
            updated[key].emotion = 'sad';
          } else {
            updated[key].emotion = 'depressed';
          }
        }
      });
      return updated;
    });
  }, [setPlayers, isPaused, currentPrice]);

  // 处理打工完成和动物打工决策
  const processWorkStatus = useCallback(() => {
    if (isPaused || !gameTime) return;

    const currentDate = new Date(gameTime);
    const workAnnouncements = [];
    const newTransactions = [];

    // 检查打工中的玩家是否完成打工
    Object.entries(workingPlayers || {}).forEach(([playerKey, workInfo]) => {
      if (!workInfo || !workInfo.untilDate) return;
      
      const untilDate = new Date(workInfo.untilDate);
      
      if (currentDate >= untilDate) {
        // 打工完成，发放薪资
        const salary = workInfo.salary || 0;
        const playerName = workInfo.playerName || playerKey;
        
        console.log(`💼 打工完成: ${playerName}, 薪资¥${salary}`);
        
        // 更新玩家资金
        setPlayers(prev => {
          const updated = { ...prev };
          if (updated[playerKey]) {
            updated[playerKey] = {
              ...updated[playerKey],
              money: (updated[playerKey].money || 0) + salary,
              totalWorkIncome: (updated[playerKey].totalWorkIncome || 0) + salary,
              workingUntil: null
            };
            console.log(`  ✅ ${updated[playerKey].name} 资金增加¥${salary}`);
          }
          return updated;
        });

        // 如果是用户，也更新 userPlayer
        if (playerKey === 'user' && setUserPlayer) {
          setUserPlayer(prev => ({
            ...prev,
            money: (prev.money || 0) + salary,
            totalWorkIncome: (prev.totalWorkIncome || 0) + salary,
            workingUntil: null
          }));
        }

        // 生成打工完成消息
        const returnMsg = getWorkMessage(playerKey === 'user' ? 'cat' : playerKey, false, salary);
        workAnnouncements.push(`💼 【打工归来】${playerName}: ${returnMsg}`);
        
        // 添加交易记录
        newTransactions.push({
          id: Date.now() + Math.random(),
          type: '打工收入',
          player: playerName,
          action: '打工完成',
          price: salary,
          shares: 0,
          time: new Date().toLocaleTimeString()
        });

        // 从打工列表移除
        setWorkingPlayers(prev => {
          const updated = { ...prev };
          delete updated[playerKey];
          return updated;
        });
      }
    });

    // 动物打工决策 - 每月检查一次
    const currentMonth = gameTime.getMonth();
    const currentYear = gameTime.getFullYear();
    
    // 获取当前季节
    let currentSeason = 'winter';
    if (currentMonth >= 2 && currentMonth <= 4) currentSeason = 'spring';
    else if (currentMonth >= 5 && currentMonth <= 7) currentSeason = 'summer';
    else if (currentMonth >= 8 && currentMonth <= 10) currentSeason = 'autumn';

    // 检查每个动物是否要出门打工
    Object.entries(players).forEach(([key, player]) => {
      if (key === 'user') return; // 跳过用户
      if (workingPlayers && workingPlayers[key]) return; // 已经在打工中
      
      // 检查是否应该打工
      if (checkShouldGoToWork(key, currentSeason, player)) {
        const { income, duration } = getWorkIncome(key);
        
        // 计算打工结束日期
        const untilDate = new Date(gameTime);
        untilDate.setMonth(untilDate.getMonth() + duration);
        
        // 设置打工状态
        setWorkingPlayers(prev => ({
          ...prev,
          [key]: {
            untilDate: untilDate.toISOString(),
            salary: income,
            startDate: gameTime.toISOString(),
            playerName: player.name  // 【新增】保存玩家名称
          }
        }));

        // 更新玩家状态
        setPlayers(prev => {
          const updated = { ...prev };
          if (updated[key]) {
            updated[key] = {
              ...updated[key],
              workingUntil: untilDate.toISOString()
            };
          }
          return updated;
        });

        // 生成打工消息
        const leavingMsg = getWorkMessage(key, true);
        workAnnouncements.push(`💼 【外出打工】${player.name}: ${leavingMsg} (预计${duration}个月，薪资约¥${income})`);
        
        // 添加交易记录
        newTransactions.push({
          id: Date.now() + Math.random(),
          type: '开始打工',
          player: player.name,
          action: `外出打工${duration}个月`,
          price: 0,
          shares: 0,
          time: new Date().toLocaleTimeString()
        });
      }
    });

    // 添加公告和交易记录
    if (workAnnouncements.length > 0) {
      // 使用 setChatMessages 添加公告
      setChatMessages(prev => [...prev, ...workAnnouncements.map(msg => ({
        id: Date.now() + Math.random(),
        type: 'work',
        text: msg,
        animalType: 'momo',
        playerName: '播报员',
        time: new Date().toLocaleTimeString()
      }))].slice(-50));
    }

    if (newTransactions.length > 0) {
      setTransactions(prev => [...prev, ...newTransactions]);
    }
  }, [isPaused, gameTime, workingPlayers, players, setWorkingPlayers, setPlayers, setUserPlayer, setChatMessages, setTransactions]);

  // 检查并撤回连续10轮未成交的动物订单（用户订单不自动撤回）
  const checkAndCancelStaleOrders = useCallback(() => {
    if (isPaused) return; // 暂停时不检查过期订单

    const ordersToCancel = [];
    const updatedCounters = { ...orderCounters };
    const playerRefunds = {}; // 记录需要返还给玩家的资源

    // 找出连续10轮未成交的动物订单
    Object.entries(updatedCounters).forEach(([orderId, count]) => {
      // 只撤回动物的订单，用户订单不自动撤回
      if (count >= 10 && !orderId.startsWith('user_')) {
        ordersToCancel.push(orderId);
        delete updatedCounters[orderId];
      }
    });

    if (ordersToCancel.length > 0) {
      // 找出需要返还资源的订单
      const allOrders = [...orders.buy, ...orders.sell];
      ordersToCancel.forEach(orderId => {
        const order = allOrders.find(o => o.id === orderId);
        if (order) {
          // 跳过用户订单
          if (order.id && order.id.startsWith('user_')) {
            console.log(`📋 用户订单 ${orderId} 不自动撤回`);
            return;
          }
          
          const playerKey = order.playerKey || Object.keys(players).find(key => players[key]?.name === order.player);
          if (playerKey && !playerRefunds[playerKey]) {
            playerRefunds[playerKey] = { money: 0, shares: 0, frozenMoney: 0, frozenShares: 0 };
          }
          
          if (order.type === 'buy' && order.frozenMoney) {
            // 买单撤销：返还冻结的资金
            playerRefunds[playerKey].money += order.frozenMoney;
            playerRefunds[playerKey].frozenMoney -= order.frozenMoney;
          } else if (order.type === 'sell' && order.frozenShares) {
            // 卖单撤销：返还冻结的股份
            playerRefunds[playerKey].shares += order.frozenShares;
            playerRefunds[playerKey].frozenShares -= order.frozenShares;
          }
        }
      });

      // 更新玩家资产（返还冻结资源）
      if (Object.keys(playerRefunds).length > 0) {
        setPlayers(prev => {
          const updated = { ...prev };
          Object.entries(playerRefunds).forEach(([key, refunds]) => {
            if (updated[key]) {
              const newMoney = updated[key].money + refunds.money;
              const newShares = updated[key].shares + refunds.shares;
              const newFrozenMoney = Math.max(0, (updated[key].frozenMoney || 0) + refunds.frozenMoney);
              const newFrozenShares = Math.max(0, (updated[key].frozenShares || 0) + refunds.frozenShares);
              
              console.log(`📊 ${updated[key].name} 订单超时撤回: 返还资金¥${refunds.money.toFixed(2)}, 返还股份${refunds.shares}股`);
              
              updated[key] = {
                ...updated[key],
                money: newMoney,
                shares: newShares,
                frozenMoney: newFrozenMoney,
                frozenShares: newFrozenShares
              };
            }
          });
          return updated;
        });
        
        // 如果用户订单被撤回，也更新 userPlayer
        if (playerRefunds.user && userPlayer) {
          setUserPlayer(prev => ({
            ...prev,
            money: prev.money + playerRefunds.user.money,
            shares: prev.shares + playerRefunds.user.shares,
            frozenMoney: Math.max(0, (prev.frozenMoney || 0) + playerRefunds.user.frozenMoney),
            frozenShares: Math.max(0, (prev.frozenShares || 0) + playerRefunds.user.frozenShares)
          }));
        }
      }

      // 撤回超时的动物订单
      const actualOrdersToCancel = ordersToCancel.filter(id => !id.startsWith('user_'));
      if (actualOrdersToCancel.length > 0) {
        setOrders(prev => ({
          buy: prev.buy.filter(order => !actualOrdersToCancel.includes(order.id)),
          sell: prev.sell.filter(order => !actualOrdersToCancel.includes(order.id))
        }));
      }
      setOrderCounters(updatedCounters);
    }
  }, [orderCounters, setOrders, setOrderCounters, orders, players, setPlayers, isPaused]);

  // 【新增】每月资产核查机制 - 检查并修复异常冻结、坏账等问题
  const monthlyAssetAudit = useCallback(() => {
    if (isPaused || !players) return;
    
    console.log(`🔍 开始每月资产核查...`);
    
    // 【新增】计算总股份守恒性检查
    // 初始动物总股份: 猫500 + 狗2000 + 熊5000 + 狐5000 + 虎10000 + 兔3000 + 牛100000 = 125500
    // 用户作为新玩家加入，需要加上用户的初始股份
    const initialAnimalShares = 125500;
    const userInitialShares = userPlayer?.initialShares || 0;
    const expectedTotalShares = initialAnimalShares + userInitialShares;
    
    let totalShares = 0;
    let totalFrozenShares = 0;
    let totalActualShares = 0;
    
    Object.entries(players).forEach(([key, player]) => {
      if (!player || typeof player.shares !== 'number') return;
      const shares = player.shares || 0;
      const frozen = player.frozenShares || 0;
      totalShares += shares;
      totalFrozenShares += frozen;
      totalActualShares += shares + frozen;
      console.log(`  📊 ${player.name}: 持股${shares} + 冻结${frozen} = ${shares + frozen}`);
    });
    
    console.log(`\n📈 总股份统计:`);
    console.log(`  持股总计: ${totalShares}`);
    console.log(`  冻结总计: ${totalFrozenShares}`);
    console.log(`  实际总计: ${totalActualShares}`);
    console.log(`  预期总计: ${expectedTotalShares} (初始动物${initialAnimalShares} + 用户初始${userInitialShares})`);
    
    if (totalActualShares !== expectedTotalShares) {
      console.error(`⚠️ 总股份异常！预期${expectedTotalShares}，实际${totalActualShares}，差异${totalActualShares - expectedTotalShares}`);
    } else {
      console.log(`✅ 总股份守恒检查通过`);
    }
    
    // 计算所有订单中应该冻结的资金和股份（根据订单剩余数量）
    const frozenByOrders = {};
    
    // 统计买单冻结的资金（根据订单剩余数量和价格计算）
    orders.buy.forEach(order => {
      const playerKey = order.playerKey || Object.keys(players).find(key => players[key]?.name === order.player);
      if (playerKey) {
        if (!frozenByOrders[playerKey]) frozenByOrders[playerKey] = { money: 0, shares: 0 };
        // 买单冻结资金 = 剩余数量 × 委托价格
        const shouldFreezeMoney = order.shares * order.price;
        frozenByOrders[playerKey].money += shouldFreezeMoney;
        console.log(`  📋 买单 ${order.player}: 剩余${order.shares}股 × ¥${order.price} = 应冻结¥${shouldFreezeMoney.toFixed(2)}`);
      }
    });
    
    // 统计卖单冻结的股份（根据订单剩余数量）
    orders.sell.forEach(order => {
      const playerKey = order.playerKey || Object.keys(players).find(key => players[key]?.name === order.player);
      if (playerKey) {
        if (!frozenByOrders[playerKey]) frozenByOrders[playerKey] = { money: 0, shares: 0 };
        // 卖单冻结股份 = 剩余数量
        frozenByOrders[playerKey].shares += order.shares;
        console.log(`  📋 卖单 ${order.player}: 剩余${order.shares}股应冻结`);
      }
    });
    
    // 检查每个玩家的资产状态
    const playerFixes = {};
    
    Object.entries(players).forEach(([key, player]) => {
      if (!player || typeof player.money !== 'number') return;
      
      const expectedFrozen = frozenByOrders[key] || { money: 0, shares: 0 };
      const actualFrozenMoney = player.frozenMoney || 0;
      const actualFrozenShares = player.frozenShares || 0;
      
      const issues = [];
      let fixedMoney = player.money;
      let fixedShares = player.shares;
      let fixedFrozenMoney = actualFrozenMoney;
      let fixedFrozenShares = actualFrozenShares;
      
      console.log(`\n👤 ${player.name} (${key}):`);
      console.log(`  当前资金: ¥${player.money.toFixed(2)}, 冻结资金: ¥${actualFrozenMoney.toFixed(2)}`);
      console.log(`  当前股份: ${player.shares}, 冻结股份: ${actualFrozenShares}`);
      console.log(`  应冻结资金: ¥${expectedFrozen.money.toFixed(2)}, 应冻结股份: ${expectedFrozen.shares}`);
      
      // 检查1：冻结资金与订单不一致
      if (Math.abs(actualFrozenMoney - expectedFrozen.money) > 0.01) {
        const diff = actualFrozenMoney - expectedFrozen.money;
        if (diff > 0) {
          // 多冻结了，返还给玩家
          issues.push(`冻结资金多了¥${diff.toFixed(2)}，返还给玩家`);
          fixedMoney += diff;
          fixedFrozenMoney = expectedFrozen.money;
        } else {
          // 少冻结了（这可能是数据错误）
          issues.push(`冻结资金少了¥${Math.abs(diff).toFixed(2)}，修正冻结值`);
          fixedFrozenMoney = expectedFrozen.money;
        }
      }
      
      // 检查2：冻结股份与订单不一致
      if (actualFrozenShares !== expectedFrozen.shares) {
        const diff = actualFrozenShares - expectedFrozen.shares;
        if (diff > 0) {
          // 多冻结了，返还给玩家
          issues.push(`冻结股份多了${diff}股，返还给玩家`);
          fixedShares += diff;
          fixedFrozenShares = expectedFrozen.shares;
        } else {
          // 少冻结了
          issues.push(`冻结股份少了${Math.abs(diff)}股，修正冻结值`);
          fixedFrozenShares = expectedFrozen.shares;
        }
      }
      
      // 检查3：资金为负数（坏账）
      if (fixedMoney < 0) {
        issues.push(`资金为负数: ¥${fixedMoney.toFixed(2)}（坏账），清零`);
        fixedMoney = 0;
        fixedFrozenMoney = 0;
      }
      
      // 检查4：股份为负数
      if (fixedShares < 0) {
        issues.push(`股份为负数: ${fixedShares}股，清零`);
        fixedShares = 0;
        fixedFrozenShares = 0;
      }
      
      // 检查5：冻结资金超过可用资金
      if (fixedFrozenMoney > 0 && fixedMoney < 0) {
        issues.push(`冻结资金超过可用资金，修正`);
        fixedFrozenMoney = Math.max(0, fixedFrozenMoney + fixedMoney);
        fixedMoney = 0;
      }
      
      // 检查6：冻结股份超过持有股份
      if (fixedFrozenShares > 0 && fixedShares < fixedFrozenShares) {
        issues.push(`冻结股份超过持有股份，修正`);
        fixedFrozenShares = Math.max(0, fixedShares);
      }
      
      // 如果有问题需要修复
      if (issues.length > 0) {
        playerFixes[key] = {
          name: player.name,
          issues,
          before: { money: player.money, shares: player.shares, frozenMoney: actualFrozenMoney, frozenShares: actualFrozenShares },
          after: { money: fixedMoney, shares: fixedShares, frozenMoney: fixedFrozenMoney, frozenShares: fixedFrozenShares }
        };
      }
    });
    
    // 应用修复
    if (Object.keys(playerFixes).length > 0) {
      console.log(`\n🔧 发现 ${Object.keys(playerFixes).length} 个玩家需要修复:`);
      
      setPlayers(prev => {
        const updated = { ...prev };
        Object.entries(playerFixes).forEach(([key, fix]) => {
          if (updated[key]) {
            updated[key] = {
              ...updated[key],
              money: fix.after.money,
              shares: fix.after.shares,
              frozenMoney: fix.after.frozenMoney,
              frozenShares: fix.after.frozenShares
            };
            console.log(`  ✅ ${fix.name}: ${fix.issues.join(', ')}`);
          }
        });
        return updated;
      });
      
      // 同步更新用户玩家
      if (playerFixes.user && userPlayer) {
        setUserPlayer(prev => ({
          ...prev,
          money: playerFixes.user.after.money,
          shares: playerFixes.user.after.shares,
          frozenMoney: playerFixes.user.after.frozenMoney,
          frozenShares: playerFixes.user.after.frozenShares
        }));
      }
    } else {
      console.log(`\n✅ 资产核查完成，所有玩家资产正常`);
    }
    
    return playerFixes;
  }, [orders, players, setPlayers, userPlayer, setUserPlayer, isPaused]);

  // 检查月度涨跌幅限制
  const checkMonthlyPriceLimit = useCallback((newPrice) => {
    // 获取月初价格（假设priceHistory[0]是月初价格）
    const monthStartPrice = priceHistory[0] || INITIAL_PRICE;
    
    // 计算涨跌幅
    const priceChange = (newPrice - monthStartPrice) / monthStartPrice;
    
    // 限制涨跌幅在±10%
    if (priceChange > 0.1) {
      return monthStartPrice * 1.1; // 涨停价
    } else if (priceChange < -0.1) {
      return monthStartPrice * 0.9; // 跌停价
    }
    
    return newPrice;
  }, [priceHistory]);

  // 记录上一次处理的日期，确保每天只执行一次撮合
  const lastProcessedDateRef = useRef(null);

  // 当游戏未开始时，重置所有 ref
  useEffect(() => {
    if (!gameStarted) {
      lastMonthRef.current = null;
      lastProcessedDateRef.current = null;
    } else if (gameStarted && gameTime && setGameStartMonth && !gameStartMonth) {
      // 【新增】游戏开始时，记录开始月份
      setGameStartMonth({
        year: gameTime.getFullYear(),
        month: gameTime.getMonth()
      });
      console.log(`🎮 游戏开始于: ${gameTime.getFullYear()}年${gameTime.getMonth() + 1}月`);
    }
  }, [gameStarted, gameTime, setGameStartMonth, gameStartMonth]);

  // 主要的价格更新逻辑 - 每天执行一次撮合
  useEffect(() => {
    if (!gameStarted || isPaused || !gameTime) return;

    const currentDate = gameTime.toDateString();
    
    // 如果已经处理过今天，跳过
    if (lastProcessedDateRef.current === currentDate) return;
    
    // 记录今天已处理
    lastProcessedDateRef.current = currentDate;
    
    console.log(`📅 ${currentDate} - 开始每日撮合流程`);
    
    // 每天的执行顺序：
    // 0. 【新增】处理动物状态变化（冬眠、离开、加入）
    processAnimalLifecycle();
    
    // 1. 处理打工状态（完成打工发放薪资、动物决定打工）
    processWorkStatus();
    
    // 2. 先处理订单撮合（处理昨天的订单）
    processOrders();
    
    // 3. 检查并撤回连续5轮未成交的动物订单（用户订单不自动撤回）
    checkAndCancelStaleOrders();
    
    // 4. 生成今天的新订单（AI玩家）并获取聊天消息
    const newChatMsgs = generateAIOrders();
    
    // 更新聊天消息
    if (newChatMsgs && newChatMsgs.length > 0 && setChatMessages) {
      setChatMessages(prev => [...prev, ...newChatMsgs].slice(-50)); // 保留最近50条消息
    }
    
    // 5. 更新玩家情绪
    updatePlayerEmotions();
    
    // 6. 【新增】每天结束时，确保记录当天的价格到历史记录（用于月K线）
    // 即使没有成交，也要记录当前价格
    setPriceHistory(prev => {
      // 检查是否已经记录了今天的价格（通过日期计算）
      const expectedLength = Math.floor((gameTime - new Date(2000, 2, 1)) / (1000 * 60 * 60 * 24)) + 1;
      if (prev.length < expectedLength) {
        console.log(`📊 补充价格记录: 当前进度${prev.length}, 期望${expectedLength}, 当前价格¥${currentPrice.toFixed(3)}`);
        return [...prev, currentPrice];
      }
      return prev;
    });
    
    // 7. 【新增】每天记录成交量（即使为0也要记录）
    if (setDailyVolumes) {
      setDailyVolumes(prev => {
        const expectedLength = Math.floor((gameTime - new Date(2000, 2, 1)) / (1000 * 60 * 60 * 24)) + 1;
        const todayVol = prev.length > 0 ? prev[prev.length - 1] : 0;
        if (prev.length < expectedLength) {
          return [...prev, todayVol];
        }
        return prev;
      });
    }
    
    // 8. 【新增】生成日常聊天消息（每天一次）
    const currentMonth = gameTime.getMonth();
    const currentYear = gameTime.getFullYear();
    const monthKey = `${currentYear}-${currentMonth}`;
    const currentWeather = monthlyWeather[monthKey] || 'sunny';
    generateDailyChats(players, setChatMessages, currentWeather);

  }, [gameTime, gameStarted, isPaused, processOrders, generateAIOrders, updatePlayerEmotions, setChatMessages, processWorkStatus, checkAndCancelStaleOrders, currentPrice, setPriceHistory, setDailyVolumes, players, monthlyWeather]);

  // 检测月份变化并生成新天气 + 执行资产核查 + 【新增】更新月初价格
  useEffect(() => {
    if (!gameTime || !setMonthlyWeather) return;
    
    const currentMonth = gameTime.getMonth();
    const currentYear = gameTime.getFullYear();
    const monthKey = `${currentYear}-${currentMonth}`;
    
    // 如果还没有该月的天气，生成新天气（表示新的一月开始）
    if (!monthlyWeather[monthKey]) {
      // 根据月份确定季节
      let season = 'spring';
      if (currentMonth >= 2 && currentMonth <= 4) season = 'spring';
      else if (currentMonth >= 5 && currentMonth <= 7) season = 'summer';
      else if (currentMonth >= 8 && currentMonth <= 10) season = 'autumn';
      else season = 'winter';
      
      // 根据季节随机选择天气
      const availableWeather = getSeasonWeather(season);
      const randomWeather = availableWeather[Math.floor(Math.random() * availableWeather.length)];
      
      setMonthlyWeather(prev => ({
        ...prev,
        [monthKey]: randomWeather
      }));
      
      // 【新增】每月初更新月初价格为当前价格
      if (lastMonthRef.current && lastMonthRef.current !== monthKey && setMonthStartPrice) {
        console.log(`📆 新月份 ${currentYear}年${currentMonth + 1}月开始，更新月初价格: ¥${currentPrice.toFixed(3)}`);
        setMonthStartPrice(currentPrice);
      }
      
      // 每月初执行资产核查
      if (gameStarted && lastMonthRef.current && lastMonthRef.current !== monthKey) {
        console.log(`📆 新月份 ${currentYear}年${currentMonth + 1}月开始，执行资产核查`);
        monthlyAssetAudit();
      }
    }
    
    lastMonthRef.current = monthKey;
  }, [gameTime, monthlyWeather, setMonthlyWeather, gameStarted, monthlyAssetAudit, currentPrice, setMonthStartPrice]);

  // 【新增】处理动物状态变化 - 冬眠、离开、加入
  const processAnimalLifecycle = useCallback(() => {
    if (isPaused || !gameTime) return;

    const currentMonth = gameTime.getMonth();
    const newStatus = { ...animalStatus };
    const announcements = [];
    const newTransactions = [];

    // 1. 处理冬眠逻辑（仅熊和熊猫）
    Object.entries(players).forEach(([key, player]) => {
      if (key === 'user') return; // 跳过用户
      
      // 检查是否是冬眠动物
      if (HIBERNATION_CONFIG.hibernatingAnimals.includes(key)) {
        const isHibernationMonth = HIBERNATION_CONFIG.hibernationMonths.includes(currentMonth);
        const currentStatus = animalStatus[key]?.status || ANIMAL_STATUS.ACTIVE;
        
        if (isHibernationMonth && currentStatus !== ANIMAL_STATUS.HIBERNATING && currentStatus !== ANIMAL_STATUS.WORKING) {
          // 进入冬眠
          newStatus[key] = {
            status: ANIMAL_STATUS.HIBERNATING,
            since: gameTime.toISOString(),
            reason: '冬眠季节来临'
          };
          announcements.push(`😴 【冬眠通知】${player.name}: 冬天来了，我要去冬眠了，春天见~`);
          newTransactions.push({
            id: Date.now() + Math.random(),
            type: '开始冬眠',
            player: player.name,
            action: '进入冬眠',
            price: 0,
            shares: 0,
            time: new Date().toLocaleTimeString()
          });
          console.log(`🐻 ${player.name} 开始冬眠`);
        } else if (!isHibernationMonth && currentStatus === ANIMAL_STATUS.HIBERNATING) {
          // 从冬眠中醒来
          newStatus[key] = {
            status: ANIMAL_STATUS.ACTIVE,
            since: gameTime.toISOString(),
            reason: '冬眠结束'
          };
          announcements.push(`🌸 【苏醒通知】${player.name}: 春天来了，我醒了！又可以交易了~`);
          newTransactions.push({
            id: Date.now() + Math.random(),
            type: '冬眠结束',
            player: player.name,
            action: '从冬眠中醒来',
            price: 0,
            shares: 0,
            time: new Date().toLocaleTimeString()
          });
          console.log(`🐻 ${player.name} 从冬眠中醒来`);
        }
      }
    });

    // 2. 检查资金不足的动物，强制打工
    Object.entries(players).forEach(([key, player]) => {
      if (key === 'user') return; // 用户单独处理
      
      const currentStatus = animalStatus[key]?.status || ANIMAL_STATUS.ACTIVE;
      if (currentStatus === ANIMAL_STATUS.HIBERNATING) return; // 冬眠中跳过
      if (workingPlayers && workingPlayers[key]) return; // 已在打工中
      
      // 资金不足100元，必须打工
      if (player.money < ANIMAL_LIFECYCLE_CONFIG.leaveConditions.minMoney) {
        // 【修改】随机选择5-15天打工时长
        const durationDays = Math.floor(Math.random() * 11) + 5; // 5-15天
        const salary = Math.floor(calculateWorkSalary(key, durationDays));
        
        const untilDate = new Date(gameTime);
        untilDate.setDate(untilDate.getDate() + durationDays);
        
        // 设置打工状态
        setWorkingPlayers(prev => ({
          ...prev,
          [key]: {
            untilDate: untilDate.toISOString(),
            salary: salary,
            startDate: gameTime.toISOString(),
            playerName: player.name,
            forced: true, // 标记为强制打工
            durationDays: durationDays
          }
        }));

        newStatus[key] = {
          status: ANIMAL_STATUS.WORKING,
          since: gameTime.toISOString(),
          reason: '资金不足，强制打工'
        };

        announcements.push(`💼 【强制打工】${player.name}: 资金不足，必须外出打工${durationDays}天，薪资¥${salary}`);
        newTransactions.push({
          id: Date.now() + Math.random(),
          type: '强制打工',
          player: player.name,
          action: `资金不足外出打工${durationDays}天`,
          price: salary,
          shares: 0,
          time: new Date().toLocaleTimeString()
        });
        console.log(`💼 ${player.name} 资金不足，强制打工${durationDays}天`);
      }
    });

    // 3. 检查是否有新动物加入
    if (gameStartMonth) {
      const monthsSinceStart = (gameTime.getFullYear() - gameStartMonth.year) * 12 + 
                               (gameTime.getMonth() - gameStartMonth.month);
      
      if (monthsSinceStart >= ANIMAL_LIFECYCLE_CONFIG.joinConditions.minMonthsBeforeJoin) {
        const activePlayerCount = Object.keys(players).filter(
          k => k !== 'user' && animalStatus[k]?.status !== ANIMAL_STATUS.LEFT
        ).length;
        
        if (activePlayerCount < ANIMAL_LIFECYCLE_CONFIG.joinConditions.maxPlayers &&
            Math.random() < ANIMAL_LIFECYCLE_CONFIG.joinConditions.joinProbability) {
          
          const existingKeys = Object.keys(players);
          const newAnimal = getRandomNewAnimal(existingKeys);
          
          if (newAnimal) {
            // 添加新动物
            const newPlayerData = {
              name: newAnimal.name,
              money: newAnimal.template.money,
              shares: newAnimal.template.shares,
              icon: newAnimal.template.icon,
              emotion: 'neutral',
              initialMoney: newAnimal.template.money,
              initialShares: newAnimal.template.shares,
              initialPrice: currentPrice
            };
            
            setPlayers(prev => ({
              ...prev,
              [newAnimal.key]: newPlayerData
            }));
            
            newStatus[newAnimal.key] = {
              status: ANIMAL_STATUS.ACTIVE,
              since: gameTime.toISOString(),
              reason: '新加入游戏'
            };
            
            announcements.push(`🎉 【新玩家加入】${newAnimal.name}: ${newAnimal.template.description}`);
            newTransactions.push({
              id: Date.now() + Math.random(),
              type: '新玩家加入',
              player: newAnimal.name,
              action: `加入游戏，初始资金¥${newAnimal.template.money}`,
              price: currentPrice,
              shares: newAnimal.template.shares,
              time: new Date().toLocaleTimeString()
            });
            console.log(`🎉 新动物加入: ${newAnimal.name}`);
          }
        }
      }
    }

    // 更新状态
    if (Object.keys(newStatus).length > 0) {
      setAnimalStatus(prev => ({ ...prev, ...newStatus }));
    }

    // 添加公告和交易记录
    if (announcements.length > 0) {
      setChatMessages(prev => [...prev, ...announcements.map(msg => ({
        id: Date.now() + Math.random(),
        type: 'chat',
        text: msg,
        animalType: 'momo',
        playerName: '播报员',
        time: new Date().toLocaleTimeString()
      }))].slice(-50));
    }

    if (newTransactions.length > 0) {
      setTransactions(prev => [...prev, ...newTransactions]);
    }
  }, [isPaused, gameTime, players, animalStatus, workingPlayers, gameStartMonth, currentPrice, setAnimalStatus, setWorkingPlayers, setPlayers, setChatMessages, setTransactions]);

  return null;
};

// 导出天气和季节相关函数供其他组件使用
export { WEATHER_TYPES, SEASONS, getSeasonWeather };
  
// 用于去重的最近聊天文本记录
const recentChatTexts = new Set();
const MAX_RECENT_TEXTS = 50;

// 生成随机日常聊天消息的函数
const generateDailyChats = (players, setChatMessages, currentWeather) => {
  if (!players || !setChatMessages) return;
  
  // 随机选择一个动物发言
  const animalKeys = Object.keys(players).filter(key => key !== 'user' && players[key]);
  if (animalKeys.length === 0) return;
  
  // 【修改】15% 概率生成聊天消息，进一步降低聊天频率
  if (Math.random() > 0.15) return;
  
  // 随机选择 1 个动物发言
  const randomAnimal = animalKeys[Math.floor(Math.random() * animalKeys.length)];
  
  // 随机选择聊天类型：日常闲聊、天气讨论、年度大会回忆
  const chatType = Math.random();
  let chatMsg;
  
  if (chatType < 0.5) {
    // 50%概率：日常闲聊
    chatMsg = generateRandomChatMessage(players);
  } else if (chatType < 0.8) {
    // 30%概率：天气相关
    chatMsg = getWeatherChatMessage(randomAnimal, currentWeather || 'sunny');
  } else {
    // 20%概率：年度大会回忆
    chatMsg = getAnnualMeetingChatMessage(randomAnimal);
  }
  
  // 去重检查：如果最近已经发过相同内容的消息，则跳过
  if (chatMsg && chatMsg.text) {
    const textKey = `${chatMsg.playerName}-${chatMsg.text}`;
    if (recentChatTexts.has(textKey)) {
      console.log(`💬 跳过重复聊天: ${chatMsg.playerName} - ${chatMsg.text}`);
      return;
    }
    
    // 添加到去重集合
    recentChatTexts.add(textKey);
    if (recentChatTexts.size > MAX_RECENT_TEXTS) {
      // 移除最早的一条（Set 保持插入顺序）
      const firstItem = recentChatTexts.values().next().value;
      recentChatTexts.delete(firstItem);
    }
    
    console.log(`💬 生成聊天消息: ${chatMsg.playerName} - ${chatMsg.text}`);
    setChatMessages(prev => [...prev, chatMsg].slice(-50));
  }
};
