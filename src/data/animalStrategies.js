// 动物交易策略配置
// 每种动物都有独特的交易风格、积极性和季节偏好

// 季节对积极性的影响系数 - 提高基础值确保交易活跃
export const SEASON_ACTIVITY_MODIFIERS = {
  spring: {
    cat: 1.3,      // 猫咪春天活跃
    dog: 1.4,      // 狗狗春天精力充沛
    bear: 1.1,     // 熊春天刚醒来
    fox: 1.2,      // 狐狸春天觅食积极
    tiger: 1.2,    // 老虎正常
    rabbit: 1.5,   // 兔子春天繁殖季，非常活跃
    cow: 1.2       // 神秘牛
  },
  summer: {
    cat: 1.0,      // 猫咪夏天正常交易
    dog: 1.1,      // 狗狗夏天活跃
    bear: 0.9,     // 熊夏天稍慢
    fox: 1.2,      // 狐狸活跃
    tiger: 1.3,    // 老虎夏天活跃
    rabbit: 1.4,   // 兔子夏天活跃
    cow: 1.2
  },
  autumn: {
    cat: 1.3,      // 猫咪秋天舒适
    dog: 1.4,      // 狗狗秋天开心
    bear: 1.5,     // 熊秋天疯狂进食准备冬眠，超级活跃
    fox: 1.5,      // 狐狸秋天储备食物
    tiger: 1.2,    // 老虎正常
    rabbit: 1.2,   // 兔子秋天活跃
    cow: 1.2
  },
  winter: {
    cat: 1.1,      // 猫咪冬天也活跃
    dog: 1.0,      // 狗狗冬天交易
    bear: 0.7,     // 熊冬天冬眠，但偶尔也会醒来交易
    fox: 1.0,      // 狐狸冬天觅食
    tiger: 1.3,    // 老虎冬天狩猎更积极
    rabbit: 1.0,   // 兔子冬天觅食
    cow: 1.2
  }
};

// 动物打工配置 - 每个季节打工的概率和收益
export const WORK_CONFIG = {
  // 打工概率（每个季节开始时有概率出门打工）- 【降低概率】
  probabilityBySeason: {
    spring: 0.05,   // 春天万物复苏，打工概率很低
    summer: 0.08,   // 夏天打工概率较低
    autumn: 0.10,   // 秋天准备过冬，打工概率中等
    winter: 0.15    // 冬天需要更多资源，打工概率较高
  },
  // 打工时长（天）- 【修改】改为按天计算
  duration: {
    min: 5,
    max: 10
  },
  // 打工薪资范围（固定金额）- 【修改】降低薪资范围
  salaryRange: {
    cat: { min: 100, max: 300 },       // 散户猫打工赚得少
    dog: { min: 150, max: 400 },       // 中产狗稳定收入
    bear: { min: 200, max: 600 },      // 大户熊不在乎打工
    fox: { min: 180, max: 500 },       // 游资狐狡猾，赚得多
    tiger: { min: 300, max: 800 },     // 庄家虎赚大钱
    rabbit: { min: 120, max: 350 },    // 量化兔效率高
    cow: { min: 100, max: 250 }        // 神秘牛神秘收入
  },
  // 哪些动物更可能打工（不交易时）- 【降低概率】
  workLikelihood: {
    cat: 0.2,       // 散户猫偶尔打工
    dog: 0.2,       // 中产狗偶尔打工
    bear: 0.05,     // 大户熊很少打工
    fox: 0.15,      // 游资狐有机会就打工
    tiger: 0.02,    // 庄家虎几乎不打工
    rabbit: 0.25,   // 量化兔偶尔打工优化资金
    cow: 0.01       // 神秘牛几乎不打工
  }
};

