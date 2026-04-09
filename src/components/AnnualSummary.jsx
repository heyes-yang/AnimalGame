import React, { useState, useEffect } from 'react';

// 年度大会主持人发言
const HOST_SPEECH = {
  opening: (year) => `🦁 狮王致辞：各位森林居民，欢迎来到第 ${year} 届森林年度大会！在这一年里，我们一起经历了股市的风风雨雨，现在让我们共同回顾这一年的精彩时刻！`,
  donation: (players, totalAmount) => `🦁 狮王致辞：让我们为${players}的善举鼓掌！共捐款 ¥${totalAmount} 给幼鸟保护基金会！作为回报，他们将获得未来4个月的公告头条播报特权！`,
  companyTrade: (direction, shares, price) => `🦁 狮王致辞：森林梦想公司宣布将以 ¥${price.toFixed(3)} 的价格${direction === 'buy' ? '回购' : '发行'} ${shares} 股股份！所有持股的居民都可以参与交易！`,
  closing: (year) => `🦁 狮王致辞：感谢各位的参与！第 ${year} 年度的森林大会到此结束。让我们带着这一年的经验与收获，迎接新的挑战！愿森林市场繁荣昌盛！`,
};

// 动物年度发言模板
const ANIMAL_ANNUAL_SPEECH = {
  cat: {
    profit: ["喵喵~ 这一年过得还不错，小赚了一笔！", "呼噜~ 今年的行情还算给力~"],
    loss: ["喵呜... 这一年太难了...", "喵... 明年会更好的~"],
    neutral: ["喵~ 这一年波澜不惊~", "呼噜~ 平稳也是好事~"],
    donation: ["喵~ 我也要为小鸟们做点贡献！", "喵喵~ 希望小鸟们健康成长！"]
  },
  dog: {
    profit: ["汪汪~ 今年的投资策略很成功！", "汪~ 账户终于增长了！"],
    loss: ["汪呜... 继续努力！", "汪~ 明年一定行！"],
    neutral: ["汪汪~ 这一年平稳度过~", "汪~ 稳健投资是王道~"],
    donation: ["汪汪~ 帮助小鸟们是我的荣幸！", "汪~ 爱心是森林最珍贵的财富！"]
  },
  bear: {
    profit: ["吼吼~ 今年收获颇丰！", "吼~ 大户的实力展现~"],
    loss: ["吼... 即使是大户也会遇到困难...", "吼吼~ 明年会回来的~"],
    neutral: ["吼~ 保持现状也是一种策略~", "吼吼~ 平稳发展~"],
    donation: ["吼吼~ 大户要有大户的担当！", "吼~ 支持小鸟们茁壮成长！"]
  },
  fox: {
    profit: ["嘻嘻~ 快进快出的策略太成功了！", "嘿嘿~ 今年赚得盆满钵满~"],
    loss: ["呜呜... 投机失败了几次...", "嘿嘿... 明年再战！"],
    neutral: ["嘻嘻~ 学到很多经验~", "嘿嘿~ 市场平静，机会更多~"],
    donation: ["嘻嘻~ 赚的钱也要回馈社会！", "嘿嘿~ 小鸟们很可爱~"]
  },
  tiger: {
    profit: ["嗷~ 庄家今年成功控制了市场节奏！", "嗷嗷~ 丰收的一年~"],
    loss: ["嗷... 市场有时候也会失控...", "嗷嗷~ 庄家也会反思~"],
    neutral: ["嗷~ 稳坐庄家之位~", "嗷嗷~ 控盘稳健~"],
    donation: ["嗷~ 庄家也要回馈森林！", "嗷嗷~ 领袖要以身作则！"]
  },
  rabbit: {
    profit: ["蹦蹦~ 量化策略完美执行！", "跳跳~ 算法收益可观~"],
    loss: ["蹦蹦... 算法有时候会失灵...", "跳跳~ 模型需要优化~"],
    neutral: ["蹦蹦~ 算法运行稳定~", "跳跳~ 高频交易正常~"],
    donation: ["蹦蹦~ 量化也要有爱心！", "跳跳~ 帮助他人提升幸福感！"]
  },
  cow: {
    profit: ["哞~ ............命运眷顾............", "哞哞~ 神秘的力量带来丰收..."],
    loss: ["哞... ............命运如此............", "哞哞~ 失去也是获得..."],
    neutral: ["哞~ ............平静的圆满............", "哞哞~ 命运平稳转动..."],
    donation: ["哞~ ............小鸟需要保护............", "哞哞~ 这是命运的安排..."]
  }
};

