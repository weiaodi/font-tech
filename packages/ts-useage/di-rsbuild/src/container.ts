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

    container.provide(token, target as new (...args: any[]) => any);
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
    // 获取现有注入元数据
    const injections: InjectMetadata[] =
      Reflect.getMetadata(METADATA_KEY.INJECT, target) || [];

    if (parameterIndex !== undefined) {
      // 构造函数参数注入
      injections.push({ token, propertyKey: undefined, parameterIndex });
    } else if (propertyKey) {
      // 属性注入
      injections.push({ token, propertyKey });
    }

    // 保存注入元数据
    Reflect.defineMetadata(METADATA_KEY.INJECT, injections, target);
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
    // const originalMethod = descriptor.value;

    // // 包装后的热键处理函数
    // const handler: KeyHandler = (
    //   event: KeyboardEvent,
    //   handler: HotkeysEvent,
    // ) => {
    //   // 执行原始方法（绑定实例上下文）
    //   return originalMethod.call(target, event, handler);
    // };

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

    // // 替换原始方法为包装后的处理函数
    // descriptor.value = originalMethod;

    return descriptor;
  };
}

class Container {
  private providers = new Map<InjectionToken, any>();
  private instances = new Map<InjectionToken, any>();

  /**
   * 注册提供者
   * @param token 注入令牌
   * @param provider 提供者（类或工厂函数）
   */
  provide<T>(
    token: InjectionToken<T>,
    provider: new (...args: any[]) => T | ((container: Container) => T),
  ): void {
    this.providers.set(token, provider);
  }

  /**
   * 获取实例
   * @param token 注入令牌
   */
  get<T>(token: InjectionToken<T>): T {
    // 从缓存获取实例
    if (this.instances.has(token)) {
      return this.instances.get(token);
    }

    const provider = this.providers.get(token);
    if (!provider) {
      throw new Error(
        `No provider found for token: ${String(token)}（未注册为可注入服务）`,
      );
    }

    // 校验：如果提供者是类，必须被 @Injectable() 标记
    if (
      typeof provider === 'function'
      && provider.prototype?.constructor === provider
    ) {
      const isInjectable = Reflect.getMetadata(
        METADATA_KEY.INJECTABLE,
        provider,
      );
      if (!isInjectable) {
        throw new Error(
          `Class ${provider.name} is not marked as @Injectable()（未标记为可注入服务）`,
        );
      }
    }

    let instance: T;
    if (
      typeof provider === 'function'
      && provider.prototype?.constructor === provider
    ) {
      // 类提供者：解析构造函数依赖
      const dependencies =
        (Reflect.getMetadata(METADATA_KEY.INJECT, provider) as InjectMetadata[])
        || [];

      // 优先处理构造函数注入
      const injectArgsInstance = dependencies
        .sort((a, b) => (a.propertyKey ? 1 : -1))
        .map((dep) => this.get(dep.token));

      instance = new (provider as new (...args: any[]) => T)(
        ...injectArgsInstance,
      );

      // 处理属性注入
      const propertyInjections = dependencies.filter((dep) => dep.propertyKey);
      propertyInjections.forEach(({ token, propertyKey }) => {
        (instance as any)[propertyKey!] = this.get(token);
      });
    } else if (typeof provider === 'function') {
      // 工厂函数提供者
      instance = (provider as (container: Container) => T)(this);
    } else {
      throw new Error(`Invalid provider type for token: ${String(token)}`);
    }

    this.instances.set(token, provider);
    return instance;
  }

  reset(): void {
    this.providers.clear();
    this.instances.clear();
  }
}

// 全局容器单例
export const container = new Container();
