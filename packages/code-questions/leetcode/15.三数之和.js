/*
 * @lc app=leetcode.cn id=15 lang=javascript
 *
 * [15] 三数之和
 */

// @lc code=start
/**
 * @param {number[]} nums
 * @return {number[][]}
 */
let threeSum = function (nums) {
  let result = [];
  nums.sort((a, b) => a - b);
  let n = nums.length;
  //
  for (let index = 0; index < n - 2; index++) {
    if (nums[index] > 0) {
      break;
    }
    if (index > 0 && nums[index] === nums[index - 1]) {
      continue;
    }
    let left = index + 1,
      right = n - 1;
    while (left < right) {
      let sum = nums[index] + nums[left] + nums[right];
      if (sum === 0) {
        result.push([nums[index], nums[left], nums[right]]);
        // 可能存在多种组合符合
        while (left < right && nums[left] === nums[left + 1]) left++;

        while (left < right && nums[right] === nums[right - 1]) right--;
        // 移动指针
        left++;
        right--;
      } else if (sum < 0) {
        left++;
      } else {
        right--;
      }
    }
  }
  return result;
};
// @lc code=end