// 市场流动性维护配置
export const LIQUIDITY_CONFIG = {
  // 卖单不足阈值（连续天数）
  noSellThreshold: 2,
  // 买单不足阈值（连续天数）
  noBuyThreshold: 2,
  // 卖单不足时的买价提升幅度
  buyPriceBoost: {
    cat: 0.03,      // 散户猫小幅提价
    dog: 0.02,      // 中产狗理性提价
    bear: 0.01,     // 大户熊不在乎
    fox: 0.05,      // 游资狐激进提价
    tiger: 0.02,    // 庄家虎稳定提价
    rabbit: 0.04,   // 量化兔算法提价
    cow: 0.01       // 神秘牛小幅提价
  },
  // 买单不足时的抛售概率增加
  sellProbabilityBoost: {
    cat: 0.2,       // 散户猫容易恐慌抛售
    dog: 0.1,       // 中产狗理性抛售
    bear: 0.3,      // 大户熊主动抛售
    fox: 0.15,      // 游资狐快速反应
    tiger: 0.05,    // 庄家虎稳如泰山
    rabbit: 0.25,   // 量化兔算法抛售
    cow: 0.02       // 神秘牛几乎不抛售
  }
};

// 动物交易策略配置 - 提高基础积极性确保市场活跃
export const ANIMAL_STRATEGIES = {
  cat: {
    name: '散户猫',
    // 交易特点：谨慎、小额、频繁
    baseActivity: 0.85,           // 基础积极性 85%（提高）
    tradeFrequency: 'high',        // 交易频率：高
    avgTradeSize: 'small',         // 平均交易量：小
    riskTolerance: 'low',          // 风险承受：低
    
    // 买卖偏好
    buyBias: 0.5,                  // 买入倾向 (0-1)
    sellBias: 0.5,                 // 卖出倾向 (0-1)
    
    // 价格策略
    priceStrategy: {
      type: 'conservative',        // 保守型：贴近市场价
      maxDeviation: 0.05,          // 最大偏离 ±5%（扩大范围增加撮合机会）
      preferMarketPrice: true      // 偏好市价
    },
    
    // 交易量范围
    shareRange: { min: 100, max: 400 },
    
    // 特殊行为
    behaviors: {
      panicSell: true,             // 容易恐慌抛售
      followTrend: true,           // 喜欢跟风
      lossAversion: 1.2            // 损失厌恶系数
    },
    
    // 描述
    description: '谨慎的小散户，喜欢小额频繁交易，容易跟风和恐慌'
  },

  dog: {
    name: '中产狗',
    // 交易特点：稳健、中等、规律
    baseActivity: 0.80,           // 基础积极性 80%（提高）
    tradeFrequency: 'medium',
    avgTradeSize: 'medium',
    riskTolerance: 'medium',
    
    buyBias: 0.55,
    sellBias: 0.45,
    
    priceStrategy: {
      type: 'balanced',
      maxDeviation: 0.06,          // 扩大范围
      preferMarketPrice: false
    },
    
    shareRange: { min: 200, max: 700 },
    
    behaviors: {
      panicSell: false,
      followTrend: false,
      lossAversion: 1.0
    },
    
    description: '稳重的中产阶级，理性投资，不盲目跟风'
  },

  bear: {
    name: '大户熊',
    // 交易特点：大额、激进、操控
    baseActivity: 0.70,           // 基础积极性 70%（提高）
    tradeFrequency: 'low',
    avgTradeSize: 'large',
    riskTolerance: 'high',
    
    buyBias: 0.4,                  // 熊更倾向于做空/卖出
    sellBias: 0.6,
    
    priceStrategy: {
      type: 'aggressive',
      maxDeviation: 0.08,
      preferMarketPrice: false
    },
    
    shareRange: { min: 500, max: 1000 },
    
    behaviors: {
      panicSell: false,
      followTrend: false,
      lossAversion: 0.5,
      marketMaker: true,           // 做市商行为
      heavyHitter: true            // 大单交易
    },
    
    description: '资金雄厚的大户，喜欢大额交易，有时会刻意压低价格'
  },

  fox: {
    name: '游资狐',
    // 交易特点：狡猾、投机、快进快出
    baseActivity: 0.90,           // 基础积极性 90%（最高）
    tradeFrequency: 'very_high',
    avgTradeSize: 'medium',
    riskTolerance: 'very_high',
    
    buyBias: 0.5,
    sellBias: 0.5,
    
    priceStrategy: {
      type: 'speculative',
      maxDeviation: 0.08,
      preferMarketPrice: true
    },
    
    shareRange: { min: 200, max: 600 },
    
    behaviors: {
      panicSell: false,
      followTrend: false,
      lossAversion: 0.3,
      dayTrader: true,             // 日内交易
      quickProfit: true            // 快速获利
    },
    
    description: '聪明的投机者，快进快出，善于把握短期机会'
  },

  tiger: {
    name: '庄家虎',
    // 交易特点：主导、控制、策略性强
    baseActivity: 0.65,           // 基础积极性 65%（庄家不频繁交易）
    tradeFrequency: 'low',
    avgTradeSize: 'very_large',
    riskTolerance: 'very_high',
    
    buyBias: 0.5,
    sellBias: 0.5,
    
    priceStrategy: {
      type: 'strategic',
      maxDeviation: 0.07,
      preferMarketPrice: false
    },
    
    shareRange: { min: 500, max: 1000 },
    
    behaviors: {
      panicSell: false,
      followTrend: false,
      lossAversion: 0.2,
      marketMaker: true,
      priceController: true,       // 控盘能力
      patientHolder: true          // 耐心持有
    },
    
    description: '市场的主导者，资金量最大，有能力影响价格走势'
  },

  rabbit: {
    name: '量化兔',
    // 交易特点：程序化、高频、套利
    baseActivity: 0.95,           // 基础积极性 95%（最高）
    tradeFrequency: 'very_high',
    avgTradeSize: 'small',
    riskTolerance: 'medium',
    
    buyBias: 0.5,
    sellBias: 0.5,
    
    priceStrategy: {
      type: 'algorithmic',
      maxDeviation: 0.03,
      preferMarketPrice: true
    },
    
    shareRange: { min: 100, max: 500 },
    
    behaviors: {
      panicSell: false,
      followTrend: false,
      lossAversion: 0.8,
      highFrequency: true,         // 高频交易
      arbitrage: true,             // 套利策略
      meanReversion: true          // 均值回归
    },
    
    description: '量化交易高手，使用算法进行高频交易和套利'
  },

  cow: {
    name: '神秘牛',
    // 交易特点：神秘、不定、大额
    baseActivity: 0.75,           // 基础积极性 75%
    tradeFrequency: 'random',
    avgTradeSize: 'very_large',
    riskTolerance: 'unknown',
    
    buyBias: 0.6,                  // 牛市倾向
    sellBias: 0.4,
    
    priceStrategy: {
      type: 'mysterious',
      maxDeviation: 0.06,
      preferMarketPrice: false
    },
    
    shareRange: { min: 500, max: 1000 },
    
    behaviors: {
      panicSell: false,
      followTrend: false,
      lossAversion: 0.5,
      unpredictable: true,         // 行为不可预测
      longHolder: true             // 长期持有
    },
    
    description: '神秘的大户，行为难以预测，持有大量股份，倾向于长期投资'
  }
};

