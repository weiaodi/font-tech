// 方式一：使用 Set 对象
const array = [1, 2, 2, 3, 4, 4, 5];
const uniqueArrayBySet = [...new Set(array)];

console.log('使用 Set 对象去重结果:', uniqueArrayBySet);

// 方式二：使用 filter 方法和 indexOf
const uniqueArrayByFilter = array.filter((val, index, self) => self.indexOf(val) === index);
console.log('使用 filter 和 indexOf 去重结果:', uniqueArrayByFilter);

// 方式三：使用 reduce 方法
const uniqueArrayByReduce = array.reduce((acc, cur) => {
  if (!acc.includes(cur)) {
    acc.push(cur);
  }
  return acc;
}, []);

console.log('使用 reduce 方法去重结果:', uniqueArrayByReduce);

// 方式四：使用 for 循环和新数组
const uniqueArrayByForLoop = [];
for (const element of array) {
  if (uniqueArrayByForLoop.indexOf(element) === -1) {
    uniqueArrayByForLoop.push(element);
  }
}

console.log('使用 for 循环去重结果:', uniqueArrayByForLoop);
