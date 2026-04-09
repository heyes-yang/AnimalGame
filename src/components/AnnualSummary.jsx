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

// 获取动物风险偏好等级
const getRiskLevel = (animalKey) => {
  const riskLevels = {
    cat: 'low',      // 散户猫 - 保守
    dog: 'medium',   // 中产狗 - 稳健
    bear: 'medium',  // 大户熊 - 稳健
    fox: 'high',     // 游资狐 - 激进
    tiger: 'high',   // 庄家虎 - 激进
    rabbit: 'medium',// 量化兔 - 稳健
    cow: 'low',      // 神秘牛 - 保守
    panda: 'low',    // 懒熊猫 - 保守
    lion: 'high',    // 狮子王 - 激进
    elephant: 'low', // 大象象 - 保守
    wolf: 'high',    // 独狼哥 - 激进
    monkey: 'medium',// 调皮猴 - 稳健
    owl: 'medium',   // 猫头鹰 - 稳健
    snake: 'high',   // 青蛇妹 - 激进
    pig: 'low'       // 存钱猪 - 保守
  };
  return riskLevels[animalKey] || 'medium';
};

// 根据盈亏情况调整参与意愿
const getParticipationRatio = (animalKey, profitRate) => {
  const baseRatio = {
    cat: 0.6,
    dog: 0.7,
    bear: 0.5,
    fox: 0.85,
    tiger: 0.8,
    rabbit: 0.7,
    cow: 0.3,
    panda: 0.4,
    lion: 0.75,
    elephant: 0.5,
    wolf: 0.8,
    monkey: 0.65,
    owl: 0.6,
    snake: 0.75,
    pig: 0.4
  };
  
  let ratio = baseRatio[animalKey] || 0.6;
  
  // 盈利时更愿意参与，亏损时更谨慎
  if (profitRate > 20) {
    ratio *= 1.3; // 大幅盈利，更积极
  } else if (profitRate > 0) {
    ratio *= 1.1; // 盈利，略积极
  } else if (profitRate > -20) {
    ratio *= 0.9; // 小幅亏损，略保守
  } else {
    ratio *= 0.7; // 大幅亏损，保守
  }
  
  return Math.min(0.95, Math.max(0.2, ratio)); // 限制在20%-95%之间
};

