import { objectHumpToLine, lineToCamel } from './utils';
// 定义装饰器

export function objTranslate({ resTranslate = true, paramsTranslate = true }) {
  return function (target, name, descriptor) {
    const originalMethod = descriptor.value;
    descriptor.value = function (...args) {
      // 转换请求参数（如果启用）
      const translatedArgs = paramsTranslate ? args.map((arg) => objectHumpToLine(arg)) : args;

      // 执行原函数
      const result = originalMethod.apply(this, translatedArgs);

      // 转换返回结果（如果启用）
      return resTranslate ? lineToCamel(result) : result;
    };
    return descriptor;
  };
}

export const subtract = (a, b) => a - b; // 未使用的导出
