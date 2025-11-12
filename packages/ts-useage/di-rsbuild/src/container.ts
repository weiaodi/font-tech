import {
  METADATA_KEY,
  type HotkeyCombination,
  type HotkeyMetadata,
  type HotkeyOptions,
  type InjectionToken,
  type InjectMetadata,
} from './interfaces';
import type { KeyBindingOptions } from './tinykeys/tinykeys';

function isClassConstructor(
  target: unknown,
): target is new (...args: any[]) => any {
  // 类构造函数的特征：typeof 为 function + 有 prototype 属性
  return typeof target === 'function' && !!target.prototype;
}

/**
 * 显式标记类为“可注入服务”
 * 可选配置：提供自定义注入令牌（默认用类本身作为令牌）
 */
export function Injectable(
  options: { token?: InjectionToken } = {},
): ClassDecorator {
  return function (target: Function) {
    if (!isClassConstructor(target)) {
      throw new Error(
        `[DI] @Injectable 仅支持装饰类，当前目标类型：${typeof target}`,
      );
    }

    const token = options.token || target;

    Reflect.defineMetadata(
      METADATA_KEY.INJECTABLE,
      {
        isInjectable: true,
        token,
        target: target.name,
        registeredAt: new Date().toISOString(),
      },
      target,
    );

    Container.getInstance().provide(
      token,
      target as new (...args: any[]) => any,
    );
  };
}

/**
 * 注入装饰器
 * @param token 注入令牌
 */
export function Inject<T>(
  token: InjectionToken<T>,
): ParameterDecorator & PropertyDecorator {
  return function (
    target: any,
    propertyKey?: string | symbol,
    parameterIndex?: number,
  ) {
    // 属性注入和构造注入，都应该将元数据放在类本身
    const actualTarget =
      parameterIndex !== undefined ? target : target.constructor;

    const injections: InjectMetadata[] =
      Reflect.getMetadata(METADATA_KEY.INJECT, actualTarget) || [];

    if (parameterIndex !== undefined) {
      // 构造函数参数注入
      injections.push({ token, propertyKey: undefined, parameterIndex });
    } else if (propertyKey) {
      // 属性注入
      injections.push({ token, propertyKey });
    }

    // 保存注入元数据
    Reflect.defineMetadata(METADATA_KEY.INJECT, injections, actualTarget);
  };
}

/**
 * 热键装饰器
 * @param combinations 热键组合（支持单个或多个）
 * @param options 热键配置
 */
export function Hotkey(
  combinations: HotkeyCombination,
  options: KeyBindingOptions = {},
): MethodDecorator {
  return function (
    target: any,
    methodKey: string | symbol,
    descriptor: PropertyDescriptor,
  ) {
    // 获取类的热键元数据
    const hotkeysMetadata: HotkeyMetadata[] =
      Reflect.getMetadata(METADATA_KEY.HOTKEY, target.constructor) || [];

    // 添加新的热键元数据
    hotkeysMetadata.push({
      combinations,
      options,
      methodKey: methodKey.toString(),
    });

    // 保存热键元数据
    Reflect.defineMetadata(
      METADATA_KEY.HOTKEY,
      hotkeysMetadata,
      target.constructor,
    );

    return descriptor;
  };
}

export class Container {
  private providers = new Map<InjectionToken, any>(); // 存储注册的提供者（类/工厂函数）
  private instances = new Map<InjectionToken, any>(); // 单例实例缓存
  private static instance: Container; // 静态变量存储单例

  public static getInstance(): Container {
    if (!Container.instance) {
      Container.instance = new Container();
    }
    return Container.instance;
  }

  /**
   * 注册提供者
   * @param token 注入令牌（唯一标识）
   * @param provider 提供者（类构造函数 或 工厂函数）
   */
  provide<T>(
    token: InjectionToken<T>,
    provider: new (...args: any[]) => T | ((container: Container) => T),
  ): void {
    if (this.providers.has(token)) {
      throw new Error(`令牌 ${String(token)} 已注册`);
    }
    this.providers.set(token, provider);
  }

  /**
   * 获取实例（自动解析依赖，单例缓存）
   * @param token 注入令牌
   * @returns 已注入依赖的实例
   */
  get<T>(token: InjectionToken<T>): T {
    if (this.instances.has(token)) {
      return this.instances.get(token) as T;
    }

    const provider = this.providers.get(token);
    if (!provider) {
      throw new Error(` 未找到令牌 ${String(token)}`);
    }

    const instance = this.isClassProvider(provider)
      ? this.createClassInstance(provider as new (...args: any[]) => T)
      : this.executeFactoryProvider(provider as (container: Container) => T);

    this.instances.set(token, instance);
    return instance as T;
  }

  reset(): void {
    this.providers.clear();
    this.instances.clear();
  }

  private isClassProvider(
    provider: any,
  ): provider is new (...args: any[]) => any {
    return (
      typeof provider === 'function' &&
      !!provider.prototype &&
      provider.prototype.constructor === provider
    );
  }

  /**
   * 创建实例并注入所有依赖（构造函数+属性）
   */
  private createClassInstance<T>(Clazz: new (...args: any[]) => T): T {
    this.validateInjectable(Clazz);

    // 读取注入元数据（构造函数+属性注入）
    const injections = this.getInjectMetadata(Clazz);

    const constructorArgs = this.resolveConstructorDependencies(injections);

    const instance = new Clazz(...constructorArgs);

    this.injectProperties(instance, injections);

    return instance;
  }

  /**
   * 工厂函数提供者：执行工厂函数获取实例
   */
  private executeFactoryProvider<T>(factory: (container: Container) => T): T {
    try {
      return factory(this);
    } catch (error) {
      throw new Error(`工厂函数执行失败：${(error as Error).message}`);
    }
  }

  /**
   * 校验类是否标记 @Injectable()
   */
  private validateInjectable(Clazz: new (...args: any[]) => any): void {
    const isInjectable = Reflect.getMetadata(METADATA_KEY.INJECTABLE, Clazz);
    if (!isInjectable) {
      throw new Error(`${Clazz.name} 未标记 @Injectable()`);
    }
  }

  /**
   * 获取类的注入元数据（从类本身读取，统一存储目标）
   */
  private getInjectMetadata(
    Clazz: new (...args: any[]) => any,
  ): InjectMetadata[] {
    return Reflect.getMetadata(METADATA_KEY.INJECT, Clazz) || [];
  }

  /**
   * 解析构造函数依赖（筛选+排序+递归获取实例）
   */
  private resolveConstructorDependencies(injections: InjectMetadata[]): any[] {
    return injections
      .filter((dep) => dep.parameterIndex !== undefined) // 只保留构造函数注入
      .sort((a, b) => a.parameterIndex! - b.parameterIndex!) // 按参数顺序排序（0→1→2...）
      .map((dep) => this.get(dep.token));
  }

  /**
   * 处理属性注入（给实例的私有/公有属性赋值）
   */
  private injectProperties(instance: any, injections: InjectMetadata[]): void {
    const propertyInjections = injections.filter(
      (dep) => dep.propertyKey !== undefined,
    );

    propertyInjections.forEach(({ token, propertyKey }) => {
      if (!propertyKey) return;
      const propInstance = this.get(token);
      (instance as any)[propertyKey] = propInstance;

      console.log(
        '🚀 ~ Container ~ createClassInstance ~ constructorArgs:',
        (instance as any)[propertyKey],
      );
    });
  }
}