// 生成年度总结数据
export const generateAnnualSummaryData = (year, players, priceHistory, currentPrice, userPlayer) => {
  const startPriceIndex = Math.max(0, priceHistory.length - 365);
  const startPrice = priceHistory[startPriceIndex] || priceHistory[0];
  const endPrice = currentPrice;
  const priceChange = ((endPrice - startPrice) / startPrice * 100);
  
  const playerStats = Object.entries(players).map(([key, player]) => {
    // 考虑冻结资产计算总价值
    const frozenMoney = player.frozenMoney || 0;
    const frozenShares = player.frozenShares || 0;
    const totalValue = (player.money || 0) + frozenMoney + 
                       ((player.shares || 0) + frozenShares) * currentPrice;
    const initialValue = (player.initialMoney || 0) + (player.initialShares || 0) * (player.initialPrice || 1.0);
    const profit = totalValue - initialValue;
    const profitRate = initialValue > 0 ? (profit / initialValue * 100) : 0;
    
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
  const [companyTradeDirection, setCompanyTradeDirection] = useState('sell'); // 只允许 sell（公司发行新股抛售）
  const [companyTradePrice, setCompanyTradePrice] = useState(0);
  const [companyTradeShares, setCompanyTradeShares] = useState(0);
  const [companyTradeParticipants, setCompanyTradeParticipants] = useState([]);
  const [companyTradeCompleted, setCompanyTradeCompleted] = useState(false);
  const [userTradeAmount, setUserTradeAmount] = useState(0); // 玩家选择的交易数量
  const [userWantsToTrade, setUserWantsToTrade] = useState(true); // 玩家是否愿意参与交易
  const [tradeResult, setTradeResult] = useState(null); // 交易结果
  const [tradeClosed, setTradeClosed] = useState(false); // 交易是否已关闭（不再显示操作界面）
  
  // 使用 ref 跟踪是否已经初始化过，避免重复初始化
  const initializedRef = React.useRef(false);
  
  useEffect(() => {
    if (isOpen && !initializedRef.current) {
      setCurrentSection(0);
      setCompanyTradeCompleted(false);
      setCompanyTradeParticipants([]);
      setTradeResult(null);
      setTradeClosed(false); // 重置交易关闭状态
      
      // 初始化公司交易参数 - 公司只会抛售股份（发行新股）
      if (currentPrice && dreamCompany && !initialViewingHistory) {
        const direction = 'sell'; // 只允许发行新股
        const price = calculateCompanyTradePrice(currentPrice, direction);
        // 公司每次大会最多抛售50000股
        const maxShares = Math.min(50000, dreamCompany.shares || 50000); // 不超过公司持有量和50000
        const shares = Math.floor(Math.random() * 40000 + 10000); // 10000-50000股
        const actualShares = Math.min(shares, maxShares);
        
        setCompanyTradeDirection(direction);
        setCompanyTradePrice(price);
        setCompanyTradeShares(actualShares);
        setUserTradeAmount(0);
        setUserWantsToTrade(true);
        console.log(`🏛️ 年度大会公司交易: 发行 ${actualShares}股 @ ¥${price}`);
      }
      
      // 如果是外部传入的历史查看模式，设置为历史模式
      if (initialViewingHistory && historicalSummaries.length > 0) {
        setViewingHistory(true);
        setSelectedHistoryYear(historicalSummaries[historicalSummaries.length - 1]?.year);
      } else {
        setViewingHistory(false);
        setSelectedHistoryYear(null);
      }
      
      initializedRef.current = true;
    }
    
    // 当弹窗关闭时重置 initializedRef
    if (!isOpen) {
      initializedRef.current = false;
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
        // 计算玩家可认购的最大股数
        const userPlayerData = stats.playerStats?.find(p => p.isUser);
        const userMaxAffordableShares = userPlayerData ? Math.floor(userPlayerData.money / companyTradePrice) : 0;
        const userMaxShares = Math.min(10000, userMaxAffordableShares); // 最多10000股且不超过现金
        const userCost = userTradeAmount * companyTradePrice;
        
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
                  <div className="text-xs text-amber-700 mb-1">📢 发行公告</div>
                  <p className="text-xs text-gray-700 leading-relaxed">
                    🦁 狮王致辞：森林梦想公司宣布将以 ¥{companyTradePrice.toFixed(3)} 的价格发行 {companyTradeShares.toLocaleString()} 股新股！所有居民都可以参与认购！
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-blue-50 rounded-lg p-2 border border-blue-200 text-center">
                    <div className="text-xs text-blue-600">发行价格</div>
                    <div className="text-lg font-bold text-blue-700">¥{companyTradePrice.toFixed(3)}</div>
                    <div className="text-xs text-gray-500">
                      {((companyTradePrice / currentPrice - 1) * 100).toFixed(2)}% {companyTradePrice >= currentPrice ? '溢价' : '折价'}
                    </div>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-2 border border-purple-200 text-center">
                    <div className="text-xs text-purple-600">发行数量</div>
                    <div className="text-lg font-bold text-purple-700">{companyTradeShares.toLocaleString()}股</div>
                    <div className="text-xs text-gray-500">
                      总额 ¥{(companyTradePrice * companyTradeShares).toLocaleString()}
                    </div>
                  </div>
                </div>
                
                {!companyTradeCompleted ? (
                  <div className="bg-gray-50 rounded-lg p-2 border border-gray-200">
                    {/* 玩家交易区域 */}
                    <div className="bg-yellow-50 rounded-lg p-2 border border-yellow-200 mb-2">
                      <div className="text-xs text-yellow-700 mb-1 font-bold">🎮 你的认购选择</div>
                      <div className="text-xs text-gray-600 mb-2">
                        现金: ¥{(userPlayerData?.money || 0).toLocaleString()} | 
                        最多可认购: {userMaxShares.toLocaleString()}股
                      </div>
                      
                      {/* 是否参与交易 */}
                      <div className="flex items-center gap-2 mb-2">
                        <label className="flex items-center gap-1 text-xs">
                          <input
                            type="checkbox"
                            checked={userWantsToTrade}
                            onChange={(e) => {
                              setUserWantsToTrade(e.target.checked);
                              if (!e.target.checked) setUserTradeAmount(0);
                            }}
                            className="w-4 h-4"
                          />
                          <span>参与认购</span>
                        </label>
                      </div>
                      
                      {/* 交易数量选择 */}
                      {userWantsToTrade && userMaxShares > 0 && (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-600">认购数量:</span>
                            <input
                              type="number"
                              min="0"
                              max={userMaxShares}
                              step="100"
                              value={userTradeAmount}
                              onChange={(e) => {
                                // 确保100股整数倍
                                const rawVal = parseInt(e.target.value) || 0;
                                const val = Math.floor(rawVal / 100) * 100;
                                setUserTradeAmount(Math.min(userMaxShares, Math.max(0, val)));
                              }}
                              className="flex-1 px-2 py-1 border border-gray-300 rounded text-xs"
                              placeholder="输入认购数量(100的整数倍)"
                            />
                            <button
                              onClick={() => setUserTradeAmount(Math.floor(userMaxShares / 100) * 100)}
                              className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs hover:bg-blue-200"
                            >
                              全部
                            </button>
                          </div>
                          <div className="text-xs text-gray-500">
                            需支付: ¥{(userCost).toLocaleString()} 
                            {userCost > (userPlayerData?.money || 0) && <span className="text-red-500 ml-1">(资金不足!)</span>}
                          </div>
                        </div>
                      )}
                      
                      {userMaxShares === 0 && (
                        <div className="text-xs text-red-500">现金不足，无法参与认购</div>
                      )}
                    </div>
                    
                    {/* 动物参与者 - 根据资金和持股情况决定认购意愿 */}
                    <div className="text-xs text-gray-600 mb-2">📊 动物认购意愿</div>
                    <div className="space-y-1 max-h-24 overflow-y-auto">
                      {stats.playerStats?.filter(p => !p.isUser).map((player) => {
                        // player.totalValue 已考虑冻结资产
                        const totalValue = player.totalValue || (player.money + (player.shares * currentPrice));
                        // 只有可用现金才能直接认购（不包括冻结资金）
                        const maxAffordable = Math.floor(player.money / companyTradePrice);
                        
                        // 根据动物特征决定认购策略
                        const riskLevel = getRiskLevel(player.key);
                        const participationRatio = getParticipationRatio(player.key, player.profitRate);
                        
                        // 决定是否参与认购（基于资金情况和性格）
                        let wantsToTrade = false;
                        let desiredShares = 0;
                        let needToSellShares = false;
                        
                        if (player.money >= companyTradePrice * 100) {
                          // 有足够资金，根据性格决定认购
                          wantsToTrade = Math.random() < participationRatio;
                          if (wantsToTrade) {
                            // 根据风险偏好决定认购比例
                            const investRatio = riskLevel === 'high' ? 0.6 : riskLevel === 'medium' ? 0.4 : 0.2;
                            const targetInvest = player.money * investRatio;
                            desiredShares = Math.floor(targetInvest / companyTradePrice);
                            desiredShares = Math.min(desiredShares, 10000, maxAffordable);
                            desiredShares = Math.max(100, desiredShares); // 至少100股
                          }
                        } else if (player.shares > 0 && totalValue >= companyTradePrice * 100) {
                          // 现金不足但有股票，可能卖股票来认购
                          needToSellShares = true;
                          wantsToTrade = Math.random() < participationRatio * 0.7; // 降低参与意愿
                          if (wantsToTrade) {
                            // 计算需要卖多少股票才能认购
                            const investRatio = riskLevel === 'high' ? 0.4 : riskLevel === 'medium' ? 0.25 : 0.1;
                            const targetInvest = totalValue * investRatio;
                            desiredShares = Math.floor(targetInvest / companyTradePrice);
                            desiredShares = Math.min(desiredShares, 10000);
                            desiredShares = Math.max(100, desiredShares);
                          }
                        }
                        // 资金和股票都不足，不参与
                        
                        return (
                          <div key={player.key} className="flex items-center justify-between text-xs p-1 bg-white rounded border border-gray-100">
                            <div className="flex items-center gap-1">
                              <span>{player.icon}</span>
                              <span className="text-gray-700">{player.name}</span>
                              <span className="text-gray-400 text-xs">
                                (现金: ¥{player.money?.toFixed(0)} | {player.shares}股)
                              </span>
                            </div>
                            <span className={wantsToTrade ? 'text-green-600' : 'text-gray-400'}>
                              {wantsToTrade 
                                ? `想认购 ${desiredShares.toLocaleString()}股${needToSellShares ? '💰' : ''}` 
                                : '不参与'}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                    
                    <button
                      onClick={() => {
                        // 执行公司交易
                        if (onCompanyTrade) {
                          const participants = [];
                          
                          // 添加玩家
                          if (userWantsToTrade && userTradeAmount > 0) {
                            participants.push({
                              key: 'user',
                              name: userPlayerData?.name || '玩家',
                              desiredShares: userTradeAmount, // 想要认购的数量
                              needToSellShares: false
                            });
                          }
                          
                          // 添加动物参与者（与展示逻辑一致的AI决定）
                          stats.playerStats?.filter(p => !p.isUser).forEach((player) => {
                            const maxAffordable = Math.floor(player.money / companyTradePrice);
                            // 使用 player.totalValue（已包含冻结资产）
                            const totalValue = player.totalValue || (player.money + (player.shares * currentPrice));
                            const riskLevel = getRiskLevel(player.key);
                            const participationRatio = getParticipationRatio(player.key, player.profitRate);
                            
                            let wantsToTrade = false;
                            let desiredShares = 0;
                            let needToSellShares = false;
                            
                            if (player.money >= companyTradePrice * 100) {
                              // 有足够资金
                              wantsToTrade = Math.random() < participationRatio;
                              if (wantsToTrade) {
                                const investRatio = riskLevel === 'high' ? 0.6 : riskLevel === 'medium' ? 0.4 : 0.2;
                                const targetInvest = player.money * investRatio;
                                desiredShares = Math.floor(targetInvest / companyTradePrice);
                                desiredShares = Math.min(desiredShares, 10000, maxAffordable);
                                desiredShares = Math.max(100, desiredShares);
                              }
                            } else if (player.shares > 0 && totalValue >= companyTradePrice * 100) {
                              // 现金不足但有股票，可能卖股票认购
                              needToSellShares = true;
                              wantsToTrade = Math.random() < participationRatio * 0.7;
                              if (wantsToTrade) {
                                const investRatio = riskLevel === 'high' ? 0.4 : riskLevel === 'medium' ? 0.25 : 0.1;
                                const targetInvest = totalValue * investRatio;
                                desiredShares = Math.floor(targetInvest / companyTradePrice);
                                desiredShares = Math.min(desiredShares, 10000);
                                desiredShares = Math.max(100, desiredShares);
                              }
                            }
                            
                            if (wantsToTrade && desiredShares > 0) {
                              participants.push({
                                key: player.key,
                                name: player.name,
                                desiredShares: desiredShares, // 想要认购的数量
                                needToSellShares: needToSellShares,
                                sharesToSell: needToSellShares ? Math.ceil(desiredShares * companyTradePrice / currentPrice) : 0
                              });
                            }
                          });
                          
                          // 计算总认购需求
                          const totalDesiredShares = participants.reduce((sum, p) => sum + p.desiredShares, 0);
                          
                          // 按比例分配股份
                          let allocatedParticipants = [];
                          if (participants.length === 0 || totalDesiredShares === 0) {
                            // 没有参与者，不分配
                            allocatedParticipants = [];
                          } else if (totalDesiredShares <= companyTradeShares) {
                            // 认购需求不超过发行量，全部满足
                            allocatedParticipants = participants.map(p => ({
                              ...p,
                              shares: p.desiredShares,
                              allocatedRatio: 1
                            }));
                          } else {
                            // 认购需求超过发行量，按比例分配
                            const allocationRatio = companyTradeShares / totalDesiredShares;
                            let allocatedTotal = 0;
                            allocatedParticipants = participants.map((p, index) => {
                              let allocatedShares;
                              if (index === participants.length - 1) {
                                // 最后一个参与者获得剩余股份，避免舍入误差
                                allocatedShares = companyTradeShares - allocatedTotal;
                              } else {
                                allocatedShares = Math.floor(p.desiredShares * allocationRatio);
                                allocatedTotal += allocatedShares;
                              }
                              
                              // 根据实际分配的股数重新计算需要卖多少股票
                              const actualCost = allocatedShares * companyTradePrice;
                              const needToSell = p.needToSellShares && allocatedShares > 0;
                              // 如果需要卖股票，计算需要卖多少股才能支付
                              const actualSharesToSell = needToSell 
                                ? Math.min(p.sharesToSell || 0, Math.ceil(actualCost / currentPrice))
                                : 0;
                              
                              return {
                                ...p,
                                shares: Math.max(0, allocatedShares),
                                allocatedRatio: allocationRatio,
                                needToSellShares: needToSell,
                                sharesToSell: actualSharesToSell
                              };
                            });
                          }
                          
                          // 计算交易结果
                          const totalSubscribed = allocatedParticipants.reduce((sum, p) => sum + p.shares, 0);
                          const remainingShares = Math.max(0, companyTradeShares - totalSubscribed);
                          
                          setTradeResult({
                            totalShares: companyTradeShares,
                            totalDesired: totalDesiredShares,
                            subscribedShares: totalSubscribed,
                            remainingShares: remainingShares,
                            participants: allocatedParticipants,
                            wasOversubscribed: totalDesiredShares > companyTradeShares
                          });
                          
                          // 只传递实际分配到的股份
                          onCompanyTrade(companyTradeDirection, companyTradePrice, companyTradeShares, allocatedParticipants);
                        }
                        setCompanyTradeCompleted(true);
                        setTradeClosed(true); // 确认交易后自动关闭操作界面，展示交易结果
                      }}
                      className="w-full mt-2 px-3 py-1.5 bg-indigo-500 text-white rounded-lg text-xs hover:bg-indigo-600 transition"
                    >
                      确认并执行交易
                    </button>
                  </div>
                ) : (
                  // 交易已完成，展示交易结果
                  <div className="bg-green-50 rounded-lg p-2 border border-green-200">
                    <div className="text-center">
                      <div className="text-2xl mb-1">✅</div>
                      <div className="text-xs text-green-700 font-bold">交易已执行完成</div>
                      <div className="text-xs text-gray-600 mt-1">
                        公司发行了 {tradeResult?.subscribedShares?.toLocaleString() || companyTradeShares.toLocaleString()} 股新股 @ ¥{companyTradePrice.toFixed(3)}
                      </div>
                      {tradeResult && (
                        <div className="mt-2 text-left bg-white rounded p-2 border border-gray-200">
                          <div className="text-xs font-bold text-gray-700 mb-1">📋 交易详情</div>
                          <div className="space-y-0.5 text-xs">
                            <div className="flex justify-between">
                              <span className="text-gray-500">发行总量:</span>
                              <span>{tradeResult.totalShares?.toLocaleString()}股</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500">认购需求:</span>
                              <span className={tradeResult.wasOversubscribed ? 'text-red-600 font-bold' : ''}>
                                {tradeResult.totalDesired?.toLocaleString()}股
                                {tradeResult.wasOversubscribed && ' (超购)'}
                              </span>
                            </div>
                            {tradeResult.wasOversubscribed && (
                              <div className="flex justify-between">
                                <span className="text-gray-500">分配比例:</span>
                                <span className="text-orange-600">
                                  {(tradeResult.participants?.[0]?.allocatedRatio * 100)?.toFixed(1)}%
                                </span>
                              </div>
                            )}
                            <div className="flex justify-between">
                              <span className="text-gray-500">实际成交:</span>
                              <span className="text-green-600 font-bold">
                                {tradeResult.subscribedShares?.toLocaleString()}股
                              </span>
                            </div>
                            {tradeResult.participants?.length > 0 && (
                              <div className="mt-1 pt-1 border-t border-gray-100">
                                <div className="text-gray-500 mb-0.5">认购明细:</div>
                                <div className="max-h-20 overflow-y-auto">
                                  {tradeResult.participants.map((p, i) => (
                                    <div key={i} className="flex justify-between text-gray-600">
                                      <span>{p.name}</span>
                                      <span>
                                        {p.shares.toLocaleString()}股
                                        {p.allocatedRatio < 1 && ` (${(p.allocatedRatio * 100).toFixed(0)}%)`}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                      <div className="mt-2 text-center text-xs text-gray-500">
                        📋 交易已完成，可点击"下一步"继续大会流程
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
