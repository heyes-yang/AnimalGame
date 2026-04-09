import React, { useState, useEffect } from 'react';

const AnimalDialogueBubble = ({ 
  text, 
  animalIcon, 
  emotionIcon, 
  isVisible, 
  onComplete,
  position = { top: '20%', left: '50%' },
  cardPosition = null
}) => {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setIsAnimating(true);
      // 2.5秒后自动隐藏，确保文案只展示一次
      const timer = setTimeout(() => {
        setIsAnimating(false);
        if (onComplete) {
          onComplete();
        }
      }, 2500);

      return () => clearTimeout(timer);
    }
  }, [isVisible, onComplete]);

  if (!isVisible) return null;

  // 如果有卡片位置信息，则相对于卡片定位
  const bubbleStyle = cardPosition 
    ? {
        top: `${cardPosition.top - 10}px`,
        left: `${cardPosition.left + cardPosition.width / 2}px`,
        transform: 'translate(-50%, -100%)',
        maxWidth: '200px'
      }
    : {
        top: position.top, 
        left: position.left, 
        transform: 'translate(-50%, -100%)',
        maxWidth: '200px'
      };

  return (
    <div 
      className={`absolute z-50 transition-all duration-500 ease-out ${
        isAnimating ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
      }`}
      style={bubbleStyle}
    >
      <div className="bg-white rounded-2xl shadow-lg p-3 border-2 border-blue-200 relative">
        {/* 动物头像和心情图标 */}
        <div className="flex items-center justify-center space-x-2 mb-2">
          {animalIcon && (
            <span className="text-xl animate-bounce">{animalIcon}</span>
          )}
          {emotionIcon && (
            <span className="text-xl animate-pulse">{emotionIcon}</span>
          )}
        </div>
        
        <div className="text-sm text-gray-800 text-center">
          {text}
        </div>
        
        {/* 气泡尾巴 */}
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-white"></div>
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-blue-200 mt-0.5"></div>
      </div>
    </div>
  );
};

export default AnimalDialogueBubble;
