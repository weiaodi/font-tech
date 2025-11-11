// import hotkeys, { HotkeysEvent, KeyHandler } from 'hotkeys-js';

// // ========================== 核心类型定义 ==========================
// export type HotkeyScope = string | symbol;
// export type HotkeyCombination = string | string[];

// export interface HotkeyOptions {
//   /** 热键作用域 */
//   scope?: HotkeyScope;
//   /** 是否阻止默认行为 */
//   preventDefault?: boolean;
//   /** 是否阻止事件冒泡 */
//   stopPropagation?: boolean;
//   /** 描述信息 */
//   description?: string;
//   /** 分组信息 */
//   group?: string;
// }

// /** 依赖注入令牌 */
// export type InjectionToken<T = unknown> =
//   | string
//   | symbol
//   | (new (...args: any[]) => T);

// /** 注入元数据 */
// interface InjectMetadata {
//   token: InjectionToken;
//   propertyKey?: string;
// }

// /** 热键元数据 */
// interface HotkeyMetadata {
//   combinations: HotkeyCombination;
//   options: HotkeyOptions;
//   methodKey: string;
// }

// // ========================== 元数据存储 ==========================
// const METADATA_KEY = {
//   INJECT: Symbol('inject'),
//   HOTKEY: Symbol('hotkey'),
//   PROVIDER: Symbol('provider'),
//   INJECTABLE: Symbol('injectable'), // 新增：标记可注入
// };

// // ========================== 依赖注入容器 ==========================
// class Container {
//   private providers = new Map<InjectionToken, any>();
//   private instances = new Map<InjectionToken, any>();

//   /**
//    * 注册提供者
//    * @param token 注入令牌
//    * @param provider 提供者（类或工厂函数）
//    */
//   provide<T>(
//     token: InjectionToken<T>,
//     provider: new (...args: any[]) => T | ((container: Container) => T),
//   ): void {
//     this.providers.set(token, provider);
//   }

//   /**
//    * 获取实例
//    * @param token 注入令牌
//    */
//   get<T>(token: InjectionToken<T>): T {
//     // 从缓存获取实例
//     if (this.instances.has(token)) {
//       return this.instances.get(token);
//     }

//     // 1. 先获取提供者（创建实例的规则）
//     const provider = this.providers.get(token);
//     if (!provider) {
//       throw new Error(
//         `No provider found for token: ${String(token)}（未注册为可注入服务）`,
//       );
//     }

//     // 2. 校验：如果提供者是类，必须被 @Injectable() 标记
//     if (
//       typeof provider === 'function' &&
//       provider.prototype?.constructor === provider
//     ) {
//       const isInjectable = Reflect.getMetadata(
//         METADATA_KEY.INJECTABLE,
//         provider,
//       );
//       if (!isInjectable) {
//         throw new Error(
//           `Class ${provider.name} is not marked as @Injectable()（未标记为可注入服务）`,
//         );
//       }
//     }

//     let instance: T;
//     if (
//       typeof provider === 'function' &&
//       provider.prototype?.constructor === provider
//     ) {
//       // 类提供者：解析构造函数依赖
//       const dependencies =
//         (Reflect.getMetadata(
//           METADATA_KEY.INJECT,
//           provider,
//         ) as InjectMetadata[]) || [];
//       const injectArgs = dependencies
//         .sort((a, b) => (a.propertyKey ? 1 : -1)) // 先处理构造函数注入
//         .map((dep) => this.get(dep.token));

//       instance = new (provider as new (...args: any[]) => T)(...injectArgs);

//       // 处理属性注入
//       const propertyInjections = dependencies.filter((dep) => dep.propertyKey);
//       propertyInjections.forEach(({ token, propertyKey }) => {
//         (instance as any)[propertyKey!] = this.get(token);
//       });
//     } else if (typeof provider === 'function') {
//       // 工厂函数提供者
//       instance = (provider as (container: Container) => T)(this);
//     } else {
//       throw new Error(`Invalid provider type for token: ${String(token)}`);
//     }

//     this.instances.set(token, provider);
//     return instance;
//   }

//   /**
//    * 重置容器（测试用）
//    */
//   reset(): void {
//     this.providers.clear();
//     this.instances.clear();
//   }
// }

// // 全局容器实例
// export const container = new Container();

