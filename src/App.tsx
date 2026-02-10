```typescript
import React, { useState, useRef } from 'react';
import { Upload, ZoomIn, ZoomOut, RefreshCw } from 'lucide-react';

const FlashlightGame = () => {
  const [image, setImage] = useState(null);
  const [maskSize, setMaskSize] = useState(150);
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });
  const [isRevealed, setIsRevealed] = useState(false);
  const containerRef = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (en) => setImage(en.target.result);
      reader.readAsDataURL(file);
      setIsRevealed(false);
    }
  };

  const handleMouseMove = (e) => {
    if (!containerRef.current || isRevealed) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleTouchMove = (e) => {
    if (!containerRef.current || isRevealed || !e.touches[0]) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMousePos({
      x: e.touches[0].clientX - rect.left,
      y: e.touches[0].clientY - rect.top,
    });
  };

  return (
    <div className="flex flex-col items-center p-6 bg-slate-50 rounded-xl shadow-lg max-w-3xl mx-auto my-8">
      <h2 className="text-2xl font-bold mb-4 text-slate-800">🔍 放大鏡猜圖遊戲</h2>
      
      <div className="flex gap-4 mb-6 flex-wrap justify-center">
        <label className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-blue-700 transition">
          <Upload size={20} />
          上傳圖片
          <input type="file" className="hidden" onChange={handleImageUpload} accept="image/*" />
        </label>
        
        <div className="flex items-center gap-2 bg-white border px-3 py-1 rounded-lg">
          <ZoomOut size={18} />
          <input 
            type="range" 
            min="50" 
            max="300" 
            value={maskSize} 
            onChange={(e) => setMaskSize(parseInt(e.target.value))}
            className="w-24"
          />
          <ZoomIn size={18} />
        </div>

        <button 
          onClick={() => setIsRevealed(!isRevealed)}
          className="flex items-center gap-2 bg-amber-500 text-white px-4 py-2 rounded-lg hover:bg-amber-600 transition"
        >
          <RefreshCw size={20} />
          {isRevealed ? "隱藏答案" : "揭曉答案"}
        </button>
      </div>

      <div 
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onTouchMove={handleTouchMove}
        className="relative w-full aspect-video bg-black rounded-lg overflow-hidden cursor-none border-4 border-slate-200"
        style={{ maxHeight: '500px' }}
      >
        {image ? (
          <>
            <img 
              src={image} 
              alt="Game" 
              className="w-full h-full object-contain"
            />
            
            {!isRevealed && (
              <div 
                className="absolute inset-0 bg-black"
                style={{
                  maskImage: `radial-gradient(circle ${maskSize / 2}px at ${mousePos.x}px ${mousePos.y}px, transparent 100%, black 100%)`,
                  WebkitMaskImage: `radial-gradient(circle ${maskSize / 2}px at ${mousePos.x}px ${mousePos.y}px, transparent 100%, black 100%)`,
                  maskComposite: 'exclude',
                  WebkitMaskComposite: 'destination-out',
                }}
              />
            )}
            
            {!isRevealed && mousePos.x > -500 && (
              <div 
                className="absolute pointer-events-none border-2 border-white rounded-full shadow-[0_0_20px_rgba(255,255,255,0.5)]"
                style={{
                  width: `${maskSize}px`,
                  height: `${maskSize}px`,
                  left: `${mousePos.x - maskSize / 2}px`,
                  top: `${mousePos.y - maskSize / 2}px`,
                }}
              />
            )}
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400 flex-col gap-2">
            <p>請先上傳一張圖片（例如地鐵站圖示）</p>
            <p className="text-sm">上傳後，將滑鼠移入此區域開始遊戲</p>
          </div>
        )}
      </div>

      <div className="mt-4 text-slate-500 text-sm italic">
        提示：移動滑鼠或手指來探索圖片隱藏的部分！
      </div>
    </div>
  );
};

export default FlashlightGame;
```
