import type { KeyBindingOptions } from '../core';

export type HotkeyScope = string | symbol;
/**
 *语法规则：
 * - 单次按键（press）：要么是单个键，要么是 "修饰键+普通键" 组合（如 "Ctrl+s"）
 * - 序列（sequence）：由多个单次按键（press）组成，用空格分隔（如 "y e e t"）
 * - 修饰键（mods）：多个修饰键用 "+" 连接（如 "Ctrl+Shift"）, $mod会替换为当前平台的默认修饰键（Meta/Control）
 * - 按键（key）：可以是 KeyboardEvent.key（语义键名）或 KeyboardEvent.code（物理键位），不区分大小写，支持正则表达式，格式为 "(正则表达式)"（如 "(a|b)" 匹配 a 或 b 键）
 * - 举例：（如 "$mod+s"、"a"、"Shift+a Shift+c"）
 */
export type HotkeyCombination = string;

/** 依赖注入令牌 */
export type InjectionToken<T = unknown> = string | symbol | (new (...args: any[]) => T);

/** 注入元数据 */
export interface InjectMetadata {
  token: InjectionToken;
  propertyKey?: string | symbol;
  parameterIndex?: number;
}

/** 热键元数据 */
export interface HotkeyMetadata {
  combination: HotkeyCombination;
  options: KeyBindingOptions;
  methodKey: string;
}

export const METADATA_KEY = {
  INJECT: Symbol('inject'),
  HOTKEY: Symbol('hotkey'),
  PROVIDER: Symbol('provider'),
  INJECTABLE: Symbol('injectable')
};
