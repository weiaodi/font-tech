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

// -------------- 具体的元素绘制函数 --------------
/**
 * 绘制单个文本元素（包含方框和文字）
 * @param ctx - Canvas 2D上下文
 * @param element - 文本元素
 * @param index - 元素索引（用于生成唯一颜色）
 */
const drawTextElement = (ctx: CanvasRenderingContext2D, element: TextElement) => {
  const { text, x, y } = element;
  if (x === undefined || y === undefined) return;

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

// -------------- 具体的排序方式函数 --------------
/**
 * 横向排列元素
 * @param canvas - Canvas元素
 * @param elements - 文本元素数组
 * @returns 排序后的元素数组
 */
const arrangeHorizontally = (canvas: HTMLCanvasElement, elements: TextElement[]): TextElement[] => {
  const newElements = [...elements];
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

  return newElements;
};

/**
 * 竖向排列元素
 * @param canvas - Canvas元素
 * @param elements - 文本元素数组
 * @returns 排序后的元素数组
 */
const arrangeVertically = (canvas: HTMLCanvasElement, elements: TextElement[]): TextElement[] => {
  const newElements = [...elements];
  const padding = 30;
  const startX = canvas.width / 2;
  const availableHeight = canvas.height - padding * 2;
  const elementHeight = availableHeight / newElements.length;

  newElements.forEach((element, index) => {
    const y = padding + index * elementHeight + elementHeight / 2;
    element.x = startX;
    element.y = y;
  });

  return newElements;
};

/**
 * 根据排序模式排列元素
 * @param canvasRef - Canvas元素引用
 * @param elements - 文本元素数组
 * @param mode - 排序模式
 * @returns 排序后的元素数组
 */
const arrangeElementsByMode = (
  canvasRef: React.RefObject<HTMLCanvasElement>,
  elements: TextElement[],
  mode: SortMode,
): TextElement[] => {
  const canvas = canvasRef.current;
  if (!canvas || elements.length === 0) return [...elements];

  switch (mode) {
    case 'horizontal':
      return arrangeHorizontally(canvas, elements);
    case 'vertical':
      return arrangeVertically(canvas, elements);
    default:
      return [...elements];
  }
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
