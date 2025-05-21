/*
 * @lc app=leetcode.cn id=27 lang=javascript
 *
 * [27] 移除元素
 */

// @lc code=start
/**
 * @param {number[]} nums
 * @param {number} val
 * @return {number}
 */
let removeElement = function (nums, val) {
  let k = 0;
  for (let fast = 0; fast < nums.length; fast++) {
    if (nums[fast] === val) {
      continue;
    }
    [nums[k], nums[fast]] = [nums[fast], nums[k]];
    k++;
  }
  return k;
};
// @lc code=end
