import React, { useRef, useState, useEffect } from 'react';
import './index.less';

// 定义文本元素的类型
interface TextElement {
  text: string;
  x?: number;
  y?: number;
}

// 定义排序模式的类型
type SortMode = 'horizontal' | 'vertical';

const DrawingBoard: React.FC = () => {
  // Canvas相关引用和状态
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [textElements, setTextElements] = useState<TextElement[]>([]);
  const [currentSortMode, setCurrentSortMode] = useState<SortMode>('horizontal');
  const [inputText, setInputText] = useState<string>('');

  // 初始化Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      const container = canvas.parentElement;
      if (container) {
        canvas.width = container.clientWidth;
        canvas.height = 500;
        redrawAllElements();
      }
    };

    // 初始化尺寸
    resizeCanvas();
    // 监听窗口大小变化
    window.addEventListener('resize', resizeCanvas);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [textElements]);

  // 绘制所有元素
  const redrawAllElements = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 清空画布
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 绘制所有文本框
    textElements.forEach((element, index) => {
      const { text, x, y } = element;
      if (x === undefined || y === undefined) return;

      // 设置字体
      ctx.font = '24px Arial';

      // 测量文本宽度
      const textMetrics = ctx.measureText(text);
      const textWidth = textMetrics.width;
      const textHeight = 30; // 估算的文本高度

      // 计算方框位置和大小（文本周围留出一些空间）
      const padding = 15;
      const rectX = x - textWidth / 2 - padding;
      const rectY = y - textHeight / 2 - padding;
      const rectWidth = textWidth + padding * 2;
      const rectHeight = textHeight + padding * 2;

      // 绘制方框（每个框使用不同的颜色）
      const hue = (index * 60) % 360;
      ctx.strokeStyle = `hsl(${hue}, 70%, 50%)`;
      ctx.lineWidth = 2;
      ctx.strokeRect(rectX, rectY, rectWidth, rectHeight);

      // 绘制文字（居中）
      ctx.fillStyle = '#333';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(text, x, y);
    });
  };

  // 排列元素
  const arrangeElements = () => {
    const canvas = canvasRef.current;
    if (!canvas || textElements.length === 0) return;

    const newElements: TextElement[] = [...textElements];

    if (currentSortMode === 'horizontal') {
      const padding = 30;
      const textHeight = 30;
      const boxPadding = 15;
      const totalBoxHeight = textHeight + boxPadding * 2;
      const startY = (canvas.height - totalBoxHeight) / 2 + totalBoxHeight / 2;
      const availableWidth = canvas.width - padding * 2;
      const elementWidth = availableWidth / newElements.length;

      newElements.forEach((element, index) => {
        const x = padding + index * elementWidth + elementWidth / 2;
        element.x = x;
        element.y = startY;
      });
    } else {
      const padding = 30;
      const textHeight = 30;
      const boxPadding = 15;
      const totalBoxHeight = textHeight + boxPadding * 2;
      const startX = canvas.width / 2;
      const availableHeight = canvas.height - padding * 2;
      const elementHeight = availableHeight / newElements.length;

      newElements.forEach((element, index) => {
        const y = padding + index * elementHeight + elementHeight / 2;
        element.x = startX;
        element.y = y;
      });
    }

    setTextElements(newElements);
  };

  // 当排序方式改变或元素变化时重新排列
  useEffect(() => {
    arrangeElements();
  }, [currentSortMode, textElements.length]);

  // 添加随机文字
  const addRandomText = () => {
    const chars = '一二三四五六七八九十甲乙丙丁戊己庚辛壬癸子丑寅卯辰巳午未申酉戌亥';
    let text = '';
    for (let i = 0; i < 10; i++) {
      text += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    setTextElements([...textElements, { text }]);
  };

  // 发送输入的文字
  const sendText = () => {
    const trimmedText = inputText.trim();
    if (trimmedText) {
      // 发送逻辑预留位置
      // 您可以在这里编写自己的发送逻辑

      // 默认行为：添加到画布
      setTextElements([...textElements, { text: trimmedText }]);
      setInputText('');
    }
  };

  // 处理输入变化
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // 限制最多输入10个字符
    if (e.target.value.length <= 10) {
      setInputText(e.target.value);
    }
  };

  // 处理键盘回车
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      sendText();
    }
  };

  // 清除画布
  const clearCanvas = () => {
    setTextElements([]);
  };

  // 切换排序方式
  const toggleSortMode = (mode: SortMode) => {
    setCurrentSortMode(mode);
  };

  return (
    <div className="drawing-board-container">
      <h1 className="title">React画板应用</h1>

      <div className="controls">
        <div className="input-group">
          <input
            type="text"
            value={inputText}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder="输入文字内容（最多10字）"
            className="text-input"
          />
          <button onClick={sendText} className="btn send-btn">
            <i className="fa fa-paper-plane"></i> 发送
          </button>
        </div>

        <button onClick={addRandomText} className="btn add-text-btn">
          <i className="fa fa-font"></i> 添加随机文字
        </button>

        <div className="sort-buttons">
          <button
            onClick={() => toggleSortMode('horizontal')}
            className={`btn sort-btn ${currentSortMode === 'horizontal' ? 'active' : ''}`}
          >
            <i className="fa fa-arrows-h"></i> 横向
          </button>
          <button
            onClick={() => toggleSortMode('vertical')}
            className={`btn sort-btn ${currentSortMode === 'vertical' ? 'active' : ''}`}
          >
            <i className="fa fa-arrows-v"></i> 竖向
          </button>
        </div>

        <button onClick={clearCanvas} className="btn clear-btn">
          <i className="fa fa-trash"></i> 清除画布
        </button>
      </div>

      <div className="canvas-container">
        <canvas ref={canvasRef} className="drawing-canvas"></canvas>
      </div>
    </div>
  );
};

export default DrawingBoard;
