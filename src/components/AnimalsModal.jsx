import React from 'react';
import { X, Trophy, TrendingUp, TrendingDown, Briefcase, Coins } from 'lucide-react';

const AnimalsModal = ({ isOpen, onClose, players, currentPrice, userPlayer }) => {
  if (!isOpen || !players) return null;

  // 计算玩家总市值并排序（考虑冻结资产）
  const playerList = Object.entries(players)
    .map(([key, player]) => {
      // 计算总价值时包含冻结资产
      const frozenMoney = player.frozenMoney || 0;
      const frozenShares = player.frozenShares || 0;
      const totalValue = (player.money || 0) + frozenMoney + 
                         ((player.shares || 0) + frozenShares) * currentPrice;
      const isUser = userPlayer && userPlayer.name === player.name;
      return {
        key,
        ...player,
        totalValue,
        isUser
      };
    })
    .sort((a, b) => b.totalValue - a.totalValue);

  // 排名样式
  const getRankStyle = (rank) => {
    switch (rank) {
      case 1: return 'bg-yellow-100 border-yellow-400';
      case 2: return 'bg-gray-100 border-gray-400';
      case 3: return 'bg-orange-100 border-orange-400';
      default: return 'bg-white border-gray-200';
    }
  };

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1: return '🥇';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return `${rank}`;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        {/* 头部 */}
        <div className="sticky top-0 bg-white border-b p-3 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            <h2 className="text-base font-bold text-gray-800">动物排行榜</h2>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* 内容 */}
        <div className="p-3 space-y-2">
          {playerList.map((player, index) => {
            const rank = index + 1;
            // 计算盈亏时使用 totalValue（已包含冻结资产）
            const initialValue = (player.initialMoney || 0) + (player.initialShares || 0) * (player.initialPrice || 1.0);
            const profit = player.totalValue - initialValue;
            const profitRate = initialValue > 0 
              ? (profit / initialValue * 100) 
              : 0;
            const workIncome = player.totalWorkIncome || 0;

            return (
              <div
                key={player.key}
                className={`border rounded-lg p-2 ${getRankStyle(rank)} ${player.isUser ? 'ring-2 ring-blue-400' : ''}`}
              >
                <div className="flex items-center justify-between">
                  {/* 左侧：排名和头像 */}
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 flex items-center justify-center text-sm font-bold">
                      {getRankIcon(rank)}
                    </div>
                    <span className="text-xl">{player.icon || '🐾'}</span>
                    <div>
                      <div className="font-medium text-sm text-gray-800">
                        {player.name}
                        {player.isUser && <span className="ml-1 text-xs text-blue-500">(我)</span>}
                      </div>
                      <div className="text-xs text-gray-500">
                        现金: ¥{(player.money || 0).toFixed(0)} | 持股: {player.shares || 0}
                      </div>
                      {/* 打工收入 */}
                      {workIncome > 0 && (
                        <div className="text-xs text-orange-600 flex items-center gap-0.5 mt-0.5">
                          <Briefcase className="h-3 w-3" />
                          打工收入: ¥{workIncome.toFixed(0)}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* 右侧：市值和盈亏 */}
                  <div className="text-right">
                    <div className="font-bold text-sm text-blue-600">¥{player.totalValue.toFixed(0)}</div>
                    <div className={`text-xs ${profit >= 0 ? 'text-red-500' : 'text-green-500'}`}>
                      {profit >= 0 ? <TrendingUp className="h-3 w-3 inline" /> : <TrendingDown className="h-3 w-3 inline" />}
                      {profit >= 0 ? '+' : ''}¥{profit.toFixed(0)} ({profitRate >= 0 ? '+' : ''}{profitRate.toFixed(1)}%)
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* 统计信息 */}
        <div className="border-t p-3 bg-gray-50">
          <div className="grid grid-cols-4 gap-2 text-center text-xs">
            <div>
              <div className="text-gray-500">参与动物</div>
              <div className="font-bold text-gray-800">{playerList.length}</div>
            </div>
            <div>
              <div className="text-gray-500">总市值</div>
              <div className="font-bold text-gray-800">¥{playerList.reduce((sum, p) => sum + p.totalValue, 0).toFixed(0)}</div>
            </div>
            <div>
              <div className="text-gray-500">当前股价</div>
              <div className="font-bold text-blue-600">¥{currentPrice.toFixed(3)}</div>
            </div>
            <div>
              <div className="text-gray-500">打工总收入</div>
              <div className="font-bold text-orange-600">¥{playerList.reduce((sum, p) => sum + (p.totalWorkIncome || 0), 0).toFixed(0)}</div>
            </div>
          </div>
        </div>

        {/* 底部 */}
        <div className="border-t p-3">
          <button
            onClick={onClose}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded text-sm font-medium"
          >
            关闭
          </button>
        </div>
      </div>
    </div>
  );
};

export default AnimalsModal;
