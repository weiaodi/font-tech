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

  return newElements.map((element, index) => ({
    ...element,
    size: 16, // 重置大小
    x: padding + index * elementWidth + elementWidth / 2,
    y: startY,
  }));
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

  return newElements.map((element, index) => ({
    ...element,
    size: 16, // 重置大小
    x: startX,
    y: padding + index * elementHeight + elementHeight / 2,
  }));
};

/**
 * 倒金字塔排列元素（垂直向下，元素由小到大）
 * @param canvas - Canvas元素
 * @param elements - 文本元素数组
 * @returns 排序后的元素数组
 */
const arrangePyramid = (canvas: HTMLCanvasElement, elements: TextElement[]): TextElement[] => {
  const newElements = [...elements];
  if (newElements.length === 0) return newElements;

  // 计算金字塔的总行数（尽量接近正方形的行数）
  let rows = Math.ceil(Math.sqrt(newElements.length));
  // 确保有足够的元素填充金字塔
  while ((rows * (rows + 1)) / 2 < newElements.length) {
    rows++;
  }

  const padding = 40;
  const maxSize = 24;
  const minSize = 10;
  const sizeIncrement = (maxSize - minSize) / rows;
  const verticalSpacing = 60;
  const startY = padding + maxSize;

  let elementIndex = 0;

  // 从金字塔顶端到底部排列
  for (let row = 0; row < rows && elementIndex < newElements.length; row++) {
    // 当前行的元素数量（第row行有row+1个元素）
    const elementsInRow = row + 1;
    // 当前行的字体大小（从上到下增大）
    const fontSize = minSize + sizeIncrement * (row + 1);
    // 当前行的Y坐标
    const y = startY + row * verticalSpacing;
    // 计算当前行元素的水平间距
    const horizontalSpacing = (canvas.width - padding * 2) / (elementsInRow + 1);

    for (let col = 0; col < elementsInRow && elementIndex < newElements.length; col++) {
      const x = padding + (col + 1) * horizontalSpacing;

      newElements[elementIndex] = {
        ...newElements[elementIndex],
        size: fontSize,
        x,
        y,
      };

      elementIndex++;
    }
  }

  return newElements;
};

/**
 * 田字格排列元素（水平向右）
 * @param canvas - Canvas元素
 * @param elements - 文本元素数组
 * @returns 排序后的元素数组
 */
const arrangeGrid = (canvas: HTMLCanvasElement, elements: TextElement[]): TextElement[] => {
  const newElements = [...elements];
  if (newElements.length === 0) return newElements;

  // 计算网格的行列数（尽量接近正方形）
  const cols = Math.ceil(Math.sqrt(newElements.length));
  const rows = Math.ceil(newElements.length / cols);

  const padding = 30;
  const elementWidth = (canvas.width - padding * 2) / cols;
  const elementHeight = (canvas.height - padding * 2) / rows;

  return newElements.map((element, index) => {
    const col = index % cols;
    const row = Math.floor(index / cols);

    return {
      ...element,
      size: 16, // 重置大小
      x: padding + col * elementWidth + elementWidth / 2,
      y: padding + row * elementHeight + elementHeight / 2,
    };
  });
};

/**
 * 根据排序模式排列元素
 * @param canvasRef - Canvas元素引用
 * @param elements - 文本元素数组
 * @param mode - 排序模式
 * @returns 排序后的元素数组
 */
export const arrangeElementsByMode = (
  canvasRef: React.RefObject<HTMLCanvasElement>,
  elements: TextElement[],
  mode: string,
): TextElement[] => {
  const canvas = canvasRef.current;
  if (!canvas || elements.length === 0) return [...elements];

  switch (mode) {
    case 'horizontal':
      return arrangeHorizontally(canvas, elements);
    case 'vertical':
      return arrangeVertically(canvas, elements);
    case 'pyramid':
      return arrangePyramid(canvas, elements);
    case 'grid':
      return arrangeGrid(canvas, elements);
    default:
      return [...elements];
  }
};