// 动物节目表演
const ANIMAL_PERFORMANCES = {
  cat: { name: "猫咪理财小课堂", icon: "🐱", content: "喵喵~ 小散户最重要的是分散投资！" },
  dog: { name: "稳健投资之歌", icon: "🐶", content: "汪汪~ 不急不躁不跟风，理性投资最光荣！" },
  bear: { name: "大户的力量", icon: "🐻", content: "吼吼~ 能力越大，责任越大！" },
  fox: { name: "投机者说", icon: "🦊", content: "嘻嘻~ 投机不是赌博！快进快出才是生存之道！" },
  tiger: { name: "庄家的秘密", icon: "🐯", content: "嗷~ 庄家不是万能的，但了解市场情绪很重要！" },
  rabbit: { name: "算法展示", icon: "🐰", content: "蹦蹦~ 数据驱动，理性决策，让投资变成科学！" },
  cow: { name: "神秘预言", icon: "🐮", content: "哞~ ............一切都在命运之中............" }
};

// 获取动物年度发言
const getAnimalSpeech = (animalKey, profitRate, type = 'speech') => {
  const speeches = ANIMAL_ANNUAL_SPEECH[animalKey] || ANIMAL_ANNUAL_SPEECH.cat;
  let category = 'neutral';
  if (profitRate > 5) category = 'profit';
  else if (profitRate < -5) category = 'loss';
  
  if (type === 'donation') {
    const donationSpeeches = speeches.donation || speeches.profit;
    return donationSpeeches[Math.floor(Math.random() * donationSpeeches.length)];
  }
  return speeches[category][Math.floor(Math.random() * speeches[category].length)];
};

// 获取排名奖杯
const getRankTrophy = (rank) => {
  switch (rank) {
    case 1: return '🏆';
    case 2: return '🥈';
    case 3: return '🥉';
    default: return '';
  }
};

// 计算公司交易价格（当前价格波动2%）
const calculateCompanyTradePrice = (currentPrice, direction) => {
  const fluctuation = (Math.random() * 0.04 - 0.02); // -2% 到 +2%
  const tradePrice = currentPrice * (1 + fluctuation);
  return Number(tradePrice.toFixed(3));
};

// 计算捐款金额
const calculateDonation = (profit) => {
  if (profit <= 0) return 0;
  return Math.min(5000, Math.max(100, Math.floor(profit * 0.1)));
};

// 生成年度总结数据
export const generateAnnualSummaryData = (year, players, priceHistory, currentPrice, userPlayer) => {
  const startPriceIndex = Math.max(0, priceHistory.length - 365);
  const startPrice = priceHistory[startPriceIndex] || priceHistory[0];
  const endPrice = currentPrice;
  const priceChange = ((endPrice - startPrice) / startPrice * 100);
  
  const playerStats = Object.entries(players).map(([key, player]) => {
    const totalValue = player.money + (player.shares * currentPrice);
    const initialValue = player.initialMoney + (player.initialShares * player.initialPrice);
    const profit = totalValue - initialValue;
    const profitRate = (profit / initialValue * 100);
    
    return {
      key,
      name: player.name,
      icon: player.icon,
      money: player.money,
      shares: player.shares,
      totalValue,
      initialValue,
      profit,
      profitRate,
      isUser: userPlayer?.name === player.name
    };
  }).sort((a, b) => b.profit - a.profit);
  
  playerStats.forEach((player, index) => {
    player.rank = index + 1;
  });
  
  const profitablePlayers = playerStats.filter(p => p.profit > 0).slice(0, 3);
  
  const donations = profitablePlayers.map(player => ({
    ...player,
    donation: calculateDonation(player.profit),
    speech: getAnimalSpeech(player.key, player.profitRate, 'donation')
  })).filter(d => d.donation > 0);
  
  return {
    year,
    stats: {
      startPrice,
      endPrice,
      priceChange,
      playerStats,
      bestPlayer: playerStats[0],
    },
    donations
  };
};

