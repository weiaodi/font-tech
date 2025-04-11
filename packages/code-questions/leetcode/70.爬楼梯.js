/*
 * @lc app=leetcode.cn id=70 lang=javascript
 *
 * [70] 爬楼梯
 */

// @lc code=start
/**
 * @param {number} n
 * @return {number}
 */
let climbStairs = function (n) {
  // n = f(n-1)+f(n-2)
  const memo = new Array(n + 1).fill(0);
  function helper(n) {
    if (n === 1) {
      return 1;
    }
    if (n === 2) {
      return 2;
    }
    if (memo[n] > 0) {
      return memo[n];
    }
    memo[n] = helper(n - 1) + helper(n - 2);
    return memo[n];
  }
  return helper(n);
};
// @lc code=end
let climbStairs1 = function (n) {
  // n = f(n-1)+f(n-2)
  if (n === 1) {
    return 1;
  }
  if (n === 2) {
    return 2;
  }
  let preTwoStep = 1,
    preStep = 2;
  for (let i = 3; i < n.length; i++) {
    let step = preTwoStep + preStep;
    preStep = preTwoStep;
    preTwoStep = step;
  }
  return preTwoStep + preStep;
};
