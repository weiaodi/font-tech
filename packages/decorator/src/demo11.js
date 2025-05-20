import { objTranslate, subtract } from '@mono/rollup';

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
objTranslate();
subtract(12, 3);
const result = Demo.processData(originalData);
console.log('最终输出:', JSON.stringify(result, null, 2));