// // ========================== 装饰器实现 ==========================

// /**
//  * 显式标记类为“可注入服务”
//  * 可选配置：提供自定义注入令牌（默认用类本身作为令牌）
//  */
// export function Injectable(
//   options: { token?: InjectionToken } = {},
// ): ClassDecorator {
//   return function (target: new (...args: any[]) => any) {
//     // 标记该类为可注入服务（存储元数据）
//     Reflect.defineMetadata(METADATA_KEY.INJECTABLE, true, target);

//     // 可选：如果配置了自定义令牌，自动注册到容器（简化注册步骤）
//     const token = options.token || target;
//     container.provide(token, target); // 自动注册，无需手动调用 container.provide()
//   };
// }

// /**
//  * 注入装饰器（支持构造函数和属性注入）
//  * @param token 注入令牌
//  */
// export function Inject<T>(
//   token: InjectionToken<T>,
// ): ParameterDecorator & PropertyDecorator {
//   return function (
//     target: any,
//     propertyKey?: string | symbol,
//     parameterIndex?: number,
//   ) {
//     // 获取现有注入元数据
//     const injections: InjectMetadata[] =
//       Reflect.getMetadata(METADATA_KEY.INJECT, target) || [];

//     if (parameterIndex !== undefined) {
//       // 构造函数参数注入
//       injections.push({ token, propertyKey: undefined });
//     } else if (propertyKey) {
//       // 属性注入
//       injections.push({ token, propertyKey: propertyKey.toString() });
//     }

//     // 保存注入元数据
//     Reflect.defineMetadata(METADATA_KEY.INJECT, injections, target);
//   };
// }

// /**
//  * 热键装饰器
//  * @param combinations 热键组合（支持单个或多个）
//  * @param options 热键配置
//  */
// export function Hotkey(
//   combinations: HotkeyCombination,
//   options: HotkeyOptions = {},
// ): MethodDecorator {
//   return function (
//     target: any,
//     methodKey: string | symbol,
//     descriptor: PropertyDescriptor,
//   ) {
//     const originalMethod = descriptor.value;

//     // 包装后的热键处理函数
//     const handler: KeyHandler = (
//       event: KeyboardEvent,
//       handler: HotkeysEvent,
//     ) => {
//       // 应用配置
//       if (options.preventDefault) event.preventDefault();
//       if (options.stopPropagation) event.stopPropagation();

//       // 执行原始方法（绑定实例上下文）
//       return originalMethod.call(target, event, handler);
//     };

//     // 获取类的热键元数据
//     const hotkeysMetadata: HotkeyMetadata[] =
//       Reflect.getMetadata(METADATA_KEY.HOTKEY, target.constructor) || [];

//     // 添加新的热键元数据
//     hotkeysMetadata.push({
//       combinations,
//       options,
//       methodKey: methodKey.toString(),
//     });

//     // 保存热键元数据
//     Reflect.defineMetadata(
//       METADATA_KEY.HOTKEY,
//       hotkeysMetadata,
//       target.constructor,
//     );

//     // 替换原始方法为包装后的处理函数
//     descriptor.value = handler;

//     return descriptor;
//   };
// }

// // ========================== 热键管理器 ==========================
// export class HotkeyManager {
//   private static initialized = false;

//   /**
//    * 初始化热键系统
//    * 自动注册所有带有 @Hotkey 装饰器的类
//    */
//   static init(): void {
//     if (this.initialized) return;

//     // 注册全局作用域（默认）
//     hotkeys.setScope('global');

//     this.initialized = true;
//   }

//   /**
//    * 注册指定类的热键
//    * @param target 类构造函数
//    */
//   static registerHotkeys<T>(target: new (...args: any[]) => T): void {
//     const instance = container.get(target);
//     const hotkeysMetadata =
//       (Reflect.getMetadata(METADATA_KEY.HOTKEY, target) as HotkeyMetadata[]) ||
//       [];

//     hotkeysMetadata.forEach(({ combinations, options, methodKey }) => {
//       const handler = (instance as any)[methodKey] as KeyHandler;
//       const scope = options.scope || 'global';

//       // 注册热键
//       hotkeys(combinations, { scope }, handler);
//     });
//   }

