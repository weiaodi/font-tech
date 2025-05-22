// 目标对象
const target = {
  name: 'Tom',
  age: 28,
  job: 'Engineer',
};

// 处理程序对象，包含各种拦截器
const handler = {
  // get 拦截器，用于拦截属性读取操作
  get(target, property, receiver) {
    console.log(`正在读取属性 "${property}"`);
    if (property in target) {
      return target[property];
    }
    return undefined;
  },
  // set 拦截器，用于拦截属性赋值操作
  set(target, property, value, receiver) {
    console.log(`正在设置属性 "${property}" 为 "${value}"`);
    if (typeof value === 'string') {
      target[property] = value.trim();
    } else {
      target[property] = value;
    }
    return true;
  },
  // deleteProperty 拦截器，用于拦截属性删除操作
  deleteProperty(target, property) {
    console.log(`正在删除属性 "${property}"`);
    if (property in target) {
      delete target[property];
      return true;
    }
    return false;
  },
  // has 拦截器，用于拦截 in 操作符
  has(target, property) {
    console.log(`正在检查属性 "${property}" 是否存在`);
    return property in target;
  },
};

// 创建代理对象
const proxy = new Proxy(target, handler);

// 使用 get 拦截器
console.log(proxy.name);

// 使用 set 拦截器
proxy.job = '  Designer  ';
console.log(proxy.job);

// 使用 deleteProperty 拦截器
delete proxy.age;
console.log(proxy.age);

// 使用 has 拦截器
console.log('job' in proxy);
