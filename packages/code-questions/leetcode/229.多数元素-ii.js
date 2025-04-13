/*
 * @lc app=leetcode.cn id=229 lang=javascript
 *
 * [229] 多数元素 II
 */

// @lc code=start
/**
 * @param {number[]} nums
 * @return {number[]}
 */
let majorityElement = function (nums) {
  //  最多两个元素为 n/3
  let count1 = 0,
    candidate1;
  let count2 = 0,
    candidate2;

  for (let i = 0; i < nums.length; i++) {
    if (candidate1 === nums[i]) {
      count1++;
    } else if (candidate2 === nums[i]) {
      count2++;
    } else if (count1 === 0) {
      candidate1 = nums[i];
      count1++;
    } else if (count2 === 0) {
      candidate2 = nums[i];
      count2++;
    } else {
      count1--;
      count2--;
    }
  }
  count1 = 0;
  count2 = 0;
  for (const element of nums) {
    if (element === candidate1) {
      count1++;
    }
    if (element === candidate2) {
      count2++;
    }
  }
  const result = [];
  if (count1 > Math.floor(nums.length / 3)) result.push(candidate1);
  if (count2 > Math.floor(nums.length / 3)) result.push(candidate2);

  return result;
};
// @lc code=end