const AnnualSummary = ({ 
  isOpen, 
  onClose, 
  summaryData,
  historicalSummaries = [],
  onDonation,
  isViewingHistory: initialViewingHistory = false, // 外部传入的初始历史查看状态
  dreamCompany, // 梦想公司状态
  currentPrice, // 当前股价
  onCompanyTrade // 公司交易回调 (direction, price, shares, participants) => void
}) => {
  const [currentSection, setCurrentSection] = useState(0);
  const [viewingHistory, setViewingHistory] = useState(false);
  const [selectedHistoryYear, setSelectedHistoryYear] = useState(null);
  
  // 公司交易状态
  const [companyTradeDirection, setCompanyTradeDirection] = useState('buy'); // buy 或 sell
  const [companyTradePrice, setCompanyTradePrice] = useState(0);
  const [companyTradeShares, setCompanyTradeShares] = useState(0);
  const [companyTradeParticipants, setCompanyTradeParticipants] = useState([]);
  const [companyTradeCompleted, setCompanyTradeCompleted] = useState(false);
  
  useEffect(() => {
    if (isOpen) {
      setCurrentSection(0);
      setCompanyTradeCompleted(false);
      setCompanyTradeParticipants([]);
      
      // 初始化公司交易参数
      if (currentPrice && dreamCompany && !initialViewingHistory) {
        // 随机决定买入或卖出
        const direction = Math.random() > 0.5 ? 'buy' : 'sell';
        const price = calculateCompanyTradePrice(currentPrice, direction);
        const maxShares = direction === 'buy' 
          ? Math.min(50000, dreamCompany.shares) // 买入时，公司最多回购5万股
          : 50000; // 卖出时，公司最多发行5万股
        const shares = Math.floor(Math.random() * (maxShares - 5000) + 5000); // 5000-50000股
        
        setCompanyTradeDirection(direction);
        setCompanyTradePrice(price);
        setCompanyTradeShares(shares);
        console.log(`🏛️ 年度大会公司交易: ${direction === 'buy' ? '回购' : '发行'} ${shares}股 @ ¥${price}`);
      }
      
      // 如果是外部传入的历史查看模式，设置为历史模式
      if (initialViewingHistory && historicalSummaries.length > 0) {
        setViewingHistory(true);
        setSelectedHistoryYear(historicalSummaries[historicalSummaries.length - 1]?.year);
      } else {
        setViewingHistory(false);
        setSelectedHistoryYear(null);
      }
    }
  }, [isOpen, initialViewingHistory, historicalSummaries, currentPrice, dreamCompany]);
  
  const displayData = viewingHistory 
    ? historicalSummaries.find(h => h.year === selectedHistoryYear)
    : summaryData;
  
  if (!isOpen || !displayData) return null;
  
  const { year, stats, donations } = displayData;
  
  const sections = [
    { id: 'opening', title: '大会开幕', icon: '🎪' },
    { id: 'market', title: '市场回顾', icon: '📈' },
    { id: 'companyTrade', title: '公司交易', icon: '🏛️' },
    { id: 'ranking', title: '财富排行', icon: '🏅' },
    { id: 'donation', title: '慈善捐款', icon: '💝' },
    { id: 'speech', title: '代表发言', icon: '🎤' },
    { id: 'performance', title: '精彩节目', icon: '🎭' },
    { id: 'closing', title: '大会闭幕', icon: '🎉' },
  ];
  
  const renderSection = () => {
    switch (sections[currentSection].id) {
      case 'opening':
        return (
          <div className="text-center space-y-3 animate-fade-in">
            <div className="text-4xl">🎪</div>
            <h2 className="text-xl font-bold text-yellow-600">森林年度大会</h2>
            <div className="text-2xl font-bold text-amber-500">第 {year} 年度</div>
            {displayData.isFirstYear && (
              <div className="inline-block bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs">
                🌱 初始状态
              </div>
            )}
            {viewingHistory && !displayData.isFirstYear && (
              <div className="inline-block bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs">
                📜 历史记录
              </div>
            )}
            <div className="bg-amber-50 rounded-lg p-3 border border-amber-200">
              <div className="text-3xl mb-2">🦁</div>
              <h3 className="text-base font-bold text-amber-700 mb-1">狮王致辞</h3>
              {displayData.isFirstYear ? (
                <p className="text-gray-700 leading-relaxed text-xs">🦁 狮王致辞：各位森林居民，欢迎来到森林股市！新的一年即将开始，让我们共同期待这一年的精彩时刻！</p>
              ) : (
                <p className="text-gray-700 leading-relaxed text-xs">{HOST_SPEECH.opening(year)}</p>
              )}
            </div>
            <div className="text-xs text-gray-500">🌲 森林里所有的动物都已聚集在此 🌲</div>
          </div>
        );
        
      case 'market':
        return (
          <div className="space-y-3 animate-fade-in">
            <h2 className="text-base font-bold text-center text-gray-700">📊 {year} 年度市场回顾</h2>
            {displayData.isFirstYear ? (
              <div className="text-center py-4">
                <div className="text-4xl mb-2">🌱</div>
                <div className="text-gray-600 text-sm">新的一年刚刚开始</div>
                <div className="text-gray-500 text-xs mt-1">尚无市场数据可供回顾</div>
                <div className="mt-3 bg-blue-50 rounded-lg p-2 border border-blue-200">
                  <div className="text-xs text-blue-600">当前股价</div>
                  <div className="text-lg font-bold text-blue-700">¥{stats.endPrice?.toFixed(3) || '-'}</div>
                </div>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-blue-50 rounded-lg p-2 border border-blue-200">
                    <div className="text-xs text-blue-600">年初股价</div>
                    <div className="text-lg font-bold text-blue-700">¥{stats.startPrice?.toFixed(3) || '-'}</div>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-2 border border-purple-200">
                    <div className="text-xs text-purple-600">年末股价</div>
                    <div className="text-lg font-bold text-purple-700">¥{stats.endPrice?.toFixed(3) || '-'}</div>
                  </div>
                </div>
                <div className={`rounded-lg p-3 border ${stats.priceChange >= 0 ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'}`}>
                  <div className="text-center">
                    <div className="text-xs text-gray-600 mb-1">年度涨跌幅</div>
                    <div className={`text-2xl font-bold ${stats.priceChange >= 0 ? 'text-red-600' : 'text-green-600'}`}>
                      {stats.priceChange >= 0 ? '📈' : '📉'} {stats.priceChange >= 0 ? '+' : ''}{stats.priceChange?.toFixed(2)}%
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {stats.priceChange >= 0 ? '🎊 市场整体向好！' : '🌧️ 市场经历了调整期'}
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-2 border border-gray-200">
                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div><div className="font-bold text-gray-700">{stats.playerStats?.length || 0}</div><div className="text-gray-500">参与者</div></div>
                    <div><div className="font-bold text-red-600">{stats.playerStats?.filter(p => p.profit > 0).length || 0}</div><div className="text-gray-500">盈利</div></div>
                    <div><div className="font-bold text-green-600">{stats.playerStats?.filter(p => p.profit < 0).length || 0}</div><div className="text-gray-500">亏损</div></div>
                  </div>
                </div>
              </>
            )}
          </div>
        );
        
      case 'companyTrade':
        return (
          <div className="space-y-3 animate-fade-in">
            <h2 className="text-base font-bold text-center text-gray-700">🏛️ 森林梦想公司交易</h2>
            {displayData.isFirstYear ? (
              <div className="text-center py-4">
                <div className="text-4xl mb-2">🌱</div>
                <div className="text-gray-600 text-sm">新的一年刚刚开始</div>
                <div className="text-gray-500 text-xs mt-1">公司暂无交易计划</div>
              </div>
            ) : (
              <>
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-3 border border-indigo-200">
                  <div className="text-center">
                    <div className="text-3xl mb-2">🏛️</div>
                    <h3 className="font-bold text-indigo-700 text-sm">森林梦想公司</h3>
                    <div className="text-xs text-gray-600 mt-1">
                      公司持有 <span className="font-bold text-indigo-600">{(dreamCompany?.shares || 0).toLocaleString()}</span> 股
                    </div>
                  </div>
                </div>
                
                <div className="bg-amber-50 rounded-lg p-2 border border-amber-200">
                  <div className="text-xs text-amber-700 mb-1">📢 交易公告</div>
                  <p className="text-xs text-gray-700 leading-relaxed">
                    {HOST_SPEECH.companyTrade(companyTradeDirection, companyTradeShares, companyTradePrice)}
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-blue-50 rounded-lg p-2 border border-blue-200 text-center">
                    <div className="text-xs text-blue-600">交易价格</div>
                    <div className="text-lg font-bold text-blue-700">¥{companyTradePrice.toFixed(3)}</div>
                    <div className="text-xs text-gray-500">
                      {((companyTradePrice / currentPrice - 1) * 100).toFixed(2)}% {companyTradePrice >= currentPrice ? '溢价' : '折价'}
                    </div>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-2 border border-purple-200 text-center">
                    <div className="text-xs text-purple-600">交易数量</div>
                    <div className="text-lg font-bold text-purple-700">{companyTradeShares.toLocaleString()}股</div>
                    <div className="text-xs text-gray-500">
                      总额 ¥{(companyTradePrice * companyTradeShares).toLocaleString()}
                    </div>
                  </div>
                </div>
                
                {!companyTradeCompleted ? (
                  <div className="bg-gray-50 rounded-lg p-2 border border-gray-200">
                    <div className="text-xs text-gray-600 mb-2">📊 参与者交易意愿</div>
                    <div className="space-y-1 max-h-32 overflow-y-auto">
                      {stats.playerStats?.filter(p => p.shares > 0 || (companyTradeDirection === 'sell' && p.money > 0)).map((player) => {
                        // 根据交易方向决定参与逻辑
                        const canParticipate = companyTradeDirection === 'buy' 
                          ? player.shares > 0 // 回购：需要有股份
                          : player.money > companyTradePrice * 100; // 发行：需要有足够资金买100股
                        
                        const participantShares = companyTradeDirection === 'buy'
                          ? Math.min(player.shares, Math.floor(companyTradeShares / stats.playerStats.length))
                          : Math.floor(player.money / companyTradePrice);
                        
                        return (
                          <div key={player.key} className="flex items-center justify-between text-xs p-1 bg-white rounded border border-gray-100">
                            <div className="flex items-center gap-1">
                              <span>{player.icon}</span>
                              <span className="text-gray-700">{player.name}</span>
                              {player.isUser && <span className="bg-yellow-400 text-yellow-800 px-1 rounded text-xs">你</span>}
                            </div>
                            {canParticipate ? (
                              <span className="text-green-600">
                                {companyTradeDirection === 'buy' ? `可卖 ${participantShares}股` : `可买 ${participantShares}股`}
                              </span>
                            ) : (
                              <span className="text-gray-400">无法参与</span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                    <button
                      onClick={() => {
                        // 执行公司交易
                        if (onCompanyTrade) {
                          const participants = stats.playerStats
                            ?.filter(p => companyTradeDirection === 'buy' ? p.shares > 0 : p.money > companyTradePrice * 100)
                            .map(p => ({
                              key: p.key,
                              name: p.name,
                              shares: companyTradeDirection === 'buy'
                                ? Math.min(p.shares, Math.floor(companyTradeShares / stats.playerStats.length))
                                : Math.floor(p.money / companyTradePrice)
                            }));
                          onCompanyTrade(companyTradeDirection, companyTradePrice, companyTradeShares, participants);
                        }
                        setCompanyTradeCompleted(true);
                      }}
                      className="w-full mt-2 px-3 py-1.5 bg-indigo-500 text-white rounded-lg text-xs hover:bg-indigo-600 transition"
                    >
                      确认交易
                    </button>
                  </div>
                ) : (
                  <div className="bg-green-50 rounded-lg p-2 border border-green-200">
                    <div className="text-center">
                      <div className="text-2xl mb-1">✅</div>
                      <div className="text-xs text-green-700 font-bold">交易已完成</div>
                      <div className="text-xs text-gray-600 mt-1">
                        公司{companyTradeDirection === 'buy' ? '回购' : '发行'}了 {companyTradeShares.toLocaleString()} 股
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        );
        
      case 'ranking':
        return (
          <div className="space-y-2 animate-fade-in">
            <h2 className="text-base font-bold text-center text-gray-700">🏆 {year} 年度财富排行榜</h2>
            <div className="space-y-1.5 max-h-48 overflow-y-auto">
              {stats.playerStats?.map((player) => (
                <div key={player.key} className={`flex items-center p-1.5 rounded-lg border ${player.isUser ? 'bg-yellow-50 border-yellow-300' : 'bg-white border-gray-200'}`}>
                  <div className="w-6 text-center text-base">{getRankTrophy(player.rank) || player.rank}</div>
                  <div className="text-xl mr-1.5">{player.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1">
                      <span className={`font-bold text-xs truncate ${player.isUser ? 'text-yellow-700' : 'text-gray-700'}`}>{player.name}</span>
                      {player.isUser && <span className="text-xs bg-yellow-400 text-yellow-800 px-1 rounded">你</span>}
                    </div>
                    <div className="text-xs text-gray-500">¥{player.totalValue?.toFixed(0)}</div>
                  </div>
                  <div className="text-right">
                    <div className={`font-bold text-xs ${player.profit >= 0 ? 'text-red-600' : 'text-green-600'}`}>
                      {player.profit >= 0 ? '+' : ''}{player.profit?.toFixed(0)}
                    </div>
                    <div className={`text-xs ${player.profit >= 0 ? 'text-red-500' : 'text-green-500'}`}>
                      {player.profitRate >= 0 ? '+' : ''}{player.profitRate?.toFixed(1)}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {stats.bestPlayer && (
              <div className="bg-gradient-to-r from-yellow-100 to-amber-100 rounded-lg p-2 border border-yellow-300 text-center">
                <span className="text-lg">👑</span>
                <div className="text-xs text-yellow-700">年度首富</div>
                <div className="font-bold text-sm text-yellow-800">{stats.bestPlayer.icon} {stats.bestPlayer.name}</div>
              </div>
            )}
          </div>
        );
        
      case 'donation':
        const totalDonation = donations?.reduce((sum, d) => sum + d.donation, 0) || 0;
        return (
          <div className="space-y-2 animate-fade-in">
            <h2 className="text-base font-bold text-center text-gray-700">💝 慈善捐款环节</h2>
            {displayData.isFirstYear ? (
              <div className="text-center py-4">
                <div className="text-4xl mb-2">🌱</div>
                <div className="text-gray-600 text-sm">新的一年刚刚开始</div>
                <div className="text-gray-500 text-xs mt-1">暂无捐款记录</div>
              </div>
            ) : (
              <>
                <div className="bg-pink-50 rounded-lg p-2 border border-pink-200 text-center">
                  <div className="text-2xl mb-0.5">🐣</div>
                  <div className="font-bold text-pink-700 text-sm">幼鸟保护基金会</div>
                  <div className="text-xs text-pink-600">保护森林里每一只幼小生命</div>
                </div>
                <div className="text-xs text-gray-500 text-center">盈利动物捐款支持幼鸟保护，获得4个月公告头条特权！</div>
                {donations?.length > 0 ? (
                  <div className="space-y-1.5">
                    {donations.map((d, i) => (
                      <div key={i} className="bg-gradient-to-r from-pink-50 to-rose-50 rounded-lg p-2 border border-pink-200">
                        <div className="flex items-center gap-2">
                          <div className="text-xl">{d.icon}</div>
                          <div className="flex-1 min-w-0">
                            <div className="font-bold text-xs text-gray-700">{d.name}</div>
                            <div className="text-xs text-gray-500 truncate">{d.speech}</div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between mt-1.5 pt-1.5 border-t border-pink-200">
                          <div className="text-pink-600 font-bold text-xs">💝 ¥{d.donation}</div>
                          <div className="text-xs bg-yellow-100 text-yellow-700 px-1.5 py-0.5 rounded-full">🎯 4个月头条</div>
                        </div>
                      </div>
                    ))}
                    <div className="bg-green-50 rounded-lg p-1.5 border border-green-200 text-center">
                      <div className="text-green-700 text-xs">🎊 共筹集捐款: <span className="font-bold">¥{totalDonation}</span></div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-gray-500 py-4">
                    <div className="text-2xl mb-1">😢</div>
                    <div className="text-xs">今年没有动物盈利，暂无捐款</div>
                  </div>
                )}
              </>
            )}
          </div>
        );
        
      case 'speech':
        return (
          <div className="space-y-2 animate-fade-in">
            <h2 className="text-base font-bold text-center text-gray-700">🎤 代表发言</h2>
            <div className="text-xs text-gray-500 text-center">各位动物代表分享这一年的投资心得</div>
            <div className="space-y-1.5 max-h-48 overflow-y-auto">
              {stats.playerStats?.map((player) => (
                <div key={player.key} className={`p-1.5 rounded-lg border ${player.isUser ? 'bg-yellow-50 border-yellow-200' : 'bg-gray-50 border-gray-200'}`}>
                  <div className="flex items-start gap-1.5">
                    <div className="text-lg">{player.icon}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1 mb-0.5">
                        <span className={`font-bold text-xs ${player.isUser ? 'text-yellow-700' : 'text-gray-700'}`}>{player.name}</span>
                        {player.isUser && <span className="text-xs bg-yellow-400 text-yellow-800 px-1 rounded">你</span>}
                        <span className={`text-xs ${player.profit >= 0 ? 'text-red-500' : 'text-green-500'}`}>({player.profit >= 0 ? '+' : ''}{player.profitRate?.toFixed(1)}%)</span>
                      </div>
                      <p className="text-xs text-gray-600">{getAnimalSpeech(player.key, player.profitRate)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
        
      case 'performance':
        return (
          <div className="space-y-2 animate-fade-in">
            <h2 className="text-base font-bold text-center text-gray-700">🎭 精彩节目表演</h2>
            <div className="grid grid-cols-2 gap-1.5">
              {Object.entries(ANIMAL_PERFORMANCES).map(([key, perf]) => {
                const player = stats.playerStats?.find(p => p.key === key);
                return (
                  <div key={key} className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg p-1.5 border border-indigo-200">
                    <div className="text-center">
                      <div className="text-lg">{perf.icon}</div>
                      <div className="font-bold text-indigo-700 text-xs">{perf.name}</div>
                      <div className="text-xs text-gray-500 mt-0.5 italic truncate">"{perf.content.substring(0, 12)}..."</div>
                      {player && (
                        <div className={`text-xs mt-0.5 ${player.profit >= 0 ? 'text-red-600' : 'text-green-600'}`}>
                          {player.profit >= 0 ? '+' : ''}{player.profitRate?.toFixed(1)}%
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
        
      case 'closing':
        return (
          <div className="text-center space-y-3 animate-fade-in">
            <div className="text-4xl">🎉</div>
            <h2 className="text-lg font-bold text-amber-600">大会闭幕</h2>
            <div className="bg-amber-50 rounded-lg p-3 border border-amber-200">
              <div className="text-3xl mb-2">🦁</div>
              <h3 className="text-base font-bold text-amber-700 mb-1">狮王闭幕致辞</h3>
              <p className="text-gray-700 leading-relaxed text-xs">{HOST_SPEECH.closing(year)}</p>
            </div>
            <div className="bg-gradient-to-r from-yellow-100 to-amber-100 rounded-lg p-2 border border-yellow-300">
              <div className="text-yellow-800 font-bold text-sm">🎊 感谢各位的参与！</div>
              <div className="text-xs text-yellow-700">让我们期待明年的精彩！</div>
            </div>
            {!viewingHistory && historicalSummaries.length > 0 && (
              <div className="border-t border-gray-200 pt-2">
                <div className="text-xs text-gray-500 mb-1.5">📜 查看历史年度大会</div>
                <div className="flex flex-wrap gap-1.5 justify-center">
                  {historicalSummaries.slice(-3).reverse().map(h => (
                    <button
                      key={h.year}
                      onClick={() => { setViewingHistory(true); setSelectedHistoryYear(h.year); }}
                      className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs hover:bg-blue-200 transition"
                    >
                      {h.year}年
                    </button>
                  ))}
                </div>
              </div>
            )}
            {viewingHistory && (
              <button
                onClick={() => { setViewingHistory(false); setSelectedHistoryYear(null); }}
                className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-xs hover:bg-gray-200 transition"
              >
                ← 返回当前年度
              </button>
            )}
          </div>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg flex flex-col max-h-[85vh]">
        {/* 标题栏 */}
        <div className="flex-shrink-0 bg-gradient-to-r from-amber-500 to-yellow-500 p-4 text-white rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🎪</span>
              <span className="font-bold text-lg">森林年度大会</span>
            </div>
            <button onClick={onClose} className="text-white/80 hover:text-white text-2xl">×</button>
          </div>
          <div className="text-sm text-white/80 mt-1">
            {viewingHistory ? `查看 ${selectedHistoryYear} 年度记录` : `第 ${year} 年度`}
          </div>
        </div>
        
        {/* 内容区 - 可滚动 */}
        <div className="flex-1 p-4 overflow-y-auto min-h-0">
          {renderSection()}
        </div>
        
        {/* 导航栏 - 固定在底部 */}
        <div className="flex-shrink-0 border-t border-gray-200 p-3 bg-white rounded-b-2xl">
          <div className="flex justify-center gap-1 mb-2">
            {sections.map((section, index) => (
              <button
                key={section.id}
                onClick={() => setCurrentSection(index)}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm transition ${
                  currentSection === index 
                    ? 'bg-amber-500 text-white' 
                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}
                title={section.title}
              >
                {section.icon}
              </button>
            ))}
          </div>
          <div className="flex justify-between">
            <button
              onClick={() => setCurrentSection(Math.max(0, currentSection - 1))}
              disabled={currentSection === 0}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm disabled:opacity-50 hover:bg-gray-200 transition"
            >
              ← 上一步
            </button>
            {currentSection < sections.length - 1 ? (
              <button
                onClick={() => setCurrentSection(currentSection + 1)}
                className="px-4 py-2 bg-amber-500 text-white rounded-lg text-sm hover:bg-amber-600 transition"
              >
                下一步 →
              </button>
            ) : (
              <button
                onClick={onClose}
                className="px-4 py-2 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600 transition"
              >
                完成大会 ✓
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnnualSummary;
