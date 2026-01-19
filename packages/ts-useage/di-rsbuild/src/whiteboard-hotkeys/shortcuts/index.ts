import type { Plugin, Context } from '@docs-whiteboard/shared/types/whiteboard';
import { HotkeyManager, type ClassConstructor } from './di';

export class Shortcuts implements Plugin {
  id = 'hotkeys';
  name = '快捷键';
  version = '1.0.0';
  description = '快捷键插件';
  author = 'docs-whiteboard';

  private hotkeyManager: HotkeyManager | null = null;
  private hotkeyHandlerList: ClassConstructor[] = [];

  /**
   * @description 快捷键插件基于依赖注入系统实现，但其依赖注入系统的实例，以及实例对应的构造函数均通过 context.pluginManager.getAllPlugin 插件系统获取。因此快捷键依赖注入和装饰器的生效范围为所有已安装的插件。
   */
  onInstall(context: Context) {
    this.hotkeyManager = new HotkeyManager(context.pluginManager.getAllPlugins());

    this.hotkeyHandlerList = context.pluginManager
      .getAllPlugins()
      .map(plugin => plugin.constructor as ClassConstructor);

    this.registerHotkeys();
  }

  private registerHotkeys() {
    this.hotkeyHandlerList.forEach(handler => {
      this.hotkeyManager?.registerHotkey(handler);
    });
  }

  private unRegisterHotkeys() {
    this.hotkeyHandlerList.forEach(handler => {
      this.hotkeyManager?.unregisterHotkeys(handler);
    });
  }

  setHotkeyScope(scope: string) {
    this.hotkeyManager?.setScope(scope);
  }

  onDestroy() {
    this.unRegisterHotkeys();
    this.hotkeyManager = null;
  }

  getCommands() {
    return {
      setHotkeyScope: (scope: string = 'global') => this.setHotkeyScope(scope)
    };
  }
}
