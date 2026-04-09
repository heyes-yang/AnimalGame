import React, { useState, useEffect } from 'react';

const DialogueBubble = ({ text, isVisible, onComplete, animalIcon, emotionIcon }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (!isVisible || !text) {
      setDisplayedText('');
      setCurrentIndex(0);
      setIsTyping(false);
      setIsAnimating(false);
      return;
    }

    setIsAnimating(true);
    setIsTyping(true);
    setDisplayedText('');
    setCurrentIndex(0);

    // 打字机效果
    const timer = setInterval(() => {
      setCurrentIndex(prevIndex => {
        if (prevIndex < text.length) {
          setDisplayedText(text.slice(0, prevIndex + 1));
          return prevIndex + 1;
        } else {
          clearInterval(timer);
          setIsTyping(false);
          if (onComplete) {
            setTimeout(onComplete, 1000); // 1秒后触发完成回调
          }
          return prevIndex;
        }
      });
    }, 50); // 每50ms打印一个字符

    return () => clearInterval(timer);
  }, [isVisible, text, onComplete]);

  if (!isVisible) return null;

  return (
    <div className="absolute -top-20 left-1/2 transform -translate-x-1/2 z-10 animate-bounce">
      <div className="bg-white rounded-lg shadow-lg p-3 max-w-xs text-center relative">
        {/* 动物头像和心情图标 */}
        <div className="flex items-center justify-center space-x-2 mb-2">
          {animalIcon && (
            <span className="text-xl animate-pulse">{animalIcon}</span>
          )}
          {emotionIcon && (
            <span className="text-xl animate-bounce">{emotionIcon}</span>
          )}
        </div>
        
        <div className="text-sm text-gray-800">
          {displayedText}
          {isTyping && <span className="animate-pulse">|</span>}
        </div>
        {/* 气泡尾巴 */}
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-white"></div>
      </div>
    </div>
  );
};

export default DialogueBubble;
