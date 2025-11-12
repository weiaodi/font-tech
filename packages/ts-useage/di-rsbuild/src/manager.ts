import { Container } from './container';
import { tinykeys } from './tinykeys/tinykeys';
import { METADATA_KEY, type HotkeyMetadata } from './interfaces';

export class HotkeyManager {
  // private static initialized = false;

  // /**
  //  * 初始化热键系统
  //  * 自动注册所有带有 @Hotkey 装饰器的类
  //  */
  // static init(): void {
  //   if (this.initialized) return;

  //   this.initialized = true;
  // }

  /**
   * 注册指定类的热键
   * @param target 类构造函数
   */
  static registerHotkeys<T>(target: new (...args: any[]) => T): void {
    const instance = Container.getInstance().get(target);
    const hotkeysMetadata =
      (Reflect.getMetadata(METADATA_KEY.HOTKEY, target) as HotkeyMetadata[]) ||
      [];

    hotkeysMetadata.forEach(({ combinations, options, methodKey }) => {
      const handler = (instance as any)[methodKey].bind(instance) as (
        event: KeyboardEvent,
      ) => void;

      tinykeys(window, { [combinations]: handler }, options);
    });
  }

  // /**
  //  * 注销指定类的热键
  //  * @param target 类构造函数
  //  */
  // static unregisterHotkeys<T>(target: new (...args: any[]) => T): void {
  //   const hotkeysMetadata =
  //     (Reflect.getMetadata(METADATA_KEY.HOTKEY, target) as HotkeyMetadata[]) ||
  //     [];

  //   hotkeysMetadata.forEach(({ combinations, options }) => {
  //     const scope = options.scope || 'global';
  //     // {
  //     //       key: string;
  //     //       scope?: string;
  //     //       method?: HotkeyHandler['method'];
  //     //       splitKey?: string;
  //     //     }
  //     // HotkeyManager.hotkeys.unbind(combinations,  );
  //   });
  // }

  // /**
  //  * 切换热键作用域
  //  * @param scope 目标作用域
  //  */
  // static setScope(scope: HotkeyScope): void {
  //   HotkeyManager.hotkeys.setScope(scope.toString());
  // }

  // /**
  //  * 禁用所有热键
  //  */
  // static disableAll(): void {
  //   HotkeyManager.hotkeys.disable();
  // }

  // /**
  //  * 启用所有热键
  //  */
  // static enableAll(): void {
  //   hotkeys.enable();
  // }

  // /**
  //  * 获取所有注册的热键信息
  //  */
  // static getHotkeyInfo(): Array<{
  //   combinations: HotkeyCombination;
  //   scope: HotkeyScope;
  //   description?: string;
  //   group?: string;
  // }> {
  //   const result: Array<{
  //     combinations: HotkeyCombination;
  //     scope: HotkeyScope;
  //     description?: string;
  //     group?: string;
  //   }> = [];

  //   // 遍历所有类的热键元数据
  //   const allMetadata = Reflect.getMetadataKeys(Reflect)
  //     .map((key) => Reflect.getMetadata(key, Reflect))
  //     .filter(
  //       (metadata) =>
  //         Array.isArray(metadata) &&
  //         metadata.length > 0 &&
  //         'combinations' in metadata[0],
  //     );

  //   (allMetadata as HotkeyMetadata[][]).forEach((metadataList) => {
  //     metadataList.forEach((metadata) => {
  //       result.push({
  //         combinations: metadata.combinations,
  //         scope: metadata.options.scope || 'global',
  //         description: metadata.options.description,
  //         group: metadata.options.group,
  //       });
  //     });
  //   });

  //   return result;
  // }
}