// 获取动物在当前季节的积极性
export const getActivityBySeason = (animalKey, season) => {
  const strategy = ANIMAL_STRATEGIES[animalKey];
  const seasonModifier = SEASON_ACTIVITY_MODIFIERS[season]?.[animalKey] || 1.0;
  
  if (!strategy) return 0.5;
  
  // 最终积极性 = 基础积极性 × 季节系数
  let activity = strategy.baseActivity * seasonModifier;
  
  // 限制在 0.1 - 0.95 之间
  return Math.max(0.1, Math.min(0.95, activity));
};

// 根据策略生成订单价格 - 修改：让价格更符合动物性格，不强制为撮合而偏离
// 【新增】highestBuyPrice 参数：当前最高买单价格，卖单时参考此价格
// 【修改】monthStartPrice 参数：月初价格，用于计算涨跌停限制
export const generateOrderPrice = (animalKey, currentPrice, orderType, priceHistory, highestBuyPrice, monthStartPrice) => {
  const strategy = ANIMAL_STRATEGIES[animalKey];
  if (!strategy) return currentPrice;
  
  const { priceStrategy, behaviors } = strategy;
  let priceDeviation = 0;
  
  // 【修改】使用月初价格作为涨跌停基准
  const basePrice = monthStartPrice || (priceHistory && priceHistory.length > 0 ? priceHistory[0] : currentPrice);
  const limitUpPrice = basePrice * 1.2;   // 涨停价
  const limitDownPrice = basePrice * 0.8; // 跌停价
  
  // 【修改】卖单时优先参考最高买单价格
  if (orderType === 'sell' && highestBuyPrice && highestBuyPrice > 0) {
    // 有买单时，卖单价格参考最高买单价格（略低于或等于）
    // 这样更容易成交，同时避免价格持续下跌
    const sellPremium = Math.random() * 0.02; // 0-2%的溢价
    const suggestedPrice = highestBuyPrice * (1 + sellPremium);
    
    // 但不超过策略允许的最大偏离
    const maxDeviationPrice = currentPrice * (1 + priceStrategy.maxDeviation);
    const minDeviationPrice = currentPrice * (1 - priceStrategy.maxDeviation);
    
    // 【修改】限制在涨跌停范围内（基于月初价格）
    const finalSuggestedPrice = Math.max(
      Math.min(suggestedPrice, maxDeviationPrice, limitUpPrice),
      minDeviationPrice,
      limitDownPrice
    );
    
    console.log(`📌 ${strategy.name} 卖单参考最高买单¥${highestBuyPrice.toFixed(3)}，建议价¥${finalSuggestedPrice.toFixed(3)}，涨跌停[¥${limitDownPrice.toFixed(3)}-¥${limitUpPrice.toFixed(3)}]`);
    return Number(finalSuggestedPrice.toFixed(3));
  }
  
  // 基础随机偏离 - 每种动物有自己的风格
  const randomDeviation = (Math.random() - 0.5) * priceStrategy.maxDeviation;
  
  // 根据价格策略类型计算偏离 - 修改为更自然的价格逻辑
  switch (priceStrategy.type) {
    case 'conservative':
      // 散户猫：保守型，不想买贵也不想卖便宜
      // 买入时：希望买便宜点，可能低于市价
      // 卖出时：希望卖贵点，可能高于市价
      if (orderType === 'buy') {
        priceDeviation = -Math.abs(randomDeviation) * 0.5; // 买单倾向于低于市价
      } else {
        priceDeviation = Math.abs(randomDeviation) * 0.5; // 卖单倾向于高于市价
      }
      break;
      
    case 'balanced':
      // 中产狗：平衡型，理性定价
      // 买卖都接近市价，轻微随机波动
      priceDeviation = randomDeviation * 0.6;
      break;
      
    case 'aggressive':
      // 大户熊：激进型，想要成交就给好价格
      // 买入时愿意出高价，卖出时愿意低价出
      if (orderType === 'buy') {
        priceDeviation = Math.abs(randomDeviation) * 0.8; // 买单愿意出更高价
      } else {
        priceDeviation = -Math.abs(randomDeviation) * 0.8; // 卖单愿意低价出
      }
      break;
      
    case 'speculative':
      // 游资狐：投机型，追涨杀跌
      if (priceHistory && priceHistory.length > 1) {
        const recentTrend = priceHistory[priceHistory.length - 1] - priceHistory[priceHistory.length - 2];
        if (recentTrend > 0) {
          // 上涨趋势：追涨
          priceDeviation = orderType === 'buy' ? 
            Math.abs(randomDeviation) * 0.7 : // 买入愿意追高
            Math.abs(randomDeviation) * 0.3;  // 卖出也要高价
        } else {
          // 下跌趋势：杀跌
          priceDeviation = orderType === 'sell' ? 
            -Math.abs(randomDeviation) * 0.7 : // 卖出愿意低价
            -Math.abs(randomDeviation) * 0.3;  // 买入也想低价
        }
      } else {
        priceDeviation = randomDeviation * 0.5;
      }
      break;
      
    case 'algorithmic':
      // 量化兔：算法型，均值回归
      priceDeviation = randomDeviation * 0.2; // 非常接近市价
      if (priceHistory && priceHistory.length > 5) {
        const avgPrice = priceHistory.slice(-5).reduce((a, b) => a + b, 0) / 5;
        // 均值回归：价格高于均值时卖单价格偏高，买单价格偏低
        if (currentPrice > avgPrice * 1.02) {
          priceDeviation += orderType === 'sell' ? 0.01 : -0.01;
        } else if (currentPrice < avgPrice * 0.98) {
          priceDeviation += orderType === 'buy' ? 0.01 : -0.01;
        }
      }
      break;
      
    case 'strategic':
      // 庄家虎：策略型，控盘行为
      // 作为庄家，买入时不想太高，卖出时不想太低
      if (orderType === 'buy') {
        priceDeviation = -Math.abs(randomDeviation) * 0.3; // 庄家买入时压价
      } else {
        priceDeviation = Math.abs(randomDeviation) * 0.3; // 庄家卖出时抬高
      }
      break;
      
    case 'mysterious':
      // 神秘牛：神秘型，随机但有一定逻辑
      priceDeviation = randomDeviation * 0.4;
      // 倾向于长期持有，买入时不在意价格，卖出时也不急
      break;
      
    default:
      priceDeviation = randomDeviation * 0.3;
  }
  
  const finalPrice = currentPrice * (1 + priceDeviation);
  
  // 【修改】涨跌停限制基于月初价格
  const clampedPrice = Math.max(limitDownPrice, Math.min(limitUpPrice, finalPrice));
  
  // 如果价格被限制在涨跌停价，打印日志
  if (clampedPrice !== finalPrice) {
    console.log(`📊 ${strategy.name} 订单价格被涨跌停限制: ¥${finalPrice.toFixed(3)} -> ¥${clampedPrice.toFixed(3)}，涨跌停[¥${limitDownPrice.toFixed(3)}-¥${limitUpPrice.toFixed(3)}]`);
  }
  
  return Number(clampedPrice.toFixed(3));
};

