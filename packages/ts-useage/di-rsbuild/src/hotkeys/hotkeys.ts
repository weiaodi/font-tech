import {
  _mainKey,
  _modifier,
  _modifierMap,
  _mods,
  _specialKeyCode,
  type Shortcut,
} from './keyCode';

// 类型定义
export interface HotkeyHandler {
  keyup: boolean;
  keydown: boolean;
  scope: string;
  mods: number[];
  shortcut: string;
  method?: (event: KeyboardEvent, handler: HotkeyHandler) => void | boolean;
  key: string;
  splitKey: string;
  element: HTMLElement | Document;
  keys?: number[];
}

interface ElementEventRecord {
  // 明确监听器接收的是 Event 类型（而非 KeyboardEvent）
  keydownListener: (event: Event) => void;
  keyupListener: (event: Event) => void;
  capture: boolean;
}

interface WindowFocusRecord {
  listener: () => void;
  capture: boolean;
}

type UnbindParam =
  | undefined
  | {
      key: string;
      scope?: string;
      method?: HotkeyHandler['method'];
      splitKey?: string;
    };

export interface ShortcutItem {
  /** 快捷键组合字符串（如 'ctrl+s, alt+z, g i'） */
  shortcut: Shortcut;
  /** 快捷键触发时的回调函数 */
  onKeyUp?: HotkeyHandler['method'];
  onKeyDown?: HotkeyHandler['method'];
  /** 快捷键注册选项（可选） */
  options?: {
    /** 设置快捷键生效的作用域，用于区分不同场景下的快捷键触发范围 */
    scope?: string;
    /** 是否在事件捕获阶段（事件从顶层向下传播时）触发监听器，而非冒泡阶段，默认为 false */
    capture?: boolean;
    /** 长按是否连续触发，默认为 false */
    isLongPressTriggered?: boolean;
  };
}

export interface HotkeysOption {
  /** 设置快捷键生效的作用域，用于区分不同场景下的快捷键触发范围 */
  scope?: string;
  /** 指定快捷键事件绑定的 DOM 元素（或 Document），仅当事件在该元素内触发时才响应快捷键 */
  element?: HTMLElement | Document;
  /** 是否在按键松开（keyup 事件）时触发快捷键回调，默认为 false */
  keyup?: boolean;
  /** 是否在按键按下（keydown 事件）时触发快捷键回调，默认为 true */
  keydown?: boolean;
  /** 是否在事件捕获阶段（事件从顶层向下传播时）触发监听器，而非冒泡阶段，默认为 false */
  capture?: boolean;
  /** 用于分隔组合键的字符（如 "ctrl+s" 中的 "+"），默认值为 "+" */
  splitKey?: string;
  /** 是否仅允许绑定一个回调函数，设置为 true 时会自动解绑同一快捷键之前的回调，默认为 false */
  single?: boolean;
}

export class Hotkeys {
  private static mainKey: Record<string, number> = _mainKey;

  private static modifier: Record<string, number> = _modifier;

  private static modifierMap = _modifierMap;

  private downKeys: number[] = [];
  private scope: string = 'all';
  private mods: Record<number, boolean> = _mods;
  private handlers: Record<number | '*', HotkeyHandler[]> = {
    '*': [],
  };
  private elementEventMap = new Map<
    HTMLElement | Document,
    ElementEventRecord
  >();
  private winListendFocus: WindowFocusRecord | null = null;

  // 当前快捷键状态
  // isShortcutsPressedStatus = new Map<string, boolean>();
  // *====================start=========================
  // #region 对外暴露方法
  // *--------------------------------------------------
  /** 设置快捷键作用域 */
  setScope(scope: string): void {
    this.scope = scope || 'all';
  }

  /** 获取当前作用域 */
  getScope(): string {
    return this.scope;
  }

  /** 获取当前按下的键码列表 */
  getPressedKeyCodes(): number[] {
    return [...this.downKeys];
  }

  /** 获取当前按下的键名列表 */
  getPressedKeyString(): string[] {
    return this.downKeys.map((code) => {
      return (
        this.getKey(code) || this.getModifier(code) || String.fromCharCode(code)
      );
    });
  }

