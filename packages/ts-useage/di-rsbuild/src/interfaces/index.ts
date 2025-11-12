import type { KeyBindingOptions } from '../tinykeys/tinykeys';

export type HotkeyScope = string | symbol;
export type HotkeyCombination = string;

export interface HotkeyOptions {
  /** 热键作用域 */
  scope?: HotkeyScope;
  /** 是否阻止默认行为 */
  preventDefault?: boolean;
  /** 是否阻止事件冒泡 */
  stopPropagation?: boolean;
  /** 描述信息 */
  description?: string;
}

/** 依赖注入令牌 */
export type InjectionToken<T = unknown> =
  | string
  | symbol
  | Function
  | (new (...args: any[]) => T);

/** 注入元数据 */
export interface InjectMetadata {
  token: InjectionToken;
  propertyKey?: string | symbol;
  parameterIndex?: number;
}

/** 热键元数据 */
export interface HotkeyMetadata {
  combination: HotkeyCombination;
  group: string;
  description: string;
  options: KeyBindingOptions;
  methodKey: string;
}

export const METADATA_KEY = {
  INJECT: Symbol('inject'),
  HOTKEY: Symbol('hotkey'),
  PROVIDER: Symbol('provider'),
  INJECTABLE: Symbol('injectable'),
};
