import React, { useEffect, useState } from 'react';

const SeasonToast = ({ isVisible, year, month, season, weather, onClose }) => {
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    if (isVisible) {
      // 渐入
      setTimeout(() => setOpacity(1), 50);
      // 2秒后开始渐出
      const fadeOutTimer = setTimeout(() => {
        setOpacity(0);
      }, 2000);
      // 3秒后完全关闭（渐出动画1秒）
      const closeTimer = setTimeout(() => {
        if (onClose) onClose();
      }, 3000);

      return () => {
        clearTimeout(fadeOutTimer);
        clearTimeout(closeTimer);
      };
    } else {
      setOpacity(0);
    }
  }, [isVisible, onClose]);

  if (!isVisible && opacity === 0) return null;

  const seasonColors = {
    spring: { bg: 'from-pink-300/90 to-green-300/90', text: 'text-pink-800', icon: '🌸' },
    summer: { bg: 'from-yellow-300/90 to-green-400/90', text: 'text-green-800', icon: '🌻' },
    autumn: { bg: 'from-orange-300/90 to-amber-400/90', text: 'text-orange-800', icon: '🍂' },
    winter: { bg: 'from-blue-300/90 to-slate-400/90', text: 'text-blue-800', icon: '❄️' }
  };

  const weatherIcons = {
    sunny: '☀️',
    cloudy: '⛅',
    rainy: '🌧️',
    snowy: '❄️',
    windy: '💨',
    foggy: '🌫️'
  };

  const weatherNames = {
    sunny: '晴天',
    cloudy: '多云',
    rainy: '雨天',
    snowy: '雪天',
    windy: '大风',
    foggy: '雾天'
  };

  const seasonNames = {
    spring: '春季',
    summer: '夏季',
    autumn: '秋季',
    winter: '冬季'
  };

  const colors = seasonColors[season] || seasonColors.spring;

  return (
    <div
      className="fixed top-16 left-0 right-0 flex justify-center pointer-events-none z-50"
      style={{
        opacity,
        transition: 'opacity 0.8s ease-in-out'
      }}
    >
      <div
        className={`bg-gradient-to-br ${colors.bg} backdrop-blur-md rounded-xl shadow-2xl px-6 py-3`}
        style={{
          transform: `translateY(${opacity === 1 ? '0' : '-20px'})`,
          transition: 'transform 1s ease-out'
        }}
      >
        <div className="flex items-center gap-3">
          {/* 年月 */}
          <div className="text-base font-bold text-gray-800">
            {year}年{month}月
          </div>
          
          <div className="w-px h-6 bg-gray-400/50"></div>
          
          {/* 季节 */}
          <div className={`flex items-center gap-1.5 ${colors.text}`}>
            <span className="text-2xl">{colors.icon}</span>
            <span className="text-base font-bold">{seasonNames[season] || season}</span>
          </div>
          
          <div className="w-px h-6 bg-gray-400/50"></div>
          
          {/* 天气 */}
          <div className="flex items-center gap-1.5 text-gray-700">
            <span className="text-xl">{weatherIcons[weather] || '☀️'}</span>
            <span className="text-sm font-medium">{weatherNames[weather] || weather}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeasonToast;