  /** 获取所有已注册的快捷键信息 */
  getAllKeyCodes(): Array<{
    scope: string;
    shortcut: string;
    mods: number[];
    keys: number[];
  }> {
    const result: Array<{
      scope: string;
      shortcut: string;
      mods: number[];
      keys: number[];
    }> = [];
    Object.entries(this.handlers).forEach(([, handlers]) => {
      handlers.forEach((handler) => {
        result.push({
          scope: handler.scope,
          shortcut: handler.shortcut,
          mods: handler.mods,
          keys: handler.key.split(handler.splitKey).map((v) => this.code(v)),
        });
      });
    });
    return result;
  }

  /** 检查键是否被按下 */
  isPressed(keyCode: string | number): boolean {
    const code = typeof keyCode === 'string' ? this.code(keyCode) : keyCode;
    return this.downKeys.includes(code);
  }

  /** 删除指定作用域的快捷键 */
  deleteScope(scope?: string, newScope?: string): void {
    const targetScope = scope || this.scope;

    Object.entries(this.handlers).forEach(([, handlers]) => {
      for (let i = 0; i < handlers.length; ) {
        if (handlers[i].scope === targetScope) {
          const [deleted] = handlers.splice(i, 1);
          this.removeKeyEvent(deleted.element);
        } else {
          i++;
        }
      }
    });

    // 如果要删除的作用域正好是当前的作用域则切换到新作用域，避免快捷键都失效
    if (this.scope === targetScope) {
      this.setScope(newScope || 'all');
    }
  }

  /** 解绑快捷键 */
  unbind(keysInfo?: UnbindParam): void {
    if (typeof keysInfo === 'undefined') {
      // 解绑所有
      Object.keys(this.handlers).forEach((keyStr) => {
        const isValidKey = keyStr === '*' || !Number.isNaN(Number(keyStr));
        if (!isValidKey) return;

        const handlerKey = keyStr === '*' ? '*' : (Number(keyStr) as number);
        this.handlers[handlerKey]?.forEach((info) => this.eachUnbind(info));
        delete this.handlers[handlerKey];
      });
      this.removeKeyEvent(document);
      return;
    }

    if (typeof keysInfo === 'object' && keysInfo.key) {
      // 对象形式解绑
      this.eachUnbind(keysInfo);
    }
  }

  /** 注册快捷键 */
  private register(
    key: string,
    option?: string | HotkeysOption | HotkeyHandler['method'],
    method?: HotkeyHandler['method'],
  ): void {
    this.downKeys = [];
    const keys = this.getKeys(key);
    let scope = 'all';
    let element: HTMLElement | Document = document;
    let keyup = false;
    let keydown = true;
    let capture = false;
    let splitKey = '+';
    let single = false;

    // 处理参数重载
    if (method === undefined && typeof option === 'function') {
      method = option as HotkeyHandler['method'];
      option = {};
    }

    // 解析配置项
    if (typeof option === 'object' && option !== null) {
      const opt = option as HotkeysOption;
      if (opt.scope) scope = opt.scope;
      if (opt.element) element = opt.element;
      if (opt.keyup !== undefined) keyup = opt.keyup;
      if (opt.keydown !== undefined) keydown = opt.keydown;
      if (opt.capture !== undefined) capture = opt.capture;
      if (opt.splitKey) splitKey = opt.splitKey;
      if (opt.single) single = opt.single;
    } else if (typeof option === 'string') {
      scope = option;
    }

    // 单一回调模式：先解绑旧的
    if (single) {
      this.unbind({ key, scope, splitKey });
    }

    // 注册每个快捷键
    keys.forEach((originKey) => {
      const keyParts = originKey.split(splitKey);
      const mods = keyParts.length > 1 ? this.getMods(keyParts) : [];
      const targetKey = keyParts[keyParts.length - 1];
      const keyCode = targetKey === '*' ? '*' : this.code(targetKey);

      if (!this.handlers[keyCode as unknown as number | '*']) {
        this.handlers[keyCode as unknown as number | '*'] = [];
      }

      this.handlers[keyCode as unknown as number | '*'].push({
        keyup,
        keydown,
        scope,
        mods,
        shortcut: originKey,
        method: method as HotkeyHandler['method'],
        key: originKey,
        splitKey,
        element,
      });
    });

    // 绑定事件监听
    this.bindElementEvents(element, capture);
  }

