interface TextElement {
  text: string;
  x?: number;
  y?: number;
  size?: number; // 新增：用于倒金字塔的大小变化
}
// 定义排序模式的类型，添加新的排版方式
type SortMode = 'horizontal' | 'vertical' | 'pyramid' | 'grid';
