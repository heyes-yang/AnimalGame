import { useEffect, useCallback, useState } from 'react';
import { animalStates, stateDurations } from '../data/animalStates';

export const useAnimalStates = (players, gameStarted) => {
  const [animalStatesMap, setAnimalStatesMap] = useState({});
  const [animalTimers, setAnimalTimers] = useState({});

  // 获取随机状态
  const getRandomState = useCallback(() => {
    const states = Object.values(animalStates);
    return states[Math.floor(Math.random() * states.length)];
  }, []);

  // 初始化动物状态
  const initializeAnimalState = useCallback((playerKey) => {
    const randomState = getRandomState();
    const duration = stateDurations[randomState];
    
    setAnimalStatesMap(prev => ({
      ...prev,
      [playerKey]: {
        currentState: randomState,
        lastChange: Date.now(),
        nextChange: Date.now() + duration
      }
    }));

    // 设置状态切换定时器
    const timer = setTimeout(() => {
      setAnimalStatesMap(prev => {
        const currentState = prev[playerKey];
        if (!currentState) return prev;

        const newState = getRandomState();
        const newDuration = stateDurations[newState];
        
        return {
          ...prev,
          [playerKey]: {
            currentState: newState,
            lastChange: Date.now(),
            nextChange: Date.now() + newDuration
          }
        };
      });
    }, duration);

    setAnimalTimers(prev => ({
      ...prev,
      [playerKey]: timer
    }));
  }, [getRandomState]);

  // 初始化所有动物状态
  useEffect(() => {
    if (!gameStarted || !players) return;

    Object.keys(players).forEach(playerKey => {
      if (playerKey !== 'user' && !animalStatesMap[playerKey]) {
        initializeAnimalState(playerKey);
      }
    });
  }, [players, gameStarted, initializeAnimalState, animalStatesMap]);

  // 清理定时器
  useEffect(() => {
    return () => {
      Object.values(animalTimers).forEach(timer => {
        if (timer) clearTimeout(timer);
      });
    };
  }, [animalTimers]);

  // 获取动物当前状态
  const getAnimalState = useCallback((playerKey) => {
    return animalStatesMap[playerKey]?.currentState || animalStates.NEUTRAL;
  }, [animalStatesMap]);

  return {
    getAnimalState,
    animalStatesMap
  };
};
