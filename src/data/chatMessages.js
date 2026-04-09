// 聊天室消息配置 - 动物下单时的自言自语
// 与点击动物卡片的对话区分开，这里专门针对交易场景

export const chatMessages = {
  // 猫咪 - 散户风格：谨慎、小额、容易恐慌
  cat: {
    buy: [
      "喵~ 看着行情不错，小试牛刀买一点~",
      "喵呜~ 大家都在买，我...我也跟着买一点点试试？",
      "呼噜~ 今天运气应该不错，买100股试试水~",
      "喵喵~ 这个价格感觉可以入场了，就买一点点哦~",
      "喵~ 虽然有点怕，但还是要尝试的！",
      "呼噜呼噜~ 小额建仓，安全第一喵~",
      "喵呜~ 希望这次不要亏，买点试试~",
      "喵~ 跟着大家买应该不会错吧？就买一点点~"
    ],
    sell: [
      "喵... 还是落袋为安吧，卖了卖了~",
      "喵呜~ 有点慌，先卖一点看看情况...",
      "呼噜... 怎么感觉不太对劲，我先跑为敬！",
      "喵喵~ 赚了一点点就满足啦，卖出~",
      "喵~ 还是保守一点好，卖掉一些压压惊~",
      "呼噜~ 这行情让我有点紧张，卖掉部分观望~",
      "喵呜~ 小赚即走，绝不当贪心的猫~",
      "喵~ 看这架势，我还是先撤退比较好..."
    ],
    weatherChange: {
      sunny: "喵~ 太阳出来啦，心情也变好了呢！",
      cloudy: "喵... 天阴阴的，感觉今天会有变化~",
      rainy: "喵呜~ 下雨了，交易要更小心才行~",
      snowy: "喵喵~ 下雪了，好想窝在暖气旁边~",
      windy: "呼噜~ 风好大，市场可能要波动了~",
      foggy: "喵~ 雾蒙蒙的，什么都看不清楚..."
    },
    seasonChange: {
      spring: "喵喵~ 春天来了，万物复苏，也许市场也要活跃起来了~",
      summer: "呼噜~ 夏天到啦，好热好想睡觉...交易节奏要放慢~",
      autumn: "喵~ 秋天呢，收获的季节，希望我也能有收获~",
      winter: "喵呜~ 冬天好冷，交易要更谨慎才行..."
    }
  },

  // 狗狗 - 中产风格：稳健、理性、规律
  dog: {
    buy: [
      "汪~ 经过分析，这个价位比较合理，买入~",
      "汪汪~ 稳健投资最重要，按计划建仓~",
      "汪呜~ 基本面没问题，这个价格可以接受~",
      "汪~ 长期来看有上涨空间，逐步买入~",
      "汪汪~ 不急不躁，理性投资才是王道~",
      "汪~ 按照我的投资计划，今天该买入了~",
      "汪呜~ 市场估值合理，可以适当加仓~",
      "汪~ 不跟风不恐慌，坚持自己的节奏~"
    ],
    sell: [
      "汪~ 达到预期收益目标，按计划卖出~",
      "汪汪~ 止盈是投资的智慧，锁定利润~",
      "汪呜~ 这个位置风险有点高，减仓观望~",
      "汪~ 理性止盈，不贪不躁~",
      "汪汪~ 按投资纪律，该卖就卖~",
      "汪~ 投资要有计划，卖出要果断~",
      "汪呜~ 获利了结，等待下一个机会~",
      "汪~ 风险管理最重要，适当减仓~"
    ],
    weatherChange: {
      sunny: "汪~ 好天气！心情愉快，投资也更有信心~",
      cloudy: "汪汪~ 多云的天气，市场可能要震荡~",
      rainy: "汪~ 下雨天，正好在家好好研究行情~",
      snowy: "汪呜~ 下雪啦，市场节奏可能会变慢~",
      windy: "汪~ 大风天，要抓住机会哦~",
      foggy: "汪汪~ 雾天视野不清晰，投资要更谨慎~"
    },
    seasonChange: {
      spring: "汪~ 春暖花开，市场也要活跃起来了~",
      summer: "汪汪~ 夏日炎炎，保持冷静很重要~",
      autumn: "汪~ 秋高气爽，是投资的好时节~",
      winter: "汪呜~ 冬天来了，市场可能进入休整期~"
    }
  },

  // 熊 - 大户风格：大额、激进、做市商
  bear: {
    buy: [
      "吼~ 现在是建仓的好时机，大举买入~",
      "吼吼~ 作为大户，我要为市场提供流动性！",
      "吼~ 这个位置可以压一压，大单买入~",
      "吼吼~ 资金充裕，逢低吸纳~",
      "吼~ 市场需要我这样的参与者，大手笔入场~",
      "吼吼~ 机会来了，直接下大单~",
      "吼~ 看准了就干，大额买入！",
      "吼吼~ 我入场就是要影响市场的~"
    ],
    sell: [
      "吼~ 差不多了，大举卖出~",
      "吼吼~ 获利丰厚，果断减仓~",
      "吼~ 让市场知道我的存在，大单卖出~",
      "吼吼~ 高位止盈，大额出场~",
      "吼~ 市场太热了，我来降降温~",
      "吼吼~ 大户要有大户的格局，果断卖出~",
      "吼~ 见好就收，大单出货~",
      "吼吼~ 我卖出的信号你们注意到了吗？~"
    ],
    weatherChange: {
      sunny: "吼~ 阳光明媚，市场也要明朗起来~",
      cloudy: "吼吼~ 阴天，正好默默吸筹~",
      rainy: "吼~ 下雨天，交易量可能会下降~",
      snowy: "吼吼~ 下雪了，冬眠的感觉...不对，交易继续~",
      windy: "吼~ 大风天，市场波动加大~",
      foggy: "吼吼~ 雾蒙蒙的，正好大单进出~"
    },
    seasonChange: {
      spring: "吼~ 春天来了，冬眠结束，交易要积极起来~",
      summer: "吼吼~ 夏天到了，虽然热但交易不能停~",
      autumn: "吼~ 秋天疯狂进食...不对，是疯狂交易！~",
      winter: "吼吼~ 冬天...本该冬眠的，但市场诱惑太大~"
    }
  },

  // 狐狸 - 游资风格：狡猾、投机、快进快出
  fox: {
    buy: [
      "嘻嘻~ 发现了一个好机会，快进快出~",
      "嘿嘿~ 这个波动可以做一波短线~",
      "呵呵~ 机会稍纵即逝，果断买入~",
      "嘻嘻~ 投机嘛，就是要快准狠~",
      "嘿嘿~ 看准了，杀进去捞一笔就走~",
      "呵呵~ 短线操作，今天买明天可能就卖~",
      "嘻嘻~ 波动就是机会，快速建仓~",
      "嘿嘿~ 抓住这个机会，快进快出！~"
    ],
    sell: [
      "嘻嘻~ 差不多了，见好就收~",
      "嘿嘿~ 快进快出，获利了结~",
      "呵呵~ 这一波赚到了，果断撤离~",
      "嘻嘻~ 投机要有纪律，卖！~",
      "嘿嘿~ 不能贪心，落袋为安~",
      "呵呵~ 短线交易，从不恋战~",
      "嘻嘻~ 机会抓住了，现在跑~",
      "嘿嘿~ 见好就收是投机的精髓~"
    ],
    weatherChange: {
      sunny: "嘻嘻~ 好天气，好机会也许就在眼前~",
      cloudy: "嘿嘿~ 阴天容易出意外，要更机灵~",
      rainy: "呵呵~ 下雨天，市场可能要转向~",
      snowy: "嘻嘻~ 下雪了，机会可能藏在混乱中~",
      windy: "嘿嘿~ 大风天，波动加大正是投机好时机~",
      foggy: "呵呵~ 雾天看不清？那就更要快进快出~"
    },
    seasonChange: {
      spring: "嘻嘻~ 春天万物复苏，投机机会也多了~",
      summer: "嘿嘿~ 夏天热，短线操作要快~",
      autumn: "呵呵~ 秋天收获季节，该收获利润了~",
      winter: "嘻嘻~ 冬天冷，市场也冷，投机要谨慎~"
    }
  },

  // 老虎 - 庄家风格：主导、控制、策略
  tiger: {
    buy: [
      "嗷~ 作为庄家，我要稳住市场~",
      "嗷嗷~ 现在拉升的好时机，大举买入~",
      "嗷~ 控盘需要资金，果断入场~",
      "嗷嗷~ 市场信心不足，我来提振~",
      "嗷~ 有我坐镇，市场不会乱~",
      "嗷嗷~ 大资金入场，目标明确~",
      "嗷~ 现在的价位值得布局~",
      "嗷嗷~ 庄家入场，跟随者注意了~"
    ],
    sell: [
      "嗷~ 高位了，逐步出货~",
      "嗷嗷~ 稳步减持，不引起恐慌~",
      "嗷~ 庄家要收网了，注意信号~",
      "嗷嗷~ 控盘结束，适度减仓~",
      "嗷~ 该变现了，大单卖出~",
      "嗷嗷~ 市场过热，我来降降温~",
      "嗷~ 高位派发，时机正好~",
      "嗷嗷~ 跟随者注意，我在出货了~"
    ],
    weatherChange: {
      sunny: "嗷~ 阳光灿烂，市场情绪高涨~",
      cloudy: "嗷嗷~ 阴天，正好默默吸筹~",
      rainy: "嗷~ 下雨了，市场情绪可能低落~",
      snowy: "嗷嗷~ 下雪，庄家也要休息休息~",
      windy: "嗷~ 大风天，市场波动，正好操作~",
      foggy: "嗷嗷~ 雾天，市场迷雾重重，更要控盘~"
    },
    seasonChange: {
      spring: "嗷~ 春天，新的一年布局开始~",
      summer: "嗷嗷~ 夏天市场活跃，控盘更有利~",
      autumn: "嗷~ 秋天，收获的季节到了~",
      winter: "嗷嗷~ 冬天，休整期，为来年做准备~"
    }
  },

  // 兔子 - 量化风格：程序化、高频、算法
  rabbit: {
    buy: [
      "蹦蹦~ 算法信号触发，自动买入~",
      "跳跳~ 均值回归策略启动，入场~",
      "蹦蹦~ 量化模型显示买入信号~",
      "跳跳~ 高频交易模式，快速建仓~",
      "蹦蹦~ 统计套利机会出现，买入~",
      "跳跳~ 模型计算结果：买入~",
      "蹦蹦~ 算法执行中，自动下单~",
      "跳跳~ 量化分析完成，触发买单~"
    ],
    sell: [
      "蹦蹦~ 止盈条件触发，自动卖出~",
      "跳跳~ 算法检测风险，执行卖出~",
      "蹦蹦~ 量化模型显示卖出信号~",
      "跳跳~ 高频交易完成，快速出场~",
      "蹦蹦~ 策略到期，自动平仓~",
      "跳跳~ 模型计算结果：卖出~",
      "蹦蹦~ 算法执行完成，下单卖出~",
      "跳跳~ 量化分析完成，触发卖单~"
    ],
    weatherChange: {
      sunny: "蹦蹦~ 天气数据已纳入模型计算~",
      cloudy: "跳跳~ 多云参数更新，调整策略~",
      rainy: "蹦蹦~ 雨天因子影响，优化模型~",
      snowy: "跳跳~ 雪天数据异常，重新校准~",
      windy: "蹦蹦~ 大风天波动率上升，策略调整~",
      foggy: "跳跳~ 雾天数据不确定性增加~"
    },
    seasonChange: {
      spring: "蹦蹦~ 春季参数已更新，模型重启~",
      summer: "跳跳~ 夏季因子调整完毕~",
      autumn: "蹦蹦~ 秋季参数优化完成~",
      winter: "跳跳~ 冬季模式启动，频率调整~"
    }
  },

  // 奶牛 - 神秘风格：不可预测、长线持有
  cow: {
    buy: [
      "哞~ ............买入~",
      "哞哞~ 一个神秘的理由让我买入~",
      "哞~ 也许你知道，也许不知道~",
      "哞哞~ 我看到了什么，买入~",
      "哞~ 神秘的力量在召唤我~",
      "哞哞~ 命运告诉我，该买入了~",
      "哞~ 不需要解释，只是买入~",
      "哞哞~ 一切都是命运的安排~"
    ],
    sell: [
      "哞~ ............卖出~",
      "哞哞~ 时机成熟了~",
      "哞~ 该走了，就这样~",
      "哞哞~ 神秘的信号，卖出~",
      "哞~ 我知道的，你们不知道~",
      "哞哞~ 时间到了，自然要卖~",
      "哞~ 不需要理由，只是卖出~",
      "哞哞~ 天机不可泄露~"
    ],
    weatherChange: {
      sunny: "哞~ 阳光下，我看到了什么...~",
      cloudy: "哞哞~ 云层后面，有神秘的力量~",
      rainy: "哞~ 雨水中隐藏着机会~",
      snowy: "哞哞~ 雪的下面，是沉睡的秘密~",
      windy: "哞~ 风带来了远方的信息~",
      foggy: "哞哞~ 雾中...我知道该怎么做~"
    },
    seasonChange: {
      spring: "哞~ 春天，新的轮回开始~",
      summer: "哞哞~ 夏天的能量在聚集~",
      autumn: "哞~ 秋天，命运的转折点~",
      winter: "哞哞~ 冬天，万物归于平静~"
    }
  }
};

