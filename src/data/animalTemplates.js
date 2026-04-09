// 动物模板配置 - 用于在游戏中动态加入新的动物玩家
// 每个动物都有独特的属性和资金配置（不分配股票，需要自己购买）

export const ANIMAL_TEMPLATES = {
  // 现有动物模板（与 gameState 中的 INITIAL_PLAYERS 一致）
  cat: {
    name: '散户猫',
    template: {
      money: 2000,
      shares: 0, // 不分配股票
      icon: '🐱',
      emotion: 'neutral',
      description: '谨慎的小散户，喜欢小额频繁交易，容易跟风和恐慌',
      riskLevel: 'low',
      tradeStyle: '谨慎型'
    }
  },
  
  dog: {
    name: '中产狗',
    template: {
      money: 5000,
      shares: 0, // 不分配股票
      icon: '🐶',
      emotion: 'neutral',
      description: '稳重的中产阶级，理性投资，不盲目跟风',
      riskLevel: 'medium',
      tradeStyle: '稳健型'
    }
  },
  
  bear: {
    name: '大户熊',
    template: {
      money: 8000,
      shares: 0, // 不分配股票
      icon: '🐻',
      emotion: 'neutral',
      description: '资金雄厚的大户，喜欢大额交易，有时会刻意压低价格',
      riskLevel: 'high',
      tradeStyle: '激进型'
    }
  },
  
  fox: {
    name: '游资狐',
    template: {
      money: 10000,
      shares: 0, // 不分配股票
      icon: '🦊',
      emotion: 'neutral',
      description: '聪明的投机者，快进快出，善于把握短期机会',
      riskLevel: 'very_high',
      tradeStyle: '投机型'
    }
  },
  
  tiger: {
    name: '庄家虎',
    template: {
      money: 50000,
      shares: 0, // 不分配股票
      icon: '🐯',
      emotion: 'neutral',
      description: '市场的主导者，资金量最大，有能力影响价格走势',
      riskLevel: 'very_high',
      tradeStyle: '策略型'
    }
  },
  
  rabbit: {
    name: '量化兔',
    template: {
      money: 20000,
      shares: 0, // 不分配股票
      icon: '🐰',
      emotion: 'neutral',
      description: '量化交易高手，使用算法进行高频交易和套利',
      riskLevel: 'medium',
      tradeStyle: '算法型'
    }
  },
  
  cow: {
    name: '神秘牛',
    template: {
      money: 10000,
      shares: 0, // 不分配股票
      icon: '🐮',
      emotion: 'neutral',
      description: '神秘的大户，行为难以预测，倾向于长期投资',
      riskLevel: 'unknown',
      tradeStyle: '神秘型'
    }
  },
  
  // 额外动物模板 - 游戏开始时就加入
  panda: {
    name: '懒熊猫',
    template: {
      money: 6000,
      shares: 0, // 不分配股票
      icon: '🐼',
      emotion: 'neutral',
      description: '悠闲的投资者，交易频率低，喜欢长期持有',
      riskLevel: 'low',
      tradeStyle: '长线型'
    }
  },
  
  lion: {
    name: '狮子王',
    template: {
      money: 30000,
      shares: 0, // 不分配股票
      icon: '🦁',
      emotion: 'neutral',
      description: '市场王者，资金雄厚，喜欢掌控全局',
      riskLevel: 'very_high',
      tradeStyle: '霸主型'
    }
  },
  
  elephant: {
    name: '大象象',
    template: {
      money: 15000,
      shares: 0, // 不分配股票
      icon: '🐘',
      emotion: 'neutral',
      description: '市场巨无霸，行动缓慢但影响巨大，长期持有者',
      riskLevel: 'low',
      tradeStyle: '巨鳄型'
    }
  },
  
  wolf: {
    name: '独狼哥',
    template: {
      money: 25000,
      shares: 0, // 不分配股票
      icon: '🐺',
      emotion: 'neutral',
      description: '独行侠，喜欢独自操作，精准打击',
      riskLevel: 'high',
      tradeStyle: '独狼型'
    }
  },
  
  monkey: {
    name: '调皮猴',
    template: {
      money: 8000,
      shares: 0, // 不分配股票
      icon: '🐒',
      emotion: 'neutral',
      description: '喜欢频繁交易，追求短期收益，灵活多变',
      riskLevel: 'medium',
      tradeStyle: '灵活型'
    }
  },
  
  owl: {
    name: '猫头鹰',
    template: {
      money: 12000,
      shares: 0, // 不分配股票
      icon: '🦉',
      emotion: 'neutral',
      description: '夜间观察者，善于分析，冷静决策',
      riskLevel: 'medium',
      tradeStyle: '分析型'
    }
  },
  
  snake: {
    name: '青蛇妹',
    template: {
      money: 18000,
      shares: 0, // 不分配股票
      icon: '🐍',
      emotion: 'neutral',
      description: '冷血投资者，耐心等待机会，一击必中',
      riskLevel: 'high',
      tradeStyle: '潜伏型'
    }
  },
  
  pig: {
    name: '存钱猪',
    template: {
      money: 5000,
      shares: 0, // 不分配股票
      icon: '🐷',
      emotion: 'neutral',
      description: '喜欢存钱，不喜欢冒险，稳定增长',
      riskLevel: 'low',
      tradeStyle: '储蓄型'
    }
  }
};

