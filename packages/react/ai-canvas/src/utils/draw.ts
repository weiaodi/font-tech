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
  const padding = 5;
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
export const drawAllElements = (canvasRef: React.RefObject<HTMLCanvasElement>, elements: TextElement[]) => {
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