// 莫莫鸟播报配置 - 森林播报员风格
// 莫莫鸟性格：活泼、可爱、有点八卦、喜欢用"啾啾"语气词
export const momoBirdAnnouncements = {
  // 开场白 - 莫莫鸟活泼开场
  opening: [
    "🐦 莫莫鸟为您播报：啾啾~大家好！我是森林里最爱八卦的小鸟~",
    "🐦 莫莫鸟为您播报：新的一天开始啦，让我来看看今天有什么新鲜事~",
    "🐦 莫莫鸟为您播报：啾啾~欢迎来到森林交易市场！~"
  ],
  
  // 大单委托播报 - 莫莫鸟惊讶八卦的情绪
  bigOrder: (player, action, shares, price) => {
    const templates = [
      `🐦 莫莫鸟为您播报：哇！啾啾~${player}申请${action}${shares}股，委托价¥${price.toFixed(3)}，这笔单子好大呀！~`,
      `🐦 莫莫鸟为您播报：啾啾啾！${player}提交${action}委托${shares}股，莫莫鸟惊呆了！~`,
      `🐦 莫莫鸟为您播报：大新闻大新闻！${player}申请${action}${shares}股，等待撮合中~大家一起关注吧！~`,
      `🐦 莫莫鸟为您播报：啾~发现大额委托！${player}申请${action}${shares}股，这可是重要信号哦~`
    ];
    return templates[Math.floor(Math.random() * templates.length)];
  },
  
  // 庄家动向播报 - 莫莫鸟神秘小声的情绪
  marketMaker: (player, action, shares) => {
    const templates = [
      `🐦 莫莫鸟为您播报：嘘...庄家${player}提交${action}委托${shares}股，啾啾~这可是内部消息~`,
      `🐦 莫莫鸟为您播报：啾~${player}出手了！申请${action}${shares}股，聪明的投资者都在关注呢~`,
      `🐦 莫莫鸟为您播报：庄家${player}提交${action}委托${shares}股，啾啾啾~莫莫鸟悄悄告诉你们~`,
      `🐦 莫莫鸟为您播报：大户${player}申请${action}委托${shares}股，啾~可能有大动作哦~`
    ];
    return templates[Math.floor(Math.random() * templates.length)];
  },
  
  // 季节变化播报 - 莫莫鸟感叹的情绪
  seasonChange: (oldSeason, newSeason) => {
    const templates = [
      `🐦 莫莫鸟为您播报：啾啾~时间过得真快！${oldSeason}结束了，${newSeason}来啦！动物们要换节奏咯~`,
      `🐦 莫莫鸟为您播报：哇！${newSeason}到啦！告别${oldSeason}，市场也将焕然一新，啾啾好期待~`,
      `🐦 莫莫鸟为您播报：啾~季节变换！${newSeason}来临，动物们的交易热情要变化啦！~`,
      `🐦 莫莫鸟为您播报：${newSeason}来啦！啾啾~记得调整投资策略哦，莫莫鸟提醒您~`
    ];
    return templates[Math.floor(Math.random() * templates.length)];
  },
  
  // 天气变化播报 - 莫莫鸟关心提醒的情绪
  weatherChange: (oldWeather, newWeather) => {
    const templates = [
      `🐦 莫莫鸟为您播报：啾啾~天气变啦！${oldWeather}转${newWeather}，出门记得带伞...哦不对，是交易要小心~`,
      `🐦 莫莫鸟为您播报：哇！${newWeather}来啦！${oldWeather}走了，啾~动物们的情绪可能要波动哦~`,
      `🐦 莫莫鸟为您播报：啾啾啾~${newWeather}！天气会影响动物们的交易积极性呢~`,
      `🐦 莫莫鸟为您播报：啾~天气更新为${newWeather}！莫莫鸟提醒您关注市场变化~`
    ];
    return templates[Math.floor(Math.random() * templates.length)];
  },
  
  // 常规公告 - 莫莫鸟日常播报
  normal: [
    "🐦 莫莫鸟为您播报：啾啾~森林市场一切正常，莫莫鸟持续为您关注~",
    "🐦 莫莫鸟为您播报：投资有风险，啾~莫莫鸟提醒您理性交易哦~",
    "🐦 莫莫鸟为您播报：啾啾啾~市场平静中...莫莫鸟在枝头观察着一切~",
    "🐦 莫莫鸟为您播报：啾~今天有什么新鲜事呢？莫莫鸟继续守候~",
    "🐦 莫莫鸟为您播报：森林里的动物们都很活跃呢，啾啾~"
  ]
};

