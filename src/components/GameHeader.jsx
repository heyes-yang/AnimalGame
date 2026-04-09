import React, { useState, useEffect, useRef } from 'react';
import { RotateCcw, Pause, Play, FastForward, User, Users, Building2, Home } from 'lucide-react';
import { WEATHER_TYPES, SEASONS } from '../hooks/usePriceFluctuation';
import { getMomoAnnouncement } from '../data/chatMessages';

// 根据月份获取季节
const getSeasonByMonth = (month) => {
  if (month >= 2 && month <= 4) return 'spring';
  if (month >= 5 && month <= 7) return 'summer';
  if (month >= 8 && month <= 10) return 'autumn';
  return 'winter';
};

const GameHeader = ({ 
  gameTime, 
  onReset, 
  isPaused, 
  speedMode, 
  onTogglePause, 
  onCycleSpeed, 
  monthlyWeather,
  announcements = [], // 从外部接收公告消息
  annualSummaries = [], // 年度大会历史记录
  onOpenAnnualSummary, // 打开年度大会回调
  onOpenMyInfo, // 打开“我的”弹窗
  onOpenAnimals, // 打开“动物”弹窗
  onOpenDreamCompany, // 打开“梦想公司”弹窗
  onOpenResidents, // 打开“居民”弹窗
  isAfterAnnualMeeting = false // 是否刚结束年度大会（公司按钮置灰）
}) => {
  const month = gameTime.getMonth();
  const year = gameTime.getFullYear();
  const monthKey = `${year}-${month}`;
  
  // 获取当前季节
  const seasonKey = getSeasonByMonth(month);
  const season = SEASONS[seasonKey];
  
  // 获取当前月份的天气
  const weatherKey = monthlyWeather[monthKey] || 'sunny';
  const weather = WEATHER_TYPES[weatherKey] || WEATHER_TYPES.sunny;

  // 公告消息列表
  const [messages, setMessages] = useState([]);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const lastSeasonRef = useRef(seasonKey);
  const lastWeatherRef = useRef(weatherKey);
  const isFirstRender = useRef(true);

  // 初始化默认消息 - 莫莫鸟播报风格
  useEffect(() => {
    const openingMsg = getMomoAnnouncement('opening');
    setMessages([
      { text: openingMsg, isStatic: true }
    ]);
    isFirstRender.current = false;
  }, []);

  // 检测季节和天气变化 - 莫莫鸟播报风格
  useEffect(() => {
    if (isFirstRender.current) return;
    
    const newMessages = [];
    
    // 检测季节变化
    if (lastSeasonRef.current && lastSeasonRef.current !== seasonKey) {
      const oldSeason = SEASONS[lastSeasonRef.current];
      const seasonMsg = getMomoAnnouncement('seasonChange', {
        oldSeason: oldSeason.name,
        newSeason: season.name
      });
      newMessages.push({ text: seasonMsg, isStatic: false });
    }
    lastSeasonRef.current = seasonKey;
    
    // 检测天气变化
    if (lastWeatherRef.current && lastWeatherRef.current !== weatherKey) {
      const oldWeather = WEATHER_TYPES[lastWeatherRef.current] || WEATHER_TYPES.sunny;
      const weatherMsg = getMomoAnnouncement('weatherChange', {
        oldWeather: oldWeather.name,
        newWeather: weather.name
      });
      newMessages.push({ text: weatherMsg, isStatic: false });
    }
    lastWeatherRef.current = weatherKey;
    
    if (newMessages.length > 0) {
      setMessages(prev => [...newMessages, ...prev.filter(m => m.isStatic)].slice(0, 10));
      setCurrentMessageIndex(0);
    }
  }, [seasonKey, weatherKey, season, weather]);

  // 接收外部公告 - 莫莫鸟风格播报，交易信息只展示一次
  useEffect(() => {
    if (announcements && announcements.length > 0) {
      setMessages(prev => {
        // 静态消息保留，动态消息替换
        const staticMsgs = prev.filter(m => m.isStatic);
        // 新消息只展示一次
        const newMsgs = announcements.map(msg => ({ 
          text: msg, 
          isStatic: false 
        }));
        return [...newMsgs, ...staticMsgs].slice(0, 10);
      });
      setCurrentMessageIndex(0);
    }
  }, [announcements]);

  // 自动滚动显示消息，交易消息显示一次后移除
  useEffect(() => {
    if (messages.length <= 1) return;
    
    const timer = setInterval(() => {
      setCurrentMessageIndex(prev => {
        const nextIndex = (prev + 1) % messages.length;
        return nextIndex;
      });
      
      // 移除已经显示过的非静态消息
      setMessages(prev => {
        const currentMsg = prev[currentMessageIndex];
        if (currentMsg && !currentMsg.isStatic) {
          // 移除当前显示的非静态消息
          return prev.filter((_, idx) => idx !== currentMessageIndex);
        }
        return prev;
      });
    }, 5000);
    
    return () => clearInterval(timer);
  }, [messages.length, currentMessageIndex]);

  // 当前消息
  const currentMessage = messages[currentMessageIndex];

  return (
    <div className="bg-white rounded-lg shadow-md p-2 sm:p-3 mb-1">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-1">
        <div className="flex items-center space-x-1 sm:space-x-2">
          <h1 className="text-base sm:text-lg font-bold text-blue-800">动物同花顺</h1>
          <div className="flex items-center space-x-1 text-gray-600">
            <span className="text-base sm:text-lg" title={weather.name}>
              {weather.icon}
            </span>
            <span className="text-xs sm:text-sm font-medium">
              {gameTime.getFullYear() - 1999}年{gameTime.getMonth() + 1}月{gameTime.getDate()}日
            </span>
            <div className="flex items-center space-x-0.5 px-1.5 py-0.5 bg-blue-50 rounded-full">
              <span className="text-xs sm:text-sm">{season.icon}</span>
              <span className="text-xs font-medium text-blue-700">{season.name}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-1">
          {/* 居民按钮 */}
          <button
            onClick={onOpenResidents}
            className="flex items-center space-x-0.5 px-2 py-1 rounded transition-colors text-xs font-medium bg-cyan-500 hover:bg-cyan-600 text-white"
          >
            <Home className="h-3 w-3" />
            <span className="hidden sm:inline">居民</span>
          </button>
          
          {/* 梦想公司按钮 */}
          <button
            onClick={onOpenDreamCompany}
            title="查看森林梦想公司"
            className="flex items-center space-x-0.5 px-2 py-1 rounded transition-colors text-xs font-medium bg-purple-500 hover:bg-purple-600 text-white"
          >
            <Building2 className="h-3 w-3" />
            <span className="hidden sm:inline">公司</span>
          </button>
          
          {/* 我的按钮 */}
          <button
            onClick={onOpenMyInfo}
            className="flex items-center space-x-0.5 px-2 py-1 rounded transition-colors text-xs font-medium bg-indigo-500 hover:bg-indigo-600 text-white"
          >
            <User className="h-3 w-3" />
            <span className="hidden sm:inline">我的</span>
          </button>
          
          {/* 动物按钮 */}
          <button
            onClick={onOpenAnimals}
            className="flex items-center space-x-0.5 px-2 py-1 rounded transition-colors text-xs font-medium bg-teal-500 hover:bg-teal-600 text-white"
          >
            <Users className="h-3 w-3" />
            <span className="hidden sm:inline">动物</span>
          </button>
          
          <button
            onClick={onTogglePause}
            className={`flex items-center space-x-0.5 px-2 py-1 rounded transition-colors text-xs ${
              isPaused 
                ? 'bg-green-500 hover:bg-green-600 text-white' 
                : 'bg-yellow-500 hover:bg-yellow-600 text-white'
            }`}
          >
            {isPaused ? <Play className="h-3 w-3" /> : <Pause className="h-3 w-3" />}
            <span className="hidden sm:inline">{isPaused ? '继续' : '暂停'}</span>
          </button>
          
          <button
            onClick={onCycleSpeed}
            className={`flex items-center space-x-0.5 px-2 py-1 rounded transition-colors text-xs font-medium ${
              speedMode === 1 
                ? 'bg-blue-500 hover:bg-blue-600 text-white' 
                : speedMode === 2
                  ? 'bg-purple-500 hover:bg-purple-600 text-white'
                  : 'bg-red-500 hover:bg-red-600 text-white'
            }`}
          >
            <FastForward className="h-3 w-3" />
            <span>{speedMode === 1 ? '1x' : speedMode === 2 ? '2x' : '4x'}</span>
          </button>
          
          {/* 年度大会按钮 */}
          <button
            onClick={onOpenAnnualSummary}
            className="flex items-center space-x-0.5 px-2 py-1 rounded transition-colors text-xs font-medium bg-amber-500 hover:bg-amber-600 text-white"
          >
            <span>🎪</span>
            <span className="hidden sm:inline">年度大会</span>
          </button>
          
          <button
            onClick={() => {
              if (window.confirm('确定要重置游戏吗？')) {
                onReset(true);
              }
            }}
            className="flex items-center space-x-0.5 bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded transition-colors text-xs"
          >
            <RotateCcw className="h-3 w-3" />
            <span className="hidden sm:inline">重置</span>
          </button>
        </div>
      </div>
      
      {/* 莫莫鸟播报栏 */}
      <div className="mt-1 bg-gradient-to-r from-green-50 via-emerald-50 to-green-50 border border-green-200 rounded px-2 py-1 overflow-hidden">
        <div className="flex items-center">
          <div className="flex-shrink-0 bg-green-600 text-white px-1.5 py-0.5 rounded text-xs font-bold mr-2 flex items-center gap-0.5">
            <span>🐦</span>
            <span className="hidden sm:inline">莫莫鸟</span>
          </div>
          <div className="overflow-hidden flex-1">
            <div 
              key={currentMessageIndex}
              className="text-xs text-gray-700 whitespace-nowrap animate-pulse"
            >
              {currentMessage?.text || '🐦 莫莫鸟啾啾~暂无最新消息~'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameHeader;
