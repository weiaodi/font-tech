// 定义装饰器
function objTranslate({ resTranslate = true, paramsTranslate = true }) {
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

// 模拟转换函数
function objectHumpToLine(data) {
  return JSON.parse(
    JSON.stringify(data).replace(/"([a-z])([A-Z])"/g, (match, p1, p2) => `"${p1}_${p2.toLowerCase()}"`),
  );
}

function lineToCamel(data) {
  return JSON.parse(
    JSON.stringify(data).replace(/"([a-z])_([a-z])"/g, (match, p1, p2) => `"${p1}${p2.toUpperCase()}"`),
  );
}

// 使用装饰器的示例函数
class Demo {
  @objTranslate({ resTranslate: true, paramsTranslate: true })
  static processData(input) {
    console.log('处理中的数据:', JSON.stringify(input, null, 2));
    return {
      user_id: input.user_id,
      full_name: input.full_name,
      contact_info: {
        email_address: input.email_address,
      },
    };
  }
}

// 测试调用
const originalData = {
  userId: 123,
  fullName: 'Alice Smith',
  emailAddress: 'alice@example.com',
};

console.log('原始输入:', JSON.stringify(originalData, null, 2));

const result = Demo.processData(originalData);
console.log('最终输出:', JSON.stringify(result, null, 2));