// 获取动物的聊天消息
export const getChatMessage = (animalType, messageType, extraInfo = null) => {
  const animalMessages = chatMessages[animalType] || chatMessages.cat;
  
  if (messageType === 'weatherChange' && extraInfo) {
    const weatherMsgs = animalMessages.weatherChange[extraInfo];
    return weatherMsgs || animalMessages.weatherChange.sunny;
  }
  
  if (messageType === 'seasonChange' && extraInfo) {
    const seasonMsgs = animalMessages.seasonChange[extraInfo];
    return seasonMsgs || animalMessages.seasonChange.spring;
  }
  
  const messages = animalMessages[messageType] || animalMessages.buy;
  return messages[Math.floor(Math.random() * messages.length)];
};

// 获取莫莫鸟播报
export const getMomoAnnouncement = (type, params = {}) => {
  switch (type) {
    case 'opening':
      return momoBirdAnnouncements.opening[Math.floor(Math.random() * momoBirdAnnouncements.opening.length)];
    case 'bigOrder':
      return momoBirdAnnouncements.bigOrder(params.player, params.action, params.shares, params.price);
    case 'marketMaker':
      return momoBirdAnnouncements.marketMaker(params.player, params.action, params.shares);
    case 'seasonChange':
      return momoBirdAnnouncements.seasonChange(params.oldSeason, params.newSeason);
    case 'weatherChange':
      return momoBirdAnnouncements.weatherChange(params.oldWeather, params.newWeather);
    default:
      return momoBirdAnnouncements.normal[Math.floor(Math.random() * momoBirdAnnouncements.normal.length)];
  }
};

