// 为装饰器添加明确的类型定义，指定为方法装饰器
function log(target: any, propertyKey: string, descriptor: PropertyDescriptor): PropertyDescriptor {
  // 保存原始方法的引用
  const originalMethod = descriptor.value;

  // 重写方法
  descriptor.value = function (...args: any[]) {
    // 执行前打印方法名称
    console.log(`[LOG] 方法 ${propertyKey} 开始执行`);

    // 调用原始方法并保存返回值
    const result = originalMethod.apply(this, args);

    // 执行后打印方法名称
    console.log(`[LOG] 方法 ${propertyKey} 执行结束`);

    // 返回原始方法的返回值
    return result;
  };

  return descriptor;
}

// 使用示例
class ExampleClass {
  @log
  doSomething() {
    console.log('正在执行实际操作...');
  }

  @log
  calculate(a: number, b: number): number {
    return a + b;
  }
}

// 测试装饰器效果
const instance = new ExampleClass();
instance.doSomething();
console.log('计算结果:', instance.calculate(2, 3));
