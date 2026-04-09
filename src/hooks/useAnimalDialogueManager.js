import { useEffect, useCallback, useState, useRef } from 'react';
import { getAnimalDialogue } from '../data/animalDialogue';

export const useAnimalDialogueManager = (players, gameStarted, currentPrice, gameTime) => {
  const [activeBubbles, setActiveBubbles] = useState([]);
  const bubbleTimersRef = useRef({});
  const nextBubbleIdRef = useRef(0);
  const lastTriggerTimeRef = useRef(null);

  // 计算动物情绪状态
  const calculateAnimalEmotion = useCallback((player) => {
    if (!player || typeof player.money !== 'number') return 'neutral';

    // 当前总价值 = 当前资金 + 持股价值
    const currentTotalValue = (player.money || 0) + (player.shares || 0) * currentPrice;
    // 起始总价值 = 起始资金 + 起始持股价值
    const initialTotalValue = (player.initialMoney || 0) + (player.initialShares || 0) * (player.initialPrice || 1.0);

    // 盈亏 = 当前总价值 - 起始总价值
    const profit = currentTotalValue - initialTotalValue;
    const profitRatio = initialTotalValue > 0 ? profit / initialTotalValue : 0;

    if (profitRatio > 0.2) return 'excited';
    if (profitRatio > 0.05) return 'happy';
    if (profitRatio > -0.05) return 'neutral';
    if (profitRatio > -0.2) return 'sad';
    return 'depressed';
  }, [currentPrice]);

  // 获取情绪表情
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

  // 生成随机位置（备用方案，当没有卡片位置时使用）
  const generateRandomPosition = useCallback(() => {
    const positions = [
      { top: '15%', left: '20%' },
      { top: '15%', left: '80%' },
      { top: '40%', left: '10%' },
      { top: '40%', left: '90%' },
      { top: '65%', left: '20%' },
      { top: '65%', left: '80%' }
    ];
    return positions[Math.floor(Math.random() * positions.length)];
  }, []);

  // 生成动物对话
  const generateAnimalDialogue = useCallback((playerKey, player, cardPosition = null) => {
    if (!player || playerKey === 'user') return null;

    const emotion = calculateAnimalEmotion(player);
    
    // 随机选择对话类型
    const dialogueTypes = ['daily', 'active', 'resting', 'eating', 'facts'];
    const randomType = dialogueTypes[Math.floor(Math.random() * dialogueTypes.length)];
    
    // 根据状态和情绪获取对话
    const dialogue = getAnimalDialogue(playerKey, randomType, emotion);
    
    return {
      id: `bubble-${nextBubbleIdRef.current++}`,
      playerKey,
      text: dialogue,
      emotion,
      timestamp: Date.now(),
      animalIcon: player.icon,
      emotionIcon: getEmotionEmoji(emotion),
      position: cardPosition ? null : generateRandomPosition(),
      cardPosition: cardPosition
    };
  }, [calculateAnimalEmotion, generateRandomPosition]);

  // 显示动物对话气泡
  const showAnimalDialogue = useCallback((playerKey, player, cardPosition = null) => {
    // 检查当前显示的气泡数量，最多允许2个
    setActiveBubbles(prev => {
      const currentCount = prev.length;
      if (currentCount >= 2) {
        // 如果已经有2个气泡在显示，则不显示新气泡
        return prev;
      }
      
      const dialogue = generateAnimalDialogue(playerKey, player, cardPosition);
      if (!dialogue) return prev;
      
      // 设置2.5秒后自动移除该气泡
      const timer = setTimeout(() => {
        removeBubble(dialogue.id);
      }, 2500);
      
      bubbleTimersRef.current[dialogue.id] = timer;
      
      return [...prev, dialogue];
    });
  }, [generateAnimalDialogue]);

  // 移除对话气泡
  const removeBubble = useCallback((bubbleId) => {
    setActiveBubbles(prev => prev.filter(bubble => bubble.id !== bubbleId));
    
    // 清理定时器
    if (bubbleTimersRef.current[bubbleId]) {
      clearTimeout(bubbleTimersRef.current[bubbleId]);
      delete bubbleTimersRef.current[bubbleId];
    }
  }, []);

  // 基于游戏时间触发动物说话
  const triggerAnimalsByGameTime = useCallback(() => {
    if (!gameStarted || !players) return;

    // 获取所有非用户玩家
    const animalPlayers = Object.entries(players).filter(([key, player]) => 
      key !== 'user' && player
    );

    if (animalPlayers.length === 0) return;

    // 50%概率触发动物说话
    if (Math.random() < 0.5) {
      // 随机选择1个动物说话
      const randomAnimal = animalPlayers[Math.floor(Math.random() * animalPlayers.length)];
      const [playerKey, player] = randomAnimal;
      showAnimalDialogue(playerKey, player);
    }
  }, [gameStarted, players, showAnimalDialogue]);

  // 监听游戏时间变化，每次游戏时间更新时检查是否触发动物说话
  useEffect(() => {
    if (!gameStarted || !gameTime) return;

    // 如果是第一次触发或者距离上次触发已经过了一段时间
    if (!lastTriggerTimeRef.current || 
        (gameTime - lastTriggerTimeRef.current) >= 1000) { // 至少间隔1秒
      triggerAnimalsByGameTime();
      lastTriggerTimeRef.current = gameTime;
    }
  }, [gameTime, gameStarted, triggerAnimalsByGameTime]);

  // 手动触发动物说话（支持传递卡片位置）
  const triggerAnimalDialogue = useCallback((playerKey, cardPosition = null) => {
    const player = players[playerKey];
    if (!player || playerKey === 'user') return;

    showAnimalDialogue(playerKey, player, cardPosition);
  }, [players, showAnimalDialogue]);

  // 组件卸载时清理所有定时器
  useEffect(() => {
    return () => {
      Object.values(bubbleTimersRef.current).forEach(timer => {
        if (timer) clearTimeout(timer);
      });
    };
  }, []);

  return {
    activeBubbles,
    triggerAnimalDialogue,
    removeBubble
  };
};