// 动物名称映射
export const animalNames = {
  cat: '散户猫',
  dog: '中产狗',
  bear: '大户熊',
  fox: '游资狐',
  tiger: '庄家虎',
  rabbit: '量化兔',
  cow: '神秘牛'
};

// 日常闲聊消息
export const dailyChatMessages = {
  cat: [
    "喵~ 今天感觉运气不错，也许可以试试运气~",
    "呼噜~ 昨晚睡得太舒服了，差点不想起来交易~",
    "喵喵~ 听说森林那边的鱼市场今天有新鲜货！",
    "喵... 有时候觉得投资真的好难，不过我会继续努力的~",
    "呼噜呼噜~ 最近天气变化好大，要注意保暖喵~",
    "喵~ 今天不想交易了，就躺着看看吧~",
    "喵呜~ 感觉市场有点安静呢...",
    "喵喵~ 我发现了一个晒太阳的好地方！"
  ],
  dog: [
    "汪~ 早安！新的一天，新的机会！",
    "汪汪~ 昨天的投资分析做得不错，继续保持~",
    "汪~ 最近市场波动有点大，但我们要保持冷静~",
    "汪汪~ 今天打算好好研究一下行情走势~",
    "汪~ 健康的生活方式才能有好的投资心态~",
    "汪汪~ 森林晨跑完毕，开始一天的交易~",
    "汪~ 稳健投资，快乐生活~",
    "汪汪~ 今天心情不错，市场应该也会不错吧~"
  ],
  bear: [
    "吼~ 今天又是掌控市场的一天~",
    "吼吼~ 大户就要有大户的气魄~",
    "吼~ 市场的走势都在我的掌控之中~",
    "吼吼~ 有时候沉默也是一种策略~",
    "吼~ 今天不急着出手，先观望一下~",
    "吼吼~ 大资金有大资金的玩法~",
    "吼~ 做大户最重要的就是稳重~",
    "吼吼~ 市场需要我这样的稳定力量~"
  ],
  fox: [
    "嘻嘻~ 今天有没有什么好机会呢~",
    "嘿嘿~ 敏锐的嗅觉告诉我，今天可能有变化~",
    "嘻嘻~ 投机是我的天性，不过也要谨慎~",
    "嘿嘿~ 发现了一点点小机会，也许能捞一笔~",
    "嘻嘻~ 市场永远不缺机会，就看能不能抓住~",
    "嘿嘿~ 快进快出，从不恋战~",
    "嘻嘻~ 今天心情好，交易也要灵活~",
    "嘿嘿~ 投机不是赌博，是智慧的博弈~"
  ],
  tiger: [
    "嗷~ 庄家的一天从观察市场开始~",
    "嗷嗷~ 今天的策略已经在脑海中形成~",
    "嗷~ 控盘需要耐心和智慧~",
    "嗷嗷~ 市场有我坐镇，不会乱~",
    "嗷~ 庄家的字典里没有慌张~",
    "嗷嗷~ 领导市场是我的责任~",
    "嗷~ 每一步都要深思熟虑~",
    "嗷嗷~ 市场的节奏由我来把控~"
  ],
  rabbit: {
    normal: [
      "蹦蹦~ 算法今天运行状态良好~",
      "跳跳~ 数据分析显示今天可能平稳~",
      "蹦蹦~ 模型优化完成，准备执行~",
      "跳跳~ 高频交易持续运行中~",
      "蹦蹦~ 今天的数据量适中，处理顺利~",
      "跳跳~ 算法从不休息，继续监控~",
      "蹦蹦~ 统计套利机会检测中~",
      "跳跳~ 量化投资，理性决策~"
    ]
  },
  cow: {
    normal: [
      "哞~ ............今天............平静............",
      "哞哞~ 命运的指针............指向今天............",
      "哞~ 万物皆有定数............市场也不例外............",
      "哞哞~ ............今天............有什么会发生的............",
      "哞~ 神秘的力量............在流动............",
      "哞哞~ ............我感受到了............什么............",
      "哞~ 时间............空间............市场............",
      "哞哞~ ............一切............都在命运之中............"
    ]
  }
};

