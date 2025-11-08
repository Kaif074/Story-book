import React, { useState } from 'react';
import { Milk, Coffee, Sparkles, DicesIcon, Heart } from 'lucide-react';

interface TeaOption {
  brand: string;
  flavor: string;
  description: string;
  imageUrl: string;
}

const teaOptions: TeaOption[] = [
  {
    brand: "喜茶 (HEYTEA)",
    flavor: "芝芝莓莓",
    description: "清新草莓与醇香奶盖的完美结合",
    imageUrl: "https://images.unsplash.com/photo-1541696490-8744a5dc0228?auto=format&fit=crop&q=80&w=600"
  },
  {
    brand: "奈雪的茶",
    flavor: "芋泥波波奶茶",
    description: "香浓芋泥配上嫩滑波波",
    imageUrl: "https://images.unsplash.com/photo-1558857563-b371033873b8?auto=format&fit=crop&q=80&w=600"
  },
  {
    brand: "蜜雪冰城",
    flavor: "蜜桃四季春",
    description: "清爽茶底配上甜蜜蜜桃",
    imageUrl: "https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&q=80&w=600"
  },
  {
    brand: "CoCo都可",
    flavor: "珍珠奶茶",
    description: "经典珍珠配上浓郁奶茶",
    imageUrl: "https://images.unsplash.com/photo-1527596428171-7885b82c91c6?auto=format&fit=crop&q=80&w=600"
  },
  {
    brand: "一点点",
    flavor: "波霸奶茶",
    description: "香醇奶茶搭配弹性十足的波霸",
    imageUrl: "https://images.unsplash.com/photo-1558857563-c7d3d76edcca?auto=format&fit=crop&q=80&w=600"
  }
];

function App() {
  const [currentTea, setCurrentTea] = useState<TeaOption | null>(null);
  const [previousIndices, setPreviousIndices] = useState<number[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showHeart, setShowHeart] = useState(false);

  const getRandomTea = () => {
    setIsAnimating(true);
    setShowHeart(false);

    setTimeout(() => {
      // 获取一个不同的随机选项
      let newIndex: number;
      const availableIndices = Array.from(Array(teaOptions.length).keys())
        .filter(i => !previousIndices.includes(i));

      // 如果所有选项都用过了，重置历史记录
      if (availableIndices.length === 0) {
        setPreviousIndices([]);
        newIndex = Math.floor(Math.random() * teaOptions.length);
      } else {
        // 从剩余的选项中随机选择
        newIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)];
      }

      // 更新历史记录
      setPreviousIndices(prev => [...prev, newIndex]);
      setCurrentTea(teaOptions[newIndex]);
      setIsAnimating(false);
      setShowHeart(true);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-200 via-rose-200 to-purple-200 p-6">
      <div className="max-w-md mx-auto relative">
        {/* 装饰性气泡 */}
        <div className="absolute -top-4 -left-4 w-8 h-8 bg-pink-300 rounded-full opacity-50 animate-bounce delay-100"></div>
        <div className="absolute top-8 -right-2 w-6 h-6 bg-purple-300 rounded-full opacity-50 animate-bounce delay-300"></div>
        <div className="absolute -bottom-2 left-8 w-10 h-10 bg-rose-300 rounded-full opacity-50 animate-bounce delay-500"></div>

        <div className="text-center mb-8 relative">
          <h1 className="text-4xl font-bold text-pink-600 mb-2 tracking-wide">今日奶茶推荐</h1>
          <p className="text-pink-500 text-lg">让我来帮你选择今天的奶茶吧！</p>
          <span className="absolute -top-2 right-0 transform rotate-12 text-2xl">🧋</span>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-6 mb-6 hover:shadow-2xl transition-all duration-300">
          <button
            onClick={getRandomTea}
            className="w-full bg-gradient-to-r from-pink-400 to-purple-400 text-white rounded-2xl py-4 px-6 flex items-center justify-center gap-3 hover:from-pink-500 hover:to-purple-500 transition-all duration-300 transform hover:scale-[1.02] active:scale-95 font-medium text-lg shadow-md"
          >
            <DicesIcon className={`w-6 h-6 ${isAnimating ? 'animate-spin' : ''}`} />
            <span>随机推荐</span>
          </button>
          {previousIndices.length > 0 && (
            <p className="text-center text-sm text-pink-400 mt-2">
              已推荐 {previousIndices.length} / {teaOptions.length} 种奶茶
            </p>
          )}
        </div>

        {currentTea && (
          <div className="relative bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl overflow-hidden transform transition-all duration-500 hover:shadow-2xl">
            <div className="absolute top-4 right-4 z-10">
              {showHeart && (
                <Heart 
                  className="w-6 h-6 text-pink-500 animate-bounce fill-current"
                  style={{ animationDuration: '2s' }}
                />
              )}
            </div>
            <img
              src={currentTea.imageUrl}
              alt={currentTea.flavor}
              className="w-full h-56 object-cover transition-transform duration-700 hover:scale-105"
            />
            <div className="p-8">
              <div className="flex items-center gap-3 mb-3">
                <Coffee className="w-6 h-6 text-pink-500" />
                <h2 className="text-2xl font-bold text-pink-600">{currentTea.brand}</h2>
              </div>
              <div className="flex items-center gap-3 mb-4">
                <Milk className="w-6 h-6 text-purple-500" />
                <p className="text-xl text-purple-600 font-medium">{currentTea.flavor}</p>
              </div>
              <div className="flex items-start gap-3">
                <Sparkles className="w-6 h-6 text-yellow-400 mt-1" />
                <p className="text-gray-600 text-lg leading-relaxed">{currentTea.description}</p>
              </div>
            </div>
          </div>
        )}

        {!currentTea && (
          <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 text-center">
            <p className="text-pink-500 text-lg">点击上方按钮获取奶茶推荐 ☝️</p>
            <div className="mt-4 text-3xl animate-bounce">🧋</div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;