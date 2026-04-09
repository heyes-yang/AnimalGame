import React from 'react';

const AnimalIconSelector = ({ selectedIcon, onSelectIcon }) => {
  // 预设动物图标库
  const animalIcons = [
    { id: 'cat', icon: '🐱', name: '猫' },
    { id: 'dog', icon: '🐶', name: '狗' },
    { id: 'fox', icon: '🦊', name: '狐狸' },
    { id: 'rabbit', icon: '🐰', name: '兔子' },
    { id: 'bear', icon: '🐻', name: '熊' },
    { id: 'panda', icon: '🐼', name: '熊猫' },
    { id: 'tiger', icon: '🐯', name: '老虎' },
    { id: 'lion', icon: '🦁', name: '狮子' },
    { id: 'sheep', icon: '🐑', name: '绵羊' },
    { id: 'cow', icon: '🐮', name: '奶牛' },
    { id: 'pig', icon: '🐷', name: '猪' },
    { id: 'monkey', icon: '🐵', name: '猴子' },
    { id: 'chicken', icon: '🐔', name: '鸡' },
    { id: 'duck', icon: '🦆', name: '鸭子' },
    { id: 'frog', icon: '🐸', name: '青蛙' },
    { id: 'penguin', icon: '🐧', name: '企鹅' },
    { id: 'koala', icon: '🐨', name: '考拉' },
    { id: 'owl', icon: '🦉', name: '猫头鹰' }
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4">
      <h3 className="text-lg font-bold text-gray-800 mb-3">选择你的动物头像</h3>
      <div className="grid grid-cols-6 sm:grid-cols-9 gap-2">
        {animalIcons.map((animal) => (
          <div
            key={animal.id}
            onClick={() => onSelectIcon(animal.icon)}
            className={`
              flex flex-col items-center justify-center p-2 rounded-lg cursor-pointer transition-all
              ${selectedIcon === animal.icon 
                ? 'bg-blue-100 border-2 border-blue-500 transform scale-110' 
                : 'hover:bg-gray-100 border-2 border-transparent hover:border-gray-300'}
            `}
          >
            <div className="text-2xl mb-1">{animal.icon}</div>
            <div className="text-xs text-gray-600">{animal.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnimalIconSelector;