// 年度大会回忆消息
export const annualMeetingChatMessages = {
  cat: [
    "喵~ 还记得去年的年度大会吗？狮王的致辞好激动人心！",
    "喵喵~ 去年大会我捐了款呢，帮助小鸟们感觉真好~",
    "呼噜~ 去年大会上大家都好厉害，我也要加油！",
    "喵~ 年度大会是一年中最期待的活动呢~",
    "喵呜~ 希望今年的大会我也能有好的成绩~"
  ],
  dog: [
    "汪~ 去年的年度大会真是精彩，学到了很多！",
    "汪汪~ 年度大会是展示一年成果的好机会~",
    "汪~ 还记得去年大会上大家的发言，很有启发~",
    "汪汪~ 每年最期待的就是森林年度大会了~",
    "汪~ 去年的捐款环节让我感到很温暖~"
  ],
  bear: [
    "吼~ 去年的大会，我可是名列前茅~",
    "吼吼~ 年度大会是展示大户实力的舞台~",
    "吼~ 去年捐款环节我可是捐了不少~",
    "吼吼~ 大户就要有大户的样子，年度大会见真章~",
    "吼~ 期待今年的年度大会，我会更出色~"
  ],
  fox: [
    "嘻嘻~ 去年大会上我的成绩还不错呢~",
    "嘿嘿~ 年度大会是总结经验的好机会~",
    "嘻嘻~ 去年捐款的感觉真好，今年继续~",
    "嘿嘿~ 每年大会都有惊喜，今年也不会例外~",
    "嘻嘻~ 期待今年大会，投机也有春天~"
  ],
  tiger: [
    "嗷~ 去年大会上我是年度首富~",
    "嗷嗷~ 年度大会展示庄家的风范~",
    "嗷~ 去年捐款支持幼鸟保护，是领袖的责任~",
    "嗷嗷~ 每年的大会都是新的起点~",
    "嗷~ 今年大会，我也要继续保持领先~"
  ],
  rabbit: [
    "蹦蹦~ 去年大会上我的算法表现不错~",
    "跳跳~ 年度大会是检验策略效果的时候~",
    "蹦蹦~ 去年的数据统计显示，量化策略有效~",
    "跳跳~ 年度大会总结，模型优化方向明确~",
    "蹦蹦~ 今年大会，算法会更进一步~"
  ],
  cow: [
    "哞~ ............去年的大会............命运已记载............",
    "哞哞~ ............年度大会............是轮回的节点............",
    "哞~ ............去年捐款............是命运的安排............",
    "哞哞~ ............每年大会............都有神秘的力量............",
    "哞~ ............今年大会............天机已显现............"
  ]
};

