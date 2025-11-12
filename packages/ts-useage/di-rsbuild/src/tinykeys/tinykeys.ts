/**
 * 单次按键组合（一个完整的按键动作，包含修饰键+普通键）
 * 格式：[修饰键数组, 按键名/正则表达式]
 * 示例：[['Control', 'Shift'], 'a'] → 对应 Ctrl+Shift+A
 */
export type KeyBindingPress = [mods: string[], key: string | RegExp];

/**
 * 按键绑定映射表：支持两种格式
 * - 简化版：直接映射回调函数（默认使用全局配置）
 * - 完整版：配置动作选项 + 回调函数
 */
export interface KeyBindingMap {
  [keybinding: string]: (event: KeyboardEvent) => void;
}

/**
 * 按键绑定处理器配置项
 */
export interface KeyBindingHandlerOptions {
  /**
   * 按键序列的超时时间（单位：毫秒）
   * 连续按键之间超过该时间未操作，序列会被取消（默认：1000ms）
   *
   * 注意：设置过短（如 300ms）会导致用户操作来不及完成，影响体验
   */
  timeout?: number;
  /** 是否阻止浏览器默认行为（如 Ctrl+s 保存、F5 刷新） */
  preventDefault?: boolean;
  /** 是否阻止事件冒泡到父元素 */
  stopPropagation?: boolean;
  /** 作用域标识：仅当当前激活作用域匹配时才触发（默认："default"） */
  scope?: string;
}

/**
 * 按键绑定整体配置项（扩展处理器配置）
 */
export interface KeyBindingOptions extends KeyBindingHandlerOptions {
  /**
   * 监听的键盘事件类型（默认："keydown"，按下时触发）
   * 支持 "keydown"（按下）或 "keyup"（抬起）
   */
  event?: 'keydown' | 'keyup';
  /**
   * 是否使用事件捕获模式（默认：false）
   * 捕获模式下，事件会在冒泡阶段前触发，适用于需要优先处理的场景
   */
  capture?: boolean;
}

/**
 * 修饰键列表：用于改变按键绑定含义的特殊键
 * 注：忽略 "AltGraph" 键，因为它的功能已被其他修饰键覆盖（如 Windows 下的 Alt+Ctrl）
 */
let KEYBINDING_MODIFIER_KEYS = ['Shift', 'Meta', 'Alt', 'Control'];

/**
 * 按键序列默认超时时间：1000 毫秒（1秒）
 * 超过该时间未完成后续按键，序列会自动取消
 */
let DEFAULT_TIMEOUT = 1000;

/**
 * 默认监听的键盘事件类型：keydown（按键按下时触发）
 */
let DEFAULT_EVENT = 'keydown' as const;

/**
 * 平台检测逻辑
 * 参考：https://github.com/jamiebuilds/tinykeys/issues/184
 */
let PLATFORM = typeof navigator === 'object' ? navigator.platform : '';
let APPLE_DEVICE = /Mac|iPod|iPhone|iPad/.test(PLATFORM); // 是否为苹果设备（Mac/iOS）

/**
 * 平台特定修饰键别名：自动适配系统
 * - 苹果设备（Mac/iOS）：$mod 映射为 Meta 键（⌘ Command）
 * - 其他设备（Windows/Linux）：$mod 映射为 Control 键（Ctrl）
 */
let MOD = APPLE_DEVICE ? 'Meta' : 'Control';

/**
 * AltGraph 键的含义说明（来自 MDN）：
 * - Windows：同时按下 Alt 和 Ctrl，或直接按下 AltGr 键
 * - Mac：按下 ⌥ Option 键
 * - Linux：按下 Level 3 Shift 键（或 Level 5 Shift 键）
 * - Android：不支持
 * 参考：https://github.com/jamiebuilds/tinykeys/issues/185
 */
let ALT_GRAPH_ALIASES =
  PLATFORM === 'Win32' ? ['Control', 'Alt'] : APPLE_DEVICE ? ['Alt'] : [];

/**
 * 全局作用域状态：记录当前激活的作用域
 */
let activeScope: string = 'default';

/**
 * 设置当前激活的作用域（外部可调用，切换作用域）
 * @param scope 目标作用域标识（空字符串默认切换到 "default"）
 */
export function setKeybindingScope(scope: string = 'default') {
  activeScope = scope;
}

/**
 * 获取当前激活的作用域（外部可查询）
 * @returns 当前作用域标识
 */
export function getKeybindingScope(): string {
  return activeScope;
}

/**
 * 获取修饰键的按下状态（兼容 Chrome 浏览器 Bug）
 * Chrome 中 F1/F2 等功能键的 KeyboardEvent 可能缺少 getModifierState 方法
 * @param event 键盘事件对象
 * @param mod 要检测的修饰键（如 "Control"、"Shift"）
 * @returns 该修饰键是否处于按下状态
 */
