/* eslint-disable @typescript-eslint/no-magic-numbers */

const isff =
  typeof navigator !== 'undefined'
    ? navigator.userAgent.toLowerCase().indexOf('firefox') > 0
    : false;

const _mainKey = {
  backspace: 8,
  '⌫': 8,
  tab: 9,
  clear: 12,
  enter: 13,
  '↩': 13,
  return: 13,
  esc: 27,
  escape: 27,
  space: 32,
  left: 37,
  up: 38,
  right: 39,
  down: 40,
  arrowup: 38,
  arrowdown: 40,
  arrowleft: 37,
  arrowright: 39,
  del: 46,
  delete: 46,
  ins: 45,
  insert: 45,
  home: 36,
  end: 35,
  pageup: 33,
  pagedown: 34,
  capslock: 20,
  // 主键盘区的键盘和键码值采用 0-9
  // 小键盘区键码值
  num_0: 96,
  num_1: 97,
  num_2: 98,
  num_3: 99,
  num_4: 100,
  num_5: 101,
  num_6: 102,
  num_7: 103,
  num_8: 104,
  num_9: 105,
  num_multiply: 106,
  num_add: 107,
  num_enter: 108,
  num_subtract: 109,
  num_decimal: 110,
  num_divide: 111,
  f1: 112,
  f2: 113,
  f3: 114,
  f4: 115,
  f5: 116,
  f6: 117,
  f7: 118,
  f8: 119,
  f9: 120,
  f10: 121,
  f11: 122,
  f12: 123,
  '⇪': 20,
  ',': 188,
  '.': 190,
  '/': 191,
  '`': 192,
  '-': isff ? 173 : 189,
  '=': isff ? 61 : 187,
  ';': isff ? 59 : 186,
  "'": 222,
  '{': 219,
  '}': 221,
  '[': 219,
  ']': 221,
  '\\': 220,
};

// 修饰键映射
const _modifier = {
  // shiftKey
  '⇧': 16,
  shift: 16,
  // altKey
  '⌥': 18,
  alt: 18,
  option: 18,
  // ctrlKey
  '⌃': 17,
  ctrl: 17,
  control: 17,
  // metaKey
  '⌘': 91,
  cmd: 91,
  meta: 91,
  command: 91,
};

// 修饰键名称与码值双向映射
enum _modifierMap {
  shiftKey = 16,
  ctrlKey = 17,
  altKey = 18,
  metaKey = 91,
}

/**
 * 特殊键码枚举，包含需要特殊处理的键盘事件键值
 * 这些键码通常与系统级按键、浏览器兼容或输入法状态相关，需单独逻辑处理
 */
const enum _specialKeyCode {
  /**
   * 左侧Meta键（Windows系统的Windows键 / macOS的Command键）
   * 常用于触发系统级快捷操作，如Win+D显示桌面、Cmd+C复制等
   */
  LeftMeta = 91,
  /**
   * 右侧Meta键（键盘右侧的Windows/Command键）
   * 功能与左侧Meta键一致，部分键盘布局会单独设计右侧键位
   */
  RightMeta = 93,
  /**
   * Meta键的浏览器兼容码
   * 部分老浏览器（如早期IE）会将Meta键识别为224，需统一映射为标准Meta键码处理
   */
  MetaCompat = 224,
  /**
   * 输入法组合输入状态键码
   * 当用户使用输入法（如拼音、日文假名）输入时，在选择候选字的中间状态，
   * 浏览器会返回此键码，标识当前输入由输入法处理，非直接物理按键
   */
  ImeComposition = 229,
}

// 修饰键状态记录
const _mods: Record<number, boolean> = {
  16: false,
  18: false,
  17: false,
  91: false,
};

type Modifier = keyof typeof _modifier;
type MainKey = keyof typeof _mainKey;

/** 主键键名 */
const mainKeyName = Object.fromEntries(
  Object.keys(_mainKey).map((key) => [key, key]),
) as {
  [K in MainKey]: K;
};

/** 修饰键键名 */
const modifierName = Object.fromEntries(
  Object.keys(_modifier).map((key) => [key, key]),
) as {
  [K in Modifier]: K;
};

type SingleShortcut =
  | Modifier
  | MainKey
  | `${Modifier}+${MainKey}`
  | `${Modifier}+${Modifier}+${MainKey}`
  | `${Modifier}+${string}`
  | `${Modifier}+${Modifier}+${string}`
  | `${string},${string}`; //  , 用于注册多项快捷键

type Shortcut = SingleShortcut;

export {
  _mainKey,
  _modifier,
  _modifierMap,
  _mods,
  _specialKeyCode,
  modifierName,
  mainKeyName,
};

export type { Shortcut };
