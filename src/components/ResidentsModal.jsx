import React from 'react';
import { ANIMAL_STATUS } from '../data/animalTemplates';
import { LIMIT_REACTION_CONFIG } from '../data/animalStrategies';

// 状态图标和文字映射
const STATUS_CONFIG = {
  [ANIMAL_STATUS.ACTIVE]: { icon: '🟢', text: '交易中', color: 'text-green-600', bg: 'bg-green-50' },
  [ANIMAL_STATUS.WORKING]: { icon: '💼', text: '打工中', color: 'text-amber-600', bg: 'bg-amber-50' },
  [ANIMAL_STATUS.HIBERNATING]: { icon: '😴', text: '冬眠中', color: 'text-blue-600', bg: 'bg-blue-50' },
  [ANIMAL_STATUS.LEFT]: { icon: '🚪', text: '已离开', color: 'text-gray-400', bg: 'bg-gray-50' },
  [ANIMAL_STATUS.JOINING]: { icon: '🔜', text: '即将加入', color: 'text-purple-600', bg: 'bg-purple-50' },
};

// 心情映射 - 增加涨跌停相关情绪
const EMOTION_CONFIG = {
  happy: { icon: '😊', text: '开心' },
  neutral: { icon: '😐', text: '平静' },
  sad: { icon: '😟', text: '沮丧' },
  excited: { icon: '🤩', text: '兴奋' },
  anxious: { icon: '😰', text: '焦虑' },
  greedy: { icon: '🤑', text: '贪婪' },      // 涨停追涨
  panicked: { icon: '😱', text: '恐慌' },    // 跌停恐慌
  confident: { icon: '😎', text: '自信' },   // 涨停从容
  hopeful: { icon: '🤔', text: '期待' },     // 跌停抄底
};

// 获取动物当前状态
const getAnimalStatus = (playerKey, player, workingPlayers, animalStatus) => {
  // 优先检查动物状态
  if (animalStatus?.[playerKey]?.status === ANIMAL_STATUS.LEFT) {
    return ANIMAL_STATUS.LEFT;
  }
  if (animalStatus?.[playerKey]?.status === ANIMAL_STATUS.HIBERNATING) {
    return ANIMAL_STATUS.HIBERNATING;
  }
  // 检查是否在打工
  if (workingPlayers?.[playerKey]) {
    return ANIMAL_STATUS.WORKING;
  }
  return ANIMAL_STATUS.ACTIVE;
};

// 获取动物心情（基于盈亏和涨跌停）
const getAnimalEmotion = (player, currentPrice, monthStartPrice, animalKey) => {
  if (!player) return 'neutral';
  
  // 考虑冻结资产
  const frozenMoney = player.frozenMoney || 0;
  const frozenShares = player.frozenShares || 0;
  const currentValue = (player.money || 0) + frozenMoney + 
                       ((player.shares || 0) + frozenShares) * currentPrice;
  const initialValue = (player.initialMoney || 0) + (player.initialShares || 0) * (player.initialPrice || 1.0);
  const profitRate = (currentValue - initialValue) / initialValue;
  
  // 【新增】检查涨跌停状态
  if (monthStartPrice) {
    const limitUpPrice = monthStartPrice * 1.2;
    const limitDownPrice = monthStartPrice * 0.8;
    const isNearLimitUp = currentPrice >= limitUpPrice * 0.99;
    const isNearLimitDown = currentPrice <= limitDownPrice * 1.01;
    
    if (isNearLimitUp) {
      // 涨停时的情绪反应
      const reaction = LIMIT_REACTION_CONFIG.limitUpReaction[animalKey] || { buyProbBoost: 0 };
      if (reaction.buyProbBoost > 0.25) {
        return 'greedy';      // 追涨型动物 - 贪婪
      } else if (reaction.sellProbBoost > 0.2) {
        return 'confident';   // 卖出型动物 - 自信
      }
      return 'excited';       // 默认涨停情绪
    }
    
    if (isNearLimitDown) {
      // 跌停时的情绪反应
      const reaction = LIMIT_REACTION_CONFIG.limitDownReaction[animalKey] || { sellProbBoost: 0 };
      if (reaction.sellProbBoost > 0.25) {
        return 'panicked';    // 恐慌型动物 - 恐慌
      } else if (reaction.buyProbBoost > 0.2) {
        return 'hopeful';     // 抄底型动物 - 期待
      }
      return 'anxious';       // 默认跌停情绪
    }
  }
  
  // 基于盈亏的情绪
  if (profitRate > 0.2) return 'excited';
  if (profitRate > 0) return 'happy';
  if (profitRate > -0.2) return 'neutral';
  if (profitRate > -0.5) return 'sad';
  return 'anxious';
};

