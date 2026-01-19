import {
  METADATA_KEY,
  type HotkeyCombination,
  type HotkeyMetadata,
  type InjectionToken,
  type InjectMetadata
} from '../tokens';
import type { KeyBindingOptions } from '../core';
import { Container } from '../container';
import 'reflect-metadata';

function isClassConstructor(target: unknown): target is new (...args: any[]) => any {
  // 类构造函数的特征：typeof 为 function + 有 prototype 属性
  return typeof target === 'function' && !!target.prototype;
}

/**
 * 显式标记类为“可注入服务”
 * 可选配置：提供自定义注入令牌（默认用类本身作为令牌）
 */
export function Injectable(options: { token?: InjectionToken } = {}): ClassDecorator {
  return function (target: any) {
    if (!isClassConstructor(target)) {
      throw new Error(`[DI] @Injectable 仅支持装饰类，当前目标类型：${typeof target}`);
    }

    const token = options.token || target;

    Reflect.defineMetadata(
      METADATA_KEY.INJECTABLE,
      {
        isInjectable: true,
        token,
        target: target.name,
        registeredAt: new Date().toISOString()
      },
      target
    );

    Container.getInstance().provide(token, target as new (...args: any[]) => any);
  };
}

/**
 * 注入装饰器
 * @param token 注入令牌
 */
export function Inject<T>(token: InjectionToken<T>): ParameterDecorator & PropertyDecorator {
  return function (target: any, propertyKey?: string | symbol, parameterIndex?: number) {
    // 属性注入和构造注入，都应该将元数据放在类本身
    const actualTarget = parameterIndex !== undefined ? target : target.constructor;

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

type HotkeyFn = (event: KeyboardEvent, ...rest: any) => any;
/**
 * 热键装饰器
 * @param combinations 热键组合（支持单个或多个）
 * @param options 热键配置
 */
export function Hotkey(combination: HotkeyCombination, options: KeyBindingOptions = {}) {
  return function <T extends HotkeyFn>(
    target: any,
    methodKey: string | symbol,
    descriptor: TypedPropertyDescriptor<T>
  ) {
    options.currentScope = options.currentScope ?? 'global';
    options.event = options.event ?? 'keydown';
    const hotkeysMetadata: HotkeyMetadata[] =
      Reflect.getMetadata(METADATA_KEY.HOTKEY, target.constructor) || [];

    hotkeysMetadata.push({
      combination,
      options,
      methodKey: methodKey.toString()
    });

    Reflect.defineMetadata(METADATA_KEY.HOTKEY, hotkeysMetadata, target.constructor);

    return descriptor;
  };
}
