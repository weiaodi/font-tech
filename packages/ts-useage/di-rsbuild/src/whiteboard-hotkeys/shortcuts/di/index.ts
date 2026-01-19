import type { Plugin } from '@docs-whiteboard/shared/types/whiteboard';

import { setKeybindingScope, tinykeys } from './core';
import { METADATA_KEY, type HotkeyMetadata } from './tokens';
export type ClassConstructor<T = unknown> = new (...args: any[]) => T;

class HotkeyManager {
  private hotKeyMap = new Map<string, () => void>();
  private pulginInstances: Plugin[];
  constructor(pulginInstances: Plugin[]) {
    this.pulginInstances = pulginInstances;
  }

  /**
   * 注册指定类的热键
   * 从插件系统中获取插件实例。
   * @param target 类构造函数
   */
  registerHotkey<T>(target: ClassConstructor<T>): void {
    for (const instance of this.pulginInstances) {
      if (instance.constructor === target) {
        const hotkeysMetadata =
          (Reflect.getMetadata(METADATA_KEY.HOTKEY, target) as HotkeyMetadata[]) || [];

        hotkeysMetadata.forEach(({ combination, options, methodKey }) => {
          if (this.hotKeyMap.has(options.currentScope + combination + options.event)) {
            throw new Error(` 快捷键重复注册 ${options.currentScope} : ${combination}`);
          }
          // 让快捷键函数执行的this为他所属类的实例
          const handler = (instance as any)[methodKey].bind(instance);

          const removeFn = tinykeys(window, { [combination]: handler }, options);
          // 将当前快捷键组合和作用域作为键来避免 相同作用域下出现相同快捷键
          this.hotKeyMap.set(options.currentScope + combination + options.event, removeFn);
        });
        // 找到当前插件后，执行完注册执行返回
        return;
      }
    }
    throw new Error(`当前注册类${target} 未在插件系统中`);
  }

  /**
   * 注销指定类的热键
   * @param target 类构造函数
   */
  unregisterHotkeys<T>(target: ClassConstructor<T>): void {
    const hotkeysMetadata =
      (Reflect.getMetadata(METADATA_KEY.HOTKEY, target) as HotkeyMetadata[]) || [];

    hotkeysMetadata.forEach(({ combination, options }) => {
      const removeFn = this.hotKeyMap.get(options.currentScope + combination + options.event);
      removeFn?.();
    });
  }

  /**
   * 切换热键作用域
   * @param scope 目标作用域
   */
  setScope(scope: string): void {
    setKeybindingScope(scope);
  }
}

export * from './decorators';
export { HotkeyManager };
