/*
 * @lc app=leetcode.cn id=1 lang=javascript
 *
 * [1] 两数之和
 */

// @lc code=start
/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
let twoSum = function (nums, target) {
  let cacheTable = {};
  for (let i = 0; i < nums.length; i++) {
    // 先判断是否存在一对数值之和满足目标值
    if (cacheTable[target - nums[i]] !== undefined) {
      return [cacheTable[target - nums[i]], i];
    }
    cacheTable[nums[i]] = i;
  }
};
// @lc code=end