// 根据策略生成订单数量
export const generateOrderShares = (animalKey, playerShares, playerMoney, currentPrice) => {
  const strategy = ANIMAL_STRATEGIES[animalKey];
  if (!strategy) return 100;
  
  const { shareRange, avgTradeSize, behaviors } = strategy;
  let shares;
  
  // 基础数量：在范围内随机
  const range = shareRange.max - shareRange.min;
  shares = shareRange.min + Math.floor(Math.random() * (range / 100 + 1)) * 100;
  
  // 根据交易量特点调整
  switch (avgTradeSize) {
    case 'small':
      shares = Math.min(shares, 300);
      break;
    case 'medium':
      shares = Math.min(shares, 600);
      break;
    case 'large':
    case 'very_large':
      // 大户可能交易更大数量
      if (behaviors.heavyHitter || behaviors.marketMaker) {
        shares = Math.max(shares, 500);
      }
      break;
  }
  
  // 确保不超过玩家承受能力
  if (playerShares !== undefined) {
    shares = Math.min(shares, playerShares);
  }
  
  // 确保是100的整数倍
  shares = Math.floor(shares / 100) * 100;
  shares = Math.max(100, shares);
  
  return shares;
};

// 根据策略决定买卖方向
export const decideTradeDirection = (animalKey, player, currentPrice, priceHistory) => {
  const strategy = ANIMAL_STRATEGIES[animalKey];
  if (!strategy) return Math.random() > 0.5 ? 'buy' : 'sell';
  
  let buyProbability = strategy.buyBias;
  
  const { behaviors } = strategy;
  
  // 【新增】资金不足时更倾向于卖出
  if (player.money < player.initialMoney * 0.2) {
    // 资金低于20%时，大幅增加卖出概率
    buyProbability -= 0.4;
    console.log(`💰 ${strategy.name} 资金严重不足(${(player.money / player.initialMoney * 100).toFixed(0)}%)，倾向卖出`);
  } else if (player.money < player.initialMoney * 0.4) {
    // 资金低于40%时，增加卖出概率
    buyProbability -= 0.25;
    console.log(`💰 ${strategy.name} 资金不足(${(player.money / player.initialMoney * 100).toFixed(0)}%)，倾向卖出`);
  } else if (player.money < player.initialMoney * 0.6) {
    // 资金低于60%时，轻微增加卖出概率
    buyProbability -= 0.1;
  }
  
  // 根据特殊行为调整
  if (behaviors.panicSell && player.money < player.initialMoney * 0.5) {
    // 恐慌抛售：亏损严重时增加卖出概率
    buyProbability -= 0.3;
  }
  
  if (behaviors.followTrend && priceHistory && priceHistory.length > 2) {
    // 跟风行为：根据趋势调整
    const trend = priceHistory[priceHistory.length - 1] - priceHistory[priceHistory.length - 2];
    if (trend > 0) {
      buyProbability += 0.15; // 上涨时更想买
    } else {
      buyProbability -= 0.15; // 下跌时更想卖
    }
  }
  
  if (behaviors.meanReversion && priceHistory && priceHistory.length > 5) {
    // 均值回归：价格偏离时反向操作
    const avgPrice = priceHistory.slice(-5).reduce((a, b) => a + b, 0) / 5;
    if (currentPrice > avgPrice * 1.02) {
      buyProbability -= 0.1; // 高于均值倾向卖
    } else if (currentPrice < avgPrice * 0.98) {
      buyProbability += 0.1; // 低于均值倾向买
    }
  }
  
  // 限制概率范围（允许更低的买入概率以应对资金不足）
  buyProbability = Math.max(0.05, Math.min(0.8, buyProbability));
  
  return Math.random() < buyProbability ? 'buy' : 'sell';
};

