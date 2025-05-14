function deepClone(obj) {
  if (typeof obj !== 'object' || obj === null) return obj;

  // 直接根据类型初始化
  const clone = Array.isArray(obj) ? [] : {};

  // 统一处理属性复制（对象和数组通用）
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      clone[key] = deepClone(obj[key]); // 递归克隆
    }
  }

  return clone;
}

const original = {
  a: 1,
  b: [2, 3],
  c: { d: 4 },
};
const cloned = deepClone(original);
console.log(cloned);
