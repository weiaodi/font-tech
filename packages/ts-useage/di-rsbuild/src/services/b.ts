class UserService {
  // 实例方法
  getUser(id: string): { id: string; name: string } {
    return { id, name: '张三' };
  }

  // 实例方法（带参数默认值）
  getUserList(page = 1, size = 10): string[] {
    return [`用户列表-${page}-${size}`];
  }

  // 私有实例方法（ES6 私有语法，不可直接访问）
  #privateMethod() {
    console.log('私有方法');
  }
}

/**
 * 获取类的所有公开实例方法（不实例化）
 * @param clazz 类构造函数
 * @returns 方法名 -> 方法函数的映射
 */
function getInstanceMethods<T extends new (...args: any[]) => any>(
  clazz: T,
): Record<string, Function> {
  const methods: Record<string, Function> = {};

  // 遍历类的原型（排除 Object 原型的方法，如 toString）
  const prototype = clazz.prototype;
  const propertyNames = Object.getOwnPropertyNames(prototype);

  for (const name of propertyNames) {
    // 排除构造函数（prototype.constructor 是类本身）
    if (name === 'constructor') continue;

    // 获取属性描述符（判断是否是函数）
    const descriptor = Object.getOwnPropertyDescriptor(prototype, name);
    if (descriptor?.value instanceof Function) {
      methods[name] = descriptor.value;
    }
  }

  return methods;
}

// 调用：不实例化 UserService，直接获取实例方法
const instanceMethods = getInstanceMethods(UserService);
console.log(instanceMethods);
// 输出：
// {
//   getUser: [Function: getUser],
//   getUserList: [Function: getUserList]
// }（私有方法 #privateMethod 未被获取）

// 直接调用实例方法（需手动绑定 this，因无实例）
const getUser = instanceMethods.getUser;
const user = getUser.call({}, '123'); // 绑定空对象作为 this（方法不依赖实例属性时可用）
console.log(user); // 输出：{ id: '123', name: '张三' }