function getModifierState(event: KeyboardEvent, mod: string) {
  return typeof event.getModifierState === 'function'
    ? event.getModifierState(mod) ||
        // 兼容 AltGraph 键：如果当前修饰键是 AltGraph 的别名，且 AltGraph 被按下
        (ALT_GRAPH_ALIASES.includes(mod) && event.getModifierState('AltGraph'))
    : false;
}

/**
 * 解析按键绑定字符串为结构化的按键序列
 *
 * 语法规则：
 * - 序列（sequence）：由多个单次按键（press）组成，用空格分隔（如 "y e e t"）
 * - 单次按键（press）：要么是单个键，要么是 "修饰键+普通键" 组合（如 "Ctrl+s"）
 * - 修饰键（mods）：多个修饰键用 "+" 连接（如 "Ctrl+Shift"）
 * - 按键（key）：可以是 KeyboardEvent.key（语义键名）或 KeyboardEvent.code（物理键位），不区分大小写
 * - 按键（key）：支持正则表达式，格式为 "(正则表达式)"（如 "(a|b)" 匹配 a 或 b 键）
 *
 * @param str 原始按键绑定字符串（如 "$mod+s"、"Shift+a"、"y e e t"）
 * @returns 结构化的按键序列数组（KeyBindingPress[]）
 */
export function parseKeybinding(str: string): KeyBindingPress[] {
  return str
    .trim() // 去除首尾空格
    .split(' ') // 按空格分割为多个单次按键（press）
    .map((press) => {
      let mods = press.split(/\b\+/); // 按 "+" 分割修饰键和普通键（\b 确保单词边界，避免误分割）
      let key: string | RegExp = mods.pop() as string; // 最后一个元素是普通键，其余是修饰键
      let match = key.match(/^\((.+)\)$/); // 检测是否为正则表达式格式（如 "(a|b)"）

      // 如果是正则表达式格式，解析为 RegExp 对象
      if (match) {
        key = new RegExp(`^${match[1]}$`); // 包裹 ^ 和 $，确保完全匹配
      }

      // 替换修饰键别名：将 $mod 替换为当前平台的默认修饰键（Meta/Control）
      mods = mods.map((mod) => (mod === '$mod' ? MOD : mod));

      return [mods, key] as KeyBindingPress;
    });
}

/**
 * 验证单个键盘事件是否匹配某个单次按键组合（KeyBindingPress）
 * @param event 键盘事件对象
 * @param press 单次按键组合（[修饰键数组, 按键名/正则]）
 * @returns 是否匹配
 */
export function matchKeyBindingPress(
  event: KeyboardEvent,
  [mods, key]: KeyBindingPress,
): boolean {
  // 1. 按键不匹配：
  // - 如果是正则表达式：不匹配 event.key 且不匹配 event.code
  // - 如果是字符串：不匹配 event.key（不区分大小写）且不匹配 event.code
  return !(
    (key instanceof RegExp
      ? !(key.test(event.key) || key.test(event.code))
      : key.toUpperCase() !== event.key.toUpperCase() && key !== event.code) ||
    // 2. 缺少必需的修饰键：按键组合中的修饰键未全部按下
    mods.find((mod) => !getModifierState(event, mod)) ||
    // 3. 存在多余的修饰键：
    // 按下了 KEYBINDING_MODIFIER_KEYS 中的修饰键，但该修饰键不在当前按键组合中
    // 且当前按键本身不是该修饰键（避免单独按修饰键时误判）
    KEYBINDING_MODIFIER_KEYS.find((mod) => {
      return !mods.includes(mod) && key !== mod && getModifierState(event, mod);
    })
  );
}

/**
 * 创建按键绑定事件处理器
 *
 * @example
 * ```js
 * import { createKeybindingsHandler } from "../src/keybindings"
 *
 * // 创建处理器
 * let handler = createKeybindingsHandler({
 *   "Shift+d": () => {
 *     alert("Shift 和 d 键同时按下")
 *   },
 *   "y e e t": {
 *     options: { preventDefault: true, scope: "game" },
 *     handler: () => alert("游戏中触发序列按键")
 *   },
 *   "$mod+d": {
 *     options: { stopPropagation: true },
 *     handler: () => alert("阻止冒泡的删除操作")
 *   },
 * })
 *
 * // 绑定到全局键盘事件
 * window.addEventListener("keydown", handler)
 * ```
 *
 * @param keyBindingMap 按键绑定映射表
 * @param options 处理器配置项（超时时间、默认作用域等）
 * @returns 键盘事件监听器函数
 */
