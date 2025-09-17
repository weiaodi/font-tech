import React, { useRef, useState, useEffect } from 'react';
import './index.less';
import { arrangeElementsByMode } from './utils/arrange';

// -------------- 具体的元素绘制函数 --------------
/**
 * 绘制单个文本元素（包含方框和文字）
 * @param ctx - Canvas 2D上下文
 * @param element - 文本元素
 * @param index - 元素索引（用于生成唯一颜色）
 */
const drawTextElement = (ctx: CanvasRenderingContext2D, element: TextElement) => {
  const { text, x, y, size = 16 } = element;
  if (x === undefined || y === undefined) return;

  // 设置文本大小
  ctx.font = `${size}px Arial`;

  // 测量文本宽度
  const textMetrics = ctx.measureText(text);
  const textWidth = textMetrics.width;
  const textHeight = size * 1.2; // 基于字体大小估算高度

  // 计算方框位置和大小（文本周围留出一些空间）
  const padding = 15;
  const rectX = x - textWidth / 2 - padding;
  const rectY = y - textHeight / 2 - padding;
  const rectWidth = textWidth + padding * 2;
  const rectHeight = textHeight + padding * 2;

  // 绘制方框
  ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
  ctx.fillRect(rectX, rectY, rectWidth, rectHeight);
  ctx.strokeStyle = '#333';
  ctx.lineWidth = 2;
  ctx.strokeRect(rectX, rectY, rectWidth, rectHeight);

  // 绘制文字（居中）
  ctx.fillStyle = '#e80a0aff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, x, y);
};

/**
 * 绘制所有文本元素
 * @param canvasRef - Canvas元素引用
 * @param elements - 文本元素数组
 */
const drawAllElements = (canvasRef: React.RefObject<HTMLCanvasElement>, elements: TextElement[]) => {
  const canvas = canvasRef.current;
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // 清空画布
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 绘制所有元素
  elements.forEach((element) => {
    drawTextElement(ctx, element);
  });
};

// -------------- 辅助函数 --------------
/**
 * 调整Canvas尺寸
 * @param canvasRef - Canvas元素引用
 */
const resizeCanvas = (canvasRef: React.RefObject<HTMLCanvasElement>) => {
  const canvas = canvasRef.current;
  if (!canvas) return;

  const container = canvas.parentElement;
  if (container) {
    canvas.width = container.clientWidth;
    canvas.height = 500;
  }
};

// -------------- 组件核心逻辑 --------------
const DrawingBoard: React.FC = () => {
  // Canvas相关引用和状态
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [textElements, setTextElements] = useState<TextElement[]>([]);
  const [currentSortMode, setCurrentSortMode] = useState<SortMode>('horizontal');
  const [inputText, setInputText] = useState<string>('');

  // 初始化Canvas和窗口大小监听
  useEffect(() => {
    resizeCanvas(canvasRef);
    drawAllElements(canvasRef, textElements);

    const handleResize = () => {
      resizeCanvas(canvasRef);
      const rearrangedElements = arrangeElementsByMode(canvasRef, textElements, currentSortMode);
      setTextElements(rearrangedElements);
      drawAllElements(canvasRef, rearrangedElements);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // 当排序方式改变或元素变化时重新排列和绘制
  useEffect(() => {
    const rearrangedElements = arrangeElementsByMode(canvasRef, textElements, currentSortMode);
    setTextElements(rearrangedElements);
    drawAllElements(canvasRef, rearrangedElements);
  }, [currentSortMode, textElements.length]);

  // 添加随机文字
  const addRandomText = () => {
    const chars = '一二三四五六七八九十甲乙丙丁戊己庚辛壬癸子丑寅卯辰巳午未申酉戌亥';
    let text = '';
    for (let i = 0; i < 10; i++) {
      text += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    setTextElements((prev) => [...prev, { text }]);
  };

  // 发送输入的文字
  const sendText = () => {
    const trimmedText = inputText.trim();
    if (trimmedText && trimmedText.length <= 10) {
      // TODO 添加ai接口

      setTextElements((prev) => [...prev, { text: trimmedText }]);
      setInputText('');
    }
  };

  // 处理输入变化
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
            maxLength={10}
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
          <button
            onClick={() => toggleSortMode('pyramid')}
            className={`btn sort-btn ${currentSortMode === 'pyramid' ? 'active' : ''}`}
          >
            <i className="fa fa-caret-down"></i> 倒金字塔
          </button>
          <button
            onClick={() => toggleSortMode('grid')}
            className={`btn sort-btn ${currentSortMode === 'grid' ? 'active' : ''}`}
          >
            <i className="fa fa-th"></i> 田字格
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
