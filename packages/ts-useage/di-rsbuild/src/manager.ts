import { Container } from './container';
import { setKeybindingScope, tinykeys } from './tinykeys/tinykeys';
import { METADATA_KEY, type HotkeyMetadata } from './interfaces';

export class HotkeyManager {
  private static hotKeyMap = new Map<string, () => void>();
  /**
   * 注册指定类的热键
   * @param target 类构造函数
   */
  static registerHotkeys<T>(target: new (...args: any[]) => T): void {
    const instance = Container.getInstance().get(target);

    const hotkeysMetadata =
      (Reflect.getMetadata(METADATA_KEY.HOTKEY, target) as HotkeyMetadata[]) ||
      [];

    hotkeysMetadata.forEach(({ combination, options, methodKey }) => {
      if (HotkeyManager.hotKeyMap.has(combination + options.currentScope)) {
        throw new Error(
          ` 快捷键重复注册 ${options.currentScope} : ${combination}`,
        );
      }

      const handler = (instance as any)[methodKey].bind(instance) as (
        event: KeyboardEvent,
      ) => void;

      const removeFn = tinykeys(window, { [combination]: handler }, options);
      // 将当前快捷键组合和作用域作为键来避免 相同作用域下出现相同快捷键
      HotkeyManager.hotKeyMap.set(combination + options.currentScope, removeFn);
    });
  }

  /**
   * 注销指定类的热键
   * @param target 类构造函数
   */
  static unregisterHotkeys<T>(target: new (...args: any[]) => T): void {
    const hotkeysMetadata =
      (Reflect.getMetadata(METADATA_KEY.HOTKEY, target) as HotkeyMetadata[]) ||
      [];

    hotkeysMetadata.forEach(({ combination, options }) => {
      const removeFn = HotkeyManager.hotKeyMap.get(
        combination + options.currentScope,
      );
      removeFn?.();
    });
  }

  /**
   * 切换热键作用域
   * @param scope 目标作用域
   */
  static setScope(scope: string = 'global'): void {
    setKeybindingScope(scope);
  }
}
