import { objTranslate } from 'log-decorator';
// 定义一个使用装饰器的函数
class ApiService {
  @objTranslate({ resTranslate: true, paramsTranslate: true })
  fetchUserInfo(params) {
    console.log('传参', params);
    // 模拟API请求，返回下划线格式的数据
    return {
      user_id: 123,
      user_name: 'john_doe',
      created_at: '2023-01-01',
      profile: {
        first_name: 'John',
        last_name: 'Doe',
        email_address: 'john@example.com',
      },
    };
  }
}

// 调用装饰后的函数
const api = new ApiService();
const result = api.fetchUserInfo({
  userId: 123, // 传入驼峰格式的参数
  includeProfile: true,
});

// 输出结果（自动转换为驼峰格式）
console.log(result);
/*
{
  userId: 123,
  userName: 'john_doe',
  createdAt: '2023-01-01',
  profile: {
    firstName: 'John',
    lastName: 'Doe',
    emailAddress: 'john@example.com'
  }
}
*/
