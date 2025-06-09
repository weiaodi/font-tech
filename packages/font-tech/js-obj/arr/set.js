const set = new Set([1, 2, 3, 4, 5]);
set.add('demo');
console.log('🚀 ~ set:', set, set.has('demo'));
set.delete(1);
console.log('🚀 ~ set:', set.keys(), set.values(), set.entries());
const setA = new Set([1, 2, 3]);
const setB = new Set([3, 4, 5]);

// 并集
const union = new Set([...setA, ...setB]);
console.log([...union]);

// 交集
const intersection = new Set([...setA].filter((x) => setB.has(x)));
console.log([...intersection]);

// 差集
const difference = new Set([...setA].filter((x) => !setB.has(x)));
console.log([...difference]);

// 原始数组
const arr = [1, 2, 2, 3, 4, 4, 5];

// 方法 1: 使用 Set
function uniqueWithSet(arr) {
  return [...new Set(arr)];
}

// 方法 2: 使用 filter 和 indexOf
function uniqueWithFilter(arr) {
  return arr.filter((item, index) => {
    return arr.indexOf(item) === index;
  });
}

// 方法 3: 使用 reduce
function uniqueWithReduce(arr) {
  return arr.reduce((acc, current) => {
    if (!acc.includes(current)) {
      acc.push(current);
    }
    return acc;
  }, []);
}

// 方法 4: 使用 for 循环和临时对象
function uniqueWithForLoop(arr) {
  const uniqueArr = [];
  const seen = {};
  for (let i = 0; i < arr.length; i++) {
    const item = arr[i];
    if (!seen[item]) {
      uniqueArr.push(item);
      seen[item] = true;
    }
  }
  return uniqueArr;
}

// 测试各种去重方法
console.log('使用 Set 去重:', uniqueWithSet(arr));
console.log('使用 filter 和 indexOf 去重:', uniqueWithFilter(arr));
console.log('使用 reduce 去重:', uniqueWithReduce(arr));
console.log('使用 for 循环和临时对象去重:', uniqueWithForLoop(arr));
