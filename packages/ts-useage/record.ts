// 模拟事件工具类：生成固定唯一数字ID
const events = {
  idMap: {} as Record<string, number>,
  currentId: 1000,

  getUniqueId: (key: string): number => {
    if (events.idMap[key]) {
      return events.idMap[key];
    }
    // 生成自增的唯一数字ID
    const uniqueId = events.currentId++;
    events.idMap[key] = uniqueId;
    return uniqueId;
  },
};

// 字符串枚举定义（现在使用数字ID，符合枚举要求）
enum KeyboardShortcut {
  /** 添加新工作表 */
  ADD_NEW_SHEET = events.getUniqueId('add-new-sheet'),
  /** 自动求和 */
  AUTO_SUM = events.getUniqueId('auto-sum'),
  /** 加粗文本 */
  BOLD = events.getUniqueId('bold'),
}

// 提取枚举键名类型（用于强类型约束）
type ShortcutKeys = keyof typeof KeyboardShortcut;

// 快捷键处理函数映射（强类型约束）
const shortcutHandlers: Record<ShortcutKeys, () => void> = {
  ADD_NEW_SHEET: () => {
    console.log('执行：添加新工作表');
  },
  AUTO_SUM: () => {
    console.log('执行：自动求和计算');
  },
  BOLD: () => {
    console.log('执行：文本加粗');
  },
};

/**
 * 处理快捷键事件的入口函数
 * @param evt 包含快捷键标识的事件对象
 */
function handleShortcutEvent(evt: { identifier: number }): void {
  // 通过事件标识查找对应的枚举键名
  const keyName = KeyboardShortcut[evt.identifier] as ShortcutKeys;

  if (!keyName) {
    console.warn(`未找到匹配的快捷键处理函数: ${evt.identifier}`);
    return;
  }

  // 执行对应的处理函数
  shortcutHandlers[keyName]();
}
