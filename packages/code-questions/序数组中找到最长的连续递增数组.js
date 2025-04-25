// 在一个乱序数组中找到最长的连续递增数组
// 输入：[10, 1, 3, 4, 7, 6, 20, 5, 13, 23, 14]
// 输出：[3, 4, 5, 6, 7]
// （不能使用 sort 等排序）
//
function demo(nums) {
  const arrs = new Set(nums);
  let longestSubArrs = [];
  for (const element of arrs) {
    let curElement = element;
    let curArrs = [curElement];
    while (arrs.has(curElement + 1)) {
      curArrs.push(curElement + 1);
      curElement += 1;
    }
    longestSubArrs = longestSubArrs.length > curArrs.length ? longestSubArrs : curArrs;
  }
  return longestSubArrs;
}

demo([10, 1, 3, 4, 7, 6, 20, 5, 13, 23, 14]);
console.log('🚀 ~ demo([10, 1, 3, 4, 7, 6, 20, 5, 13, 23, 14]):', demo([10, 1, 3, 4, 7, 6, 20, 5, 13, 23, 14]));
