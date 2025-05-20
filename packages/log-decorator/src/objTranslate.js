/**
 * 对象键名格式转换工具
 * 支持驼峰(camelCase)与下划线(snake_case)格式相互转换
 */

// 工具函数：驼峰转下划线
export function objectHumpToLine(data) {
  if (typeof data !== 'object' || data === null) {
    return data;
  }

  if (Array.isArray(data)) {
    return data.map((item) => objectHumpToLine(item));
  }

  const result = {};
  Object.keys(data).forEach((key) => {
    const newKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
    result[newKey] = objectHumpToLine(data[key]);
  });
  return result;
}

// 工具函数：下划线转驼峰
export function lineToCamel(data) {
  if (typeof data !== 'object' || data === null) {
    return data;
  }

  if (Array.isArray(data)) {
    return data.map((item) => lineToCamel(item));
  }

  const result = {};
  Object.keys(data).forEach((key) => {
    const newKey = key.replace(/_([a-z])/g, (_, char) => char.toUpperCase());
    result[newKey] = lineToCamel(data[key]);
  });
  return result;
}

// 装饰器：自动转换函数参数和返回值的键名格式
export function objTranslate({ resTranslate = true, paramsTranslate = true }) {
  return function (target, name, descriptor) {
    const originalMethod = descriptor.value;
    descriptor.value = function (...args) {
      // 转换请求参数（深度递归处理）
      const translatedArgs = paramsTranslate ? args.map((arg) => objectHumpToLine(arg)) : args;

      // 执行原函数
      const result = originalMethod.apply(this, translatedArgs);

      // 转换返回结果（深度递归处理）
      return resTranslate ? lineToCamel(result) : result;
    };
    return descriptor;
  };
}