  registerShortCuts(shortcutItem: ShortcutItem) {
    const { shortcut, onKeyUp, onKeyDown, options } = shortcutItem;

    if (onKeyDown) {
      this.register(
        shortcut,
        { ...options, keyup: false, keydown: true },
        (event, handler) => {
          event.preventDefault();
          event.stopPropagation();
          onKeyDown(event, handler);
        },
      );
    }
    if (onKeyUp) {
      this.register(
        shortcut,
        { ...options, keyup: true, keydown: false },
        (event, handler) => {
          event.preventDefault();
          event.stopPropagation();
          onKeyUp(event, handler);
        },
      );
    }
  }
  /** 过滤函数 - 控制快捷键在哪些元素上生效 */
  filter(event: KeyboardEvent): boolean {
    const target =
      (event.target as HTMLElement | null) || (event as any).srcElement;
    if (!target) return true;

    const tagName = target.tagName;
    const isInput =
      tagName === 'INPUT'
      && ![
        'checkbox',
        'radio',
        'range',
        'button',
        'file',
        'reset',
        'submit',
        'color',
      ].includes((target as HTMLInputElement).type);

    return !(
      target.isContentEditable
      || ((isInput || tagName === 'TEXTAREA' || tagName === 'SELECT')
        && !(target as HTMLInputElement).readOnly)
    );
  }

  // *--------------------------------------------------
  // #endregion
  // *=====================end==========================

  // *====================start=========================
  // #region 私有方法
  // *--------------------------------------------------
  /** 键名转键码 */
  private code(x: string): number {
    const lowerX = x.toLowerCase();
    return (
      Hotkeys.mainKey[lowerX]
      || Hotkeys.modifier[lowerX]
      || x.toUpperCase().charCodeAt(0)
    );
  }

  /** 键码转键名 */
  private getKey(x: number): string | undefined {
    return Object.keys(Hotkeys.mainKey).find((k) => Hotkeys.mainKey[k] === x);
  }

  /** 键码转修饰键名 */
  private getModifier(x: number): string | undefined {
    return Object.keys(Hotkeys.modifier).find((k) => Hotkeys.modifier[k] === x);
  }

  /**
   * 'ctrl+s,ctrl+,' -> ['ctrl+s', 'ctrl+,']
   * 解析快捷键字符串为数组 */
  private getKeys(key: string): string[] {
    const cleaned = key.replace(/\s/g, '');
    const keys = cleaned.split(',');

    // 如果注册含有 , 的快捷键组合，通过判断空字符串来正确拆分快捷键组合
    let index = keys.lastIndexOf('');
    while (index >= 0) {
      keys[index - 1] += ',';
      keys.splice(index, 1);
      index = keys.lastIndexOf('');
    }
    return keys;
  }

  /** 提取修饰键 */
  private getMods(keys: string[]): number[] {
    const mods = keys.slice(0, keys.length - 1);
    return mods.map((m) => Hotkeys.modifier[m.toLowerCase()]);
  }

  /** 比较修饰键数组 */
  private compareArray(a1: number[], a2: number[]): boolean {
    const [arr1, arr2] = a1.length >= a2.length ? [a1, a2] : [a2, a1];
    return arr1.every((key) => arr2.includes(key));
  }

  /** 单个解绑处理 */
  private eachUnbind(params: {
    key: string;
    scope?: string;
    method?: HotkeyHandler['method'];
    splitKey?: string;
  }): void {
    const { key, scope = this.scope, method, splitKey = '+' } = params;
    const multipleKeys = this.getKeys(key);

    multipleKeys.forEach((originKey) => {
      const keyParts = originKey.split(splitKey);
      const lastKey = keyParts[keyParts.length - 1];
      const keyCode = lastKey === '*' ? '*' : this.code(lastKey);
      const handlers = this.handlers[keyCode as unknown as number | '*'];

      if (!handlers) return;

      const mods = keyParts.length > 1 ? this.getMods(keyParts) : [];
      const unbindElements: (HTMLElement | Document)[] = [];

      this.handlers[keyCode as unknown as number | '*'] = handlers.filter(
        (handler) => {
          const isMatch =
            (!method || handler.method === method)
            && handler.scope === scope
            && this.compareArray(handler.mods, mods);

          if (isMatch) unbindElements.push(handler.element);
          return !isMatch;
        },
      );

      unbindElements.forEach((el) => this.removeKeyEvent(el));
    });
  }

