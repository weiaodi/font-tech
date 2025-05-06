/*
 * @lc app=leetcode.cn id=46 lang=javascript
 *
 * [46] 全排列
 */

// @lc code=start
/**
 * @param {number[]} nums
 * @return {number[][]}
 */
let permute = function (nums) {
  let res = [];
  let used = new Array(nums.length).fill(false);
  function backTrack(path) {
    if (path.length === nums.length) {
      res.push([...path]);
      return;
    }
    // 1  23
    for (let i = 0; i < nums.length; i++) {
      if (used[i]) {
        continue;
      }
      used[i] = true;
      path.push(nums[i]);
      backTrack(path);
      path.pop();
      used[i] = false;
    }
  }
  backTrack([]);
  return res;
};
// @lc code=end
