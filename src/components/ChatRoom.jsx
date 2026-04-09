import React, { useState, useEffect, useRef } from 'react';
import { TrendingUp, TrendingDown, Cloud, Sun, Leaf, Snowflake, MessageCircle, Calendar, Briefcase, Award } from 'lucide-react';
import { animalNames } from '../data/chatMessages';

const ChatRoom = ({ chatMessages }) => {
  const [displayedMessages, setDisplayedMessages] = useState([]);
  const [animatingId, setAnimatingId] = useState(null);
  const prevMessagesRef = useRef([]);
  const isInitializedRef = useRef(false);

  const getMessageIcon = (type) => {
    switch (type) {
      case 'buy': return <TrendingUp className="h-3 w-3 text-red-500" />;
      case 'sell': return <TrendingDown className="h-3 w-3 text-green-500" />;
      case 'weather': return <Cloud className="h-3 w-3 text-blue-500" />;
      case 'season': return <Leaf className="h-3 w-3 text-amber-500" />;
      case 'chat': return <MessageCircle className="h-3 w-3 text-purple-500" />;
      case 'annualMeeting': return <Award className="h-3 w-3 text-yellow-500" />;
      case 'work': return <Briefcase className="h-3 w-3 text-orange-500" />;
      default: return null;
    }
  };

  const getMessageBgColor = (type) => {
    switch (type) {
      case 'buy': return 'bg-red-50 border-red-200';
      case 'sell': return 'bg-green-50 border-green-200';
      case 'weather': return 'bg-blue-50 border-blue-200';
      case 'season': return 'bg-amber-50 border-amber-200';
      case 'chat': return 'bg-purple-50 border-purple-200';
      case 'annualMeeting': return 'bg-yellow-50 border-yellow-200';
      case 'work': return 'bg-orange-50 border-orange-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  const getAnimalIcon = (animalType) => {
    const icons = {
      cat: '🐱',
      dog: '🐶',
      bear: '🐻',
      fox: '🦊',
      tiger: '🐯',
      rabbit: '🐰',
      cow: '🐮',
      momo: '🐦'
    };
    return icons[animalType] || '🐾';
  };

  const formatTime = (time) => {
    if (!time) return '';
    return time;
  };

  // 监听 chatMessages 变化，逐条添加新消息
  useEffect(() => {
    const currentMessages = chatMessages || [];
    
    // 初始化：第一次加载时直接显示所有消息，不带动画
    if (!isInitializedRef.current) {
      setDisplayedMessages(currentMessages.slice(-20).reverse());
      prevMessagesRef.current = currentMessages;
      isInitializedRef.current = true;
      return;
    }

    const prevMessages = prevMessagesRef.current;

    // 找出真正新增的消息（基于 id 比较）
    const newMessages = currentMessages.filter(
      msg => !prevMessages.some(prev => prev.id === msg.id)
    );

    if (newMessages.length === 0) {
      // 没有新消息，不需要更新显示
      return;
    }

    // 更新 prevMessagesRef
    prevMessagesRef.current = currentMessages;

    // 逐条添加新消息，每条间隔 300ms
    let index = 0;
    const addNextMessage = () => {
      if (index < newMessages.length) {
        const newMsg = newMessages[index];
        setAnimatingId(newMsg.id);
        
        // 新消息插入到最前面
        setDisplayedMessages(prev => {
          const updated = [newMsg, ...prev];
          return updated.slice(0, 20); // 保持最多20条
        });

        // 动画结束后清除动画状态
        setTimeout(() => {
          setAnimatingId(null);
        }, 500);

        index++;
        setTimeout(addNextMessage, 300);
      }
    };

    addNextMessage();
  }, [chatMessages]);

  return (
    <div 
      className="overflow-y-auto scrollbar-hide"
      style={{ maxHeight: '320px' }}
    >
      {displayedMessages.length > 0 ? (
        <div className="space-y-1">
          {displayedMessages.map((msg, index) => (
            <div
              key={msg.id || index}
              className={`p-1.5 rounded border ${getMessageBgColor(msg.type)} transition-all duration-300 ${
                animatingId === msg.id ? 'animate-slide-in' : ''
              }`}
            >
              <div className="flex items-start gap-1.5">
                <span className="text-sm flex-shrink-0">{getAnimalIcon(msg.animalType)}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1">
                    <span className="font-medium text-gray-800 text-xs truncate">
                      {msg.playerName || animalNames[msg.animalType] || '动物'}
                    </span>
                    {getMessageIcon(msg.type)}
                    <span className="text-xs text-gray-400">{formatTime(msg.time)}</span>
                  </div>
                  <div className="text-xs text-gray-600 mt-0.5 line-clamp-2">
                    {msg.text}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500 py-8">
          <div className="text-2xl mb-1">🐦</div>
          <div className="text-xs">暂无聊天记录</div>
          <div className="text-xs text-gray-400 mt-0.5">动物们开始交易后会有消息</div>
        </div>
      )}

      {/* 动画样式 */}
      <style>{`
        @keyframes slide-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
      `}</style>
    </div>
  );
};

export default ChatRoom;