// 天气相关聊天消息
export const weatherChatMessages = {
  cat: {
    sunny: ["喵~ 阳光真好，想出去晒太阳~", "喵喵~ 天气好心情也好~", "呼噜~ 这种天气最适合懒洋洋地躺着~"],
    cloudy: ["喵... 天阴阴的，有点困~", "喵呜~ 云好多，会不会下雨呢~", "喵~ 阴天也挺好的，不刺眼~"],
    rainy: ["喵呜~ 下雨了，不想出门~", "喵~ 雨声让我想睡觉~", "喵喵~ 记得收衣服喵~"],
    snowy: ["喵！下雪了！好想玩~", "喵喵~ 白茫茫的一片好漂亮~", "呼噜~ 好冷好冷，不想动~"],
    windy: ["喵~ 风好大，要抓紧东西~", "喵呜~ 头发都被吹乱了~", "喵~ 大风天的市场也可能波动~"],
    foggy: ["喵... 看不清远处~", "喵~ 雾蒙蒙的，要小心~", "喵呜~ 雾天视野不好，投资也要谨慎~"]
  },
  dog: {
    sunny: ["汪~ 天气真好！适合运动！", "汪汪~ 阳光明媚，心情舒畅~", "汪~ 好天气带来好运气~"],
    cloudy: ["汪~ 多云的天气也挺好", "汪汪~ 虽然没太阳，但不热~", "汪~ 天气适中，适合思考~"],
    rainy: ["汪~ 下雨了，正好在家研究行情~", "汪汪~ 雨天也有雨天的好处~", "汪~ 注意保暖，别感冒了~"],
    snowy: ["汪！下雪啦！好开心！", "汪汪~ 雪景真美~", "汪~ 冬天来了，准备过年~"],
    windy: ["汪~ 风大的天气要稳住~", "汪汪~ 大风可能带来变化~", "汪~ 保持稳定最重要~"],
    foggy: ["汪~ 雾天视野不清晰，投资要谨慎~", "汪汪~ 迷雾中要保持方向~", "汪~ 等雾散去再做决定~"]
  },
  bear: {
    sunny: ["吼~ 阳光不错，精神也好~", "吼吼~ 好天气适合大动作~", "吼~ 天气好，市场也可能向好~"],
    cloudy: ["吼~ 阴天更适合大户潜伏~", "吼吼~ 没有太阳也不影响我~", "吼~ 天气平静，市场也平静~"],
    rainy: ["吼~ 下雨天，正好观望~", "吼吼~ 雨天的节奏放慢一些~", "吼~ 大户不惧风雨~"],
    snowy: ["吼~ 下雪了，冬眠的感觉~", "吼吼~ 白雪覆盖，市场也安静了~", "吼~ 冬天是收获储备的季节~"],
    windy: ["吼~ 大风天，大户更稳~", "吼吼~ 风浪中保持镇定~", "吼~ 越是波动越要冷静~"],
    foggy: ["吼~ 雾天适合悄悄行动~", "吼吼~ 看不清的时候靠直觉~", "吼~ 迷雾中也有机会~"]
  },
  fox: {
    sunny: ["嘻嘻~ 天气好机会也多~", "嘿嘿~ 阳光下寻找机会~", "嘻嘻~ 好天气投机也顺利~"],
    cloudy: ["嘻嘻~ 阴天也有阴天的玩法~", "嘿嘿~ 云层下藏着机会~", "嘻嘻~ 不显眼的时候正好行动~"],
    rainy: ["嘻嘻~ 雨天市场可能波动~", "嘿嘿~ 下雨天抓机会要快~", "嘻嘻~ 雨声掩盖了脚步~"],
    snowy: ["嘻嘻~ 雪天要更加灵活~", "嘿嘿~ 白雪下可能有惊喜~", "嘻嘻~ 冬天也有投机机会~"],
    windy: ["嘻嘻~ 大风天波动大，机会多~", "嘿嘿~ 风起时抓住机会~", "嘻嘻~ 风向就是机会方向~"],
    foggy: ["嘻嘻~ 雾天最神秘~", "嘿嘿~ 迷雾中悄悄行动~", "嘻嘻~ 看不清反而更好~"]
  },
  tiger: {
    sunny: ["嗷~ 阳光灿烂，市场明朗~", "嗷嗷~ 好天气，好心情~", "嗷~ 庄家喜欢好天气~"],
    cloudy: ["嗷~ 阴天适合布局~", "嗷嗷~ 没有太阳也影响不了我~", "嗷~ 阴云下也能掌控~"],
    rainy: ["嗷~ 雨天稳坐不动~", "嗷嗷~ 风雨中更显领袖风范~", "嗷~ 雨后会有彩虹~"],
    snowy: ["嗷~ 雪天庄严~", "嗷嗷~ 冬天是总结的季节~", "嗷~ 庄家不惧寒冷~"],
    windy: ["嗷~ 大风天更需稳定~", "嗷嗷~ 风浪中坐镇市场~", "嗷~ 稳住就是胜利~"],
    foggy: ["嗷~ 雾天更需眼光~", "嗷嗷~ 迷雾中也能看清方向~", "嗷~ 庄家的眼光穿透迷雾~"]
  },
  rabbit: {
    sunny: ["蹦蹦~ 天气数据纳入模型~", "跳跳~ 晴天因子积极~", "蹦蹦~ 好天气提升交易效率~"],
    cloudy: ["蹦蹦~ 多云参数更新~", "跳跳~ 阴天不影响算法~", "蹦蹦~ 模型适应天气变化~"],
    rainy: ["蹦蹦~ 雨天因子波动~", "跳跳~ 算法调整参数~", "蹦蹦~ 天气变量计入模型~"],
    snowy: ["蹦蹦~ 雪天数据异常值~", "跳跳~ 冬季模式启动~", "蹦蹦~ 模型针对雪天优化~"],
    windy: ["蹦蹦~ 大风增加波动率~", "跳跳~ 风速因子调整~", "蹦蹦~ 波动大时算法更活跃~"],
    foggy: ["蹦蹦~ 雾天不确定性高~", "跳跳~ 风险参数上调~", "蹦蹦~ 低能见度降低交易频率~"]
  },
  cow: {
    sunny: ["哞~ ............阳光............命运之光............", "哞哞~ ............晴天............万物生长............", "哞~ ............太阳............神秘的力量............"],
    cloudy: ["哞~ ............云层............遮不住命运............", "哞哞~ ............阴天............也是一种预示............", "哞~ ............多云............变化即将到来............"],
    rainy: ["哞~ ............雨水............洗涤一切............", "哞哞~ ............下雨............命运的恩赐............", "哞~ ............滴答............时间的声音............"],
    snowy: ["哞~ ............白雪............纯净的世界............", "哞哞~ ............雪花............命运的礼物............", "哞~ ............寒冷............是另一种温暖............"],
    windy: ["哞~ ............风............带来了消息............", "哞哞~ ............大风............命运的吹拂............", "哞~ ............风声............在诉说什么............"],
    foggy: ["哞~ ............迷雾............命运的帷幕............", "哞哞~ ............看不见............但能感知............", "哞~ ............雾中............藏着天机............"]
  }
};

