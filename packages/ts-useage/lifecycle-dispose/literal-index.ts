// 提取类中所有方法名（排除dispose方法）
type ClassMethodNames<T> = {
  [K in keyof T]: T[K] extends (...args: any[]) => any
    ? K extends 'dispose'
      ? never // 排除dispose方法
      : K // 保留其他方法
    : never;
}[keyof T];

/**
 * @description: 控制类字面量中dispose方法的访问方式
 * @param {T} target 类字面量对象
 * @param {boolean} shouldDispose 是否为单例模式
 * @param {ClassMethodNames<T>} accessMethodName 访问方法名
 * @return {T} 处理后的类字面量
 */
export function applyDisposeControl<T extends { dispose: () => any }>(
  target: T,
  shouldDispose: boolean,
  accessMethodName: ClassMethodNames<T>,
): T {
  // 检查dispose方法是否存在
  if (typeof target.dispose !== 'function') {
    throw new Error('目标对象必须包含dispose方法');
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
  if (shouldDispose) {
    (target as any)[accessMethodName] = function (...args: any[]) {
      // 先调用dispose方法
      this.dispose();
      // 再执行原始访问方法
      return originalAccessMethod.apply(this, args);
    };
  }

  return target;
}

// 使用示例：
// 定义类字面量
const MyClassLiteral = {
  dispose() {
    console.log('执行dispose');
  },
  doSomething() {
    console.log('执行doSomething');
  },
  anotherMethod() {
    console.log('执行anotherMethod');
  },
};

// 应用dispose控制
const ControlledClass = applyDisposeControl(MyClassLiteral, true, 'doSomething');
console.log('🚀 ~ ControlledClass:', ControlledClass);

// 使用
ControlledClass.doSomething();
ControlledClass.anotherMethod();
