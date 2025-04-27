/*
 * @lc app=leetcode.cn id=80 lang=javascript
 *
 * [80] 删除有序数组中的重复项 II
 */

// @lc code=start
/**
 * @param {number[]} nums
 * @return {number}
 */
let removeDuplicates = function (nums) {
  if (nums.length <= 2) {
    return nums.length;
  }
  let slow = 0;
  for (let fast = 1; fast < nums.length; fast++) {
    if (nums[fast] !== nums[slow]) {
      slow++;
      nums[slow] = nums[fast];
    } else {
      slow++;
      nums[slow] = nums[fast];
      while (nums[slow] === nums[fast + 1]) {
        fast += 1;
      }
    }
  }

  return slow + 1;
};
// @lc code=end