// 动物状态枚举
export const ANIMAL_STATUS = {
  ACTIVE: 'active',           // 正常活跃
  WORKING: 'working',         // 打工中
  HIBERNATING: 'hibernating', // 冬眠中
  LEFT: 'left',               // 已离开（破产退出）
  JOINING: 'joining'          // 即将加入
};

// 冬眠配置（仅熊类动物会冬眠）
export const HIBERNATION_CONFIG = {
  // 会冬眠的动物
  hibernatingAnimals: ['bear', 'panda'],
  // 冬眠季节（冬季：11月-1月，即月份 11, 0, 1）
  hibernationMonths: [11, 0, 1],
  // 冬眠期间交易概率（很低）
  tradeProbabilityDuringHibernation: 0.1,
};

// 动物离开/加入配置
export const ANIMAL_LIFECYCLE_CONFIG = {
  // 离开条件
  leaveConditions: {
    minMoney: 100,           // 资金低于此值时必须打工（不会离开游戏）
    bankruptThreshold: 0,    // 完全破产时才会离开
  },
  
  // 加入条件
  joinConditions: {
    minPlayers: 3,           // 最少玩家数量
    maxPlayers: 10,          // 最多玩家数量
    joinProbability: 0.05,   // 每月有新动物加入的概率
    minMonthsBeforeJoin: 3,  // 游戏开始几个月后才能有新动物加入
  },
  
  // 打工配置
  workConfig: {
    minDurationDays: 5,      // 最短打工时长（天）
    maxDurationDays: 10,     // 最长打工时长（天）
    durationOptions: [5, 7, 10], // 可选打工时长（天）
    minSalary: 100,          // 最低薪资
    salaryPerDay: {
      low: 20,               // 低收入动物每日薪资
      medium: 30,            // 中等收入动物每日薪资
      high: 50               // 高收入动物每日薪资
    }
  },
  
  // 季度动物加入/离开配置
  quarterlyConfig: {
    // 新动物加入概率（每季度检查一次）
    joinProbability: 0.3,    // 30%概率有新动物加入
    // 动物离开概率（每季度检查一次，根据资金和季节）
    leaveProbability: {
      base: 0.1,             // 基础离开概率
      lowMoney: 0.3,         // 资金低于初始50%时的离开概率加成
      seasonModifiers: {
        spring: 0.8,         // 春天离开概率较低
        summer: 1.0,         // 夏天正常
        autumn: 1.2,         // 秋天离开概率略高
        winter: 1.5          // 冬天离开概率最高
      }
    }
  }
};

// 获取动物薪资范围
export const getAnimalSalaryRange = (animalKey) => {
  const template = ANIMAL_TEMPLATES[animalKey];
  if (!template) return { min: 100, max: 500 };
  
  const baseMoney = template.template.money;
  const salaryPerDay = baseMoney > 20000 
    ? ANIMAL_LIFECYCLE_CONFIG.workConfig.salaryPerDay.high
    : baseMoney > 5000 
      ? ANIMAL_LIFECYCLE_CONFIG.workConfig.salaryPerDay.medium
      : ANIMAL_LIFECYCLE_CONFIG.workConfig.salaryPerDay.low;
  
  // 返回每日薪资范围
  return {
    min: salaryPerDay,
    max: salaryPerDay * 3, // 最高可达3倍
    perDay: salaryPerDay
  };
};

// 根据天数计算薪资
export const calculateWorkSalary = (animalKey, days) => {
  const template = ANIMAL_TEMPLATES[animalKey];
  const baseMoney = template?.template?.money || 2000;
  const salaryPerDay = baseMoney > 20000 
    ? ANIMAL_LIFECYCLE_CONFIG.workConfig.salaryPerDay.high
    : baseMoney > 5000 
      ? ANIMAL_LIFECYCLE_CONFIG.workConfig.salaryPerDay.medium
      : ANIMAL_LIFECYCLE_CONFIG.workConfig.salaryPerDay.low;
  
  // 基础薪资 = 每日薪资 × 天数
  const baseSalary = salaryPerDay * days;
  // 随机加成 0-50%
  const bonus = Math.floor(baseSalary * Math.random() * 0.5);
  // 确保最低薪资
  const totalSalary = baseSalary + bonus;
  return Math.max(ANIMAL_LIFECYCLE_CONFIG.workConfig.minSalary, totalSalary);
};

// 获取随机新动物
export const getRandomNewAnimal = (existingKeys) => {
  const availableKeys = Object.keys(ANIMAL_TEMPLATES).filter(
    key => !existingKeys.includes(key)
  );
  
  if (availableKeys.length === 0) return null;
  
  const randomKey = availableKeys[Math.floor(Math.random() * availableKeys.length)];
  return {
    key: randomKey,
    ...ANIMAL_TEMPLATES[randomKey]
  };
};
