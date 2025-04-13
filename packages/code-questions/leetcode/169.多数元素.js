/*
 * @lc app=leetcode.cn id=169 lang=javascript
 *
 * [169] 多数元素
 */

// @lc code=start
/**
 * @param {number[]} nums
 * @return {number}
 */
let majorityElement = function (nums) {
  let count = 0;
  let cur;
  for (let i = 0; i < nums.length; i++) {
    if (count === 0 || nums[i] === cur) {
      cur = nums[i];
      count++;
    } else {
      count--;
    }
  }
  return cur;
};

// @lc code=end
