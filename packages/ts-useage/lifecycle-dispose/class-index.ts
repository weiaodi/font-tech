// 提取类中所有方法名（排除dispose方法）
type ClassMethodNames<T> = {
  [K in keyof T]: T[K] extends (...args: any[]) => any
    ? K extends 'dispose'
      ? never // 排除dispose方法
      : K // 保留其他方法
    : never;
}[keyof T];
/**
 * @description:控制访问某个方法的方式
 * @param {boolean} isSingleton
 * @param {ClassMethodNames} accessMethodName
 * @return {*}
 */
export function disposeDecorator<T>(isSingleton: boolean, accessMethodName: ClassMethodNames<T>) {
  // 返回实际的装饰器函数，明确只能装饰dispose方法
  return function (
    target: T,
    propertyKey: 'dispose', // 明确只能装饰dispose方法
    descriptor: PropertyDescriptor,
  ): PropertyDescriptor {
    if (propertyKey !== 'dispose') {
      throw new Error('此装饰器只能应用在dispose方法上');
    }

    // 验证访问方法是否存在且不是dispose
    if (typeof target[accessMethodName] !== 'function') {
      throw new Error(`类中不存在名为${String(accessMethodName)}的方法`);
    }
    if (accessMethodName === 'dispose') {
      throw new Error('accessMethodName不能是dispose方法');
    }

    // 保存原始访问方法
    const originalAccessMethod = target[accessMethodName] as (...args: any[]) => any;

    // 如果是单例模式，重写访问方法
    if (isSingleton) {
      (target as any)[accessMethodName] = function (...args: any[]) {
        // 先调用dispose方法
        (this as T & { dispose: () => void }).dispose();
        // 再执行原始访问方法
        return originalAccessMethod.apply(this, args);
      };
    }

    return descriptor;
  };
}
