function deepClone(obj) {
  // 处理基本数据类型和 null
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }

  let clone;
  if (Array.isArray(obj)) {
    // 处理数组
    clone = [];
    for (let i = 0; i < obj.length; i++) {
      clone[i] = deepClone(obj[i]);
    }
  } else {
    // 处理普通对象
    clone = {};
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        clone[key] = deepClone(obj[key]);
      }
    }
  }
  return clone;
}

function DeepCloneD(obj) {
  // 处理基本数据类型、null 和 undefined
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }

  let cloneObj;
  if (Array.isArray(obj)) {
    // 初始化 cloneObj 为一个空数组
    cloneObj = [];
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        cloneObj[key] = DeepCloneD(obj[key]);
      }
    }
  } else {
    // 初始化 cloneObj 为一个空对象
    cloneObj = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        cloneObj[key] = DeepCloneD(obj[key]);
      }
    }
  }
  return cloneObj;
}

// 测试代码
const original = {
  a: 1,
  b: [2, 3],
  c: { d: 4 },
};
const cloned = deepClone(original);
console.log(cloned);
const cloned1 = DeepCloneD(original);
console.log(cloned1);
