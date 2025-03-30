/*
 * @Author: weiaodi 1635654853@qq.com
 * @Date: 2025-03-26 14:45:01
 * @LastEditors: weiaodi 1635654853@qq.com
 * @LastEditTime: 2025-03-30 19:17:02
 * @FilePath: /FontTech_monoRepo/packages/algo/interview/palindrome.js
 *
 */
let a = '1121';

function palindromeCheck(str) {
  let left = 0;
  let right = str.length - 1;
  while (left < right) {
    if (str[left] != str[right]) {
      return false;
    }
    left++;
    right--;
  }
  return true;
}

palindromeCheck(a);
console.log('🚀 ~ palindromeCheck(a):', palindromeCheck(a));
// 拓展
// 快速比较两个数组是否相等
function isEuqalArr(arr1, arr2) {
  return arr1.length === arr2.length && arr1.every((item, index) => item === arr2[index]);
}
isEuqalArr([1, 2], [1, 2]);
console.log('🚀 ~ isEuqalArr([1, 2], [1, 2]);:', isEuqalArr([1, 2], [1, 2]));
