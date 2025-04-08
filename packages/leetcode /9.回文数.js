/*
 * @lc app=leetcode.cn id=9 lang=javascript
 *
 * [9] 回文数
 */

// @lc code=start
/**
 * @param {number} x
 * @return {boolean}
 */
let isPalindrome = function (x) {
  // 前置判断去除明显部分 小于0或者取模运算为0但是他不是0的情况
  if (x < 0 || (x % 10 === 0 && x !== 0)) {
    return false;
  }
  //  翻转后半部分数组,进行判断
  let reversed = 0;
  while (x > reversed) {
    reversed = reversed * 10 + (x % 10);
    x = Math.floor(x / 10);
  }
  //   当为偶数,两者数目相等,当为奇数,翻转数组会比原数组多一个中位数
  return x === reversed || x === Math.floor(reversed / 10);
};
// @lc code=end