// 市场流动性维护 - 调整价格和交易方向
// 【修改】添加 monthStartPrice 参数用于涨跌停限制
export const adjustForLiquidity = (animalKey, orderType, orderPrice, currentPrice, marketState, monthStartPrice) => {
  const { noSellDays, noBuyDays, totalBuyOrders, totalSellOrders } = marketState;
  const liquidityConfig = LIQUIDITY_CONFIG;
  const strategy = ANIMAL_STRATEGIES[animalKey];
  
  // 【修改】使用月初价格作为涨跌停基准
  const basePrice = monthStartPrice || currentPrice;
  const limitUpPrice = basePrice * 1.2;   // 涨停价
  const limitDownPrice = basePrice * 0.8; // 跌停价
  
  let adjustedPrice = orderPrice;
  let shouldForceSell = false;
  
  // 卖单不足时，买入方提高价格
  if (orderType === 'buy' && noSellDays >= liquidityConfig.noSellThreshold) {
    const priceBoost = liquidityConfig.buyPriceBoost[animalKey] || 0.02;
    // 根据缺货天数逐步提高价格
    const boostMultiplier = Math.min(noSellDays - liquidityConfig.noSellThreshold + 1, 3);
    adjustedPrice = orderPrice * (1 + priceBoost * boostMultiplier);
    console.log(`📊 ${strategy?.name || animalKey} 因卖单不足 ${noSellDays} 天，提价 ${(priceBoost * boostMultiplier * 100).toFixed(1)}%`);
  }
  
  // 买单不足时，持有大量股份的动物可能抛售
  if (orderType === 'sell' && noBuyDays >= liquidityConfig.noBuyThreshold) {
    const sellBoost = liquidityConfig.sellProbabilityBoost[animalKey] || 0.1;
    // 增加抛售倾向
    if (Math.random() < sellBoost) {
      shouldForceSell = true;
      console.log(`📊 ${strategy?.name || animalKey} 因买单不足 ${noBuyDays} 天，倾向抛售`);
    }
  }
  
  // 【修改】确保价格在涨跌停范围内（基于月初价格）
  adjustedPrice = Math.max(limitDownPrice, Math.min(limitUpPrice, adjustedPrice));
  
  return { adjustedPrice, shouldForceSell };
};

