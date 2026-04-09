import React, { useState } from 'react';
import { UserPlus } from 'lucide-react';
import AnimalIconSelector from './AnimalIconSelector';

const PlayerSelection = ({ players, onSelectPlayer, userPlayer }) => {
  const [newPlayerName, setNewPlayerName] = useState('');
  const [newPlayerMoney, setNewPlayerMoney] = useState(2000);
  const [newPlayerShares, setNewPlayerShares] = useState(0);
  const [selectedIcon, setSelectedIcon] = useState('🐱'); // 默认头像
  const [nameError, setNameError] = useState(''); // 姓名错误提示

  // 获取所有已存在的动物名称列表
  const existingNames = Object.values(players)
    .filter(p => p && p.name)
    .map(p => p.name);

  // 检查名称是否重复
  const checkNameDuplicate = (name) => {
    const trimmedName = name.trim();
    if (!trimmedName) {
      setNameError('请输入角色名称');
      return true;
    }
    if (existingNames.includes(trimmedName)) {
      setNameError('该名称已被其他动物使用，请换一个');
      return true;
    }
    setNameError('');
    return false;
  };

  // 动物系可爱名称生成器 - 根据选择的动物图标生成对应名称（避免与已有名称重复）
  const generateAnimalName = (icon) => {
    const animalNameMap = {
      '🐱': ['萌萌小猫', '可爱猫咪', '活泼小猫', '聪明猫咪', '机智小猫'],
      '🐶': ['萌萌小狗', '可爱狗狗', '活泼小狗', '聪明狗狗', '机智小狗'],
      '🦊': ['萌萌小狐', '可爱狐狸', '活泼小狐', '聪明狐狸', '机智小狐'],
      '🐰': ['萌萌小兔', '可爱兔子', '活泼小兔', '聪明兔子', '机智小兔'],
      '🐻': ['萌萌小熊', '可爱熊宝', '活泼小熊', '聪明熊宝', '机智小熊'],
      '🐼': ['萌萌熊猫', '可爱熊猫', '活泼熊猫', '聪明熊猫', '机智熊猫'],
      '🐯': ['萌萌小虎', '可爱老虎', '活泼小虎', '聪明老虎', '机智小虎'],
      '🦁': ['萌萌小狮', '可爱狮子', '活泼小狮', '聪明狮子', '机智小狮'],
      '🐑': ['萌萌小羊', '可爱绵羊', '活泼小羊', '聪明绵羊', '机智小羊'],
      '🐮': ['萌萌小牛', '可爱奶牛', '活泼小牛', '聪明奶牛', '机智小牛'],
      '🐷': ['萌萌小猪', '可爱猪宝', '活泼小猪', '聪明猪宝', '机智小猪'],
      '🐵': ['萌萌小猴', '可爱猴子', '活泼小猴', '聪明猴子', '机智小猴'],
      '🐔': ['萌萌小鸡', '可爱鸡宝', '活泼小鸡', '聪明鸡宝', '机智小鸡'],
      '🦆': ['萌萌小鸭', '可爱鸭子', '活泼小鸭', '聪明鸭子', '机智小鸭'],
      '🐸': ['萌萌小蛙', '可爱青蛙', '活泼小蛙', '聪明青蛙', '机智小蛙'],
      '🐧': ['萌萌企鹅', '可爱企鹅', '活泼企鹅', '聪明企鹅', '机智企鹅'],
      '🐨': ['萌萌考拉', '可爱考拉', '活泼考拉', '聪明考拉', '机智考拉'],
      '🦉': ['萌萌小猫头鹰', '可爱猫头鹰', '活泼小猫头鹰', '聪明猫头鹰', '机智小猫头鹰']
    };
    
    // 如果有对应动物的名称列表，从中随机选择一个不重复的
    if (animalNameMap[icon]) {
      const names = animalNameMap[icon].filter(n => !existingNames.includes(n));
      if (names.length > 0) {
        return names[Math.floor(Math.random() * names.length)];
      }
    }
    
    // 默认名称生成逻辑 - 确保不重复
    const adjectives = ['萌萌', '可爱', '活泼', '聪明', '机智', '勇敢', '温柔', '调皮', '乖巧', '憨厚', '快乐', '幸运'];
    const animals = ['小熊', '小兔', '小猫', '小狗', '小狐', '小鹿', '小羊', '小猪', '小牛', '小马', '小鸟', '小鱼'];
    const suffixes = ['宝', '宝儿', '贝贝', '乖乖', '豆豆', '球球', '团团', '圆圆', '糖糖', '果果', '点点', '萌萌'];
    
    // 尝试生成不重复的名称（最多尝试10次）
    for (let i = 0; i < 10; i++) {
      const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
      const animal = animals[Math.floor(Math.random() * animals.length)];
      const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
      const name = `${adjective}${animal}${suffix}`;
      
      if (!existingNames.includes(name)) {
        return name;
      }
    }
    
    // 如果还是重复，加上随机数字
    const randomNum = Math.floor(Math.random() * 1000);
    return `森林玩家${randomNum}`;
  };

  // 生成随机名称
  const handleGenerateName = () => {
    setNewPlayerName(generateAnimalName(selectedIcon));
  };

  const handleCreatePlayer = () => {
    // 检查名称是否重复
    if (checkNameDuplicate(newPlayerName)) {
      return;
    }
    
    // 检查名称是否为空
    if (!newPlayerName.trim()) {
      setNameError('请输入角色名称');
      return;
    }
    
    const newPlayer = {
      name: newPlayerName.trim(),
      money: Number(newPlayerMoney),
      shares: Number(newPlayerShares),
      icon: selectedIcon,
      emotion: 'neutral'
    };
    
    onSelectPlayer('user', newPlayer);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">🎮 创建你的角色</h2>
      
      <div className="space-y-4">
        {/* 说明 */}
        <div className="p-4 bg-blue-50 rounded-lg text-sm text-gray-600">
          <p>💡 选择你喜欢的动物头像，设置名称和初始资产，开始你的投资之旅！</p>
          <p className="mt-1 text-xs">注意：你是作为新玩家加入游戏，不会影响原有的动物们。</p>
        </div>
        
        {/* 头像选择器 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            选择你的动物头像
          </label>
          <AnimalIconSelector 
            selectedIcon={selectedIcon} 
            onSelectIcon={setSelectedIcon} 
          />
        </div>
        
        {/* 角色名称 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            你的角色名称
          </label>
          <div className="flex space-x-2">
            <input
              type="text"
              value={newPlayerName}
              onChange={(e) => {
                setNewPlayerName(e.target.value);
                if (e.target.value.trim()) {
                  checkNameDuplicate(e.target.value);
                } else {
                  setNameError('');
                }
              }}
              className={`flex-1 p-2 border rounded-lg focus:ring-2 focus:border-transparent ${
                nameError ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
              }`}
              placeholder="输入你的角色名称"
            />
            <button
              onClick={handleGenerateName}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors whitespace-nowrap"
            >
              随机生成
            </button>
          </div>
          {nameError && (
            <div className="text-sm text-red-500 mt-1">{nameError}</div>
          )}
          <div className="text-xs text-gray-500 mt-1">
            已被使用的名称: {existingNames.join('、') || '无'}
          </div>
        </div>
        
        {/* 初始资金 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            初始资金
          </label>
          <div className="flex items-center space-x-2">
            <span className="text-gray-500">¥</span>
            <input
              type="number"
              value={newPlayerMoney}
              onChange={(e) => setNewPlayerMoney(Number(e.target.value))}
              className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              min="100"
              step="100"
            />
          </div>
          <div className="text-xs text-gray-500 mt-1">
            建议范围：1000 - 50000
          </div>
        </div>
        
        {/* 初始股份 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            初始股份
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="number"
              value={newPlayerShares}
              onChange={(e) => setNewPlayerShares(Number(e.target.value))}
              className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              min="0"
              step="100"
            />
            <span className="text-gray-500">股</span>
          </div>
          <div className="text-xs text-gray-500 mt-1">
            💡 初始股份为0也可以，你可以通过买入获得股份
          </div>
        </div>

        {/* 已有动物展示 */}
        <div className="border-t pt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            游戏中的动物们
          </label>
          <div className="flex flex-wrap gap-2">
            {Object.entries(players).map(([key, player]) => (
              <div key={key} className="flex items-center space-x-1 px-2 py-1 bg-gray-100 rounded-full text-sm">
                <span>{player.icon}</span>
                <span className="text-gray-700">{player.name}</span>
              </div>
            ))}
          </div>
        </div>
        
        {/* 创建按钮 */}
        <button
          onClick={handleCreatePlayer}
          disabled={!newPlayerName.trim() || nameError}
          className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
        >
          <UserPlus className="h-5 w-5" />
          <span>创建角色并开始游戏</span>
        </button>
      </div>
    </div>
  );
};

export default PlayerSelection;
