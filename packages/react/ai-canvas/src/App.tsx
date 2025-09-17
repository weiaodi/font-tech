import React, { useRef, useState, useEffect } from 'react';
import './index.less';
import { arrangeElementsByMode } from './utils/arrange';
import { drawAllElements } from './utils/draw';

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
    canvas.height = 900;
  }
};

// -------------- 组件核心逻辑 --------------
const DrawingBoard: React.FC = () => {
  // Canvas相关引用和状态
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [textElements, setTextElements] = useState<TextElement[]>([]);
  const [currentSortMode, setCurrentSortMode] = useState<string>('horizontal');
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
    let text = '一二三四五六七八九十甲乙丙丁/n戊己庚辛壬癸子丑寅卯辰巳午未申酉戌亥';
    setTextElements((prev) => [...prev, { text }]);
  };

  // 发送输入的文字
  const sendText = () => {
    const trimmedText = inputText.trim();
    if (trimmedText && trimmedText.length <= 10) {
      // TODO 添加ai接口
    }
  };

  // 处理输入变化
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length <= 10) {
      setInputText(e.target.value);
    }
  };

  // 切换排序方式
  const toggleSortMode = (mode: string) => {
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
      </div>

      <div className="canvas-container">
        <canvas ref={canvasRef} className="drawing-canvas"></canvas>
      </div>
    </div>
  );
};

export default DrawingBoard;