// 检查动物是否应该出门打工
export const checkShouldGoToWork = (animalKey, season, player) => {
  const workConfig = WORK_CONFIG;
  const strategy = ANIMAL_STRATEGIES[animalKey];
  
  // 已经在打工中的不触发
  if (player.workingUntil) return false;
  
  // 基础打工概率
  const seasonProbability = workConfig.probabilityBySeason[season] || 0.15;
  const animalLikelihood = workConfig.workLikelihood[animalKey] || 0.2;
  
  // 最终概率 = 季节概率 × 动物倾向
  const finalProbability = seasonProbability * animalLikelihood;
  
  // 资金不足时更可能打工（增强逻辑）
  let adjustedProbability = finalProbability;
  if (player.money < player.initialMoney * 0.2) {
    // 资金低于20%时，打工概率大幅增加
    adjustedProbability *= 3;
    console.log(`💼 ${strategy?.name || animalKey} 资金严重不足，急需打工！`);
  } else if (player.money < player.initialMoney * 0.3) {
    // 资金低于30%时，打工概率翻倍
    adjustedProbability *= 2.5;
    console.log(`💼 ${strategy?.name || animalKey} 资金不足，需要打工`);
  } else if (player.money < player.initialMoney * 0.5) {
    // 资金低于50%时，打工概率增加50%
    adjustedProbability *= 1.5;
  }
  
  // 如果完全没有资金（无法交易），直接触发打工
  if (player.money <= 0 && player.shares > 0) {
    console.log(`💼 ${strategy?.name || animalKey} 资金耗尽，强制外出打工！`);
    return true;
  }
  
  return Math.random() < adjustedProbability;
};

