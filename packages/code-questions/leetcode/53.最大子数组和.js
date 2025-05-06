/*
 * @lc app=leetcode.cn id=53 lang=javascript
 *
 * [53] 最大子数组和
 */

// @lc code=start
/**
 * @param {number[]} nums
 * @return {number}
 */
let maxSubArray = function (nums) {
  let preSub = nums[0];
  let curSub = nums[0];
  let res = preSub;
  for (let i = 1; i < nums.length; i++) {
    curSub = Math.max(nums[i], nums[i] + preSub);
    preSub = curSub;
    res = Math.max(curSub, res);
  }
  return res;
};
// @lc code=end
let maxSubArray1 = function (nums) {
  let dp = new Array(nums.length);
  dp[0] = nums[0];
  for (let i = 1; i < nums.length; i++) {
    dp[i] = Math.max(dp[i - 1] + nums[i], nums[i]);
  }
  return Math.max(...dp);
};
