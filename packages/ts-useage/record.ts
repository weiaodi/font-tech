// 定义动态值枚举
enum KeyboardShortcut {
  A = Math.random(),
  B = Math.random(),
  C = Math.random(),
}

// 提取枚举的键名（'A' | 'B' | 'C'）
type ShortcutKeys = keyof typeof KeyboardShortcut;

// 约束 handlers 必须包含所有枚举键名对应的处理函数
const handlers: Record<ShortcutKeys, () => void> = {
  A: () => console.log('处理A'),
  B: () => console.log('处理B'),
  C: () => console.log('处理C'), // 若注释掉这行，TypeScript 会报错
};

// 创建枚举值到键名的映射（运行时用）
const shortcutKeyMap = Object.entries(KeyboardShortcut).reduce<Record<number, ShortcutKeys>>(
  (map, [key, value]) => {
    map[value as number] = key as ShortcutKeys;
    return map;
  },
  {} as Record<number, ShortcutKeys>,
);

// 约束事件类型（使用动态生成的枚举值）
interface ShortcutEvent {
  identifier: KeyboardShortcut;
}

// 处理方法（通过映射关系找到对应处理函数）
function handleEvent(evt: ShortcutEvent) {
  // 从枚举值找到对应的键名
  const key = shortcutKeyMap[evt.identifier as number];
  // 从 handlers 中获取处理函数（类型安全）
  const handler = handlers[key];
  handler(); // 安全调用
}