  /** 绑定元素事件 */
  private bindElementEvents(
    element: HTMLElement | Document,
    capture: boolean,
  ): void {
    if (this.elementEventMap.has(element)) return;

    const keydownListener = (event: Event) =>
      this.dispatch(event as KeyboardEvent, element);
    const keyupListener = (event: Event) => {
      this.dispatch(event as KeyboardEvent, element);
      // 键盘抬起的时候有清除修饰键的操作
      this.clearModifier(event as KeyboardEvent);
    };

    this.elementEventMap.set(element, {
      keydownListener,
      keyupListener,
      capture,
    });
    this.addEvent(element, 'keydown', keydownListener, capture);
    this.addEvent(element, 'keyup', keyupListener, capture);

    // 窗口焦点事件监听器
    if (!this.winListendFocus) {
      const listener = () => (this.downKeys = []);
      this.winListendFocus = { listener, capture };
      this.addEvent(window, 'focus', listener, capture);
    }
  }

  /** 事件分发器 */
  private dispatch(
    event: KeyboardEvent,
    element: HTMLElement | Document,
  ): void {
    if (!this.filter(event)) return;

    let key = event.keyCode || event.which || event.charCode;
    if (event.key?.toLowerCase() === 'capslock') return;

    // 统一Meta键码
    if (
      key === _specialKeyCode.RightMeta
      || key === _specialKeyCode.MetaCompat
    ) {
      key = _specialKeyCode.LeftMeta;
    }

    if (
      !this.downKeys.includes(key)
      && key !== _specialKeyCode.ImeComposition
    ) {
      this.downKeys.push(key);
    }

    // 同步修饰键状态
    (['metaKey', 'ctrlKey', 'altKey', 'shiftKey'] as const).forEach(
      (keyName) => {
        const keyNum = Hotkeys.modifierMap[keyName];
        if (event[keyName] && !this.downKeys.includes(keyNum)) {
          this.downKeys.push(keyNum);
        } else if (!event[keyName] && this.downKeys.includes(keyNum)) {
          this.downKeys = this.downKeys.filter((k) => k !== keyNum);
        } else if (keyName === 'metaKey' && event[keyName]) {
          this.downKeys = this.downKeys.filter(
            (k) => k in Hotkeys.modifierMap || k === key,
          );
        }
      },
    );

    // 更新修饰键状态
    if (key in this.mods) {
      this.mods[key] = true;
      Object.entries(Hotkeys.modifier).forEach(([name, code]) => {
        const eventKey = Hotkeys.modifierMap[code] as keyof KeyboardEvent;
        (this as any)[name] = event[eventKey];
      });
    }

    // 同步修饰键状态
    Object.keys(this.mods).forEach((keyStr) => {
      const keyNum = Number(keyStr);
      // 明确 eventKey 是修饰键属性名
      const eventKey = Hotkeys.modifierMap[keyNum] as
        | 'shiftKey'
        | 'ctrlKey'
        | 'altKey'
        | 'metaKey';
      // 确保获取到的是 boolean 类型
      this.mods[keyNum] = Boolean(event[eventKey]);
    });

    // 处理AltGraph
    if (
      event.getModifierState
      && !(event.altKey && !event.ctrlKey)
      && event.getModifierState('AltGraph')
    ) {
      if (!this.downKeys.includes(Hotkeys.modifierMap.ctrlKey))
        this.downKeys.push(Hotkeys.modifierMap.ctrlKey);
      if (!this.downKeys.includes(Hotkeys.modifierMap.altKey))
        this.downKeys.push(Hotkeys.modifierMap.altKey);
      this.mods[Hotkeys.modifierMap.ctrlKey] = true;
      this.mods[Hotkeys.modifierMap.altKey] = true;
    }

    // 处理全局快捷键(*)
    const currentScope = this.scope;
    (this.handlers['*'] || []).forEach((handler) => {
      if (
        handler.scope === currentScope
        && ((event.type === 'keydown' && handler.keydown)
          || (event.type === 'keyup' && handler.keyup))
      ) {
        this.eventHandler(event, handler, currentScope, element);
      }
    });

    // 处理指定键快捷键
    if (!this.handlers[key]) return;
    this.handlers[key].forEach((handler) => {
      if (
        ((event.type === 'keydown' && handler.keydown)
          || (event.type === 'keyup' && handler.keyup))
        && handler.key
      ) {
        const targetCodes = handler.key
          .split(handler.splitKey)
          .map((v) => this.code(v));
        const currentCodes = [...this.downKeys].sort();
        // 抬起修饰键的时候会清除修饰键，因此需要考虑单独修饰键抬起的情况
        let isModifierUp = false;
        if (targetCodes.length === 1 && currentCodes.length === 0) {
          isModifierUp = !!this.getModifier(targetCodes[0]);
        }

        if (
          targetCodes.sort().join('') === currentCodes.join('')
          || isModifierUp
        ) {
          this.eventHandler(event, handler, currentScope, element);
        }
      }
    });
  }

