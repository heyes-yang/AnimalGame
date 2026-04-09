import { useCallback } from 'react';

export const useGameActions = (gameState) => {
  const {
    currentPrice,
    players,
    setPlayers,
    userPlayer,
    setUserPlayer,
    transactions,
    setTransactions,
    orders,
    setOrders,
    TRADING_SHARES,
    MAX_SHARES,
    priceHistory,
    monthStartPrice // 【新增】接收月初价格
  } = gameState;

  // 选择玩家角色
  // 用户作为新玩家加入游戏，不影响原有动物
  const selectPlayer = useCallback((playerKey, playerData) => {
    const newPlayer = {
      ...playerData,
      initialMoney: playerData.money,
      initialShares: playerData.shares || 0,
      initialPrice: currentPrice,
      currentPrice: currentPrice
    };
    
    console.log(`🎮 新玩家加入: ${newPlayer.name}, 初始资金¥${newPlayer.money}, 初始股份${newPlayer.shares}`);
    
    setUserPlayer(newPlayer);
    
    // 将用户添加到 players 对象中
    setPlayers(prev => ({
      ...prev,
      user: newPlayer
    }));
  }, [currentPrice, setUserPlayer, setPlayers]);

  // 更新用户玩家信息
  const updateUserPlayer = useCallback((updatedPlayer) => {
    setUserPlayer(prev => ({
      ...prev,
      ...updatedPlayer,
      currentPrice: currentPrice
    }));
    
    // 同步更新 players 对象
    setPlayers(prev => ({
      ...prev,
      user: {
        ...prev.user,
        ...updatedPlayer,
        currentPrice: currentPrice
      }
    }));
  }, [currentPrice, setUserPlayer, setPlayers]);

  // 买入股票
  const buyStock = useCallback((shares) => {
    if (!userPlayer || typeof userPlayer.money !== 'number' || typeof userPlayer.shares !== 'number') {
      console.warn('用户玩家数据无效');
      return;
    }

    const totalCost = currentPrice * shares;
    
    if (userPlayer.money < totalCost) {
      alert('资金不足!');
      return;
    }

    const newMoney = userPlayer.money - totalCost;
    const newShares = userPlayer.shares + shares;

    // 更新用户玩家状态
    setUserPlayer(prev => ({
      ...prev,
      money: newMoney,
      shares: newShares,
      currentPrice: currentPrice
    }));

    // 同步更新 players 对象
    setPlayers(prev => ({
      ...prev,
      user: {
        ...prev.user,
        money: newMoney,
        shares: newShares,
        currentPrice: currentPrice
      }
    }));

    // 添加交易记录
    setTransactions(prev => [...prev, {
      id: Date.now() + Math.random(),
      type: '买入',
      player: userPlayer.name || '玩家',
      action: '买入',
      price: currentPrice,
      shares: shares,
      time: new Date().toLocaleTimeString()
    }]);
  }, [userPlayer, currentPrice, setUserPlayer, setPlayers, setTransactions]);

  // 卖出股票
  const sellStock = useCallback((shares) => {
    if (!userPlayer || typeof userPlayer.money !== 'number' || typeof userPlayer.shares !== 'number') {
      console.warn('用户玩家数据无效');
      return;
    }

    if (userPlayer.shares < shares) {
      alert('持股不足!');
      return;
    }

    const totalRevenue = currentPrice * shares;
    const newMoney = userPlayer.money + totalRevenue;
    const newShares = userPlayer.shares - shares;

    // 更新用户玩家状态
    setUserPlayer(prev => ({
      ...prev,
      money: newMoney,
      shares: newShares,
      currentPrice: currentPrice
    }));

    // 同步更新 players 对象
    setPlayers(prev => ({
      ...prev,
      user: {
        ...prev.user,
        money: newMoney,
        shares: newShares,
        currentPrice: currentPrice
      }
    }));

    // 添加交易记录
    setTransactions(prev => [...prev, {
      id: Date.now() + Math.random(),
      type: '卖出',
      player: userPlayer.name || '玩家',
      action: '卖出',
      price: currentPrice,
      shares: shares,
      time: new Date().toLocaleTimeString()
    }]);
  }, [userPlayer, currentPrice, setUserPlayer, setPlayers, setTransactions]);

  // 挂单委托 - 修复：下单时冻结资金/股份
  const placeOrder = useCallback((orderType, orderPrice, orderShares) => {
    if (!userPlayer || typeof userPlayer.money !== 'number' || typeof userPlayer.shares !== 'number') {
      console.warn('用户玩家数据无效');
      return;
    }

    // 检查用户已有委托数量（买单最多3个，卖单最多3个）
    const userBuyOrders = orders.buy.filter(o => o.player === userPlayer.name).length;
    const userSellOrders = orders.sell.filter(o => o.player === userPlayer.name).length;
    if (orderType === 'buy' && userBuyOrders >= 3) {
      alert('买入委托已达上限(最多3个)，请先撤销现有委托！');
      return;
    }
    if (orderType === 'sell' && userSellOrders >= 3) {
      alert('卖出委托已达上限(最多3个)，请先撤销现有委托！');
      return;
    }

    // 【修改】验证委托价格范围（使用状态中的月初价格计算涨跌停）
    // 使用 toFixed(3) 避免浮点数精度问题
    const maxPrice = Number((monthStartPrice * 1.2).toFixed(3));  // 涨停价
    const minPrice = Number((monthStartPrice * 0.8).toFixed(3));  // 跌停价
    
    // 使用一个小的容差值来处理浮点数精度问题
    const epsilon = 0.0001;
    if (orderPrice > maxPrice + epsilon || orderPrice < minPrice - epsilon) {
      alert(`委托价格超出涨跌停范围！(¥${minPrice.toFixed(3)} - ¥${maxPrice.toFixed(3)})`);
      return;
    }

    // 计算需要冻结的资源
    let frozenMoney = 0;
    let frozenShares = 0;

    if (orderType === 'buy') {
      frozenMoney = orderPrice * orderShares;
      if (userPlayer.money < frozenMoney) {
        alert('资金不足!');
        return;
      }
    } else if (orderType === 'sell') {
      frozenShares = orderShares;
      if (userPlayer.shares < frozenShares) {
        alert('持股不足!');
        return;
      }
    }

    // 生成唯一订单编码
    const orderCode = `user_${orderType}_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    
    // 创建新订单，包含冻结信息
    const newOrder = {
      id: orderCode,
      code: orderCode,
      player: userPlayer.name || '玩家',
      price: Number(orderPrice),
      shares: orderShares,
      type: orderType,
      frozenMoney: frozenMoney,    // 冻结的资金
      frozenShares: frozenShares,  // 冻结的股份
      playerKey: 'user'            // 标记为用户订单
    };

    // 冻结用户资金或股份
    setUserPlayer(prev => ({
      ...prev,
      money: prev.money - frozenMoney,        // 立即扣除资金
      frozenMoney: (prev.frozenMoney || 0) + frozenMoney,  // 记录冻结金额
      shares: prev.shares - frozenShares,     // 立即扣除股份
      frozenShares: (prev.frozenShares || 0) + frozenShares // 记录冻结股份
    }));

    // 同步更新 players 对象
    setPlayers(prev => ({
      ...prev,
      user: {
        ...prev.user,
        money: prev.user.money - frozenMoney,
        frozenMoney: (prev.user.frozenMoney || 0) + frozenMoney,
        shares: prev.user.shares - frozenShares,
        frozenShares: (prev.user.frozenShares || 0) + frozenShares
      }
    }));

    // 添加到订单簿
    setOrders(prev => ({
      ...prev,
      [orderType]: [...prev[orderType], newOrder]
    }));

    // 添加交易记录
    setTransactions(prev => [...prev, {
      id: Date.now() + Math.random(),
      type: orderType === 'buy' ? '买入委托' : '卖出委托',
      player: userPlayer.name || '玩家',
      action: orderType === 'buy' ? '挂买单' : '挂卖单',
      price: orderPrice,
      shares: orderShares,
      time: new Date().toLocaleTimeString()
    }]);
  }, [userPlayer, currentPrice, setOrders, setTransactions, setUserPlayer, setPlayers, orders, priceHistory, monthStartPrice]);

  // 撤销委托 - 修复：撤销时返还冻结的资金/股份
  const cancelOrder = useCallback((orderType, orderId) => {
    // 查找要撤销的订单
    const orderToCancel = orders[orderType]?.find(order => order.id === orderId);
    
    if (!orderToCancel) {
      console.warn('找不到要撤销的订单:', orderId);
      return;
    }

    // 返还冻结的资源
    const frozenMoney = orderToCancel.frozenMoney || 0;
    const frozenShares = orderToCancel.frozenShares || 0;

    // 更新用户资金和股份
    setUserPlayer(prev => ({
      ...prev,
      money: prev.money + frozenMoney,          // 返还资金
      frozenMoney: Math.max(0, (prev.frozenMoney || 0) - frozenMoney),
      shares: prev.shares + frozenShares,       // 返还股份
      frozenShares: Math.max(0, (prev.frozenShares || 0) - frozenShares)
    }));

    // 同步更新 players 对象
    setPlayers(prev => ({
      ...prev,
      user: {
        ...prev.user,
        money: prev.user.money + frozenMoney,
        frozenMoney: Math.max(0, (prev.user.frozenMoney || 0) - frozenMoney),
        shares: prev.user.shares + frozenShares,
        frozenShares: Math.max(0, (prev.user.frozenShares || 0) - frozenShares)
      }
    }));

    // 从订单簿移除
    setOrders(prev => ({
      ...prev,
      [orderType]: prev[orderType].filter(order => order.id !== orderId)
    }));

    // 添加交易记录
    setTransactions(prev => [...prev, {
      id: Date.now() + Math.random(),
      type: '撤销委托',
      player: userPlayer?.name || '玩家',
      action: orderType === 'buy' ? '撤销买单' : '撤销卖单',
      price: orderToCancel.price,
      shares: orderToCancel.shares,
      time: new Date().toLocaleTimeString()
    }]);
  }, [userPlayer, setOrders, setTransactions, orders, setUserPlayer, setPlayers]);

  return {
    selectPlayer,
    updateUserPlayer,
    buyStock,
    sellStock,
    placeOrder,
    cancelOrder
  };
};