//   /**
//    * 注销指定类的热键
//    * @param target 类构造函数
//    */
//   static unregisterHotkeys<T>(target: new (...args: any[]) => T): void {
//     const hotkeysMetadata =
//       (Reflect.getMetadata(METADATA_KEY.HOTKEY, target) as HotkeyMetadata[]) ||
//       [];

//     hotkeysMetadata.forEach(({ combinations, options }) => {
//       const scope = options.scope || 'global';
//       hotkeys.unbind(combinations, scope);
//     });
//   }

//   /**
//    * 切换热键作用域
//    * @param scope 目标作用域
//    */
//   static setScope(scope: HotkeyScope): void {
//     hotkeys.setScope(scope.toString());
//   }

//   /**
//    * 禁用所有热键
//    */
//   static disableAll(): void {
//     hotkeys.disable();
//   }

//   /**
//    * 启用所有热键
//    */
//   static enableAll(): void {
//     hotkeys.enable();
//   }

//   /**
//    * 获取所有注册的热键信息
//    */
//   static getHotkeyInfo(): Array<{
//     combinations: HotkeyCombination;
//     scope: HotkeyScope;
//     description?: string;
//     group?: string;
//   }> {
//     const result: Array<{
//       combinations: HotkeyCombination;
//       scope: HotkeyScope;
//       description?: string;
//       group?: string;
//     }> = [];

//     // 遍历所有类的热键元数据
//     const allMetadata = Reflect.getMetadataKeys(Reflect)
//       .map((key) => Reflect.getMetadata(key, Reflect))
//       .filter(
//         (metadata) =>
//           Array.isArray(metadata) &&
//           metadata.length > 0 &&
//           'combinations' in metadata[0],
//       );

//     (allMetadata as HotkeyMetadata[][]).forEach((metadataList) => {
//       metadataList.forEach((metadata) => {
//         result.push({
//           combinations: metadata.combinations,
//           scope: metadata.options.scope || 'global',
//           description: metadata.options.description,
//           group: metadata.options.group,
//         });
//       });
//     });

//     return result;
//   }
// }

// // ========================== 使用示例 ==========================
// // 1. 定义服务（可注入依赖）
// class LoggerService {
//   log(message: string): void {
//     console.log(`[Hotkey] ${message}`);
//   }
// }

// // 2. 注册服务到容器
// container.provide(LoggerService, LoggerService);

// // 3. 热键处理类（使用装饰器）
// class EditorHotkeys {
//   // 属性注入
//   @Inject(LoggerService)
//   private logger!: LoggerService;

//   // 构造函数注入（可选）
//   constructor(@Inject(LoggerService) private anotherLogger: LoggerService) {}

//   // 注册单个热键
//   @Hotkey('ctrl+s', {
//     description: '保存文件',
//     group: '编辑操作',
//     preventDefault: true,
//   })
//   handleSave(event: KeyboardEvent) {
//     this.logger.log('触发保存操作');
//     // 执行保存逻辑...
//   }

//   // 注册多个热键
//   @Hotkey(['ctrl+z', 'cmd+z'], {
//     description: '撤销操作',
//     group: '编辑操作',
//     preventDefault: true,
//   })
//   handleUndo(event: KeyboardEvent, handler: HotkeysEvent) {
//     this.anotherLogger.log(`触发撤销操作，按键: ${handler.key}`);
//     // 执行撤销逻辑...
//   }

//   // 带作用域的热键
//   @Hotkey('ctrl+b', {
//     scope: 'textEditor',
//     description: '加粗文本',
//     group: '格式操作',
//     preventDefault: true,
//   })
//   handleBold() {
//     this.logger.log('触发加粗操作（仅文本编辑器中生效）');
//     // 执行加粗逻辑...
//   }
// }

// // 4. 初始化并使用
// function bootstrap() {
//   // 初始化热键系统
//   HotkeyManager.init();

//   // 注册热键处理类
//   HotkeyManager.registerHotkeys(EditorHotkeys);

//   // 切换作用域（示例）
//   setTimeout(() => {
//     HotkeyManager.setScope('textEditor');
//     console.log('热键作用域切换到：textEditor');
//   }, 3000);

//   // 打印所有热键信息
//   console.log('已注册热键：', HotkeyManager.getHotkeyInfo());
// }

// // 启动应用
// bootstrap();