// 打工相关聊天消息
export const workChatMessages = {
  leaving: {
    cat: ["喵~ 我要出门打工一段时间啦~", "喵喵~ 去赚点外快，很快回来~", "呼噜~ 打工去咯，等我消息~"],
    dog: ["汪~ 去外面工作一阵子~", "汪汪~ 打工赚钱，回来继续投资~", "汪~ 暂时离开，很快回来~"],
    bear: ["吼~ 大户也要出去走走了~", "吼吼~ 打工也是一种经历~", "吼~ 暂时离开市场一段时间~"],
    fox: ["嘻嘻~ 发现了个赚钱机会，我去去就回~", "嘿嘿~ 外出打工，收获更多~", "嘻嘻~ 出门一趟，回来更富有~"],
    tiger: ["嗷~ 庄家也要外出处理事务~", "嗷嗷~ 暂时离开，但市场我会关注~", "嗷~ 出门一段时间，回来再战~"],
    rabbit: ["蹦蹦~ 执行外部任务，算法暂停~", "跳跳~ 外部套利任务启动~", "蹦蹦~ 暂时离线，任务完成后回归~"],
    cow: ["哞~ ............出门............命运召唤............", "哞哞~ ............离开............是命运的安排............", "哞~ ............远行............天机所指............"]
  },
  returning: {
    cat: ["喵喵~ 我回来啦！赚了一些钱~", "喵~ 打工归来，可以继续交易了~", "呼噜~ 回来咯，想死大家了~"],
    dog: ["汪~ 我回来了！这次收获不错~", "汪汪~ 打工结束，满血回归~", "汪~ 回到森林，继续投资~"],
    bear: ["吼~ 回来了，钱也多了~", "吼吼~ 大户打工归来~", "吼~ 满载而归~"],
    fox: ["嘻嘻~ 回来啦！赚了一笔~", "嘿嘿~ 打工回来，资金更充足了~", "嘻嘻~ 满载而归，继续投机~"],
    tiger: ["嗷~ 庄家回来了~", "嗷嗷~ 回归市场，重新掌控~", "嗷~ 处理完事务，回来了~"],
    rabbit: ["蹦蹦~ 任务完成，算法重启~", "跳跳~ 外部收益已入账，继续运行~", "蹦蹦~ 回归在线，模型继续~"],
    cow: ["哞~ ............回来............命运带回............", "哞哞~ ............归来............带着收获............", "哞~ ............返回............天机完成............"]
  }
};

// 动物离开交易市场的消息
export const leaveMarketMessages = {
  cat: [
    "喵... 我亏太多了，还是先离开吧...",
    "喵呜~ 这个市场不适合我，再见啦大家~",
    "呼噜... 心累了，我要去休息一段时间..."
  ],
  dog: [
    "汪~ 经过慎重考虑，我决定暂时离开市场~",
    "汪汪~ 投资有风险，我选择暂时退出~",
    "汪~ 这段时间学到了很多，但现在是时候离开了~"
  ],
  bear: [
    "吼~ 大户也有输的时候，我先撤了~",
    "吼吼~ 暂时离开，等待更好的时机~",
    "吼~ 市场无情，我先退出观望~"
  ],
  fox: [
    "嘻嘻~ 投机失败，我要去找别的机会了~",
    "嘿嘿~ 这里的钱不好赚，我去别处了~",
    "嘻嘻~ 失败是成功之母，我先离开了~"
  ],
  tiger: [
    "嗷~ 庄家也有退场的时候~",
    "嗷嗷~ 暂时退出，但我会回来的~",
    "嗷~ 市场变幻莫测，我先离开了~"
  ],
  rabbit: [
    "蹦蹦~ 算法显示应该退出市场~",
    "跳跳~ 模型判断当前不适合继续交易~",
    "蹦蹦~ 量化分析结果：暂时退出~"
  ],
  cow: [
    "哞~ ............离开............命运的安排............",
    "哞哞~ ............退出............天机如此............",
    "哞~ ............告别............一切皆有定数............"
  ]
};

// 动物重新加入交易市场的消息
export const rejoinMarketMessages = {
  cat: [
    "喵~ 我回来啦！准备重新开始~",
    "喵喵~ 休息够了，我又来啦~",
    "呼噜~ 新的机会，新的开始~"
  ],
  dog: [
    "汪~ 我回来了，准备继续投资~",
    "汪汪~ 重新加入市场，更有信心了~",
    "汪~ 又是新的开始，加油~"
  ],
  bear: [
    "吼~ 大户回归！~",
    "吼吼~ 准备好重新开始交易了~",
    "吼~ 回来了，这次要更谨慎~"
  ],
  fox: [
    "嘻嘻~ 我又回来啦~",
    "嘿嘿~ 新的机会在等着我~",
    "嘻嘻~ 回归市场，继续投机~"
  ],
  tiger: [
    "嗷~ 庄家回归~",
    "嗷嗷~ 我回来了，市场准备好了吗~",
    "嗷~ 重新开始，继续掌控~"
  ],
  rabbit: [
    "蹦蹦~ 算法重启，重新加入~",
    "跳跳~ 模型重新上线~",
    "蹦蹦~ 回归交易，优化完成~"
  ],
  cow: [
    "哞~ ............回归............命运召唤............",
    "哞哞~ ............回来............天机所指............",
    "哞~ ............重新开始............一切皆有定数............"
  ]
};

