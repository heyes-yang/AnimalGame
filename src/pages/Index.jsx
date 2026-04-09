import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useGameState } from '../hooks/useGameState';
import { usePriceFluctuation } from '../hooks/usePriceFluctuation';
import { useGameActions } from '../hooks/useGameActions';
import GameHeader from '../components/GameHeader';
import PriceChart from '../components/PriceChart';
import PlayerSelection from '../components/PlayerSelection';
import PlayerStatus from '../components/PlayerStatus';
import TradingPanel from '../components/TradingPanel';
import OrderBook from '../components/OrderBook';
import TransactionHistory from '../components/TransactionHistory';
import AnnualSummary, { generateAnnualSummaryData } from '../components/AnnualSummary';
import MyInfoModal from '../components/MyInfoModal';
import AnimalsModal from '../components/AnimalsModal';
import SeasonToast from '../components/SeasonToast';
import DreamCompanyModal from '../components/DreamCompanyModal';
import { ANIMAL_LIFECYCLE_CONFIG } from '../data/animalTemplates';

const Index = () => {
  const gameState = useGameState();
  const {
    gameTime,
    currentPrice,
    priceHistory,
    players,
    userPlayer,
    setUserPlayer,
    transactions,
    setTransactions,
    orders,
    gameStarted,
    isPaused,
    speedMode,
    monthlyWeather,
    chatMessages,
    setChatMessages,
    annualSummaries,
    setAnnualSummaries,
    donationPrivileges,
    setDonationPrivileges,
    workingPlayers,
    setWorkingPlayers,
    setPlayers,
    setGameStarted,
    resetGame,
    togglePause,
    cycleSpeedMode,
    dailyVolumes,
    monthStartPrice, // 【新增】月初价格
    dreamCompany, // 梦想公司状态
    setDreamCompany, // 设置梦想公司状态
    DREAM_COMPANY // 梦想公司配置
  } = gameState;

  const gameActions = useGameActions(gameState);
  const { selectPlayer, updateUserPlayer, buyStock, sellStock, placeOrder, cancelOrder } = gameActions;

  // 公告消息
  const [announcements, setAnnouncements] = useState([]);
  const lastTransactionCountRef = useRef(0);
  
  // 年度大会状态
  const [showAnnualSummary, setShowAnnualSummary] = useState(false);
  const [annualSummaryData, setAnnualSummaryData] = useState(null);
  const [isViewingHistory, setIsViewingHistory] = useState(false); // 是否在查看历史
  const lastYearRef = useRef(null);
  const processedYearsRef = useRef(new Set()); // 记录已处理的年份

  // 弹窗状态
  const [showMyInfo, setShowMyInfo] = useState(false);
  const [showAnimals, setShowAnimals] = useState(false);
  const [showDreamCompany, setShowDreamCompany] = useState(false); // 梦想公司弹窗

  // 季节天气提示状态
  const [seasonToast, setSeasonToast] = useState({
    isVisible: false,
    year: 1,
    month: 1,
    season: 'spring',
    weather: 'sunny'
  });
  const lastSeasonKeyRef = useRef(null);

  // 用户打工函数 - 【修改】duration 现在是天数而不是月份
  const handleGoToWork = useCallback((durationDays, salary) => {
    if (!gameTime) return;
    
    // 计算打工结束日期（按天数）
    const untilDate = new Date(gameTime);
    untilDate.setDate(untilDate.getDate() + durationDays);
    
    // 设置打工状态
    setWorkingPlayers(prev => ({
      ...prev,
      user: {
        untilDate: untilDate.toISOString(),
        salary: salary,
        startDate: gameTime.toISOString(),
        durationDays: durationDays
      }
    }));

    // 更新用户玩家状态
    setUserPlayer(prev => ({
      ...prev,
      workingUntil: untilDate.toISOString()
    }));

    // 更新 players 对象
    setPlayers(prev => ({
      ...prev,
      user: {
        ...prev.user,
        workingUntil: untilDate.toISOString()
      }
    }));

    // 添加交易记录
    setTransactions(prev => [...prev, {
      id: Date.now() + Math.random(),
      type: '开始打工',
      player: userPlayer?.name || '玩家',
      action: `外出打工${durationDays}天`,
      price: salary,
      shares: 0,
      time: new Date().toLocaleTimeString()
    }]);

    // 添加公告
    const announcement = `💼 【外出打工】${userPlayer?.name || '玩家'}: 我要出去打工${durationDays}天啦！预计薪资 ¥${salary}`;
    setAnnouncements(prev => [announcement, ...prev.slice(0, 9)]);
  }, [gameTime, setWorkingPlayers, setUserPlayer, setPlayers, setTransactions, userPlayer]);

  // 打开年度大会查看历史
  const handleOpenAnnualSummary = useCallback(() => {
    const currentYear = gameTime?.getFullYear() || 2000;
    
    if (annualSummaries.length > 0) {
      // 显示最近一年的年度大会
      const lastSummary = annualSummaries[annualSummaries.length - 1];
      setAnnualSummaryData(lastSummary);
      setIsViewingHistory(true);
      setShowAnnualSummary(true);
    } else {
      // 第一年：显示初始状态的数据（数据归零）
      const initialSummaryData = {
        year: currentYear - 1, // 显示上一年度（虽然还没过完）
        stats: {
          startPrice: currentPrice,
          endPrice: currentPrice,
          priceChange: 0,
          playerStats: Object.entries(players).map(([key, player]) => ({
            key,
            name: player.name,
            icon: player.icon,
            money: player.money,
            shares: player.shares,
            totalValue: player.money + (player.shares * currentPrice),
            initialValue: player.money + (player.shares * currentPrice),
            profit: 0,
            profitRate: 0,
            rank: 1,
            isUser: userPlayer?.name === player.name
          })).sort((a, b) => b.totalValue - a.totalValue),
          bestPlayer: null,
        },
        donations: [],
        isFirstYear: true // 标记为第一年
      };
      // 重新计算排名
      initialSummaryData.stats.playerStats.forEach((player, index) => {
        player.rank = index + 1;
      });
      if (initialSummaryData.stats.playerStats.length > 0) {
        initialSummaryData.stats.bestPlayer = initialSummaryData.stats.playerStats[0];
      }
      
      setAnnualSummaryData(initialSummaryData);
      setIsViewingHistory(false);
      setShowAnnualSummary(true);
    }
  }, [annualSummaries, gameTime, players, currentPrice, userPlayer]);

  // 关闭年度大会时重置状态并自动取消暂停
  const handleCloseAnnualSummary = useCallback(() => {
    setShowAnnualSummary(false);
    setIsViewingHistory(false);
    
    // 【新增】年度大会结束后自动取消暂停，继续游戏
    if (isPaused) {
      togglePause();
      console.log('▶️ 年度大会结束，自动取消暂停，游戏继续');
    }
  }, [isPaused, togglePause]);

  // 处理公司交易回调
  const handleCompanyTrade = useCallback((direction, price, shares, participants) => {
    console.log(`🏛️ 执行公司交易: ${direction} ${shares}股 @ ¥${price}`);
    
    // 更新梦想公司状态
    setDreamCompany(prev => {
      const tradeAmount = price * shares;
      const newShares = direction === 'buy' 
        ? prev.shares - shares // 回购：公司股份减少
        : prev.shares + shares; // 发行：公司股份增加
      const newMoney = direction === 'buy'
        ? prev.money - tradeAmount // 回购：公司花钱
        : prev.money + tradeAmount; // 发行：公司收钱
      const newYearlyProfit = direction === 'buy'
        ? prev.yearlyProfit - tradeAmount
        : prev.yearlyProfit + tradeAmount;
      const newYearlyBuyAmount = direction === 'buy' 
        ? prev.yearlyBuyAmount + tradeAmount 
        : prev.yearlyBuyAmount;
      const newYearlySellAmount = direction === 'sell' 
        ? prev.yearlySellAmount + tradeAmount 
        : prev.yearlySellAmount;
      
      return {
        ...prev,
        shares: newShares,
        money: newMoney,
        yearlyProfit: newYearlyProfit,
        totalTradedShares: prev.totalTradedShares + shares,
        yearlyBuyAmount: newYearlyBuyAmount,
        yearlySellAmount: newYearlySellAmount
      };
    });
    
    // 更新参与者资产
    setPlayers(prev => {
      const updated = { ...prev };
      
      if (direction === 'buy') {
        // 公司回购：参与者卖出股份
        let remainingShares = shares;
        participants.forEach(p => {
          if (remainingShares <= 0) return;
          const playerKey = p.key;
          const tradeShares = Math.min(p.shares, remainingShares);
          const revenue = price * tradeShares;
          
          if (updated[playerKey]) {
            updated[playerKey] = {
              ...updated[playerKey],
              shares: updated[playerKey].shares - tradeShares,
              money: updated[playerKey].money + revenue
            };
            remainingShares -= tradeShares;
            console.log(`  📤 ${updated[playerKey].name}: 卖出${tradeShares}股，收入¥${revenue.toFixed(2)}`);
          }
        });
      } else {
        // 公司发行：参与者买入股份
        let remainingShares = shares;
        participants.forEach(p => {
          if (remainingShares <= 0) return;
          const playerKey = p.key;
          const cost = price * p.shares;
          
          if (updated[playerKey] && updated[playerKey].money >= cost) {
            updated[playerKey] = {
              ...updated[playerKey],
              shares: updated[playerKey].shares + p.shares,
              money: updated[playerKey].money - cost
            };
            remainingShares -= p.shares;
            console.log(`  📥 ${updated[playerKey].name}: 买入${p.shares}股，支出¥${cost.toFixed(2)}`);
          }
        });
      }
      
      return updated;
    });
    
    // 同步更新用户玩家
    if (userPlayer && participants.find(p => p.key === 'user')) {
      const userP = participants.find(p => p.key === 'user');
      setUserPlayer(prev => {
        if (direction === 'buy') {
          const revenue = price * userP.shares;
          return {
            ...prev,
            shares: prev.shares - userP.shares,
            money: prev.money + revenue
          };
        } else {
          const cost = price * userP.shares;
          return {
            ...prev,
            shares: prev.shares + userP.shares,
            money: prev.money - cost
          };
        }
      });
    }
    
    // 添加交易记录
    setTransactions(prev => [...prev, {
      id: Date.now() + Math.random(),
      type: '公司交易',
      player: '森林梦想公司',
      action: direction === 'buy' ? `回购${shares}股` : `发行${shares}股`,
      price: price,
      shares: shares,
      time: new Date().toLocaleTimeString()
    }]);
    
    console.log(`✅ 公司交易完成`);
  }, [setDreamCompany, setPlayers, setUserPlayer, setTransactions, userPlayer]);

  // 启动价格波动逻辑
  usePriceFluctuation(gameState);

  // 当用户选择角色后自动开始游戏，并初始化梦想公司股份
  useEffect(() => {
    if (userPlayer && !gameStarted) {
      setGameStarted(true);
      
      // 【新增】初始化梦想公司股份 - 计算剩余股份
      const companyShares = calculateCompanyShares(players);
      setDreamCompany(prev => ({
        ...prev,
        shares: companyShares,
        initialized: true
      }));
      console.log(`🏛️ 游戏开始，梦想公司持有 ${companyShares} 股`);
    }
  }, [userPlayer, gameStarted, setGameStarted, players, setDreamCompany]);

  // 计算公司剩余股份的函数
  const calculateCompanyShares = (currentPlayers) => {
    let totalPlayerShares = 0;
    Object.entries(currentPlayers).forEach(([key, player]) => {
      if (player && typeof player.shares === 'number') {
        totalPlayerShares += player.shares + (player.frozenShares || 0);
      }
    });
    return Math.max(0, 1000000 - totalPlayerShares);
  };

  // 当游戏重置时，清空公告栏和其他本地状态
  useEffect(() => {
    if (!gameStarted && !userPlayer) {
      setAnnouncements([]);
      setShowAnnualSummary(false);
      setAnnualSummaryData(null);
      setIsViewingHistory(false);
      processedYearsRef.current = new Set();
      lastYearRef.current = null;
      lastTransactionCountRef.current = 0;
    }
  }, [gameStarted, userPlayer]);

  // 检查游戏失败条件 - 【修改】资金不足不退出游戏，而是只能打工
  const lowMoneyAlertedRef = useRef(false);
  
  useEffect(() => {
    if (userPlayer && typeof userPlayer.money === 'number' && userPlayer.money < ANIMAL_LIFECYCLE_CONFIG.leaveConditions.minMoney) {
      // 检查用户是否已经在打工中
      const isUserWorking = workingPlayers && workingPlayers.user;
      
      if (!isUserWorking && !lowMoneyAlertedRef.current) {
        lowMoneyAlertedRef.current = true;
        alert(`⚠️ 资金不足！\n你的资金已低于¥${ANIMAL_LIFECYCLE_CONFIG.leaveConditions.minMoney}，无法进行交易。\n\n请点击"外出打工"按钮赚取薪资！`);
      }
    } else if (userPlayer && userPlayer.money >= ANIMAL_LIFECYCLE_CONFIG.leaveConditions.minMoney) {
      lowMoneyAlertedRef.current = false;
    }
  }, [userPlayer, workingPlayers]);

  // 检测年度大会触发（每年1月1日）
  useEffect(() => {
    if (!gameTime || !gameStarted) return;
    
    const year = gameTime.getFullYear();
    const month = gameTime.getMonth();
    const day = gameTime.getDate();
    
    // 只在1月1日触发，且当年还未处理过
    if (month === 0 && day === 1 && !processedYearsRef.current.has(year)) {
      processedYearsRef.current.add(year);
      
      // 【新增】年度大会开始时暂停游戏
      if (!isPaused) {
        togglePause();
      }
      
      // 生成上一年度的总结数据
      const lastYear = year - 1;
      const summaryData = generateAnnualSummaryData(
        lastYear,
        players,
        priceHistory,
        currentPrice,
        userPlayer
      );
      
      setAnnualSummaryData(summaryData);
      setShowAnnualSummary(true);
      
      // 保存年度总结到历史记录
      setAnnualSummaries(prev => [...prev.filter(s => s.year !== lastYear), summaryData]);
      
      // 处理捐款 - 扣除捐款金额
      if (summaryData.donations && summaryData.donations.length > 0) {
        setPlayers(prev => {
          const updated = { ...prev };
          summaryData.donations.forEach(donation => {
            const playerKey = Object.keys(updated).find(key => updated[key]?.name === donation.name);
            if (playerKey && updated[playerKey]) {
              updated[playerKey] = {
                ...updated[playerKey],
                money: updated[playerKey].money - donation.donation
              };
            }
          });
          return updated;
        });
        
        // 设置捐款特权（4个月的公告头条）
        const newPrivileges = summaryData.donations.map(d => ({
          playerName: d.name,
          startYear: year,
          startMonth: 0, // 1月
          endYear: year,
          endMonth: 3 // 4月
        }));
        setDonationPrivileges(prev => [...prev, ...newPrivileges]);
      }
      
      console.log(`🎉 触发年度大会: ${lastYear}年度，游戏已暂停`);
    }
  }, [gameTime, gameStarted, isPaused, players, priceHistory, currentPrice, userPlayer, setAnnualSummaries, setDonationPrivileges, togglePause]);

  // 检测季节变化并显示提示
  useEffect(() => {
    if (!gameTime || !gameStarted) return;

    const month = gameTime.getMonth();
    const year = gameTime.getFullYear() - 1999; // 从1年开始计算
    const monthKey = `${gameTime.getFullYear()}-${month}`;
    
    // 根据月份确定季节
    let season = 'winter';
    if (month >= 2 && month <= 4) season = 'spring';
    else if (month >= 5 && month <= 7) season = 'summer';
    else if (month >= 8 && month <= 10) season = 'autumn';
    
    // 获取当前天气
    const weather = monthlyWeather[monthKey] || 'sunny';
    
    // 检测季节变化 - 只有当季节确实改变且当前没有显示提示时才触发
    if (lastSeasonKeyRef.current && lastSeasonKeyRef.current !== season && !seasonToast.isVisible) {
      setSeasonToast({
        isVisible: true,
        year,
        month: month + 1,
        season,
        weather
      });
      console.log(`🌸 季节变化: ${season}, 天气: ${weather}`);
    }
    
    // 更新上一次的季节（只在季节真正改变时更新）
    if (lastSeasonKeyRef.current !== season) {
      lastSeasonKeyRef.current = season;
    }
  }, [gameTime, gameStarted, monthlyWeather, seasonToast.isVisible]);

  // 监控大额委托订单并生成公告（注意：是委托，不是成交）
  const lastOrderCountRef = useRef({ buy: 0, sell: 0 });
  
  useEffect(() => {
    if (!orders || (!orders.buy?.length && !orders.sell?.length)) return;
    
    // 只处理新增的订单（委托）
    const newBuyOrders = orders.buy.slice(lastOrderCountRef.current.buy);
    const newSellOrders = orders.sell.slice(lastOrderCountRef.current.sell);
    
    lastOrderCountRef.current = { 
      buy: orders.buy.length, 
      sell: orders.sell.length 
    };
    
    // 检查新买单
    newBuyOrders.forEach(order => {
      // 大额委托公告（超过1000股）
      if (order.shares >= 1000) {
        const announcement = `💰 【大单委托】${order.player} 申请买入 ${order.shares}股，委托价 ¥${order.price.toFixed(3)}（待撮合）`;
        setAnnouncements(prev => [announcement, ...prev.slice(0, 9)]);
      }
      
      // 庄家虎的大额买单
      if (order.player?.includes('庄家虎') && order.shares >= 800) {
        const announcement = `🐯 【庄家动向】庄家虎提交买入委托 ${order.shares}股，委托价 ¥${order.price.toFixed(3)}`;
        setAnnouncements(prev => [announcement, ...prev.slice(0, 9)]);
      }
      
      // 神秘牛的大额买单
      if (order.player?.includes('神秘牛') && order.shares >= 800) {
        const announcement = `🐮 【神秘信号】神秘牛提交买入委托 ${order.shares}股，等待撮合`;
        setAnnouncements(prev => [announcement, ...prev.slice(0, 9)]);
      }
    });
    
    // 检查新卖单
    newSellOrders.forEach(order => {
      // 大额委托公告（超过1000股）
      if (order.shares >= 1000) {
        const announcement = `💰 【大单委托】${order.player} 申请卖出 ${order.shares}股，委托价 ¥${order.price.toFixed(3)}（待撮合）`;
        setAnnouncements(prev => [announcement, ...prev.slice(0, 9)]);
      }
      
      // 庄家虎的大额卖单
      if (order.player?.includes('庄家虎') && order.shares >= 800) {
        const announcement = `🐯 【庄家动向】庄家虎提交卖出委托 ${order.shares}股，委托价 ¥${order.price.toFixed(3)}`;
        setAnnouncements(prev => [announcement, ...prev.slice(0, 9)]);
      }
      
      // 神秘牛的大额卖单
      if (order.player?.includes('神秘牛') && order.shares >= 800) {
        const announcement = `🐮 【神秘信号】神秘牛提交卖出委托 ${order.shares}股，等待撮合`;
        setAnnouncements(prev => [announcement, ...prev.slice(0, 9)]);
      }
    });
  }, [orders]);

  // 游戏初始时间（用于股价图）
  const startTime = new Date(2000, 2, 1);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-1 sm:p-2">
      <div className="max-w-7xl mx-auto">
        <GameHeader 
          gameTime={gameTime} 
          onReset={resetGame}
          isPaused={isPaused}
          speedMode={speedMode}
          onTogglePause={togglePause}
          onCycleSpeed={cycleSpeedMode}
          monthlyWeather={monthlyWeather}
          announcements={announcements}
          annualSummaries={annualSummaries}
          onOpenAnnualSummary={handleOpenAnnualSummary}
          onOpenMyInfo={() => setShowMyInfo(true)}
          onOpenAnimals={() => setShowAnimals(true)}
          onOpenDreamCompany={() => setShowDreamCompany(true)}
        />
        
        {!userPlayer && (
          <PlayerSelection 
            players={players}
            onSelectPlayer={selectPlayer}
            userPlayer={userPlayer}
          />
        )}
        
        {userPlayer && (
          <>
            {/* 股价走势图和订单簿同一行 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 mb-2">
              <PriceChart 
                priceHistory={priceHistory}
                currentPrice={currentPrice}
                startTime={startTime}
                dailyVolumes={dailyVolumes}
                gameTime={gameTime}
              />
              <OrderBook orders={orders} />
            </div>
            
            {/* 交易面板、聊天室/交易记录同一行 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 mb-2">
              <TradingPanel
                userPlayer={userPlayer}
                currentPrice={currentPrice}
                onPlaceOrder={placeOrder}
                onCancelOrder={cancelOrder}
                orders={orders}
                onGoToWork={handleGoToWork}
                workingPlayers={workingPlayers}
                gameTime={gameTime}
                isPaused={isPaused}
                priceHistory={priceHistory}
                monthStartPrice={monthStartPrice}
              />
              <TransactionHistory transactions={transactions} chatMessages={chatMessages} />
            </div>
            
            {/* 动物状态 */}
            <PlayerStatus 
              players={players}
              userPlayer={userPlayer}
              onUpdateUserPlayer={updateUserPlayer}
              currentPrice={currentPrice}
              gameTime={gameTime}
              workingPlayers={workingPlayers}
              animalStatus={gameState.animalStatus}
            />
          </>
        )}
      </div>
      
      {/* 年度大会弹窗 */}
      <AnnualSummary
        isOpen={showAnnualSummary}
        onClose={handleCloseAnnualSummary}
        summaryData={annualSummaryData}
        historicalSummaries={annualSummaries}
        isViewingHistory={isViewingHistory}
        dreamCompany={dreamCompany}
        currentPrice={currentPrice}
        onCompanyTrade={handleCompanyTrade}
      />

      {/* 我的资产弹窗 */}
      <MyInfoModal
        isOpen={showMyInfo}
        onClose={() => setShowMyInfo(false)}
        userPlayer={userPlayer}
        currentPrice={currentPrice}
        priceHistory={priceHistory}
      />

      {/* 动物排行榜弹窗 */}
      <AnimalsModal
        isOpen={showAnimals}
        onClose={() => setShowAnimals(false)}
        players={players}
        currentPrice={currentPrice}
        userPlayer={userPlayer}
      />

      {/* 季节天气提示 */}
      <SeasonToast
        isVisible={seasonToast.isVisible}
        year={seasonToast.year}
        month={seasonToast.month}
        season={seasonToast.season}
        weather={seasonToast.weather}
        onClose={() => setSeasonToast(prev => ({ ...prev, isVisible: false }))}
      />

      {/* 梦想公司弹窗 */}
      <DreamCompanyModal
        isOpen={showDreamCompany}
        onClose={() => setShowDreamCompany(false)}
        dreamCompany={dreamCompany}
        currentPrice={currentPrice}
        DREAM_COMPANY={DREAM_COMPANY}
      />
    </div>
  );
};

export default Index;
