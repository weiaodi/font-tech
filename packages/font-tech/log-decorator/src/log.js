/*
 * @Author: weiaodi weiaodi@kuaishou.com
 * @Date: 2025-07-03 16:23:07
 * @LastEditors: weiaodi weiaodi@kuaishou.com
 * @LastEditTime: 2025-07-04 10:42:13
 * @FilePath: /font-tech/packages/font-tech/log-decorator/src/log.js
 *
 */
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