// 获取动物下单时的聊天消息（用于聊天室）
export const getAnimalChatMessage = (animalType, orderType, extraInfo = {}) => {
  const animalMessages = chatMessages[animalType] || chatMessages.cat;
  const playerName = animalNames[animalType] || animalType;
  
  let message = '';
  
  if (orderType === 'buy' || orderType === 'sell') {
    const messages = animalMessages[orderType];
    message = messages[Math.floor(Math.random() * messages.length)];
  } else if (orderType === 'weatherChange' && extraInfo.weather) {
    message = animalMessages.weatherChange[extraInfo.weather] || animalMessages.weatherChange.sunny;
  } else if (orderType === 'seasonChange' && extraInfo.season) {
    message = animalMessages.seasonChange[extraInfo.season] || animalMessages.seasonChange.spring;
  }
  
  return {
    id: Date.now() + Math.random(),
    animalType,
    playerName,
    type: orderType,
    text: message,
    time: new Date().toLocaleTimeString()
  };
};

// 获取随机日常聊天消息
export const getDailyChatMessage = (animalType) => {
  const messages = dailyChatMessages[animalType] || dailyChatMessages.cat;
  const playerName = animalNames[animalType] || animalType;
  
  let messageList;
  if (Array.isArray(messages)) {
    messageList = messages;
  } else {
    messageList = messages.normal || dailyChatMessages.cat;
  }
  
  return {
    id: Date.now() + Math.random(),
    animalType,
    playerName,
    type: 'chat',
    text: messageList[Math.floor(Math.random() * messageList.length)],
    time: new Date().toLocaleTimeString()
  };
};

// 获取年度大会回忆消息
export const getAnnualMeetingChatMessage = (animalType) => {
  const messages = annualMeetingChatMessages[animalType] || annualMeetingChatMessages.cat;
  const playerName = animalNames[animalType] || animalType;
  
  return {
    id: Date.now() + Math.random(),
    animalType,
    playerName,
    type: 'annualMeeting',
    text: messages[Math.floor(Math.random() * messages.length)],
    time: new Date().toLocaleTimeString()
  };
};

// 获取天气聊天消息
export const getWeatherChatMessage = (animalType, weather) => {
  const weatherMessages = weatherChatMessages[animalType] || weatherChatMessages.cat;
  const playerName = animalNames[animalType] || animalType;
  const messages = weatherMessages[weather] || weatherMessages.sunny;
  
  return {
    id: Date.now() + Math.random(),
    animalType,
    playerName,
    type: 'weather',
    text: messages[Math.floor(Math.random() * messages.length)],
    time: new Date().toLocaleTimeString()
  };
};

// 获取打工消息
export const getWorkChatMessage = (animalType, isLeaving, income = 0) => {
  const workMessages = workChatMessages[isLeaving ? 'leaving' : 'returning'];
  const messages = workMessages[animalType] || workMessages.cat;
  const playerName = animalNames[animalType] || animalType;
  
  let text = messages[Math.floor(Math.random() * messages.length)];
  if (!isLeaving && income > 0) {
    text += ` 赚了¥${income}！`;
  }
  
  return {
    id: Date.now() + Math.random(),
    animalType,
    playerName,
    type: 'work',
    text,
    time: new Date().toLocaleTimeString()
  };
};

// 随机生成各类聊天消息（供定时调用）
export const generateRandomChatMessage = (players) => {
  // 获取所有非用户玩家的动物
  const animalKeys = Object.keys(players).filter(key => key !== 'user' && players[key]);
  if (animalKeys.length === 0) return null;
  
  // 随机选择一个动物
  const randomAnimal = animalKeys[Math.floor(Math.random() * animalKeys.length)];
  
  // 随机选择消息类型
  const messageTypes = ['daily', 'daily', 'daily', 'annualMeeting', 'weather', 'work'];
  const randomType = messageTypes[Math.floor(Math.random() * messageTypes.length)];
  
  switch (randomType) {
    case 'daily':
      return getDailyChatMessage(randomAnimal);
    case 'annualMeeting':
      return getAnnualMeetingChatMessage(randomAnimal);
    case 'weather':
      return getWeatherChatMessage(randomAnimal, 'sunny'); // 可以传入实际天气
    case 'work':
      return getWorkChatMessage(randomAnimal, Math.random() > 0.5, 0);
    default:
      return getDailyChatMessage(randomAnimal);
  }
};

// 获取动物离开市场的消息
export const getLeaveMessage = (animalKey) => {
  const messages = leaveMarketMessages[animalKey] || leaveMarketMessages.cat;
  return messages[Math.floor(Math.random() * messages.length)];
};

// 获取动物重新加入市场的消息
export const getRejoinMessage = (animalKey) => {
  const messages = rejoinMarketMessages[animalKey] || rejoinMarketMessages.cat;
  return messages[Math.floor(Math.random() * messages.length)];
};
