// 提取类中所有方法名（排除dispose方法）
type ClassMethodNames<T> = {
  [K in keyof T]: T[K] extends (...args: any[]) => any
    ? K extends 'dispose'
      ? never // 排除dispose方法
      : K // 保留其他方法
    : never;
}[keyof T];

// 装饰器工厂，严格约束参数类型
function disposeDecorator<T>(isSingleton: boolean, accessMethodName: ClassMethodNames<T>) {
  // 返回实际的装饰器函数，明确只能装饰dispose方法
  return function (target: T, propertyKey: string, descriptor: PropertyDescriptor): PropertyDescriptor {
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

// 使用示例
class ResourceManager {
  private resource: string | null;

  constructor() {
    this.resource = '初始化资源';
    console.log('资源已创建');
  }

  // 正确用法：应用在dispose方法上，指定类中存在的非dispose方法
  @disposeDecorator<ResourceManager>(true, 'accessResource')
  dispose() {
    console.log('执行dispose - 释放资源');
    this.resource = null;
  }

  // 被拦截的访问方法
  accessResource() {
    console.log('执行accessResource方法');
    return this.resource ? `访问资源: ${this.resource}` : '资源已被释放';
  }

  // 另一个测试方法
  queryStatus() {
    console.log('执行queryStatus方法');
    return `资源状态: ${this.resource ? '存在' : '已释放'}`;
  }
}

// 测试
const manager = new ResourceManager();
console.log(manager.accessResource()); // 先调用dispose，再执行本身
console.log(manager.accessResource()); // 再次调用，依然先执行dispose
console.log(manager.queryStatus()); // 未被装饰，不受影响