  /** 事件处理器 */
  private eventHandler(
    event: KeyboardEvent,
    handler: HotkeyHandler,
    scope: string,
    element: HTMLElement | Document,
  ): void {
    if (handler.element !== element) return;

    if (handler.scope !== scope && handler.scope !== 'all') return;

    let modifiersMatch = handler.mods.length > 0;
    Object.keys(this.mods).forEach((keyStr) => {
      const key = Number(keyStr);
      if (
        (!this.mods[key] && handler.mods.includes(key))
        || (this.mods[key] && !handler.mods.includes(key))
      ) {
        modifiersMatch = false;
      }
    });

    const notModifier =
      !this.mods[Hotkeys.modifierMap.altKey]
      && !this.mods[Hotkeys.modifierMap.ctrlKey]
      && !this.mods[Hotkeys.modifierMap.metaKey]
      && !this.mods[Hotkeys.modifierMap.shiftKey];

    if (
      (handler.mods.length === 0 && notModifier)
      || modifiersMatch
      || (this.downKeys.length === 1 && !notModifier)
      || handler.shortcut === '*'
    ) {
      handler.keys = [...this.downKeys];

      const result = handler.method?.(event, handler);
      if (result === false) {
        event.preventDefault();
        event.stopPropagation();
      }
    }
  }

  /** 清除修饰键状态 */
  private clearModifier(event: KeyboardEvent): void {
    //

    let key = event.keyCode || event.which || event.charCode;
    if (event.key?.toLowerCase() === 'capslock') {
      key = this.code(event.key);
    }

    this.downKeys = this.downKeys.filter((k) => k !== key);

    if (event.key?.toLowerCase() === 'meta') {
      this.downKeys = [];
    }

    if (
      key === _specialKeyCode.RightMeta
      || key === _specialKeyCode.MetaCompat
    ) {
      key = _specialKeyCode.LeftMeta;
    }

    if (key in this.mods) {
      this.mods[key] = false;
      Object.entries(Hotkeys.modifier).forEach(([name, code]) => {
        if (code === key) (this as any)[name] = false;
      });
    }
  }

  /** 移除元素事件监听 */
  private removeKeyEvent(element: HTMLElement | Document): void {
    const hasHandler = Object.values(this.handlers)
      .flat()
      .some((h) => h.element === element);
    if (!hasHandler) {
      const record = this.elementEventMap.get(element);
      if (record) {
        this.removeEvent(
          element,
          'keydown',
          record.keydownListener,
          record.capture,
        );
        this.removeEvent(
          element,
          'keyup',
          record.keyupListener,
          record.capture,
        );
        this.elementEventMap.delete(element);
      }
    }

    const totalHandlers = Object.values(this.handlers).flat().length;
    if (totalHandlers === 0 || this.elementEventMap.size === 0) {
      this.elementEventMap.forEach((record, el) => {
        this.removeEvent(el, 'keydown', record.keydownListener, record.capture);
        this.removeEvent(el, 'keyup', record.keyupListener, record.capture);
      });
      this.elementEventMap.clear();
      Object.keys(this.handlers).forEach(
        (key) => delete this.handlers[key as unknown as number | '*'],
      );

      if (this.winListendFocus) {
        this.removeEvent(
          window,
          'focus',
          this.winListendFocus.listener,
          this.winListendFocus.capture,
        );
        this.winListendFocus = null;
      }
    }
  }

  /** 跨浏览器添加事件 */
  private addEvent(
    target: HTMLElement | Window | Document,
    event: string,
    handler: EventListenerOrEventListenerObject,
    capture?: boolean,
  ): void {
    if (target.addEventListener) {
      target.addEventListener(event, handler, capture);
    } else if ((target as any).attachEvent) {
      (target as any).attachEvent(`on${event}`, handler);
    }
  }

  /** 跨浏览器移除事件 */
  private removeEvent(
    target: HTMLElement | Window | Document,
    event: string,
    handler: (event: Event) => void, // 明确使用 Event 类型
    capture?: boolean,
  ): void {
    if (target.removeEventListener) {
      target.removeEventListener(event, handler, capture);
    } else if ((target as any).detachEvent) {
      (target as any).detachEvent(`on${event}`, handler);
    }
  }
  // *--------------------------------------------------
  // #endregion
  // *=====================end==========================
}
