import { useAnimalDialogueManager } from './useAnimalDialogueManager';

// 此Hook现在只是一个别名，实际功能由useAnimalDialogueManager提供
export const useAnimalDialogue = (players, gameStarted, currentPrice) => {
  const { activeBubbles, triggerAnimalDialogue, removeBubble } = useAnimalDialogueManager(players, gameStarted, currentPrice);
  
  // 为了保持向后兼容，将activeBubbles转换为旧格式
  const activeDialogues = {};
  activeBubbles.forEach(bubble => {
    activeDialogues[bubble.playerKey] = {
      text: bubble.text,
      animalIcon: bubble.animalIcon,
      emotionIcon: bubble.emotionIcon
    };
  });
  
  return {
    activeDialogues,
    triggerAnimalDialogue
  };
};
