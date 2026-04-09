import React, { useState, useEffect } from 'react';
import AnimalIconSelector from './AnimalIconSelector';
import DialogueBubble from './DialogueBubble';
import { useAnimalDialogue } from '../hooks/useAnimalDialogue';
import { ANIMAL_STATUS } from '../data/animalTemplates';

const PlayerStatus = ({ players, userPlayer, onUpdateUserPlayer, currentPrice, workingPlayers, animalStatus }) => {
  const [showIconSelector, setShowIconSelector] = useState(false);
  const [userName, setUserName] = useState(userPlayer?.name || '');
  const [playerProfits, setPlayerProfits] = useState({});
  const { activeDialogues, triggerAnimalDialogue } = useAnimalDialogue(players, !!userPlayer, currentPrice);

  const handleIconSelect = (icon) => {
    if (onUpdateUserPlayer) {
      onUpdateUserPlayer({ ...userPlayer, icon });
    }
    setShowIconSelector(false);
  };

  const handleUserNameChange = (e) => {
    const newName = e.target.value;
    setUserName(newName);
    if (onUpdateUserPlayer && newName.trim()) {
      onUpdateUserPlayer({ ...userPlayer, name: newName.trim() });
    }
  };

  const calculatePlayerProfit = (player) => {
    if (!player || typeof player.money !== 'number') return 0;
    const frozenMoney = player.frozenMoney || 0;
    const frozenShares = player.frozenShares || 0;
    const currentTotalValue = (player.money || 0) + frozenMoney + 
                              ((player.shares || 0) + frozenShares) * currentPrice;
    const initialTotalValue = (player.initialMoney || 0) + (player.initialShares || 0) * (player.initialPrice || 1.0);
    return currentTotalValue - initialTotalValue;
  };

  const calculateInitialTotalValue = (player) => {
    if (!player) return 0;
    return (player.initialMoney || 0) + (player.initialShares || 0) * (player.initialPrice || 1.0);
  };

  const getEmotionState = (player) => {
    const profit = calculatePlayerProfit(player);
    const initialTotalValue = calculateInitialTotalValue(player);
    const profitRatio = initialTotalValue > 0 ? profit / initialTotalValue : 0;
    if (profitRatio > 0.2) return 'excited';
    if (profitRatio > 0.05) return 'happy';
    if (profitRatio > -0.05) return 'neutral';
    if (profitRatio > -0.2) return 'sad';
    return 'depressed';
  };

  const getEmotionEmoji = (emotion) => {
    switch (emotion) {
      case 'excited': return '🤩';
      case 'happy': return '😊';
      case 'neutral': return '😐';
      case 'sad': return '😟';
      case 'depressed': return '😭';
      default: return '😐';
    }
  };

  useEffect(() => {
    const profits = {};
    Object.entries(players).forEach(([key, player]) => {
      if (player.name && (player.name.trim() !== '' || key === 'rabbit')) {
        profits[key] = calculatePlayerProfit(player);
      }
    });
    setPlayerProfits(profits);
  }, [players, currentPrice]);

  const validPlayers = Object.entries(players).filter(([key, player]) =>
    player.name && (player.name.trim() !== '' || key === 'rabbit')
  );

  const sortedPlayers = validPlayers.sort(([keyA], [keyB]) => {
    if (keyA === 'user') return -1;
    if (keyB === 'user') return 1;
    return 0;
  });

  return (
    <div className="bg-white rounded-lg shadow-md p-2 sm:p-3 mb-0 relative">
      <h2 className="text-sm font-bold text-gray-800 mb-2">动物状态</h2>
      
      {/* 所有玩家状态网格 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2">
        {sortedPlayers.map(([key, player]) => {
          const emotion = getEmotionState(player);
          const profit = playerProfits[key] || 0;
          
          const initialTotalValue = calculateInitialTotalValue(player);
          const profitRatio = initialTotalValue > 0 ? profit / initialTotalValue : 0;
          const absProfitRatio = Math.abs(profitRatio);
          
          let bgClass = 'bg-gradient-to-br from-gray-50 to-white';
          let borderClass = 'border-gray-200';
          let textClass = 'text-gray-700';
          
          const playerStatus = animalStatus?.[key]?.status || ANIMAL_STATUS.ACTIVE;
          const isWorking = workingPlayers && workingPlayers[key];
          const isHibernating = playerStatus === ANIMAL_STATUS.HIBERNATING;
          const hasLeft = playerStatus === ANIMAL_STATUS.LEFT;
          const isUser = key === 'user';
          
          if (hasLeft) {
            bgClass = 'bg-gradient-to-br from-gray-100 to-gray-200 opacity-50';
            borderClass = 'border-gray-400';
            textClass = 'text-gray-500';
          } else if (isHibernating) {
            bgClass = 'bg-gradient-to-br from-indigo-50 to-blue-50';
            borderClass = 'border-indigo-300';
            textClass = 'text-indigo-700';
          } else if (isWorking) {
            bgClass = 'bg-gradient-to-br from-amber-50 to-orange-50';
            borderClass = 'border-amber-300';
            textClass = 'text-amber-700';
          } else if (profit > 0) {
            if (absProfitRatio > 0.2) {
              bgClass = 'bg-gradient-to-br from-red-100 to-red-50';
              borderClass = 'border-red-300';
              textClass = 'text-red-800';
            } else if (absProfitRatio > 0.05) {
              bgClass = 'bg-gradient-to-br from-red-50 to-orange-50';
              borderClass = 'border-red-200';
              textClass = 'text-red-700';
            } else {
              bgClass = 'bg-gradient-to-br from-red-50 to-white';
              borderClass = 'border-red-100';
              textClass = 'text-red-600';
            }
          } else if (profit < 0) {
            if (absProfitRatio > 0.2) {
              bgClass = 'bg-gradient-to-br from-green-100 to-green-50';
              borderClass = 'border-green-300';
              textClass = 'text-green-800';
            } else if (absProfitRatio > 0.05) {
              bgClass = 'bg-gradient-to-br from-green-50 to-emerald-50';
              borderClass = 'border-green-200';
              textClass = 'text-green-700';
            } else {
              bgClass = 'bg-gradient-to-br from-green-50 to-white';
              borderClass = 'border-green-100';
              textClass = 'text-green-600';
            }
          }

          return (
            <div
              key={key}
              className={`p-2 rounded-lg border ${bgClass} ${borderClass} ${textClass} relative cursor-pointer hover:shadow-lg transition-all duration-200 ${hasLeft ? 'pointer-events-none' : ''} ${isUser ? 'ring-2 ring-blue-400 ring-offset-1' : ''}`}
              onClick={() => !hasLeft && triggerAnimalDialogue(key)}
            >
              {/* 顶部：图标 + 名称 + 状态 */}
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1">
                  <span className="text-lg">{player.icon}</span>
                  <span className="font-medium text-xs text-gray-800">{player.name}</span>
                </div>
                <div className="flex items-center gap-0.5">
                  {hasLeft && <span className="text-xs" title="已离开">👋</span>}
                  {isHibernating && <span className="text-xs" title="冬眠中">😴</span>}
                  {isWorking && <span className="text-xs" title="打工中">💼</span>}
                  {!hasLeft && !isHibernating && !isWorking && (
                    <span className="text-sm">{getEmotionEmoji(emotion)}</span>
                  )}
                </div>
              </div>
              
              {/* 中间：资金和持股 */}
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>¥{(player.money || 0).toFixed(0)}</span>
                <span>{player.shares || 0}股</span>
              </div>
              
              {/* 底部：盈亏 */}
              <div className="text-center">
                <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${
                  profit >= 0 
                    ? 'bg-red-100 text-red-700' 
                    : 'bg-green-100 text-green-700'
                }`}>
                  {profit >= 0 ? '+' : ''}¥{profit.toFixed(0)}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* 图标选择器 */}
      {showIconSelector && (
        <AnimalIconSelector
          onSelect={handleIconSelect}
          onClose={() => setShowIconSelector(false)}
        />
      )}

      {/* 对话气泡 */}
      {Object.entries(activeDialogues).map(([playerKey, dialogue]) => (
        dialogue && (
          <DialogueBubble
            key={playerKey}
            text={dialogue.text}
            isVisible={dialogue.isVisible}
            onComplete={() => {}}
            animalIcon={dialogue.animalIcon}
            emotionIcon={dialogue.emotionIcon}
          />
        )
      ))}
    </div>
  );
};

export default PlayerStatus;