// 获取打工收益 - 【修改】改为按天计算
export const getWorkIncome = (animalKey) => {
  const workConfig = WORK_CONFIG;
  const salaryRange = workConfig.salaryRange[animalKey] || { min: 100, max: 300 };
  
  // 打工薪资：在范围内随机，确保最低100
  const income = Math.max(100, Math.floor(salaryRange.min + Math.random() * (salaryRange.max - salaryRange.min)));
  
  // 打工时长：5-10天
  const duration = workConfig.duration.min + Math.floor(Math.random() * (workConfig.duration.max - workConfig.duration.min + 1));
  
  return {
    income,
    duration, // 打工时长（天）
    durationType: 'days' // 标记为天数
  };
};

// 生成打工消息
export const getWorkMessage = (animalKey, isLeaving, income = 0) => {
  const strategy = ANIMAL_STRATEGIES[animalKey];
  const name = strategy?.name || animalKey;
  
  if (isLeaving) {
    const leavingMessages = {
      cat: `喵~ 我要出门打工一段时间啦，回来给你们带好吃的！`,
      dog: `汪汪~ 去赚点外快，很快回来！`,
      bear: `吼~ 出门找点事做...`,
      fox: `嘿嘿~ 发现一个赚钱的好机会，我去去就回~`,
      tiger: `嗷~ 去处理些事情...`, // 庄家虎几乎不打工
      rabbit: `蹦蹦~ 执行外部套利任务中，预计1-2个月后回归~`,
      cow: `哞~ ............出门.........`
    };
    return leavingMessages[animalKey] || `${name}出门打工了`;
  } else {
    const returnMessages = {
      cat: `喵喵~ 我回来啦！这次打工赚了 ¥${income}，可以继续交易了~`,
      dog: `汪~ 打工归来！赚了 ¥${income}，感觉更有信心了！`,
      bear: `吼吼~ 回来了，赚了点钱...`,
      fox: `嘻嘻~ 回来啦！这次赚了 ¥${income}，又可以搞事情了~`,
      tiger: `嗷~ 回来了。`, // 庄家虎几乎不打工
      rabbit: `蹦蹦~ 外部套利完成，收益 ¥${income}，算法优化完成~`,
      cow: `哞~ 回来了...带了 ¥${income}...`
    };
    return returnMessages[animalKey] || `${name}打工归来，赚了 ¥${income}`;
  }
};

export default ANIMAL_STRATEGIES;
