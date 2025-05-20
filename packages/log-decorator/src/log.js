// 定义一个简单的装饰器
export function log(target, name, descriptor) {
  const originalMethod = descriptor.value;
  descriptor.value = function (...args) {
    console.log(`调用方法 ${name}，参数: ${JSON.stringify(args)}`);
    const result = originalMethod.apply(this, args);
    console.log(`方法 ${name} 返回值: ${JSON.stringify(result)}`);
    return result;
  };
  return descriptor;
}
