// 动物状态配置
export const animalStates = {
  ACTIVE: 'active',
  RESTING: 'resting', 
  EATING: 'eating',
  HAPPY: 'happy',
  SAD: 'sad',
  NEUTRAL: 'neutral'
};

// 动物状态持续时间配置（毫秒）
export const stateDurations = {
  [animalStates.ACTIVE]: 30000, // 30秒活跃
  [animalStates.RESTING]: 60000, // 1分钟休息
  [animalStates.EATING]: 20000,  // 20秒进食
  [animalStates.HAPPY]: 40000,   // 40秒开心
  [animalStates.SAD]: 25000,     // 25秒难过
  [animalStates.NEUTRAL]: 45000  // 45秒平静
};