const ResidentsModal = ({
  isOpen,
  onClose,
  players,
  currentPrice,
  workingPlayers,
  animalStatus,
  dreamCompany,
  monthStartPrice // 【新增】月初价格，用于涨跌停判断
}) => {
  if (!isOpen) return null;

  // 过滤掉用户玩家，只显示动物
  const animalPlayers = Object.entries(players || {})
    .filter(([key]) => key !== 'user')
    .map(([key, player]) => {
      const status = getAnimalStatus(key, player, workingPlayers, animalStatus);
      const emotion = getAnimalEmotion(player, currentPrice, monthStartPrice, key);
      
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
        ...player,
        status,
        emotion,
        totalValue,
        profit,
        profitRate,
        statusConfig: STATUS_CONFIG[status],
        emotionConfig: EMOTION_CONFIG[emotion]
      };
    });

  // 统计数据
  const activeCount = animalPlayers.filter(a => a.status === ANIMAL_STATUS.ACTIVE).length;
  const workingCount = animalPlayers.filter(a => a.status === ANIMAL_STATUS.WORKING).length;
  const hibernatingCount = animalPlayers.filter(a => a.status === ANIMAL_STATUS.HIBERNATING).length;
  const leftCount = animalPlayers.filter(a => a.status === ANIMAL_STATUS.LEFT).length;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col">
        {/* 标题栏 */}
        <div className="flex-shrink-0 bg-gradient-to-r from-teal-500 to-cyan-500 p-4 text-white rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🏡</span>
              <span className="font-bold text-lg">森林居民</span>
            </div>
            <button onClick={onClose} className="text-white/80 hover:text-white text-2xl">×</button>
          </div>
          <div className="text-sm text-white/80 mt-1">
            共 {animalPlayers.length} 位居民
          </div>
        </div>
        
        {/* 统计栏 */}
        <div className="flex-shrink-0 p-3 bg-gray-50 border-b grid grid-cols-4 gap-2 text-center">
          <div className="bg-green-100 rounded-lg p-2">
            <div className="text-lg font-bold text-green-700">{activeCount}</div>
            <div className="text-xs text-green-600">交易中</div>
          </div>
          <div className="bg-amber-100 rounded-lg p-2">
            <div className="text-lg font-bold text-amber-700">{workingCount}</div>
            <div className="text-xs text-amber-600">打工中</div>
          </div>
          <div className="bg-blue-100 rounded-lg p-2">
            <div className="text-lg font-bold text-blue-700">{hibernatingCount}</div>
            <div className="text-xs text-blue-600">冬眠中</div>
          </div>
          <div className="bg-gray-100 rounded-lg p-2">
            <div className="text-lg font-bold text-gray-500">{leftCount}</div>
            <div className="text-xs text-gray-400">已离开</div>
          </div>
        </div>
        
        {/* 居民列表 */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {animalPlayers.map((animal) => (
            <div 
              key={animal.key} 
              className={`rounded-lg p-3 border transition-all ${
                animal.status === ANIMAL_STATUS.LEFT 
                  ? 'opacity-50 bg-gray-50 border-gray-200' 
                  : `${animal.statusConfig.bg} border-gray-200`
              }`}
            >
              <div className="flex items-center gap-3">
                {/* 头像和名字 */}
                <div className="flex-shrink-0">
                  <div className="text-3xl">{animal.icon}</div>
                </div>
                
                {/* 信息区 */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-800">{animal.name}</span>
                    <span className={`text-xs px-1.5 py-0.5 rounded-full ${animal.statusConfig.bg} ${animal.statusConfig.color}`}>
                      {animal.statusConfig.icon} {animal.statusConfig.text}
                    </span>
                    <span className="text-sm" title={`心情: ${animal.emotionConfig.text}`}>
                      {animal.emotionConfig.icon}
                    </span>
                  </div>
                  
                  {/* 资金和股份 */}
                  <div className="flex items-center gap-3 mt-1 text-xs text-gray-600">
                    <span>💰 ¥{animal.money?.toLocaleString()}</span>
                    <span>📊 {animal.shares?.toLocaleString()}股</span>
                    <span className={animal.profit >= 0 ? 'text-red-500' : 'text-green-500'}>
                      {animal.profit >= 0 ? '📈' : '📉'} {animal.profit >= 0 ? '+' : ''}{animal.profitRate?.toFixed(1)}%
                    </span>
                  </div>
                  
                  {/* 打工收入（累计） */}
                  {(animal.totalWorkIncome || 0) > 0 && (
                    <div className="text-xs text-orange-600 mt-1">
                      💼 累计打工收入: ¥{(animal.totalWorkIncome || 0).toLocaleString()}
                    </div>
                  )}
                  
                  {/* 离开原因（如果已离开） */}
                  {animal.status === ANIMAL_STATUS.LEFT && animalStatus?.[animal.key]?.reason && (
                    <div className="text-xs text-gray-400 mt-1 italic">
                      离开原因: {animalStatus[animal.key].reason}
                    </div>
                  )}
                </div>
                
                {/* 总资产 */}
                <div className="text-right flex-shrink-0">
                  <div className="text-sm font-bold text-gray-700">
                    ¥{animal.totalValue?.toFixed(0)}
                  </div>
                  <div className="text-xs text-gray-500">总资产</div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* 关闭按钮 */}
        <div className="flex-shrink-0 p-3 border-t">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition"
          >
            关闭
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResidentsModal;
