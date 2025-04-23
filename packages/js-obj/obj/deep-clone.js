function deepClone(obj) {
  // 非对象的情况 | 数组的情况和对象的情况
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }
  let clone = {};
  if (Array.isArray(obj)) {
    clone = [];
    obj.forEach((element) => {
      clone.push(deepClone(element));
    });
  } else {
    clone = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        clone[key] = obj[key];
      }
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