export function createKeybindingsHandler(
  keyBindingMap: KeyBindingMap,
  options: KeyBindingHandlerOptions & { scope?: string } = {},
): EventListener {
  // const timeout = options.timeout ?? DEFAULT_TIMEOUT;
  // const scope = options.scope ?? 'default';
  const { timeout = DEFAULT_TIMEOUT, scope = 'default' } = options ?? {};
  // 预处理所有按键绑定：统一格式为 { sequence, options, handler }
  const keyBindings = Object.keys(keyBindingMap).map((key) => {
    const value = keyBindingMap[key];
    // console.log(
    //   '🚀 ~ createKeybindingsHandler ~ value:',
    //   value,
    //   parseKeybinding(key),
    // );

    const item = {
      sequence: parseKeybinding(key),

      handler: value,
    };

    return item;
  });

  const possibleMatches = new Map<KeyBindingPress[], KeyBindingPress[]>(); // 存储正在匹配中的序列
  let timer: number | null = null; // 序列超时计时器

  // 返回事件监听器函数
  return (event) => {
    // 过滤非键盘事件（如自动补全的导航事件，避免误触发）
    if (!(event instanceof KeyboardEvent)) {
      return;
    }

    // 遍历所有按键绑定，检查是否匹配
    keyBindings.forEach(({ sequence, handler }) => {
      if (scope !== activeScope) {
        return;
      }

      const prev = possibleMatches.get(sequence); // 之前正在匹配的进度（剩余未匹配的按键）

      const remainingExpectedPresses = prev ?? sequence; // 剩余需要匹配的按键序列

      const currentExpectedPress = remainingExpectedPresses[0]; // 当前需要匹配的单次按键

      // 检查当前键盘事件是否匹配当前需要的单次按键
      const matches = matchKeyBindingPress(event, currentExpectedPress);

      if (!matches) {
        // 不匹配：如果当前按下的不是修饰键，移除该序列的匹配进度（避免干扰后续匹配）
        // 修饰键的按下不应打断序列（如按 Ctrl 后没按 s，再按 Ctrl 仍可继续匹配）
        if (!getModifierState(event, event.key)) {
          possibleMatches.delete(sequence);
        }
      } else if (remainingExpectedPresses.length > 1) {
        // 匹配成功且还有后续按键：更新匹配进度（记录剩余未匹配的按键）
        possibleMatches.set(sequence, remainingExpectedPresses.slice(1));
      } else {
        // 匹配成功且是序列最后一个按键：执行回调，清空该序列的匹配进度
        possibleMatches.delete(sequence);

        if (options?.preventDefault) {
          event.preventDefault();
        }
        if (options?.stopPropagation) {
          event.stopPropagation();
        }

        handler(event);
      }
    });

    // 重置序列超时计时器：每次按键后重新计时，超时后清空所有未完成的匹配
    if (timer) {
      clearTimeout(timer);
    }
    // @ts-ignore
    timer = setTimeout(possibleMatches.clear.bind(possibleMatches), timeout);
  };
}

/**
 * 订阅按键绑定（简化版 API，直接绑定到目标元素/窗口）
 *
 * @example
 * ```js
 * import { tinykeys, setKeybindingScope } from "../src/keybindings"
 *
 * // 绑定全局按键
 * const unsubscribe = tinykeys(window, {
 *   "Shift+d": () => {
 *     alert("Shift 和 d 键同时按下")
 *   },
 *   "y e e t": {
 *     options: { preventDefault: true, scope: "game" },
 *     handler: () => alert("游戏中触发序列按键")
 *   },
 *   "$mod+s": {
 *     options: { preventDefault: true, stopPropagation: true },
 *     handler: () => alert("自定义保存，阻止浏览器默认保存")
 *   },
 *   "Escape": {
 *     options: { scope: "modal" },
 *     handler: () => alert("关闭弹窗（仅弹窗作用域生效）")
 *   }
 * }, {
 *   event: "keyup", // 改为抬起时触发
 *   timeout: 1500, // 超时时间改为 1.5 秒
 *   scope: "global" // 全局默认作用域
 * })
 *
 * // 切换作用域（打开弹窗时）
 * setKeybindingScope("modal");
 *
 * // 关闭弹窗后切换回全局作用域
 * setKeybindingScope("global");
 *
 * // 取消订阅（如需）
 * // unsubscribe()
 * ```
 *
 * @param target 绑定目标（窗口或 DOM 元素）
 * @param keyBindingMap 按键绑定映射表
 * @param options 按键绑定配置项
 * @returns 取消订阅的函数（调用后移除事件监听）
 */
export function tinykeys(
  target: Window | HTMLElement,
  keyBindingMap: KeyBindingMap,
  {
    event = DEFAULT_EVENT,
    capture,
    timeout,
    scope = 'default',
  }: KeyBindingOptions = {},
): () => void {
  const onKeyEvent = createKeybindingsHandler(keyBindingMap, {
    timeout,
    scope,
  }); // 创建处理器
  target.addEventListener(event, onKeyEvent, capture); // 绑定事件

  // 返回取消订阅函数：移除事件监听，避免内存泄漏
  return () => {
    target.removeEventListener(event, onKeyEvent, capture);
  };
}
